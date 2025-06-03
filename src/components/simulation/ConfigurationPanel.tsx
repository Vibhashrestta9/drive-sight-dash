
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Upload, Save, Trash2, Settings, FileText } from 'lucide-react';
import { SimulationConfiguration } from '@/types/advancedSimulationTypes';

interface ConfigurationPanelProps {
  onExport: () => SimulationConfiguration;
  onImport: (config: SimulationConfiguration) => void;
}

const ConfigurationPanel = ({ onExport, onImport }: ConfigurationPanelProps) => {
  const [savedConfigs, setSavedConfigs] = useState<SimulationConfiguration[]>([]);
  const [importData, setImportData] = useState('');
  const [exportFormat, setExportFormat] = useState<'json' | 'xml'>('json');
  const [showImportDialog, setShowImportDialog] = useState(false);

  const saveCurrentConfig = () => {
    const config = onExport();
    config.name = `Configuration ${new Date().toLocaleString()}`;
    setSavedConfigs(prev => [...prev, config]);
  };

  const loadConfig = (config: SimulationConfiguration) => {
    onImport(config);
    console.log(`📁 Loaded configuration: ${config.name}`);
  };

  const deleteConfig = (configId: string) => {
    setSavedConfigs(prev => prev.filter(c => c.id !== configId));
  };

  const exportToFile = () => {
    const config = onExport();
    let content: string;
    let filename: string;
    let mimeType: string;

    if (exportFormat === 'json') {
      content = JSON.stringify(config, null, 2);
      filename = `simulation-config-${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    } else {
      // Simple XML export
      content = `<?xml version="1.0" encoding="UTF-8"?>
<SimulationConfiguration>
  <Id>${config.id}</Id>
  <Name>${config.name}</Name>
  <Description>${config.description}</Description>
  <CreatedAt>${config.createdAt.toISOString()}</CreatedAt>
  <GlobalUpdateInterval>${config.globalUpdateInterval}</GlobalUpdateInterval>
  <Profiles>
    ${config.profiles.map(profile => `
    <Profile>
      <Id>${profile.id}</Id>
      <Name>${profile.name}</Name>
      <Type>${profile.type}</Type>
      <Duration>${profile.duration}</Duration>
      <NoiseLevel>${profile.noiseLevel}</NoiseLevel>
    </Profile>`).join('')}
  </Profiles>
  <Interactions>
    ${config.interactions.map(interaction => `
    <Interaction>
      <Id>${interaction.id}</Id>
      <Name>${interaction.name}</Name>
      <SourceParameter>${interaction.sourceParameter}</SourceParameter>
      <TargetParameter>${interaction.targetParameter}</TargetParameter>
      <Equation>${interaction.equation}</Equation>
      <Enabled>${interaction.enabled}</Enabled>
    </Interaction>`).join('')}
  </Interactions>
</SimulationConfiguration>`;
      filename = `simulation-config-${new Date().toISOString().split('T')[0]}.xml`;
      mimeType = 'application/xml';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importFromFile = () => {
    try {
      const config = JSON.parse(importData) as SimulationConfiguration;
      
      // Validate basic structure
      if (!config.id || !config.name || !Array.isArray(config.profiles)) {
        throw new Error('Invalid configuration format');
      }
      
      onImport(config);
      setImportData('');
      setShowImportDialog(false);
      console.log(`📁 Imported configuration: ${config.name}`);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import configuration. Please check the format.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
      setShowImportDialog(true);
    };
    reader.readAsText(file);
  };

  const sampleConfiguration = {
    id: 'sample_config',
    name: 'Sample Configuration',
    description: 'Example configuration for testing',
    profiles: [],
    interactions: [],
    faultScenarios: [],
    alarmRules: [],
    mlConfig: { enabled: false, sensitivity: 0.7, trainingData: [], detectedAnomalies: [] },
    communicationConfig: { latency: 0, packetLoss: 0, jitter: 0, enabled: false },
    devices: [],
    globalUpdateInterval: 1000,
    createdAt: new Date()
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration Management
        </CardTitle>
        <CardDescription>
          Save, load, and share simulation configurations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button onClick={saveCurrentConfig} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Current
          </Button>
          
          <Button onClick={exportToFile} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export File
          </Button>
          
          <label className="cursor-pointer">
            <Button variant="outline" className="w-full flex items-center gap-2" asChild>
              <span>
                <Upload className="h-4 w-4" />
                Import File
              </span>
            </Button>
            <input
              type="file"
              accept=".json,.xml"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          <Button 
            onClick={() => onImport(sampleConfiguration)}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Load Sample
          </Button>
        </div>

        <Separator />

        {/* Export Format Selection */}
        <div className="space-y-3">
          <h4 className="font-medium">Export Settings</h4>
          <div className="flex items-center gap-4">
            <span className="text-sm">Format:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={exportFormat === 'json' ? 'default' : 'outline'}
                onClick={() => setExportFormat('json')}
              >
                JSON
              </Button>
              <Button
                size="sm"
                variant={exportFormat === 'xml' ? 'default' : 'outline'}
                onClick={() => setExportFormat('xml')}
              >
                XML
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Saved Configurations */}
        <div className="space-y-3">
          <h4 className="font-medium">Saved Configurations</h4>
          
          {savedConfigs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Settings className="h-8 w-8 mx-auto mb-2" />
              <p>No saved configurations</p>
              <p className="text-sm">Save your current setup to reuse later</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedConfigs.map((config) => (
                <div key={config.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">{config.name}</div>
                      <div className="text-sm text-gray-600">
                        {config.description || 'No description'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {config.createdAt.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => loadConfig(config)}
                      >
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteConfig(config.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{config.profiles.length} profiles</Badge>
                    <Badge variant="outline">{config.interactions.length} interactions</Badge>
                    <Badge variant="outline">{config.faultScenarios.length} faults</Badge>
                    <Badge variant="outline">{config.alarmRules.length} alarms</Badge>
                    <Badge variant="outline">{config.devices.length} devices</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Import Dialog */}
        {showImportDialog && (
          <>
            <Separator />
            <div className="space-y-4 bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium">Import Configuration</h4>
              <Textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste configuration JSON here..."
                className="h-32 font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={importFromFile}>Import</Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowImportDialog(false);
                    setImportData('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Configuration Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Configuration Format</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• JSON format is recommended for easy sharing and editing</p>
            <p>• XML format provides structured markup for integration</p>
            <p>• Configurations include all profiles, interactions, faults, and settings</p>
            <p>• Import/export preserves all simulation parameters and thresholds</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurationPanel;
