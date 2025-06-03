
import { useState, useEffect, useRef } from 'react';
import { 
  ParameterProfile, 
  ParameterInteraction, 
  FaultScenario, 
  AlarmRule, 
  HistoricalDataPoint,
  MLAnomalyConfig,
  CommunicationConfig,
  SimulationDevice,
  SimulationConfiguration
} from '@/types/advancedSimulationTypes';

export const useAdvancedPLCSimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<ParameterProfile | null>(null);
  const [profiles, setProfiles] = useState<ParameterProfile[]>([]);
  const [interactions, setInteractions] = useState<ParameterInteraction[]>([]);
  const [faultScenarios, setFaultScenarios] = useState<FaultScenario[]>([]);
  const [alarmRules, setAlarmRules] = useState<AlarmRule[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [mlConfig, setMlConfig] = useState<MLAnomalyConfig>({
    enabled: false,
    sensitivity: 0.7,
    trainingData: [],
    detectedAnomalies: []
  });
  const [communicationConfig, setCommunicationConfig] = useState<CommunicationConfig>({
    latency: 0,
    packetLoss: 0,
    jitter: 0,
    enabled: false
  });
  const [devices, setDevices] = useState<SimulationDevice[]>([]);
  const [activeAlarms, setActiveAlarms] = useState<string[]>([]);
  const [activeFaults, setActiveFaults] = useState<string[]>([]);
  const [stepMode, setStepMode] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(1000);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<Date>();

  // Initialize default profiles
  useEffect(() => {
    const defaultProfiles: ParameterProfile[] = [
      {
        id: 'startup',
        name: 'System Startup',
        type: 'ramp-up',
        duration: 300,
        parameters: {
          temperature: { min: 20, max: 45, pattern: [0, 0.3, 0.7, 1] },
          power: { min: 10, max: 80, pattern: [0, 0.2, 0.8, 1] },
          speed: { min: 0, max: 1500, pattern: [0, 0.1, 0.6, 1] }
        },
        noiseLevel: 0.1
      },
      {
        id: 'normal-operation',
        name: 'Normal Operation',
        type: 'steady-state',
        duration: 3600,
        parameters: {
          temperature: { min: 40, max: 50, pattern: [1] },
          power: { min: 70, max: 90, pattern: [1] },
          vibration: { min: 1, max: 3, pattern: [1] }
        },
        noiseLevel: 0.05
      },
      {
        id: 'load-spike',
        name: 'Load Spike',
        type: 'transient-spike',
        duration: 60,
        parameters: {
          power: { min: 80, max: 120, pattern: [1, 1.5, 1.2, 1] },
          temperature: { min: 45, max: 65, pattern: [1, 1.3, 1.1, 1] }
        },
        noiseLevel: 0.2
      }
    ];
    setProfiles(defaultProfiles);
  }, []);

  const applyParameterProfile = (profile: ParameterProfile, elapsedTime: number) => {
    const progress = Math.min(elapsedTime / profile.duration, 1);
    const values: Record<string, number> = {};
    
    Object.entries(profile.parameters).forEach(([param, config]) => {
      if (!config) return;
      
      const patternIndex = Math.floor(progress * (config.pattern.length - 1));
      const patternValue = config.pattern[patternIndex] || 1;
      const baseValue = config.min + (config.max - config.min) * patternValue;
      
      // Add noise
      const noise = (Math.random() - 0.5) * 2 * profile.noiseLevel * (config.max - config.min);
      values[param] = Math.max(config.min, Math.min(config.max, baseValue + noise));
    });
    
    return values;
  };

  const applyParameterInteractions = (baseValues: Record<string, number>) => {
    const result = { ...baseValues };
    
    interactions.filter(i => i.enabled).forEach(interaction => {
      try {
        const sourceValue = result[interaction.sourceParameter];
        if (sourceValue !== undefined) {
          // Simple equation parser - in real implementation, use a proper expression parser
          const equation = interaction.equation.replace(/source/g, sourceValue.toString());
          const targetValue = eval(equation.replace(/target\s*=\s*/, ''));
          result[interaction.targetParameter] = targetValue;
        }
      } catch (error) {
        console.warn(`Error applying interaction ${interaction.name}:`, error);
      }
    });
    
    return result;
  };

  const checkAlarmConditions = (values: Record<string, number>) => {
    const newAlarms: string[] = [];
    
    alarmRules.filter(rule => rule.enabled).forEach(rule => {
      try {
        // Simple condition parser
        let condition = rule.condition;
        Object.entries(values).forEach(([param, value]) => {
          condition = condition.replace(new RegExp(param, 'g'), value.toString());
        });
        
        if (eval(condition)) {
          newAlarms.push(rule.id);
          
          // Execute alarm actions
          rule.actions.forEach(action => {
            switch (action.type) {
              case 'buzzer':
                console.log(`🚨 ALARM: ${rule.name} triggered!`);
                break;
              case 'notification':
                console.log(`📢 NOTIFICATION: ${rule.name}`);
                break;
            }
          });
        }
      } catch (error) {
        console.warn(`Error evaluating alarm condition ${rule.name}:`, error);
      }
    });
    
    setActiveAlarms(newAlarms);
  };

  const simulateMLAnomalyDetection = (values: Record<string, number>) => {
    if (!mlConfig.enabled) return;
    
    // Simple anomaly detection simulation
    const anomalyScore = Math.random();
    if (anomalyScore > (1 - mlConfig.sensitivity)) {
      const anomaly = {
        timestamp: new Date(),
        score: anomalyScore,
        parameters: Object.keys(values).filter(() => Math.random() > 0.7)
      };
      
      setMlConfig(prev => ({
        ...prev,
        detectedAnomalies: [...prev.detectedAnomalies.slice(-10), anomaly]
      }));
    }
  };

  const simulateCommunicationEffects = (values: Record<string, number>) => {
    if (!communicationConfig.enabled) return values;
    
    // Simulate packet loss
    if (Math.random() * 100 < communicationConfig.packetLoss) {
      console.log('📡 Packet lost - values not updated');
      return {}; // No update due to packet loss
    }
    
    // Simulate latency (would be handled by setTimeout in real implementation)
    if (communicationConfig.latency > 0) {
      console.log(`📡 Communication delay: ${communicationConfig.latency}ms`);
    }
    
    return values;
  };

  const startSimulation = (profile?: ParameterProfile) => {
    if (profile) setCurrentProfile(profile);
    setIsRunning(true);
    startTimeRef.current = new Date();
    
    if (!stepMode) {
      intervalRef.current = setInterval(() => {
        updateSimulation();
      }, updateInterval);
    }
  };

  const stopSimulation = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const stepSimulation = () => {
    if (stepMode) {
      updateSimulation();
    }
  };

  const updateSimulation = () => {
    if (!currentProfile || !startTimeRef.current) return;
    
    const elapsedTime = (Date.now() - startTimeRef.current.getTime()) / 1000;
    let values = applyParameterProfile(currentProfile, elapsedTime);
    values = applyParameterInteractions(values);
    values = simulateCommunicationEffects(values);
    
    // Record historical data
    const dataPoint: HistoricalDataPoint = {
      timestamp: new Date(),
      registers: values,
      alarms: [...activeAlarms],
      faults: [...activeFaults]
    };
    
    setHistoricalData(prev => [...prev.slice(-1000), dataPoint]);
    
    checkAlarmConditions(values);
    simulateMLAnomalyDetection(values);
    
    // Check if profile is complete
    if (elapsedTime >= currentProfile.duration) {
      stopSimulation();
    }
  };

  const exportConfiguration = (): SimulationConfiguration => {
    return {
      id: Date.now().toString(),
      name: 'Current Configuration',
      description: 'Exported simulation configuration',
      profiles,
      interactions,
      faultScenarios,
      alarmRules,
      mlConfig,
      communicationConfig,
      devices,
      globalUpdateInterval: updateInterval,
      createdAt: new Date()
    };
  };

  const importConfiguration = (config: SimulationConfiguration) => {
    setProfiles(config.profiles);
    setInteractions(config.interactions);
    setFaultScenarios(config.faultScenarios);
    setAlarmRules(config.alarmRules);
    setMlConfig(config.mlConfig);
    setCommunicationConfig(config.communicationConfig);
    setDevices(config.devices);
    setUpdateInterval(config.globalUpdateInterval);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    // State
    isRunning,
    currentProfile,
    profiles,
    interactions,
    faultScenarios,
    alarmRules,
    historicalData,
    mlConfig,
    communicationConfig,
    devices,
    activeAlarms,
    activeFaults,
    stepMode,
    updateInterval,
    
    // Setters
    setProfiles,
    setInteractions,
    setFaultScenarios,
    setAlarmRules,
    setMlConfig,
    setCommunicationConfig,
    setDevices,
    setStepMode,
    setUpdateInterval,
    
    // Actions
    startSimulation,
    stopSimulation,
    stepSimulation,
    exportConfiguration,
    importConfiguration
  };
};
