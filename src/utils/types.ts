
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
  speed: number;
  torque: number;
  lastUpdated: string;
  faults: RMDEFault[];
}

export interface RMDEError {
  id: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  resolved: boolean;
}

export interface RMDEFault {
  id: number;
  code: string;
  description: string;
  timeDetected: string;
  impact: 'none' | 'minor' | 'major' | 'critical';
  requiresService: boolean;
}

export interface RMDEModule {
  id: string;
  ipAddress: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  connectedDrives: number;
  lastSeen: string;
  apiEndpoint?: string;
  apiStatus?: 'connected' | 'disconnected' | 'error';
}

export interface RMDESystemStatus {
  id: string;
  temperature: number;
  humidity: number;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
}

export interface RMDEApiResponse {
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
