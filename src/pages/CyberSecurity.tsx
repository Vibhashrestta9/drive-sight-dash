
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, Terminal, BarChart, Activity, Lock, Info, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

// Threat types
type ThreatType = 'replay' | 'dos' | 'spoofing' | 'injection' | 'normal';

// Interface for detected threats
interface DetectedThreat {
  id: string;
  type: ThreatType;
  timestamp: Date;
  source: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'mitigated' | 'investigating';
}

// Interface for anomaly detection metrics
interface AnomalyMetrics {
  unexpectedIPs: number;
  abnormalFunctionCodes: number;
  highFrequencyRequests: number;
  unauthorizedWrites: number;
  duplicateTransactionIds: number;
}

const CyberSecurity = () => {
  // State for threat simulation
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState<ThreatType>('replay');
  const [threatProgress, setThreatProgress] = useState(0);
  const [activeThreats, setActiveThreats] = useState<DetectedThreat[]>([]);
  const [mlDetectionActive, setMlDetectionActive] = useState(true);
  const [mlConfidence, setMlConfidence] = useState(96);
  const [anomalyMetrics, setAnomalyMetrics] = useState<AnomalyMetrics>({
    unexpectedIPs: 2,
    abnormalFunctionCodes: 0,
    highFrequencyRequests: 5,
    unauthorizedWrites: 1,
    duplicateTransactionIds: 0
  });
  
  const { toast } = useToast();

  // Function to simulate a threat
  const simulateThreat = () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setThreatProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setThreatProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 15);
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          
          // Generate appropriate threat details based on selected type
          const threatDetails = generateThreatDetails(selectedThreat);
          setActiveThreats(prev => [threatDetails, ...prev]);
          
          // Update anomaly metrics
          updateAnomalyMetrics(selectedThreat);
          
          // Show toast notification
          toast({
            title: "Threat Detected!",
            description: `${threatDetails.description}`,
            variant: "destructive",
          });
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  // Function to generate threat details
  const generateThreatDetails = (type: ThreatType): DetectedThreat => {
    const threatId = Math.random().toString(36).substring(2, 10);
    const ipAddresses = ['192.168.1.45', '10.0.0.123', '172.16.254.2', '192.168.0.24'];
    const randomIP = ipAddresses[Math.floor(Math.random() * ipAddresses.length)];
    
    const threats: Record<ThreatType, Partial<DetectedThreat>> = {
      replay: {
        description: 'Replay Attack: Duplicate Modbus packet detected attempting state change',
        severity: 'high',
        source: randomIP
      },
      dos: {
        description: 'DoS Attack: NETA-21 communication buffer overflow attempt',
        severity: 'critical',
        source: randomIP
      },
      spoofing: {
        description: 'Spoofing Attack: Forged Modbus message with fake client ID detected',
        severity: 'medium',
        source: randomIP
      },
      injection: {
        description: 'Command Injection: Malicious write command targeting protected registers',
        severity: 'high',
        source: randomIP
      },
      normal: {
        description: 'Unusual traffic pattern detected, but classified as normal operation',
        severity: 'low',
        source: randomIP
      }
    };

    return {
      id: threatId,
      type: type,
      timestamp: new Date(),
      status: 'active',
      ...threats[type]
    } as DetectedThreat;
  };

  // Update anomaly metrics based on threat type
  const updateAnomalyMetrics = (type: ThreatType) => {
    setAnomalyMetrics(prev => {
      const newMetrics = { ...prev };
      
      switch (type) {
        case 'replay':
          newMetrics.duplicateTransactionIds += Math.floor(Math.random() * 5) + 1;
          break;
        case 'dos':
          newMetrics.highFrequencyRequests += Math.floor(Math.random() * 15) + 5;
          break;
        case 'spoofing':
          newMetrics.unexpectedIPs += Math.floor(Math.random() * 3) + 1;
          break;
        case 'injection':
          newMetrics.unauthorizedWrites += Math.floor(Math.random() * 3) + 1;
          newMetrics.abnormalFunctionCodes += Math.floor(Math.random() * 2) + 1;
          break;
      }
      
      // Simulate ML confidence fluctuation
      const confidenceChange = Math.random() * 8 - 4; // -4 to +4
      setMlConfidence(prev => Math.min(Math.max(prev + confidenceChange, 70), 99));
      
      return newMetrics;
    });
  };

  // Function to mitigate a threat
  const mitigateThreat = (threatId: string) => {
    setActiveThreats(prev => 
      prev.map(threat => 
        threat.id === threatId ? { ...threat, status: 'mitigated' } : threat
      )
    );
    
    toast({
      title: "Threat Mitigated",
      description: "Countermeasures successfully deployed",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cybersecurity Monitoring</h1>
          <p className="text-gray-600">Network threat detection and anomaly monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={mlDetectionActive ? "default" : "outline"} 
            className={mlDetectionActive ? "bg-green-500" : ""}
          >
            ML Detection {mlDetectionActive ? "Active" : "Disabled"}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setMlDetectionActive(!mlDetectionActive)}
          >
            {mlDetectionActive ? "Disable" : "Enable"} ML
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Threat Simulation Panel */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Threat Simulation
            </CardTitle>
            <CardDescription>
              Simulate various cybersecurity attacks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Attack Type</label>
              <select 
                className="w-full rounded-md border border-gray-300 p-2"
                value={selectedThreat}
                onChange={(e) => setSelectedThreat(e.target.value as ThreatType)}
                disabled={isSimulating}
              >
                <option value="replay">Replay Attack</option>
                <option value="dos">DoS Attack</option>
                <option value="spoofing">Spoofing Attack</option>
                <option value="injection">Command Injection</option>
                <option value="normal">Normal Traffic (Baseline)</option>
              </select>
            </div>

            {isSimulating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Simulation progress</span>
                  <span className="text-sm font-medium">{threatProgress}%</span>
                </div>
                <Progress value={threatProgress} className="h-2" />
              </div>
            )}

            <Button 
              onClick={simulateThreat} 
              disabled={isSimulating} 
              className="w-full bg-red-500 hover:bg-red-600"
            >
              <Zap className="mr-2 h-4 w-4" />
              {isSimulating ? "Simulating..." : "Launch Attack Simulation"}
            </Button>
          </CardContent>
        </Card>

        {/* Anomaly Detection Panel */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Anomaly Detection Metrics
            </CardTitle>
            <CardDescription>
              Real-time network traffic anomaly metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unexpected IPs</span>
                    <Badge variant={anomalyMetrics.unexpectedIPs > 0 ? "default" : "outline"}
                      className={anomalyMetrics.unexpectedIPs > 3 ? "bg-red-500" : 
                              anomalyMetrics.unexpectedIPs > 0 ? "bg-yellow-500" : ""}>
                      {anomalyMetrics.unexpectedIPs}
                    </Badge>
                  </div>
                  <Progress value={(anomalyMetrics.unexpectedIPs / 10) * 100} className="h-1" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Abnormal Function Codes</span>
                    <Badge variant={anomalyMetrics.abnormalFunctionCodes > 0 ? "default" : "outline"}
                      className={anomalyMetrics.abnormalFunctionCodes > 3 ? "bg-red-500" : 
                              anomalyMetrics.abnormalFunctionCodes > 0 ? "bg-yellow-500" : ""}>
                      {anomalyMetrics.abnormalFunctionCodes}
                    </Badge>
                  </div>
                  <Progress value={(anomalyMetrics.abnormalFunctionCodes / 10) * 100} className="h-1" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Request Frequency Anomalies</span>
                    <Badge variant={anomalyMetrics.highFrequencyRequests > 0 ? "default" : "outline"}
                      className={anomalyMetrics.highFrequencyRequests > 10 ? "bg-red-500" : 
                              anomalyMetrics.highFrequencyRequests > 0 ? "bg-yellow-500" : ""}>
                      {anomalyMetrics.highFrequencyRequests}
                    </Badge>
                  </div>
                  <Progress value={(anomalyMetrics.highFrequencyRequests / 20) * 100} className="h-1" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unauthorized Write Attempts</span>
                    <Badge variant={anomalyMetrics.unauthorizedWrites > 0 ? "default" : "outline"}
                      className={anomalyMetrics.unauthorizedWrites > 3 ? "bg-red-500" : 
                              anomalyMetrics.unauthorizedWrites > 0 ? "bg-yellow-500" : ""}>
                      {anomalyMetrics.unauthorizedWrites}
                    </Badge>
                  </div>
                  <Progress value={(anomalyMetrics.unauthorizedWrites / 10) * 100} className="h-1" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Duplicate Transaction IDs</span>
                    <Badge variant={anomalyMetrics.duplicateTransactionIds > 0 ? "default" : "outline"}
                      className={anomalyMetrics.duplicateTransactionIds > 3 ? "bg-red-500" : 
                              anomalyMetrics.duplicateTransactionIds > 0 ? "bg-yellow-500" : ""}>
                      {anomalyMetrics.duplicateTransactionIds}
                    </Badge>
                  </div>
                  <Progress value={(anomalyMetrics.duplicateTransactionIds / 10) * 100} className="h-1" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ML Detection Confidence</span>
                    <Badge className={
                      mlConfidence > 90 ? "bg-green-500" : 
                      mlConfidence > 80 ? "bg-yellow-500" : "bg-red-500"
                    }>
                      {mlConfidence}%
                    </Badge>
                  </div>
                  <Progress value={mlConfidence} className="h-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Threat Detection History */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Detected Threats
          </CardTitle>
          <CardDescription>
            History of detected anomalies and network attacks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeThreats.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No threats detected. Run a simulation to see results.
            </div>
          ) : (
            <div className="space-y-3">
              {activeThreats.map((threat) => (
                <div 
                  key={threat.id} 
                  className={`flex items-start justify-between p-3 rounded-lg border ${
                    threat.status === 'active' ? 'bg-red-50 border-red-200' : 
                    threat.status === 'mitigated' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        threat.severity === 'critical' ? 'text-red-600' :
                        threat.severity === 'high' ? 'text-orange-600' :
                        threat.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`}>
                        {threat.severity.toUpperCase()} SEVERITY
                      </span>
                      <Badge className={
                        threat.status === 'active' ? 'bg-red-500' :
                        threat.status === 'mitigated' ? 'bg-green-500' : 'bg-yellow-500'
                      }>
                        {threat.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{threat.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Source: {threat.source}</span>
                      <span>Detected: {threat.timestamp.toLocaleTimeString()}</span>
                      <span>ID: {threat.id}</span>
                    </div>
                  </div>
                  
                  {threat.status === 'active' && (
                    <Button 
                      size="sm" 
                      onClick={() => mitigateThreat(threat.id)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Lock className="mr-1 h-3 w-3" /> Mitigate
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 text-xs text-gray-500 flex justify-between">
          <span>Powered by ML-based anomaly detection</span>
          <span>Using Isolation Forest + LOF algorithms</span>
        </CardFooter>
      </Card>

      {/* ML Detection Information */}
      <div className="mt-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>About ML-Based Detection</AlertTitle>
          <AlertDescription className="text-sm">
            The system employs unsupervised machine learning techniques including Isolation Forest, 
            LOF (Local Outlier Factor), and Autoencoders to establish baseline network behavior patterns and 
            identify anomalous traffic that may indicate security threats.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default CyberSecurity;
