
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
    <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-0 text-white shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-xl font-bold">Self-Healing System</CardTitle>
            <CardDescription className="text-white/80">Automatically resolve critical drive errors</CardDescription>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {criticalErrors.length === 0 ? (
          <div className="text-center py-6 bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="bg-green-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <p className="text-white font-medium text-lg">No critical errors detected. System is healthy.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {criticalErrors.map(error => (
              <div key={error.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500 p-2 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-white font-medium">
                      Critical Error: {error.message}
                    </div>
                  </div>
                  <Badge className="bg-red-600 text-white border-red-500">Critical</Badge>
                </div>
                <Separator className="my-3 bg-white/20" />
                <div className="text-white/80 mb-4">
                  Timestamp: {new Date(error.timestamp).toLocaleString()}
                </div>
                <Button 
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-300"
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
