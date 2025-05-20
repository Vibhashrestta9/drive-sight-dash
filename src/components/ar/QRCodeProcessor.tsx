
import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RMDEDrive } from '@/utils/types/rmdeTypes';

interface QRCodeProcessorProps {
  drives: RMDEDrive[];
  onDriveFound: (driveId: string) => void;
}

const QRCodeProcessor: React.FC<QRCodeProcessorProps> = ({ drives, onDriveFound }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScannedData, setLastScannedData] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleQRFound = useCallback((data: string) => {
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
            onDriveFound(driveId);
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
            onDriveFound(possibleDriveId);
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
  }, [drives, isProcessing, lastScannedData, onDriveFound, toast]);
  
  return { 
    handleQRFound, 
    errorMessage, 
    isProcessing 
  };
};

export default QRCodeProcessor;
