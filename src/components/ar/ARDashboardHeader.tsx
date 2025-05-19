
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, QrCode, Shield, CheckCircle } from 'lucide-react';

interface ARDashboardHeaderProps {
  selfHealingEnabled: boolean;
  arMode: boolean;
  showQrGenerator: boolean;
  onToggleSelfHealing: () => void;
  onToggleAR: () => void;
  onToggleQrGenerator: () => void;
}

const ARDashboardHeader: React.FC<ARDashboardHeaderProps> = ({
  selfHealingEnabled,
  arMode,
  showQrGenerator,
  onToggleSelfHealing,
  onToggleAR,
  onToggleQrGenerator
}) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Link to="/" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">AR Dashboard</h1>
          <p className="text-gray-600">Visualize drive data with augmented reality</p>
        </div>
      </div>
      <div className="space-x-2">
        <Button 
          variant={selfHealingEnabled ? "default" : "outline"}
          onClick={onToggleSelfHealing}
          className="flex items-center gap-2"
        >
          {selfHealingEnabled ? <CheckCircle className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
          {selfHealingEnabled ? "Self-Healing ON" : "Self-Healing OFF"}
        </Button>
        <Button 
          variant={arMode ? "default" : "outline"}
          onClick={onToggleAR}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          {arMode ? "Disable AR" : "Enable AR"}
        </Button>
        <Button
          variant={showQrGenerator ? "default" : "outline"}
          onClick={onToggleQrGenerator}
          className="flex items-center gap-2"
        >
          <QrCode className="h-4 w-4" />
          {showQrGenerator ? "Hide QR Codes" : "Show QR Codes"}
        </Button>
      </div>
    </div>
  );
};

export default ARDashboardHeader;
