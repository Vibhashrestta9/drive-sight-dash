
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Circle, Zap, Settings } from 'lucide-react';

interface VFDControlPanelProps {
  vfd: any;
}

const VFDControlPanel = ({ vfd }: VFDControlPanelProps) => {
  const [targetFrequency, setTargetFrequency] = useState(30);

  const handleStart = () => {
    console.log('Start button clicked, target frequency:', targetFrequency);
    vfd.startDrive(targetFrequency);
  };

  const handleStop = () => {
    console.log('Stop button clicked');
    vfd.stopDrive();
  };

  const handleEmergencyStop = () => {
    console.log('Emergency stop button clicked');
    vfd.emergencyStop();
  };

  const handleClearFaults = () => {
    console.log('Clear faults button clicked');
    vfd.clearFaults();
  };

  return (
    <div className="space-y-6">
      {/* Main Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Circle className="h-5 w-5" />
            Drive Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Frequency (Hz)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={targetFrequency}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    console.log('Frequency input changed to:', value);
                    setTargetFrequency(value);
                  }}
                  min="0"
                  max={vfd.parameters.maxFrequency}
                  step="0.1"
                  placeholder="Enter frequency"
                />
                <Button
                  onClick={handleStart}
                  disabled={vfd.state.status === 'fault' || targetFrequency <= 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Frequency</label>
              <div className="text-2xl font-bold text-blue-600">
                {vfd.state.frequency.toFixed(1)} Hz
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Motor Speed</label>
              <div className="text-2xl font-bold text-green-600">
                {vfd.state.speed.toFixed(0)} RPM
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Badge className={
                vfd.state.status === 'running' ? 'bg-green-100 text-green-800' :
                vfd.state.status === 'fault' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }>
                {vfd.state.status.toUpperCase()}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleStop}
              disabled={vfd.state.status !== 'running'}
              variant="outline"
            >
              Stop
            </Button>
            <Button
              onClick={handleEmergencyStop}
              className="bg-red-600 hover:bg-red-700"
            >
              E-Stop
            </Button>
            <Button
              onClick={handleClearFaults}
              disabled={vfd.activeFaults.length === 0}
              variant="outline"
            >
              Clear Faults ({vfd.activeFaults.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Test Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Test Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <Button 
              onClick={() => {
                setTargetFrequency(15);
                vfd.startDrive(15);
              }}
              variant="outline"
              disabled={vfd.state.status === 'fault'}
            >
              25% Speed
            </Button>
            <Button 
              onClick={() => {
                setTargetFrequency(30);
                vfd.startDrive(30);
              }}
              variant="outline"
              disabled={vfd.state.status === 'fault'}
            >
              50% Speed
            </Button>
            <Button 
              onClick={() => {
                setTargetFrequency(45);
                vfd.startDrive(45);
              }}
              variant="outline"
              disabled={vfd.state.status === 'fault'}
            >
              75% Speed
            </Button>
            <Button 
              onClick={() => {
                setTargetFrequency(60);
                vfd.startDrive(60);
              }}
              variant="outline"
              disabled={vfd.state.status === 'fault'}
            >
              100% Speed
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* V/F Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            V/F Profile & Control Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Control Mode</label>
              <Select
                value={vfd.parameters.controlMode}
                onValueChange={(value) => {
                  console.log('Control mode changed to:', value);
                  vfd.setParameters(prev => ({ ...prev, controlMode: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open-loop">Open Loop</SelectItem>
                  <SelectItem value="closed-loop">Closed Loop</SelectItem>
                  <SelectItem value="pid-control">PID Control</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">V/F Profile</label>
              <Select
                value={vfd.parameters.vfProfile}
                onValueChange={(value) => {
                  console.log('V/F profile changed to:', value);
                  vfd.setParameters(prev => ({ ...prev, vfProfile: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="constant">Constant V/F</SelectItem>
                  <SelectItem value="variable-torque">Variable Torque</SelectItem>
                  <SelectItem value="sensorless-vector">Sensorless Vector</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Motor Load Type</label>
              <Select
                value={vfd.parameters.motorLoadType}
                onValueChange={(value) => {
                  console.log('Motor load type changed to:', value);
                  vfd.setParameters(prev => ({ ...prev, motorLoadType: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="constant-torque">Constant Torque</SelectItem>
                  <SelectItem value="variable-torque">Variable Torque</SelectItem>
                  <SelectItem value="shock-load">Shock Load</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* PID Parameters */}
          {vfd.parameters.controlMode === 'pid-control' && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">PID Parameters</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Kp (Proportional)</label>
                  <Input
                    type="number"
                    value={vfd.parameters.pidKp}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      console.log('PID Kp changed to:', value);
                      vfd.setParameters(prev => ({ ...prev, pidKp: value }));
                    }}
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Ki (Integral)</label>
                  <Input
                    type="number"
                    value={vfd.parameters.pidKi}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      console.log('PID Ki changed to:', value);
                      vfd.setParameters(prev => ({ ...prev, pidKi: value }));
                    }}
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Kd (Derivative)</label>
                  <Input
                    type="number"
                    value={vfd.parameters.pidKd}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      console.log('PID Kd changed to:', value);
                      vfd.setParameters(prev => ({ ...prev, pidKd: value }));
                    }}
                    step="0.001"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drive Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Drive Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Max Frequency (Hz)</label>
              <Input
                type="number"
                value={vfd.parameters.maxFrequency}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  console.log('Max frequency changed to:', value);
                  vfd.setParameters(prev => ({ ...prev, maxFrequency: value }));
                }}
                min="1"
                max="400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Ramp Up Time (s)</label>
              <Input
                type="number"
                value={vfd.parameters.rampUpTime}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  console.log('Ramp up time changed to:', value);
                  vfd.setParameters(prev => ({ ...prev, rampUpTime: value }));
                }}
                min="0.1"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Ramp Down Time (s)</label>
              <Input
                type="number"
                value={vfd.parameters.rampDownTime}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  console.log('Ramp down time changed to:', value);
                  vfd.setParameters(prev => ({ ...prev, rampDownTime: value }));
                }}
                min="0.1"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Max Torque (%)</label>
              <Input
                type="number"
                value={vfd.parameters.maxTorque}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  console.log('Max torque changed to:', value);
                  vfd.setParameters(prev => ({ ...prev, maxTorque: value }));
                }}
                min="10"
                max="200"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                checked={vfd.parameters.softStart}
                onCheckedChange={(checked) => {
                  console.log('Soft start changed to:', checked);
                  vfd.setParameters(prev => ({ ...prev, softStart: checked }));
                }}
              />
              <label className="text-sm">Soft Start</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={vfd.parameters.brakingResistor}
                onCheckedChange={(checked) => {
                  console.log('Braking resistor changed to:', checked);
                  vfd.setParameters(prev => ({ ...prev, brakingResistor: checked }));
                }}
              />
              <label className="text-sm">Braking Resistor</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={vfd.parameters.thermalDerating}
                onCheckedChange={(checked) => {
                  console.log('Thermal derating changed to:', checked);
                  vfd.setParameters(prev => ({ ...prev, thermalDerating: checked }));
                }}
              />
              <label className="text-sm">Thermal Derating</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Measurements */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-blue-600">
                {vfd.state.voltage.toFixed(1)}V
              </div>
              <div className="text-sm text-gray-600">Output Voltage</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (vfd.state.voltage / 480) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-green-600">
                {vfd.state.current.toFixed(1)}A
              </div>
              <div className="text-sm text-gray-600">Output Current</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (vfd.state.current / 50) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-purple-600">
                {vfd.state.power.toFixed(2)}kW
              </div>
              <div className="text-sm text-gray-600">Active Power</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (vfd.state.power / 50) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-orange-600">
                {vfd.state.efficiency.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Efficiency</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${vfd.state.efficiency}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fault Injection for Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Fault Injection (Testing)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            <Button 
              onClick={() => vfd.injectFault('F001')}
              variant="outline"
              className="text-red-600"
            >
              Overvoltage
            </Button>
            <Button 
              onClick={() => vfd.injectFault('F002')}
              variant="outline"
              className="text-red-600"
            >
              Overcurrent
            </Button>
            <Button 
              onClick={() => vfd.injectFault('F003')}
              variant="outline"
              className="text-yellow-600"
            >
              Overtemp
            </Button>
            <Button 
              onClick={() => vfd.injectFault('F004')}
              variant="outline"
              className="text-red-600"
            >
              Phase Loss
            </Button>
            <Button 
              onClick={() => vfd.injectFault('F005')}
              variant="outline"
              className="text-red-600"
            >
              Ground Fault
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VFDControlPanel;
