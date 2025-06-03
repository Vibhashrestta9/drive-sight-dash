
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { History, Play, Pause, Square, Download, Compare } from 'lucide-react';
import { HistoricalDataPoint } from '@/types/advancedSimulationTypes';

interface HistoricalDataPanelProps {
  data: HistoricalDataPoint[];
  isRecording: boolean;
}

const HistoricalDataPanel = ({ data, isRecording }: HistoricalDataPanelProps) => {
  const [selectedParameters, setSelectedParameters] = useState<string[]>(['temperature', 'power']);
  const [timeRange, setTimeRange] = useState<'1m' | '5m' | '15m' | 'all'>('5m');
  const [isReplaying, setIsReplaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(1);

  const parameters = ['temperature', 'power', 'vibration', 'speed', 'pressure', 'flow'];
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  const getFilteredData = () => {
    if (timeRange === 'all') return data;
    
    const now = new Date();
    const ranges = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000
    };
    
    const cutoff = new Date(now.getTime() - ranges[timeRange]);
    return data.filter(point => point.timestamp >= cutoff);
  };

  const chartData = getFilteredData().map(point => ({
    time: point.timestamp.toLocaleTimeString(),
    timestamp: point.timestamp.getTime(),
    ...point.registers
  }));

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `simulation-data-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const startReplay = () => {
    setIsReplaying(true);
    console.log('🔄 Starting data replay...');
    // In real implementation, this would step through historical data
  };

  const stopReplay = () => {
    setIsReplaying(false);
    console.log('⏹️ Stopped data replay');
  };

  const toggleParameter = (param: string) => {
    setSelectedParameters(prev => 
      prev.includes(param) 
        ? prev.filter(p => p !== param)
        : [...prev, param]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historical Data Playback & Analysis
          {isRecording && (
            <Badge className="bg-red-100 text-red-800">
              ● RECORDING
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Record, replay, and analyze simulation data over time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Time Range:</span>
              <div className="flex gap-1">
                {(['1m', '5m', '15m', 'all'] as const).map(range => (
                  <Button
                    key={range}
                    size="sm"
                    variant={timeRange === range ? 'default' : 'outline'}
                    onClick={() => setTimeRange(range)}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={startReplay}
              disabled={isReplaying || data.length === 0}
            >
              <Play className="h-4 w-4 mr-1" />
              Replay
            </Button>
            <Button
              size="sm"
              onClick={stopReplay}
              disabled={!isReplaying}
              variant="outline"
            >
              <Square className="h-4 w-4 mr-1" />
              Stop
            </Button>
            <Button
              size="sm"
              onClick={exportData}
              disabled={data.length === 0}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <Separator />

        {/* Parameter Selection */}
        <div className="space-y-3">
          <h4 className="font-medium">Display Parameters</h4>
          <div className="flex flex-wrap gap-2">
            {parameters.map((param, index) => (
              <Button
                key={param}
                size="sm"
                variant={selectedParameters.includes(param) ? 'default' : 'outline'}
                onClick={() => toggleParameter(param)}
                className="capitalize"
                style={{
                  backgroundColor: selectedParameters.includes(param) ? colors[index] : undefined,
                  borderColor: colors[index]
                }}
              >
                {param}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Chart */}
        <div className="space-y-4">
          <h4 className="font-medium">Trend Chart</h4>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center border rounded-lg bg-gray-50">
              <div className="text-center text-gray-500">
                <History className="h-8 w-8 mx-auto mb-2" />
                <p>No historical data available</p>
                <p className="text-sm">Start a simulation to begin recording data</p>
              </div>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelStyle={{ fontSize: 12 }}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend />
                  {selectedParameters.map((param, index) => (
                    <Line
                      key={param}
                      type="monotone"
                      dataKey={param}
                      stroke={colors[index]}
                      strokeWidth={2}
                      dot={false}
                      name={param}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Statistics */}
        {data.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold">{data.length}</div>
                  <div className="text-sm text-gray-600">Data Points</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {data.length > 0 ? Math.round((data[data.length - 1].timestamp.getTime() - data[0].timestamp.getTime()) / 1000) : 0}s
                  </div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {data.reduce((sum, point) => sum + point.alarms.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Alarms</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {data.reduce((sum, point) => sum + point.faults.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Faults</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Replay Controls */}
        {isReplaying && (
          <>
            <Separator />
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Play className="h-4 w-4" />
                Replay Controls
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Speed:</span>
                  <select 
                    value={replaySpeed} 
                    onChange={(e) => setReplaySpeed(Number(e.target.value))}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value={0.1}>0.1x</option>
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={2}>2x</option>
                    <option value={5}>5x</option>
                    <option value={10}>10x</option>
                  </select>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <Button size="sm" onClick={stopReplay} variant="outline">
                  <Pause className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricalDataPanel;
