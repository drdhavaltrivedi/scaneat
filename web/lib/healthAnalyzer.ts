import {
  Product,
  HealthScore,
  HealthReason,
  NutritionInfo,
  Ingredient,
  Additive,
  HealthConcern,
} from '../../shared/types/product';
import {
  calculateNutriScorePoints,
  getNutriScoreGrade,
  getHealthConcern,
  ADDITIVE_CONCERNS,
  NOVA_DESCRIPTIONS,
} from '../../shared/utils/healthRules';

/**
 * Analyze product health and generate health score
 */
export function analyzeProductHealth(product: Partial<Product>): HealthScore {
  const reasons: HealthReason[] = [];
  const recommendations: string[] = [];
  const warnings: string[] = [];

  let score = 100; // Start with perfect score, deduct points for issues

  // Analyze nutrition
  if (product.nutrition) {
    const nutritionScore = analyzeNutrition(product.nutrition, reasons, warnings);
    score = Math.min(score, nutritionScore);
  }

  // Analyze ingredients
  if (product.ingredients) {
    const ingredientScore = analyzeIngredients(
      product.ingredients,
      reasons,
      warnings,
      recommendations
    );
    score = Math.min(score, ingredientScore);
  }

  // Analyze additives
  if (product.additives && product.additives.length > 0) {
    const additiveScore = analyzeAdditives(product.additives, reasons, warnings);
    score = Math.min(score, additiveScore);
  }

  // Analyze NOVA group (processing level)
  if (product.novaGroup) {
    const novaScore = analyzeNovaGroup(product.novaGroup, reasons, warnings);
    score = Math.min(score, novaScore);
  }

  // Use Nutri-Score if available
  let nutriScore = product.nutriScore;
  if (!nutriScore && product.nutrition) {
    const points = calculateNutriScorePoints(product.nutrition);
    nutriScore = getNutriScoreGrade(points);
  }

  // Determine grade
  const grade = getHealthGrade(score);

  // Generate recommendations based on analysis
  generateRecommendations(product, recommendations, warnings);

  return {
    score: Math.max(0, Math.min(100, score)),
    grade,
    nutriScore,
    novaGroup: product.novaGroup,
    reasons,
    recommendations,
    warnings,
  };
}

/**
 * Analyze nutrition information
 */
function analyzeNutrition(
  nutrition: NutritionInfo,
  reasons: HealthReason[],
  warnings: string[]
): number {
  let score = 100;

  // Check sugar content
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
      warnings.push(`This product contains ${nutrition.sugars}g of sugar per 100g, which is considered high.`);
    } else if (concern === 'low') {
      reasons.push({
        type: 'positive',
        category: 'sugar',
        message: `Low sugar content: ${nutrition.sugars}g per 100g`,
        impact: 5,
      });
    }
  }

  // Check salt content
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
      warnings.push(`This product contains ${nutrition.salt}g of salt per 100g, which exceeds recommended daily intake.`);
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

  // Check fiber content (positive)
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

  // Check protein content (positive)
  if (nutrition.proteins !== undefined && nutrition.proteins > 10) {
    reasons.push({
      type: 'positive',
      category: 'protein',
      message: `Good protein content: ${nutrition.proteins}g per 100g`,
      impact: 5,
    });
  }

  return score;
}

/**
 * Analyze ingredients
 */
function analyzeIngredients(
  ingredients: Ingredient[],
  reasons: HealthReason[],
  warnings: string[],
  recommendations: string[]
): number {
  let score = 100;

  // Check for artificial ingredients
  const artificialKeywords = [
    'artificial',
    'synthetic',
    'processed',
    'hydrogenated',
    'partially hydrogenated',
  ];

  let artificialCount = 0;
  ingredients.forEach((ing) => {
    const nameLower = ing.name.toLowerCase();
    if (artificialKeywords.some((keyword) => nameLower.includes(keyword))) {
      artificialCount++;
    }
  });

  if (artificialCount > 0) {
    const impact = -artificialCount * 3;
    score += impact;
    reasons.push({
      type: 'negative',
      category: 'ingredients',
      message: `Contains ${artificialCount} artificial or processed ingredient(s)`,
      impact,
    });
  }

  // Check ingredient list length (shorter is generally better)
  if (ingredients.length > 15) {
    reasons.push({
      type: 'warning',
      category: 'ingredients',
      message: `Long ingredient list (${ingredients.length} ingredients) - may indicate high processing`,
      impact: -5,
    });
    score -= 5;
  }

  // Check for allergens
  const allergens = ingredients.filter((ing) => ing.allergen);
  if (allergens.length > 0) {
    warnings.push(`This product contains allergens: ${allergens.map((a) => a.name).join(', ')}`);
  }

  return score;
}

