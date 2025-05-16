import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fingerprint, Activity, Clock, TrendingUp } from 'lucide-react';
import { generateMockFingerprint, getSignificanceColorClass, getMatchScoreColorClass, getBehaviorMatchDescription } from '@/utils/behavioralFingerprint';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import { RMDEDrive } from '@/utils/types/rmdeTypes';

interface BehavioralFingerprintProps {
  drives: RMDEDrive[];
}

const BehavioralFingerprint = ({ drives }: BehavioralFingerprintProps) => {
  const [selectedDriveId, setSelectedDriveId] = useState<number>(drives[0]?.id || 1);
  
  // Get selected drive
  const selectedDrive = drives.find(drive => drive.id === selectedDriveId) || drives[0];
  
  // Generate fingerprint data for the selected drive
  const fingerprint = selectedDrive ? generateMockFingerprint(selectedDrive) : null;
  
  if (!fingerprint) {
    return <div>No fingerprint data available</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5" />
              Drive Behavioral Fingerprint
            </CardTitle>
            <CardDescription>
              Unique operational patterns and behavioral analysis
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedDriveId}
              onChange={(e) => setSelectedDriveId(Number(e.target.value))}
              className="text-sm border rounded p-1"
            >
              {drives.map(drive => (
                <option key={drive.id} value={drive.id}>
                  {drive.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="deviations">Deviations</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Match Score */}
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Behavior Match</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-muted stroke-current"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className={`${getMatchScoreColorClass(fingerprint.matchScore)} stroke-current transition-all`}
                          strokeWidth="10"
                          strokeDasharray={`${(fingerprint.matchScore / 100) * 251.2} 251.2`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-2xl font-bold">{fingerprint.matchScore}</span>
                          <span className="text-sm">%</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-center">
                      {getBehaviorMatchDescription(fingerprint.matchScore)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Confidence Score */}
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Fingerprint Confidence</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Confidence Score:</span>
                      <span className="font-medium">{fingerprint.confidenceScore}%</span>
                    </div>
                    <Progress value={fingerprint.confidenceScore} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      <p>Baseline established: {fingerprint.baselineDate}</p>
                      <p>Last updated: {new Date(fingerprint.lastUpdated).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Anomaly Score */}
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Anomaly Detection</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Anomaly Score:</span>
                      <span 
                        className={`font-medium ${
                          fingerprint.anomalyScore > 30 ? 'text-red-500' : 
                          fingerprint.anomalyScore > 15 ? 'text-yellow-500' : 'text-green-500'
                        }`}
                      >
                        {fingerprint.anomalyScore}%
                      </span>
                    </div>
                    <Progress 
                      value={fingerprint.anomalyScore} 
                      className={`h-2 ${
                        fingerprint.anomalyScore > 30 ? 'bg-red-500' : 
                        fingerprint.anomalyScore > 15 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} 
                    />
                    <div className="text-xs text-muted-foreground">
                      <p>
                        {fingerprint.recentDeviations.length} detected deviations in the last 7 days
                      </p>
                      {fingerprint.recentDeviations.length > 0 && (
                        <p className="mt-1">
                          Latest: {getBehaviorMatchDescription(fingerprint.matchScore)} behavior pattern
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Startup Behavior</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Duration</div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">
                          {fingerprint.metrics.startupDuration}
                        </span>
                        <span className="text-sm text-muted-foreground">ms</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Time to reach stable operation
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Pattern</div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={fingerprint.metrics.startupPattern === 'smooth' ? 'default' : 'destructive'}
                          className="capitalize"
                        >
                          {fingerprint.metrics.startupPattern}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Power curve characteristic
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Load Response</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Response Time</div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">
                          {fingerprint.metrics.loadResponseTime}
                        </span>
                        <span className="text-sm text-muted-foreground">ms</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Time to adjust to load changes
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Stability</div>
                      <div className="flex flex-col gap-1">
                        <span className="text-2xl font-bold">
                          {fingerprint.metrics.loadStability}
                          <span className="text-sm text-muted-foreground">%</span>
                        </span>
                        <Progress 
                          value={fingerprint.metrics.loadStability} 
                          className={`h-1.5 ${
                            fingerprint.metrics.loadStability > 80 ? 'bg-green-500' : 
                            fingerprint.metrics.loadStability > 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Consistency under varying loads
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Idle Signature</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Power Variance</div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">
                          {fingerprint.metrics.idleSignature.powerVariance}
                        </span>
                        <span className="text-sm text-muted-foreground">σ</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Temperature Variance</div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">
                          {fingerprint.metrics.idleSignature.temperatureVariance}
                        </span>
                        <span className="text-sm text-muted-foreground">σ</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Vibration Pattern</div>
                      <div className="text-sm font-mono bg-muted p-1 rounded">
                        {fingerprint.metrics.idleSignature.microvibrationPattern}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Deviations Tab */}
          <TabsContent value="deviations" className="space-y-4">
            {fingerprint.recentDeviations.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-muted-foreground">No deviations detected in the last 7 days</p>
              </div>
            ) : (
              <div className="space-y-4">
                {fingerprint.recentDeviations.map((deviation, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              variant={
                                deviation.significance === 'critical' ? 'destructive' : 
                                deviation.significance === 'significant' ? 'default' : 'outline'
                              }
                              className="capitalize"
                            >
                              {deviation.significance}
                            </Badge>
                            <h4 className="text-sm font-medium capitalize">
                              {deviation.metric.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(deviation.timestamp).toLocaleString()}
                          </div>
                          
                          <div className="mt-2 grid grid-cols-3 text-sm gap-4">
                            <div>
                              <div className="text-xs text-muted-foreground">Expected</div>
                              <div>{deviation.expected}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Actual</div>
                              <div className={getSignificanceColorClass(deviation.significance)}>
                                {deviation.actual}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Deviation</div>
                              <div className={getSignificanceColorClass(deviation.significance)}>
                                {deviation.percentDeviation}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-4 w-px bg-muted-foreground/20"></div>
                  <div className="space-y-6">
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-8 h-8 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                      <div className="text-sm font-medium">Baseline established</div>
                      <div className="text-xs text-muted-foreground">{fingerprint.baselineDate}</div>
                      <div className="mt-1 text-sm">Initial behavioral fingerprint captured</div>
                    </div>
                    
                    {fingerprint.recentDeviations
                      .filter(d => d.significance === 'significant' || d.significance === 'critical')
                      .map((deviation, index) => (
                        <div key={index} className="relative pl-8">
                          <div className="absolute left-0 top-1 w-8 h-8 flex items-center justify-center">
                            <div className={`w-2 h-2 rounded-full ${
                              deviation.significance === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                          </div>
                          <div className="text-sm font-medium capitalize">
                            {deviation.metric.replace(/([A-Z])/g, ' $1').trim()} deviation detected
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(deviation.timestamp).toLocaleString()}
                          </div>
                          <div className="mt-1 text-sm">
                            {deviation.significance === 'critical' ? 
                              'Critical deviation requiring immediate attention' :
                              'Significant change in behavioral pattern detected'
                            }
                          </div>
                        </div>
                      ))
                    }
                    
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-8 h-8 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                      <div className="text-sm font-medium">Last updated</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(fingerprint.lastUpdated).toLocaleString()}
                      </div>
                      <div className="mt-1 text-sm">
                        Current match score: {fingerprint.matchScore}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Fingerprint ID: {fingerprint.metrics.operationalFingerprint.substring(0, 8)}...
        </div>
        <Button variant="outline" size="sm">
          <TrendingUp className="h-4 w-4 mr-2" />
          Analyze Trends
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BehavioralFingerprint;
