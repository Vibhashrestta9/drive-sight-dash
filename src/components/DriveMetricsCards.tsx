
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Gauge, Clock, Route, Fuel, CarFront } from 'lucide-react';

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
  bgGradient: string;
  iconBg: string;
}

const MetricCard = ({ title, value, description, icon, trend, footer, bgGradient, iconBg }: MetricCardProps) => {
  return (
    <Card className={`transition-all hover:shadow-xl transform hover:scale-105 ${bgGradient} border-0 text-white`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-white/90">{title}</CardTitle>
        <div className={`h-10 w-10 rounded-full ${iconBg} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
        <p className="text-xs text-white/80">{description}</p>
        {trend && (
          <div className="flex items-center mt-2">
            {trend.direction === 'up' ? (
              <ArrowUp className="h-4 w-4 text-green-300" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-300" />
            )}
            <span className={`text-sm ml-1 font-medium ${trend.direction === 'up' ? 'text-green-300' : 'text-red-300'}`}>
              {trend.percentage}
            </span>
          </div>
        )}
      </CardContent>
      {footer && (
        <CardFooter className="pt-0">
          <p className="text-xs text-white/70">{footer}</p>
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
    // DRAMATICALLY INCREASED UPDATE FREQUENCY FROM 60000ms to 180000ms (3 minutes)
    const interval = setInterval(() => {
      setMetrics(prev => {
        const randomChange = (min: number, max: number) => {
          return (Math.random() * (max - min) + min).toFixed(1);
        };

        const newActiveDrivers = Math.floor(Math.random() * 1) + parseInt(prev.activeDrivers); // Reduced from 2 to 1 (minimal change)
        
        return {
          activeDrivers: Math.max(10, Math.min(20, newActiveDrivers)).toString(),
          averageSpeed: (parseFloat(prev.averageSpeed) + parseFloat(randomChange(-0.1, 0.1))).toFixed(0), // Reduced from -0.3,0.3 to -0.1,0.1
          driveTime: (parseFloat(prev.driveTime) + parseFloat(randomChange(0, 0.03))).toFixed(0), // Reduced from 0.1 to 0.03
          totalDistance: (parseFloat(prev.totalDistance.replace(',', '')) + parseFloat(randomChange(0.03, 0.1))).toLocaleString(), // Reduced from 0.1,0.5 to 0.03,0.1
          fuelEfficiency: (parseFloat(prev.fuelEfficiency) + parseFloat(randomChange(-0.02, 0.02))).toFixed(1) // Reduced from -0.05,0.05 to -0.02,0.02
        };
      });
    }, 180000); // Changed from 60000 to 180000 milliseconds (3 minutes)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
      <MetricCard
        title="Active Drivers"
        value={metrics.activeDrivers}
        description="Currently on the road"
        icon={<CarFront className="h-5 w-5" />}
        trend={{ direction: parseInt(metrics.activeDrivers) >= 15 ? 'up' : 'down', percentage: '8% from yesterday' }}
        bgGradient="bg-gradient-to-br from-blue-500 to-blue-600"
        iconBg="bg-blue-700"
      />
      <MetricCard
        title="Avg. Speed"
        value={`${metrics.averageSpeed} mph`}
        description="Across all active drivers"
        icon={<Gauge className="h-5 w-5" />}
        footer="Updated in real-time"
        bgGradient="bg-gradient-to-br from-green-500 to-emerald-600"
        iconBg="bg-green-700"
      />
      <MetricCard
        title="Drive Time"
        value={`${metrics.driveTime} hrs`}
        description="Total this week"
        icon={<Clock className="h-5 w-5" />}
        trend={{ direction: 'up', percentage: '12% from last week' }}
        bgGradient="bg-gradient-to-br from-purple-500 to-purple-600"
        iconBg="bg-purple-700"
      />
      <MetricCard
        title="Total Distance"
        value={`${metrics.totalDistance} mi`}
        description="Driven this month"
        icon={<Route className="h-5 w-5" />}
        trend={{ direction: 'up', percentage: '5% from last month' }}
        bgGradient="bg-gradient-to-br from-orange-500 to-red-500"
        iconBg="bg-red-600"
      />
      <MetricCard
        title="Fuel Efficiency"
        value={`${metrics.fuelEfficiency} mpg`}
        description="Fleet average"
        icon={<Fuel className="h-5 w-5" />}
        trend={{ direction: parseFloat(metrics.fuelEfficiency) >= 28.3 ? 'up' : 'down', percentage: '3% change' }}
        bgGradient="bg-gradient-to-br from-teal-500 to-cyan-600"
        iconBg="bg-teal-700"
      />
    </div>
  );
};

export default DriveMetricsCards;
