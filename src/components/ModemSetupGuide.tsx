
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Power, Clock, Memory, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SetupStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'waiting' | 'in-progress' | 'completed' | 'error';
  notes?: string[];
}

const ModemSetupGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: SetupStep[] = [
    {
      title: "Download Configuration",
      description: "Download the configuration sample file (comcfg.txt) from ABB download center",
      icon: <Download className="h-5 w-5" />,
      status: currentStep > 0 ? 'completed' : 'waiting'
    },
    {
      title: "Power On",
      description: "Power on the Cellular modem",
      icon: <Power className="h-5 w-5" />,
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'in-progress' : 'waiting'
    },
    {
      title: "Startup Wait",
      description: "Wait one minute for the Cellular modem to start-up",
      icon: <Clock className="h-5 w-5" />,
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'in-progress' : 'waiting'
    },
    {
      title: "Insert SD Card",
      description: "Place the SD card with comcfg.txt file in the modem SD card slot",
      icon: <Memory className="h-5 w-5" />,
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'in-progress' : 'waiting',
      notes: [
        "Within five seconds, the modem will display a slow blinking pattern of the USR LED",
        "Solid green LED indicates success, solid red indicates failure",
        "If previously configured with identical settings, LEDs may not change color"
      ]
    },
    {
      title: "Remove SD Card",
      description: "Remove the SD card while the modem is powered on",
      icon: <RefreshCw className="h-5 w-5" />,
      status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'in-progress' : 'waiting',
      notes: [
        "The modem will reboot and apply the new settings"
      ]
    }
  ];

  const getStatusColor = (status: SetupStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeVariant = (status: SetupStep['status']): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modem Setup Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-start gap-4 p-4 rounded-lg ${
                currentStep === index ? 'border-2 border-blue-500' : 'border'
              }`}
            >
              <div className={`p-2 rounded-full ${getStatusColor(step.status)}`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{step.title}</h3>
                  <Badge variant={getStatusBadgeVariant(step.status)}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : step.status === 'error' ? (
                      <XCircle className="h-3 w-3 mr-1" />
                    ) : null}
                    {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                {step.notes && step.notes.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {step.notes.map((note, noteIndex) => (
                      <li key={noteIndex} className="text-sm text-gray-500">
                        • {note}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        <Alert className="mt-6">
          <AlertDescription>
            After reboot, verify that:
            <ul className="mt-2 space-y-1">
              <li>• All Ethernet ports show green lights</li>
              <li>• If SIM card is configured, the signal and ST LED must be orange without blinking</li>
            </ul>
            <p className="mt-2">
              For further troubleshooting information, visit{' '}
              <a href="https://ewon.biz/" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                ewon.biz
              </a>
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default ModemSetupGuide;
