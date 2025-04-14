
interface RMDEDrive {
  id: number;
  name: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  moduleId: string;
  temperature: number;
  powerUsage: number;
  operatingHours: number;
  efficiency: number;
  lastMaintenance: string;
  healthScore: number;
  errors: RMDEError[];
}

interface RMDEError {
  id: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  resolved: boolean;
}

/**
 * Generates initial mock RMDE drive data
 */
export const generateInitialRMDEData = (): RMDEDrive[] => {
  const moduleIds = ['NETA-21-A', 'NETA-21-B', 'NETA-21-C'];
  const driveNames = [
    'GIRISHA CD', 'MOHAN', 'BABITHA', 
    'ANATH N', 'VIBHA SHRESTTA'
  ];
  
  return driveNames.map((name, index) => {
    const healthScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const status = healthScore > 90 ? 'online' : 
                  healthScore > 80 ? 'warning' : 
                  healthScore > 70 ? 'error' : 'offline';
    
    return {
      id: index + 1,
      name,
      status,
      moduleId: moduleIds[Math.floor(Math.random() * moduleIds.length)],
      temperature: Math.floor(Math.random() * 20) + 40, // 40-60°C
      powerUsage: Math.floor(Math.random() * 100) + 200, // 200-300W
      operatingHours: Math.floor(Math.random() * 5000) + 1000, // 1000-6000 hours
      efficiency: Math.floor(Math.random() * 20) + 80, // 80-100%
      lastMaintenance: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toLocaleDateString(), // Random date in last 30 days
      healthScore,
      errors: generateRandomErrors(Math.floor(Math.random() * 4)) // 0-3 errors
    };
  });
};

/**
 * Generates random RMDE errors
 */
const generateRandomErrors = (count: number): RMDEError[] => {
  const errorMessages = [
    'Temperature threshold exceeded',
    'Power fluctuation detected',
    'Drive communication timeout',
    'Parameter drift outside normal range',
    'Connection quality degraded',
    'System resource limitation',
    'Configuration mismatch detected',
    'Operational anomaly detected'
  ];
  
  const errors: RMDEError[] = [];
  for (let i = 0; i < count; i++) {
    const severity: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    errors.push({
      id: i + 1,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 48) * 3600000).toISOString(), // Random time in last 48 hours
      severity: severity[Math.floor(Math.random() * severity.length)],
      message: errorMessages[Math.floor(Math.random() * errorMessages.length)],
      resolved: Math.random() > 0.7 // 30% chance of being resolved
    });
  }
  
  return errors;
};

/**
 * Updates RMDE data with simulated changes
 */
export const updateRMDEData = (drives: RMDEDrive[]): RMDEDrive[] => {
  return drives.map(drive => {
    // Randomly update some values to simulate real-time changes
    if (Math.random() > 0.7) {
      const temperatureChange = Math.random() * 4 - 2; // -2 to +2
      const powerChange = Math.random() * 20 - 10; // -10 to +10
      const efficiencyChange = Math.random() * 4 - 2; // -2 to +2
      
      let newHealthScore = drive.healthScore + (Math.random() * 6 - 3); // -3 to +3
      newHealthScore = Math.max(0, Math.min(100, newHealthScore));
      
      const newStatus = newHealthScore > 90 ? 'online' : 
                       newHealthScore > 80 ? 'warning' : 
                       newHealthScore > 70 ? 'error' : 'offline';
      
      // Add a new error occasionally
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
      
      return {
        ...drive,
        temperature: Math.max(20, Math.min(80, drive.temperature + temperatureChange)),
        powerUsage: Math.max(100, Math.min(400, drive.powerUsage + powerChange)),
        efficiency: Math.max(50, Math.min(100, drive.efficiency + efficiencyChange)),
        healthScore: Math.round(newHealthScore),
        status: newStatus as 'online' | 'offline' | 'warning' | 'error',
        operatingHours: drive.operatingHours + 0.01,
        errors: newErrors
      };
    }
    return drive;
  });
};

/**
 * Get severity badge class based on status
 */
export const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'error':
      return 'bg-red-500';
    case 'offline':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

/**
 * Get health progress color based on score
 */
export const getHealthColor = (score: number): string => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 80) return 'bg-blue-500';
  if (score >= 70) return 'bg-yellow-500';
  return 'bg-red-500';
};

export type { RMDEDrive, RMDEError };
