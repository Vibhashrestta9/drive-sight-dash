
/**
 * Drive Personality Modeling (Behavioral Fingerprint) Utility
 * 
 * Captures unique behavioral characteristics of each drive based on:
 * - Startup sequence patterns
 * - Load response curves
 * - Idle signature
 * - Transition behaviors
 * - Error recovery patterns
 */

import { RMDEDrive } from './rmdeUtils';

export interface BehavioralMetrics {
  startupDuration: number; // Time in ms to reach stable operation
  startupPattern: 'smooth' | 'stepped' | 'oscillating' | 'irregular';
  loadResponseTime: number; // Time in ms to adjust to load changes
  loadStability: number; // 0-100 consistency under varying loads
  idleSignature: {
    powerVariance: number; // Standard deviation of power at idle
    temperatureVariance: number; // Standard deviation of temp at idle
    microvibrationPattern: string; // Encoded pattern of microvibrations
  };
  transitionBehavior: {
    accelerationCurve: string; // Encoded acceleration pattern
    decelerationCurve: string; // Encoded deceleration pattern
    overshootTendency: number; // 0-100 tendency to overshoot target
  };
  errorRecoveryProfile: {
    recoveryTime: number; // Average time to recover in ms
    recoveryPattern: 'quick' | 'gradual' | 'oscillating' | 'requiring-reset';
    reoccurrenceRate: number; // % chance error repeats after recovery
  };
  operationalFingerprint: string; // Hashed representation of all behaviors
}

export interface BehavioralDeviation {
  metric: string;
  expected: number | string;
  actual: number | string;
  percentDeviation: number;
  significance: 'normal' | 'notable' | 'significant' | 'critical';
  timestamp: string;
}

export interface BehavioralFingerprint {
  driveId: number;
  driveName: string;
  baselineDate: string;
  lastUpdated: string;
  confidenceScore: number; // 0-100 confidence in fingerprint accuracy
  metrics: BehavioralMetrics;
  recentDeviations: BehavioralDeviation[];
  matchScore: number; // 0-100 match to baseline behavior
  anomalyScore: number; // 0-100 anomaly level
}

/**
 * Generate a mock behavioral fingerprint for a drive
 */
