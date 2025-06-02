import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DataPoint {
  time: string;
  speed: number;
  distance: number;
  fuel: number;
}

const generateData = (points: number): DataPoint[] => {
  const data: DataPoint[] = [];
  const now = new Date();
  
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Simulate some realistic driving data with some randomness
    let speed = 35 + Math.sin(i / 2) * 15 + (Math.random() * 10 - 5);
    const distance = i === points ? 0 : data[0].distance + speed / 60; // Distance traveled in last minute
    const fuel = 30 - (i / points) * 5 + (Math.random() * 2 - 1);
    
    // Clamp speed to be realistic
    speed = Math.max(0, Math.min(70, speed));
    
    data.unshift({
      time: timeString,
      speed: Math.round(speed),
      distance: parseFloat(distance.toFixed(1)),
      fuel: parseFloat(fuel.toFixed(1)),
    });
  }
  
  return data;
};

const PerformanceGraph = () => {
  const [activeTab, setActiveTab] = useState('speed');
  const [data, setData] = useState<DataPoint[]>(generateData(10));
  
  useEffect(() => {
    // Update data every minute to simulate live updates
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)];
        const lastPoint = newData[newData.length - 1];
        const now = new Date();
        
        let newSpeed = lastPoint.speed + (Math.random() * 10 - 5);
        newSpeed = Math.max(0, Math.min(70, newSpeed));
        
        const newDistance = lastPoint.distance + newSpeed / 60;
        const newFuel = lastPoint.fuel - 0.1 * (newSpeed / 30) + (Math.random() * 0.4 - 0.2);
        
        newData.push({
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          speed: Math.round(newSpeed),
          distance: parseFloat(newDistance.toFixed(1)),
          fuel: parseFloat(Math.max(0, newFuel).toFixed(1)),
        });
        
        return newData;
      });
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate smaller updates every 10 seconds to make the chart more dynamic
    const smallUpdateInterval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData];
        const lastIndex = newData.length - 1;
        
        // Just update the latest point slightly to simulate real-time changes
        let newSpeed = newData[lastIndex].speed + (Math.random() * 4 - 2);
        newSpeed = Math.max(0, Math.min(70, newSpeed));
        
        newData[lastIndex] = {
          ...newData[lastIndex],
          speed: Math.round(newSpeed),
        };
        
        return [...newData];
      });
    }, 10000);
    
    return () => clearInterval(smallUpdateInterval);
  }, []);

  const getChartColor = () => {
    switch (activeTab) {
      case 'speed':
        return '#2563eb'; // Blue
      case 'distance':
        return '#10b981'; // Green
      case 'fuel':
        return '#f59e0b'; // Amber
      default:
        return '#2563eb';
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Driving Performance</CardTitle>
        <CardDescription>Live driving metrics over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="speed" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="speed">Speed</TabsTrigger>
            <TabsTrigger value="distance">Distance</TabsTrigger>
            <TabsTrigger value="fuel">Energy Efficiency</TabsTrigger>
          </TabsList>
          <TabsContent value="speed" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  label={{ 
                    value: 'Time', 
                    position: 'insideBottom', 
                    offset: -10,
                    style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  width={50}
                  label={{ 
                    value: 'Speed (mph)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                  }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: '1px solid #ccc' }}
                  formatter={(value) => [`${value} mph`, 'Speed']}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line
                  type="monotone"
                  dataKey="speed"
                  stroke={getChartColor()}
                  strokeWidth={3}
                  dot={{ r: 3, fill: getChartColor() }}
                  activeDot={{ r: 5, fill: getChartColor() }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="distance" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  label={{ 
                    value: 'Time', 
                    position: 'insideBottom', 
                    offset: -10,
                    style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  width={50}
                  label={{ 
                    value: 'Distance (miles)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                  }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: '1px solid #ccc' }}
                  formatter={(value) => [`${value} miles`, 'Distance']}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line
                  type="monotone"
                  dataKey="distance"
                  stroke={getChartColor()}
                  strokeWidth={3}
                  dot={{ r: 3, fill: getChartColor() }}
                  activeDot={{ r: 5, fill: getChartColor() }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="fuel" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  label={{ 
                    value: 'Time', 
                    position: 'insideBottom', 
                    offset: -10,
                    style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  width={50}
                  label={{ 
                    value: 'Energy Efficiency (mpg)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                  }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: '1px solid #ccc' }}
                  formatter={(value) => [`${value} mpg`, 'Energy Efficiency']}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="fuel" 
                  fill={getChartColor()}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceGraph;
