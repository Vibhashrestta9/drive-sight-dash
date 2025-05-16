
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RMDEDrive, RMDEError } from '@/utils/rmdeUtils';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock, RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SelfHealingSystemProps {
  drives: RMDEDrive[];
  onHeal: (driveId: string, errorId: string) => void;
}

interface HealingOperation {
  id: string;
  driveId: string;
  driveName: string;
  errorId: string;
  errorMessage: string;
  status: 'in_progress' | 'completed' | 'failed';
  progress: number;
  timestamp: number;
  attemptCount: number;
  maxAttempts: number;
}

const SelfHealingSystem: React.FC<SelfHealingSystemProps> = ({ drives, onHeal }) => {
  const [healingOperations, setHealingOperations] = useState<HealingOperation[]>([]);
  const [completedOperations, setCompletedOperations] = useState<HealingOperation[]>([]);
  const { toast } = useToast();
  
  // Check for errors and initiate self-healing
  useEffect(() => {
    drives.forEach(drive => {
      drive.errors.forEach(error => {
        // Only try to heal unresolved errors that aren't already being processed
        if (!error.resolved && 
            !healingOperations.some(op => op.driveId === drive.id && op.errorId === error.id) &&
            !completedOperations.some(op => op.driveId === drive.id && op.errorId === error.id)) {
          
          // Create a new healing operation
          const newOperation: HealingOperation = {
            id: `${drive.id}-${error.id}-${Date.now()}`,
            driveId: drive.id,
            driveName: drive.name,
            errorId: error.id,
            errorMessage: error.message,
            status: 'in_progress',
            progress: 0,
            timestamp: Date.now(),
            attemptCount: 1,
            maxAttempts: calculateMaxAttempts(error)
          };
          
          setHealingOperations(prev => [...prev, newOperation]);
          onHeal(drive.id, error.id);
          
          toast({
            title: "Auto-Healing Initiated",
            description: `Attempting to recover ${drive.name} from error: ${error.message}`,
          });
        }
      });
    });
  }, [drives]);
  
  // Progress the healing operations
  useEffect(() => {
    if (healingOperations.length === 0) return;
    
    const interval = setInterval(() => {
      setHealingOperations(prev => {
        return prev.map(op => {
          // Increment progress
          const newProgress = Math.min(op.progress + Math.random() * 10, 100);
          
          // If completed
          if (newProgress >= 100) {
            // Determine if successful based on severity and attempt count
            const successful = Math.random() > getSeverityFailureProbability(op);
            
            // Move to completed operations
            setTimeout(() => {
              setCompletedOperations(prev => [...prev, {
                ...op,
                progress: 100,
                status: successful ? 'completed' : 'failed'
              }]);
              
              toast({
                title: successful ? "Auto-Healing Successful" : "Auto-Healing Failed",
                description: successful
                  ? `Successfully recovered ${op.driveName} from error`
                  : `Failed to recover ${op.driveName} after ${op.attemptCount} attempts`,
                variant: successful ? "default" : "destructive",
              });
              
              // If failed and under max attempts, retry
              if (!successful && op.attemptCount < op.maxAttempts) {
                setHealingOperations(prev => [...prev, {
                  ...op,
                  id: `${op.driveId}-${op.errorId}-${Date.now()}`,
                  progress: 0,
                  timestamp: Date.now(),
                  attemptCount: op.attemptCount + 1
                }]);
              }
            }, 1000);
            
            // Remove from active operations
            return null;
          }
          
          return { ...op, progress: newProgress };
        }).filter(Boolean) as HealingOperation[];
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [healingOperations]);
  
  const calculateMaxAttempts = (error: RMDEError): number => {
    // More severe errors get fewer attempts
    switch (error.severity) {
      case 'critical':
        return 2;
      case 'high':
        return 3;
      case 'medium':
        return 4;
      default:
        return 5;
    }
  };
  
  const getSeverityFailureProbability = (op: HealingOperation): number => {
    // Get error from drives data
    const drive = drives.find(d => d.id === op.driveId);
    const error = drive?.errors.find(e => e.id === op.errorId);
    
    if (!error) return 0.5;
    
    // Higher probability of failure for more severe errors
    switch (error.severity) {
      case 'critical':
        return 0.7 - (op.attemptCount * 0.1); // Gets easier with more attempts
      case 'high':
        return 0.5 - (op.attemptCount * 0.1);
      case 'medium':
        return 0.3 - (op.attemptCount * 0.05);
      default:
        return 0.2 - (op.attemptCount * 0.05);
    }
  };
  
  if (healingOperations.length === 0 && completedOperations.length === 0) {
    return (
      <Alert className="mb-6">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Self-Healing System Active</AlertTitle>
        <AlertDescription>
          The system is monitoring for errors. When detected, automatic recovery will be attempted.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-blue-500" />
          Self-Healing System
        </CardTitle>
        <CardDescription>
          Automatic error detection and recovery
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Active healing operations */}
        {healingOperations.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Active Recovery Operations</h3>
            <div className="space-y-3">
              {healingOperations.map(op => (
                <div key={op.id} className="border rounded-md p-3 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium">{op.driveName}</div>
                    <Badge className="bg-blue-500">
                      Attempt {op.attemptCount}/{op.maxAttempts}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{op.errorMessage}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={op.progress} className="h-2 flex-grow" />
                    <div className="text-xs font-medium">{Math.round(op.progress)}%</div>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(op.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Completed operations */}
        {completedOperations.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Recent Recovery Attempts</h3>
            <div className="space-y-2">
              {completedOperations.slice(0, 5).map(op => (
                <div 
                  key={op.id} 
                  className={`border rounded-md p-2 ${
                    op.status === 'completed' 
                      ? 'bg-green-50 dark:bg-green-900/20' 
                      : 'bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{op.driveName}</div>
                    <Badge className={op.status === 'completed' ? 'bg-green-500' : 'bg-red-500'}>
                      {op.status === 'completed' ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Recovered</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Failed</span>
                        </div>
                      )}
                    </Badge>
                  </div>
                  <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">{op.errorMessage}</div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(op.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
              
              {completedOperations.length > 5 && (
                <div className="text-sm text-center text-gray-500 mt-1">
                  + {completedOperations.length - 5} more operations
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelfHealingSystem;