export const generateMockFingerprint = (drive: RMDEDrive): BehavioralFingerprint => {
  // Generate different fingerprints based on drive health
  const isHealthy = drive.healthScore >= 80;
  const hasWarnings = drive.healthScore < 80 && drive.healthScore >= 60;
  const hasCriticalIssues = drive.healthScore < 60;
  
  // Generate a consistent but unique fingerprint hash for each drive
  const fingerprintHash = generateFingerprintHash(drive.id);
  
  // Base metrics for a healthy drive
  const baseMetrics: BehavioralMetrics = {
    startupDuration: isHealthy ? 
      randomRange(800, 1200) : 
      hasCriticalIssues ? 
        randomRange(1800, 2500) : 
        randomRange(1300, 1700),
    startupPattern: isHealthy ? 
      'smooth' : 
      hasCriticalIssues ? 
        'irregular' : 
        (Math.random() > 0.5 ? 'stepped' : 'oscillating'),
    loadResponseTime: isHealthy ? 
      randomRange(120, 200) : 
      hasCriticalIssues ? 
        randomRange(350, 500) : 
        randomRange(220, 340),
    loadStability: isHealthy ? 
      randomRange(85, 98) : 
      hasCriticalIssues ? 
        randomRange(40, 65) : 
        randomRange(66, 84),
    idleSignature: {
      powerVariance: isHealthy ? 
        randomFloat(0.1, 0.5) : 
        hasCriticalIssues ? 
          randomFloat(1.5, 3.0) : 
          randomFloat(0.6, 1.4),
      temperatureVariance: isHealthy ? 
        randomFloat(0.3, 0.8) : 
        hasCriticalIssues ? 
          randomFloat(2.0, 4.0) : 
          randomFloat(0.9, 1.9),
      microvibrationPattern: fingerprintHash.substring(0, 8)
    },
    transitionBehavior: {
      accelerationCurve: fingerprintHash.substring(8, 16),
      decelerationCurve: fingerprintHash.substring(16, 24),
      overshootTendency: isHealthy ? 
        randomRange(5, 15) : 
        hasCriticalIssues ? 
          randomRange(40, 80) : 
          randomRange(16, 39)
    },
    errorRecoveryProfile: {
      recoveryTime: isHealthy ? 
        randomRange(100, 300) : 
        hasCriticalIssues ? 
          randomRange(800, 1500) : 
          randomRange(301, 799),
      recoveryPattern: isHealthy ? 
        'quick' : 
        hasCriticalIssues ? 
          'requiring-reset' : 
          (Math.random() > 0.5 ? 'gradual' : 'oscillating'),
      reoccurrenceRate: isHealthy ? 
        randomRange(1, 5) : 
        hasCriticalIssues ? 
          randomRange(30, 70) : 
          randomRange(6, 29)
    },
    operationalFingerprint: fingerprintHash
  };
  
  // Generate recent deviations based on drive health
  const deviationCount = isHealthy ? 
    Math.floor(Math.random() * 2) : 
    hasCriticalIssues ? 
      Math.floor(Math.random() * 5) + 3 : 
      Math.floor(Math.random() * 3) + 1;
  
  const recentDeviations: BehavioralDeviation[] = [];
  
  for (let i = 0; i < deviationCount; i++) {
    // Pick a random metric to show deviation
    const metricKeys = [
      'startupDuration',
      'loadResponseTime',
      'loadStability',
      'powerVariance',
      'temperatureVariance',
      'overshootTendency',
      'recoveryTime',
      'reoccurrenceRate'
    ];
    
    const metric = metricKeys[Math.floor(Math.random() * metricKeys.length)];
    let expected: number, actual: number;
    
    // Determine expected vs actual values based on the metric
    switch(metric) {
      case 'startupDuration':
        expected = 1000;
        actual = baseMetrics.startupDuration;
        break;
      case 'loadResponseTime':
        expected = 150;
        actual = baseMetrics.loadResponseTime;
        break;
      case 'loadStability':
        expected = 90;
        actual = baseMetrics.loadStability;
        break;
      case 'powerVariance':
        expected = 0.3;
        actual = baseMetrics.idleSignature.powerVariance;
        break;
      case 'temperatureVariance':
        expected = 0.5;
        actual = baseMetrics.idleSignature.temperatureVariance;
        break;
      case 'overshootTendency':
        expected = 10;
        actual = baseMetrics.transitionBehavior.overshootTendency;
        break;
      case 'recoveryTime':
        expected = 200;
        actual = baseMetrics.errorRecoveryProfile.recoveryTime;
        break;
      case 'reoccurrenceRate':
        expected = 3;
        actual = baseMetrics.errorRecoveryProfile.reoccurrenceRate;
        break;
      default:
        expected = 0;
        actual = 0;
    }
    
    // Calculate percent deviation
    const percentDeviation = Math.abs(((actual - expected) / expected) * 100);
    
    // Determine significance based on deviation percentage
    let significance: 'normal' | 'notable' | 'significant' | 'critical';
    if (percentDeviation <= 10) significance = 'normal';
    else if (percentDeviation <= 25) significance = 'notable';
    else if (percentDeviation <= 50) significance = 'significant';
    else significance = 'critical';
    
    // Create timestamps within the last week
    const timestamp = new Date(
      Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
    ).toISOString();
    
    recentDeviations.push({
      metric,
      expected,
      actual,
      percentDeviation: Number(percentDeviation.toFixed(1)),
      significance,
      timestamp
    });
  }
  
  // Calculate match score (how well current behavior matches baseline)
  const matchScore = isHealthy ? 
    randomRange(90, 98) : 
    hasCriticalIssues ? 
      randomRange(40, 65) : 
      randomRange(66, 89);
  
  // Calculate anomaly score (inverse of match score with some randomness)
  const anomalyScore = Math.min(100, Math.max(0, 
    100 - matchScore + (Math.random() * 10 - 5)
  ));
  
  return {
    driveId: drive.id,
    driveName: drive.name,
    baselineDate: new Date(
      Date.now() - randomRange(30, 180) * 24 * 60 * 60 * 1000
    ).toISOString().split('T')[0],
    lastUpdated: new Date(
      Date.now() - randomRange(0, 24) * 60 * 60 * 1000
    ).toISOString(),
    confidenceScore: isHealthy ? 
      randomRange(85, 98) : 
      hasCriticalIssues ? 
        randomRange(50, 70) : 
        randomRange(71, 84),
    metrics: baseMetrics,
    recentDeviations: recentDeviations.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ),
    matchScore,
    anomalyScore
  };
};

/**
 * Generate a predictable fingerprint hash based on drive ID
 * This ensures the same drive gets the same fingerprint each time
 */
const generateFingerprintHash = (driveId: number): string => {
  const baseHash = 'abcdef0123456789';
  let result = '';
  const seed = driveId * 10007; // Use a prime number to create variation
  
  for (let i = 0; i < 32; i++) {
    const charIndex = (seed * (i + 1)) % baseHash.length;
    result += baseHash[charIndex];
  }
  
  return result;
};

/**
 * Generate a random number within a range
 */
const randomRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate a random float within a range
 */
const randomFloat = (min: number, max: number): number => {
  return Number((Math.random() * (max - min) + min).toFixed(2));
};

/**
 * Get significance color class
 */
export const getSignificanceColorClass = (significance: string): string => {
  switch (significance) {
    case 'normal':
      return 'text-green-500';
    case 'notable':
      return 'text-blue-500';
    case 'significant':
      return 'text-yellow-500';
    case 'critical':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

/**
 * Describe behavior match level
 */
export const getBehaviorMatchDescription = (matchScore: number): string => {
  if (matchScore >= 90) return 'Perfectly Normal';
  if (matchScore >= 80) return 'Slightly Deviated';
  if (matchScore >= 70) return 'Moderately Deviated';
  if (matchScore >= 60) return 'Significantly Deviated';
  if (matchScore >= 40) return 'Critically Deviated';
  return 'Completely Abnormal';
};

/**
 * Get color class for match score
 */
export const getMatchScoreColorClass = (score: number): string => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 70) return 'bg-yellow-500';
  if (score >= 60) return 'bg-orange-500';
  return 'bg-red-500';
};

