
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, Monitor, Play, Pause, Square, Cpu } from 'lucide-react';
import { SimulationDevice } from '@/types/advancedSimulationTypes';

interface MultiDevicePanelProps {
  devices: SimulationDevice[];
  onDevicesChange: (devices: SimulationDevice[]) => void;
}

const MultiDevicePanel = ({ devices, onDevicesChange }: MultiDevicePanelProps) => {
  const [editingDevice, setEditingDevice] = useState<SimulationDevice | null>(null);
  const [groupControl, setGroupControl] = useState({
    isRunning: false,
    selectedDevices: [] as string[]
  });

  const deviceTypes = [
    { value: 'PLC', label: 'PLC Controller', icon: '🔧' },
    { value: 'Drive', label: 'Motor Drive', icon: '⚙️' },
    { value: 'Sensor', label: 'Sensor Module', icon: '📡' }
  ];

  const createNewDevice = () => {
    const newDevice: SimulationDevice = {
      id: `device_${Date.now()}`,
      name: 'New Device',
      type: 'PLC',
      registers: {
        temperature: 25,
        power: 0,
        vibration: 0,
        speed: 0
      },
      status: 'offline',
      lastUpdate: new Date()
    };
    setEditingDevice(newDevice);
  };

  const saveDevice = () => {
    if (!editingDevice) return;
    
    const existingIndex = devices.findIndex(d => d.id === editingDevice.id);
    if (existingIndex >= 0) {
      const updated = [...devices];
      updated[existingIndex] = editingDevice;
      onDevicesChange(updated);
    } else {
      onDevicesChange([...devices, editingDevice]);
    }
    setEditingDevice(null);
  };

  const deleteDevice = (deviceId: string) => {
    onDevicesChange(devices.filter(d => d.id !== deviceId));
    setGroupControl(prev => ({
      ...prev,
      selectedDevices: prev.selectedDevices.filter(id => id !== deviceId)
    }));
  };

  const toggleDeviceStatus = (deviceId: string) => {
    const updated = devices.map(device => 
      device.id === deviceId 
        ? { 
            ...device, 
            status: (device.status === 'online' ? 'offline' : 'online') as 'online' | 'offline' | 'error',
            lastUpdate: new Date()
          }
        : device
    );
    onDevicesChange(updated);
  };

  const toggleDeviceSelection = (deviceId: string) => {
    setGroupControl(prev => ({
      ...prev,
      selectedDevices: prev.selectedDevices.includes(deviceId)
        ? prev.selectedDevices.filter(id => id !== deviceId)
        : [...prev.selectedDevices, deviceId]
    }));
  };

  const selectAllDevices = () => {
    setGroupControl(prev => ({
      ...prev,
      selectedDevices: devices.map(d => d.id)
    }));
  };

  const clearSelection = () => {
    setGroupControl(prev => ({
      ...prev,
      selectedDevices: []
    }));
  };

  const startGroupSimulation = () => {
    groupControl.selectedDevices.forEach(deviceId => {
      const device = devices.find(d => d.id === deviceId);
      if (device && device.status === 'offline') {
        toggleDeviceStatus(deviceId);
      }
    });
    
    setGroupControl(prev => ({ ...prev, isRunning: true }));
    console.log(`🚀 Started simulation for ${groupControl.selectedDevices.length} devices`);
    
    // Simulate group operation
    setTimeout(() => {
      setGroupControl(prev => ({ ...prev, isRunning: false }));
    }, 5000);
  };

  const stopGroupSimulation = () => {
    setGroupControl(prev => ({ ...prev, isRunning: false }));
    console.log('⏹️ Stopped group simulation');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = (type: string) => {
    const deviceType = deviceTypes.find(t => t.value === type);
    return deviceType?.icon || '📱';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Multi-Device Simulation
          {groupControl.isRunning && (
            <Badge className="bg-blue-100 text-blue-800">
              GROUP RUNNING
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Simulate multiple PLCs, drives, and sensors concurrently
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Group Controls */}
        <div className="space-y-4">
          <h4 className="font-medium">Fleet Management</h4>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={selectAllDevices} variant="outline">
                  Select All
                </Button>
                <Button size="sm" onClick={clearSelection} variant="outline">
                  Clear
                </Button>
                <span className="text-sm text-gray-600">
                  {groupControl.selectedDevices.length} of {devices.length} selected
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm"
                onClick={startGroupSimulation}
                disabled={groupControl.isRunning || groupControl.selectedDevices.length === 0}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Group
              </Button>
              <Button 
                size="sm"
                onClick={stopGroupSimulation}
                disabled={!groupControl.isRunning}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Stop Group
              </Button>
              <Button size="sm" onClick={createNewDevice} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </div>
          </div>
          
          {groupControl.isRunning && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Group Simulation Active</span>
              </div>
              <Progress value={60} className="w-full" />
              <div className="text-sm text-blue-700 mt-2">
                Running concurrent simulation on {groupControl.selectedDevices.length} devices...
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Devices List */}
        <div className="space-y-3">
          <h4 className="font-medium">Connected Devices</h4>
          
          {devices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Monitor className="h-8 w-8 mx-auto mb-2" />
              <p>No devices configured</p>
              <p className="text-sm">Add devices to simulate a multi-device environment</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {devices.map((device) => {
                const isSelected = groupControl.selectedDevices.includes(device.id);
                
                return (
                  <div
                    key={device.id}
                    className={`border rounded-lg p-4 ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleDeviceSelection(device.id)}
                          className="rounded"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getDeviceIcon(device.type)}</span>
                          <div>
                            <div className="font-medium">{device.name}</div>
                            <div className="text-sm text-gray-600">
                              {device.type} • Last update: {device.lastUpdate.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(device.status)}>
                          {device.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleDeviceStatus(device.id)}
                        >
                          {device.status === 'online' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingDevice(device)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteDevice(device.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Device Registers */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {Object.entries(device.registers).map(([param, value]) => (
                        <div key={param} className="text-center p-2 bg-white rounded border">
                          <div className="font-medium capitalize">{param}</div>
                          <div className="text-lg font-bold">
                            {typeof value === 'number' ? value.toFixed(1) : value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Device Editor */}
        {editingDevice && (
          <>
            <Separator />
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-4">Edit Device</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Device Name</label>
                    <Input
                      value={editingDevice.name}
                      onChange={(e) => setEditingDevice({
                        ...editingDevice,
                        name: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Device Type</label>
                    <Select
                      value={editingDevice.type}
                      onValueChange={(value: 'PLC' | 'Drive' | 'Sensor') => setEditingDevice({
                        ...editingDevice,
                        type: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {deviceTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Initial Register Values</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(editingDevice.registers).map(([param, value]) => (
                      <div key={param}>
                        <label className="text-xs capitalize">{param}</label>
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => setEditingDevice({
                            ...editingDevice,
                            registers: {
                              ...editingDevice.registers,
                              [param]: parseFloat(e.target.value) || 0
                            }
                          })}
                          step="0.1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={saveDevice}>Save Device</Button>
                  <Button variant="outline" onClick={() => setEditingDevice(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Fleet Statistics */}
        {devices.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Fleet Overview</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold">{devices.length}</div>
                  <div className="text-sm text-gray-600">Total Devices</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {devices.filter(d => d.status === 'online').length}
                  </div>
                  <div className="text-sm text-gray-600">Online</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {devices.filter(d => d.status === 'offline').length}
                  </div>
                  <div className="text-sm text-gray-600">Offline</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {devices.filter(d => d.status === 'error').length}
                  </div>
                  <div className="text-sm text-gray-600">Error</div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiDevicePanel;
