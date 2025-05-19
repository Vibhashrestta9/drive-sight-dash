
import React, { useEffect } from 'react';

interface QRCodeScannerProps {
  onQRCodeDetected: (data: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onQRCodeDetected }) => {
  
  useEffect(() => {
    // Check if the BarcodeDetector API is available
    if ('BarcodeDetector' in window) {
      const barcodeDetector = new (window as any).BarcodeDetector({
        formats: ['qr_code']
      });
      
      // Get video stream for scanning (this would need permission)
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          const videoElement = document.createElement('video');
          videoElement.srcObject = stream;
          videoElement.autoplay = true;
          
          // Periodically detect QR codes in the video stream
          const scanInterval = setInterval(async () => {
            try {
              const barcodes = await barcodeDetector.detect(videoElement);
              if (barcodes.length > 0) {
                // Parse the QR code data
                const data = barcodes[0].rawValue;
                onQRCodeDetected(data);
              }
            } catch (error) {
              console.error("Barcode detection error:", error);
            }
          }, 1000);
          
          return () => {
            clearInterval(scanInterval);
            stream.getTracks().forEach(track => track.stop());
          };
        })
        .catch(error => {
          console.error("Camera access error:", error);
        });
    }
  }, [onQRCodeDetected]);
  
  return null; // This component doesn't render anything
};

export default QRCodeScanner;
