import { useState, useEffect, useRef } from 'react';
import { VFDState, VFDParameters, FaultCode, MotorLoad, ControlMode } from '@/types/vfdTypes';

export const useVFDSimulation = () => {
  const [state, setState] = useState<VFDState>({
    status: 'stopped',
    frequency: 0,
    voltage: 0,
    current: 0,
    power: 0,
    torque: 0,
    speed: 0,
    temperature: 25,
    dcBusVoltage: 650,
    outputVoltage: 0,
    motorTemperature: 25,
    efficiency: 0
  });

  const [parameters, setParameters] = useState<VFDParameters>({
    controlMode: 'open-loop',
    vfProfile: 'constant',
    motorLoadType: 'constant-torque',
    maxFrequency: 60,
    minFrequency: 0,
    rampUpTime: 10,
    rampDownTime: 15,
    maxTorque: 100,
    pidKp: 1.0,
    pidKi: 0.1,
    pidKd: 0.01,
    thermalDerating: true,
    softStart: true,
    brakingResistor: true
  });

  const [activeFaults, setActiveFaults] = useState<FaultCode[]>([]);
  const [lifetimeData, setLifetimeData] = useState({
    runningHours: 0,
    switchingCycles: 0,
    temperatureCycles: 0,
    estimatedLife: 100
  });

  const [harmonics, setHarmonics] = useState({
    thd: 0,
    h3: 0,
    h5: 0,
    h7: 0
  });

  const [cooling, setCooling] = useState({
    fanSpeed: 0,
    airflow: 100,
    filterCondition: 100,
    thermalShutdownRisk: 0
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const targetFrequency = useRef(0);

  const calculateVFRatio = (frequency: number) => {
    const baseFreq = 60; // Hz
    const baseVolt = 460; // V
    
    switch (parameters.vfProfile) {
      case 'constant':
        return (frequency / baseFreq) * baseVolt;
      case 'variable-torque':
        return Math.pow(frequency / baseFreq, 2) * baseVolt;
      case 'sensorless-vector':
        return (frequency / baseFreq) * baseVolt * (0.9 + 0.1 * Math.random());
      default:
        return 0;
    }
  };

  const calculateMotorResponse = (frequency: number) => {
    const baseSpeed = 1800; // RPM
    let torqueMultiplier = 1;

    switch (parameters.motorLoadType) {
      case 'constant-torque':
        torqueMultiplier = 1;
        break;
      case 'variable-torque':
        torqueMultiplier = Math.pow(frequency / 60, 2);
        break;
      case 'shock-load':
        torqueMultiplier = 1 + 0.3 * Math.sin(Date.now() / 1000);
        break;
    }

    return {
      speed: (frequency / 60) * baseSpeed,
      torque: parameters.maxTorque * torqueMultiplier * (frequency / 60),
      current: 10 + (frequency / 60) * 15 * torqueMultiplier
    };
  };

  const checkFaultConditions = (currentState: VFDState) => {
    const faults: FaultCode[] = [];

    // Overvoltage
    if (currentState.dcBusVoltage > 800) {
      faults.push({
        code: 'F001',
        description: 'DC Bus Overvoltage',
        severity: 'critical',
        timestamp: new Date(),
        suggestedAction: 'Check input voltage and line reactors'
      });
    }

    // Overcurrent
    if (currentState.current > 50) {
      faults.push({
        code: 'F002',
        description: 'Output Overcurrent',
        severity: 'critical',
        timestamp: new Date(),
        suggestedAction: 'Check motor and cabling for short circuits'
      });
    }

    // Overtemperature
    if (currentState.temperature > 85) {
      faults.push({
        code: 'F003',
        description: 'Drive Overtemperature',
        severity: 'warning',
        timestamp: new Date(),
        suggestedAction: 'Check cooling fan and clean filters'
      });
    }

    // Phase loss simulation (rare random fault)
    if (Math.random() < 0.001) {
      faults.push({
        code: 'F004',
        description: 'Input Phase Loss',
        severity: 'critical',
        timestamp: new Date(),
        suggestedAction: 'Check input power connections'
      });
    }

    setActiveFaults(faults);
  };

  const updateSimulation = () => {
    setState(prevState => {
      if (prevState.status !== 'running') return prevState;

      const motorResponse = calculateMotorResponse(prevState.frequency);
      const outputVoltage = calculateVFRatio(prevState.frequency);

      // Simulate ramping
      let currentFreq = prevState.frequency;
      if (currentFreq < targetFrequency.current) {
        currentFreq = Math.min(targetFrequency.current, currentFreq + (60 / parameters.rampUpTime) / 10);
      } else if (currentFreq > targetFrequency.current) {
        currentFreq = Math.max(targetFrequency.current, currentFreq - (60 / parameters.rampDownTime) / 10);
      }

      const newState = {
        ...prevState,
        frequency: currentFreq,
        voltage: outputVoltage,
        speed: motorResponse.speed,
        torque: motorResponse.torque,
        current: motorResponse.current,
        power: outputVoltage * motorResponse.current * Math.sqrt(3) * 0.001,
        dcBusVoltage: 650 + Math.random() * 50,
        outputVoltage,
        temperature: 25 + (prevState.power / 1000) * 10 + Math.random() * 5,
        motorTemperature: 25 + (prevState.power / 1000) * 15 + Math.random() * 8,
        efficiency: Math.max(80, 95 - (prevState.power / 1000) * 2)
      };

      // Calculate harmonics based on switching frequency
      const thd = 5 + (currentFreq / 60) * 10 + Math.random() * 2;
      setHarmonics({
        thd,
        h3: thd * 0.3,
        h5: thd * 0.6,
        h7: thd * 0.2
      });

      // Update cooling system
      const requiredCooling = (newState.power / 1000) * 0.03; // 3% losses as heat
      const fanSpeed = Math.min(100, requiredCooling * 20);

      setCooling(prev => ({
        ...prev,
        fanSpeed,
        airflow: Math.max(20, 100 - (newState.temperature - 25) * 2),
        thermalShutdownRisk: Math.max(0, (newState.temperature - 70) / 15 * 100)
      }));

      // Update lifetime data
      setLifetimeData(prev => ({
        ...prev,
        runningHours: prev.runningHours + (1/3600), // 1 second in hours
        switchingCycles: prev.switchingCycles + 4000 / 10, // 4kHz switching frequency
        estimatedLife: Math.max(0, 100 - (prev.runningHours / 87600) * 100) // 10 years
      }));

      checkFaultConditions(newState);
      return newState;
    });
  };

  const startDrive = (frequency: number) => {
    console.log('Starting VFD with frequency:', frequency);
    
    if (activeFaults.some(f => f.severity === 'critical')) {
      console.log('Cannot start drive - critical faults present');
      return;
    }

    if (frequency <= 0) {
      console.log('Cannot start drive - frequency must be greater than 0');
      return;
    }

    targetFrequency.current = Math.min(frequency, parameters.maxFrequency);
    setState(prev => ({ ...prev, status: 'running' }));
    
    if (!intervalRef.current) {
      intervalRef.current = setInterval(updateSimulation, 100);
      console.log('VFD simulation started');
    }
  };

  const stopDrive = () => {
    console.log('Stopping VFD');
    targetFrequency.current = 0;
    
    // Keep running simulation until frequency reaches 0
    const stopTimeout = setTimeout(() => {
      setState(prev => {
        if (prev.frequency <= 0.1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return { ...prev, status: 'stopped' };
        }
        return prev;
      });
    }, parameters.rampDownTime * 100);
  };

  const emergencyStop = () => {
    console.log('Emergency stop activated');
    targetFrequency.current = 0;
    setState(prev => ({ 
      ...prev, 
      status: 'stopped',
      frequency: 0,
      speed: 0,
      torque: 0,
      current: 0,
      power: 0
    }));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const clearFaults = () => {
    console.log('Clearing VFD faults');
    setActiveFaults([]);
    setState(prev => ({ ...prev, status: 'stopped' }));
  };

  const injectFault = (faultCode: string) => {
    console.log('Injecting fault:', faultCode);
    const predefinedFaults = {
      'F001': { code: 'F001', description: 'DC Bus Overvoltage', severity: 'critical' as const },
      'F002': { code: 'F002', description: 'Output Overcurrent', severity: 'critical' as const },
      'F003': { code: 'F003', description: 'Drive Overtemperature', severity: 'warning' as const },
      'F004': { code: 'F004', description: 'Input Phase Loss', severity: 'critical' as const },
      'F005': { code: 'F005', description: 'Ground Fault', severity: 'critical' as const }
    };

    const fault = predefinedFaults[faultCode as keyof typeof predefinedFaults];
    if (fault) {
      setActiveFaults(prev => [...prev, {
        ...fault,
        timestamp: new Date(),
        suggestedAction: 'Check system and clear fault'
      }]);
      
      if (fault.severity === 'critical') {
        emergencyStop();
        setState(prev => ({ ...prev, status: 'fault' }));
      }
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    state,
    parameters,
    setParameters,
    activeFaults,
    lifetimeData,
    harmonics,
    cooling,
    startDrive,
    stopDrive,
    emergencyStop,
    clearFaults,
    injectFault,
    status: state.status
  };
};
