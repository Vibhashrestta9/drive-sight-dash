
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Circle, Zap, Settings } from 'lucide-react';

interface VFDControlPanelProps {
  vfd: any;
}

const VFDControlPanel = ({ vfd }: VFDControlPanelProps) => {
  const [targetFrequency, setTargetFrequency] = useState(0);

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
              <label className="text-sm font-medium">Frequency (Hz)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={targetFrequency}
                  onChange={(e) => setTargetFrequency(Number(e.target.value))}
                  min="0"
                  max={vfd.parameters.maxFrequency}
                  step="0.1"
                />
                <Button
                  onClick={() => vfd.startDrive(targetFrequency)}
                  disabled={vfd.state.status === 'fault'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Output</label>
              <div className="text-2xl font-bold">
                {vfd.state.frequency.toFixed(1)} Hz
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Motor Speed</label>
              <div className="text-2xl font-bold">
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
              onClick={vfd.stopDrive}
              disabled={vfd.state.status !== 'running'}
              variant="outline"
            >
              Stop
            </Button>
            <Button
              onClick={vfd.emergencyStop}
              className="bg-red-600 hover:bg-red-700"
            >
              E-Stop
            </Button>
            <Button
              onClick={vfd.clearFaults}
              disabled={vfd.activeFaults.length === 0}
              variant="outline"
            >
              Clear Faults
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
                onValueChange={(value) => vfd.setParameters(prev => ({ ...prev, controlMode: value }))}
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
                onValueChange={(value) => vfd.setParameters(prev => ({ ...prev, vfProfile: value }))}
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
                onValueChange={(value) => vfd.setParameters(prev => ({ ...prev, motorLoadType: value }))}
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
                    onChange={(e) => vfd.setParameters(prev => ({ ...prev, pidKp: Number(e.target.value) }))}
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Ki (Integral)</label>
                  <Input
                    type="number"
                    value={vfd.parameters.pidKi}
                    onChange={(e) => vfd.setParameters(prev => ({ ...prev, pidKi: Number(e.target.value) }))}
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Kd (Derivative)</label>
                  <Input
                    type="number"
                    value={vfd.parameters.pidKd}
                    onChange={(e) => vfd.setParameters(prev => ({ ...prev, pidKd: Number(e.target.value) }))}
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
                onChange={(e) => vfd.setParameters(prev => ({ ...prev, maxFrequency: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Ramp Up Time (s)</label>
              <Input
                type="number"
                value={vfd.parameters.rampUpTime}
                onChange={(e) => vfd.setParameters(prev => ({ ...prev, rampUpTime: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Ramp Down Time (s)</label>
              <Input
                type="number"
                value={vfd.parameters.rampDownTime}
                onChange={(e) => vfd.setParameters(prev => ({ ...prev, rampDownTime: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Max Torque (%)</label>
              <Input
                type="number"
                value={vfd.parameters.maxTorque}
                onChange={(e) => vfd.setParameters(prev => ({ ...prev, maxTorque: Number(e.target.value) }))}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                checked={vfd.parameters.softStart}
                onCheckedChange={(checked) => vfd.setParameters(prev => ({ ...prev, softStart: checked }))}
              />
              <label className="text-sm">Soft Start</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={vfd.parameters.brakingResistor}
                onCheckedChange={(checked) => vfd.setParameters(prev => ({ ...prev, brakingResistor: checked }))}
              />
              <label className="text-sm">Braking Resistor</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={vfd.parameters.thermalDerating}
                onCheckedChange={(checked) => vfd.setParameters(prev => ({ ...prev, thermalDerating: checked }))}
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
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-green-600">
                {vfd.state.current.toFixed(1)}A
              </div>
              <div className="text-sm text-gray-600">Output Current</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-purple-600">
                {vfd.state.power.toFixed(2)}kW
              </div>
              <div className="text-sm text-gray-600">Active Power</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-orange-600">
                {vfd.state.efficiency.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Efficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VFDControlPanel;
