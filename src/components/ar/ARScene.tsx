
import React, { useEffect, useRef, useState } from 'react';
import { ZapparCamera, ImageTracker } from '@zappar/zappar-react-three-fiber';
import { Text, Box, Billboard, Html } from '@react-three/drei';
import { RMDEDrive } from '@/utils/rmdeUtils';
import * as THREE from 'three';

interface ARSceneProps {
  drives: RMDEDrive[];
}

const ARScene: React.FC<ARSceneProps> = ({ drives }) => {
  // This would be your QR code target image
  const targetFile = "qr-target.zpt";
  
  return (
    <>
      <ZapparCamera makeDefault />
      <directionalLight position={[0, 5, 10]} intensity={1.0} />
      <ambientLight intensity={0.5} />
      
      {/* Multiple trackers for each drive QR code */}
      {drives.map((drive) => (
        <ImageTracker
          key={drive.id.toString()}
          targetImage={targetFile}
          onNotVisible={() => console.log(`Target for drive ${drive.id} not visible`)}
          onNewAnchor={(anchor) => console.log(`New anchor for drive ${drive.id}`)}
          onVisible={() => console.log(`Target for drive ${drive.id} visible`)}
        >
          <DriveModel drive={drive} />
        </ImageTracker>
      ))}
    </>
  );
};

// Component for displaying a drive in AR
const DriveModel = ({ drive }: { drive: RMDEDrive }) => {
  const boxRef = useRef<THREE.Mesh>(null);
  
  // Animate the model based on drive health
  useEffect(() => {
    if (!boxRef.current) return;
    
    // Make the box pulse if there's an error
    if (drive.status === 'error') {
      const interval = setInterval(() => {
        if (boxRef.current) {
          boxRef.current.scale.x = 1 + Math.sin(Date.now() * 0.005) * 0.1;
          boxRef.current.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.1;
          boxRef.current.scale.z = 1 + Math.sin(Date.now() * 0.005) * 0.1;
        }
      }, 16);
      
      return () => clearInterval(interval);
    }
  }, [drive.status]);
  
  // Determine color based on health
  const getHealthColor = () => {
    if (drive.healthScore > 90) return 'green';
    if (drive.healthScore > 70) return 'yellow';
    return 'red';
  };
  
  return (
    <group>
      {/* 3D model representing the drive */}
      <Box 
        ref={boxRef}
        args={[0.5, 0.5, 0.5]} 
        position={[0, 0.25, 0]}
      >
        <meshStandardMaterial 
          color={
            drive.status === 'online' ? 'green' : 
            drive.status === 'warning' ? 'yellow' : 
            drive.status === 'error' ? 'red' : 'gray'
          } 
        />
      </Box>
      
      {/* Name label */}
      <Billboard position={[0, 0.85, 0]}>
        <Text fontSize={0.15} color="#ffffff" backgroundColor="#000000" paddingX={0.05}>
          {drive.name}
        </Text>
      </Billboard>
      
      {/* Data visualization */}
      <Billboard position={[0, 0.6, 0]} follow={true}>
        <Html transform distanceFactor={10}>
          <div style={{ 
            width: '250px', 
            background: 'rgba(0,0,0,0.8)', 
            color: 'white', 
            padding: '10px',
            borderRadius: '10px',
            fontSize: '12px',
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              Health: {drive.healthScore}%
            </div>
            <div style={{ 
              width: '100%', 
              height: '6px', 
              backgroundColor: '#333',
              marginBottom: '10px',
              borderRadius: '3px',
            }}>
              <div style={{ 
                width: `${drive.healthScore}%`, 
                height: '6px', 
                backgroundColor: getHealthColor(),
                borderRadius: '3px',
              }}></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
              <div>Temp: {drive.temperature}°C</div>
              <div>Power: {drive.powerUsage}W</div>
              <div>Eff: {drive.efficiency}%</div>
              <div>Runtime: {Math.floor(drive.operatingHours)}h</div>
            </div>
            {drive.errors.length > 0 && !drive.errors[0].resolved && (
              <div style={{ 
                marginTop: '5px', 
                padding: '5px', 
                backgroundColor: 'rgba(255,0,0,0.3)', 
                borderRadius: '3px',
              }}>
                {drive.errors[0].message}
              </div>
            )}
          </div>
        </Html>
      </Billboard>
    </group>
  );
};

export default ARScene;
