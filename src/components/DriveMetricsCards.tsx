
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Gauge, Clock, Route, Fuel } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    direction: 'up' | 'down';
    percentage: string;
  };
  footer?: string;
}

const MetricCard = ({ title, value, description, icon, trend, footer }: MetricCardProps) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center mt-1">
            {trend.direction === 'up' ? (
              <ArrowUp className="h-3 w-3 text-green-500" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ml-1 ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trend.percentage}
            </span>
          </div>
        )}
      </CardContent>
      {footer && (
        <CardFooter className="pt-0">
          <p className="text-xs text-muted-foreground">{footer}</p>
        </CardFooter>
      )}
    </Card>
  );
};

const DriveMetricsCards = () => {
  const [metrics, setMetrics] = useState({
    activeDrivers: '14',
    averageSpeed: '42',
    driveTime: '124',
    totalDistance: '1,248',
    fuelEfficiency: '28.5'
  });

  useEffect(() => {
    // Simulate live updates to the metrics
    const interval = setInterval(() => {
      setMetrics(prev => {
        const randomChange = (min: number, max: number) => {
          return (Math.random() * (max - min) + min).toFixed(1);
        };

        const newActiveDrivers = Math.floor(Math.random() * 3) - 1 + parseInt(prev.activeDrivers);
        
        return {
          activeDrivers: Math.max(10, Math.min(20, newActiveDrivers)).toString(),
          averageSpeed: (parseFloat(prev.averageSpeed) + parseFloat(randomChange(-2, 2))).toFixed(0),
          driveTime: (parseFloat(prev.driveTime) + parseFloat(randomChange(0, 0.5))).toFixed(0),
          totalDistance: (parseFloat(prev.totalDistance.replace(',', '')) + parseFloat(randomChange(1, 5))).toLocaleString(),
          fuelEfficiency: (parseFloat(prev.fuelEfficiency) + parseFloat(randomChange(-0.2, 0.2))).toFixed(1)
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <MetricCard
        title="Active Drivers"
        value={metrics.activeDrivers}
        description="Currently on the road"
        icon={<Car className="h-4 w-4" />}
        trend={{ direction: parseInt(metrics.activeDrivers) >= 15 ? 'up' : 'down', percentage: '8% from yesterday' }}
      />
      <MetricCard
        title="Avg. Speed"
        value={`${metrics.averageSpeed} mph`}
        description="Across all active drivers"
        icon={<Gauge className="h-4 w-4" />}
        footer="Updated in real-time"
      />
      <MetricCard
        title="Drive Time"
        value={`${metrics.driveTime} hrs`}
        description="Total this week"
        icon={<Clock className="h-4 w-4" />}
        trend={{ direction: 'up', percentage: '12% from last week' }}
      />
      <MetricCard
        title="Total Distance"
        value={`${metrics.totalDistance} mi`}
        description="Driven this month"
        icon={<Route className="h-4 w-4" />}
        trend={{ direction: 'up', percentage: '5% from last month' }}
      />
      <MetricCard
        title="Fuel Efficiency"
        value={`${metrics.fuelEfficiency} mpg`}
        description="Fleet average"
        icon={<Fuel className="h-4 w-4" />}
        trend={{ direction: parseFloat(metrics.fuelEfficiency) >= 28.3 ? 'up' : 'down', percentage: '3% change' }}
      />
    </div>
  );
};

export default DriveMetricsCards;
