import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Activity, AlertTriangle, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import AlertSettingsDialog, { AlertSettings } from './AlertSettingsDialog';
import { sendEmailAlert } from '@/utils/alertUtils';

interface Driver {
  id: number;
  name: string;
  status: 'active' | 'idle' | 'offline' | 'critical';
  location: string;
  lastUpdate: string;
  avatar: string;
}

const LiveDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState<Driver[]>([]);
  const { toast } = useToast();
  
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    enabled: false,
    emailAddress: '',
    sendSMS: false,
    phoneNumber: '',
  });
  
  const [sendingAlert, setSendingAlert] = useState(false);

  useEffect(() => {
    const initialDrivers: Driver[] = [
      { 
        id: 1, 
        name: 'GIRISHA CD', 
        status: 'active', 
        location: 'Downtown', 
        lastUpdate: '2 min ago',
        avatar: 'GC'
      },
      { 
        id: 2, 
        name: 'MOHAN', 
        status: 'active', 
        location: 'Highway 101', 
        lastUpdate: '5 min ago',
        avatar: 'M'
      },
      { 
        id: 3, 
        name: 'BABITHA', 
        status: 'idle', 
        location: 'Central Park', 
        lastUpdate: '10 min ago',
        avatar: 'B'
      },
      { 
        id: 4, 
        name: 'ANATH N', 
        status: 'offline', 
        location: 'Last: Airport Rd', 
        lastUpdate: '1 hour ago',
        avatar: 'AN'
      },
      { 
        id: 5, 
        name: 'VIBHA SHRESTTA', 
        status: 'active', 
        location: 'Main Street', 
        lastUpdate: '4 min ago',
        avatar: 'VS'
      }
    ];

    setDrivers(initialDrivers);
    setLoading(false);

    const interval = setInterval(() => {
      setDrivers(prevDrivers => {
        return prevDrivers.map(driver => {
          if (Math.random() > 0.7) {
            const statuses: ('active' | 'idle' | 'offline' | 'critical')[] = ['active', 'idle', 'offline', 'critical'];
            const locations = ['Downtown', 'Highway 101', 'Main Street', 'Broadway', 'Riverside Drive', 'Market Street'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            const timeUpdates = ['Just now', '1 min ago', '2 min ago', '5 min ago'];
            const randomTime = timeUpdates[Math.floor(Math.random() * timeUpdates.length)];
            
            if (randomStatus === 'critical' && driver.status !== 'critical') {
              const updatedDriver = {
                ...driver,
                status: randomStatus,
                location: randomLocation,
                lastUpdate: randomTime
              };
              
              handleCriticalAlert(updatedDriver);
            }
            
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

  useEffect(() => {
    const criticalDrivers = drivers.filter(driver => driver.status === 'critical');
    setCriticalAlerts(criticalDrivers);
  }, [drivers]);

  const handleCriticalAlert = async (driver: Driver) => {
    toast({
      title: "CRITICAL ALERT!",
      description: `${driver.name} is in critical condition at ${driver.location}`,
      variant: "destructive",
    });
    
    if (alertSettings.enabled && alertSettings.emailAddress) {
      setSendingAlert(true);
      
      try {
        const success = await sendEmailAlert({
          driverName: driver.name,
          location: driver.location,
          timestamp: new Date().toLocaleString(),
          status: driver.status
        }, alertSettings.emailAddress);
        
        if (success) {
          toast({
            title: "Alert Email Sent",
            description: `Notification sent to ${alertSettings.emailAddress}`,
          });
        } else {
          toast({
            title: "Failed to Send Alert",
            description: "Could not send email notification",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error sending alert:", error);
      } finally {
        setSendingAlert(false);
      }
    }
    
    console.log(`Email notification would be sent for ${driver.name} in critical condition`);
  };

  const simulateCriticalCondition = () => {
    setDrivers(prevDrivers => {
      const driverIndex = Math.floor(Math.random() * prevDrivers.length);
      const updatedDrivers = [...prevDrivers];
      const driver = {...updatedDrivers[driverIndex], status: 'critical' as const};
      updatedDrivers[driverIndex] = driver;
      
      handleCriticalAlert(driver);
      return updatedDrivers;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSaveAlertSettings = (newSettings: AlertSettings) => {
    setAlertSettings(newSettings);
    localStorage.setItem('driveSightAlertSettings', JSON.stringify(newSettings));
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('driveSightAlertSettings');
    if (savedSettings) {
      try {
        setAlertSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse saved alert settings");
      }
    }
  }, []);

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
          <div className="flex items-center gap-2">
            {criticalAlerts.length > 0 && (
              <Badge className="bg-red-500 animate-pulse flex items-center gap-1">
                <AlertTriangle size={14} />
                {criticalAlerts.length} Critical
              </Badge>
            )}
            <Badge className="bg-green-500">{drivers.filter(d => d.status === 'active').length} Active</Badge>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={simulateCriticalCondition}>
                Test Alert
              </Button>
              <AlertSettingsDialog 
                onSave={handleSaveAlertSettings} 
                currentSettings={alertSettings} 
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {drivers.map((driver) => (
              <div key={driver.id} 
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  driver.status === 'critical' 
                    ? 'bg-red-50 border-red-200 animate-pulse dark:bg-red-950/20 dark:border-red-800' 
                    : 'bg-card hover:bg-accent/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className={`h-10 w-10 ${driver.status === 'critical' ? 'ring-2 ring-red-500' : ''}`}>
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
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(driver.status)} mr-2 ${
                      driver.status === 'critical' ? 'animate-ping' : ''
                    }`}></div>
                    <span className={`text-sm font-medium capitalize ${
                      driver.status === 'critical' ? 'text-red-600 dark:text-red-400' : ''
                    }`}>{driver.status}</span>
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
