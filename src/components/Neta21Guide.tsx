
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, LogIn, Cloud, Download, Globe } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const Neta21Guide = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-6 w-6" />
          CONNECT Connection Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Login Instructions */}
          <div className="rounded-lg border p-4">
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <LogIn className="h-5 w-5" />
              Logging into CONNECT
            </h3>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Ensure RMDE-01 is powered on</li>
              <li>Press and hold CONNECT SD/RJ45 button for 5 seconds</li>
              <li>Connect Ethernet cable between CONNECT ETH1 port and PC</li>
              <li>Navigate to <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">https://192.168.230.1</span></li>
              <li>Default credentials:
                <ul className="list-disc ml-6 mt-1">
                  <li>Username: <span className="font-mono">admin</span></li>
                  <li>Password: <span className="font-mono">admin</span></li>
                </ul>
              </li>
              <li>Change username and password after first login</li>
            </ol>
            <p className="mt-3 text-sm text-muted-foreground">Note: After login, you may see a license dialog. Click Close to proceed.</p>
          </div>

          {/* Cloud Connection Status */}
          <div className="rounded-lg border p-4">
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <Cloud className="h-5 w-5" />
              Cloud Connection Status
            </h3>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Check connectivity status on CONNECT portal front page</li>
              <li>View data sent to cloud:
                <ul className="list-disc ml-6 mt-1">
                  <li>Go to Navigation window</li>
                  <li>Click Reports &gt; Report events</li>
                </ul>
              </li>
              <li>Export detailed data as attachment to view raw data being sent</li>
            </ol>
          </div>

          {/* Firmware Update */}
          <div className="rounded-lg border p-4">
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <Download className="h-5 w-5" />
              Firmware Update
            </h3>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Click "Software update" in Unconfigured settings</li>
              <li>System will check for available updates</li>
              <li>Click "Update" to start the update process if available</li>
            </ol>
            <Badge className="mt-3" variant="secondary">
              Provides latest security updates and monitoring features
            </Badge>
          </div>

          {/* Cloud Services */}
          <div className="rounded-lg border p-4">
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <Globe className="h-5 w-5" />
              ABB Ability Cloud Services
            </h3>
            <ul className="list-disc ml-5 space-y-2">
              <li>Contact ABB sales for service agreement or trial version</li>
              <li>For portal access and support:
                <div className="ml-6 mt-1">
                  <span className="font-mono text-sm">CH-Drive.Remote.Support@abb.com</span>
                </div>
              </li>
              <li>Required information:
                <ul className="list-disc ml-6 mt-1">
                  <li>Customer and site details</li>
                  <li>CONNECT and RMDE-01 serial numbers</li>
                  <li>Connected drives details</li>
                </ul>
              </li>
            </ul>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Important:</strong> To use ABB Ability Services, you need a MyABB account. 
              Connected drives must be registered in ABB installed base systems.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default Neta21Guide;
