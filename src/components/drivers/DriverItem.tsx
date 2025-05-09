
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { MapPin, ThermometerIcon } from 'lucide-react';
import { Driver } from '@/types/driverTypes';
import { getStatusColor, getDHIStatusColor, getDHITrendInfo } from '@/types/driverTypes';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DriverItemProps {
  driver: Driver;
}

const DriverItem = ({ driver }: DriverItemProps) => {
  const { icon, colorClass } = getDHITrendInfo(driver.dhiTrend);
  
  return (
    <div
      key={driver.id} 
      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
        driver.status === 'critical' 
          ? 'bg-red-50 border-red-200 animate-pulse dark:bg-red-950/20 dark:border-red-800' 
          : 'bg-card hover:bg-accent/20'
      }`}
    >
      <div className="flex items-center gap-3">
        <Avatar className={`h-10 w-10 ${driver.status === 'critical' ? 'ring-2 ring-red-500' : ''}`}>
          <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
            {driver.avatar}
          </div>
        </Avatar>
        <div>
          <h3 className="font-medium">{driver.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} />
            <span>{driver.location}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center">
          <div className={`h-2 w-2 rounded-full ${getStatusColor(driver.status)} mr-2 ${
            driver.status === 'critical' ? 'animate-ping' : ''
          }`}></div>
          <span className={`text-sm font-medium capitalize ${
            driver.status === 'critical' ? 'text-red-600 dark:text-red-400' : ''
          }`}>{driver.status}</span>
        </div>
        <span className="text-xs text-muted-foreground">{driver.lastUpdate}</span>
        
        {driver.dhi !== undefined && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 mt-1">
                  <ThermometerIcon size={14} className="text-muted-foreground" />
                  <Progress 
                    value={driver.dhi} 
                    className={`w-16 h-1.5 ${getDHIStatusColor(driver.dhi)}`} 
                  />
                  <div className="flex items-center">
                    <span className="text-xs font-medium">{driver.dhi}</span>
                    {driver.dhiTrend && Math.abs(driver.dhiTrend.change) >= 1 && (
                      <span className={`text-xs ml-0.5 ${colorClass}`}>
                        {icon}
                      </span>
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {driver.dhiExplanation || `Drive Health Index: ${driver.dhi}`}
                </p>
                {driver.dhiTrend && Math.abs(driver.dhiTrend.change) >= 1 && (
                  <p className="text-xs mt-1">
                    {driver.dhiTrend.direction === 'up' ? 'Improving' : 
                     driver.dhiTrend.direction === 'down' ? 'Declining' : 'Stable'}: 
                    {driver.dhiTrend.direction === 'up' ? '+' : 
                     driver.dhiTrend.direction === 'down' ? '-' : ''}
                    {Math.abs(driver.dhiTrend.change)}%
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default DriverItem;
