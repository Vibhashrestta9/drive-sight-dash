
/**
 * Drive Health Index (DHI) Utility
 * 
 * A standardized scoring system (0-100) for motor health based on multiple metrics:
 * - Temperature performance
 * - Power efficiency
 * - Operating hours vs expected lifespan
 * - Error frequency and severity
 * - Performance consistency
 */

import { RMDEDrive, RMDEError } from './rmdeUtils';

// Weights for different factors in DHI calculation
export interface DHIWeights {
  temperature: number;
  powerEfficiency: number;
  operatingHoursRatio: number;
  errorSeverity: number;
  performanceConsistency: number;
}

// Default weights for DHI calculation
export const DEFAULT_DHI_WEIGHTS: DHIWeights = {
  temperature: 0.2,    // 20% weight
  powerEfficiency: 0.25,    // 25% weight
  operatingHoursRatio: 0.15,    // 15% weight
  errorSeverity: 0.25,    // 25% weight
  performanceConsistency: 0.15     // 15% weight
};

// Reference values for optimal performance
const REFERENCE_VALUES = {
  optimalTemperature: 45, // °C
  maxTemperature: 70, // °C
  minPowerEfficiency: 70, // %
  maxPowerEfficiency: 98, // %
  expectedLifespan: 10000, // hours
  maxErrorScore: 10, // arbitrary scale
};

/**
 * Calculate temperature score (0-100)
 * Optimal temperature gets 100, higher temperatures get lower scores
 */
const calculateTemperatureScore = (temperature: number): number => {
  if (temperature <= REFERENCE_VALUES.optimalTemperature) return 100;
  
  if (temperature >= REFERENCE_VALUES.maxTemperature) return 0;
  
  // Linear interpolation between optimal and max temperature
  return 100 * (1 - (temperature - REFERENCE_VALUES.optimalTemperature) / 
    (REFERENCE_VALUES.maxTemperature - REFERENCE_VALUES.optimalTemperature));
};

/**
 * Calculate power efficiency score (0-100)
 */
const calculateEfficiencyScore = (efficiency: number): number => {
  // Normalize between min and max efficiency
  return Math.max(0, Math.min(100, 
    (efficiency - REFERENCE_VALUES.minPowerEfficiency) * 100 / 
    (REFERENCE_VALUES.maxPowerEfficiency - REFERENCE_VALUES.minPowerEfficiency)
  ));
};

/**
 * Calculate operating hours score (0-100)
 * New motors get higher scores, scores decrease as they age
 */
const calculateOperatingHoursScore = (hours: number): number => {
  const lifeRatio = hours / REFERENCE_VALUES.expectedLifespan;
  
  // Exponential decay: newer motors score higher
  return 100 * Math.exp(-3 * lifeRatio);
};

/**
 * Calculate error severity score (0-100)
 * Motors with fewer and less severe errors get higher scores
 */
const calculateErrorScore = (errors: RMDEError[]): number => {
  if (errors.length === 0) return 100;
  
  let errorScore = 0;
  
  for (const error of errors) {
    const severityWeight = 
      error.severity === 'critical' ? 10 :
      error.severity === 'high' ? 6 :
      error.severity === 'medium' ? 3 : 1;
    
    // Resolved errors have less impact
    const resolutionFactor = error.resolved ? 0.3 : 1;
    
    errorScore += severityWeight * resolutionFactor;
  }
  
  // Cap the error score at max value
  errorScore = Math.min(errorScore, REFERENCE_VALUES.maxErrorScore);
  
  // Convert to 0-100 scale (inverted - higher error score means lower health score)
  return 100 * (1 - errorScore / REFERENCE_VALUES.maxErrorScore);
};

/**
 * Calculate performance consistency score (0-100)
 * This is a placeholder for ML-based consistency scoring
 * In a real implementation, this would analyze patterns in time-series data
 */
const calculateConsistencyScore = (drive: RMDEDrive): number => {
  // Placeholder implementation - in reality would use ML model
  // For now, using a simplistic model based on status and health
  switch (drive.status) {
    case 'online':
      return 90 + Math.random() * 10; // 90-100
    case 'warning':
      return 70 + Math.random() * 20; // 70-90
    case 'error':
      return 40 + Math.random() * 30; // 40-70
    case 'offline':
      return Math.random() * 40; // 0-40
    default:
      return 50;
  }
};

/**
 * Calculate overall Drive Health Index (DHI) score
 * Returns a score from 0-100 where higher is better
 */
export const calculateDHI = (
  drive: RMDEDrive, 
  weights: DHIWeights = DEFAULT_DHI_WEIGHTS
): number => {
  // Calculate individual component scores
  const temperatureScore = calculateTemperatureScore(drive.temperature);
  const efficiencyScore = calculateEfficiencyScore(drive.efficiency);
  const operatingHoursScore = calculateOperatingHoursScore(drive.operatingHours);
  const errorScore = calculateErrorScore(drive.errors);
  const consistencyScore = calculateConsistencyScore(drive);
  
  // Calculate weighted score
  const weightedScore = 
    temperatureScore * weights.temperature +
    efficiencyScore * weights.powerEfficiency +
    operatingHoursScore * weights.operatingHoursRatio +
    errorScore * weights.errorSeverity +
    consistencyScore * weights.performanceConsistency;
  
  // Round to nearest integer
  return Math.round(weightedScore);
};

/**
 * Get DHI status classification
 */
export const getDHIStatus = (dhiScore: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' => {
  if (dhiScore >= 90) return 'excellent';
  if (dhiScore >= 75) return 'good';
  if (dhiScore >= 60) return 'fair';
  if (dhiScore >= 40) return 'poor';
  return 'critical';
};

/**
 * Get DHI status color class
 */
export const getDHIStatusColor = (dhiScore: number): string => {
  const status = getDHIStatus(dhiScore);
  
  switch (status) {
    case 'excellent': return 'bg-green-500';
    case 'good': return 'bg-emerald-500';
    case 'fair': return 'bg-yellow-500';
    case 'poor': return 'bg-orange-500';
    case 'critical': return 'bg-red-500';
  }
};

/**
 * Generate a simple explanation of DHI score
 */
export const explainDHIScore = (drive: RMDEDrive, dhiScore: number): string => {
  const status = getDHIStatus(dhiScore);
  
  // Base explanation
  let explanation = `Drive health is ${status} at ${dhiScore}/100.`;
  
  // Add details based on primary factors
  if (drive.temperature > 60) {
    explanation += ` Temperature (${drive.temperature}°C) is higher than optimal.`;
  }
  
  if (drive.efficiency < 80) {
    explanation += ` Power efficiency (${drive.efficiency}%) is below target.`;
  }
  
  if (drive.operatingHours > 5000) {
    explanation += ` Operating hours (${Math.floor(drive.operatingHours)}h) suggest aging hardware.`;
  }
  
  const criticalErrors = drive.errors.filter(e => e.severity === 'critical' && !e.resolved).length;
  if (criticalErrors > 0) {
    explanation += ` ${criticalErrors} unresolved critical errors detected.`;
  }
  
  return explanation;
};
