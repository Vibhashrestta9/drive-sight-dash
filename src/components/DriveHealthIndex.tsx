
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';
import { RMDEDrive } from '@/utils/rmdeUtils';
import { calculateDHI, getDHIStatus, getDHIStatusColor, explainDHIScore, DEFAULT_DHI_WEIGHTS } from '@/utils/dhiUtils';

interface DriveHealthIndexProps {
  drives: RMDEDrive[];
}

const DriveHealthIndex = ({ drives }: DriveHealthIndexProps) => {
  // Calculate DHI for all drives
  const drivesWithDHI = drives.map(drive => ({
    ...drive,
    dhi: calculateDHI(drive),
    dhiExplanation: explainDHIScore(drive, calculateDHI(drive))
  }));
  
  // Calculate fleet average DHI
  const averageDHI = Math.round(
    drivesWithDHI.reduce((sum, drive) => sum + drive.dhi, 0) / drivesWithDHI.length
  );
  
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
                <p>DHI is a unified health score (0-100) based on temperature, efficiency, operating time, error frequency, and performance consistency.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="breakdown">Drive Breakdown</TabsTrigger>
            <TabsTrigger value="factors">DHI Factors</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
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
          </TabsContent>
          
          {/* Breakdown Tab */}
          <TabsContent value="breakdown">
            <div className="space-y-3">
              {drivesWithDHI
                .sort((a, b) => b.dhi - a.dhi)
                .map(drive => (
                  <div key={drive.id} className="flex items-center justify-between p-3 border rounded-md">
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
                      <span className="font-medium text-right w-8">{drive.dhi}</span>
                    </div>
                  </div>
                ))}
            </div>
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

export default DriveHealthIndex;
