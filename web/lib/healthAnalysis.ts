/**
 * Client-side health analysis
 * No backend needed - runs directly in the browser
 */

import { Product } from '../../shared/types/product';

interface HealthReason {
  type: 'positive' | 'negative' | 'warning';
  category: string;
  message: string;
  impact: number;
}

/**
 * Analyze product health and generate health score
 */
export function analyzeProductHealth(productData: any): any {
  const reasons: HealthReason[] = [];
  const recommendations: string[] = [];
  const warnings: string[] = [];

  let score = 100;

  // Analyze nutrition
  if (productData.nutrition) {
    const nutrition = productData.nutrition;
    
    // Check sugar
    if (nutrition.sugars !== undefined) {
      const concern = getHealthConcern('sugar', nutrition.sugars);
      if (concern === 'high' || concern === 'very_high') {
        const impact = concern === 'very_high' ? -15 : -10;
        score += impact;
        reasons.push({
          type: 'negative',
          category: 'sugar',
          message: `High sugar content: ${nutrition.sugars}g per 100g`,
          impact,
        });
        warnings.push(`High sugar: ${nutrition.sugars}g per 100g`);
      } else if (concern === 'low') {
        reasons.push({
          type: 'positive',
          category: 'sugar',
          message: `Low sugar content: ${nutrition.sugars}g per 100g`,
          impact: 5,
        });
      }
    }

    // Check salt
    if (nutrition.salt !== undefined) {
      const concern = getHealthConcern('salt', nutrition.salt);
      if (concern === 'high' || concern === 'very_high') {
        const impact = concern === 'very_high' ? -15 : -10;
        score += impact;
        reasons.push({
          type: 'negative',
          category: 'salt',
          message: `High salt content: ${nutrition.salt}g per 100g`,
          impact,
        });
        warnings.push(`High salt: ${nutrition.salt}g per 100g`);
      } else if (concern === 'low') {
        reasons.push({
          type: 'positive',
          category: 'salt',
          message: `Low salt content: ${nutrition.salt}g per 100g`,
          impact: 5,
        });
      }
    }

    // Check saturated fat
    if (nutrition.saturatedFat !== undefined) {
      const concern = getHealthConcern('saturatedFat', nutrition.saturatedFat);
      if (concern === 'high' || concern === 'very_high') {
        const impact = concern === 'very_high' ? -12 : -8;
        score += impact;
        reasons.push({
          type: 'negative',
          category: 'saturatedFat',
          message: `High saturated fat: ${nutrition.saturatedFat}g per 100g`,
          impact,
        });
      }
    }

    // Check fiber
    if (nutrition.fiber !== undefined) {
      const concern = getHealthConcern('fiber', nutrition.fiber);
      if (concern === 'low') {
        reasons.push({
          type: 'positive',
          category: 'fiber',
          message: `Good fiber content: ${nutrition.fiber}g per 100g`,
          impact: 8,
        });
      } else if (concern === 'very_high') {
        reasons.push({
          type: 'negative',
          category: 'fiber',
          message: `Low fiber content: ${nutrition.fiber}g per 100g`,
          impact: -5,
        });
      }
    }

    // Check protein
    if (nutrition.proteins !== undefined && nutrition.proteins > 10) {
      reasons.push({
        type: 'positive',
        category: 'protein',
        message: `Good protein content: ${nutrition.proteins}g per 100g`,
        impact: 5,
      });
    }
  }

  // Analyze additives
  if (productData.additives && productData.additives.length > 0) {
    productData.additives.forEach((additive: any) => {
      const concern = getAdditiveConcern(additive.code);
      if (concern === 'high' || concern === 'very_high') {
        const impact = concern === 'very_high' ? -8 : -5;
        score += impact;
        reasons.push({
          type: 'warning',
          category: 'additives',
          message: `Contains ${additive.code}: ${additive.name}`,
          impact,
        });
        if (concern === 'very_high') {
          warnings.push(`Contains concerning additive: ${additive.code}`);
        }
      }
    });
  }

  // Analyze NOVA group
  if (productData.novaGroup) {
    switch (productData.novaGroup) {
      case 1:
        reasons.push({
          type: 'positive',
          category: 'processing',
          message: 'Unprocessed or minimally processed food',
          impact: 10,
        });
        break;
      case 2:
        reasons.push({
          type: 'positive',
          category: 'processing',
          message: 'Processed culinary ingredients',
          impact: 5,
        });
        break;
      case 3:
        score -= 10;
        reasons.push({
          type: 'warning',
          category: 'processing',
          message: 'Processed food',
          impact: -10,
        });
        break;
      case 4:
        score -= 20;
        reasons.push({
          type: 'negative',
          category: 'processing',
          message: 'Ultra-processed food',
          impact: -20,
        });
        warnings.push('Ultra-processed food');
        break;
    }
  }

  // Generate recommendations
  if (score >= 80) {
    recommendations.push('This product is generally healthy and can be part of a balanced diet.');
  } else if (score >= 65) {
    recommendations.push('This product can be consumed in moderation.');
  } else {
    recommendations.push('Consider limiting consumption of this product.');
  }

  // Determine grade
  let grade: 'excellent' | 'good' | 'moderate' | 'poor' | 'avoid';
  if (score >= 80) grade = 'excellent';
  else if (score >= 65) grade = 'good';
  else if (score >= 50) grade = 'moderate';
  else if (score >= 35) grade = 'poor';
  else grade = 'avoid';

  return {
    score: Math.max(0, Math.min(100, score)),
    grade,
    nutriScore: productData.nutriScore,
    novaGroup: productData.novaGroup,
    reasons,
    recommendations,
    warnings,
    updatedAt: new Date(),
  };
}

/**
 * Get health concern level for a nutrient
 */
function getHealthConcern(nutrient: string, value: number): 'low' | 'moderate' | 'high' | 'very_high' {
  switch (nutrient) {
    case 'sugar':
      if (value < 5) return 'low';
      if (value < 10) return 'moderate';
      if (value < 20) return 'high';
      return 'very_high';
    case 'salt':
      if (value < 0.3) return 'low';
      if (value < 1.5) return 'moderate';
      if (value < 3) return 'high';
      return 'very_high';
    case 'saturatedFat':
      if (value < 5) return 'low';
      if (value < 10) return 'moderate';
      if (value < 15) return 'high';
      return 'very_high';
    case 'fiber':
      if (value < 3) return 'very_high'; // Low fiber is bad
      if (value < 6) return 'high';
      if (value < 10) return 'moderate';
      return 'low'; // High fiber is good
    default:
      return 'moderate';
  }
}

/**
 * Get health concern for additives
 */
function getAdditiveConcern(code: string): 'low' | 'moderate' | 'high' | 'very_high' {
  // Common concerning additives
  const highConcern = ['E102', 'E104', 'E110', 'E122', 'E124', 'E129', 'E211', 'E621'];
  const veryHighConcern = ['E951', 'E952', 'E954'];
  
  if (veryHighConcern.includes(code)) return 'very_high';
  if (highConcern.includes(code)) return 'high';
  return 'moderate';
}

