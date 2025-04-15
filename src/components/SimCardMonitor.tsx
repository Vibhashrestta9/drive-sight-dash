
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Signal, Wifi } from "lucide-react";
import { SimCard } from "@/types/simTypes";
import { useState, useEffect } from "react";

const SimCardMonitor = () => {
  const [simData, setSimData] = useState<SimCard>({
    id: "1",
    iccid: "89910123456789012345",
    status: "active",
    signalStrength: 85,
    carrier: "Demo Carrier",
    dataUsage: {
      used: 7.5,
      total: 10,
    },
  });

  const getStatusColor = (status: SimCard['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'inactive':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Signal className="h-5 w-5" />
          SIM Card Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Status</span>
            <span className={`${getStatusColor(simData.status)} font-medium`}>
              {simData.status.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Signal Strength</span>
            <div className="flex items-center gap-2">
              <Wifi className={`h-5 w-5 ${simData.signalStrength > 70 ? 'text-green-500' : 'text-yellow-500'}`} />
              <span>{simData.signalStrength}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Data Usage</span>
              <span>{simData.dataUsage.used}GB / {simData.dataUsage.total}GB</span>
            </div>
            <Progress value={(simData.dataUsage.used / simData.dataUsage.total) * 100} />
          </div>
          <div className="text-sm">
            <p><span className="font-medium">ICCID:</span> {simData.iccid}</p>
            <p><span className="font-medium">Carrier:</span> {simData.carrier}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimCardMonitor;
