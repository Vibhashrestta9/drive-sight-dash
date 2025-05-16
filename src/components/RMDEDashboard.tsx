import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, AlertTriangle, ArrowRight, CheckCircle, ChevronsUpDown, Computer, Info, Laptop, RefreshCw, Servers, Settings } from 'lucide-react';
import { 
  RMDEDrive, 
  RMDEError, 
  RMDEModule,
  RMDESystemStatus 
} from '@/utils/types/rmdeTypes';
import { generateInitialRMDEData, generateNETAModules, generateRMDESystemStatus } from '@/utils/rmde/dataGenerator';
import { updateRMDEData } from '@/utils/rmde/dataUpdater';
import { getStatusBadgeClass, getHealthColor } from '@/utils/rmde/uiUtils';

const RMDEDashboard = () => {
  const [drives, setDrives] = useState<RMDEDrive[]>([]);
  const [modules, setModules] = useState<RMDEModule[]>([]);
  const [systemStatuses, setSystemStatuses] = useState<RMDESystemStatus[]>([]);
  const [activeTab, setActiveTab] = useState('drives');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  
  useEffect(() => {
    // Fetch initial data
    const initialDrives = generateInitialRMDEData();
    setDrives(initialDrives);
    
    const initialModules = generateNETAModules();
    setModules(initialModules);
    
    const initialSystemStatuses = generateRMDESystemStatus();
    setSystemStatuses(initialSystemStatuses);
    
    // Set up interval for real-time updates
    const interval = setInterval(() => {
      setDrives(prev => updateRMDEData(prev));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const sortedDrives = React.useMemo(() => {
    let sortableDrives = [...drives];
    sortableDrives.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableDrives;
  }, [drives, sortConfig]);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>RMDE System Overview</CardTitle>
            <CardDescription>Real-time status and analytics for all connected drives and modules</CardDescription>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="drives" className="space-y-4">
          <TabsList>
            <TabsTrigger value="drives" onClick={() => setActiveTab('drives')}>Drives</TabsTrigger>
            <TabsTrigger value="modules" onClick={() => setActiveTab('modules')}>Modules</TabsTrigger>
            <TabsTrigger value="system" onClick={() => setActiveTab('system')}>System Status</TabsTrigger>
          </TabsList>
          
          {/* Drives Tab */}
          <TabsContent value="drives" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Total Drives: {drives.length} | Online: {drives.filter(d => d.status === 'online').length} | 
              Warnings: {drives.filter(d => d.status === 'warning').length} | Errors: {drives.filter(d => d.status === 'error').length}
            </div>
            <Separator />
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>A list of your recent drives.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                      Name
                      {sortConfig.key === 'name' && (
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead onClick={() => handleSort('moduleId')} className="cursor-pointer">
                      Module ID
                      {sortConfig.key === 'moduleId' && (
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>Power Usage</TableHead>
                    <TableHead>Health Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedDrives.map((drive) => (
                    <TableRow key={drive.id}>
                      <TableCell className="font-medium">{drive.name}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(drive.status)}>
                          {drive.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{drive.moduleId}</TableCell>
                      <TableCell>{drive.temperature}°C</TableCell>
                      <TableCell>{drive.powerUsage}W</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Progress value={drive.healthScore} className="h-2 w-24 mr-2" style={{ backgroundColor: getHealthColor(drive.healthScore) }} />
                          {drive.healthScore}%
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Info className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Modules Tab */}
          <TabsContent value="modules">
            <div className="text-sm text-muted-foreground">
              Total Modules: {modules.length} | Online: {modules.filter(m => m.status === 'online').length} | 
              Warnings: {modules.filter(m => m.status === 'warning').length} | Errors: {modules.filter(m => m.status === 'error').length}
            </div>
            <Separator />
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>List of connected NETA-21 Modules</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Connected Drives</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell className="font-medium">{module.id}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(module.status)}>
                          {module.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{module.ipAddress}</TableCell>
                      <TableCell>{module.connectedDrives}</TableCell>
                      <TableCell>{new Date(module.lastSeen).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Computer className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* System Status Tab */}
          <TabsContent value="system">
            <div className="text-sm text-muted-foreground">
              Overall System Health and Status
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemStatuses.map(status => (
                <Card key={status.id}>
                  <CardHeader>
                    <CardTitle>System: {status.id}</CardTitle>
                    <CardDescription>
                      Last Updated: {new Date(status.lastUpdated).toLocaleTimeString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <span>Status:</span>
                        <Badge className={getStatusBadgeClass(status.status)}>
                          {status.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Laptop className="h-4 w-4 text-gray-500" />
                        <span>Temperature:</span>
                        <span>{status.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Servers className="h-4 w-4 text-gray-500" />
                        <span>Humidity:</span>
                        <span>{status.humidity}%</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <Button variant="secondary">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    {status.status !== 'normal' && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Issue Detected
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>All systems operational</span>
        </div>
        <a href="#" className="text-sm text-blue-500 hover:underline">
          View Full Report
          <ArrowRight className="h-4 w-4 ml-1" />
        </a>
      </CardFooter>
    </Card>
  );
};

export default RMDEDashboard;
