
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Driver } from '@/types/driverTypes';
import DriverItem from './DriverItem';

interface DriverListProps {
  drivers: Driver[];
}

const DriverList = ({ drivers }: DriverListProps) => {
  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {drivers.map((driver) => (
          <DriverItem key={driver.id} driver={driver} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default DriverList;
