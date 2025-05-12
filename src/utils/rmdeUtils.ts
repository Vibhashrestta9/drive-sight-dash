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
  responseTime?: number;
  vibrationLevel?: number;
  loadCapacity?: number;
  previousDHI?: number;
  behavioralFingerprint?: boolean; // Flag if fingerprint data exists
}

interface RMDEError {
  id: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  resolved: boolean;
}

interface RMDEModule {
  id: string;
  ipAddress: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  connectedDrives: number;
  lastSeen: string;
}

interface RMDESystemStatus {
  id: string;
  temperature: number;
  humidity: number;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
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
    
    // Add new metrics
    const responseTime = Math.floor(Math.random() * 150) + 50; // 50-200ms
    const vibrationLevel = Number((Math.random() * 4.5 + 0.5).toFixed(2)); // 0.5-5.0mm/s
    const loadCapacity = Math.floor(Math.random() * 40) + 60; // 60-100%
    
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
      errors: generateRandomErrors(Math.floor(Math.random() * 4)), // 0-3 errors
      responseTime,
      vibrationLevel,
      loadCapacity,
      previousDHI: Math.floor(Math.random() * 15) + healthScore - 10, // Previous DHI score (varies slightly from current healthScore)
      behavioralFingerprint: true // All drives have fingerprint data in this demo
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
      
      // Store current health score as previous DHI
      const previousDHI = drive.healthScore;
      
      let newHealthScore = drive.healthScore + (Math.random() * 6 - 3); // -3 to +3
      newHealthScore = Math.max(0, Math.min(100, newHealthScore));
      
      const newStatus = newHealthScore > 90 ? 'online' : 
                       newHealthScore > 80 ? 'warning' : 
                       newHealthScore > 70 ? 'error' : 'offline';
      
      // Update new metrics
      const responseTimeChange = Math.random() * 40 - 20; // -20 to +20
      const vibrationChange = Number((Math.random() * 0.6 - 0.3).toFixed(2)); // -0.3 to +0.3
      const loadCapacityChange = Math.random() * 6 - 3; // -3 to +3
      
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

/**
 * Generate mock NETA-21 modules data
 */
export const generateNETAModules = (): RMDEModule[] => {
  const moduleIds = ['NETA-21-A', 'NETA-21-B', 'NETA-21-C'];
  
  return moduleIds.map((id, index) => {
    const ipOctet = 100 + index;
    return {
      id,
      ipAddress: `192.168.1.${ipOctet}`,
      status: Math.random() > 0.8 ? 'warning' : 'online',
      connectedDrives: Math.floor(Math.random() * 3) + 1,
      lastSeen: new Date().toISOString()
    };
  });
};

/**
 * Generate RMDE system status
 */
export const generateRMDESystemStatus = (): RMDESystemStatus[] => {
  const rmdeIds = ['RMDE-001', 'RMDE-002'];
  
  return rmdeIds.map(id => {
    const temp = Math.floor(Math.random() * 15) + 20; // 20-35°C
    const humidity = Math.floor(Math.random() * 30) + 30; // 30-60%
    
    // Status based on temperature and humidity
    const status = temp > 30 || humidity > 55 ? 'warning' : 'normal';
    
    return {
      id,
      temperature: temp,
      humidity,
      status,
      lastUpdated: new Date().toISOString()
    };
  });
};

export type { RMDEDrive, RMDEError, RMDEModule, RMDESystemStatus };
