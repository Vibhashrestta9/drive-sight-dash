
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, Zap, Monitor, Bell } from 'lucide-react';

interface VFDIntegrationPanelProps {
  vfd: any;
}

const VFDIntegrationPanel = ({ vfd }: VFDIntegrationPanelProps) => {
  const [modbusConfig, setModbusConfig] = useState({
    enabled: false,
    ipAddress: '192.168.1.100',
    port: 502,
    slaveId: 1
  });

  const [opcConfig, setOpcConfig] = useState({
    enabled: false,
    endpoint: 'opc.tcp://localhost:4840',
    namespace: 'VFD_Simulation'
  });

  const [restConfig, setRestConfig] = useState({
    enabled: false,
    port: 8080,
    endpoint: '/api/vfd'
  });

  const [mqttConfig, setMqttConfig] = useState({
    enabled: false,
    broker: 'localhost:1883',
    topic: 'vfd/data',
    username: '',
    password: ''
  });

  const modbusRegisters = [
    { address: 40001, name: 'Frequency', value: vfd.state.frequency, unit: 'Hz' },
    { address: 40002, name: 'Voltage', value: vfd.state.voltage, unit: 'V' },
    { address: 40003, name: 'Current', value: vfd.state.current, unit: 'A' },
    { address: 40004, name: 'Power', value: vfd.state.power, unit: 'kW' },
    { address: 40005, name: 'Speed', value: vfd.state.speed, unit: 'RPM' },
    { address: 40006, name: 'Torque', value: vfd.state.torque, unit: '%' },
    { address: 40007, name: 'Temperature', value: vfd.state.temperature, unit: '°C' },
    { address: 40008, name: 'DC Bus Voltage', value: vfd.state.dcBusVoltage, unit: 'V' }
  ];

  const opcTags = [
    { nodeId: 'ns=2;s=VFD.Frequency', value: vfd.state.frequency },
    { nodeId: 'ns=2;s=VFD.Voltage', value: vfd.state.voltage },
    { nodeId: 'ns=2;s=VFD.Current', value: vfd.state.current },
    { nodeId: 'ns=2;s=VFD.Power', value: vfd.state.power },
    { nodeId: 'ns=2;s=VFD.Status', value: vfd.state.status },
    { nodeId: 'ns=2;s=VFD.FaultCount', value: vfd.activeFaults.length }
  ];

  const simulateDataPublish = (protocol: string) => {
    const data = {
      timestamp: new Date().toISOString(),
      frequency: vfd.state.frequency,
      voltage: vfd.state.voltage,
      current: vfd.state.current,
      power: vfd.state.power,
      status: vfd.state.status,
      faults: vfd.activeFaults.length
    };
    
    console.log(`📡 ${protocol} Data Published:`, data);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="modbus">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modbus">Modbus</TabsTrigger>
          <TabsTrigger value="opcua">OPC-UA</TabsTrigger>
          <TabsTrigger value="rest">REST API</TabsTrigger>
          <TabsTrigger value="mqtt">MQTT</TabsTrigger>
        </TabsList>

        {/* Modbus Configuration */}
        <TabsContent value="modbus">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Modbus TCP Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={modbusConfig.enabled}
                  onCheckedChange={(checked) => setModbusConfig(prev => ({ ...prev, enabled: checked }))}
                />
                <label className="font-medium">Enable Modbus TCP Server</label>
                {modbusConfig.enabled && (
                  <Badge className="bg-green-100 text-green-800">ACTIVE</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">IP Address</label>
                  <Input
                    value={modbusConfig.ipAddress}
                    onChange={(e) => setModbusConfig(prev => ({ ...prev, ipAddress: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Port</label>
                  <Input
                    type="number"
                    value={modbusConfig.port}
                    onChange={(e) => setModbusConfig(prev => ({ ...prev, port: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Slave ID</label>
                  <Input
                    type="number"
                    value={modbusConfig.slaveId}
                    onChange={(e) => setModbusConfig(prev => ({ ...prev, slaveId: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Register Map</h4>
                <div className="border rounded-lg">
                  <div className="grid grid-cols-4 gap-2 p-2 bg-gray-50 font-medium text-sm">
                    <div>Address</div>
                    <div>Parameter</div>
                    <div>Value</div>
                    <div>Unit</div>
                  </div>
                  {modbusRegisters.map((reg, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 p-2 border-t text-sm">
                      <div className="font-mono">{reg.address}</div>
                      <div>{reg.name}</div>
                      <div className="font-bold">{reg.value.toFixed(1)}</div>
                      <div className="text-gray-600">{reg.unit}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => simulateDataPublish('Modbus')}
                disabled={!modbusConfig.enabled}
              >
                Test Modbus Communication
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OPC-UA Configuration */}
        <TabsContent value="opcua">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                OPC-UA Server Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={opcConfig.enabled}
                  onCheckedChange={(checked) => setOpcConfig(prev => ({ ...prev, enabled: checked }))}
                />
                <label className="font-medium">Enable OPC-UA Server</label>
                {opcConfig.enabled && (
                  <Badge className="bg-blue-100 text-blue-800">ACTIVE</Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Endpoint URL</label>
                  <Input
                    value={opcConfig.endpoint}
                    onChange={(e) => setOpcConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Namespace</label>
                  <Input
                    value={opcConfig.namespace}
                    onChange={(e) => setOpcConfig(prev => ({ ...prev, namespace: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Available Tags</h4>
                <div className="border rounded-lg">
                  <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 font-medium text-sm">
                    <div>Node ID</div>
                    <div>Current Value</div>
                  </div>
                  {opcTags.map((tag, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 p-2 border-t text-sm">
                      <div className="font-mono text-xs">{tag.nodeId}</div>
                      <div className="font-bold">{tag.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => simulateDataPublish('OPC-UA')}
                disabled={!opcConfig.enabled}
              >
                Test OPC-UA Communication
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REST API Configuration */}
        <TabsContent value="rest">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                REST API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={restConfig.enabled}
                  onCheckedChange={(checked) => setRestConfig(prev => ({ ...prev, enabled: checked }))}
                />
                <label className="font-medium">Enable REST API Server</label>
                {restConfig.enabled && (
                  <Badge className="bg-purple-100 text-purple-800">ACTIVE</Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Port</label>
                  <Input
                    type="number"
                    value={restConfig.port}
                    onChange={(e) => setRestConfig(prev => ({ ...prev, port: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Endpoint</label>
                  <Input
                    value={restConfig.endpoint}
                    onChange={(e) => setRestConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Available Endpoints</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">GET</Badge>
                    <code>localhost:{restConfig.port}{restConfig.endpoint}/status</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">GET</Badge>
                    <code>localhost:{restConfig.port}{restConfig.endpoint}/parameters</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">POST</Badge>
                    <code>localhost:{restConfig.port}{restConfig.endpoint}/start</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">POST</Badge>
                    <code>localhost:{restConfig.port}{restConfig.endpoint}/stop</code>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => simulateDataPublish('REST API')}
                disabled={!restConfig.enabled}
              >
                Test REST API
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MQTT Configuration */}
        <TabsContent value="mqtt">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                MQTT Publisher Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={mqttConfig.enabled}
                  onCheckedChange={(checked) => setMqttConfig(prev => ({ ...prev, enabled: checked }))}
                />
                <label className="font-medium">Enable MQTT Publishing</label>
                {mqttConfig.enabled && (
                  <Badge className="bg-orange-100 text-orange-800">ACTIVE</Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Broker Address</label>
                  <Input
                    value={mqttConfig.broker}
                    onChange={(e) => setMqttConfig(prev => ({ ...prev, broker: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Topic</label>
                  <Input
                    value={mqttConfig.topic}
                    onChange={(e) => setMqttConfig(prev => ({ ...prev, topic: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Username</label>
                  <Input
                    value={mqttConfig.username}
                    onChange={(e) => setMqttConfig(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Password</label>
                  <Input
                    type="password"
                    value={mqttConfig.password}
                    onChange={(e) => setMqttConfig(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Published Topics</h4>
                <div className="space-y-1 text-sm">
                  <div><code>{mqttConfig.topic}/frequency</code></div>
                  <div><code>{mqttConfig.topic}/voltage</code></div>
                  <div><code>{mqttConfig.topic}/current</code></div>
                  <div><code>{mqttConfig.topic}/power</code></div>
                  <div><code>{mqttConfig.topic}/status</code></div>
                  <div><code>{mqttConfig.topic}/faults</code></div>
                </div>
              </div>

              <Button 
                onClick={() => simulateDataPublish('MQTT')}
                disabled={!mqttConfig.enabled}
              >
                Test MQTT Publishing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VFDIntegrationPanel;
