
import { RMDEDrive, RMDEError, RMDEModule, RMDESystemStatus } from '../types/rmdeTypes';

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
 * Generates initial mock RMDE drive data
 */
export const generateInitialRMDEData = (): RMDEDrive[] => {
  const moduleIds = ['CONNECT-A', 'CONNECT-B', 'CONNECT-C'];
  const driveNames = [
    'Drive1', 'Drive2', 'Drive3', 
    'Drive4', 'Drive5'
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
 * Generate mock CONNECT modules data
 */
export const generateNETAModules = (): RMDEModule[] => {
  const moduleIds = ['CONNECT-A', 'CONNECT-B', 'CONNECT-C'];
  
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
