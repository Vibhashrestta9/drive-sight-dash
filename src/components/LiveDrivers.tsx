
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Car, MapPin, Activity } from 'lucide-react';

interface Driver {
  id: number;
  name: string;
  status: 'active' | 'idle' | 'offline';
  location: string;
  lastUpdate: string;
  avatar: string;
}

const LiveDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching live driver data
  useEffect(() => {
    // Initial data
    const initialDrivers: Driver[] = [
      { 
        id: 1, 
        name: 'Alex Johnson', 
        status: 'active', 
        location: 'Downtown', 
        lastUpdate: '2 min ago',
        avatar: 'AJ'
      },
      { 
        id: 2, 
        name: 'Sarah Williams', 
        status: 'active', 
        location: 'Highway 101', 
        lastUpdate: '5 min ago',
        avatar: 'SW'
      },
      { 
        id: 3, 
        name: 'Michael Chen', 
        status: 'idle', 
        location: 'Central Park', 
        lastUpdate: '10 min ago',
        avatar: 'MC'
      },
      { 
        id: 4, 
        name: 'Rachel Green', 
        status: 'offline', 
        location: 'Last: Airport Rd', 
        lastUpdate: '1 hour ago',
        avatar: 'RG'
      },
      { 
        id: 5, 
        name: 'David Lopez', 
        status: 'active', 
        location: 'Main Street', 
        lastUpdate: '4 min ago',
        avatar: 'DL'
      }
    ];
    
    setDrivers(initialDrivers);
    setLoading(false);

    // Simulate live updates
    const interval = setInterval(() => {
      setDrivers(prevDrivers => {
        return prevDrivers.map(driver => {
          // Randomly update some drivers' status and location
          if (Math.random() > 0.7) {
            const statuses: ('active' | 'idle' | 'offline')[] = ['active', 'idle', 'offline'];
            const locations = ['Downtown', 'Highway 101', 'Main Street', 'Broadway', 'Riverside Drive', 'Market Street'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            const timeUpdates = ['Just now', '1 min ago', '2 min ago', '5 min ago'];
            const randomTime = timeUpdates[Math.floor(Math.random() * timeUpdates.length)];
            
            return {
              ...driver,
              status: randomStatus,
              location: randomStatus !== 'offline' ? randomLocation : `Last: ${randomLocation}`,
              lastUpdate: randomTime
            };
          }
          return driver;
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Drivers</CardTitle>
          <CardDescription>Loading driver data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Live Drivers</CardTitle>
            <CardDescription>Real-time driver status and locations</CardDescription>
          </div>
          <Badge className="bg-green-500">{drivers.filter(d => d.status === 'active').length} Active</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {drivers.map((driver) => (
              <div key={driver.id} className="flex items-center justify-between p-3 bg-card rounded-lg border transition-all hover:bg-accent/20">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                      {driver.avatar}
                    </div>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{driver.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      <span>{driver.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(driver.status)} mr-2`}></div>
                    <span className="text-sm font-medium capitalize">{driver.status}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{driver.lastUpdate}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LiveDrivers;
