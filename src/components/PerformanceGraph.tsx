
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, ComposedChart, Area, AreaChart } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Activity, Gauge, Route, Zap, Clock } from 'lucide-react';

interface PerformanceData {
  time: string;
  timeNumeric: number;
  speed: number;
  distance: number;
  efficiency: number;
  operatingHours: number;
  temperature: number;
  powerUsage: number;
  healthScore: number;
}

const chartConfig = {
  speed: {
    label: "Speed",
    color: "hsl(var(--chart-1))",
  },
  distance: {
    label: "Distance",
    color: "hsl(var(--chart-2))",
  },
  efficiency: {
    label: "Efficiency",
    color: "hsl(var(--chart-3))",
  },
  operatingHours: {
    label: "Operating Hours",
    color: "hsl(var(--chart-4))",
  },
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-5))",
  },
  powerUsage: {
    label: "Power Usage",
    color: "hsl(var(--primary))",
  },
  healthScore: {
    label: "Health Score",
    color: "hsl(var(--chart-1))",
  },
};

const PerformanceGraph = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [activeMetric, setActiveMetric] = useState('speed');

  // Generate initial data and update periodically
  useEffect(() => {
    const generateData = () => {
      const data: PerformanceData[] = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timeNumeric: 24 - i,
          speed: Math.floor(Math.random() * 30) + 40, // 40-70 mph
          distance: Math.floor(Math.random() * 50) + 100, // 100-150 miles
          efficiency: Math.floor(Math.random() * 20) + 80, // 80-100%
          operatingHours: Math.floor(Math.random() * 5) + (24 - i), // Incremental hours
          temperature: Math.floor(Math.random() * 20) + 45, // 45-65°C
          powerUsage: Math.floor(Math.random() * 100) + 200, // 200-300W
          healthScore: Math.floor(Math.random() * 20) + 80, // 80-100%
        });
      }
      return data;
    };

    setPerformanceData(generateData());

    // Update data every 30 seconds
    const interval = setInterval(() => {
      setPerformanceData(prev => {
        const newData = [...prev.slice(1)];
        const lastTime = new Date();
        newData.push({
          time: lastTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timeNumeric: newData.length + 1,
          speed: Math.floor(Math.random() * 30) + 40,
          distance: Math.floor(Math.random() * 50) + 100,
          efficiency: Math.floor(Math.random() * 20) + 80,
          operatingHours: (newData[newData.length - 1]?.operatingHours || 0) + 1,
          temperature: Math.floor(Math.random() * 20) + 45,
          powerUsage: Math.floor(Math.random() * 100) + 200,
          healthScore: Math.floor(Math.random() * 20) + 80,
        });
        return newData;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getMetricInfo = (metric: string) => {
    switch (metric) {
      case 'speed':
        return {
          title: 'Drive Speed Performance',
          description: 'Real-time speed monitoring across all drives',
          icon: <Gauge className="h-4 w-4" />,
          unit: 'mph',
          yAxisLabel: 'Speed (mph)',
          color: chartConfig.speed.color
        };
      case 'distance':
        return {
          title: 'Distance Traveled',
          description: 'Cumulative distance covered by drives',
          icon: <Route className="h-4 w-4" />,
          unit: 'mi',
          yAxisLabel: 'Distance (miles)',
          color: chartConfig.distance.color
        };
      case 'efficiency':
        return {
          title: 'Energy Efficiency',
          description: 'Drive efficiency metrics over time',
          icon: <Zap className="h-4 w-4" />,
          unit: '%',
          yAxisLabel: 'Efficiency (%)',
          color: chartConfig.efficiency.color
        };
      case 'operatingHours':
        return {
          title: 'Operating Hours',
          description: 'Total operational time tracking',
          icon: <Clock className="h-4 w-4" />,
          unit: 'hrs',
          yAxisLabel: 'Hours',
          color: chartConfig.operatingHours.color
        };
      default:
        return {
          title: 'Performance Metrics',
          description: 'Drive performance data',
          icon: <Activity className="h-4 w-4" />,
          unit: '',
          yAxisLabel: 'Value',
          color: chartConfig.speed.color
        };
    }
  };

  const getCurrentValue = () => {
    if (performanceData.length === 0) return 0;
    const latest = performanceData[performanceData.length - 1];
    return latest[activeMetric as keyof PerformanceData] as number;
  };

  const getPreviousValue = () => {
    if (performanceData.length < 2) return 0;
    const previous = performanceData[performanceData.length - 2];
    return previous[activeMetric as keyof PerformanceData] as number;
  };

  const getTrend = () => {
    const current = getCurrentValue();
    const previous = getPreviousValue();
    const change = current - previous;
    const percentage = previous !== 0 ? Math.abs((change / previous) * 100) : 0;
    
    return {
      direction: change > 0 ? 'up' : 'down',
      percentage: percentage.toFixed(1)
    };
  };

  const metricInfo = getMetricInfo(activeMetric);
  const trend = getTrend();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['speed', 'distance', 'efficiency', 'operatingHours'].map((metric) => {
          const info = getMetricInfo(metric);
          const isActive = activeMetric === metric;
          const value = performanceData.length > 0 ? 
            performanceData[performanceData.length - 1][metric as keyof PerformanceData] : 0;
          
          return (
            <Card 
              key={metric}
              className={`cursor-pointer transition-all hover:shadow-md ${isActive ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setActiveMetric(metric)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {info.title.replace('Drive ', '').replace('Energy ', '')}
                </CardTitle>
                {info.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeof value === 'number' ? value.toFixed(0) : '0'}{info.unit}
                </div>
                <Badge variant={isActive ? "default" : "secondary"} className="mt-2">
                  {isActive ? 'Active' : 'View'}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {metricInfo.icon}
              <CardTitle>{metricInfo.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {trend.direction === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trend.percentage}%
              </span>
            </div>
          </div>
          <CardDescription>{metricInfo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: 'Time (Hours)', 
                    position: 'insideBottom', 
                    offset: -10,
                    style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold' }
                  }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: metricInfo.yAxisLabel, 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold' }
                  }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => `Time: ${value}`}
                />
                <Line
                  type="monotone"
                  dataKey={activeMetric}
                  stroke={metricInfo.color}
                  strokeWidth={3}
                  dot={{ fill: metricInfo.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: metricInfo.color, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Efficiency Comparison
            </CardTitle>
            <CardDescription>Current vs Previous Period</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData.slice(-12)} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }}
                    label={{ 
                      value: 'Time Period', 
                      position: 'insideBottom', 
                      offset: -10,
                      style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                    }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: 'Efficiency (%)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="efficiency" fill={chartConfig.efficiency.color} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Operating Hours Trend
            </CardTitle>
            <CardDescription>Cumulative operational time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData.slice(-12)} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }}
                    label={{ 
                      value: 'Time Period', 
                      position: 'insideBottom', 
                      offset: -10,
                      style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                    }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: 'Operating Hours', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="operatingHours"
                    stroke={chartConfig.operatingHours.color}
                    fill={chartConfig.operatingHours.color}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceGraph;
