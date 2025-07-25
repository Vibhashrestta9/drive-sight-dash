/**
 * COMPLETE AR DASHBOARD - CONSOLIDATED FOR MATLAB CONVERSION
 * 
 * This file contains the entire AR Dashboard functionality consolidated into a single file.
 * It includes all components, utilities, and dependencies needed for the AR Dashboard.
 * 
 * Original files consolidated:
 * - src/pages/ARDashboard.tsx
 * - src/components/ar/ARScene.tsx
 * - src/components/SelfHealingSystem.tsx
 * - src/components/DriveQRCodeGenerator.tsx
 * - Related utilities and types
 */

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Stats, Billboard, Html } from '@react-three/drei';
import { ZapparCamera, ImageTracker, ZapparCanvas } from '@zappar/zappar-react-three-fiber';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Camera, QrCode, RefreshCw, Shield, CheckCircle, AlertTriangle, Clock, Download, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode.react';

// ============= TYPE DEFINITIONS =============

interface RMDEError {
  id: number;
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  resolved: boolean;
}

interface RMDEDrive {
  id: number;
  name: string;
  moduleId: string;
  status: 'online' | 'warning' | 'error' | 'offline';
  healthScore: number;
  temperature: number;
  powerUsage: number;
  efficiency: number;
  operatingHours: number;
  lastMaintenance: number;
  errors: RMDEError[];
}

interface DriveConfig {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
}

interface HealingOperation {
  id: string;
  driveId: string;
  driveName: string;
  errorId: string;
  errorMessage: string;
  status: 'in_progress' | 'completed' | 'failed';
  progress: number;
  timestamp: number;
  attemptCount: number;
  maxAttempts: number;
}

interface ARSceneProps {
  drives: RMDEDrive[];
}

interface SelfHealingSystemProps {
  drives: RMDEDrive[];
  onHeal: (driveId: string, errorId: string) => void;
}

interface DriveQRCodeGeneratorProps {
  drives: RMDEDrive[];
}

// ============= UTILITY FUNCTIONS =============

const generateInitialRMDEData = (): RMDEDrive[] => {
  const drives: RMDEDrive[] = [];
  const driveTypes = ['ACS880', 'ACS580', 'ACS380'];
  const modules = ['MOD-001', 'MOD-002', 'MOD-003', 'MOD-004', 'MOD-005'];
  
  for (let i = 1; i <= 20; i++) {
    const hasError = Math.random() < 0.3; // 30% chance of error
    const hasWarning = !hasError && Math.random() < 0.4; // 40% chance of warning if no error
    
    let status: 'online' | 'warning' | 'error' | 'offline' = 'online';
    if (hasError) status = 'error';
    else if (hasWarning) status = 'warning';
    else if (Math.random() < 0.1) status = 'offline'; // 10% chance of offline
    
    const healthScore = status === 'error' ? 20 + Math.random() * 30 :
                       status === 'warning' ? 60 + Math.random() * 25 :
                       status === 'offline' ? 0 :
                       75 + Math.random() * 25;
    
    const errors: RMDEError[] = [];
    if (hasError) {
      const errorCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < errorCount; j++) {
        errors.push({
          id: j + 1,
          code: `E${(Math.floor(Math.random() * 9000) + 1000).toString()}`,
          message: [
            'Motor overheating detected',
            'Communication timeout',
            'Power supply fluctuation',
            'Encoder signal lost',
            'Overcurrent protection triggered'
          ][Math.floor(Math.random() * 5)],
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
          timestamp: Date.now() - Math.random() * 86400000,
          resolved: false
        });
      }
    }
    
    drives.push({
      id: i,
      name: `Drive ${i.toString().padStart(2, '0')}`,
      moduleId: modules[Math.floor(Math.random() * modules.length)],
      status,
      healthScore: Math.round(healthScore),
      temperature: 25 + Math.random() * 50,
      powerUsage: 500 + Math.random() * 1500,
      efficiency: 80 + Math.random() * 15,
      operatingHours: Math.random() * 8760,
      lastMaintenance: Date.now() - Math.random() * 7776000000,
      errors
    });
  }
  
  return drives;
};

