
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, Printer } from 'lucide-react';
import { RMDEDrive } from '@/utils/rmdeUtils';

interface DriveQRCodeGeneratorProps {
  drives: RMDEDrive[];
}

const DriveQRCodeGenerator: React.FC<DriveQRCodeGeneratorProps> = ({ drives }) => {
  const [selectedDrive, setSelectedDrive] = useState<string>(drives[0]?.id || '');
  
  const downloadQRCode = (driveName: string) => {
    const canvas = document.getElementById(`qr-${driveName}`) as HTMLElement;
    const svgData = new XMLSerializer().serializeToString(canvas);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${driveName}-QR.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  
  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const selectedDriveObj = drives.find(d => d.id === selectedDrive);
    if (!selectedDriveObj) return;
    
    const qrCode = document.getElementById(`qr-${selectedDriveObj.id}`) as HTMLElement;
    const svgData = new XMLSerializer().serializeToString(qrCode);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code for ${selectedDriveObj.name}</title>
          <style>
            body { 
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              font-family: Arial, sans-serif;
            }
            .qr-container {
              text-align: center;
            }
            .qr-code {
              width: 300px;
              height: 300px;
            }
            .info {
              margin-top: 20px;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="qr-code">${svgData}</div>
            <div class="info">
              <p><strong>Drive:</strong> ${selectedDriveObj.name}</p>
              <p><strong>Module:</strong> ${selectedDriveObj.moduleId}</p>
              <p><strong>ID:</strong> ${selectedDriveObj.id}</p>
              <p>Scan with DriveSight AR Dashboard</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  
  return (
    <div>
      <Tabs defaultValue={selectedDrive} onValueChange={setSelectedDrive}>
        <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${Math.min(drives.length, 5)}, 1fr)` }}>
          {drives.slice(0, 5).map((drive) => (
            <TabsTrigger key={drive.id} value={drive.id}>
              {drive.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {drives.map((drive) => (
          <TabsContent key={drive.id} value={drive.id} className="mt-4">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* QR Code */}
              <div className="flex-shrink-0 border p-4 rounded-md bg-white">
                <QRCodeSVG 
                  id={`qr-${drive.id}`}
                  value={JSON.stringify({
                    id: drive.id,
                    name: drive.name,
                    moduleId: drive.moduleId
                  })}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              {/* Drive Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{drive.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={
                      drive.status === 'online' ? 'bg-green-500' : 
                      drive.status === 'warning' ? 'bg-yellow-500' : 
                      drive.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                    }>
                      {drive.status}
                    </Badge>
                    <span className="text-sm">Module: {drive.moduleId}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500">Health Score:</span> {drive.healthScore}%
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Temperature:</span> {drive.temperature}°C
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Power:</span> {drive.powerUsage}W
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Runtime:</span> {Math.floor(drive.operatingHours)}h
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => downloadQRCode(drive.id)}
                  >
                    <Download className="h-4 w-4" />
                    Download QR
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={printQRCode}
                  >
                    <Printer className="h-4 w-4" />
                    Print QR
                  </Button>
                </div>
                
                <div className="text-sm text-gray-500">
                  Print this QR code and place it on or near the physical drive.
                  Then use the AR Dashboard to scan it and view real-time data.
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DriveQRCodeGenerator;
