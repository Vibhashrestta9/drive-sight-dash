
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Settings, Monitor, Info } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const ModemPasswordConfig = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-6 w-6" />
          Modem Password Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert>
            <AlertDescription>
              <strong>Important:</strong> You must change the default password of the modem to maximize the security of the remote connection.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {/* Initial Access */}
            <div className="rounded-lg border p-4">
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <Monitor className="h-5 w-5" />
                Step 1: Access Configuration Wizard
              </h3>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Navigate to <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">https://10.0.0.53</span> in your web browser</li>
                <li>Click on "Settings" when the modem configuration wizard appears</li>
                <li>Default credentials:
                  <ul className="list-disc ml-6 mt-1">
                    <li>Username: <span className="font-mono">adm</span></li>
                    <li>Password: <span className="font-mono">adm</span></li>
                  </ul>
                </li>
              </ol>
            </div>

            {/* Password Change */}
            <div className="rounded-lg border p-4">
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <Settings className="h-5 w-5" />
                Step 2: Change Password
              </h3>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Click "Quick launch" button to start the setup wizard</li>
                <li>Change the following settings:
                  <ul className="list-disc ml-6 mt-1">
                    <li>Modem name</li>
                    <li>Username</li>
                    <li>Password (ensure it's secure enough)</li>
                  </ul>
                </li>
                <li>Uncheck "Erase all" checkbox</li>
                <li>Click "Next"</li>
                <li>Verify time and date settings, then click "Next"</li>
                <li>On LAN/WAN configuration screen, click the red Ethernet port to switch it to green</li>
                <li>Click "Save" to apply the LAN/WAN configuration</li>
              </ol>
            </div>

            {/* Final Notes */}
            <div className="rounded-lg border p-4">
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <Info className="h-5 w-5" />
                Important Notes
              </h3>
              <ul className="list-disc ml-5 space-y-2">
                <li>After saving, you can disconnect the Ethernet cable and PC from the RMDE-01</li>
                <li>Internet settings configuration is not required as it is already configured</li>
                <li>For additional modem information, refer to the manufacturer's documentation</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModemPasswordConfig;
