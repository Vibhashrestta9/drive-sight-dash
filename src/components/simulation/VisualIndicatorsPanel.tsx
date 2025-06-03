
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Gauge, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { HistoricalDataPoint } from '@/types/advancedSimulationTypes';

interface VisualIndicatorsPanelProps {
  historicalData: HistoricalDataPoint[];
  activeAlarms: string[];
  isRunning: boolean;
}

const VisualIndicatorsPanel = ({ historicalData, activeAlarms, isRunning }: VisualIndicatorsPanelProps) => {
  const latestData = historicalData[historicalData.length - 1];
  const registers = latestData?.registers || {};

  const getGaugeColor = (value: number, min: number, max: number) => {
    const normalized = (value - min) / (max - min);
    if (normalized > 0.8) return 'bg-red-500';
    if (normalized > 0.6) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getGaugePercentage = (value: number, min: number, max: number) => {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  };

  const gaugeConfigs = [
    { param: 'temperature', label: 'Temperature', unit: '°C', min: 0, max: 100, icon: '🌡️' },
    { param: 'power', label: 'Power', unit: 'W', min: 0, max: 150, icon: '⚡' },
    { param: 'vibration', label: 'Vibration', unit: 'mm/s', min: 0, max: 10, icon: '📳' },
    { param: 'speed', label: 'Speed', unit: 'RPM', min: 0, max: 3000, icon: '🔄' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Visual Indicators & Live Monitoring
          {isRunning && (
            <Badge className="bg-green-100 text-green-800">
              <Activity className="h-3 w-3 mr-1 animate-pulse" />
              LIVE
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Real-time visual feedback and parameter monitoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`text-center p-4 rounded-lg border-2 ${
            isRunning ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className={`text-2xl font-bold ${isRunning ? 'text-green-700' : 'text-gray-600'}`}>
              {isRunning ? 'RUNNING' : 'STOPPED'}
            </div>
            <div className="text-sm text-gray-600">Simulation Status</div>
          </div>
          
          <div className={`text-center p-4 rounded-lg border-2 ${
            activeAlarms.length === 0 ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
          }`}>
            <div className={`text-2xl font-bold ${
              activeAlarms.length === 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {activeAlarms.length}
            </div>
            <div className="text-sm text-gray-600">Active Alarms</div>
          </div>
          
          <div className="text-center p-4 rounded-lg border-2 border-blue-500 bg-blue-50">
            <div className="text-2xl font-bold text-blue-700">
              {historicalData.length}
            </div>
            <div className="text-sm text-gray-600">Data Points</div>
          </div>
        </div>

        <Separator />

        {/* Circular Gauges */}
        <div className="space-y-4">
          <h4 className="font-medium">Parameter Gauges</h4>
          {!latestData ? (
            <div className="text-center py-8 text-gray-500">
              <Gauge className="h-8 w-8 mx-auto mb-2" />
              <p>No live data available</p>
              <p className="text-sm">Start simulation to see real-time gauges</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {gaugeConfigs.map(config => {
                const value = registers[config.param] || 0;
                const percentage = getGaugePercentage(value, config.min, config.max);
                const colorClass = getGaugeColor(value, config.min, config.max);
                
                return (
                  <div key={config.param} className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-2">
                      {/* Circular Progress */}
                      <div className="absolute inset-0">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${percentage * 2.51} 251`}
                            className={colorClass.replace('bg-', 'text-')}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      
                      {/* Center Value */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold">{value.toFixed(1)}</div>
                          <div className="text-xs text-gray-500">{config.unit}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm font-medium">{config.icon} {config.label}</div>
                    <div className="text-xs text-gray-500">
                      {config.min} - {config.max} {config.unit}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Separator />

        {/* Linear Progress Bars */}
        <div className="space-y-4">
          <h4 className="font-medium">Parameter Trends</h4>
          {!latestData ? (
            <div className="text-center py-4 text-gray-500">
              No data to display
            </div>
          ) : (
            <div className="space-y-3">
              {gaugeConfigs.map(config => {
                const value = registers[config.param] || 0;
                const percentage = getGaugePercentage(value, config.min, config.max);
                const colorClass = getGaugeColor(value, config.min, config.max);
                
                return (
                  <div key={config.param} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span>{config.icon}</span>
                        {config.label}
                      </span>
                      <span className="text-sm font-mono">
                        {value.toFixed(1)} {config.unit}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={percentage} className="h-3" />
                      <div 
                        className={`absolute top-0 left-0 h-3 rounded-full ${colorClass} transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{config.min}</span>
                      <span>{config.max}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Alarm Indicators */}
        {activeAlarms.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                Active Alarms
              </h4>
              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 animate-pulse">
                <div className="flex items-center justify-center gap-2 text-red-700 font-bold">
                  <AlertTriangle className="h-5 w-5" />
                  ALARM CONDITION DETECTED
                </div>
                <div className="text-center text-red-600 mt-2">
                  {activeAlarms.length} alarm{activeAlarms.length !== 1 ? 's' : ''} require attention
                </div>
              </div>
            </div>
          </>
        )}

        {/* Mini Trend Chart */}
        {historicalData.length > 1 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Recent Trends
              </h4>
              <div className="h-20 bg-gray-50 rounded-lg flex items-end p-2 gap-1">
                {historicalData.slice(-20).map((point, index) => {
                  const temp = point.registers.temperature || 0;
                  const height = Math.max(4, (temp / 100) * 60); // Scale to 60px max height
                  return (
                    <div
                      key={index}
                      className="bg-blue-500 rounded-t flex-1 transition-all duration-300"
                      style={{ height: `${height}px` }}
                      title={`Temperature: ${temp.toFixed(1)}°C`}
                    />
                  );
                })}
              </div>
              <div className="text-xs text-gray-500 text-center">
                Temperature trend (last 20 readings)
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VisualIndicatorsPanel;
