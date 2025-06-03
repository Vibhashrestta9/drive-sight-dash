
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, Square, Plus, Trash2, TrendingUp } from 'lucide-react';
import { ParameterProfile } from '@/types/advancedSimulationTypes';

interface ParameterProfilesPanelProps {
  profiles: ParameterProfile[];
  currentProfile: ParameterProfile | null;
  isRunning: boolean;
  onProfilesChange: (profiles: ParameterProfile[]) => void;
  onStartSimulation: (profile: ParameterProfile) => void;
  onStopSimulation: () => void;
}

const ParameterProfilesPanel = ({
  profiles,
  currentProfile,
  isRunning,
  onProfilesChange,
  onStartSimulation,
  onStopSimulation
}: ParameterProfilesPanelProps) => {
  const [selectedProfile, setSelectedProfile] = useState<ParameterProfile | null>(null);
  const [editingProfile, setEditingProfile] = useState<ParameterProfile | null>(null);

  const profileTypes = [
    { value: 'ramp-up', label: 'Ramp Up' },
    { value: 'steady-state', label: 'Steady State' },
    { value: 'transient-spike', label: 'Transient Spike' },
    { value: 'cyclic', label: 'Cyclic' },
    { value: 'custom', label: 'Custom' }
  ];

  const createNewProfile = () => {
    const newProfile: ParameterProfile = {
      id: `profile_${Date.now()}`,
      name: 'New Profile',
      type: 'steady-state',
      duration: 300,
      parameters: {
        temperature: { min: 20, max: 80, pattern: [1] },
        power: { min: 0, max: 100, pattern: [1] }
      },
      noiseLevel: 0.1
    };
    setEditingProfile(newProfile);
  };

  const saveProfile = () => {
    if (!editingProfile) return;
    
    const existingIndex = profiles.findIndex(p => p.id === editingProfile.id);
    if (existingIndex >= 0) {
      const updatedProfiles = [...profiles];
      updatedProfiles[existingIndex] = editingProfile;
      onProfilesChange(updatedProfiles);
    } else {
      onProfilesChange([...profiles, editingProfile]);
    }
    setEditingProfile(null);
  };

  const deleteProfile = (profileId: string) => {
    onProfilesChange(profiles.filter(p => p.id !== profileId));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Dynamic Parameter Profiles
        </CardTitle>
        <CardDescription>
          Create and manage operational patterns for realistic simulation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Available Profiles</h4>
            <Button size="sm" onClick={createNewProfile}>
              <Plus className="h-4 w-4 mr-2" />
              New Profile
            </Button>
          </div>
          
          <div className="grid gap-3">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  currentProfile?.id === profile.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedProfile(profile)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{profile.name}</div>
                    <div className="text-sm text-gray-500">
                      {profile.type} • {profile.duration}s • Noise: {(profile.noiseLevel * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={profile.type === 'steady-state' ? 'default' : 'secondary'}>
                      {profile.type}
                    </Badge>
                    {currentProfile?.id === profile.id && isRunning && (
                      <Badge className="bg-green-100 text-green-800">Running</Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProfile(profile);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProfile(profile.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Profile Controls */}
        {selectedProfile && (
          <div className="space-y-4">
            <h4 className="font-medium">Profile Controls</h4>
            <div className="flex gap-2">
              <Button
                onClick={() => onStartSimulation(selectedProfile)}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Simulation
              </Button>
              <Button
                onClick={onStopSimulation}
                disabled={!isRunning}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="font-medium mb-2">{selectedProfile.name}</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Duration: {selectedProfile.duration} seconds</div>
                <div>Parameters: {Object.keys(selectedProfile.parameters).join(', ')}</div>
                <div>Noise Level: {(selectedProfile.noiseLevel * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Editor */}
        {editingProfile && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-4">Edit Profile</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={editingProfile.name}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={editingProfile.type}
                    onValueChange={(value: any) => setEditingProfile({
                      ...editingProfile,
                      type: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {profileTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Duration (seconds)</label>
                  <Input
                    type="number"
                    value={editingProfile.duration}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      duration: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Noise Level</label>
                  <Slider
                    value={[editingProfile.noiseLevel]}
                    onValueChange={([value]) => setEditingProfile({
                      ...editingProfile,
                      noiseLevel: value
                    })}
                    max={1}
                    step={0.01}
                    className="mt-2"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {(editingProfile.noiseLevel * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={saveProfile}>Save Profile</Button>
                <Button variant="outline" onClick={() => setEditingProfile(null)}>
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

export default ParameterProfilesPanel;
