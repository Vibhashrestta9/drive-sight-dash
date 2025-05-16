
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Stats } from '@react-three/drei';
import { ZapparCamera, ImageTracker, ZapparCanvas } from '@zappar/zappar-react-three-fiber';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Camera, QrCode, RefreshCw, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { 
  generateInitialRMDEData, 
  updateRMDEData,
  getStatusBadgeClass,
  getHealthColor, 
  RMDEDrive 
} from '@/utils/rmdeUtils';
import SelfHealingSystem from '@/components/SelfHealingSystem';
import DriveQRCodeGenerator from '@/components/DriveQRCodeGenerator';

// This is for AR mode
const ARScene = React.lazy(() => import('@/components/ar/ARScene'));

// For fallback non-AR mode
function StandardView({ drives }) {
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
                  <div className="font-semibold">{drive.temperature}°C</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium">Power</div>
                  <div className="font-semibold">{drive.powerUsage}W</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium">Efficiency</div>
                  <div className="font-semibold">{drive.efficiency}%</div>
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

const ARDashboard = () => {
  const [rmdeData, setRmdeData] = useState(generateInitialRMDEData());
  const [arMode, setArMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();
  const [selfHealingEnabled, setSelfHealingEnabled] = useState(false);
  const [showQrGenerator, setShowQrGenerator] = useState(false);
  
  useEffect(() => {
    // This ensures we have consistent data across components
    const initialData = generateInitialRMDEData();
    setRmdeData(initialData);
    
    // Simulated data updates
    const interval = setInterval(() => {
      setRmdeData(prevData => updateRMDEData(prevData));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleEnableAR = () => {
    if (!arMode) {
      // Check if device supports WebXR
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
              <Suspense fallback={<div className="flex h-full w-full items-center justify-center">Loading AR capabilities...</div>}>
                <ZapparCanvas>
                  <ARScene drives={rmdeData} />
                </ZapparCanvas>
              </Suspense>
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
