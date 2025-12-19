import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  calculateNutriScorePoints,
  getNutriScoreGrade,
  getHealthConcern,
  ADDITIVE_CONCERNS,
  NOVA_DESCRIPTIONS,
} from '../../shared/utils/healthRules';

const db = admin.firestore();

interface HealthReason {
  type: 'positive' | 'negative' | 'warning';
  category: string;
  message: string;
  impact: number;
}

/**
 * Analyze product health and generate health score
 */
function analyzeProductHealth(productData: any): any {
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
      const concern = ADDITIVE_CONCERNS[additive.code] || 
                     ADDITIVE_CONCERNS[additive.code.substring(0, 3)];
      
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
          warnings.push(`Warning: Contains ${additive.code}`);
        }
      } else {
        score -= 2;
        reasons.push({
          type: 'warning',
          category: 'additives',
          message: `Contains additive ${additive.code}`,
          impact: -2,
        });
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
          message: NOVA_DESCRIPTIONS[1],
          impact: 10,
        });
        break;
      case 2:
        reasons.push({
          type: 'positive',
          category: 'processing',
          message: NOVA_DESCRIPTIONS[2],
          impact: 5,
        });
        break;
      case 3:
        score -= 10;
        reasons.push({
          type: 'warning',
          category: 'processing',
          message: NOVA_DESCRIPTIONS[3],
          impact: -10,
        });
        break;
      case 4:
        score -= 20;
        reasons.push({
          type: 'negative',
          category: 'processing',
          message: NOVA_DESCRIPTIONS[4],
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

  // Calculate Nutri-Score if not available
  let nutriScore = productData.nutriScore;
  if (!nutriScore && productData.nutrition) {
    const points = calculateNutriScorePoints(productData.nutrition);
    nutriScore = getNutriScoreGrade(points);
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    grade,
    nutriScore,
    novaGroup: productData.novaGroup,
    reasons,
    recommendations,
    warnings,
  };
}

/**
 * Cloud Function to analyze product health
 */
export const analyzeHealth = functions.https.onCall(async (request) => {
  const { barcode } = request.data;

  if (!barcode || typeof barcode !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Barcode is required and must be a string'
    );
  }

  try {
    // Get product data
    const productRef = db.collection('products').doc(barcode);
    let productDoc;
    
    try {
      productDoc = await productRef.get();
    } catch (error: any) {
      functions.logger.error('Firestore read error:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Database connection error. Please try again later.'
      );
    }

    if (!productDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        `Product with barcode ${barcode} not found. Please fetch product first.`
      );
    }

    const productData = productDoc.data();
    if (!productData) {
      throw new functions.https.HttpsError(
        'not-found',
        'Product data is empty'
      );
    }

    // Check if health score already exists and is recent
    if (productData.healthScore) {
      const healthScoreAge = Date.now() - (productData.healthScore.updatedAt?.toMillis() || 0);
      const oneDay = 24 * 60 * 60 * 1000;

      if (healthScoreAge < oneDay) {
        functions.logger.info(`Returning cached health score for barcode: ${barcode}`);
        return productData.healthScore;
      }
    }

    // Analyze health
    functions.logger.info(`Analyzing health for barcode: ${barcode}`);
    const healthScore = analyzeProductHealth(productData);

    // Update product with health score
    try {
      await productRef.update({
        healthScore: {
          ...healthScore,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error: any) {
      functions.logger.warn('Firestore update error, returning health score without saving:', error);
      // Return health score even if update fails
    }

    return healthScore;
  } catch (error: any) {
    functions.logger.error('Error in analyzeHealth:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while analyzing product health',
      error.message
    );
  }
});

