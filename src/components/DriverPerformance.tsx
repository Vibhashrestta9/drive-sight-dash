
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DriverData {
  id: number;
  name: string;
  avatar: string;
  safetyScore: number;
  avgSpeed: number;
  distanceDriven: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

const DriverPerformance = () => {
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetch
    const driverData: DriverData[] = [
      {
        id: 1,
        name: 'Alex Johnson',
        avatar: 'AJ',
        safetyScore: 92,
        avgSpeed: 34,
        distanceDriven: 152,
        status: 'excellent'
      },
      {
        id: 2,
        name: 'Sarah Williams',
        avatar: 'SW',
        safetyScore: 88,
        avgSpeed: 38,
        distanceDriven: 134,
        status: 'good'
      },
      {
        id: 3,
        name: 'Michael Chen',
        avatar: 'MC',
        safetyScore: 74,
        avgSpeed: 42,
        distanceDriven: 98,
        status: 'average'
      },
      {
        id: 4,
        name: 'Rachel Green',
        avatar: 'RG',
        safetyScore: 65,
        avgSpeed: 45,
        distanceDriven: 76,
        status: 'poor'
      },
      {
        id: 5,
        name: 'David Lopez',
        avatar: 'DL',
        safetyScore: 95,
        avgSpeed: 32,
        distanceDriven: 186,
        status: 'excellent'
      },
      {
        id: 6,
        name: 'Emma Thompson',
        avatar: 'ET',
        safetyScore: 82,
        avgSpeed: 37,
        distanceDriven: 124,
        status: 'good'
      }
    ];

    setDrivers(driverData);
    setLoading(false);

    // Simulate occasional updates to driver data
    const interval = setInterval(() => {
      setDrivers(prevDrivers => {
        return prevDrivers.map(driver => {
          // Only update some drivers sometimes
          if (Math.random() > 0.7) {
            const newSafetyScore = Math.min(100, Math.max(50, driver.safetyScore + (Math.random() * 6 - 3)));
            const newAvgSpeed = Math.max(25, Math.min(50, driver.avgSpeed + (Math.random() * 4 - 2)));
            const newDistanceDriven = driver.distanceDriven + (Math.random() * 3);
            
            let newStatus = driver.status;
            if (newSafetyScore >= 90) newStatus = 'excellent';
            else if (newSafetyScore >= 80) newStatus = 'good';
            else if (newSafetyScore >= 70) newStatus = 'average';
            else newStatus = 'poor';
            
            return {
              ...driver,
              safetyScore: Math.round(newSafetyScore),
              avgSpeed: Math.round(newAvgSpeed),
              distanceDriven: Math.round(newDistanceDriven),
              status: newStatus
            };
          }
          return driver;
        });
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500 hover:bg-green-600';
      case 'good':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'average':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'poor':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Driver Performance</CardTitle>
          <CardDescription>Loading driver data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Driver Performance</CardTitle>
        <CardDescription>Safety scores and driving statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {drivers.map((driver) => (
              <div key={driver.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-xs">
                        {driver.avatar}
                      </div>
                    </Avatar>
                    <span className="font-medium text-sm">{driver.name}</span>
                  </div>
                  <Badge className={`capitalize ${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Safety Score</span>
                    <span className="font-medium">{driver.safetyScore}%</span>
                  </div>
                  <Progress value={driver.safetyScore} className={getProgressColor(driver.safetyScore)} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span>Avg Speed:</span>
                    <span className="font-medium ml-1">{driver.avgSpeed} mph</span>
                  </div>
                  <div>
                    <span>Distance:</span>
                    <span className="font-medium ml-1">{driver.distanceDriven} mi</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DriverPerformance;
