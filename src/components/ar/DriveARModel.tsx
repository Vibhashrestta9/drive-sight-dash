
import React, { useRef, useEffect, useState } from 'react';
import { Box, Billboard, Html, useFrame } from '@react-three/drei';
import Text from './Text';
import { RMDEDrive } from '@/utils/types/rmdeTypes';
import * as THREE from 'three';

interface DriveARModelProps {
  drive: RMDEDrive;
  onServiceLog?: () => void;
}

const DriveARModel: React.FC<DriveARModelProps> = ({ drive, onServiceLog }) => {
  const motorRef = useRef<THREE.Group>(null);
  const fanRef = useRef<THREE.Mesh>(null);
  const sparkRef = useRef<THREE.Points>(null);
  const [showInteractionPanel, setShowInteractionPanel] = useState(false);
  const [serviced, setServiced] = useState(false);
  
  // Create particle system for sparks when drive has errors
  useEffect(() => {
    if (!sparkRef.current || drive.status !== 'error') return;
    
    // Initialize a particle system for sparks
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    // Create spark particles
    for (let i = 0; i < 50; i++) {
      vertices.push(
        THREE.MathUtils.randFloatSpread(0.5),
        THREE.MathUtils.randFloatSpread(0.5),
        THREE.MathUtils.randFloatSpread(0.5)
      );
      
      // Red/orange colors for sparks
      colors.push(1, THREE.MathUtils.randFloat(0.2, 0.8), 0);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    sparkRef.current.geometry = geometry;
    sparkRef.current.material = material;
  }, [drive.status]);
  
  // Animate components
  useFrame((state) => {
    if (!motorRef.current) return;
    
    // Basic motor rotation animation
    if (drive.status === 'online') {
      motorRef.current.rotation.y += 0.01;
    }
    
    // Fan animation - speed based on drive efficiency
    if (fanRef.current && drive.status !== 'offline') {
      const fanSpeed = drive.efficiency / 1500;
      fanRef.current.rotation.z += fanSpeed;
    }
    
    // Animate sparks for error drives
    if (sparkRef.current && drive.status === 'error') {
      const time = state.clock.getElapsedTime();
      const positions = sparkRef.current.geometry.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const i3 = i * 3;
        positions.array[i3 + 1] += Math.sin(time + i * 0.1) * 0.01;
        
        // Reset particles that fall too low
        if (positions.array[i3 + 1] < -0.4) {
          positions.array[i3 + 1] = 0.4;
        }
      }
      positions.needsUpdate = true;
    }
  });
  
  // Determine color based on health and status
  const getMotorColor = () => {
    if (drive.status === 'error') return 'red';
    if (drive.status === 'warning') return 'orange';
    if (drive.healthScore < 70) return '#ff9e00';
    return '#3498db';
  };

  // Show zones based on drive status and temperature
  const SafetyZones = () => {
    // Red zone for hot or dangerous drives
    const showDangerZone = drive.status === 'error' || drive.temperature > 75;
    // Yellow zone for warnings
    const showWarningZone = drive.status === 'warning' || (drive.temperature > 60 && drive.temperature <= 75);
    // Always show safe zone
    
    return (
      <group>
        {showDangerZone && (
          <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1.2, 32]} />
            <meshBasicMaterial color="red" transparent opacity={0.2} />
          </mesh>
        )}
        {showWarningZone && (
          <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.6, 32]} />
            <meshBasicMaterial color="yellow" transparent opacity={0.2} />
          </mesh>
        )}
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.6, 2.0, 32]} />
          <meshBasicMaterial color="green" transparent opacity={0.2} />
        </mesh>
      </group>
    );
  };
  
  return (
    <group onClick={() => setShowInteractionPanel(!showInteractionPanel)}>
      <SafetyZones />
      
      {/* 3D model representing the drive motor */}
      <group ref={motorRef} position={[0, 0.2, 0]}>
        {/* Motor body */}
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
          <meshStandardMaterial color={getMotorColor()} metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Motor shaft */}
        <mesh position={[0, 0, 0.25]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
          <meshStandardMaterial color="gray" metalness={0.9} />
        </mesh>
        
        {/* Fan on motor */}
        <mesh ref={fanRef} position={[0, 0, 0.35]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.15, 0.02, 8, 4]} />
          <meshStandardMaterial color="darkgray" />
        </mesh>
        
        {/* Sparks for error state */}
        {drive.status === 'error' && (
          <points ref={sparkRef}>
            <pointsMaterial size={0.05} vertexColors />
          </points>
        )}
      </group>
      
      {/* Name label */}
      <Billboard position={[0, 0.85, 0]}>
        <group>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[1, 0.2]} />
            <meshBasicMaterial color="#000000" opacity={0.7} transparent />
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
                backgroundColor: drive.healthScore > 90 ? 'green' : drive.healthScore > 70 ? 'yellow' : 'red',
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
      
      {/* Interaction panel when clicked */}
      {showInteractionPanel && (
        <Billboard position={[0, 0, 0.5]} follow={true}>
          <Html transform distanceFactor={10}>
            <div style={{ 
              width: '280px', 
              background: 'rgba(0,0,0,0.9)', 
              color: 'white', 
              padding: '15px',
              borderRadius: '10px',
              fontSize: '12px',
              border: '1px solid #3498db',
              transform: 'translateY(-50px)',
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>
                Maintenance Panel: {drive.name}
              </div>
              
              <div style={{ fontSize: '11px', marginBottom: '8px', opacity: 0.8 }}>
                Last serviced: {drive.lastMaintenance || 'No service record'}
              </div>
              
              {drive.status === 'error' && (
                <div style={{ 
                  background: 'rgba(255,0,0,0.2)', 
                  padding: '10px', 
                  marginBottom: '10px', 
                  borderRadius: '5px',
                  border: '1px solid rgba(255,0,0,0.5)',
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Error Detected: Fix Instructions</div>
                  <ol style={{ marginLeft: '15px', fontSize: '11px', lineHeight: '1.3' }}>
                    <li>Check power supply to the drive unit</li>
                    <li>Inspect for obstructions in moving parts</li>
                    <li>Verify temperature sensors are functioning</li>
                    <li>Reset controller after inspection</li>
                  </ol>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button 
                  onClick={() => {
                    setServiced(true);
                    if (onServiceLog) onServiceLog();
                  }}
                  style={{
                    background: serviced ? '#27ae60' : '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    flex: '1',
                  }}
                >
                  {serviced ? 'Serviced ✓' : 'Mark as Serviced'}
                </button>
                <button 
                  onClick={() => setShowInteractionPanel(false)}
                  style={{
                    background: '#7f8c8d',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </Html>
        </Billboard>
      )}
    </group>
  );
};

export default DriveARModel;
