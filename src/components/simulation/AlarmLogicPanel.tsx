
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Bell, Volume2, Mail, AlertTriangle } from 'lucide-react';
import { AlarmRule, AlarmAction } from '@/types/advancedSimulationTypes';

interface AlarmLogicPanelProps {
  rules: AlarmRule[];
  activeAlarms: string[];
  onRulesChange: (rules: AlarmRule[]) => void;
}

const AlarmLogicPanel = ({ rules, activeAlarms, onRulesChange }: AlarmLogicPanelProps) => {
  const [editingRule, setEditingRule] = useState<AlarmRule | null>(null);

  const actionTypes = [
    { value: 'notification', label: 'Show Notification', icon: Bell },
    { value: 'email', label: 'Send Email', icon: Mail },
    { value: 'buzzer', label: 'Sound Buzzer', icon: Volume2 },
    { value: 'shutdown', label: 'Emergency Shutdown', icon: AlertTriangle }
  ];

  const presetConditions = [
    'temperature > 75',
    'power > 95',
    'vibration > 4.5',
    'temperature > 70 && vibration > 3',
    'power > 90 || temperature > 80',
    'speed > 2000 && power < 50'
  ];

  const createNewRule = () => {
    const newRule: AlarmRule = {
      id: `alarm_${Date.now()}`,
      name: 'New Alarm Rule',
      condition: 'temperature > 75',
      severity: 'warning',
      actions: [{ type: 'notification', config: {} }],
      enabled: true
    };
    setEditingRule(newRule);
  };

  const saveRule = () => {
    if (!editingRule) return;
    
    const existingIndex = rules.findIndex(r => r.id === editingRule.id);
    if (existingIndex >= 0) {
      const updated = [...rules];
      updated[existingIndex] = editingRule;
      onRulesChange(updated);
    } else {
      onRulesChange([...rules, editingRule]);
    }
    setEditingRule(null);
  };

  const deleteRule = (id: string) => {
    onRulesChange(rules.filter(r => r.id !== id));
  };

  const toggleRule = (id: string) => {
    const updated = rules.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    onRulesChange(updated);
  };

  const addAction = (type: string) => {
    if (!editingRule) return;
    
    const newAction: AlarmAction = {
      type: type as any,
      config: {}
    };
    
    setEditingRule({
      ...editingRule,
      actions: [...editingRule.actions, newAction]
    });
  };

  const removeAction = (index: number) => {
    if (!editingRule) return;
    
    setEditingRule({
      ...editingRule,
      actions: editingRule.actions.filter((_, i) => i !== index)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Customizable Alarm Logic
        </CardTitle>
        <CardDescription>
          Define complex alarm conditions and automated responses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Alarms Status */}
        {activeAlarms.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Active Alarms
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeAlarms.map(alarmId => {
                const rule = rules.find(r => r.id === alarmId);
                return (
                  <Badge key={alarmId} className={`${
                    rule?.severity === 'critical' ? 'bg-red-600' : 'bg-orange-500'
                  } text-white`}>
                    {rule?.name || alarmId}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Rules List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Alarm Rules</h4>
            <Button size="sm" onClick={createNewRule}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
          
          {rules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No alarm rules defined. Create rules to monitor system conditions.
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => {
                const isActive = activeAlarms.includes(rule.id);
                
                return (
                  <div
                    key={rule.id}
                    className={`border rounded-lg p-4 ${
                      isActive ? 'border-red-500 bg-red-50' :
                      rule.enabled ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {rule.name}
                            <Badge className={`${
                              rule.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {rule.severity}
                            </Badge>
                            {isActive && <Badge className="bg-red-600 text-white animate-pulse">ACTIVE</Badge>}
                          </div>
                          <div className="text-sm text-gray-600 font-mono">
                            {rule.condition}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingRule(rule)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {rule.actions.map((action, index) => {
                        const actionType = actionTypes.find(t => t.value === action.type);
                        const Icon = actionType?.icon || bell;
                        return (
                          <Badge key={index} variant="outline">
                            <Icon className="h-3 w-3 mr-1" />
                            {actionType?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rule Editor */}
        {editingRule && (
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium mb-4">Edit Alarm Rule</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Rule Name</label>
                  <Input
                    value={editingRule.name}
                    onChange={(e) => setEditingRule({
                      ...editingRule,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Severity</label>
                  <Select
                    value={editingRule.severity}
                    onValueChange={(value: 'warning' | 'critical') => setEditingRule({
                      ...editingRule,
                      severity: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Condition</label>
                <Input
                  value={editingRule.condition}
                  onChange={(e) => setEditingRule({
                    ...editingRule,
                    condition: e.target.value
                  })}
                  placeholder="temperature > 75 && vibration > 3"
                  className="font-mono"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Use parameter names and operators: &gt;, &lt;, ==, !=, &amp;&amp;, ||
                </div>
                
                <div className="mt-2">
                  <label className="text-xs font-medium">Quick presets:</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {presetConditions.map((condition, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs"
                        onClick={() => setEditingRule({
                          ...editingRule,
                          condition
                        })}
                      >
                        {condition}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Actions</label>
                <div className="space-y-2">
                  {editingRule.actions.map((action, index) => {
                    const actionType = actionTypes.find(t => t.value === action.type);
                    const Icon = actionType?.icon || bell;
                    return (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <Icon className="h-4 w-4" />
                        <span className="flex-1">{actionType?.label}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeAction(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                  
                  <div className="grid grid-cols-2 gap-2">
                    {actionTypes.map(actionType => {
                      const Icon = actionType.icon;
                      return (
                        <Button
                          key={actionType.value}
                          size="sm"
                          variant="outline"
                          onClick={() => addAction(actionType.value)}
                          className="justify-start"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          Add {actionType.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={saveRule}>Save Rule</Button>
                <Button variant="outline" onClick={() => setEditingRule(null)}>
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

export default AlarmLogicPanel;
