import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Activity, AlertTriangle, TrendingUp, Network, Brain, Bell, Gauge, Monitor } from 'lucide-react';
import { useAdvancedPLCSimulation } from '@/hooks/useAdvancedPLCSimulation';
import ParameterProfilesPanel from './ParameterProfilesPanel';
import ParameterInteractionsPanel from './ParameterInteractionsPanel';
import FaultInjectionPanel from './FaultInjectionPanel';
import AlarmLogicPanel from './AlarmLogicPanel';
import HistoricalDataPanel from './HistoricalDataPanel';
import MLAnomalyPanel from './MLAnomalyPanel';
import VisualIndicatorsPanel from './VisualIndicatorsPanel';
import CommunicationPanel from './CommunicationPanel';
import ConfigurationPanel from './ConfigurationPanel';
import MultiDevicePanel from './MultiDevicePanel';

const AdvancedPLCSimulationPanel = () => {
  const simulation = useAdvancedPLCSimulation();
  const [activeTab, setActiveTab] = useState('profiles');

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Advanced PLC Simulation Suite
          {simulation.isRunning && (
            <Badge className="bg-green-100 text-green-800">
              <Activity className="h-3 w-3 mr-1" />
              SIMULATION ACTIVE
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="profiles" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Profiles</span>
            </TabsTrigger>
            <TabsTrigger value="interactions" className="flex items-center gap-1">
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">Interactions</span>
            </TabsTrigger>
            <TabsTrigger value="faults" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Faults</span>
            </TabsTrigger>
            <TabsTrigger value="alarms" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alarms</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="ml" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">ML</span>
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              <span className="hidden sm:inline">Visual</span>
            </TabsTrigger>
            <TabsTrigger value="comm" className="flex items-center gap-1">
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">Comm</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-1">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">Devices</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="mt-6">
            <ParameterProfilesPanel
              profiles={simulation.profiles}
              currentProfile={simulation.currentProfile}
              isRunning={simulation.isRunning}
              onProfilesChange={simulation.setProfiles}
              onStartSimulation={simulation.startSimulation}
              onStopSimulation={simulation.stopSimulation}
            />
          </TabsContent>

          <TabsContent value="interactions" className="mt-6">
            <ParameterInteractionsPanel
              interactions={simulation.interactions}
              onInteractionsChange={simulation.setInteractions}
            />
          </TabsContent>

          <TabsContent value="faults" className="mt-6">
            <FaultInjectionPanel
              scenarios={simulation.faultScenarios}
              activeFaults={simulation.activeFaults}
              onScenariosChange={simulation.setFaultScenarios}
            />
          </TabsContent>

          <TabsContent value="alarms" className="mt-6">
            <AlarmLogicPanel
              rules={simulation.alarmRules}
              activeAlarms={simulation.activeAlarms}
              onRulesChange={simulation.setAlarmRules}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <HistoricalDataPanel
              data={simulation.historicalData}
              isRecording={simulation.isRunning}
            />
          </TabsContent>

          <TabsContent value="ml" className="mt-6">
            <MLAnomalyPanel
              config={simulation.mlConfig}
              onConfigChange={simulation.setMlConfig}
            />
          </TabsContent>

          <TabsContent value="visual" className="mt-6">
            <VisualIndicatorsPanel
              historicalData={simulation.historicalData}
              activeAlarms={simulation.activeAlarms}
              isRunning={simulation.isRunning}
            />
          </TabsContent>

          <TabsContent value="comm" className="mt-6">
            <CommunicationPanel
              config={simulation.communicationConfig}
              onConfigChange={simulation.setCommunicationConfig}
            />
          </TabsContent>

          <TabsContent value="config" className="mt-6">
            <ConfigurationPanel
              onExport={simulation.exportConfiguration}
              onImport={simulation.importConfiguration}
            />
          </TabsContent>

          <TabsContent value="devices" className="mt-6">
            <MultiDevicePanel
              devices={simulation.devices}
              onDevicesChange={simulation.setDevices}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedPLCSimulationPanel;
