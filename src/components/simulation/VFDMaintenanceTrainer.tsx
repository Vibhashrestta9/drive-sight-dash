
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Circle, Zap, AlertTriangle } from 'lucide-react';
import { TrainerChallenge, TrainerSession } from '@/types/vfdTypes';

interface VFDMaintenanceTrainerProps {
  vfd: any;
}

const VFDMaintenanceTrainer = ({ vfd }: VFDMaintenanceTrainerProps) => {
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<TrainerChallenge | null>(null);
  const [session, setSession] = useState<TrainerSession>({
    score: 0,
    challengesCompleted: 0,
    averageResponseTime: 0,
    correctDiagnoses: 0,
    startTime: new Date()
  });
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>('');
  const [challengeStartTime, setChallengeStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const challenges: TrainerChallenge[] = [
    {
      id: 'overvoltage',
      name: 'DC Bus Overvoltage',
      description: 'Drive shows F001 fault after starting. Motor was running normally before.',
      faultCodes: ['F001'],
      timeLimit: 60,
      difficulty: 'easy',
      points: 100
    },
    {
      id: 'overcurrent',
      name: 'Output Overcurrent',
      description: 'Drive trips immediately on start with F002. Check for possible causes.',
      faultCodes: ['F002'],
      timeLimit: 90,
      difficulty: 'medium',
      points: 150
    },
    {
      id: 'thermal',
      name: 'Thermal Protection',
      description: 'Drive shows F003 after running for extended period. Cooling fan seems normal.',
      faultCodes: ['F003'],
      timeLimit: 120,
      difficulty: 'medium',
      points: 150
    },
    {
      id: 'phase-loss',
      name: 'Input Phase Loss',
      description: 'Intermittent F004 faults occurring during operation. Power supply seems unstable.',
      faultCodes: ['F004'],
      timeLimit: 90,
      difficulty: 'hard',
      points: 200
    },
    {
      id: 'complex',
      name: 'Multiple Fault Scenario',
      description: 'Drive showing multiple faults: F001, F003, and high THD. Diagnose root cause.',
      faultCodes: ['F001', 'F003'],
      timeLimit: 180,
      difficulty: 'hard',
      points: 300
    }
  ];

  const diagnosisOptions = [
    'Input voltage too high',
    'Motor cable short circuit',
    'Blocked cooling airflow',
    'Loose input connections',
    'Motor overload',
    'Ambient temperature too high',
    'Input power quality issues',
    'Drive internal failure',
    'Incorrect motor parameters',
    'Filter capacitor failure'
  ];

  const correctDiagnoses = {
    'overvoltage': 'Input voltage too high',
    'overcurrent': 'Motor cable short circuit',
    'thermal': 'Blocked cooling airflow',
    'phase-loss': 'Loose input connections',
    'complex': 'Input power quality issues'
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTrainingActive && currentChallenge && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTrainingActive, currentChallenge, timeRemaining]);

  const startTraining = () => {
    setIsTrainingActive(true);
    setSession({
      score: 0,
      challengesCompleted: 0,
      averageResponseTime: 0,
      correctDiagnoses: 0,
      startTime: new Date()
    });
    startNextChallenge();
  };

  const startNextChallenge = () => {
    const availableChallenges = challenges.filter(c => 
      session.challengesCompleted < 5 // Limit to 5 challenges per session
    );
    
    if (availableChallenges.length === 0) {
      endTraining();
      return;
    }

    const challenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
    setCurrentChallenge(challenge);
    setChallengeStartTime(new Date());
    setTimeRemaining(challenge.timeLimit);
    setSelectedDiagnosis('');
    
    // Inject the fault(s) for this challenge
    challenge.faultCodes.forEach(code => {
      vfd.injectFault(code);
    });
  };

  const submitDiagnosis = () => {
    if (!currentChallenge || !challengeStartTime) return;

    const responseTime = (Date.now() - challengeStartTime.getTime()) / 1000;
    const correct = selectedDiagnosis === correctDiagnoses[currentChallenge.id as keyof typeof correctDiagnoses];
    
    let points = 0;
    if (correct) {
      points = currentChallenge.points;
      // Bonus points for quick response
      if (responseTime < currentChallenge.timeLimit * 0.5) {
        points += Math.floor(currentChallenge.points * 0.5);
      }
    }

    setSession(prev => ({
      ...prev,
      score: prev.score + points,
      challengesCompleted: prev.challengesCompleted + 1,
      correctDiagnoses: prev.correctDiagnoses + (correct ? 1 : 0),
      averageResponseTime: (prev.averageResponseTime * prev.challengesCompleted + responseTime) / (prev.challengesCompleted + 1)
    }));

    // Clear faults and show result
    vfd.clearFaults();
    
    setTimeout(() => {
      if (session.challengesCompleted < 4) {
        startNextChallenge();
      } else {
        endTraining();
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    if (currentChallenge) {
      submitDiagnosis(); // This will count as incorrect
    }
  };

  const endTraining = () => {
    setIsTrainingActive(false);
    setCurrentChallenge(null);
    vfd.clearFaults();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreGrade = () => {
    const accuracy = session.correctDiagnoses / Math.max(1, session.challengesCompleted) * 100;
    if (accuracy >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (accuracy >= 80) return { grade: 'A', color: 'text-green-600' };
    if (accuracy >= 70) return { grade: 'B', color: 'text-blue-600' };
    if (accuracy >= 60) return { grade: 'C', color: 'text-yellow-600' };
    return { grade: 'D', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Training Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            VFD Maintenance Trainer
            {isTrainingActive && (
              <Badge className="bg-blue-100 text-blue-800">
                <Circle className="h-3 w-3 mr-1 fill-current animate-pulse" />
                TRAINING ACTIVE
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isTrainingActive ? (
            <div className="text-center space-y-4">
              <div className="text-lg text-gray-700">
                Test your VFD troubleshooting skills with realistic fault scenarios
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 border rounded">
                  <div className="text-2xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-gray-600">Challenges</div>
                </div>
                <div className="p-4 border rounded">
                  <div className="text-2xl font-bold text-green-600">60-180s</div>
                  <div className="text-sm text-gray-600">Time Limits</div>
                </div>
                <div className="p-4 border rounded">
                  <div className="text-2xl font-bold text-purple-600">1000+</div>
                  <div className="text-sm text-gray-600">Max Points</div>
                </div>
              </div>
              <Button onClick={startTraining} className="bg-blue-600 hover:bg-blue-700">
                Start Training Session
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current Session Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded">
                  <div className="text-lg font-bold text-blue-600">{session.score}</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-lg font-bold text-green-600">{session.challengesCompleted}/5</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-lg font-bold text-purple-600">
                    {session.challengesCompleted > 0 ? (session.correctDiagnoses / session.challengesCompleted * 100).toFixed(0) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-lg font-bold text-orange-600">
                    {session.averageResponseTime.toFixed(0)}s
                  </div>
                  <div className="text-sm text-gray-600">Avg Time</div>
                </div>
              </div>

              <Button onClick={endTraining} variant="outline">
                End Training Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Challenge */}
      {currentChallenge && isTrainingActive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Challenge: {currentChallenge.name}
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(currentChallenge.difficulty)}>
                  {currentChallenge.difficulty.toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  {currentChallenge.points} pts
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Time Remaining */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Time Remaining</span>
                <span className={timeRemaining < 30 ? 'text-red-600 font-bold' : ''}>
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <Progress 
                value={(timeRemaining / currentChallenge.timeLimit) * 100} 
                className="h-2"
              />
            </div>

            {/* Challenge Description */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h4 className="font-medium mb-2">Scenario:</h4>
              <p className="text-sm">{currentChallenge.description}</p>
            </div>

            {/* Active Faults Display */}
            {vfd.activeFaults.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Active Faults:</h4>
                {vfd.activeFaults.map((fault, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
                    <Badge className="bg-red-600 text-white">{fault.code}</Badge>
                    <span className="text-sm">{fault.description}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Diagnosis Selection */}
            <div className="space-y-3">
              <h4 className="font-medium">Select the most likely root cause:</h4>
              <Select value={selectedDiagnosis} onValueChange={setSelectedDiagnosis}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your diagnosis..." />
                </SelectTrigger>
                <SelectContent>
                  {diagnosisOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={submitDiagnosis}
                disabled={!selectedDiagnosis}
                className="w-full"
              >
                Submit Diagnosis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training Results */}
      {!isTrainingActive && session.challengesCompleted > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Training Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreGrade().color}`}>
                {getScoreGrade().grade}
              </div>
              <div className="text-lg text-gray-700">Final Grade</div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded">
                <div className="text-2xl font-bold text-blue-600">{session.score}</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-2xl font-bold text-green-600">
                  {session.correctDiagnoses}/{session.challengesCompleted}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-2xl font-bold text-purple-600">
                  {(session.correctDiagnoses / session.challengesCompleted * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-2xl font-bold text-orange-600">
                  {session.averageResponseTime.toFixed(0)}s
                </div>
                <div className="text-sm text-gray-600">Avg Response</div>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={startTraining} className="bg-blue-600 hover:bg-blue-700">
                Start New Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VFDMaintenanceTrainer;
