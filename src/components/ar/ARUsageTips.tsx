
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RefreshCw } from 'lucide-react';

const ARUsageTips: React.FC = () => {
  return (
    <Alert className="mb-6">
      <RefreshCw className="h-4 w-4" />
      <AlertTitle>AR Usage Tips</AlertTitle>
      <AlertDescription>
        <p>1. Enable AR mode and allow camera access</p>
        <p>2. Generate and print QR codes for your drives</p>
        <p>3. Point your camera at the QR codes to see live drive data</p>
      </AlertDescription>
    </Alert>
  );
};

export default ARUsageTips;
