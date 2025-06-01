
import { RMDEDrive } from '../types/rmdeTypes';

/**
 * Updates RMDE data with simulated changes - EXTREMELY REDUCED FLUCTUATION RATES FOR STABILITY
 */
export const updateRMDEData = (drives: RMDEDrive[]): RMDEDrive[] => {
  return drives.map(drive => {
    // EXTREMELY REDUCED frequency: Randomly update some values to simulate real-time changes
    if (Math.random() > 0.98) { // Changed from 0.95 to 0.98 (extremely rare updates)
      // EXTREMELY REDUCED change ranges for maximum stability
      const temperatureChange = Math.random() * 0.2 - 0.1; // Changed from 0.5-0.25 to 0.2-0.1 (tiny changes)
      const powerChange = Math.random() * 1 - 0.5; // Changed from 3-1.5 to 1-0.5 (tiny changes)
      const efficiencyChange = Math.random() * 0.2 - 0.1; // Changed from 0.5-0.25 to 0.2-0.1 (tiny changes)
      
      // Store current health score as previous DHI
      const previousDHI = drive.healthScore;
      
      let newHealthScore = drive.healthScore + (Math.random() * 0.3 - 0.15); // Changed from 1-0.5 to 0.3-0.15 (minimal changes)
      newHealthScore = Math.max(0, Math.min(100, newHealthScore));
      
      const newStatus = newHealthScore > 90 ? 'online' : 
                       newHealthScore > 80 ? 'warning' : 
                       newHealthScore > 70 ? 'error' : 'offline';
      
      // Update new metrics with extremely small changes
      const responseTimeChange = Math.random() * 2 - 1; // Changed from 5-2.5 to 2-1 (minimal changes)
      const vibrationChange = Number((Math.random() * 0.03 - 0.015).toFixed(3)); // Changed from 0.1-0.05 to 0.03-0.015 (tiny changes)
      const loadCapacityChange = Math.random() * 0.3 - 0.15; // Changed from 1-0.5 to 0.3-0.15 (minimal changes)
      
      // EXTREMELY REDUCED error generation frequency
      let newErrors = [...drive.errors];
      if (Math.random() > 0.995 && newStatus !== 'online') { // Changed from 0.98 to 0.995 (extremely rare errors)
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
        operatingHours: drive.operatingHours + 0.001, // Reduced from 0.002 to 0.001 (extremely slow increment)
        errors: newErrors,
        previousDHI,
        responseTime: drive.responseTime ? 
          Math.max(30, Math.min(250, drive.responseTime + responseTimeChange)) : undefined,
        vibrationLevel: drive.vibrationLevel ? 
          Number(Math.max(0.1, Math.min(7, drive.vibrationLevel + vibrationChange)).toFixed(3)) : undefined,
        loadCapacity: drive.loadCapacity ? 
          Math.max(40, Math.min(100, drive.loadCapacity + loadCapacityChange)) : undefined,
        behavioralFingerprint: true
      };
    }
    return drive;
  });
};
