import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  AlertTriangle, 
  ThermometerIcon, 
  ZapIcon, 
  ClockIcon,
  ActivityIcon,
  ServerIcon,
  HistoryIcon,
  RefreshCwIcon,
  WifiIcon,
  DropletIcon,
  MonitorIcon,
  GaugeIcon,
  RotateCwIcon,
  WrenchIcon
} from 'lucide-react';
import { 
  RMDEDrive, 
  RMDEError, 
  RMDEModule,
  RMDESystemStatus,
  RMDEFault,
  generateInitialRMDEData, 
  updateRMDEData, 
  getStatusBadgeClass,
  getHealthColor,
  generateNETAModules,
  generateRMDESystemStatus,
  fetchDriveDataFromAPI,
  sendEmailNotification
} from '@/utils/rmdeUtils';

const RMDEDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [rmdeData, setRmdeData] = useState<RMDEDrive[]>([]);
  const [netaModules, setNetaModules] = useState<RMDEModule[]>([]);
  const [rmdeSystemStatus, setRmdeSystemStatus] = useState<RMDESystemStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [criticalErrors, setCriticalErrors] = useState<{drive: RMDEDrive, error: RMDEError}[]>([]);
  const [apiPolling, setApiPolling] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize data
    const data = generateInitialRMDEData();
    const modules = generateNETAModules();
    const systemStatus = generateRMDESystemStatus();
    setRmdeData(data);
    setNetaModules(modules);
    setRmdeSystemStatus(systemStatus);
    setLoading(false);
    
    // Check for critical errors in initial data
    checkForCriticalErrors(data);

    // Set up interval for real-time updates
    const interval = setInterval(() => {
      setRmdeData(prevData => {
        const updatedData = updateRMDEData(prevData);
        checkForCriticalErrors(updatedData);
        return updatedData;
      });
      
      // Update NETA modules and RMDE system status occasionally
      if (Math.random() > 0.7) {
        setNetaModules(generateNETAModules());
        setRmdeSystemStatus(generateRMDESystemStatus());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // New effect for API polling
  useEffect(() => {
    let apiPollInterval: number | null = null;
    
    if (apiPolling) {
      // Start polling NETA-21 APIs for latest data
      apiPollInterval = window.setInterval(async () => {
        try {
          for (const module of netaModules) {
            if (module.apiStatus === 'connected') {
              const apiData = await fetchDriveDataFromAPI(module.id);
              
              if (apiData.success) {
                // Update drive data with values from API
                setRmdeData(prevDrives => {
                  return prevDrives.map(drive => {
                    // Find matching drive from API response
                    if (drive.moduleId === module.id) {
                      const matchingApiDrive = apiData.drives.find(
                        apiDrive => apiDrive.id === drive.id
                      );
                      
                      if (matchingApiDrive) {
                        // Merge API data with existing drive data
                        return {
                          ...drive,
                          speed: matchingApiDrive.speed,
                          temperature: matchingApiDrive.temperature,
                          torque: matchingApiDrive.torque,
                          faults: [...matchingApiDrive.faults],
                          lastUpdated: apiData.timestamp
                        };
                      }
                    }
                    return drive;
                  });
                });
                
                // Show success toast occasionally
                if (Math.random() > 0.9) {
                  toast({
                    title: "API Connection Active",
                    description: `Successfully fetched latest data from ${module.id}`,
                    variant: "default",
                  });
                }
              } else {
                // Show error toast
                toast({
                  title: "API Connection Error",
                  description: `Failed to fetch data from ${module.id}`,
                  variant: "destructive",
                });
                
                // Update module status
                setNetaModules(prev => 
                  prev.map(m => 
                    m.id === module.id ? { ...m, apiStatus: 'error' } : m
                  )
                );
              }
            }
          }
        } catch (error) {
          console.error("API polling error:", error);
        }
      }, 10000); // Poll every 10 seconds
    }
    
    return () => {
      if (apiPollInterval) {
        window.clearInterval(apiPollInterval);
      }
    };
  }, [apiPolling, netaModules]);

  const checkForCriticalErrors = (data: RMDEDrive[]) => {
    const newCriticalErrors: {drive: RMDEDrive, error: RMDEError}[] = [];
    
    data.forEach(drive => {
      drive.errors.forEach(error => {
        if (error.severity === 'critical' && !error.resolved) {
          const existingError = criticalErrors.find(
            ce => ce.drive.id === drive.id && ce.error.id === error.id
          );
          
          if (!existingError) {
            newCriticalErrors.push({drive, error});
            
            // Simulate sending email notification
            sendEmailNotification(drive, error.message);
          }
        }
      });
      
      // Also check for critical faults
      drive.faults.forEach(fault => {
        if (fault.impact === 'critical') {
          toast({
            title: `Critical fault detected`,
            description: `${drive.name}: ${fault.code} - ${fault.description}`,
            variant: "destructive",
          });
        }
      });
    });
    
    if (newCriticalErrors.length > 0) {
      // Show toast for each new critical error
      newCriticalErrors.forEach(({drive, error}) => {
        toast({
          title: `CRITICAL RMDE ALERT!`,
          description: `${drive.name} on ${drive.moduleId}: ${error.message}`,
          variant: "destructive",
        });
      });
      
      setCriticalErrors(prev => [...prev, ...newCriticalErrors]);
    }
  };

  const getOverviewStats = () => {
    const onlineCount = rmdeData.filter(d => d.status === 'online').length;
    const warningCount = rmdeData.filter(d => d.status === 'warning').length;
    const errorCount = rmdeData.filter(d => d.status === 'error').length;
    const offlineCount = rmdeData.filter(d => d.status === 'offline').length;
    
    const avgHealth = rmdeData.reduce((acc, d) => acc + d.healthScore, 0) / rmdeData.length;
    const avgTemperature = rmdeData.reduce((acc, d) => acc + d.temperature, 0) / rmdeData.length;
    
    return { onlineCount, warningCount, errorCount, offlineCount, avgHealth, avgTemperature };
  };

  const getModuleData = () => {
    const modules = {} as Record<string, {count: number, avgHealth: number, drives: RMDEDrive[]}>;
    
    rmdeData.forEach(drive => {
      if (!modules[drive.moduleId]) {
        modules[drive.moduleId] = { count: 0, avgHealth: 0, drives: [] };
      }
      
      modules[drive.moduleId].count += 1;
      modules[drive.moduleId].avgHealth += drive.healthScore;
      modules[drive.moduleId].drives.push(drive);
    });
    
    // Calculate average health for each module
    Object.keys(modules).forEach(moduleId => {
      modules[moduleId].avgHealth = modules[moduleId].avgHealth / modules[moduleId].count;
    });
    
    return modules;
  };

  const getPieChartData = () => {
    const stats = getOverviewStats();
    return [
      { name: 'Online', value: stats.onlineCount, color: '#10b981' },
      { name: 'Warning', value: stats.warningCount, color: '#f59e0b' },
      { name: 'Error', value: stats.errorCount, color: '#ef4444' },
      { name: 'Offline', value: stats.offlineCount, color: '#6b7280' },
    ];
  };

  const getHealthDistributionData = () => {
    const ranges = [
      { range: '90-100', count: 0 },
      { range: '80-89', count: 0 },
      { range: '70-79', count: 0 },
      { range: '<70', count: 0 }
    ];
    
    rmdeData.forEach(drive => {
      if (drive.healthScore >= 90) ranges[0].count++;
      else if (drive.healthScore >= 80) ranges[1].count++;
      else if (drive.healthScore >= 70) ranges[2].count++;
      else ranges[3].count++;
    });
    
    return ranges;
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      const newData = generateInitialRMDEData();
      const newModules = generateNETAModules();
      const newSystemStatus = generateRMDESystemStatus();
      setRmdeData(newData);
      setNetaModules(newModules);
      setRmdeSystemStatus(newSystemStatus);
      setLoading(false);
      toast({
        title: "Data Refreshed",
        description: "RMDE data has been regenerated",
      });
    }, 500);
  };

  const toggleApiPolling = () => {
    setApiPolling(prev => !prev);
    
    toast({
      title: apiPolling ? "API Connection Stopped" : "API Connection Started",
      description: apiPolling ? 
        "Disconnected from NETA-21 API endpoints" : 
        "Connected to NETA-21 API endpoints for real-time data",
      variant: "default",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>RMDE System Monitor</CardTitle>
          <CardDescription>Loading RMDE data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const stats = getOverviewStats();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>RMDE System Monitor</CardTitle>
            <CardDescription>Real-time drive monitoring and error detection</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={apiPolling ? "default" : "secondary"}
              size="sm" 
              className="flex items-center gap-1"
              onClick={toggleApiPolling}
            >
              <WifiIcon size={14} />
              {apiPolling ? "Disconnect API" : "Connect API"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={refreshData}
            >
              <RefreshCwIcon size={14} />
              Refresh Data
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">NETA-21 Modules</TabsTrigger>
            <TabsTrigger value="rmde-monitor">RMDE Monitor</TabsTrigger>
            <TabsTrigger value="errors">Error Log</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <Badge className="bg-green-500">Online</Badge>
                  <p className="text-3xl font-bold mt-2">{stats.onlineCount}</p>
                  <p className="text-sm text-muted-foreground">Drives</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <Badge className="bg-yellow-500">Warning</Badge>
                  <p className="text-3xl font-bold mt-2">{stats.warningCount}</p>
                  <p className="text-sm text-muted-foreground">Drives</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <Badge className="bg-red-500">Error</Badge>
                  <p className="text-3xl font-bold mt-2">{stats.errorCount}</p>
                  <p className="text-sm text-muted-foreground">Drives</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <Badge className="bg-gray-500">Offline</Badge>
                  <p className="text-3xl font-bold mt-2">{stats.offlineCount}</p>
                  <p className="text-sm text-muted-foreground">Drives</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Critical Alerts */}
            {criticalErrors.length > 0 && (
              <Alert variant="destructive" className="relative">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Critical RMDE Alerts</AlertTitle>
                <AlertDescription>
                  <ScrollArea className="h-20 mt-2">
                    {criticalErrors.map(({drive, error}, index) => (
                      <div key={`${drive.id}-${error.id}-${index}`} className="py-1">
                        <strong>{drive.name}</strong> on {drive.moduleId}: {error.message} 
                        <span className="text-xs ml-2">
                          {new Date(error.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </ScrollArea>
                </AlertDescription>
              </Alert>
            )}
            
            {/* Status Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieChartData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        nameKey="name"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {getPieChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} drives`, 'Count']}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Health Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getHealthDistributionData()}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} drives`, 'Count']}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px' }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#2563eb" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-4">
            {Object.entries(getModuleData()).map(([moduleId, data]) => (
              <Card key={moduleId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{moduleId}</CardTitle>
                      <CardDescription>
                        {data.count} connected drives • Avg. Health: {data.avgHealth.toFixed(1)}%
                      </CardDescription>
                    </div>
                    <Progress 
                      value={data.avgHealth} 
                      className={`w-24 ${data.avgHealth >= 90 ? 'bg-green-500' : 
                                          data.avgHealth >= 80 ? 'bg-blue-500' : 
                                          data.avgHealth >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.drives.map(drive => (
                      <div 
                        key={drive.id} 
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          drive.status === 'error' || drive.status === 'warning' 
                            ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800' 
                            : 'bg-card'
                        }`}
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${getStatusBadgeClass(drive.status)}`}></div>
                            <span className="font-medium">{drive.name}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <ThermometerIcon size={12} />
                              <span>{drive.temperature}°C</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ZapIcon size={12} />
                              <span>{drive.powerUsage}W</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ActivityIcon size={12} />
                              <span>{drive.efficiency}% Efficiency</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ClockIcon size={12} />
                              <span>{Math.floor(drive.operatingHours)}h Runtime</span>
                            </div>
                            {/* New metrics */}
                            <div className="flex items-center gap-1">
                              <GaugeIcon size={12} />
                              <span>{drive.speed} RPM</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <RotateCwIcon size={12} />
                              <span>{drive.torque} Nm</span>
                            </div>
                          </div>
                          
                          {/* Active Faults */}
                          {drive.faults.length > 0 && (
                            <div className="mt-2 text-xs">
                              <div className="flex items-center gap-1 text-red-500">
                                <WrenchIcon size={12} />
                                <span className="font-medium">Active Faults: {drive.faults.length}</span>
                              </div>
                              <div className="text-xs text-red-400 mt-1">
                                {drive.faults[0].code}: {drive.faults[0].description}
                                {drive.faults.length > 1 && `, +${drive.faults.length - 1} more`}
                              </div>
                            </div>
                          )}
                          
                          {/* Last Updated */}
                          <div className="mt-1 text-[10px] text-muted-foreground">
                            Last updated: {new Date(drive.lastUpdated).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-muted-foreground mb-1">Health</span>
                          <div className="relative h-14 w-14 flex items-center justify-center">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="rgba(0,0,0,0.1)"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={drive.healthScore >= 90 ? "#10b981" : 
                                        drive.healthScore >= 80 ? "#3b82f6" :
                                        drive.healthScore >= 70 ? "#f59e0b" : "#ef4444"}
                                strokeWidth="3"
                                strokeDasharray={`${drive.healthScore}, 100`}
                              />
                            </svg>
                            <span className="absolute text-sm font-semibold">{drive.healthScore}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          {/* RMDE Monitor Tab */}
          <TabsContent value="rmde-monitor" className="space-y-4">
            {/* RMDE System Status Cards */}
            <div className="grid grid-cols-1 gap-4">
              {rmdeSystemStatus.map(system => (
                <Card key={system.id} className={system.status === 'warning' ? 'border-yellow-400' : system.status === 'critical' ? 'border-red-500' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MonitorIcon className={system.status === 'warning' ? 'text-yellow-500' : system.status === 'critical' ? 'text-red-500' : 'text-green-500'} />
                        <div>
                          <CardTitle className="text-lg">{system.id}</CardTitle>
                          <CardDescription>RMDE System Status</CardDescription>
                        </div>
                      </div>
                      <Badge className={
                        system.status === 'warning' ? 'bg-yellow-500' : 
                        system.status === 'critical' ? 'bg-red-500' : 
                        'bg-green-500'
                      }>
                        {system.status === 'warning' ? 'Warning' : 
                         system.status === 'critical' ? 'Critical' : 
                         'Normal'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 p-3 rounded-md bg-gray-50 dark:bg-gray-900">
                        <ThermometerIcon className="text-blue-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">Temperature</div>
                          <div className="font-semibold text-lg">{system.temperature}°C</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-md bg-gray-50 dark:bg-gray-900">
                        <DropletIcon className="text-blue-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">Humidity</div>
                          <div className="font-semibold text-lg">{system.humidity}%</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-4">
                      Last updated: {new Date(system.lastUpdated).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* NETA-21 Modules Table with API Status */}
            <Card>
              <CardHeader>
                <CardTitle>NETA-21 Modules</CardTitle>
                <CardDescription>Current status of all NETA-21 modules in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NETA ID</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Connected Drives</TableHead>
                      <TableHead>API Status</TableHead>
                      <TableHead>Last Seen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {netaModules.map(module => (
                      <TableRow key={module.id}>
                        <TableCell className="font-medium">{module.id}</TableCell>
                        <TableCell>{module.ipAddress}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${getStatusBadgeClass(module.status)}`}></div>
                            <span className="capitalize">{module.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{module.connectedDrives}</TableCell>
                        <TableCell>
                          <Badge className={
                            module.apiStatus === 'connected' ? 'bg-green-500' : 
                            module.apiStatus === 'disconnected' ? 'bg-gray-500' : 
                            'bg-red-500'
                          }>
                            {module.apiStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(module.lastSeen).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Connected Drives by Module */}
            <Card>
              <CardHeader>
                <CardTitle>Connected Drives by Module</CardTitle>
                <CardDescription>Overview of drives connected to each NETA-21 module</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={netaModules.map(module => ({
                        name: module.id,
                        drives: module.connectedDrives
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} drives`, 'Connected']}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px' }}
                      />
                      <Bar 
                        dataKey="drives" 
                        fill="#9b87f5" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Error Log Tab */}
          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>RMDE Error Log</CardTitle>
                <CardDescription>All system errors and warnings</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {rmdeData.flatMap(drive => 
                      drive.errors.map(error => ({drive, error}))
                    ).sort((a, b) => 
                      new Date(b.error.timestamp).getTime() - new Date(a.error.timestamp).getTime()
                    ).map(({drive, error}, index) => (
                      <div 
                        key={`${drive.id}-${error.id}-${index}`} 
                        className={`p-3 rounded-lg border ${
                          error.resolved ? 'bg-gray-50 dark:bg-gray-950/20' : 
                          error.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/20' : 
                          error.severity === 'high' ? 'bg-orange-50 dark:bg-orange-950/20' : 
                          error.severity === 'medium' ? 'bg-yellow-50 dark:bg-yellow-950/20' : 
                          'bg-blue-50 dark:bg-blue-950/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={`${
                              error.severity === 'critical' ? 'bg-red-500' :
                              error.severity === 'high' ? 'bg-orange-500' :
                              error.severity === 'medium' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            } capitalize`}>
                              {error.severity}
                            </Badge>
                            <span className="font-medium">{drive.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(error.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm">{error.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">Module: {drive.moduleId}</span>
                            {error.resolved && (
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                Resolved
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Active Faults Section */}
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Active Faults</h3>
                      <div className="space-y-2">
                        {rmdeData.flatMap(drive => 
                          drive.faults.map(fault => ({drive, fault}))
                        ).sort((a, b) => 
                          new Date(b.fault.timeDetected).getTime() - new Date(a.fault.timeDetected).getTime()
                        ).map(({drive, fault}, index) => (
                          <div 
                            key={`fault-${drive.id}-${fault.id}-${index}`} 
                            className={`p-3 rounded-lg border ${
                              fault.impact === 'critical' ? 'bg-red-50 dark:bg-red-950/20' : 
                              fault.impact === 'major' ? 'bg-orange-50 dark:bg-orange-950/20' : 
                              fault.impact === 'minor' ? 'bg-yellow-50 dark:bg-yellow-950/20' : 
                              'bg-blue-50 dark:bg-blue-950/20
