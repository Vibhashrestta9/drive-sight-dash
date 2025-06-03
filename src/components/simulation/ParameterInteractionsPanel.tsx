
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Network, ArrowRight } from 'lucide-react';
import { ParameterInteraction } from '@/types/advancedSimulationTypes';

interface ParameterInteractionsPanelProps {
  interactions: ParameterInteraction[];
  onInteractionsChange: (interactions: ParameterInteraction[]) => void;
}

const ParameterInteractionsPanel = ({ interactions, onInteractionsChange }: ParameterInteractionsPanelProps) => {
  const [editingInteraction, setEditingInteraction] = useState<ParameterInteraction | null>(null);

  const parameters = ['temperature', 'power', 'vibration', 'speed', 'pressure', 'flow'];
  
  const presetEquations = [
    { name: 'Linear Increase', equation: 'target = source * 1.2 + 5' },
    { name: 'Exponential Growth', equation: 'target = source * Math.pow(1.1, source/10)' },
    { name: 'Inverse Relationship', equation: 'target = 100 - source' },
    { name: 'Proportional', equation: 'target = source * 0.8' },
    { name: 'Temperature to Power', equation: 'target = (source - 20) * 2 + 50' },
    { name: 'Speed to Vibration', equation: 'target = source / 500 + Math.random() * 0.5' }
  ];

  const createNewInteraction = () => {
    const newInteraction: ParameterInteraction = {
      id: `interaction_${Date.now()}`,
      name: 'New Interaction',
      sourceParameter: 'temperature',
      targetParameter: 'power',
      equation: 'target = source * 1.2',
      enabled: true
    };
    setEditingInteraction(newInteraction);
  };

  const saveInteraction = () => {
    if (!editingInteraction) return;
    
    const existingIndex = interactions.findIndex(i => i.id === editingInteraction.id);
    if (existingIndex >= 0) {
      const updated = [...interactions];
      updated[existingIndex] = editingInteraction;
      onInteractionsChange(updated);
    } else {
      onInteractionsChange([...interactions, editingInteraction]);
    }
    setEditingInteraction(null);
  };

  const deleteInteraction = (id: string) => {
    onInteractionsChange(interactions.filter(i => i.id !== id));
  };

  const toggleInteraction = (id: string) => {
    const updated = interactions.map(i => 
      i.id === id ? { ...i, enabled: !i.enabled } : i
    );
    onInteractionsChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Multi-Parameter Interactions
        </CardTitle>
        <CardDescription>
          Define how parameters influence each other during simulation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Interactions List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Active Interactions</h4>
            <Button size="sm" onClick={createNewInteraction}>
              <Plus className="h-4 w-4 mr-2" />
              Add Interaction
            </Button>
          </div>
          
          {interactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No interactions defined. Create one to simulate parameter dependencies.
            </div>
          ) : (
            <div className="space-y-3">
              {interactions.map((interaction) => (
                <div
                  key={interaction.id}
                  className={`border rounded-lg p-4 ${
                    interaction.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={interaction.enabled}
                        onCheckedChange={() => toggleInteraction(interaction.id)}
                      />
                      <div>
                        <div className="font-medium">{interaction.name}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline">{interaction.sourceParameter}</Badge>
                          <ArrowRight className="h-3 w-3" />
                          <Badge variant="outline">{interaction.targetParameter}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingInteraction(interaction)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteInteraction(interaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-white rounded border p-2 font-mono text-sm">
                    {interaction.equation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interaction Editor */}
        {editingInteraction && (
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium mb-4">Edit Interaction</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Interaction Name</label>
                <Input
                  value={editingInteraction.name}
                  onChange={(e) => setEditingInteraction({
                    ...editingInteraction,
                    name: e.target.value
                  })}
                  placeholder="Descriptive name for this interaction"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Source Parameter</label>
                  <Select
                    value={editingInteraction.sourceParameter}
                    onValueChange={(value) => setEditingInteraction({
                      ...editingInteraction,
                      sourceParameter: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {parameters.map(param => (
                        <SelectItem key={param} value={param}>
                          {param}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Target Parameter</label>
                  <Select
                    value={editingInteraction.targetParameter}
                    onValueChange={(value) => setEditingInteraction({
                      ...editingInteraction,
                      targetParameter: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {parameters.map(param => (
                        <SelectItem key={param} value={param}>
                          {param}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Equation</label>
                <Input
                  value={editingInteraction.equation}
                  onChange={(e) => setEditingInteraction({
                    ...editingInteraction,
                    equation: e.target.value
                  })}
                  placeholder="target = source * 1.2 + 10"
                  className="font-mono"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Use 'source' for the source parameter value and 'target' for the result
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Preset Equations</label>
                <div className="grid grid-cols-2 gap-2">
                  {presetEquations.map((preset, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingInteraction({
                        ...editingInteraction,
                        equation: preset.equation,
                        name: editingInteraction.name === 'New Interaction' ? preset.name : editingInteraction.name
                      })}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={saveInteraction}>Save Interaction</Button>
                <Button variant="outline" onClick={() => setEditingInteraction(null)}>
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

export default ParameterInteractionsPanel;
