
import React from 'react';
import { ImageTracker } from '@zappar/zappar-react-three-fiber';
import { Billboard, Text } from '@react-three/drei';
import DriveARModel from './DriveARModel';
import { RMDEDrive } from '@/utils/types/rmdeTypes';

interface ScannedDriveDisplayProps {
  targetFile: string;
  scannedDrive: RMDEDrive | null;
  onServiceLog: () => void;
}

const ScannedDriveDisplay: React.FC<ScannedDriveDisplayProps> = ({ 
  targetFile, 
  scannedDrive, 
  onServiceLog 
}) => {
  return (
    <ImageTracker
      targetImage={targetFile}
      onNotVisible={() => console.log(`Target not visible`)}
      onNewAnchor={(anchor) => console.log(`New anchor detected`)}
      onVisible={() => console.log(`Target visible`)}
    >
      {scannedDrive ? (
        <DriveARModel 
          drive={scannedDrive} 
          onServiceLog={onServiceLog}
        />
      ) : (
        <Billboard position={[0, 0, 0]}>
          <Text color="white" fontSize={0.2}>
            QR Code detected, processing...
          </Text>
        </Billboard>
      )}
    </ImageTracker>
  );
};

export default ScannedDriveDisplay;
