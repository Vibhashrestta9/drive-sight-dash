
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Cloud, Laptop, HardDrive, Network, Activity, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useDigitalTwin } from '@/hooks/useDigitalTwin';
import { useToast } from '@/hooks/use-toast';

// Twin data structure
interface TwinParameter {
  name: string;
  edgeValue: string | number;
  cloudValue: string | number;
  syncStatus: 'synced' | 'pending' | 'conflict';
  lastUpdated: string;
}

const DigitalTwin = () => {
  const { 
    edgeStatus, 
    cloudStatus, 
    syncStatus, 
    syncProgress, 
    lastSyncTime,
    syncHealth,
    triggerSync,
    resetTwin
  } = useDigitalTwin();
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock twin parameters
  const twinParameters: TwinParameter[] = [
    { 
      name: 'System Temperature', 
      edgeValue: '54.2°C', 
      cloudValue: '54.1°C', 
      syncStatus: 'synced',
      lastUpdated: '2 mins ago' 
    },
    { 
      name: 'Power Consumption', 
      edgeValue: '276W', 
      cloudValue: '270W', 
      syncStatus: 'pending',
      lastUpdated: '5 mins ago' 
    },
    { 
      name: 'Operational Hours', 
      edgeValue: 4321, 
      cloudValue: 4320, 
      syncStatus: 'synced',
      lastUpdated: '2 mins ago' 
    },
    { 
      name: 'Current Load', 
      edgeValue: '68%', 
      cloudValue: '65%', 
      syncStatus: 'conflict',
      lastUpdated: '10 mins ago' 
    },
    { 
      name: 'Response Time', 
      edgeValue: '120ms', 
      cloudValue: '122ms', 
      syncStatus: 'synced',
      lastUpdated: '1 min ago' 
    }
  ];

  const handleManualSync = () => {
    if (syncStatus === 'in_progress') {
      toast({
        title: "Sync already in progress",
        description: "Please wait for the current sync to complete",
      });
      return;
    }
    
    toast({
      title: "Sync initiated",
      description: "Edge and cloud models synchronization started",
    });
    triggerSync();
  };

  const handleReset = () => {
    resetTwin();
    toast({
      title: "Digital Twin reset",
      description: "All models restored to normal operation",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Digital Twin Management</h1>
          </div>
          <p className="text-gray-600">Edge-Cloud hybrid model synchronization and management</p>
        </header>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Status Panel */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Twin Status</CardTitle>
              <CardDescription>Current state of edge and cloud models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Edge Status */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Laptop className="h-5 w-5 text-gray-600" />
                    <div className="font-medium">Edge Model</div>
                    <Badge 
                      className={`${
                        edgeStatus === 'online' ? 'bg-green-500' : 
                        edgeStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    >
                      {edgeStatus}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Local edge processing for real-time analysis and control
                  </div>
                  
                  <div className="text-sm grid grid-cols-2 gap-x-2 gap-y-1">
                    <div className="font-medium">Processing:</div>
                    <div>Real-time</div>
                    
                    <div className="font-medium">Data Latency:</div>
                    <div>{'<5ms'}</div>
                    
                    <div className="font-medium">Storage:</div>
                    <div>72 hours</div>
                  </div>
                </div>
                
                {/* Cloud Status */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud className="h-5 w-5 text-gray-600" />
                    <div className="font-medium">Cloud Model</div>
                    <Badge 
                      className={`${
                        cloudStatus === 'online' ? 'bg-green-500' : 
                        cloudStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    >
                      {cloudStatus}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Long-term storage and advanced analytics capabilities
                  </div>
                  
                  <div className="text-sm grid grid-cols-2 gap-x-2 gap-y-1">
                    <div className="font-medium">Processing:</div>
                    <div>Batch</div>
                    
                    <div className="font-medium">Data Latency:</div>
                    <div>5-20min</div>
                    
                    <div className="font-medium">Storage:</div>
                    <div>5 years</div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Sync Status */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">Synchronization Status</div>
                  <div className="text-sm text-gray-500">
                    {syncStatus === 'in_progress' ? 'Syncing...' : 
                     syncStatus === 'completed' ? 'Last synced' : 
                     syncStatus === 'failed' ? 'Sync failed' : 'Waiting'}: 
                    {syncStatus !== 'waiting' && lastSyncTime && ` ${lastSyncTime}`}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className={`h-4 w-4 ${
                    syncStatus === 'in_progress' ? 'animate-spin text-blue-500' : 
                    syncStatus === 'completed' ? 'text-green-500' : 
                    syncStatus === 'failed' ? 'text-red-500' : 'text-gray-500'
                  }`} />
                  <Progress 
                    value={syncProgress} 
                    className={`h-2 ${
                      syncStatus === 'in_progress' ? 'bg-blue-100' : 
                      syncStatus === 'completed' ? 'bg-green-100' : 
                      syncStatus === 'failed' ? 'bg-red-100' : 'bg-gray-100'
                    }`}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleManualSync}
                  disabled={syncStatus === 'in_progress'}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Manual Sync
                </Button>
                <Button 
                  onClick={handleReset}
                  variant="outline"
                >
                  Reset Twin Status
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Health Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Twin Health</CardTitle>
              <CardDescription>Overall system integrity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#e5e7eb" 
                      strokeWidth="8" 
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke={syncHealth >= 90 ? "#10b981" : 
                             syncHealth >= 70 ? "#f59e0b" : "#ef4444"} 
                      strokeWidth="8" 
                      strokeDasharray={`${syncHealth * 2.83} ${283 - syncHealth * 2.83}`} 
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold">{syncHealth}%</span>
                    <span className="text-sm text-gray-500">Health Score</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">98%</div>
                  <div className="text-xs text-gray-500">Data Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">99%</div>
                  <div className="text-xs text-gray-500">Model Consistency</div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-sm text-gray-600">
                <div className="font-medium mb-2">Recent Twin Events:</div>
                <div className="space-y-1">
                  <div>• Cloud sync completed (2 mins ago)</div>
                  <div>• Model parameters updated (5 mins ago)</div>
                  <div>• Behavioral profile refreshed (10 mins ago)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for Twin Data */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="sync-config">Sync Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Twin Architecture */}
              <Card>
                <CardHeader>
                  <CardTitle>Twin Architecture</CardTitle>
                  <CardDescription>Edge-Cloud hybrid processing model</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-6">
                    <div className="relative p-4">
                      {/* Architecture diagram */}
                      <div className="flex flex-col items-center gap-6">
                        {/* Edge side */}
                        <div className="flex items-center gap-4 border border-gray-200 bg-gray-50 p-3 rounded-lg w-full">
                          <Laptop className="h-6 w-6 text-blue-600" />
                          <div>
                            <div className="font-medium">Edge Processing</div>
                            <div className="text-xs text-gray-500">Real-time control loop</div>
                          </div>
                        </div>
                        
                        {/* Connection */}
                        <div className="h-8 border-l-2 border-dashed border-gray-300 relative">
                          <Network className="absolute -left-3 -top-3 h-5 w-5 text-gray-400" />
                        </div>
                        
                        {/* Cloud side */}
                        <div className="flex items-center gap-4 border border-gray-200 bg-gray-50 p-3 rounded-lg w-full">
                          <Cloud className="h-6 w-6 text-indigo-600" />
                          <div>
                            <div className="font-medium">Cloud Processing</div>
                            <div className="text-xs text-gray-500">Historical analysis</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium mb-2">Architecture Benefits:</div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                      <div>• Real-time local control</div>
                      <div>• Low-latency response</div>
                      <div>• Offline capability</div>
                      <div>• Historical analytics</div>
                      <div>• Remote monitoring</div>
                      <div>• Scalable storage</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Twin Data Flow */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Flow Summary</CardTitle>
                  <CardDescription>How data moves between models</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Edge → Cloud Transfer</div>
                        <div className="text-xs text-gray-500">~500KB/hour</div>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Cloud → Edge Updates</div>
                        <div className="text-xs text-gray-500">~50KB/hour</div>
                      </div>
                      <Progress value={62} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Sync Reliability</div>
                        <div className="text-xs text-gray-500">Last 24 hrs</div>
                      </div>
                      <Progress value={99} className="h-2" />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="text-sm">
                    <div className="font-medium mb-2">Sync Protocol:</div>
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span>MQTT over TLS</span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>• Optimized for low bandwidth environments</div>
                      <div>• Automatic retry for failed transfers</div>
                      <div>• Smart delta sync (changes only)</div>
                      <div>• Conflict resolution favors edge for operational data</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="parameters">
            <Card>
              <CardHeader>
                <CardTitle>Twin Parameters</CardTitle>
                <CardDescription>Synchronized data points between edge and cloud</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-2 font-medium">Parameter</th>
                        <th className="pb-2 font-medium">Edge Value</th>
                        <th className="pb-2 font-medium">Cloud Value</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Last Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {twinParameters.map((param, index) => (
                        <tr key={index} className="text-sm">
                          <td className="py-3 font-medium">{param.name}</td>
                          <td className="py-3">{param.edgeValue}</td>
                          <td className="py-3">{param.cloudValue}</td>
                          <td className="py-3">
                            <Badge className={`${
                              param.syncStatus === 'synced' ? 'bg-green-100 text-green-800' : 
                              param.syncStatus === 'pending' ? 'bg-blue-100 text-blue-800' : 
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {param.syncStatus}
                            </Badge>
                          </td>
                          <td className="py-3 text-gray-500">{param.lastUpdated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  Showing 5 of 42 parameters • 
                  <button className="text-blue-600 hover:text-blue-800 ml-1">
                    View All Parameters
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sync-config">
            <Card>
              <CardHeader>
                <CardTitle>Synchronization Configuration</CardTitle>
                <CardDescription>Configure how and when twin models are synchronized</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Sync Schedule</div>
                      <div className="flex items-center gap-2 text-sm">
                        <HardDrive className="h-4 w-4 text-gray-500" />
                        <span>Auto-sync every 15 minutes</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Last Full Sync</div>
                      <div className="flex items-center gap-2 text-sm">
                        <BarChart className="h-4 w-4 text-gray-500" />
                        <span>Today, 11:45 AM</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Sync Priority</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Network className="h-4 w-4 text-gray-500" />
                        <span>Operational data first, then analytics</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Bandwidth Limit</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <span>2MB per hour (50% of available)</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Security</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Cloud className="h-4 w-4 text-gray-500" />
                        <span>TLS 1.3 with mutual authentication</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Edge Retention</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Laptop className="h-4 w-4 text-gray-500" />
                        <span>72 hours for high-frequency data</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-4">
                  <Button disabled className="flex items-center gap-2">
                    Edit Configuration
                  </Button>
                  <Button variant="outline" disabled>
                    Export Configuration
                  </Button>
                </div>
                
                <div className="mt-4 text-xs text-gray-500">
                  Note: Configuration editing is disabled in the demo mode. In a production environment, 
                  you would be able to customize all sync parameters.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DigitalTwin;