/**
 * Analyze additives
 */
function analyzeAdditives(
  additives: Additive[],
  reasons: HealthReason[],
  warnings: string[]
): number {
  let score = 100;

  additives.forEach((additive) => {
    const concern = ADDITIVE_CONCERNS[additive.code] || ADDITIVE_CONCERNS[additive.code.substring(0, 3)];
    
    if (concern) {
      let impact = 0;
      switch (concern.concern) {
        case 'very_high':
          impact = -8;
          break;
        case 'high':
          impact = -5;
          break;
        case 'moderate':
          impact = -3;
          break;
        case 'low':
          impact = -1;
          break;
      }

      score += impact;
      reasons.push({
        type: 'negative',
        category: 'additives',
        message: `Contains ${additive.code} (${concern.category})`,
        impact,
      });

      if (concern.concern === 'high' || concern.concern === 'very_high') {
        warnings.push(`Warning: This product contains ${additive.code}, which may have health concerns.`);
      }
    } else {
      // Unknown additive - moderate concern
      score -= 2;
      reasons.push({
        type: 'warning',
        category: 'additives',
        message: `Contains additive ${additive.code}`,
        impact: -2,
      });
    }
  });

  return score;
}

/**
 * Analyze NOVA group (processing level)
 */
function analyzeNovaGroup(
  novaGroup: number,
  reasons: HealthReason[],
  warnings: string[]
): number {
  let score = 100;

  switch (novaGroup) {
    case 1:
      // Unprocessed - excellent
      reasons.push({
        type: 'positive',
        category: 'processing',
        message: NOVA_DESCRIPTIONS[1],
        impact: 10,
      });
      break;
    case 2:
      // Processed ingredients - good
      reasons.push({
        type: 'positive',
        category: 'processing',
        message: NOVA_DESCRIPTIONS[2],
        impact: 5,
      });
      break;
    case 3:
      // Processed - moderate
      score -= 10;
      reasons.push({
        type: 'warning',
        category: 'processing',
        message: NOVA_DESCRIPTIONS[3],
        impact: -10,
      });
      break;
    case 4:
      // Ultra-processed - poor
      score -= 20;
      reasons.push({
        type: 'negative',
        category: 'processing',
        message: NOVA_DESCRIPTIONS[4],
        impact: -20,
      });
      warnings.push('This is an ultra-processed food, which is generally less healthy than minimally processed alternatives.');
      break;
  }

  return score;
}

/**
 * Get health grade from score
 */
function getHealthGrade(score: number): HealthScore['grade'] {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 50) return 'moderate';
  if (score >= 35) return 'poor';
  return 'avoid';
}

/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(
  product: Partial<Product>,
  recommendations: string[],
  warnings: string[]
): void {
  const healthScore = analyzeProductHealth(product);
  
  if (healthScore.grade === 'excellent' || healthScore.grade === 'good') {
    recommendations.push('This product is generally healthy and can be part of a balanced diet.');
  } else if (healthScore.grade === 'moderate') {
    recommendations.push('This product can be consumed in moderation. Consider it as an occasional treat rather than a daily staple.');
  } else {
    recommendations.push('Consider limiting consumption of this product. Look for healthier alternatives with fewer additives and lower sugar/salt content.');
  }

  // Specific recommendations based on issues
  if (product.nutrition?.sugars && product.nutrition.sugars > 15) {
    recommendations.push('Look for products with lower sugar content or natural sweeteners.');
  }

  if (product.nutrition?.salt && product.nutrition.salt > 1.5) {
    recommendations.push('This product is high in salt. Consider low-sodium alternatives.');
  }

  if (product.novaGroup === 4) {
    recommendations.push('Try to choose less processed alternatives when possible.');
  }

  if (product.additives && product.additives.length > 5) {
    recommendations.push('This product contains many additives. Consider products with simpler ingredient lists.');
  }
}

