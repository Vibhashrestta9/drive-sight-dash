
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bell } from 'lucide-react';
import AlertSettingsDialog from '../AlertSettingsDialog';
import { AlertSettings } from '../AlertSettingsDialog';
import { Driver } from '@/types/driverTypes';

interface AlertControlsProps {
  criticalAlerts: Driver[];
  activeDrivers: number;
  onSimulateCritical: () => void;
  onTestEmail: () => void;
  onSaveSettings: (settings: AlertSettings) => void;
  currentSettings: AlertSettings;
  sendingAlert: boolean;
}

const AlertControls = ({
  criticalAlerts,
  activeDrivers,
  onSimulateCritical,
  onTestEmail,
  onSaveSettings,
  currentSettings,
  sendingAlert
}: AlertControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      {criticalAlerts.length > 0 && (
        <Badge className="bg-red-500 animate-pulse flex items-center gap-1">
          <AlertTriangle size={14} />
          {criticalAlerts.length} Critical
        </Badge>
      )}
      <Badge className="bg-green-500">{activeDrivers} Active</Badge>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSimulateCritical}
          disabled={sendingAlert}
        >
          {sendingAlert ? "Sending..." : "Test Alert"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="gap-1"
          onClick={onTestEmail}
          disabled={sendingAlert}
        >
          <Bell className="h-4 w-4" />
          Test Email
        </Button>
        <AlertSettingsDialog 
          onSave={onSaveSettings} 
          currentSettings={currentSettings} 
        />
      </div>
    </div>
  );
};

export default AlertControls;
