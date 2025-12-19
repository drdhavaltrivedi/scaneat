/**
 * Shared health analysis rules and constants
 */

import { NutritionInfo, HealthConcern } from '../types/product';

// Nutri-Score thresholds (per 100g)
export const NUTRI_SCORE_THRESHOLDS = {
  // Points for negative nutrients (higher = worse)
  energy: [
    { max: 335, points: 0 },
    { max: 670, points: 1 },
    { max: 1005, points: 2 },
    { max: 1340, points: 3 },
    { max: 1675, points: 4 },
    { max: 2010, points: 5 },
    { max: 2345, points: 6 },
    { max: 2680, points: 7 },
    { max: 3015, points: 8 },
    { max: 3350, points: 9 },
    { max: Infinity, points: 10 },
  ],
  saturatedFat: [
    { max: 1, points: 0 },
    { max: 2, points: 1 },
    { max: 3, points: 2 },
    { max: 4, points: 3 },
    { max: 5, points: 4 },
    { max: 6, points: 5 },
    { max: 7, points: 6 },
    { max: 8, points: 7 },
    { max: 9, points: 8 },
    { max: 10, points: 9 },
    { max: Infinity, points: 10 },
  ],
  sugars: [
    { max: 4.5, points: 0 },
    { max: 9, points: 1 },
    { max: 13.5, points: 2 },
    { max: 18, points: 3 },
    { max: 22.5, points: 4 },
    { max: 27, points: 5 },
    { max: 31, points: 6 },
    { max: 36, points: 7 },
    { max: 40, points: 8 },
    { max: 45, points: 9 },
    { max: Infinity, points: 10 },
  ],
  salt: [
    { max: 0.3, points: 0 },
    { max: 0.6, points: 1 },
    { max: 0.9, points: 2 },
    { max: 1.2, points: 3 },
    { max: 1.5, points: 4 },
    { max: 1.8, points: 5 },
    { max: 2.1, points: 6 },
    { max: 2.4, points: 7 },
    { max: 2.7, points: 8 },
    { max: 3, points: 9 },
    { max: Infinity, points: 10 },
  ],
  // Points for positive nutrients (higher = better, negative points)
  fiber: [
    { min: 4.7, points: -5 },
    { min: 3.7, points: -4 },
    { min: 2.8, points: -3 },
    { min: 1.9, points: -2 },
    { min: 0.9, points: -1 },
    { min: 0, points: 0 },
  ],
  protein: [
    { min: 8, points: -5 },
    { min: 6.4, points: -4 },
    { min: 4.8, points: -3 },
    { min: 3.2, points: -2 },
    { min: 1.6, points: -1 },
    { min: 0, points: 0 },
  ],
};

// Health concern thresholds
export const HEALTH_CONCERN_THRESHOLDS = {
  sugar: {
    low: 5, // g per 100g
    moderate: 15,
    high: 22.5,
  },
  salt: {
    low: 0.3, // g per 100g
    moderate: 1.2,
    high: 2.4,
  },
  saturatedFat: {
    low: 1.5, // g per 100g
    moderate: 5,
    high: 10,
  },
  fiber: {
    low: 3, // g per 100g
    moderate: 6,
    high: 10,
  },
};

// Additive categories and concerns
export const ADDITIVE_CONCERNS: Record<string, { category: string; concern: HealthConcern }> = {
  // Preservatives
  'E200-E203': { category: 'Preservatives', concern: 'low' },
  'E210-E213': { category: 'Preservatives', concern: 'moderate' },
  'E220-E228': { category: 'Preservatives', concern: 'moderate' },
  'E249-E252': { category: 'Preservatives', concern: 'high' },
  
  // Artificial colors
  'E100-E199': { category: 'Artificial Colors', concern: 'moderate' },
  'E102': { category: 'Artificial Colors', concern: 'moderate' },
  'E104': { category: 'Artificial Colors', concern: 'moderate' },
  'E110': { category: 'Artificial Colors', concern: 'moderate' },
  'E122': { category: 'Artificial Colors', concern: 'moderate' },
  'E124': { category: 'Artificial Colors', concern: 'moderate' },
  'E129': { category: 'Artificial Colors', concern: 'moderate' },
  
  // Sweeteners
  'E950-E969': { category: 'Artificial Sweeteners', concern: 'moderate' },
  
  // Flavor enhancers
  'E620-E635': { category: 'Flavor Enhancers', concern: 'moderate' },
  'E621': { category: 'Flavor Enhancers', concern: 'moderate' }, // MSG
};

