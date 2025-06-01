
import { RMDEDrive } from '../types/rmdeTypes';

/**
 * Updates RMDE data with simulated changes - REDUCED FLUCTUATION RATES
 */
export const updateRMDEData = (drives: RMDEDrive[]): RMDEDrive[] => {
  return drives.map(drive => {
    // REDUCED frequency: Randomly update some values to simulate real-time changes
    if (Math.random() > 0.85) { // Changed from 0.7 to 0.85 (less frequent updates)
      // REDUCED change ranges for more stable values
      const temperatureChange = Math.random() * 2 - 1; // Changed from 4-2 to 2-1 (smaller changes)
      const powerChange = Math.random() * 10 - 5; // Changed from 20-10 to 10-5 (smaller changes)
      const efficiencyChange = Math.random() * 2 - 1; // Changed from 4-2 to 2-1 (smaller changes)
      
      // Store current health score as previous DHI
      const previousDHI = drive.healthScore;
      
      let newHealthScore = drive.healthScore + (Math.random() * 3 - 1.5); // Changed from 6-3 to 3-1.5 (smaller changes)
      newHealthScore = Math.max(0, Math.min(100, newHealthScore));
      
      const newStatus = newHealthScore > 90 ? 'online' : 
                       newHealthScore > 80 ? 'warning' : 
                       newHealthScore > 70 ? 'error' : 'offline';
      
      // Update new metrics with smaller changes
      const responseTimeChange = Math.random() * 20 - 10; // Changed from 40-20 to 20-10
      const vibrationChange = Number((Math.random() * 0.3 - 0.15).toFixed(2)); // Changed from 0.6-0.3 to 0.3-0.15
      const loadCapacityChange = Math.random() * 3 - 1.5; // Changed from 6-3 to 3-1.5
      
      // REDUCED error generation frequency
      let newErrors = [...drive.errors];
      if (Math.random() > 0.95 && newStatus !== 'online') { // Changed from 0.9 to 0.95 (less frequent errors)
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
        operatingHours: drive.operatingHours + 0.005, // Reduced from 0.01 to 0.005
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
