
import React, { useRef, useEffect } from 'react';
import { Box, Billboard, Html } from '@react-three/drei';
import Text from './Text';
import { RMDEDrive } from '@/utils/types/rmdeTypes';
import * as THREE from 'three';

interface DriveARModelProps {
  drive: RMDEDrive;
}

const DriveARModel: React.FC<DriveARModelProps> = ({ drive }) => {
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
        {/* Background plane for text */}
        <group>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[1, 0.2]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <Text fontSize={0.15} color="#ffffff">
            {drive.name}
          </Text>
        </group>
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

export default DriveARModel;
