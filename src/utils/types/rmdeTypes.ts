
export interface RMDEDrive {
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

export interface RMDEError {
  id: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  resolved: boolean;
}

export interface RMDEModule {
  id: string;
  ipAddress: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  connectedDrives: number;
  lastSeen: string;
}

export interface RMDESystemStatus {
  id: string;
  temperature: number;
  humidity: number;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
}
