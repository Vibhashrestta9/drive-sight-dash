import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, XCircle } from 'lucide-react';
import { sendEmailAlert } from '@/utils/alertUtils';
import { AlertSettings } from './AlertSettingsDialog';
import { Driver } from '@/types/driverTypes';
import DriverList from './drivers/DriverList';
import AlertControls from './drivers/AlertControls';

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
    sendgridApiKey: '',
    senderEmail: '',
  });
  
  const [sendingAlert, setSendingAlert] = useState(false);

  useEffect(() => {
    const initialDrivers: Driver[] = [
      { 
        id: 1, 
        name: 'Drive1', 
        status: 'active', 
        location: 'Downtown', 
        lastUpdate: '2 min ago',
        avatar: 'D1'
      },
      { 
        id: 2, 
        name: 'Drive2', 
        status: 'active', 
        location: 'Highway 101', 
        lastUpdate: '5 min ago',
        avatar: 'D2'
      },
      { 
        id: 3, 
        name: 'Drive3', 
        status: 'idle', 
        location: 'Central Park', 
        lastUpdate: '10 min ago',
        avatar: 'D3'
      },
      { 
        id: 4, 
        name: 'Drive4', 
        status: 'offline', 
        location: 'Last: Airport Rd', 
        lastUpdate: '1 hour ago',
        avatar: 'D4'
      },
      { 
        id: 5, 
        name: 'Drive5', 
        status: 'active', 
        location: 'Main Street', 
        lastUpdate: '4 min ago',
        avatar: 'D5'
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
        toast({
          title: "Sending Alert Email",
          description: `Sending notification to ${alertSettings.emailAddress}`
        });
        
        if (alertSettings.sendgridApiKey && alertSettings.senderEmail) {
          const success = await sendEmailAlert(
            {
              driverName: driver.name,
              location: driver.location,
              timestamp: new Date().toLocaleString(),
              status: driver.status
            }, 
            alertSettings.emailAddress,
            {
              sendgridApiKey: alertSettings.sendgridApiKey,
              senderEmail: alertSettings.senderEmail
            }
          );
          
          if (success) {
            toast({
              title: "Alert Email Sent",
              description: `Notification sent to ${alertSettings.emailAddress}`
            });
          } else {
            toast({
              title: "Failed to Send Alert",
              description: "Could not send email notification. Check your console logs for details.",
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "SendGrid Configuration Missing",
            description: "Please configure SendGrid API key and sender email in Alert Settings",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error sending alert:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while sending the alert. Check console for details.",
          variant: "destructive"
        });
      } finally {
        setSendingAlert(false);
      }
    } else if (alertSettings.enabled && !alertSettings.emailAddress) {
      toast({
        title: "Missing Email Address",
        description: "Please set an email address in Alert Settings",
        variant: "destructive"
      });
    }
    
    console.log(`Alert notification for ${driver.name} in critical condition`);
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

  const testSendEmail = async () => {
    setSendingAlert(true);
    try {
      if (!alertSettings.enabled || !alertSettings.emailAddress) {
        toast({
          title: "Email Alerts Not Enabled",
          description: "Please enable alerts and set an email address in Alert Settings",
          variant: "destructive"
        });
        return;
      }
      
      if (!alertSettings.sendgridApiKey || !alertSettings.senderEmail) {
        toast({
          title: "SendGrid Configuration Missing",
          description: "Please configure SendGrid API key and sender email in Alert Settings",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Testing Email Alert",
        description: "Sending a test email..."
      });

      const testSuccess = await sendEmailAlert(
        {
          driverName: "TEST DRIVER",
          location: "Test Location",
          timestamp: new Date().toLocaleString(),
          status: "critical"
        },
        alertSettings.emailAddress,
        {
          sendgridApiKey: alertSettings.sendgridApiKey,
          senderEmail: alertSettings.senderEmail
        }
      );

      if (testSuccess) {
        toast({
          title: "Test Email Sent",
          description: `A test notification was sent to ${alertSettings.emailAddress}`
        });
      } else {
        toast({
          title: "Test Email Failed",
          description: "Failed to send test email. Please check console for details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "Error",
        description: "Failed to send test email. See console for details.",
        variant: "destructive"
      });
    } finally {
      setSendingAlert(false);
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
          <AlertControls 
            criticalAlerts={criticalAlerts}
            activeDrivers={drivers.filter(d => d.status === 'active').length}
            onSimulateCritical={simulateCriticalCondition}
            onTestEmail={testSendEmail}
            onSaveSettings={handleSaveAlertSettings}
            currentSettings={alertSettings}
            sendingAlert={sendingAlert}
          />
        </div>
      </CardHeader>
      <CardContent>
        <DriverList drivers={drivers} />
      </CardContent>
    </Card>
  );
};

export default LiveDrivers;
