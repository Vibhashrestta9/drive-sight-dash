
import React, { useEffect, useState } from 'react';
import { ZapparCamera, ImageTracker } from '@zappar/zappar-react-three-fiber';
import { Billboard, Text } from '@react-three/drei';
import { RMDEDrive } from '@/utils/types/rmdeTypes';
import DriveARModel from './DriveARModel';
import QRCodeScanner from './QRCodeScanner';
import ARFallbackView from './ARFallbackView';
import { useToast } from '@/hooks/use-toast';

interface ARSceneProps {
  drives: RMDEDrive[];
}

const ARScene: React.FC<ARSceneProps> = ({ drives }) => {
  // Use state to track if target file has been loaded
  const [targetFileLoaded, setTargetFileLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scannedDriveId, setScannedDriveId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScannedData, setLastScannedData] = useState<string | null>(null);
  const [maintenanceLog, setMaintenanceLog] = useState<{driveId: string, timestamp: Date}[]>([]);
  const { toast } = useToast();
  
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
    
    // Prevent processing the same QR code repeatedly
    if (data === lastScannedData && isProcessing) {
      console.log("Ignoring duplicate QR scan");
      return;
    }
    
    setLastScannedData(data);
    setIsProcessing(true);
    
    // Show toast to indicate scanning is happening
    toast({
      title: "QR Code Detected",
      description: "Processing QR code data...",
      duration: 2000,
    });
    
    try {
      // Parse the QR code data using our format
      // Expected format: drivesight://drive/[id]/[moduleId]
      if (data.startsWith('drivesight://drive/')) {
        const parts = data.split('/');
        if (parts.length >= 4) {
          const driveId = parts[3];
          const matchingDrive = drives.find(drive => drive.id.toString() === driveId);
          
          if (matchingDrive) {
            setScannedDriveId(driveId);
            console.log("Found drive with ID:", driveId);
            toast({
              title: "Drive Found",
              description: `Displaying ${matchingDrive.name}`,
              duration: 3000,
            });
          } else {
            setErrorMessage(`No drive found with ID: ${driveId}`);
            toast({
              title: "Drive Not Found",
              description: `No drive with ID: ${driveId}`,
              variant: "destructive",
              duration: 3000,
            });
            setTimeout(() => setErrorMessage(null), 3000);
          }
        } else {
          setErrorMessage("Invalid QR code format");
          toast({
            title: "Invalid QR Code",
            description: "QR code format is not valid",
            variant: "destructive",
            duration: 3000,
          });
          setTimeout(() => setErrorMessage(null), 3000);
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
            toast({
              title: "Drive Found",
              description: `Displaying data for ${matchingDrive.name}`,
              duration: 3000,
            });
          } else {
            setErrorMessage("QR code not recognized as a valid drive");
            toast({
              title: "Invalid QR Code",
              description: "QR code not recognized as a valid drive",
              variant: "destructive",
              duration: 3000,
            });
            setTimeout(() => setErrorMessage(null), 3000);
          }
        } catch (e) {
          setErrorMessage("Could not parse QR code data");
          toast({
            title: "Error",
            description: "Could not parse QR code data",
            variant: "destructive",
            duration: 3000,
          });
          setTimeout(() => setErrorMessage(null), 3000);
        }
      }
    } catch (error) {
      console.error("Error parsing QR data:", error);
      setErrorMessage("Error parsing QR code data");
      toast({
        title: "Error",
        description: "Error parsing QR code data",
        variant: "destructive",
        duration: 3000,
      });
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      // Reset processing after a delay to prevent immediate rescanning
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }
  };

  const handleServiceLog = () => {
    if (scannedDriveId) {
      const newLog = {
        driveId: scannedDriveId,
        timestamp: new Date()
      };
      setMaintenanceLog(prev => [...prev, newLog]);
      
      const drive = drives.find(d => d.id.toString() === scannedDriveId);
      toast({
        title: "Maintenance Logged", 
        description: `Service logged for ${drive?.name} at ${newLog.timestamp.toLocaleTimeString()}`,
        duration: 3000
      });
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
            <DriveARModel 
              drive={scannedDrive} 
              onServiceLog={handleServiceLog}
            />
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
