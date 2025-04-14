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
  speed: number;
  torque: number;
  lastUpdated: string;
  faults: RMDEFault[];
}

interface RMDEError {
  id: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  resolved: boolean;
}

interface RMDEFault {
  id: number;
  code: string;
  description: string;
  timeDetected: string;
  impact: 'none' | 'minor' | 'major' | 'critical';
  requiresService: boolean;
}

interface RMDEModule {
  id: string;
  ipAddress: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  connectedDrives: number;
  lastSeen: string;
  apiEndpoint?: string;
  apiStatus?: 'connected' | 'disconnected' | 'error';
}

interface RMDESystemStatus {
  id: string;
  temperature: number;
  humidity: number;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
}

interface RMDEApiResponse {
  success: boolean;
  timestamp: string;
  drives: {
    id: number;
    speed: number;
    temperature: number;
    torque: number;
    faults: RMDEFault[];
  }[];
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
      errors: generateRandomErrors(Math.floor(Math.random() * 4)), // 0-3 errors
      speed: Math.floor(Math.random() * 1000) + 1000, // 1000-2000 RPM
      torque: Math.floor(Math.random() * 150) + 50, // 50-200 Nm
      lastUpdated: new Date().toISOString(),
      faults: generateRandomFaults(status !== 'online' ? Math.floor(Math.random() * 3) : 0) // 0-2 faults if not online
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
    'Parameter drift outside normal range'
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
 * Generates random RMDE faults
 */
const generateRandomFaults = (count: number): RMDEFault[] => {
  const faultDescriptions = [
    { code: 'F001', desc: 'Drive temperature limit exceeded' },
    { code: 'F002', desc: 'Torque fluctuation detected' },
    { code: 'F003', desc: 'Speed irregularity' },
    { code: 'F004', desc: 'Power input unstable' },
    { code: 'F005', desc: 'Control module communication failure' },
    { code: 'F006', desc: 'Sensor calibration required' },
  ];
  
  const faults: RMDEFault[] = [];
  for (let i = 0; i < count; i++) {
    const faultInfo = faultDescriptions[Math.floor(Math.random() * faultDescriptions.length)];
    const impact: ('none' | 'minor' | 'major' | 'critical')[] = ['none', 'minor', 'major', 'critical'];
    
    faults.push({
      id: Date.now() + i,
      code: faultInfo.code,
      description: faultInfo.desc,
      timeDetected: new Date(Date.now() - Math.floor(Math.random() * 24) * 3600000).toISOString(),
      impact: impact[Math.floor(Math.random() * impact.length)],
      requiresService: Math.random() > 0.5
    });
  }
  
  return faults;
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
      const speedChange = Math.random() * 100 - 50; // -50 to +50 RPM
      const torqueChange = Math.random() * 20 - 10; // -10 to +10 Nm
      
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
      
      // Update faults occasionally
      let newFaults = [...drive.faults];
      
      // Add a new fault on occasion
      if (Math.random() > 0.95 && newStatus !== 'online') {
        newFaults = [...newFaults, ...generateRandomFaults(1)];
      }
      
      // Resolve some faults on occasion
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
      lastSeen: new Date().toISOString(),
      apiEndpoint: `https://api.neta.com/modules/${id.toLowerCase()}`,
      apiStatus: Math.random() > 0.1 ? 'connected' : Math.random() > 0.5 ? 'disconnected' : 'error'
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

/**
 * Simulate API call to NETA-21 module
 */
export const fetchDriveDataFromAPI = async (moduleId: string): Promise<RMDEApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Fetching data from API for module ${moduleId}`);
      
      // Generate mock API response
      const response: RMDEApiResponse = {
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

/**
 * Send email notification (simulation)
 */
export const sendEmailNotification = (drive: RMDEDrive, errorMessage: string): void => {
  console.info(`Email notification would be sent for ${drive.name} in ${drive.status} condition`);
};

export type { 
  RMDEDrive, 
  RMDEError, 
  RMDEModule, 
  RMDESystemStatus, 
  RMDEFault, 
  RMDEApiResponse 
};
