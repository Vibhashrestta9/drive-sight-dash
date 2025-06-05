
export interface VFDState {
  status: 'stopped' | 'running' | 'fault' | 'warning';
  frequency: number;
  voltage: number;
  current: number;
  power: number;
  torque: number;
  speed: number;
  temperature: number;
  dcBusVoltage: number;
  outputVoltage: number;
  motorTemperature: number;
  efficiency: number;
}

export interface VFDParameters {
  controlMode: ControlMode;
  vfProfile: VFProfile;
  motorLoadType: MotorLoad;
  maxFrequency: number;
  minFrequency: number;
  rampUpTime: number;
  rampDownTime: number;
  maxTorque: number;
  pidKp: number;
  pidKi: number;
  pidKd: number;
  thermalDerating: boolean;
  softStart: boolean;
  brakingResistor: boolean;
}

export type ControlMode = 'open-loop' | 'closed-loop' | 'pid-control';
export type VFProfile = 'constant' | 'variable-torque' | 'sensorless-vector';
export type MotorLoad = 'constant-torque' | 'variable-torque' | 'shock-load';

export interface FaultCode {
  code: string;
  description: string;
  severity: 'warning' | 'critical';
  timestamp: Date;
  suggestedAction: string;
}

export interface HarmonicsData {
  thd: number;
  h3: number;
  h5: number;
  h7: number;
}

export interface CoolingData {
  fanSpeed: number;
  airflow: number;
  filterCondition: number;
  thermalShutdownRisk: number;
}

export interface LifetimeData {
  runningHours: number;
  switchingCycles: number;
  temperatureCycles: number;
  estimatedLife: number;
}

export interface TrainerChallenge {
  id: string;
  name: string;
  description: string;
  faultCodes: string[];
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface TrainerSession {
  score: number;
  challengesCompleted: number;
  averageResponseTime: number;
  correctDiagnoses: number;
  startTime: Date;
}
