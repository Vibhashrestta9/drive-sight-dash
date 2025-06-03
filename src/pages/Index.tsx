
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
import UserRoleSelector from '@/components/UserRoleSelector';
import PLCSimulationPanel from '@/components/PLCSimulationPanel';
import AdvancedPLCSimulationPanel from '@/components/simulation/AdvancedPLCSimulationPanel';
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
    
    // Set up interval for real-time updates - DRAMATICALLY INCREASED FROM 45000ms to 120000ms (2 minutes)
    const interval = setInterval(() => {
      setRmdeData(prev => {
        const updated = updateRMDEData(prev);
        // Apply PLC simulation if enabled
        return isSimulating ? updateSimulatedDrives(updated) : updated;
      });
    }, 120000); // Changed from 45000 to 120000 milliseconds (2 minutes)
    
    return () => clearInterval(interval);
  }, [isSimulating, updateSimulatedDrives]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200">
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
        <div className="mb-6 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-1">
          <UserRoleSelector />
        </div>
        
        {/* Basic PLC Simulation Panel */}
        <div className="mb-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-1">
          <PLCSimulationPanel />
        </div>

        {/* Advanced PLC Simulation Suite */}
        <RoleAwareControl requiresWrite>
          <div className="mb-6 bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100 rounded-xl p-1">
            <AdvancedPLCSimulationPanel />
          </div>
        </RoleAwareControl>

        {/* Metrics Summary Cards */}
        <div className="mb-6">
          <DriveMetricsCards />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Performance Graph (Takes 2/3 width on large screens) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl p-1">
            <PerformanceGraph />
          </div>

          {/* Driver List (Takes 1/3 width on large screens) */}
          <div className="grid grid-cols-1 gap-6 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl p-1">
            <LiveDrivers />
          </div>
        </div>
        
        {/* Digital Twin Status Section */}
        <div className="mb-6 bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl p-1">
          <DigitalTwinStatus />
        </div>
        
        {/* Drive Health Index Section */}
        <div className="mb-6 bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 rounded-xl p-1">
          <DriveHealthIndex drives={rmdeData} />
        </div>

        {/* Behavioral Fingerprint Section */}
        <div className="mb-6 bg-gradient-to-r from-violet-100 via-purple-100 to-indigo-100 rounded-xl p-1">
          <BehavioralFingerprint drives={rmdeData} />
        </div>
        
        {/* RMDE Dashboard Section */}
        <div className="mb-6 bg-gradient-to-r from-purple-100 to-violet-100 rounded-xl p-1">
          <RoleAwareControl requiresWrite>
            <RMDEDashboard />
          </RoleAwareControl>
        </div>

        {/* Driver Performance Section */}
        <div className="mt-6 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-1">
          <DriverPerformance />
        </div>
      </div>
    </div>
  );
};

export default Index;
