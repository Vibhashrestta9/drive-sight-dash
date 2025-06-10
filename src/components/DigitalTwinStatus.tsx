
import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Laptop, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDigitalTwin } from '@/hooks/useDigitalTwin';

const DigitalTwinStatus = () => {
  const { 
    edgeStatus, 
    cloudStatus, 
    syncStatus, 
    syncProgress, 
    lastSyncTime,
    syncHealth
  } = useDigitalTwin();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Virtual Based System Status</CardTitle>
            <CardDescription>Edge and cloud model synchronization</CardDescription>
          </div>
          <Link 
            to="/digital-twin"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Manage Virtual System
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Edge & Cloud Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Laptop className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-sm font-medium">Edge Model</div>
                <div className="flex items-center gap-1">
                  <Badge 
                    className={`${
                      edgeStatus === 'online' ? 'bg-green-500' : 
                      edgeStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  >
                    {edgeStatus}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-sm font-medium">Cloud Model</div>
                <div className="flex items-center gap-1">
                  <Badge 
                    className={`${
                      cloudStatus === 'online' ? 'bg-green-500' : 
                      cloudStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  >
                    {cloudStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Sync Status */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-medium">Sync Status</div>
              <div className="text-xs text-gray-500">
                {syncStatus === 'in_progress' ? 'Syncing...' : 
                 syncStatus === 'completed' ? 'Last synced' : 
                 syncStatus === 'failed' ? 'Sync failed' : 'Waiting'}: 
                {syncStatus !== 'waiting' && lastSyncTime && ` ${lastSyncTime}`}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className={`h-4 w-4 ${
                syncStatus === 'in_progress' ? 'animate-spin text-blue-500' : 
                syncStatus === 'completed' ? 'text-green-500' : 
                syncStatus === 'failed' ? 'text-red-500' : 'text-gray-500'
              }`} />
              <Progress 
                value={syncProgress} 
                className={`h-2 ${
                  syncStatus === 'in_progress' ? 'bg-blue-100' : 
                  syncStatus === 'completed' ? 'bg-green-100' : 
                  syncStatus === 'failed' ? 'bg-red-100' : 'bg-gray-100'
                }`}
              />
            </div>
          </div>

          {/* Virtual System Health */}
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Virtual System Health</div>
              <div className="flex items-center gap-1">
                {syncHealth >= 90 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
                <span className={`text-sm ${
                  syncHealth >= 90 ? 'text-green-600' : 
                  syncHealth >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {syncHealth}%
                </span>
              </div>
            </div>
            <Progress 
              value={syncHealth} 
              className="h-2 mt-1"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        Using Edge-Cloud Hybrid Virtual System Technology
      </CardFooter>
    </Card>
  );
};

export default DigitalTwinStatus;
