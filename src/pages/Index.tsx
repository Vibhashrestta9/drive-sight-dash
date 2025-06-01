
import React from 'react';
import { Link } from 'react-router-dom';
import { Network, Shield, Camera } from 'lucide-react';
import DriveMetricsCards from '@/components/DriveMetricsCards';
import PerformanceGraph from '@/components/PerformanceGraph';
import LiveDrivers from '@/components/LiveDrivers';
import DriverPerformance from '@/components/DriverPerformance';
import RMDEDashboard from '@/components/RMDEDashboard';
import DriveHealthIndex from '@/components/DriveHealthIndex';
import BehavioralFingerprint from '@/components/BehavioralFingerprint';
import DigitalTwinStatus from '@/components/DigitalTwinStatus';
import SelfHealingSystem from '@/components/SelfHealingSystem';
import UserRoleSelector from '@/components/UserRoleSelector';
import PLCSimulationPanel from '@/components/PLCSimulationPanel';
import RoleAwareControl from '@/components/RoleAwareControl';
import { generateInitialRMDEData } from '@/utils/rmde/dataGenerator';
import { updateRMDEData } from '@/utils/rmde/dataUpdater';
import { useSimulatedPLC } from '@/hooks/useSimulatedPLC';
import { useState, useEffect } from 'react';

const Index = () => {
  const [rmdeData, setRmdeData] = useState(generateInitialRMDEData());
  const { updateSimulatedDrives, isSimulating } = useSimulatedPLC();
  
  useEffect(() => {
    // This ensures we have consistent data across components
    const initialData = generateInitialRMDEData();
    setRmdeData(initialData);
    
    // Set up interval for real-time updates - REDUCED FROM 5000ms to 15000ms (15 seconds)
    const interval = setInterval(() => {
      setRmdeData(prev => {
        const updated = updateRMDEData(prev);
        // Apply PLC simulation if enabled
        return isSimulating ? updateSimulatedDrives(updated) : updated;
      });
    }, 15000); // Changed from 5000 to 15000 milliseconds
    
    return () => clearInterval(interval);
  }, [isSimulating, updateSimulatedDrives]);
  
  const handleHeal = (driveId: string, errorId: string) => {
    setRmdeData(prevData => {
      return prevData.map(drive => {
        if (drive.id.toString() === driveId) {
          const updatedErrors = drive.errors.map(error => {
            if (error.id.toString() === errorId) {
              return { ...error, resolved: true };
            }
            return error;
          });
          return { ...drive, errors: updatedErrors };
        }
        return drive;
      });
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              DriveSight Dashboard
            </h1>
            <p className="text-gray-700 font-medium">Real-time monitoring and analytics for your fleet</p>
          </div>
          <div className="flex gap-3">
            <RoleAwareControl requiresWrite>
              <Link 
                to="/sim-configuration" 
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                <Network className="h-5 w-5" />
                SIM Configuration
              </Link>
            </RoleAwareControl>
            <RoleAwareControl requiresAdmin>
              <Link 
                to="/cyber-security" 
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                <Shield className="h-5 w-5" />
                Cybersecurity
              </Link>
            </RoleAwareControl>
            <Link 
              to="/ar-dashboard" 
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              <Camera className="h-5 w-5" />
              AR Dashboard
            </Link>
          </div>
        </header>

        {/* Role-Based Access Control */}
        <div className="mb-6">
          <UserRoleSelector />
        </div>
        
        {/* PLC Simulation Panel */}
        <div className="mb-6">
          <PLCSimulationPanel />
        </div>

        {/* Metrics Summary Cards */}
        <div className="mb-6">
          <DriveMetricsCards />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Performance Graph (Takes 2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <PerformanceGraph />
          </div>

          {/* Driver List (Takes 1/3 width on large screens) */}
          <div className="grid grid-cols-1 gap-6">
            <LiveDrivers />
          </div>
        </div>
        
        {/* Self Healing System */}
        <div className="mb-6">
          <RoleAwareControl requiresWrite>
            <SelfHealingSystem drives={rmdeData} onHeal={handleHeal} />
          </RoleAwareControl>
        </div>
        
        {/* Digital Twin Status Section */}
        <div className="mb-6">
          <DigitalTwinStatus />
        </div>
        
        {/* Drive Health Index Section */}
        <div className="mb-6">
          <DriveHealthIndex drives={rmdeData} />
        </div>

        {/* Behavioral Fingerprint Section */}
        <div className="mb-6">
          <BehavioralFingerprint drives={rmdeData} />
        </div>
        
        {/* RMDE Dashboard Section */}
        <div className="mb-6">
          <RoleAwareControl requiresWrite>
            <RMDEDashboard />
          </RoleAwareControl>
        </div>

        {/* Driver Performance Section */}
        <div className="mt-6">
          <DriverPerformance />
        </div>
      </div>
    </div>
  );
};

export default Index;
