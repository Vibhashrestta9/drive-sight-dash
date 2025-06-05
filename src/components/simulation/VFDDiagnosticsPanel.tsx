
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Activity, Thermometer, Zap, Bell } from 'lucide-react';

interface VFDDiagnosticsPanelProps {
  vfd: any;
}

const VFDDiagnosticsPanel = ({ vfd }: VFDDiagnosticsPanelProps) => {
  const faultCodes = ['F001', 'F002', 'F003', 'F004', 'F005'];

  return (
    <div className="space-y-6">
      {/* Active Faults */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Fault Diagnostics
            {vfd.activeFaults.length > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {vfd.activeFaults.length} Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {vfd.activeFaults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No active faults. System operating normally.
            </div>
          ) : (
            <div className="space-y-3">
              {vfd.activeFaults.map((fault, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    fault.severity === 'critical' 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-yellow-500 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={
                        fault.severity === 'critical' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-yellow-600 text-white'
                      }>
                        {fault.code}
                      </Badge>
                      <span className="font-medium">{fault.description}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {fault.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Suggested Action:</strong> {fault.suggestedAction}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Select onValueChange={(value) => vfd.injectFault(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Inject Test Fault" />
                </SelectTrigger>
                <SelectContent>
                  {faultCodes.map(code => (
                    <SelectItem key={code} value={code}>
                      {code} - Test Fault
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={vfd.clearFaults} variant="outline">
              Clear All Faults
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Harmonics & THD */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Harmonics & THD Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-red-600">
                {vfd.harmonics.thd.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Total THD</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-orange-600">
                {vfd.harmonics.h3.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">3rd Harmonic</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-yellow-600">
                {vfd.harmonics.h5.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">5th Harmonic</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-green-600">
                {vfd.harmonics.h7.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">7th Harmonic</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">THD Compliance</div>
            <Progress 
              value={Math.min(100, (vfd.harmonics.thd / 20) * 100)} 
              className="h-2"
            />
            <div className="text-xs text-gray-500">
              IEEE 519: &lt;20% THD recommended
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thermal Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Thermal Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-2">Drive Temperature</div>
              <div className="text-3xl font-bold text-blue-600">
                {vfd.state.temperature.toFixed(1)}°C
              </div>
              <Progress 
                value={(vfd.state.temperature / 100) * 100} 
                className="mt-2 h-2"
              />
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Motor Temperature</div>
              <div className="text-3xl font-bold text-orange-600">
                {vfd.state.motorTemperature.toFixed(1)}°C
              </div>
              <Progress 
                value={(vfd.state.motorTemperature / 120) * 100} 
                className="mt-2 h-2"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Cooling Fan Speed</span>
              <span className="font-medium">{vfd.cooling.fanSpeed.toFixed(0)}%</span>
            </div>
            <Progress value={vfd.cooling.fanSpeed} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Filter Condition</span>
              <span className="font-medium">{vfd.cooling.filterCondition.toFixed(0)}%</span>
            </div>
            <Progress value={vfd.cooling.filterCondition} className="h-2" />
            
            {vfd.cooling.thermalShutdownRisk > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-800">
                    Thermal shutdown risk: {vfd.cooling.thermalShutdownRisk.toFixed(0)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lifetime Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Lifetime Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-blue-600">
                {vfd.lifetimeData.runningHours.toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600">Running Hours</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-green-600">
                {(vfd.lifetimeData.switchingCycles / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">IGBT Cycles</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-orange-600">
                {vfd.lifetimeData.temperatureCycles}
              </div>
              <div className="text-sm text-gray-600">Thermal Cycles</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-purple-600">
                {vfd.lifetimeData.estimatedLife.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Estimated Life</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Component Health</div>
            <Progress 
              value={vfd.lifetimeData.estimatedLife} 
              className="h-3"
            />
            <div className="text-xs text-gray-500">
              Based on thermal stress, switching cycles, and operating conditions
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VFDDiagnosticsPanel;
