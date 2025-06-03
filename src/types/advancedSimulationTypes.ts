
export interface ParameterProfile {
  id: string;
  name: string;
  type: 'ramp-up' | 'steady-state' | 'transient-spike' | 'cyclic' | 'custom';
  duration: number; // seconds
  parameters: {
    temperature?: { min: number; max: number; pattern: number[] };
    power?: { min: number; max: number; pattern: number[] };
    vibration?: { min: number; max: number; pattern: number[] };
    speed?: { min: number; max: number; pattern: number[] };
  };
  noiseLevel: number; // 0-1 scale
}

export interface ParameterInteraction {
  id: string;
  name: string;
  sourceParameter: string;
  targetParameter: string;
  equation: string; // e.g., "target = source * 1.2 + 10"
  enabled: boolean;
}

export interface FaultScenario {
  id: string;
  name: string;
  type: 'sensor-failure' | 'communication-error' | 'overheating' | 'shutdown' | 'power-loss';
  triggerCondition: string;
  duration: number;
  scheduledTime?: Date;
  affectedParameters: string[];
  enabled: boolean;
}

export interface AlarmRule {
  id: string;
  name: string;
  condition: string; // e.g., "temperature > 75 && vibration > 3"
  severity: 'warning' | 'critical';
  actions: AlarmAction[];
  enabled: boolean;
}

export interface AlarmAction {
  type: 'notification' | 'email' | 'buzzer' | 'shutdown';
  config: Record<string, any>;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  registers: Record<string, number>;
  alarms: string[];
  faults: string[];
}

export interface MLAnomalyConfig {
  enabled: boolean;
  sensitivity: number; // 0-1 scale
  trainingData: HistoricalDataPoint[];
  detectedAnomalies: { timestamp: Date; score: number; parameters: string[] }[];
}

export interface CommunicationConfig {
  latency: number; // milliseconds
  packetLoss: number; // percentage 0-100
  jitter: number; // milliseconds
  enabled: boolean;
}

export interface SimulationDevice {
  id: string;
  name: string;
  type: 'PLC' | 'Drive' | 'Sensor';
  registers: Record<string, number>;
  status: 'online' | 'offline' | 'error';
  lastUpdate: Date;
}

export interface SimulationConfiguration {
  id: string;
  name: string;
  description: string;
  profiles: ParameterProfile[];
  interactions: ParameterInteraction[];
  faultScenarios: FaultScenario[];
  alarmRules: AlarmRule[];
  mlConfig: MLAnomalyConfig;
  communicationConfig: CommunicationConfig;
  devices: SimulationDevice[];
  globalUpdateInterval: number;
  createdAt: Date;
}
