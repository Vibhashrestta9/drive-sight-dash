
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RMDEDrive } from '@/utils/types/rmdeTypes';

interface MaintenanceLogEntry {
  driveId: string;
  timestamp: Date;
}

export function useMaintenanceLog(drives: RMDEDrive[]) {
  const [maintenanceLog, setMaintenanceLog] = useState<MaintenanceLogEntry[]>([]);
  const { toast } = useToast();
  
  const logServiceActivity = (driveId: string) => {
    const newLog = {
      driveId,
      timestamp: new Date()
    };
    
    setMaintenanceLog(prev => [...prev, newLog]);
    
    const drive = drives.find(d => d.id.toString() === driveId);
    if (drive) {
      toast({
        title: "Maintenance Logged", 
        description: `Service logged for ${drive.name} at ${newLog.timestamp.toLocaleTimeString()}`,
        duration: 3000
      });
    }
  };
  
  return {
    maintenanceLog,
    logServiceActivity
  };
}
