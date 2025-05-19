
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle } from 'lucide-react';
import { RMDEDrive } from '@/utils/types/rmdeTypes';

interface StandardViewProps {
  drives: RMDEDrive[];
}

const StandardView: React.FC<StandardViewProps> = ({ drives }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {drives.map((drive) => (
        <Card key={drive.id} className={drive.status === 'error' ? 'border-red-500' : ''}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{drive.name}</CardTitle>
              <Badge className={
                drive.status === 'online' ? 'bg-green-500' : 
                drive.status === 'warning' ? 'bg-yellow-500' : 
                drive.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
              }>
                {drive.status}
              </Badge>
            </div>
            <CardDescription>Module: {drive.moduleId}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Health Score:</span>
                <span className="font-medium">{drive.healthScore}%</span>
              </div>
              <Progress value={drive.healthScore} className={
                drive.healthScore > 90 ? 'bg-green-500' : 
                drive.healthScore > 70 ? 'bg-yellow-500' : 
                'bg-red-500'
              } />
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium">Temperature</div>
                  <div className="font-semibold">{drive.temperature}°C</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium">Power</div>
                  <div className="font-semibold">{drive.powerUsage}W</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium">Efficiency</div>
                  <div className="font-semibold">{drive.efficiency}%</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium">Runtime</div>
                  <div className="font-semibold">{Math.floor(drive.operatingHours)}h</div>
                </div>
              </div>
              
              {drive.status === 'error' && (
                <div className="mt-2">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error Detected</AlertTitle>
                    <AlertDescription>
                      {drive.errors[0]?.message || 'Unknown error'}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StandardView;
