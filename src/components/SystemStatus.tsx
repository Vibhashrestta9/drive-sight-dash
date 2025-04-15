
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateRMDESystemStatus, getStatusBadgeClass } from "@/utils/rmdeUtils";
import { useState, useEffect } from "react";

const SystemStatus = () => {
  const [systemStatus, setSystemStatus] = useState(generateRMDESystemStatus());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSystemStatus(generateRMDESystemStatus());
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>System ID</TableHead>
              <TableHead>Temperature</TableHead>
              <TableHead>Humidity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {systemStatus.map((system) => (
              <TableRow key={system.id}>
                <TableCell className="font-medium">{system.id}</TableCell>
                <TableCell>{system.temperature}°C</TableCell>
                <TableCell>{system.humidity}%</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className={`h-2.5 w-2.5 rounded-full mr-2 ${getStatusBadgeClass(system.status)}`}></span>
                    {system.status}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(system.lastUpdated).toLocaleTimeString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
