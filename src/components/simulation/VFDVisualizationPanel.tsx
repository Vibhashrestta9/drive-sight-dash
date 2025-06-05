
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Monitor, Activity, Zap } from 'lucide-react';

interface VFDVisualizationPanelProps {
  vfd: any;
}

const VFDVisualizationPanel = ({ vfd }: VFDVisualizationPanelProps) => {
  // Generate vector scope data
  const vectorData = Array.from({ length: 360 }, (_, i) => ({
    angle: i,
    torque: vfd.state.torque * Math.cos((i * Math.PI) / 180),
    flux: vfd.state.torque * Math.sin((i * Math.PI) / 180)
  }));

  // Generate harmonics spectrum data
  const spectrumData = [
    { harmonic: 'Fundamental', magnitude: 100 },
    { harmonic: '3rd', magnitude: vfd.harmonics.h3 },
    { harmonic: '5th', magnitude: vfd.harmonics.h5 },
    { harmonic: '7th', magnitude: vfd.harmonics.h7 },
    { harmonic: '9th', magnitude: vfd.harmonics.h3 * 0.5 },
    { harmonic: '11th', magnitude: vfd.harmonics.h5 * 0.3 }
  ];

  // Generate V/F curve data
  const vfCurveData = Array.from({ length: 61 }, (_, i) => {
    const freq = i;
    let voltage = 0;
    
    switch (vfd.parameters.vfProfile) {
      case 'constant':
        voltage = (freq / 60) * 460;
        break;
      case 'variable-torque':
        voltage = Math.pow(freq / 60, 2) * 460;
        break;
      case 'sensorless-vector':
        voltage = (freq / 60) * 460 * (0.9 + 0.1 * Math.random());
        break;
    }
    
    return { frequency: freq, voltage: Math.max(0, voltage) };
  });

  return (
    <div className="space-y-6">
      {/* Vector Scope */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Vector Scope Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vectorData.slice(0, 36)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="torque" 
                  type="number"
                  domain={[-100, 100]}
                  label={{ value: 'Torque Component', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  dataKey="flux"
                  type="number"
                  domain={[-100, 100]}
                  label={{ value: 'Flux Component', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${typeof value === 'number' ? value.toFixed(1) : value}`, 
                    name === 'flux' ? 'Flux' : 'Torque'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="flux" 
                  stroke="#8884d8" 
                  dot={{ r: 2 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Real-time rotating field vector representation showing torque vs flux components
          </div>
        </CardContent>
      </Card>

      {/* FFT Spectrum Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            FFT Spectrum Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spectrumData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="harmonic"
                  label={{ value: 'Harmonic Order', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Magnitude (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value) => [
                    `${typeof value === 'number' ? value.toFixed(1) : value}%`, 
                    'Magnitude'
                  ]}
                />
                <Bar dataKey="magnitude" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Current harmonics spectrum showing distortion components
          </div>
        </CardContent>
      </Card>

      {/* V/F Characteristic Curve */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            V/F Characteristic Curve
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vfCurveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="frequency"
                  label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${typeof value === 'number' ? value.toFixed(1) : value} ${name === 'voltage' ? 'V' : 'Hz'}`, 
                    name === 'voltage' ? 'Voltage' : 'Frequency'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="voltage" 
                  stroke="#82ca9d" 
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Current V/F profile: {vfd.parameters.vfProfile.replace('-', ' ').toUpperCase()}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Waveforms */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Parameter Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded">
              <div className="text-lg font-bold text-blue-600">
                {vfd.state.dcBusVoltage.toFixed(0)}V
              </div>
              <div className="text-sm text-gray-600">DC Bus Voltage</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(vfd.state.dcBusVoltage / 800) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-lg font-bold text-green-600">
                {vfd.state.torque.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Motor Torque</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (vfd.state.torque / vfd.parameters.maxTorque) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-lg font-bold text-purple-600">
                {vfd.state.efficiency.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Efficiency</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${vfd.state.efficiency}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-lg font-bold text-orange-600">
                {vfd.cooling.fanSpeed.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Cooling Fan</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${vfd.cooling.fanSpeed}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VFDVisualizationPanel;
