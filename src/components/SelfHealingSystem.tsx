
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, Shield, Zap } from 'lucide-react';
import { RMDEDrive } from '@/utils/types/rmdeTypes';
import { getStatusBadgeClass } from '@/utils/rmde/uiUtils';

interface SelfHealingSystemProps {
  drives: RMDEDrive[];
  onHeal: (driveId: string, errorId: string) => void;
}

const SelfHealingSystem = ({ drives, onHeal }: SelfHealingSystemProps) => {
  const [isHealing, setIsHealing] = useState(false);
  
  // Significantly reduce the number of critical errors shown - limit to maximum 2 errors
  const criticalErrors = drives.reduce((acc, drive) => {
    drive.errors.filter(error => error.severity === 'critical' && !error.resolved)
      .forEach(error => acc.push({ ...error, driveId: drive.id }));
    return acc;
  }, [] as ({ driveId: number } & RMDEDrive['errors'][0])[])
  .slice(0, 2); // Limit to only 2 critical errors maximum
  
  const handleHeal = (driveId: string, errorId: string) => {
    setIsHealing(true);
    setTimeout(() => {
      onHeal(driveId.toString(), errorId.toString());
      setIsHealing(false);
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Self-Healing System</CardTitle>
            <CardDescription>Automatically resolve critical drive errors</CardDescription>
          </div>
          <Shield className="h-6 w-6 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent>
        {criticalErrors.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No critical errors detected. System is healthy.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {criticalErrors.map(error => (
              <div key={error.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <div className="text-sm font-medium">
                      Critical Error: {error.message}
                    </div>
                  </div>
                  <Badge className={getStatusBadgeClass('error')}>Critical</Badge>
                </div>
                <Separator className="my-2" />
                <div className="text-sm text-gray-500">
                  Timestamp: {new Date(error.timestamp).toLocaleString()}
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={isHealing}
                  onClick={() => handleHeal(error.driveId.toString(), error.id.toString())}
                >
                  {isHealing ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-spin" />
                      Healing...
                    </>
                  ) : (
                    'Resolve Error'
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelfHealingSystem;
