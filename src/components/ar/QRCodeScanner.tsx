
import React, { useEffect, useState } from 'react';

interface QRCodeScannerProps {
  onQRCodeDetected: (data: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onQRCodeDetected }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [deviceHasCamera, setDeviceHasCamera] = useState(true);
  
  useEffect(() => {
    let videoElement: HTMLVideoElement | null = null;
    let scanInterval: NodeJS.Timeout | null = null;
    let stream: MediaStream | null = null;
    
    const startScanning = async () => {
      setIsScanning(true);
      
      // Check if the BarcodeDetector API is available
      if ('BarcodeDetector' in window) {
        try {
          const barcodeDetector = new (window as any).BarcodeDetector({
            formats: ['qr_code']
          });
          
          // Get video stream for scanning
          try {
            stream = await navigator.mediaDevices.getUserMedia({ 
              video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
              } 
            });
            
            // Create video element and set properties
            videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            videoElement.autoplay = true;
            await videoElement.play();
            
            // Wait for video to be ready
            if (videoElement.readyState !== 4) {
              await new Promise((resolve) => {
                if (videoElement) {
                  videoElement.onloadedmetadata = () => {
                    resolve(null);
                  };
                }
              });
            }
            
            console.log("QR scanner: Video stream active, starting detection");
            
            // Periodically detect QR codes in the video stream
            scanInterval = setInterval(async () => {
              if (!videoElement) return;
              
              try {
                const barcodes = await barcodeDetector.detect(videoElement);
                if (barcodes.length > 0) {
                  // Parse the QR code data
                  const data = barcodes[0].rawValue;
                  console.log("QR Code detected:", data);
                  
                  // Clear interval temporarily to prevent multiple detections
                  if (scanInterval) clearInterval(scanInterval);
                  
                  // Pass data to callback
                  onQRCodeDetected(data);
                  
                  // Resume scanning after a short delay
                  setTimeout(() => {
                    scanInterval = setInterval(async () => {
                      try {
                        const newBarcodes = await barcodeDetector.detect(videoElement as HTMLVideoElement);
                        if (newBarcodes.length > 0) {
                          const newData = newBarcodes[0].rawValue;
                          if (newData !== data) {
                            console.log("New QR Code detected:", newData);
                            onQRCodeDetected(newData);
                          }
                        }
                      } catch (error) {
                        console.error("Barcode detection error:", error);
                      }
                    }, 1000);
                  }, 2000);
                }
              } catch (error) {
                console.error("Barcode detection error:", error);
              }
            }, 1000);
          } catch (error) {
            console.error("Camera access error:", error);
            setDeviceHasCamera(false);
          }
        } catch (error) {
          console.error("Barcode detector initialization error:", error);
        }
      } else {
        console.log("BarcodeDetector API not supported in this browser");
      }
    };
    
    // Start scanning immediately
    startScanning();
    
    // Clean up function
    return () => {
      console.log("QR scanner: Cleaning up resources");
      if (scanInterval) clearInterval(scanInterval);
      if (stream) stream.getTracks().forEach(track => track.stop());
      setIsScanning(false);
    };
  }, [onQRCodeDetected]);
  
  return null; // This component doesn't render anything visible
};

export default QRCodeScanner;
