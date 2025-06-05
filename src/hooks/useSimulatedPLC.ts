
import { useState, useEffect, useRef } from 'react';
import { RMDEDrive } from '@/utils/types/rmdeTypes';

interface PLCRegister {
  address: number;
  value: number;
  type: 'temperature' | 'power' | 'speed' | 'vibration';
  unit: string;
}

interface PLCSimulationConfig {
  enabled: boolean;
  updateInterval: number; // milliseconds
  buzzerEnabled: boolean;
  alarmThresholds: {
    temperature: number;
    power: number;
    vibration: number;
  };
}

export const useSimulatedPLC = () => {
  const [config, setConfig] = useState<PLCSimulationConfig>({
    enabled: false,
    updateInterval: 2000,
    buzzerEnabled: true,
    alarmThresholds: {
      temperature: 75,
      power: 95,
      vibration: 8.5
    }
  });
  
  const [registers, setRegisters] = useState<PLCRegister[]>([
    { address: 1001, value: 45.2, type: 'temperature', unit: '°C' },
    { address: 1002, value: 67.8, type: 'power', unit: 'W' },
    { address: 1003, value: 1450, type: 'speed', unit: 'RPM' },
    { address: 1004, value: 2.3, type: 'vibration', unit: 'mm/s' }
  ]);
  
  const [alarms, setAlarms] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  
  // Simulate register changes
  useEffect(() => {
    if (config.enabled) {
      console.log('Starting PLC simulation with interval:', config.updateInterval);
      intervalRef.current = setInterval(() => {
        setRegisters(prev => prev.map(register => {
          let newValue = register.value;
          const variation = 0.1; // 10% variation
          
          switch (register.type) {
            case 'temperature':
              newValue += (Math.random() - 0.5) * variation * 10;
              newValue = Math.max(20, Math.min(100, newValue)); // Clamp between 20-100°C
              break;
            case 'power':
              newValue += (Math.random() - 0.5) * variation * 20;
              newValue = Math.max(0, Math.min(120, newValue)); // Clamp between 0-120W
              break;
            case 'speed':
              newValue += (Math.random() - 0.5) * variation * 100;
              newValue = Math.max(0, Math.min(3000, newValue)); // Clamp between 0-3000 RPM
              break;
            case 'vibration':
              newValue += (Math.random() - 0.5) * variation * 2;
              newValue = Math.max(0, Math.min(15, newValue)); // Clamp between 0-15 mm/s
              break;
          }
          
          return { ...register, value: Math.round(newValue * 100) / 100 };
        }));
      }, config.updateInterval);
    } else {
      if (intervalRef.current) {
        console.log('Stopping PLC simulation');
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [config.enabled, config.updateInterval]);
  
  // Check for alarms
  useEffect(() => {
    const newAlarms: string[] = [];
    
    registers.forEach(register => {
      switch (register.type) {
        case 'temperature':
          if (register.value > config.alarmThresholds.temperature) {
            newAlarms.push(`High temperature alarm: ${register.value}°C`);
          }
          break;
        case 'power':
          if (register.value > config.alarmThresholds.power) {
            newAlarms.push(`High power consumption: ${register.value}W`);
          }
          break;
        case 'vibration':
          if (register.value > config.alarmThresholds.vibration) {
            newAlarms.push(`High vibration detected: ${register.value}mm/s`);
          }
          break;
      }
    });
    
    if (newAlarms.length !== alarms.length || !newAlarms.every((alarm, index) => alarm === alarms[index])) {
      console.log('Alarm status changed:', newAlarms);
      setAlarms(newAlarms);
      
      // Trigger buzzer if alarms exist and buzzer is enabled
      if (newAlarms.length > 0 && config.buzzerEnabled && newAlarms.length > alarms.length) {
        triggerBuzzer();
      }
    }
  }, [registers, config.alarmThresholds, config.buzzerEnabled, alarms]);
  
  const triggerBuzzer = async () => {
    try {
      // Try HTTP endpoint first (for device with web server)
      await fetch('/api/buzzer', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: 500 })
      }).catch(() => {
        // Fallback: Browser audio beep
        console.log('🔊 BUZZER: Alarm triggered!');
        if (typeof window !== 'undefined' && window.AudioContext) {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 800; // 800Hz beep
          gainNode.gain.value = 0.1;
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
        }
      });
    } catch (error) {
      console.error('Buzzer trigger failed:', error);
    }
  };
  
  const updateSimulatedDrives = (drives: RMDEDrive[]): RMDEDrive[] => {
    if (!config.enabled) return drives;
    
    return drives.map((drive, index) => {
      const tempRegister = registers.find(r => r.type === 'temperature');
      const powerRegister = registers.find(r => r.type === 'power');
      
      if (tempRegister && powerRegister) {
        return {
          ...drive,
          temperature: tempRegister.value + (index * 2), // Slight offset per drive
          powerUsage: powerRegister.value + (index * 5),
          healthScore: Math.max(50, 100 - (tempRegister.value > 70 ? 20 : 0) - (powerRegister.value > 80 ? 15 : 0))
        };
      }
      
      return drive;
    });
  };
  
  return {
    config,
    setConfig,
    registers,
    alarms,
    triggerBuzzer,
    updateSimulatedDrives,
    isSimulating: config.enabled
  };
};
