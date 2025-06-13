
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Download, Eye, EyeOff } from 'lucide-react';
import QRCode from 'qrcode.react';

interface DriveConfig {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
}

const DriveQRCodeGenerator = () => {
  const [selectedDrive, setSelectedDrive] = useState<string>('');
  const [customConfig, setCustomConfig] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Drive configurations with sequential naming
  const drives: DriveConfig[] = [
    {
      id: 'drive-1',
      name: 'Drive 1',
      type: 'ACS880',
      config: {
        ip: '192.168.1.101',
        port: 502,
        deviceId: 1,
        connect21Module: 'Connect21-A',
        parameters: {
          frequency: 50,
          voltage: 400,
          current: 100
        }
      }
    },
    {
      id: 'drive-2', 
      name: 'Drive 2',
      type: 'ACS580',
      config: {
        ip: '192.168.1.102',
        port: 502,
        deviceId: 2,
        connect21Module: 'Connect21-B',
        parameters: {
          frequency: 60,
          voltage: 480,
          current: 75
        }
      }
    },
    {
      id: 'drive-3',
      name: 'Drive 3', 
      type: 'ACS380',
      config: {
        ip: '192.168.1.103',
        port: 502,
        deviceId: 3,
        connect21Module: 'Connect21-C',
        parameters: {
          frequency: 50,
          voltage: 400,
          current: 50
        }
      }
    },
    {
      id: 'drive-4',
      name: 'Drive 4',
      type: 'ACS880',
      config: {
        ip: '192.168.1.104',
        port: 502,
        deviceId: 4,
        connect21Module: 'Connect21-A',
        parameters: {
          frequency: 60,
          voltage: 480,
          current: 120
        }
      }
    },
    {
      id: 'drive-5',
      name: 'Drive 5',
      type: 'ACS580',
      config: {
        ip: '192.168.1.105',
        port: 502,
        deviceId: 5,
        connect21Module: 'Connect21-B',
        parameters: {
          frequency: 50,
          voltage: 400,
          current: 90
        }
      }
    }
  ];

  const getQRCodeData = () => {
    const drive = drives.find(d => d.id === selectedDrive);
    if (!drive) return '';

    const qrData = {
      driveId: drive.id,
      driveName: drive.name,
      driveType: drive.type,
      connect21Module: drive.config.connect21Module,
      networkConfig: {
        ip: drive.config.ip,
        port: drive.config.port,
        deviceId: drive.config.deviceId
      },
      parameters: drive.config.parameters,
      timestamp: new Date().toISOString(),
      ...(customConfig && { customConfig: JSON.parse(customConfig) })
    };

    return JSON.stringify(qrData, null, 2);
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('#qr-code canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${drives.find(d => d.id === selectedDrive)?.name || 'drive'}-qr-code.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const selectedDriveData = drives.find(d => d.id === selectedDrive);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-6 w-6" />
          Drive QR Code Generator
        </CardTitle>
        <CardDescription>
          Generate QR codes for Connect21 drive configuration and AR visualization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="drive-select">Select Drive</Label>
              <Select value={selectedDrive} onValueChange={setSelectedDrive}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a drive to generate QR code" />
                </SelectTrigger>
                <SelectContent>
                  {drives.map(drive => (
                    <SelectItem key={drive.id} value={drive.id}>
                      {drive.name} ({drive.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDriveData && (
              <div className="space-y-3">
                <div className="rounded-lg border p-3 bg-muted/50">
                  <h4 className="font-medium mb-2">Drive Configuration</h4>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">Name:</span> {selectedDriveData.name}</div>
                    <div><span className="font-medium">Type:</span> {selectedDriveData.type}</div>
                    <div><span className="font-medium">Connect21 Module:</span> {selectedDriveData.config.connect21Module}</div>
                    <div><span className="font-medium">IP Address:</span> {selectedDriveData.config.ip}</div>
                    <div><span className="font-medium">Port:</span> {selectedDriveData.config.port}</div>
                    <div><span className="font-medium">Device ID:</span> {selectedDriveData.config.deviceId}</div>
                  </div>
                </div>

                <div className="rounded-lg border p-3 bg-muted/50">
                  <h4 className="font-medium mb-2">Drive Parameters</h4>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">Frequency:</span> {selectedDriveData.config.parameters.frequency} Hz</div>
                    <div><span className="font-medium">Voltage:</span> {selectedDriveData.config.parameters.voltage} V</div>
                    <div><span className="font-medium">Current:</span> {selectedDriveData.config.parameters.current} A</div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2"
                >
                  {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Config
                </Button>
              </div>
              
              {showAdvanced && (
                <div>
                  <Label htmlFor="custom-config">Custom Configuration (JSON)</Label>
                  <textarea
                    id="custom-config"
                    className="w-full h-24 p-2 border rounded-md text-sm font-mono"
                    placeholder='{"customParam": "value"}'
                    value={customConfig}
                    onChange={(e) => setCustomConfig(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* QR Code Display */}
          <div className="space-y-4">
            {selectedDrive ? (
              <div className="flex flex-col items-center space-y-4">
                <div id="qr-code" className="p-4 bg-white rounded-lg border shadow-sm">
                  <QRCode
                    value={getQRCodeData()}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                
                <Button onClick={downloadQRCode} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download QR Code
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Scan this QR code with the AR app to view</p>
                  <p><strong>{selectedDriveData?.name}</strong> in augmented reality</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center text-muted-foreground">
                  <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Select a drive to generate QR code</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* QR Code Data Preview */}
        {selectedDrive && showAdvanced && (
          <div className="mt-6">
            <Label>QR Code Data Preview</Label>
            <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-auto max-h-40">
              {getQRCodeData()}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DriveQRCodeGenerator;