// NOVA classification descriptions
export const NOVA_DESCRIPTIONS = {
  1: 'Unprocessed or minimally processed foods',
  2: 'Processed culinary ingredients',
  3: 'Processed foods',
  4: 'Ultra-processed foods',
};

// Nutri-Score grade mapping
export const NUTRI_SCORE_GRADES: Record<string, { min: number; max: number; grade: string }> = {
  A: { min: -15, max: -1, grade: 'A' },
  B: { min: 0, max: 2, grade: 'B' },
  C: { min: 3, max: 10, grade: 'C' },
  D: { min: 11, max: 18, grade: 'D' },
  E: { min: 19, max: 40, grade: 'E' },
};

/**
 * Calculate Nutri-Score points
 */
export function calculateNutriScorePoints(nutrition: NutritionInfo): number {
  let points = 0;

  // Negative points (bad nutrients)
  if (nutrition.energy) {
    const energyThreshold = NUTRI_SCORE_THRESHOLDS.energy.find(
      (t) => nutrition.energy! <= t.max
    );
    points += energyThreshold?.points || 10;
  }

  if (nutrition.saturatedFat) {
    const fatThreshold = NUTRI_SCORE_THRESHOLDS.saturatedFat.find(
      (t) => nutrition.saturatedFat! <= t.max
    );
    points += fatThreshold?.points || 10;
  }

  if (nutrition.sugars) {
    const sugarThreshold = NUTRI_SCORE_THRESHOLDS.sugars.find(
      (t) => nutrition.sugars! <= t.max
    );
    points += sugarThreshold?.points || 10;
  }

  if (nutrition.salt) {
    const saltThreshold = NUTRI_SCORE_THRESHOLDS.salt.find(
      (t) => nutrition.salt! <= t.max
    );
    points += saltThreshold?.points || 10;
  }

  // Positive points (good nutrients, subtract from total)
  if (nutrition.fiber) {
    const fiberThreshold = NUTRI_SCORE_THRESHOLDS.fiber.find(
      (t) => nutrition.fiber! >= t.min
    );
    points += fiberThreshold?.points || 0;
  }

  if (nutrition.proteins) {
    const proteinThreshold = NUTRI_SCORE_THRESHOLDS.protein.find(
      (t) => nutrition.proteins! >= t.min
    );
    points += proteinThreshold?.points || 0;
  }

  return points;
}

/**
 * Get Nutri-Score grade from points
 */
export function getNutriScoreGrade(points: number): string {
  for (const [grade, range] of Object.entries(NUTRI_SCORE_GRADES)) {
    if (points >= range.min && points <= range.max) {
      return grade;
    }
  }
  return 'E';
}

/**
 * Determine health concern level for a nutrient
 */
export function getHealthConcern(
  nutrient: 'sugar' | 'salt' | 'saturatedFat' | 'fiber',
  value: number
): HealthConcern {
  const thresholds = HEALTH_CONCERN_THRESHOLDS[nutrient];
  
  if (nutrient === 'fiber') {
    // For fiber, higher is better
    if (value >= thresholds.high) return 'low';
    if (value >= thresholds.moderate) return 'moderate';
    if (value >= thresholds.low) return 'high';
    return 'very_high';
  } else {
    // For others, lower is better
    if (value <= thresholds.low) return 'low';
    if (value <= thresholds.moderate) return 'moderate';
    if (value <= thresholds.high) return 'high';
    return 'very_high';
  }
}

