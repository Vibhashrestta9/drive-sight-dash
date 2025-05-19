
import React from 'react';
import { Billboard, Text } from '@react-three/drei';

interface ARFallbackViewProps {
  errorMessage?: string | null;
  isScanning?: boolean;
}

const ARFallbackView: React.FC<ARFallbackViewProps> = ({ 
  errorMessage = null, 
  isScanning = true
}) => {
  if (errorMessage) {
    return (
      <>
        <ambientLight intensity={0.5} />
        <Billboard position={[0, 0, -5]}>
          <Text color="red" fontSize={0.5}>
            {errorMessage}
          </Text>
        </Billboard>
      </>
    );
  }
  
  // Default message when no QR code is detected but scanning
  return (
    <Billboard position={[0, 0, -3]}>
      <Text color="white" fontSize={0.2} anchorX="center" anchorY="middle">
        {isScanning ? "Scan a Drive QR code to view data" : "Processing QR code..."}
      </Text>
    </Billboard>
  );
};

export default ARFallbackView;
