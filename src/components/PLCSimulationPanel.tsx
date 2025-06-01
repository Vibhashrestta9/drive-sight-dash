
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Settings, 
  Thermometer,
  Zap,
  Gauge
} from 'lucide-react';
import { useSimulatedPLC } from '@/hooks/useSimulatedPLC';
import RoleAwareControl from './RoleAwareControl';

const PLCSimulationPanel: React.FC = () => {
  const { 
    config, 
    setConfig, 
    registers, 
    alarms, 
    triggerBuzzer, 
    isSimulating 
  } = useSimulatedPLC();
  
  const handleConfigChange = (key: keyof typeof config, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const handleThresholdChange = (type: string, value: number) => {
    setConfig(prev => ({
      ...prev,
      alarmThresholds: {
        ...prev.alarmThresholds,
        [type]: value
      }
    }));
  };
  
  const getRegisterIcon = (type: string) => {
    switch (type) {
      case 'temperature': return <Thermometer className="h-4 w-4" />;
      case 'power': return <Zap className="h-4 w-4" />;
      case 'speed': return <Gauge className="h-4 w-4" />;
      case 'vibration': return <Activity className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          PLC Simulation Mode
          {isSimulating && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              ACTIVE
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Controls */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={config.enabled}
                onCheckedChange={(checked) => handleConfigChange('enabled', checked)}
              />
              <span className="font-medium">Enable PLC Simulation</span>
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
                onClick={triggerBuzzer}
                className="flex items-center gap-2"
              >
                {config.buzzerEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                Test Buzzer
              </Button>
              <Switch
                checked={config.buzzerEnabled}
                onCheckedChange={(checked) => handleConfigChange('buzzerEnabled', checked)}
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
              value={config.updateInterval}
              onChange={(e) => handleConfigChange('updateInterval', parseInt(e.target.value))}
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
            {registers.map((register) => (
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
                  value={config.alarmThresholds.temperature}
                  onChange={(e) => handleThresholdChange('temperature', parseFloat(e.target.value))}
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Power (W)</label>
                <Input
                  type="number"
                  value={config.alarmThresholds.power}
                  onChange={(e) => handleThresholdChange('power', parseFloat(e.target.value))}
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Vibration (mm/s)</label>
                <Input
                  type="number"
                  value={config.alarmThresholds.vibration}
                  onChange={(e) => handleThresholdChange('vibration', parseFloat(e.target.value))}
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </RoleAwareControl>
        
        {/* Active Alarms */}
        {alarms.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Active Alarms
              </h4>
              <div className="space-y-2">
                {alarms.map((alarm, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-red-700">{alarm}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PLCSimulationPanel;
