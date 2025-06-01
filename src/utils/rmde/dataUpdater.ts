
import { RMDEDrive } from '../types/rmdeTypes';

/**
 * Updates RMDE data with simulated changes - SIGNIFICANTLY REDUCED FLUCTUATION RATES
 */
export const updateRMDEData = (drives: RMDEDrive[]): RMDEDrive[] => {
  return drives.map(drive => {
    // SIGNIFICANTLY REDUCED frequency: Randomly update some values to simulate real-time changes
    if (Math.random() > 0.95) { // Changed from 0.85 to 0.95 (much less frequent updates)
      // SIGNIFICANTLY REDUCED change ranges for very stable values
      const temperatureChange = Math.random() * 0.5 - 0.25; // Changed from 2-1 to 0.5-0.25 (much smaller changes)
      const powerChange = Math.random() * 3 - 1.5; // Changed from 10-5 to 3-1.5 (much smaller changes)
      const efficiencyChange = Math.random() * 0.5 - 0.25; // Changed from 2-1 to 0.5-0.25 (much smaller changes)
      
      // Store current health score as previous DHI
      const previousDHI = drive.healthScore;
      
      let newHealthScore = drive.healthScore + (Math.random() * 1 - 0.5); // Changed from 3-1.5 to 1-0.5 (much smaller changes)
      newHealthScore = Math.max(0, Math.min(100, newHealthScore));
      
      const newStatus = newHealthScore > 90 ? 'online' : 
                       newHealthScore > 80 ? 'warning' : 
                       newHealthScore > 70 ? 'error' : 'offline';
      
      // Update new metrics with much smaller changes
      const responseTimeChange = Math.random() * 5 - 2.5; // Changed from 20-10 to 5-2.5
      const vibrationChange = Number((Math.random() * 0.1 - 0.05).toFixed(2)); // Changed from 0.3-0.15 to 0.1-0.05
      const loadCapacityChange = Math.random() * 1 - 0.5; // Changed from 3-1.5 to 1-0.5
      
      // MUCH REDUCED error generation frequency
      let newErrors = [...drive.errors];
      if (Math.random() > 0.98 && newStatus !== 'online') { // Changed from 0.95 to 0.98 (much less frequent errors)
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
      
      return {
        ...drive,
        temperature: Math.max(20, Math.min(80, drive.temperature + temperatureChange)),
        powerUsage: Math.max(100, Math.min(400, drive.powerUsage + powerChange)),
        efficiency: Math.max(50, Math.min(100, drive.efficiency + efficiencyChange)),
        healthScore: Math.round(newHealthScore),
        status: newStatus as 'online' | 'offline' | 'warning' | 'error',
        operatingHours: drive.operatingHours + 0.002, // Reduced from 0.005 to 0.002
        errors: newErrors,
        previousDHI,
        responseTime: drive.responseTime ? 
          Math.max(30, Math.min(250, drive.responseTime + responseTimeChange)) : undefined,
        vibrationLevel: drive.vibrationLevel ? 
          Number(Math.max(0.1, Math.min(7, drive.vibrationLevel + vibrationChange)).toFixed(2)) : undefined,
        loadCapacity: drive.loadCapacity ? 
          Math.max(40, Math.min(100, drive.loadCapacity + loadCapacityChange)) : undefined,
        behavioralFingerprint: true
      };
    }
    return drive;
  });
};
