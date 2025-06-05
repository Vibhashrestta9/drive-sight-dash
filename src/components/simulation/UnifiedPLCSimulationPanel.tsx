
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Settings, 
  Thermometer,
  Zap,
  Gauge,
  TrendingUp,
  Network,
  Brain,
  Bell,
  Monitor
} from 'lucide-react';
import { useSimulatedPLC } from '@/hooks/useSimulatedPLC';
import { useAdvancedPLCSimulation } from '@/hooks/useAdvancedPLCSimulation';
import RoleAwareControl from '../RoleAwareControl';
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

const UnifiedPLCSimulationPanel = () => {
  const basicPLC = useSimulatedPLC();
  const advancedPLC = useAdvancedPLCSimulation();
  const [activeTab, setActiveTab] = useState('basic');

  const getRegisterIcon = (type: string) => {
    switch (type) {
      case 'temperature': return <Thermometer className="h-4 w-4" />;
      case 'power': return <Zap className="h-4 w-4" />;
      case 'speed': return <Gauge className="h-4 w-4" />;
      case 'vibration': return <Activity className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const handleBasicConfigChange = (key: keyof typeof basicPLC.config, value: any) => {
    console.log(`Updating basic PLC config: ${key} = ${value}`);
    basicPLC.setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleThresholdChange = (type: string, value: number) => {
    console.log(`Updating alarm threshold: ${type} = ${value}`);
    basicPLC.setConfig(prev => ({
      ...prev,
      alarmThresholds: {
        ...prev.alarmThresholds,
        [type]: value
      }
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Unified PLC Simulation Suite
          {(basicPLC.isSimulating || advancedPLC.isRunning) && (
            <Badge className="bg-green-100 text-green-800">
              <Activity className="h-3 w-3 mr-1" />
              SIMULATION ACTIVE
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
            <TabsTrigger value="basic" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Basic</span>
            </TabsTrigger>
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
            <TabsTrigger value="setup" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Setup</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <div className="space-y-6">
              {/* Main Controls */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={basicPLC.config.enabled}
                      onCheckedChange={(checked) => {
                        console.log('Basic PLC enabled changed to:', checked);
                        handleBasicConfigChange('enabled', checked);
                      }}
                    />
                    <span className="font-medium">Enable Basic PLC Simulation</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Simulates real-time register changes for testing alarms and trends
                  </p>
                </div>
                
                <RoleAwareControl requiresWrite>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        console.log('Testing buzzer...');
                        basicPLC.triggerBuzzer();
                      }}
                      className="flex items-center gap-2"
                    >
                      {basicPLC.config.buzzerEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      Test Buzzer
                    </Button>
                    <Switch
                      checked={basicPLC.config.buzzerEnabled}
                      onCheckedChange={(checked) => {
                        console.log('Buzzer enabled changed to:', checked);
                        handleBasicConfigChange('buzzerEnabled', checked);
                      }}
                    />
                  </div>
                </RoleAwareControl>
              </div>
              
              <Separator />
              
              {/* Update Interval */}
              <RoleAwareControl requiresWrite>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Update Interval (ms):</label>
                  <Input
                    type="number"
                    value={basicPLC.config.updateInterval}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      console.log('Update interval changed to:', value);
                      handleBasicConfigChange('updateInterval', value);
                    }}
                    className="w-24"
                    min="500"
                    max="10000"
                    step="500"
                  />
                </div>
              </RoleAwareControl>
              
              <Separator />
              
              {/* Register Values */}
              <div className="space-y-4">
                <h4 className="font-medium">Current Register Values</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {basicPLC.registers.map((register) => (
                    <div key={register.address} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        {getRegisterIcon(register.type)}
                        <span className="text-sm font-medium capitalize">{register.type}</span>
                      </div>
                      <div className="text-lg font-bold">
                        {register.value} {register.unit}
                      </div>
                      <div className="text-xs text-gray-500">
                        Addr: {register.address}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Alarm Thresholds */}
              <RoleAwareControl requiresWrite>
                <div className="space-y-4">
                  <h4 className="font-medium">Alarm Thresholds</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm">Temperature (°C)</label>
                      <Input
                        type="number"
                        value={basicPLC.config.alarmThresholds.temperature}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          console.log('Temperature threshold changed to:', value);
                          handleThresholdChange('temperature', value);
                        }}
                        step="0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Power (W)</label>
                      <Input
                        type="number"
                        value={basicPLC.config.alarmThresholds.power}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          console.log('Power threshold changed to:', value);
                          handleThresholdChange('power', value);
                        }}
                        step="0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Vibration (mm/s)</label>
                      <Input
                        type="number"
                        value={basicPLC.config.alarmThresholds.vibration}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          console.log('Vibration threshold changed to:', value);
                          handleThresholdChange('vibration', value);
                        }}
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>
              </RoleAwareControl>
              
              {/* Active Alarms */}
              {basicPLC.alarms.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Active Alarms
                    </h4>
                    <div className="space-y-2">
                      {basicPLC.alarms.map((alarm, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                          <span className="text-red-700">{alarm}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profiles" className="mt-6">
            <ParameterProfilesPanel
              profiles={advancedPLC.profiles}
              currentProfile={advancedPLC.currentProfile}
              isRunning={advancedPLC.isRunning}
              onProfilesChange={advancedPLC.setProfiles}
              onStartSimulation={advancedPLC.startSimulation}
              onStopSimulation={advancedPLC.stopSimulation}
            />
          </TabsContent>

          <TabsContent value="interactions" className="mt-6">
            <ParameterInteractionsPanel
              interactions={advancedPLC.interactions}
              onInteractionsChange={advancedPLC.setInteractions}
            />
          </TabsContent>

          <TabsContent value="faults" className="mt-6">
            <FaultInjectionPanel
              scenarios={advancedPLC.faultScenarios}
              activeFaults={advancedPLC.activeFaults}
              onScenariosChange={advancedPLC.setFaultScenarios}
            />
          </TabsContent>

          <TabsContent value="alarms" className="mt-6">
            <AlarmLogicPanel
              rules={advancedPLC.alarmRules}
              activeAlarms={advancedPLC.activeAlarms}
              onRulesChange={advancedPLC.setAlarmRules}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <HistoricalDataPanel
              data={advancedPLC.historicalData}
              isRecording={advancedPLC.isRunning}
            />
          </TabsContent>

          <TabsContent value="ml" className="mt-6">
            <MLAnomalyPanel
              config={advancedPLC.mlConfig}
              onConfigChange={advancedPLC.setMlConfig}
            />
          </TabsContent>

          <TabsContent value="visual" className="mt-6">
            <VisualIndicatorsPanel
              historicalData={advancedPLC.historicalData}
              activeAlarms={advancedPLC.activeAlarms}
              isRunning={advancedPLC.isRunning}
            />
          </TabsContent>

          <TabsContent value="comm" className="mt-6">
            <CommunicationPanel
              config={advancedPLC.communicationConfig}
              onConfigChange={advancedPLC.setCommunicationConfig}
            />
          </TabsContent>

          <TabsContent value="config" className="mt-6">
            <ConfigurationPanel
              onExport={advancedPLC.exportConfiguration}
              onImport={advancedPLC.importConfiguration}
            />
          </TabsContent>

          <TabsContent value="devices" className="mt-6">
            <MultiDevicePanel
              devices={advancedPLC.devices}
              onDevicesChange={advancedPLC.setDevices}
            />
          </TabsContent>

          <TabsContent value="setup" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Advanced Simulation Setup</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      console.log('Starting advanced simulation...');
                      advancedPLC.startSimulation();
                    }}
                    disabled={advancedPLC.isRunning}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Start Advanced Simulation
                  </Button>
                  <Button
                    onClick={() => {
                      console.log('Stopping advanced simulation...');
                      advancedPLC.stopSimulation();
                    }}
                    disabled={!advancedPLC.isRunning}
                    variant="outline"
                  >
                    Stop
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Step Mode</label>
                  <Switch
                    checked={advancedPLC.stepMode}
                    onCheckedChange={(checked) => {
                      console.log('Step mode changed to:', checked);
                      advancedPLC.setStepMode(checked);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Update Interval (ms)</label>
                  <Input
                    type="number"
                    value={advancedPLC.updateInterval}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      console.log('Advanced update interval changed to:', value);
                      advancedPLC.setUpdateInterval(value);
                    }}
                    min="100"
                    max="10000"
                    step="100"
                  />
                </div>
              </div>

              {advancedPLC.stepMode && (
                <Button
                  onClick={() => {
                    console.log('Stepping simulation...');
                    advancedPLC.stepSimulation();
                  }}
                  disabled={!advancedPLC.isRunning}
                >
                  Step Simulation
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UnifiedPLCSimulationPanel;
