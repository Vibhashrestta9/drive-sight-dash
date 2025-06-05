
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Zap, Activity, Settings, Monitor, Bell, Circle } from 'lucide-react';
import { useVFDSimulation } from '@/hooks/useVFDSimulation';
import VFDControlPanel from './VFDControlPanel';
import VFDDiagnosticsPanel from './VFDDiagnosticsPanel';
import VFDVisualizationPanel from './VFDVisualizationPanel';
import VFDIntegrationPanel from './VFDIntegrationPanel';
import VFDMaintenanceTrainer from './VFDMaintenanceTrainer';

const VFDSimulationPanel = () => {
  const vfd = useVFDSimulation();
  const [activeTab, setActiveTab] = useState('control');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'stopped': return 'bg-gray-100 text-gray-800';
      case 'fault': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          VFD Simulation Suite
          <Badge className={getStatusColor(vfd.status)}>
            <Circle className="h-3 w-3 mr-1 fill-current" />
            {vfd.status.toUpperCase()}
          </Badge>
          {vfd.activeFaults.length > 0 && (
            <Badge className="bg-red-100 text-red-800">
              <Bell className="h-3 w-3 mr-1" />
              {vfd.activeFaults.length} FAULT(S)
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="control" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Control</span>
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Diagnostics</span>
            </TabsTrigger>
            <TabsTrigger value="visualization" className="flex items-center gap-1">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">Visual</span>
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Integration</span>
            </TabsTrigger>
            <TabsTrigger value="trainer" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Trainer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control" className="mt-6">
            <VFDControlPanel vfd={vfd} />
          </TabsContent>

          <TabsContent value="diagnostics" className="mt-6">
            <VFDDiagnosticsPanel vfd={vfd} />
          </TabsContent>

          <TabsContent value="visualization" className="mt-6">
            <VFDVisualizationPanel vfd={vfd} />
          </TabsContent>

          <TabsContent value="integration" className="mt-6">
            <VFDIntegrationPanel vfd={vfd} />
          </TabsContent>

          <TabsContent value="trainer" className="mt-6">
            <VFDMaintenanceTrainer vfd={vfd} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VFDSimulationPanel;
