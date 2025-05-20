
import React, { useState, useEffect } from 'react';
import { ZapparCamera } from '@zappar/zappar-react-three-fiber';
import { Billboard, Text } from '@react-three/drei';
import { RMDEDrive } from '@/utils/types/rmdeTypes';
import ARFallbackView from './ARFallbackView';
import ScannedDriveDisplay from './ScannedDriveDisplay';
import { useZapparTarget } from '@/hooks/useZapparTarget';
import { useMaintenanceLog } from '@/hooks/useMaintenanceLog';

interface ARSceneProps {
  drives: RMDEDrive[];
}

const ARScene: React.FC<ARSceneProps> = ({ drives }) => {
  // State for selected drive
  const [selectedDriveId, setSelectedDriveId] = useState<string | null>(null);
  
  // This would be your QR code target file
  const targetFile = "/qr-target.zpt";
  const { targetFileLoaded, errorMessage } = useZapparTarget(targetFile);
  
  // Maintenance log functionality
  const { logServiceActivity } = useMaintenanceLog(drives);
  
  // Auto-select first drive if none selected
  useEffect(() => {
    if (!selectedDriveId && drives.length > 0) {
      setSelectedDriveId(drives[0].id.toString());
    }
  }, [drives, selectedDriveId]);
  
  const handleServiceLog = () => {
    if (selectedDriveId) {
      logServiceActivity(selectedDriveId);
    }
  };
  
  // Find the selected drive
  const selectedDrive = selectedDriveId 
    ? drives.find(drive => drive.id.toString() === selectedDriveId) 
    : null;
  
  if (errorMessage) {
    return <ARFallbackView errorMessage={errorMessage} />;
  }
  
  return (
    <>
      <ZapparCamera makeDefault />
      <directionalLight position={[0, 5, 10]} intensity={1.0} />
      <ambientLight intensity={0.5} />
      
      {/* Drive selector overlay */}
      <group position={[0, 2, -3]}>
        <mesh>
          <planeGeometry args={[4, 0.8]} />
          <meshBasicMaterial color="black" transparent opacity={0.7} />
        </mesh>
        <group position={[0, 0, 0.01]}>
          {drives.map((drive, index) => {
            const position = ((index - (drives.length - 1) / 2) * 0.8);
            const isSelected = drive.id.toString() === selectedDriveId;
            return (
              <group 
                key={drive.id} 
                position={[position, 0, 0]} 
                onClick={() => setSelectedDriveId(drive.id.toString())}
              >
                <mesh>
                  <boxGeometry args={[0.7, 0.6, 0.05]} />
                  <meshBasicMaterial color={isSelected ? "#4f46e5" : "#1f2937"} />
                </mesh>
                <group position={[0, 0, 0.06]}>
                  <Billboard>
                    <Text color="white" fontSize={0.12} anchorX="center" anchorY="middle">
                      {drive.name}
                    </Text>
                  </Billboard>
                </group>
              </group>
            );
          })}
        </group>
      </group>
      
      {/* Display selected drive 3D model */}
      {targetFileLoaded && (
        <ScannedDriveDisplay 
          targetFile={targetFile}
          scannedDrive={selectedDrive}
          onServiceLog={handleServiceLog}
        />
      )}
      
      {/* Fallback display if no drive is selected */}
      {!selectedDrive && (
        <ARFallbackView isScanning={false} />
      )}
    </>
  );
};

export default ARScene;
