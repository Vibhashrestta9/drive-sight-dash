
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, MonitorSmartphone, Settings2, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const NetworkConfigGuide = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-6 w-6" />
          PC Network Configuration Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4">
            {/* Access Network Settings */}
            <div className="rounded-lg border p-4">
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <MonitorSmartphone className="h-5 w-5" />
                Step 1: Access Network Settings
              </h3>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Open Windows Control Panel</li>
                <li>Open Network Connections (or type ncpa.cpl in Start menu)</li>
                <li>Right-click Local Area Configuration and select Properties</li>
              </ol>
            </div>

            {/* Configure IP Settings */}
            <div className="rounded-lg border p-4">
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <Settings2 className="h-5 w-5" />
                Step 2: Configure IP Settings
              </h3>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Double-click Internet Protocol Version 4 (TCP/IPv4)</li>
                <li>Select "Alternate configuration" and choose "User configured"</li>
                <li>Enter the following settings:</li>
              </ol>
              <div className="mt-3 bg-slate-50 p-4 rounded-md space-y-2">
                <p><strong>IP address:</strong> 10.0.0.100</p>
                <p><strong>Subnet mask:</strong> 255.255.255.0</p>
                <p><strong>Default gateway:</strong> 10.0.0.53</p>
                <p><strong>Preferred DNS server:</strong> 8.8.8.8</p>
                <p><strong>Alternate DNS server:</strong> (leave empty)</p>
                <p><strong>WINS servers:</strong> (leave empty)</p>
              </div>
            </div>

            {/* Testing Connection */}
            <div className="rounded-lg border p-4">
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <WifiOff className="h-5 w-5" />
                Step 3: Test Connection
              </h3>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Connect Ethernet cable between PC and modem</li>
                <li>Open web browser and navigate to <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">https://10.0.0.53</span></li>
                <li>Configuration wizard should be displayed</li>
              </ol>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Important Note:</strong> There is no DHCP server running on RMDE-01 Ethernet device ports. 
              The PC must have a static IP address in the 10.0.0.x network (recommended range: 10.0.0.54 to 10.0.0.254).
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkConfigGuide;
