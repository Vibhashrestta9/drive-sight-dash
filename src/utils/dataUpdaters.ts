
import type { RMDEDrive, RMDEFault } from './types';
import { generateRandomFaults } from './mockDataGenerators';

export const updateRMDEData = (drives: RMDEDrive[]): RMDEDrive[] => {
  return drives.map(drive => {
    if (Math.random() > 0.7) {
      const temperatureChange = Math.random() * 4 - 2;
      const powerChange = Math.random() * 20 - 10;
      const efficiencyChange = Math.random() * 4 - 2;
      const speedChange = Math.random() * 100 - 50;
      const torqueChange = Math.random() * 20 - 10;
      
      let newHealthScore = drive.healthScore + (Math.random() * 6 - 3);
      newHealthScore = Math.max(0, Math.min(100, newHealthScore));
      
      const newStatus = newHealthScore > 90 ? 'online' : 
                       newHealthScore > 80 ? 'warning' : 
                       newHealthScore > 70 ? 'error' : 'offline';

      let newErrors = [...drive.errors];
      if (Math.random() > 0.9 && newStatus !== 'online') {
        const errorMessages = [
          'Temperature threshold exceeded',
          'Power fluctuation detected',
          'Drive communication timeout',
          'Parameter drift outside normal range'
        ];
        
        const severity: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
        
        newErrors.push({
          id: Date.now(),
          timestamp: new Date().toISOString(),
          severity: severity[Math.floor(Math.random() * severity.length)],
          message: errorMessages[Math.floor(Math.random() * errorMessages.length)],
          resolved: false
        });
      }
      
      let newFaults = [...drive.faults];
      
      if (Math.random() > 0.95 && newStatus !== 'online') {
        newFaults = [...newFaults, ...generateRandomFaults(1)];
      }
      
      if (Math.random() > 0.85 && newFaults.length > 0) {
        const randomIndex = Math.floor(Math.random() * newFaults.length);
        newFaults.splice(randomIndex, 1);
      }
      
      return {
        ...drive,
        temperature: Math.max(20, Math.min(80, drive.temperature + temperatureChange)),
        powerUsage: Math.max(100, Math.min(400, drive.powerUsage + powerChange)),
        efficiency: Math.max(50, Math.min(100, drive.efficiency + efficiencyChange)),
        healthScore: Math.round(newHealthScore),
        status: newStatus as 'online' | 'offline' | 'warning' | 'error',
        operatingHours: drive.operatingHours + 0.01,
        errors: newErrors,
        speed: Math.max(800, Math.min(2200, drive.speed + speedChange)),
        torque: Math.max(40, Math.min(220, drive.torque + torqueChange)),
        lastUpdated: new Date().toISOString(),
        faults: newFaults
      };
    }
    return drive;
  });
};

export const sendEmailNotification = (drive: RMDEDrive, errorMessage: string): void => {
  console.info(`Email notification would be sent for ${drive.name} in ${drive.status} condition`);
};

export const fetchDriveDataFromAPI = async (moduleId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Fetching data from API for module ${moduleId}`);
      
      const response = {
        success: Math.random() > 0.1,
        timestamp: new Date().toISOString(),
        drives: Array(Math.floor(Math.random() * 3) + 1).fill(0).map((_, index) => ({
          id: index + 1,
          speed: Math.floor(Math.random() * 1000) + 1000,
          temperature: Math.floor(Math.random() * 20) + 40,
          torque: Math.floor(Math.random() * 150) + 50,
          faults: Math.random() > 0.7 ? generateRandomFaults(Math.floor(Math.random() * 2) + 1) : []
        }))
      };
      
      resolve(response);
    }, 500 + Math.random() * 1000);
  });
};
