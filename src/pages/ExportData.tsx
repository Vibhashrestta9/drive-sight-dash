
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, ArrowLeft, Download } from 'lucide-react';
import { generateInitialRMDEData, generateNETAModules, generateRMDESystemStatus } from '@/utils/rmdeUtils';
import { Driver } from '@/types/driverTypes';

const ExportData = () => {
  const navigate = useNavigate();
  const [selectedDataSets, setSelectedDataSets] = useState({
    driveMetrics: true,
    driverPerformance: true,
    cyberSecurity: true,
    digitalTwin: true,
    rmdeSystem: true,
    behavioralFingerprint: true,
    healthIndex: true,
    simCards: true
  });
  
  const handleCheckboxChange = (dataSet: keyof typeof selectedDataSets) => {
    setSelectedDataSets(prev => ({
      ...prev,
      [dataSet]: !prev[dataSet]
    }));
  };
  
  const handleExportClick = (format: 'excel' | 'csv') => {
    // Generate the data based on selected datasets
    const exportData = getExportData();
    
    if (format === 'excel') {
      exportAsExcel(exportData);
    } else {
      exportAsCSV(exportData);
    }
  };
  
  const getExportData = () => {
    const rmdeData = generateInitialRMDEData();
    const dataToExport: Record<string, any[]> = {};
    
    if (selectedDataSets.driveMetrics) {
      dataToExport.driveMetrics = rmdeData.map(drive => ({
        id: drive.id,
        name: drive.name,
        moduleId: drive.moduleId,
        status: drive.status,
        temperature: drive.temperature,
        powerUsage: drive.powerUsage,
        healthScore: drive.healthScore,
        efficiency: drive.efficiency,
        operatingHours: drive.operatingHours,
        lastMaintenance: drive.lastMaintenance
      }));
    }
    
    if (selectedDataSets.driverPerformance) {
      dataToExport.driverPerformance = [
        { id: 1, name: 'GIRISHA CD', safetyScore: 92, avgSpeed: 34, distanceDriven: 152, status: 'excellent' },
        { id: 2, name: 'MOHAN', safetyScore: 88, avgSpeed: 38, distanceDriven: 134, status: 'good' },
        { id: 3, name: 'BABITHA', safetyScore: 74, avgSpeed: 42, distanceDriven: 98, status: 'average' },
        { id: 4, name: 'ANATH N', safetyScore: 65, avgSpeed: 45, distanceDriven: 76, status: 'poor' },
        { id: 5, name: 'VIBHA SHRESTTA', safetyScore: 95, avgSpeed: 32, distanceDriven: 186, status: 'excellent' }
      ];
    }
    
    if (selectedDataSets.cyberSecurity) {
      dataToExport.cyberThreats = [
        { id: 'THR-001', type: 'Replay Attack', severity: 'High', timestamp: new Date().toISOString(), source: '192.168.1.45', status: 'Detected' },
        { id: 'THR-002', type: 'DoS Attack', severity: 'Critical', timestamp: new Date().toISOString(), source: '192.168.1.87', status: 'Blocked' },
        { id: 'THR-003', type: 'Spoofing', severity: 'Medium', timestamp: new Date().toISOString(), source: '192.168.1.23', status: 'Investigating' },
        { id: 'THR-004', type: 'Command Injection', severity: 'High', timestamp: new Date().toISOString(), source: '192.168.1.112', status: 'Mitigated' }
      ];
      
      dataToExport.networkAnomalies = [
        { id: 'ANM-001', type: 'Unexpected Client', confidence: 98.5, timestamp: new Date().toISOString(), ipAddress: '192.168.1.201' },
        { id: 'ANM-002', type: 'Function Code Abuse', confidence: 87.3, timestamp: new Date().toISOString(), ipAddress: '192.168.1.54' },
        { id: 'ANM-003', type: 'Request Frequency', confidence: 92.1, timestamp: new Date().toISOString(), ipAddress: '192.168.1.67' },
        { id: 'ANM-004', type: 'Register Write Attempt', confidence: 99.2, timestamp: new Date().toISOString(), ipAddress: '192.168.1.89' }
      ];
    }
    
    if (selectedDataSets.digitalTwin) {
      dataToExport.digitalTwin = [
        { deviceId: 'DT001', syncStatus: 'synced', lastSync: new Date().toISOString(), edgeStatus: 'online', cloudStatus: 'online', syncLatency: 23 },
        { deviceId: 'DT002', syncStatus: 'syncing', lastSync: new Date().toISOString(), edgeStatus: 'online', cloudStatus: 'online', syncLatency: 45 },
        { deviceId: 'DT003', syncStatus: 'error', lastSync: new Date().toISOString(), edgeStatus: 'online', cloudStatus: 'offline', syncLatency: 120 },
        { deviceId: 'DT004', syncStatus: 'synced', lastSync: new Date().toISOString(), edgeStatus: 'online', cloudStatus: 'online', syncLatency: 18 },
        { deviceId: 'DT005', syncStatus: 'synced', lastSync: new Date().toISOString(), edgeStatus: 'online', cloudStatus: 'online', syncLatency: 31 }
      ];
    }
    
    if (selectedDataSets.rmdeSystem) {
      const netaModules = generateNETAModules();
      const systemStatus = generateRMDESystemStatus();
      
      dataToExport.netaModules = netaModules;
      dataToExport.systemStatus = systemStatus;
    }
    
    if (selectedDataSets.behavioralFingerprint) {
      dataToExport.behavioralMetrics = rmdeData.map(drive => ({
        driveId: drive.id,
        driveName: drive.name,
        matchScore: Math.floor(Math.random() * 30) + 70,
        startupDuration: Math.floor(Math.random() * 500) + 800,
        loadResponseTime: Math.floor(Math.random() * 100) + 100,
        loadStability: Math.floor(Math.random() * 20) + 80,
        powerVariance: (Math.random() * 0.5 + 0.1).toFixed(2),
        temperatureVariance: (Math.random() * 0.8 + 0.3).toFixed(2),
        overshootTendency: Math.floor(Math.random() * 20) + 5
      }));
    }
    
    if (selectedDataSets.healthIndex) {
      dataToExport.healthIndex = rmdeData.map(drive => ({
        driveId: drive.id,
        driveName: drive.name,
        healthScore: drive.healthScore,
        temperatureScore: Math.floor(Math.random() * 20) + 80,
        efficiencyScore: Math.floor(Math.random() * 20) + 80,
        operatingHoursScore: Math.floor(Math.random() * 30) + 70,
        errorScore: Math.floor(Math.random() * 20) + 80,
        responseTimeScore: Math.floor(Math.random() * 20) + 80,
        vibrationScore: Math.floor(Math.random() * 20) + 80,
        loadCapacityScore: Math.floor(Math.random() * 20) + 80
      }));
    }
    
    if (selectedDataSets.simCards) {
      dataToExport.simCards = [
        { id: 'SIM001', iccid: '89012345678901234567', status: 'active', signalStrength: 87, carrier: 'Verizon', dataUsed: 345, dataTotal: 1000 },
        { id: 'SIM002', iccid: '89012345678901234568', status: 'active', signalStrength: 92, carrier: 'AT&T', dataUsed: 123, dataTotal: 500 },
        { id: 'SIM003', iccid: '89012345678901234569', status: 'error', signalStrength: 34, carrier: 'T-Mobile', dataUsed: 450, dataTotal: 500 },
        { id: 'SIM004', iccid: '89012345678901234570', status: 'inactive', signalStrength: 0, carrier: 'Sprint', dataUsed: 0, dataTotal: 200 },
        { id: 'SIM005', iccid: '89012345678901234571', status: 'active', signalStrength: 76, carrier: 'Verizon', dataUsed: 89, dataTotal: 1000 }
      ];
    }
    
    return dataToExport;
  };
  
  const exportAsExcel = (data: Record<string, any[]>) => {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Create a worksheet for each data set
      Object.entries(data).forEach(([sheetName, sheetData]) => {
        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });
      
      // Generate file name with current date
      const date = new Date().toISOString().split('T')[0];
      const fileName = `DriveSight_Data_${date}.xlsx`;
      
      // Create and download the file
      XLSX.writeFile(workbook, fileName);
      
      toast.success("Data successfully exported to Excel", {
        description: `File saved as ${fileName}`
      });
    } catch (error) {
      console.error("Error exporting data to Excel:", error);
      toast.error("Failed to export data", {
        description: "An error occurred while creating the Excel file"
      });
    }
  };
  
  const exportAsCSV = (data: Record<string, any[]>) => {
    try {
      // Generate file name with current date
      const date = new Date().toISOString().split('T')[0];
      
      Object.entries(data).forEach(([sheetName, sheetData]) => {
        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        const csvContent = XLSX.utils.sheet_to_csv(worksheet);
        
        // Create a blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const fileName = `DriveSight_${sheetName}_${date}.csv`;
        
        // Fix for the msSaveBlob error - use standard download approach
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up
      });
      
      toast.success("Data successfully exported to CSV", {
        description: `Files saved with prefix DriveSight_`
      });
    } catch (error) {
      console.error("Error exporting data to CSV:", error);
      toast.error("Failed to export data", {
        description: "An error occurred while creating the CSV files"
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-green-500" />
              <div>
                <CardTitle className="text-2xl">Data Export</CardTitle>
                <CardDescription>Export your DriveSight data to Excel or CSV</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="select-data">
              <TabsList className="mb-6">
                <TabsTrigger value="select-data">Select Data</TabsTrigger>
                <TabsTrigger value="export-options">Export Options</TabsTrigger>
              </TabsList>
              
              <TabsContent value="select-data" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Select data to export</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(selectedDataSets).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox 
                          id={key} 
                          checked={value}
                          onCheckedChange={() => handleCheckboxChange(key as keyof typeof selectedDataSets)}
                        />
                        <Label htmlFor={key} className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="export-options" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Export Format Options</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Excel format (.xlsx) creates a single file with multiple sheets. 
                    CSV format creates separate files for each data category.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-center mt-8 gap-4">
              <Button 
                onClick={() => handleExportClick('excel')}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                size="lg"
              >
                <Download className="h-5 w-5" />
                Export to Excel
              </Button>
              <Button 
                onClick={() => handleExportClick('csv')}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 flex items-center gap-2"
                size="lg"
              >
                <Download className="h-5 w-5" />
                Export to CSV
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>Sample of the data that will be exported</CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto">
            <div className="border rounded-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Health Score</th>
                    <th className="p-2 text-left">Temperature</th>
                    <th className="p-2 text-left">Power Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {generateInitialRMDEData().slice(0, 3).map(drive => (
                    <tr key={drive.id} className="border-b">
                      <td className="p-2">{drive.id}</td>
                      <td className="p-2">{drive.name}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${
                          drive.status === 'online' ? 'bg-green-500' : 
                          drive.status === 'warning' ? 'bg-yellow-500' : 
                          drive.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                        }`}>
                          {drive.status}
                        </span>
                      </td>
                      <td className="p-2">{drive.healthScore}%</td>
                      <td className="p-2">{drive.temperature}°C</td>
                      <td className="p-2">{drive.powerUsage}W</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-gray-50 p-3 text-center text-sm text-gray-500">
                Preview shows 3 of {generateInitialRMDEData().length} records
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExportData;
