
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateInitialRMDEData, updateRMDEData, getStatusBadgeClass, getHealthColor } from "@/utils/rmdeUtils";
import type { RMDEDrive } from "@/utils/rmdeUtils";

const DrivesTable = () => {
  const [drives, setDrives] = useState<RMDEDrive[]>(generateInitialRMDEData());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDrives(prevDrives => updateRMDEData(prevDrives));
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Drives</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Drive</TableHead>
              <TableHead>Module ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Temperature</TableHead>
              <TableHead>Power Usage</TableHead>
              <TableHead>Health Score</TableHead>
              <TableHead>Speed</TableHead>
              <TableHead>Torque</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drives.map((drive) => (
              <TableRow key={drive.id}>
                <TableCell className="font-medium">{drive.name}</TableCell>
                <TableCell>{drive.moduleId}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className={`h-2.5 w-2.5 rounded-full mr-2 ${getStatusBadgeClass(drive.status)}`}></span>
                    {drive.status}
                  </div>
                </TableCell>
                <TableCell>{drive.temperature}°C</TableCell>
                <TableCell>{drive.powerUsage}W</TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getHealthColor(drive.healthScore)}`} 
                      style={{ width: `${drive.healthScore}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{drive.healthScore}%</span>
                </TableCell>
                <TableCell>{Math.round(drive.speed)} RPM</TableCell>
                <TableCell>{Math.round(drive.torque)} Nm</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DrivesTable;