const updateRMDEData = (data: RMDEDrive[]): RMDEDrive[] => {
  return data.map(drive => ({
    ...drive,
    healthScore: Math.max(0, Math.min(100, drive.healthScore + (Math.random() - 0.5) * 5)),
    temperature: Math.max(20, Math.min(80, drive.temperature + (Math.random() - 0.5) * 2)),
    powerUsage: Math.max(100, Math.min(2000, drive.powerUsage + (Math.random() - 0.5) * 50)),
    efficiency: Math.max(60, Math.min(95, drive.efficiency + (Math.random() - 0.5) * 2)),
    operatingHours: drive.operatingHours + 0.001389, // Add 5 seconds worth of hours
  }));
};

// ============= AR SCENE COMPONENT =============

const DriveModel: React.FC<{ drive: RMDEDrive; position: [number, number, number] }> = ({ drive, position }) => {
  const meshRef = useRef<any>();
  
  useEffect(() => {
    if (drive.status === 'error' && meshRef.current) {
      // Animate the box when there's an error
      const animate = () => {
        if (meshRef.current) {
          meshRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.01) * 0.1);
        }
        requestAnimationFrame(animate);
      };
      animate();
    }
  }, [drive.status]);

  const getHealthColor = (): string => {
    if (drive.healthScore > 90) return '#22c55e';
    if (drive.healthScore > 70) return '#eab308';
    if (drive.healthScore > 50) return '#f97316';
    return '#ef4444';
  };

  return (
    <group position={position}>
      <Box ref={meshRef} args={[1, 1, 1]}>
        <meshStandardMaterial color={getHealthColor()} />
      </Box>
      
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {drive.name}
        </Text>
      </Billboard>
      
      <Html position={[0, -1.5, 0]} center>
        <div className="bg-black bg-opacity-75 text-white p-2 rounded text-xs min-w-48">
          <div className="flex justify-between mb-1">
            <span>Health:</span>
            <span className="font-bold">{drive.healthScore}%</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Temp:</span>
            <span>{drive.temperature.toFixed(1)}°C</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Power:</span>
            <span>{drive.powerUsage.toFixed(0)}W</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={`font-bold ${
              drive.status === 'online' ? 'text-green-400' :
              drive.status === 'warning' ? 'text-yellow-400' :
              drive.status === 'error' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {drive.status.toUpperCase()}
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
};

const ARScene: React.FC<ARSceneProps> = ({ drives }) => {
  const targetFile = "qr-target.zpt";
  
  return (
    <>
      <ZapparCamera makeDefault />
      <ImageTracker targetFile={targetFile}>
        {drives.slice(0, 6).map((drive, index) => {
          const angle = (index / 6) * Math.PI * 2;
          const radius = 3;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <DriveModel
              key={drive.id}
              drive={drive}
              position={[x, 0, z]}
            />
          );
        })}
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
      </ImageTracker>
    </>
  );
};

// ============= SELF-HEALING SYSTEM COMPONENT =============

const SelfHealingSystem: React.FC<SelfHealingSystemProps> = ({ drives, onHeal }) => {
  const [healingOperations, setHealingOperations] = useState<HealingOperation[]>([]);
  const [completedOperations, setCompletedOperations] = useState<HealingOperation[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    drives.forEach(drive => {
      drive.errors.forEach(error => {
        if (!error.resolved && 
            !healingOperations.some(op => op.driveId === drive.id.toString() && op.errorId === error.id.toString()) &&
            !completedOperations.some(op => op.driveId === drive.id.toString() && op.errorId === error.id.toString())) {
          
          const newOperation: HealingOperation = {
            id: `${drive.id}-${error.id}-${Date.now()}`,
            driveId: drive.id.toString(),
            driveName: drive.name,
            errorId: error.id.toString(),
            errorMessage: error.message,
            status: 'in_progress',
            progress: 0,
            timestamp: Date.now(),
            attemptCount: 1,
            maxAttempts: calculateMaxAttempts(error)
          };
          
          setHealingOperations(prev => [...prev, newOperation]);
          onHeal(drive.id.toString(), error.id.toString());
          
          toast({
            title: "Auto-Healing Initiated",
            description: `Attempting to recover ${drive.name} from error: ${error.message}`,
          });
        }
      });
    });
  }, [drives]);
  
  useEffect(() => {
    if (healingOperations.length === 0) return;
    
    const interval = setInterval(() => {
      setHealingOperations(prev => {
        return prev.map(op => {
          const newProgress = Math.min(op.progress + Math.random() * 10, 100);
          
          if (newProgress >= 100) {
            const successful = Math.random() > getSeverityFailureProbability(op);
            
            setTimeout(() => {
              setCompletedOperations(prev => [...prev, {
                ...op,
                progress: 100,
                status: successful ? 'completed' : 'failed'
              }]);
              
              toast({
                title: successful ? "Auto-Healing Successful" : "Auto-Healing Failed",
                description: successful
                  ? `Successfully recovered ${op.driveName} from error`
                  : `Failed to recover ${op.driveName} after ${op.attemptCount} attempts`,
                variant: successful ? "default" : "destructive",
              });
              
              if (!successful && op.attemptCount < op.maxAttempts) {
                setHealingOperations(prev => [...prev, {
                  ...op,
                  id: `${op.driveId}-${op.errorId}-${Date.now()}`,
                  progress: 0,
                  timestamp: Date.now(),
                  attemptCount: op.attemptCount + 1
                }]);
              }
            }, 1000);
            
            return null;
          }
          
          return { ...op, progress: newProgress };
        }).filter(Boolean) as HealingOperation[];
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [healingOperations]);
  
  const calculateMaxAttempts = (error: RMDEError): number => {
    switch (error.severity) {
      case 'critical':
        return 2;
      case 'high':
        return 3;
      case 'medium':
        return 4;
      default:
        return 5;
    }
  };
  
  const getSeverityFailureProbability = (op: HealingOperation): number => {
    const drive = drives.find(d => d.id.toString() === op.driveId);
    const error = drive?.errors.find(e => e.id.toString() === op.errorId);
    
    if (!error) return 0.5;
    
    switch (error.severity) {
      case 'critical':
        return 0.7 - (op.attemptCount * 0.1);
      case 'high':
        return 0.5 - (op.attemptCount * 0.1);
      case 'medium':
        return 0.3 - (op.attemptCount * 0.05);
      default:
        return 0.2 - (op.attemptCount * 0.05);
    }
  };
  
  if (healingOperations.length === 0 && completedOperations.length === 0) {
    return (
      <Alert className="mb-6">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Self-Healing System Active</AlertTitle>
        <AlertDescription>
          The system is monitoring for errors. When detected, automatic recovery will be attempted.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-blue-500" />
          Self-Healing System
        </CardTitle>
        <CardDescription>
          Automatic error detection and recovery
        </CardDescription>
      </CardHeader>
      <CardContent>
        {healingOperations.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Active Recovery Operations</h3>
            <div className="space-y-3">
              {healingOperations.map(op => (
                <div key={op.id} className="border rounded-md p-3 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium">{op.driveName}</div>
                    <Badge className="bg-blue-500">
                      Attempt {op.attemptCount}/{op.maxAttempts}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{op.errorMessage}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={op.progress} className="h-2 flex-grow" />
                    <div className="text-xs font-medium">{Math.round(op.progress)}%</div>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(op.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {completedOperations.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Recent Recovery Attempts</h3>
            <div className="space-y-2">
              {completedOperations.slice(0, 5).map(op => (
                <div 
                  key={op.id} 
                  className={`border rounded-md p-2 ${
                    op.status === 'completed' 
                      ? 'bg-green-50 dark:bg-green-900/20' 
                      : 'bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{op.driveName}</div>
                    <Badge className={op.status === 'completed' ? 'bg-green-500' : 'bg-red-500'}>
                      {op.status === 'completed' ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Recovered</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Failed</span>
                        </div>
                      )}
                    </Badge>
                  </div>
                  <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">{op.errorMessage}</div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(op.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
              
              {completedOperations.length > 5 && (
                <div className="text-sm text-center text-gray-500 mt-1">
                  + {completedOperations.length - 5} more operations
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ============= QR CODE GENERATOR COMPONENT =============

const DriveQRCodeGenerator: React.FC<DriveQRCodeGeneratorProps> = ({ drives }) => {
  const [selectedDrive, setSelectedDrive] = useState<string>('');
  const [customConfig, setCustomConfig] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const driveConfigs: DriveConfig[] = drives.slice(0, 5).map((drive, index) => ({
    id: drive.id.toString(),
    name: drive.name,
    type: ['ACS880', 'ACS580', 'ACS380'][index % 3],
    config: {
      ip: `192.168.1.${101 + index}`,
      port: 502,
      deviceId: drive.id,
      connect21Module: `Connect21-${String.fromCharCode(65 + index)}`,
      parameters: {
        frequency: [50, 60][index % 2],
        voltage: [400, 480][index % 2],
        current: 50 + (index * 25)
      }
    }
  }));

  const getQRCodeData = () => {
    const driveConfig = driveConfigs.find(d => d.id === selectedDrive);
    if (!driveConfig) return '';

    const qrData = {
      driveId: driveConfig.id,
      driveName: driveConfig.name,
      driveType: driveConfig.type,
      connect21Module: driveConfig.config.connect21Module,
      networkConfig: {
        ip: driveConfig.config.ip,
        port: driveConfig.config.port,
        deviceId: driveConfig.config.deviceId
      },
      parameters: driveConfig.config.parameters,
      timestamp: new Date().toISOString(),
      ...(customConfig && { customConfig: JSON.parse(customConfig) })
    };

    return JSON.stringify(qrData, null, 2);
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('#qr-code canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${driveConfigs.find(d => d.id === selectedDrive)?.name || 'drive'}-qr-code.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const selectedDriveData = driveConfigs.find(d => d.id === selectedDrive);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="drive-select">Select Drive</Label>
          <Select value={selectedDrive} onValueChange={setSelectedDrive}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a drive to generate QR code" />
            </SelectTrigger>
            <SelectContent>
              {driveConfigs.map(drive => (
                <SelectItem key={drive.id} value={drive.id}>
                  {drive.name} ({drive.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedDriveData && (
          <div className="space-y-3">
            <div className="rounded-lg border p-3 bg-muted/50">
              <h4 className="font-medium mb-2">Drive Configuration</h4>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Name:</span> {selectedDriveData.name}</div>
                <div><span className="font-medium">Type:</span> {selectedDriveData.type}</div>
                <div><span className="font-medium">Connect21 Module:</span> {selectedDriveData.config.connect21Module}</div>
                <div><span className="font-medium">IP Address:</span> {selectedDriveData.config.ip}</div>
                <div><span className="font-medium">Port:</span> {selectedDriveData.config.port}</div>
                <div><span className="font-medium">Device ID:</span> {selectedDriveData.config.deviceId}</div>
              </div>
            </div>

            <div className="rounded-lg border p-3 bg-muted/50">
              <h4 className="font-medium mb-2">Drive Parameters</h4>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Frequency:</span> {selectedDriveData.config.parameters.frequency} Hz</div>
                <div><span className="font-medium">Voltage:</span> {selectedDriveData.config.parameters.voltage} V</div>
                <div><span className="font-medium">Current:</span> {selectedDriveData.config.parameters.current} A</div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showAdvanced ? 'Hide' : 'Show'} Advanced Config
            </Button>
          </div>
          
          {showAdvanced && (
            <div>
              <Label htmlFor="custom-config">Custom Configuration (JSON)</Label>
              <textarea
                id="custom-config"
                className="w-full h-24 p-2 border rounded-md text-sm font-mono"
                placeholder='{"customParam": "value"}'
                value={customConfig}
                onChange={(e) => setCustomConfig(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {selectedDrive ? (
          <div className="flex flex-col items-center space-y-4">
            <div id="qr-code" className="p-4 bg-white rounded-lg border shadow-sm">
              <QRCode
                value={getQRCodeData()}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <Button onClick={downloadQRCode} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download QR Code
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Scan this QR code with the AR app to view</p>
              <p><strong>{selectedDriveData?.name}</strong> in augmented reality</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-center text-muted-foreground">
              <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Select a drive to generate QR code</p>
            </div>
          </div>
        )}
      </div>

      {selectedDrive && showAdvanced && (
        <div className="col-span-2 mt-6">
          <Label>QR Code Data Preview</Label>
          <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-auto max-h-40">
            {getQRCodeData()}
          </pre>
        </div>
      )}
    </div>
  );
};

// ============= STANDARD VIEW COMPONENT =============

function StandardView({ drives }: { drives: RMDEDrive[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {drives.map((drive) => (
        <Card key={drive.id} className={drive.status === 'error' ? 'border-red-500' : ''}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{drive.name}</CardTitle>
              <Badge className={
                drive.status === 'online' ? 'bg-green-500' : 
                drive.status === 'warning' ? 'bg-yellow-500' : 
                drive.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
              }>
                {drive.status}
              </Badge>
            </div>
            <CardDescription>Module: {drive.moduleId}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Health Score:</span>
                <span className="font-medium">{drive.healthScore}%</span>
              </div>
              <Progress value={drive.healthScore} className={
                drive.healthScore > 90 ? 'bg-green-500' : 
                drive.healthScore > 70 ? 'bg-yellow-500' : 
                'bg-red-500'
              } />
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium">Temperature</div>
                  <div className="font-semibold">{drive.temperature.toFixed(1)}°C</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium">Power</div>
                  <div className="font-semibold">{drive.powerUsage.toFixed(0)}W</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium">Efficiency</div>
                  <div className="font-semibold">{drive.efficiency.toFixed(1)}%</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium">Runtime</div>
                  <div className="font-semibold">{Math.floor(drive.operatingHours)}h</div>
                </div>
              </div>
              
              {drive.status === 'error' && (
                <div className="mt-2">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error Detected</AlertTitle>
                    <AlertDescription>
                      {drive.errors[0]?.message || 'Unknown error'}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============= MAIN AR DASHBOARD COMPONENT =============

const ARDashboard = () => {
  const [rmdeData, setRmdeData] = useState(generateInitialRMDEData());
  const [arMode, setArMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();
  const [selfHealingEnabled, setSelfHealingEnabled] = useState(false);
  const [showQrGenerator, setShowQrGenerator] = useState(false);
  
  useEffect(() => {
    const initialData = generateInitialRMDEData();
    setRmdeData(initialData);
    
    const interval = setInterval(() => {
      setRmdeData(prevData => updateRMDEData(prevData));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleEnableAR = () => {
    if (!arMode) {
      if ('xr' in navigator) {
        setArMode(true);
        toast({
          title: "AR Mode Enabled",
          description: "Point your camera at a QR code to visualize drive data",
        });
      } else {
        toast({
          title: "AR Not Supported",
          description: "Your device does not support AR features",
          variant: "destructive",
        });
      }
    } else {
      setArMode(false);
    }
  };
  
  const handleToggleSelfHealing = () => {
    setSelfHealingEnabled(!selfHealingEnabled);
    toast({
      title: selfHealingEnabled ? "Self-Healing Disabled" : "Self-Healing Enabled",
      description: selfHealingEnabled 
        ? "Manual intervention will be required for drive errors" 
        : "System will automatically attempt to recover from errors",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">AR Dashboard</h1>
            <p className="text-gray-600">Visualize drive data with augmented reality</p>
          </div>
        </div>
        <div className="space-x-2">
          <Button 
            variant={selfHealingEnabled ? "default" : "outline"}
            onClick={handleToggleSelfHealing}
            className="flex items-center gap-2"
          >
            {selfHealingEnabled ? <CheckCircle className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
            {selfHealingEnabled ? "Self-Healing ON" : "Self-Healing OFF"}
          </Button>
          <Button 
            variant={arMode ? "default" : "outline"}
            onClick={handleEnableAR}
            className="flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            {arMode ? "Disable AR" : "Enable AR"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowQrGenerator(!showQrGenerator)}
            className="flex items-center gap-2"
          >
            <QrCode className="h-4 w-4" />
            {showQrGenerator ? "Hide QR Codes" : "Show QR Codes"}
          </Button>
        </div>
      </div>
      
      {selfHealingEnabled && (
        <SelfHealingSystem 
          drives={rmdeData}
          onHeal={(driveId, errorId) => {
            toast({
              title: "Auto-Healing Initiated",
              description: `Attempting to recover drive ${driveId} from error`,
            });
          }}
        />
      )}
      
      {showQrGenerator && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>QR Code Generator</CardTitle>
            <CardDescription>
              Generate QR codes for drives to use with AR visualization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DriveQRCodeGenerator drives={rmdeData} />
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Standard Dashboard</TabsTrigger>
          <TabsTrigger value="ar" disabled={!arMode}>AR Visualization</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-4">
          <StandardView drives={rmdeData} />
        </TabsContent>
        <TabsContent value="ar" className="mt-4">
          {arMode ? (
            <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
              <ZapparCanvas>
                <ARScene drives={rmdeData} />
              </ZapparCanvas>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <p>Enable AR mode to visualize drive data in augmented reality.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Alert className="mb-6">
        <RefreshCw className="h-4 w-4" />
        <AlertTitle>AR Usage Tips</AlertTitle>
        <AlertDescription>
          <p>1. Enable AR mode and allow camera access</p>
          <p>2. Generate and print QR codes for your drives</p>
          <p>3. Point your camera at the QR codes to see live drive data</p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ARDashboard;