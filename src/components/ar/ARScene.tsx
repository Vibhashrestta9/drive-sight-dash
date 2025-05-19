
import React, { useEffect, useState } from 'react';
import { ZapparCamera, ImageTracker } from '@zappar/zappar-react-three-fiber';
import { Billboard, Text } from '@react-three/drei';
import { RMDEDrive } from '@/utils/types/rmdeTypes';
import DriveARModel from './DriveARModel';
import QRCodeScanner from './QRCodeScanner';
import ARFallbackView from './ARFallbackView';

interface ARSceneProps {
  drives: RMDEDrive[];
}

const ARScene: React.FC<ARSceneProps> = ({ drives }) => {
  // Use state to track if target file has been loaded
  const [targetFileLoaded, setTargetFileLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scannedDriveId, setScannedDriveId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // This would be your QR code target file
  const targetFile = "/qr-target.zpt";
  
  useEffect(() => {
    // Check if the target file exists
    fetch(targetFile)
      .then(response => {
        if (response.ok) {
          setTargetFileLoaded(true);
        } else {
          console.error("Failed to load target file:", response.statusText);
          setErrorMessage("QR target file could not be loaded");
        }
      })
      .catch(error => {
        console.error("Error loading target file:", error);
        setErrorMessage("Error loading QR target file");
      });
  }, [targetFile]);
  
  const handleQRFound = (data: string) => {
    console.log("QR Code found:", data);
    setIsProcessing(true);
    
    try {
      // Parse the QR code data using our format
      // Expected format: drivesight://drive/[id]/[moduleId]
      if (data.startsWith('drivesight://drive/')) {
        const parts = data.split('/');
        if (parts.length >= 4) {
          const driveId = parts[3];
          setScannedDriveId(driveId);
          console.log("Found drive with ID:", driveId);
        } else {
          setErrorMessage("Invalid QR code format");
        }
      } else {
        // Handle legacy or incorrect format
        try {
          // Try parsing as direct ID
          const possibleDriveId = data.trim();
          const matchingDrive = drives.find(drive => drive.id.toString() === possibleDriveId);
          
          if (matchingDrive) {
            setScannedDriveId(possibleDriveId);
            console.log("Found drive with direct ID:", possibleDriveId);
          } else {
            setErrorMessage("QR code not recognized as a valid drive");
            setTimeout(() => setErrorMessage(null), 3000);
          }
        } catch (e) {
          setErrorMessage("Could not parse QR code data");
          setTimeout(() => setErrorMessage(null), 3000);
        }
      }
    } catch (error) {
      console.error("Error parsing QR data:", error);
      setErrorMessage("Error parsing QR code data");
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Find the drive that matches the scanned QR code
  const scannedDrive = scannedDriveId 
    ? drives.find(drive => drive.id.toString() === scannedDriveId) 
    : null;
  
  if (errorMessage) {
    return <ARFallbackView errorMessage={errorMessage} />;
  }
  
  return (
    <>
      <ZapparCamera makeDefault />
      <directionalLight position={[0, 5, 10]} intensity={1.0} />
      <ambientLight intensity={0.5} />
      
      {/* Use QRCodeScanner component for detecting QR codes */}
      <QRCodeScanner onQRCodeDetected={handleQRFound} />
      
      {/* Use ImageTracker for detecting QR codes */}
      {targetFileLoaded && (
        <ImageTracker
          targetImage={targetFile}
          onNotVisible={() => console.log(`Target not visible`)}
          onNewAnchor={(anchor) => console.log(`New anchor detected`)}
          onVisible={() => console.log(`Target visible`)}
        >
          {scannedDrive ? (
            <DriveARModel drive={scannedDrive} />
          ) : (
            <Billboard position={[0, 0, 0]}>
              <Text color="white" fontSize={0.2}>
                QR Code detected, processing...
              </Text>
            </Billboard>
          )}
        </ImageTracker>
      )}
      
      {/* Fallback display if no QR code is detected */}
      {!scannedDrive && (
        <ARFallbackView isScanning={!isProcessing} />
      )}
    </>
  );
};

export default ARScene;
