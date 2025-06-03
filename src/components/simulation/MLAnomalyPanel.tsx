
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Brain, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { MLAnomalyConfig } from '@/types/advancedSimulationTypes';

interface MLAnomalyPanelProps {
  config: MLAnomalyConfig;
  onConfigChange: (config: MLAnomalyConfig) => void;
}

const MLAnomalyPanel = ({ config, onConfigChange }: MLAnomalyPanelProps) => {
  const [isTraining, setIsTraining] = useState(false);

  const startTraining = () => {
    setIsTraining(true);
    console.log('🤖 Starting ML model training...');
    
    // Simulate training process
    setTimeout(() => {
      setIsTraining(false);
      console.log('✅ ML model training completed');
      
      // Add some training data
      onConfigChange({
        ...config,
        trainingData: [
          // Simulate some training data points
          ...(new Array(50).fill(0).map((_, i) => ({
            timestamp: new Date(Date.now() - i * 60000),
            registers: {
              temperature: 40 + Math.random() * 10,
              power: 70 + Math.random() * 20,
              vibration: 1 + Math.random() * 2
            },
            alarms: [],
            faults: []
          })))
        ]
      });
    }, 3000);
  };

  const clearAnomalies = () => {
    onConfigChange({
      ...config,
      detectedAnomalies: []
    });
  };

  const recentAnomalies = config.detectedAnomalies.slice(-5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          ML Anomaly Detection
          {config.enabled && (
            <Badge className="bg-purple-100 text-purple-800">
              AI ACTIVE
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Machine learning powered anomaly detection and analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ML Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Anomaly Detection</h4>
              <p className="text-sm text-gray-600">Enable AI-powered anomaly detection</p>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(enabled) => onConfigChange({ ...config, enabled })}
            />
          </div>
          
          {config.enabled && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Detection Sensitivity</label>
                  <span className="text-sm text-gray-600">{Math.round(config.sensitivity * 100)}%</span>
                </div>
                <Slider
                  value={[config.sensitivity]}
                  onValueChange={([value]) => onConfigChange({ ...config, sensitivity: value })}
                  max={1}
                  min={0.1}
                  step={0.05}
                  className="w-full"
                />
                <div className="text-xs text-gray-500">
                  Higher sensitivity detects more anomalies but may increase false positives
                </div>
              </div>
            </>
          )}
        </div>

        <Separator />

        {/* Training Status */}
        <div className="space-y-4">
          <h4 className="font-medium">Model Training</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold">{config.trainingData.length}</div>
              <div className="text-sm text-gray-600">Training Samples</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold">{config.detectedAnomalies.length}</div>
              <div className="text-sm text-gray-600">Anomalies Detected</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={startTraining}
              disabled={isTraining || !config.enabled}
              className="flex items-center gap-2"
            >
              {isTraining ? (
                <>
                  <Brain className="h-4 w-4 animate-pulse" />
                  Training...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Train Model
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={clearAnomalies}
              disabled={config.detectedAnomalies.length === 0}
            >
              Clear History
            </Button>
          </div>
          
          {isTraining && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Training Progress</span>
                <span>Processing data...</span>
              </div>
              <Progress value={30} className="w-full" />
            </div>
          )}
        </div>

        <Separator />

        {/* Recent Anomalies */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Recent Anomalies</h4>
            {config.detectedAnomalies.length > 0 && (
              <Badge variant="outline">{config.detectedAnomalies.length} total</Badge>
            )}
          </div>
          
          {recentAnomalies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-8 w-8 mx-auto mb-2" />
              <p>No anomalies detected</p>
              {!config.enabled && (
                <p className="text-sm">Enable anomaly detection to start monitoring</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnomalies.map((anomaly, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-3 ${
                    anomaly.score > 0.8 ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        anomaly.score > 0.8 ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      <span className="font-medium">
                        Anomaly Score: {(anomaly.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {anomaly.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {anomaly.parameters.map(param => (
                      <Badge key={param} variant="outline" className="text-xs">
                        {param}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-2">
                    <Progress 
                      value={anomaly.score * 100} 
                      className={`w-full ${
                        anomaly.score > 0.8 ? 'bg-red-200' : 'bg-yellow-200'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Insights */}
        {config.enabled && config.detectedAnomalies.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                AI Insights
              </h4>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800">Pattern Analysis</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    {config.detectedAnomalies.length > 10
                      ? "Frequent anomalies detected. Consider reviewing system parameters and thresholds."
                      : config.detectedAnomalies.length > 5
                      ? "Moderate anomaly activity. Monitor for recurring patterns."
                      : "Low anomaly activity. System appears to be operating within normal parameters."
                    }
                  </p>
                  
                  {config.detectedAnomalies.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm font-medium text-purple-800">Most Affected Parameters:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Array.from(new Set(config.detectedAnomalies.flatMap(a => a.parameters)))
                          .slice(0, 5)
                          .map(param => (
                            <Badge key={param} className="bg-purple-100 text-purple-800">
                              {param}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MLAnomalyPanel;
