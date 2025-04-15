import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  generateNETAModules,
  generateRMDESystemStatus,
} from "@/utils/rmdeUtils";
import { useEffect, useState } from "react";
import SystemStatus from "./SystemStatus";
import DrivesTable from "./DrivesTable";

const RMDEDashboard = () => {
  const [systemStatus, setSystemStatus] = useState(generateRMDESystemStatus());
  const [netaModules, setNetaModules] = useState(generateNETAModules());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSystemStatus(generateRMDESystemStatus());
      setNetaModules(generateNETAModules());
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="flex-1">
      <CardContent className="p-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitor">Monitor</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <SystemStatus />
            <DrivesTable />
          </TabsContent>

          <TabsContent value="monitor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>RMDE System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-8">
                    {systemStatus.map((system) => (
                      <div key={system.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{system.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              Last Updated: {system.lastUpdated}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Temperature:</p>
                            <p>{system.temperature}°C</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Humidity:</p>
                            <p>{system.humidity}%</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Status:</p>
                            <p>{system.status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>NETA-21 Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Connected Drives</TableHead>
                      <TableHead>Last Seen</TableHead>
                      <TableHead>API Endpoint</TableHead>
                      <TableHead>API Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {netaModules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell>{module.id}</TableCell>
                        <TableCell>{module.ipAddress}</TableCell>
                        <TableCell>{module.status}</TableCell>
                        <TableCell>{module.connectedDrives}</TableCell>
                        <TableCell>{module.lastSeen}</TableCell>
                        <TableCell>{module.apiEndpoint}</TableCell>
                        <TableCell>{module.apiStatus}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RMDEDashboard;
