
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, MailCheck, Lock } from 'lucide-react';

interface AlertSettingsDialogProps {
  onSave: (settings: AlertSettings) => void;
  currentSettings: AlertSettings;
}

export interface AlertSettings {
  enabled: boolean;
  emailAddress: string;
  sendSMS: boolean;
  phoneNumber: string;
  sendgridApiKey?: string;
  senderEmail?: string;
}

const AlertSettingsDialog = ({ onSave, currentSettings }: AlertSettingsDialogProps) => {
  const [settings, setSettings] = useState<AlertSettings>(currentSettings);
  const [open, setOpen] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    // Validate email if alerts are enabled
    if (settings.enabled && !settings.emailAddress) {
      toast({
        title: "Email Required",
        description: "Please enter an email address for alerts",
        variant: "destructive",
      });
      return;
    }

    // Validate SendGrid credentials if providing them
    if (settings.enabled && showApiConfig && (!settings.sendgridApiKey || !settings.senderEmail)) {
      toast({
        title: "SendGrid Configuration Required",
        description: "Please enter both SendGrid API key and sender email",
        variant: "destructive",
      });
      return;
    }

    onSave(settings);
    setOpen(false);
    
    if (settings.enabled) {
      toast({
        title: "Settings Saved",
        description: "Critical alerts will be sent to your email",
      });
      // Render the icon separately instead of passing it as a property
      setTimeout(() => {
        document.querySelector('.toast-icon')?.appendChild(
          document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        );
      }, 0);
    } else {
      toast({
        title: "Settings Saved",
        description: "Alert notifications are disabled",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <AlertTriangle className="h-4 w-4" />
          Alert Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alert Notification Settings</DialogTitle>
          <DialogDescription>
            Configure how you want to be notified about critical driver events.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="alert-enabled" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Enable Alert Notifications
            </Label>
            <Switch
              id="alert-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
          </div>
          
          {settings.enabled && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email" 
                  placeholder="your.email@example.com"
                  value={settings.emailAddress}
                  onChange={(e) => setSettings({ ...settings, emailAddress: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Critical alerts will be sent to this email address.
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="api-config" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Configure SendGrid API
                </Label>
                <Switch
                  id="api-config"
                  checked={showApiConfig}
                  onCheckedChange={(checked) => setShowApiConfig(checked)}
                />
              </div>
              
              {showApiConfig && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="sendgrid-key">SendGrid API Key</Label>
                    <Input
                      id="sendgrid-key"
                      type="password"
                      placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxxx"
                      value={settings.sendgridApiKey || ''}
                      onChange={(e) => setSettings({ ...settings, sendgridApiKey: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your SendGrid API key to send emails. Will be stored locally.
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="sender-email">Sender Email</Label>
                    <Input
                      id="sender-email"
                      type="email" 
                      placeholder="alerts@yourcompany.com"
                      value={settings.senderEmail || ''}
                      onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Email address that will appear as the sender. Must be verified in SendGrid.
                    </p>
                  </div>
                </>
              )}
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-enabled">SMS Notifications</Label>
                <Switch 
                  id="sms-enabled"
                  checked={settings.sendSMS}
                  onCheckedChange={(checked) => setSettings({ ...settings, sendSMS: checked })}
                />
              </div>
              
              {settings.sendSMS && (
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={settings.phoneNumber}
                    onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertSettingsDialog;
