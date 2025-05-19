
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { generateInitialRMDEData } from '@/utils/rmde/dataGenerator';
import { updateRMDEData } from '@/utils/rmde/dataUpdater';
import { RMDEDrive } from '@/utils/types/rmdeTypes';
import SelfHealingSystem from '@/components/SelfHealingSystem';
import DriveQRCodeGenerator from '@/components/DriveQRCodeGenerator';
import StandardView from '@/components/ar/StandardView';
import ARViewWrapper from '@/components/ar/ARViewWrapper';
import ARDashboardHeader from '@/components/ar/ARDashboardHeader';
import ARUsageTips from '@/components/ar/ARUsageTips';

const ARDashboard = () => {
  const [rmdeData, setRmdeData] = useState<RMDEDrive[]>([]);
  const [arMode, setArMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [arError, setArError] = useState<string | null>(null);
  const { toast } = useToast();
  const [selfHealingEnabled, setSelfHealingEnabled] = useState(false);
  const [showQrGenerator, setShowQrGenerator] = useState(false);
  
  useEffect(() => {
    try {
      // This ensures we have consistent data across components
      const initialData = generateInitialRMDEData();
      setRmdeData(initialData);
      
      // Simulated data updates
      const interval = setInterval(() => {
        setRmdeData(prevData => updateRMDEData(prevData));
      }, 5000);
      
      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error initializing data:", error);
      toast({
        title: "Data Error",
        description: "Failed to initialize dashboard data",
        variant: "destructive",
      });
    }
  }, []);
  
  const handleEnableAR = () => {
    try {
      if (!arMode) {
        setArMode(true);
        setActiveTab('ar'); // Automatically switch to AR tab
        toast({
          title: "AR Mode Enabled",
          description: "Point your camera at a QR code to visualize drive data",
        });
      } else {
        setArMode(false);
        setActiveTab('dashboard');
      }
    } catch (error) {
      console.error("AR mode error:", error);
      setArError("Failed to initialize AR mode");
      toast({
        title: "AR Error",
        description: "Could not initialize AR mode",
        variant: "destructive",
      });
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
      <ARDashboardHeader 
        selfHealingEnabled={selfHealingEnabled}
        arMode={arMode}
        showQrGenerator={showQrGenerator}
        onToggleSelfHealing={handleToggleSelfHealing}
        onToggleAR={handleEnableAR}
        onToggleQrGenerator={() => setShowQrGenerator(!showQrGenerator)}
      />
      
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
          <ARViewWrapper 
            drives={rmdeData}
            arMode={arMode}
            arError={arError}
          />
        </TabsContent>
      </Tabs>
      
      <ARUsageTips />
    </div>
  );
};

export default ARDashboard;
