
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, AlertTriangle, Clock, Zap } from 'lucide-react';
import { FaultScenario } from '@/types/advancedSimulationTypes';

interface FaultInjectionPanelProps {
  scenarios: FaultScenario[];
  activeFaults: string[];
  onScenariosChange: (scenarios: FaultScenario[]) => void;
}

const FaultInjectionPanel = ({ scenarios, activeFaults, onScenariosChange }: FaultInjectionPanelProps) => {
  const [editingScenario, setEditingScenario] = useState<FaultScenario | null>(null);

  const faultTypes = [
    { value: 'sensor-failure', label: 'Sensor Failure', icon: '🔧' },
    { value: 'communication-error', label: 'Communication Error', icon: '📡' },
    { value: 'overheating', label: 'Overheating', icon: '🌡️' },
    { value: 'shutdown', label: 'Emergency Shutdown', icon: '⛔' },
    { value: 'power-loss', label: 'Power Loss', icon: '⚡' }
  ];

  const parameters = ['temperature', 'power', 'vibration', 'speed', 'pressure', 'flow'];

  const createNewScenario = () => {
    const newScenario: FaultScenario = {
      id: `fault_${Date.now()}`,
      name: 'New Fault Scenario',
      type: 'sensor-failure',
      triggerCondition: 'temperature > 80',
      duration: 60,
      affectedParameters: ['temperature'],
      enabled: true
    };
    setEditingScenario(newScenario);
  };

  const saveScenario = () => {
    if (!editingScenario) return;
    
    const existingIndex = scenarios.findIndex(s => s.id === editingScenario.id);
    if (existingIndex >= 0) {
      const updated = [...scenarios];
      updated[existingIndex] = editingScenario;
      onScenariosChange(updated);
    } else {
      onScenariosChange([...scenarios, editingScenario]);
    }
    setEditingScenario(null);
  };

  const deleteScenario = (id: string) => {
    onScenariosChange(scenarios.filter(s => s.id !== id));
  };

  const toggleScenario = (id: string) => {
    const updated = scenarios.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    onScenariosChange(updated);
  };

  const triggerManualFault = (scenario: FaultScenario) => {
    console.log(`🚨 Manually triggering fault: ${scenario.name}`);
    // In real implementation, this would trigger the fault immediately
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Fault Injection & Scenario Testing
        </CardTitle>
        <CardDescription>
          Simulate fault conditions and test system responses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Faults Status */}
        {activeFaults.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Active Faults</h4>
            <div className="flex flex-wrap gap-2">
              {activeFaults.map(faultId => (
                <Badge key={faultId} className="bg-red-100 text-red-800">
                  {scenarios.find(s => s.id === faultId)?.name || faultId}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Scenarios List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Fault Scenarios</h4>
            <Button size="sm" onClick={createNewScenario}>
              <Plus className="h-4 w-4 mr-2" />
              Add Scenario
            </Button>
          </div>
          
          {scenarios.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No fault scenarios defined. Create one to test system resilience.
            </div>
          ) : (
            <div className="space-y-3">
              {scenarios.map((scenario) => {
                const faultType = faultTypes.find(t => t.value === scenario.type);
                const isActive = activeFaults.includes(scenario.id);
                
                return (
                  <div
                    key={scenario.id}
                    className={`border rounded-lg p-4 ${
                      isActive ? 'border-red-500 bg-red-50' :
                      scenario.enabled ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={scenario.enabled}
                          onCheckedChange={() => toggleScenario(scenario.id)}
                        />
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <span>{faultType?.icon}</span>
                            {scenario.name}
                            {isActive && <Badge className="bg-red-600 text-white">ACTIVE</Badge>}
                          </div>
                          <div className="text-sm text-gray-600">
                            {faultType?.label} • {scenario.duration}s duration
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => triggerManualFault(scenario)}
                          disabled={!scenario.enabled}
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Trigger
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingScenario(scenario)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteScenario(scenario.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Trigger:</span> {scenario.triggerCondition}
                      </div>
                      <div>
                        <span className="font-medium">Affects:</span> {scenario.affectedParameters.join(', ')}
                      </div>
                      {scenario.scheduledTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">Scheduled:</span> {scenario.scheduledTime.toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Scenario Editor */}
        {editingScenario && (
          <div className="border rounded-lg p-4 bg-orange-50">
            <h4 className="font-medium mb-4">Edit Fault Scenario</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Scenario Name</label>
                  <Input
                    value={editingScenario.name}
                    onChange={(e) => setEditingScenario({
                      ...editingScenario,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Fault Type</label>
                  <Select
                    value={editingScenario.type}
                    onValueChange={(value: any) => setEditingScenario({
                      ...editingScenario,
                      type: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {faultTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Trigger Condition</label>
                  <Input
                    value={editingScenario.triggerCondition}
                    onChange={(e) => setEditingScenario({
                      ...editingScenario,
                      triggerCondition: e.target.value
                    })}
                    placeholder="temperature > 80 || vibration > 5"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration (seconds)</label>
                  <Input
                    type="number"
                    value={editingScenario.duration}
                    onChange={(e) => setEditingScenario({
                      ...editingScenario,
                      duration: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Affected Parameters</label>
                <div className="grid grid-cols-3 gap-2">
                  {parameters.map(param => (
                    <label key={param} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingScenario.affectedParameters.includes(param)}
                        onChange={(e) => {
                          const affected = e.target.checked
                            ? [...editingScenario.affectedParameters, param]
                            : editingScenario.affectedParameters.filter(p => p !== param);
                          setEditingScenario({
                            ...editingScenario,
                            affectedParameters: affected
                          });
                        }}
                      />
                      <span className="text-sm">{param}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={saveScenario}>Save Scenario</Button>
                <Button variant="outline" onClick={() => setEditingScenario(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FaultInjectionPanel;
