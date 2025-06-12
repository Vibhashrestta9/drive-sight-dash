
import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Driver } from '@/types/driverTypes';
import DriverItem from './DriverItem';
import { BookOpen } from 'lucide-react';

interface DriverListProps {
  drivers: Driver[];
}

const DriverList = ({ drivers }: DriverListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Connected Drivers</h3>
        <Link to="/neta21-manual">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            NETA-21 Manual
          </Button>
        </Link>
      </div>
      
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {drivers.map((driver) => (
            <DriverItem key={driver.id} driver={driver} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DriverList;
