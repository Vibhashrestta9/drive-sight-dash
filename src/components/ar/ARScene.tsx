
import React, { useState } from 'react';
import { ZapparCamera } from '@zappar/zappar-react-three-fiber';
import { RMDEDrive } from '@/utils/types/rmdeTypes';
import QRCodeScanner from './QRCodeScanner';
import ARFallbackView from './ARFallbackView';
import ScannedDriveDisplay from './ScannedDriveDisplay';
import { useQRCodeProcessor } from './QRCodeProcessor';
import { useZapparTarget } from '@/hooks/useZapparTarget';
import { useMaintenanceLog } from '@/hooks/useMaintenanceLog';

interface ARSceneProps {
  drives: RMDEDrive[];
}

const ARScene: React.FC<ARSceneProps> = ({ drives }) => {
  // State for QR code scanning
  const [scannedDriveId, setScannedDriveId] = useState<string | null>(null);
  
  // This would be your QR code target file
  const targetFile = "/qr-target.zpt";
  const { targetFileLoaded, errorMessage } = useZapparTarget(targetFile);
  
  // Maintenance log functionality
  const { logServiceActivity } = useMaintenanceLog(drives);
  
  // QR code processing logic - now using the custom hook properly
  const { handleQRFound, isProcessing } = useQRCodeProcessor({ 
    drives, 
    onDriveFound: setScannedDriveId 
  });

  const handleServiceLog = () => {
    if (scannedDriveId) {
      logServiceActivity(scannedDriveId);
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
      
      {/* Use ScannedDriveDisplay for displaying the 3D model */}
      {targetFileLoaded && (
        <ScannedDriveDisplay 
          targetFile={targetFile}
          scannedDrive={scannedDrive}
          onServiceLog={handleServiceLog}
        />
      )}
      
      {/* Fallback display if no QR code is detected */}
      {!scannedDrive && (
        <ARFallbackView isScanning={!isProcessing} />
      )}
    </>
  );
};

export default ARScene;
