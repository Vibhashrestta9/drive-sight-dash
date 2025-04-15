
import type { RMDEError, RMDEFault, RMDEDrive, RMDEModule, RMDESystemStatus } from './types';

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
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 48) * 3600000).toISOString(),
      severity: severity[Math.floor(Math.random() * severity.length)],
      message: errorMessages[Math.floor(Math.random() * errorMessages.length)],
      resolved: Math.random() > 0.7
    });
  }
  return errors;
};

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

export const generateInitialRMDEData = (): RMDEDrive[] => {
  const moduleIds = ['NETA-21-A', 'NETA-21-B', 'NETA-21-C'];
  const driveNames = [
    'GIRISHA CD', 'MOHAN', 'BABITHA', 
    'ANATH N', 'VIBHA SHRESTTA'
  ];
  
  return driveNames.map((name, index) => {
    const healthScore = Math.floor(Math.random() * 30) + 70;
    const status = healthScore > 90 ? 'online' : 
                  healthScore > 80 ? 'warning' : 
                  healthScore > 70 ? 'error' : 'offline';
    
    return {
      id: index + 1,
      name,
      status,
      moduleId: moduleIds[Math.floor(Math.random() * moduleIds.length)],
      temperature: Math.floor(Math.random() * 20) + 40,
      powerUsage: Math.floor(Math.random() * 100) + 200,
      operatingHours: Math.floor(Math.random() * 5000) + 1000,
      efficiency: Math.floor(Math.random() * 20) + 80,
      lastMaintenance: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toLocaleDateString(),
      healthScore,
      errors: generateRandomErrors(Math.floor(Math.random() * 4)),
      speed: Math.floor(Math.random() * 1000) + 1000,
      torque: Math.floor(Math.random() * 150) + 50,
      lastUpdated: new Date().toISOString(),
      faults: generateRandomFaults(status !== 'online' ? Math.floor(Math.random() * 3) : 0)
    };
  });
};

export const generateRMDESystemStatus = (): RMDESystemStatus[] => {
  const rmdeIds = ['RMDE-001', 'RMDE-002'];
  
  return rmdeIds.map(id => {
    const temp = Math.floor(Math.random() * 15) + 20;
    const humidity = Math.floor(Math.random() * 30) + 30;
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
