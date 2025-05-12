
import React from 'react';
import { Link } from 'react-router-dom';
import { Network, Shield } from 'lucide-react';
import DriveMetricsCards from '@/components/DriveMetricsCards';
import PerformanceGraph from '@/components/PerformanceGraph';
import LiveDrivers from '@/components/LiveDrivers';
import DriverPerformance from '@/components/DriverPerformance';
import RMDEDashboard from '@/components/RMDEDashboard';
import DriveHealthIndex from '@/components/DriveHealthIndex';
import BehavioralFingerprint from '@/components/BehavioralFingerprint';
import DigitalTwinStatus from '@/components/DigitalTwinStatus';
import { generateInitialRMDEData } from '@/utils/rmdeUtils';
import { useState, useEffect } from 'react';

const Index = () => {
  const [rmdeData, setRmdeData] = useState(generateInitialRMDEData());
  
  useEffect(() => {
    // This ensures we have consistent data across components
    const initialData = generateInitialRMDEData();
    setRmdeData(initialData);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DriveSight Dashboard</h1>
            <p className="text-gray-600">Real-time monitoring and analytics for your fleet</p>
          </div>
          <div className="flex gap-3">
            <Link 
              to="/sim-configuration" 
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              <Network className="h-5 w-5" />
              SIM Configuration
            </Link>
            <Link 
              to="/cyber-security" 
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              <Shield className="h-5 w-5" />
              Cybersecurity
            </Link>
          </div>
        </header>

        {/* Metrics Summary Cards */}
        <DriveMetricsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Performance Graph (Takes 2/3 width on large screens) */}
          <PerformanceGraph />

          {/* Driver List (Takes 1/3 width on large screens) */}
          <div className="grid grid-cols-1 gap-6">
            <LiveDrivers />
          </div>
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
          <RMDEDashboard />
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
