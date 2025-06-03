
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Network, Wifi, WifiOff, Activity, AlertTriangle } from 'lucide-react';
import { CommunicationConfig } from '@/types/advancedSimulationTypes';

interface CommunicationPanelProps {
  config: CommunicationConfig;
  onConfigChange: (config: CommunicationConfig) => void;
}

const CommunicationPanel = ({ config, onConfigChange }: CommunicationPanelProps) => {
  const [connectionLogs, setConnectionLogs] = useState<string[]>([
    '[09:30:15] Connection established to PLC-001',
    '[09:30:16] Packet received - Temperature: 45.2°C',
    '[09:30:17] Packet sent - Control command ACK',
    '[09:30:18] Warning: High latency detected (150ms)',
    '[09:30:19] Packet lost - Retry attempt 1'
  ]);

  const [testResults, setTestResults] = useState({
    packetseSent: 0,
    packetsReceived: 0,
    packetsLost: 0,
    avgLatency: 0,
    jitter: 0,
    isRunning: false
  });

  const presetConfigurations = [
    { name: 'Perfect Network', latency: 0, packetLoss: 0, jitter: 0 },
    { name: 'Good Network', latency: 10, packetLoss: 0.1, jitter: 2 },
    { name: 'Average Network', latency: 50, packetLoss: 1, jitter: 10 },
    { name: 'Poor Network', latency: 150, packetLoss: 5, jitter: 30 },
    { name: 'Very Poor Network', latency: 300, packetLoss: 15, jitter: 100 }
  ];

  const runConnectionTest = () => {
    setTestResults(prev => ({ ...prev, isRunning: true }));
    
    // Simulate connection test
    setTimeout(() => {
      const sent = 100;
      const lostRate = config.packetLoss / 100;
      const lost = Math.floor(sent * lostRate);
      const received = sent - lost;
      const avgLatency = config.latency + (Math.random() * config.jitter);
      
      setTestResults({
        packetseSent: sent,
        packetsReceived: received,
        packetsLost: lost,
        avgLatency: Math.round(avgLatency),
        jitter: Math.round(config.jitter),
        isRunning: false
      });
      
      // Add test result to logs
      const newLog = `[${new Date().toLocaleTimeString()}] Test completed - ${received}/${sent} packets successful, Avg latency: ${avgLatency.toFixed(0)}ms`;
      setConnectionLogs(prev => [...prev.slice(-4), newLog]);
    }, 2000);
  };

  const applyPreset = (preset: typeof presetConfigurations[0]) => {
    onConfigChange({
      ...config,
      latency: preset.latency,
      packetLoss: preset.packetLoss,
      jitter: preset.jitter
    });
  };

  const getConnectionQuality = () => {
    if (!config.enabled) return { label: 'Disabled', color: 'gray', icon: WifiOff };
    
    const score = 100 - (config.latency / 10) - (config.packetLoss * 5) - (config.jitter / 5);
    
    if (score >= 90) return { label: 'Excellent', color: 'green', icon: Wifi };
    if (score >= 70) return { label: 'Good', color: 'blue', icon: Wifi };
    if (score >= 50) return { label: 'Fair', color: 'yellow', icon: Wifi };
    if (score >= 30) return { label: 'Poor', color: 'orange', icon: Wifi };
    return { label: 'Very Poor', color: 'red', icon: WifiOff };
  };

  const quality = getConnectionQuality();
  const QualityIcon = quality.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Communication Simulation
          {config.enabled && (
            <Badge className={`bg-${quality.color}-100 text-${quality.color}-800`}>
              <QualityIcon className="h-3 w-3 mr-1" />
              {quality.label}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Simulate network conditions, latency, and packet loss
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Communication Simulation */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Communication Simulation</h4>
            <p className="text-sm text-gray-600">Enable network condition simulation</p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(enabled) => onConfigChange({ ...config, enabled })}
          />
        </div>

        {config.enabled && (
          <>
            <Separator />

            {/* Network Parameters */}
            <div className="space-y-4">
              <h4 className="font-medium">Network Parameters</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Latency (ms)</label>
                  <Input
                    type="number"
                    value={config.latency}
                    onChange={(e) => onConfigChange({
                      ...config,
                      latency: parseInt(e.target.value) || 0
                    })}
                    min="0"
                    max="1000"
                  />
                  <div className="text-xs text-gray-500">
                    Network delay in milliseconds
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Packet Loss (%)</label>
                  <Input
                    type="number"
                    value={config.packetLoss}
                    onChange={(e) => onConfigChange({
                      ...config,
                      packetLoss: parseFloat(e.target.value) || 0
                    })}
                    min="0"
                    max="50"
                    step="0.1"
                  />
                  <div className="text-xs text-gray-500">
                    Percentage of lost packets
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Jitter (ms)</label>
                  <Input
                    type="number"
                    value={config.jitter}
                    onChange={(e) => onConfigChange({
                      ...config,
                      jitter: parseInt(e.target.value) || 0
                    })}
                    min="0"
                    max="200"
                  />
                  <div className="text-xs text-gray-500">
                    Latency variation
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Preset Configurations */}
            <div className="space-y-3">
              <h4 className="font-medium">Quick Presets</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {presetConfigurations.map((preset, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => applyPreset(preset)}
                    className="text-xs h-auto py-2 px-3"
                  >
                    <div className="text-center">
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-500">
                        {preset.latency}ms • {preset.packetLoss}% • {preset.jitter}ms
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Connection Test */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Connection Test</h4>
                <Button 
                  onClick={runConnectionTest}
                  disabled={testResults.isRunning}
                  size="sm"
                >
                  {testResults.isRunning ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Run Test'
                  )}
                </Button>
              </div>
              
              {testResults.isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Testing connection...</span>
                    <span>Sending packets</span>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
              )}
              
              {testResults.packetseSent > 0 && !testResults.isRunning && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-bold">{testResults.packetseSent}</div>
                    <div className="text-xs text-gray-600">Sent</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-bold text-green-600">{testResults.packetsReceived}</div>
                    <div className="text-xs text-gray-600">Received</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-bold text-red-600">{testResults.packetsLost}</div>
                    <div className="text-xs text-gray-600">Lost</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-bold">{testResults.avgLatency}ms</div>
                    <div className="text-xs text-gray-600">Avg Latency</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-bold">{testResults.jitter}ms</div>
                    <div className="text-xs text-gray-600">Jitter</div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Connection Logs */}
            <div className="space-y-3">
              <h4 className="font-medium">Connection Logs</h4>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-32 overflow-y-auto">
                {connectionLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Warning for Poor Connection */}
            {(config.latency > 100 || config.packetLoss > 5) && (
              <>
                <Separator />
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Poor Network Conditions</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Current settings simulate degraded network performance. 
                    This may cause communication timeouts and data loss in the simulation.
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunicationPanel;
