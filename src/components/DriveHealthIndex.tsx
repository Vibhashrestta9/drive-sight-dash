
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, ChartLine } from 'lucide-react';
import { RMDEDrive } from '@/utils/rmdeUtils';
import { 
  calculateDHI, 
  getDHIStatus, 
  getDHIStatusColor, 
  explainDHIScore, 
  DEFAULT_DHI_WEIGHTS,
  getDHIBreakdown,
  calculateDHITrend
} from '@/utils/dhiUtils';

interface DriveHealthIndexProps {
  drives: RMDEDrive[];
}

const DriveHealthIndex = ({ drives }: DriveHealthIndexProps) => {
  const [selectedDriveId, setSelectedDriveId] = useState<number | null>(null);
  
  // Calculate DHI for all drives
  const drivesWithDHI = drives.map(drive => {
    const dhi = calculateDHI(drive);
    const trend = calculateDHITrend(dhi, drive.previousDHI || dhi);
    return {
      ...drive,
      dhi,
      dhiExplanation: explainDHIScore(drive, dhi),
      dhiBreakdown: getDHIBreakdown(drive),
      dhiTrend: trend
    };
  });
  
  // Get selected drive or null
  const selectedDrive = selectedDriveId ? 
    drivesWithDHI.find(d => d.id === selectedDriveId) : null;
  
  // Calculate fleet average DHI
  const averageDHI = Math.round(
    drivesWithDHI.reduce((sum, drive) => sum + drive.dhi, 0) / drivesWithDHI.length
  );
  
  // Calculate fleet DHI trend
  const fleetPreviousAvg = Math.round(
    drivesWithDHI.reduce((sum, drive) => sum + (drive.previousDHI || drive.dhi), 0) / drivesWithDHI.length
  );
  const fleetTrend = calculateDHITrend(averageDHI, fleetPreviousAvg);
  
  // Group drives by DHI status
  const dhiByStatus = {
    excellent: drivesWithDHI.filter(d => getDHIStatus(d.dhi) === 'excellent').length,
    good: drivesWithDHI.filter(d => getDHIStatus(d.dhi) === 'good').length,
    fair: drivesWithDHI.filter(d => getDHIStatus(d.dhi) === 'fair').length,
    poor: drivesWithDHI.filter(d => getDHIStatus(d.dhi) === 'poor').length,
    critical: drivesWithDHI.filter(d => getDHIStatus(d.dhi) === 'critical').length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Drive Health Index (DHI)</CardTitle>
            <CardDescription>Unified health score across multiple metrics</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-full bg-gray-100 p-1 cursor-help">
                  <InfoIcon className="h-4 w-4 text-gray-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>DHI is a unified health score (0-100) based on multiple metrics including temperature, efficiency, operating time, error frequency, vibration, response time, and load capacity.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Fleet Overview</TabsTrigger>
            <TabsTrigger value="breakdown">Drive Breakdown</TabsTrigger>
            <TabsTrigger value="details">Drive Details</TabsTrigger>
            <TabsTrigger value="factors">DHI Factors</TabsTrigger>
          </TabsList>
          
          {/* Fleet Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Fleet Average */}
            <div className="flex flex-col items-center">
              <div className="text-sm text-muted-foreground mb-2">Fleet Average DHI</div>
              <div className="relative h-32 w-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={
                      averageDHI >= 90 ? "#10b981" :
                      averageDHI >= 75 ? "#059669" :
                      averageDHI >= 60 ? "#f59e0b" :
                      averageDHI >= 40 ? "#f97316" : "#ef4444"
                    }
                    strokeWidth="10"
                    strokeDasharray={`${averageDHI * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold">{averageDHI}</div>
                  <div className="text-sm text-muted-foreground capitalize">{getDHIStatus(averageDHI)}</div>
                  <div className={`text-xs flex items-center gap-1 ${
                    fleetTrend.direction === 'up' ? 'text-green-500' : 
                    fleetTrend.direction === 'down' ? 'text-red-500' : 
                    'text-blue-500'
                  }`}>
                    {fleetTrend.direction === 'up' ? '↑' : 
                     fleetTrend.direction === 'down' ? '↓' : '→'}
                    {Math.abs(fleetTrend.change)}%
                  </div>
                </div>
              </div>
            </div>
            
            {/* DHI Distribution */}
            <div>
              <div className="text-sm font-medium mb-2">Distribution by Status</div>
              <div className="grid grid-cols-5 gap-2">
                <StatusCount label="Excellent" count={dhiByStatus.excellent} color="bg-green-500" />
                <StatusCount label="Good" count={dhiByStatus.good} color="bg-emerald-500" />
                <StatusCount label="Fair" count={dhiByStatus.fair} color="bg-yellow-500" />
                <StatusCount label="Poor" count={dhiByStatus.poor} color="bg-orange-500" />
                <StatusCount label="Critical" count={dhiByStatus.critical} color="bg-red-500" />
              </div>
            </div>
            
            {/* Fleet health summary */}
            <div className="border p-4 rounded-lg bg-gray-50">
              <div className="font-medium mb-2">Fleet Health Summary</div>
              <div className="text-sm text-gray-600">
                {dhiByStatus.critical > 0 && 
                  <div className="text-red-500 font-medium mb-1">⚠️ {dhiByStatus.critical} drives in critical condition require immediate attention</div>
                }
                {dhiByStatus.poor > 0 && 
                  <div className="text-orange-500 mb-1">⚠ {dhiByStatus.poor} drives showing poor health need investigation</div>
                }
                <div>
                  {Math.round((dhiByStatus.excellent + dhiByStatus.good) / drivesWithDHI.length * 100)}% of fleet 
                  is in good or excellent condition
                </div>
                <div>
                  Fleet trend: {fleetTrend.direction === 'up' ? 'Improving' : 
                               fleetTrend.direction === 'down' ? 'Declining' : 'Stable'} 
                  ({fleetTrend.direction === 'up' ? '+' : fleetTrend.direction === 'down' ? '-' : ''}
                  {Math.abs(fleetTrend.change)}%)
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Drive Breakdown Tab */}
          <TabsContent value="breakdown">
            <div className="space-y-3">
              {drivesWithDHI
                .sort((a, b) => b.dhi - a.dhi)
                .map(drive => (
                  <div 
                    key={drive.id} 
                    className={`flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                      selectedDriveId === drive.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedDriveId(drive.id)}
                  >
                    <div className="flex flex-col">
                      <div className="font-medium">{drive.name}</div>
                      <div className="text-xs text-muted-foreground">{drive.moduleId}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="w-24 relative">
                              <Progress 
                                value={drive.dhi} 
                                className={`h-2 ${getDHIStatusColor(drive.dhi)}`}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">{drive.dhiExplanation}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="flex items-center">
                        <span className="font-medium text-right w-8">{drive.dhi}</span>
                        {drive.dhiTrend && Math.abs(drive.dhiTrend.change) >= 1 && (
                          <span className={`text-xs ml-1 ${
                            drive.dhiTrend.direction === 'up' ? 'text-green-500' : 
                            drive.dhiTrend.direction === 'down' ? 'text-red-500' : 
                            'text-blue-500'
                          }`}>
                            {drive.dhiTrend.direction === 'up' ? '↑' : 
                             drive.dhiTrend.direction === 'down' ? '↓' : '→'}
                            {Math.abs(drive.dhiTrend.change)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
          
          {/* Drive Details Tab */}
          <TabsContent value="details">
            {selectedDrive ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{selectedDrive.name}</h3>
                    <div className="text-sm text-muted-foreground">Module ID: {selectedDrive.moduleId}</div>
                  </div>
                  <div className="flex items-center">
                    <div className={`px-2 py-1 rounded text-white text-sm font-medium ${getDHIStatusColor(selectedDrive.dhi)}`}>
                      DHI: {selectedDrive.dhi}
                      {selectedDrive.dhiTrend && Math.abs(selectedDrive.dhiTrend.change) >= 1 && (
                        <span className="ml-1">
                          {selectedDrive.dhiTrend.direction === 'up' ? '↑' : 
                           selectedDrive.dhiTrend.direction === 'down' ? '↓' : '→'}
                          {Math.abs(selectedDrive.dhiTrend.change)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-3 text-sm">
                  {selectedDrive.dhiExplanation}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard 
                    label="Temperature" 
                    value={`${selectedDrive.temperature}°C`} 
                    score={selectedDrive.dhiBreakdown.temperature} 
                  />
                  <MetricCard 
                    label="Power Efficiency" 
                    value={`${selectedDrive.efficiency}%`} 
                    score={selectedDrive.dhiBreakdown.efficiency} 
                  />
                  <MetricCard 
                    label="Operating Hours" 
                    value={`${Math.floor(selectedDrive.operatingHours)}h`} 
                    score={selectedDrive.dhiBreakdown.operatingHours} 
                  />
                  <MetricCard 
                    label="Error Status" 
                    value={`${selectedDrive.errors.length} errors`} 
                    score={selectedDrive.dhiBreakdown.errors} 
                  />
                  {selectedDrive.responseTime && (
                    <MetricCard 
                      label="Response Time" 
                      value={`${selectedDrive.responseTime}ms`} 
                      score={selectedDrive.dhiBreakdown.responseTime} 
                    />
                  )}
                  {selectedDrive.vibrationLevel && (
                    <MetricCard 
                      label="Vibration Level" 
                      value={`${selectedDrive.vibrationLevel}mm/s`} 
                      score={selectedDrive.dhiBreakdown.vibration} 
                    />
                  )}
                  {selectedDrive.loadCapacity && (
                    <MetricCard 
                      label="Load Capacity" 
                      value={`${selectedDrive.loadCapacity}%`} 
                      score={selectedDrive.dhiBreakdown.loadCapacity} 
                    />
                  )}
                </div>
                
                {selectedDrive.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Recent Errors</h4>
                    <div className="space-y-2">
                      {selectedDrive.errors.map(error => (
                        <div key={error.id} className="border rounded-md p-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className={`px-1.5 py-0.5 rounded text-xs ${
                              error.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              error.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              error.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {error.severity}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(error.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="mt-1">{error.message}</div>
                          {error.resolved && (
                            <div className="mt-1 text-xs text-green-600">✓ Resolved</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                Select a drive from the "Drive Breakdown" tab to view detailed metrics
              </div>
            )}
          </TabsContent>
          
          {/* Factors Tab */}
          <TabsContent value="factors">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-2">
                DHI is calculated based on the following weighted factors:
              </div>
              <div className="space-y-3">
                <FactorBar
                  label="Temperature"
                  weight={DEFAULT_DHI_WEIGHTS.temperature}
                  description="Measures how close the drive operates to optimal temperature range"
                />
                <FactorBar
                  label="Power Efficiency"
                  weight={DEFAULT_DHI_WEIGHTS.powerEfficiency}
                  description="Measures power consumption relative to output performance"
                />
                <FactorBar
                  label="Operating Time"
                  weight={DEFAULT_DHI_WEIGHTS.operatingHoursRatio}
                  description="Considers total runtime relative to expected lifespan"
                />
                <FactorBar
                  label="Error History"
                  weight={DEFAULT_DHI_WEIGHTS.errorSeverity}
                  description="Evaluates frequency and severity of recorded errors"
                />
                <FactorBar
                  label="Performance Consistency"
                  weight={DEFAULT_DHI_WEIGHTS.performanceConsistency}
                  description="Assesses stability and predictability of drive operation"
                />
                <FactorBar
                  label="Response Time"
                  weight={DEFAULT_DHI_WEIGHTS.responseTime}
                  description="Measures how quickly the drive responds to commands"
                />
                <FactorBar
                  label="Vibration Levels"
                  weight={DEFAULT_DHI_WEIGHTS.vibrationLevels}
                  description="Measures mechanical stability during operation"
                />
                <FactorBar
                  label="Load Capacity"
                  weight={DEFAULT_DHI_WEIGHTS.loadCapacity}
                  description="Evaluates how efficiently the drive handles its workload"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper component for status counts
const StatusCount = ({ label, count, color }: { label: string, count: number, color: string }) => (
  <div className="flex flex-col items-center">
    <div className={`w-full h-1 ${color} rounded-full mb-1`}></div>
    <div className="text-xl font-semibold">{count}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

// Helper component for factor weights
const FactorBar = ({ label, weight, description }: { label: string, weight: number, description: string }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <div className="font-medium">{label}</div>
      <div className="text-sm">{(weight * 100)}%</div>
    </div>
    <div className="flex items-center gap-2">
      <Progress value={weight * 100} className="h-2" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-xs">{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
);

// Helper component for metric cards in drive details
const MetricCard = ({ label, value, score }: { label: string, value: string, score: number }) => {
  let scoreColor = '';
  if (score >= 90) scoreColor = 'text-green-600';
  else if (score >= 75) scoreColor = 'text-emerald-600';
  else if (score >= 60) scoreColor = 'text-yellow-600';
  else if (score >= 40) scoreColor = 'text-orange-600';
  else scoreColor = 'text-red-600';
  
  return (
    <div className="border rounded-md p-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex justify-between items-center mt-1">
        <div className="font-medium">{value}</div>
        <div className={`font-medium ${scoreColor}`}>{score}</div>
      </div>
      <Progress value={score} className={`h-1.5 mt-2 ${getDHIStatusColor(score)}`} />
    </div>
  );
};

export default DriveHealthIndex;
