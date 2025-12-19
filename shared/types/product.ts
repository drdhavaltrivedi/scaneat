/**
 * Shared TypeScript types for Scaneat project
 */

export interface Product {
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  ingredients: Ingredient[];
  nutrition: NutritionInfo;
  allergens?: string[];
  additives?: Additive[];
  novaGroup?: number; // NOVA classification (1-4)
  nutriScore?: string; // A-E
  healthScore: HealthScore;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  name: string;
  rank: number; // Order in ingredient list
  vegan?: boolean;
  vegetarian?: boolean;
  allergen?: boolean;
  additive?: boolean;
  healthConcern?: HealthConcern;
  description?: string;
}

export interface NutritionInfo {
  energy?: number; // kcal per 100g
  fat?: number; // g per 100g
  saturatedFat?: number; // g per 100g
  carbohydrates?: number; // g per 100g
  sugars?: number; // g per 100g
  fiber?: number; // g per 100g
  proteins?: number; // g per 100g
  salt?: number; // g per 100g
  sodium?: number; // g per 100g
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
}

export interface Additive {
  code: string; // E-number or similar
  name: string;
  category: string;
  healthConcern?: HealthConcern;
  description?: string;
}

export interface HealthScore {
  score: number; // 0-100
  grade: 'excellent' | 'good' | 'moderate' | 'poor' | 'avoid';
  nutriScore?: string; // A-E
  novaGroup?: number; // 1-4
  reasons: HealthReason[];
  recommendations: string[];
  warnings: string[];
}

export interface HealthReason {
  type: 'positive' | 'negative' | 'warning';
  category: string; // e.g., 'sugar', 'fiber', 'additives'
  message: string;
  impact: number; // Impact on score (-10 to +10)
}

export type HealthConcern = 
  | 'low'
  | 'moderate'
  | 'high'
  | 'very_high';

export interface OpenFoodFactsProduct {
  code: string;
  status: number;
  status_verbose: string;
  product?: {
    _id?: string;
    product_name?: string;
    product_name_en?: string;
    brands?: string;
    categories?: string;
    categories_tags?: string[];
    image_url?: string;
    image_front_url?: string;
    image_front_small_url?: string;
    ingredients?: Array<{
      id?: string;
      text?: string;
      rank?: number;
      vegan?: string;
      vegetarian?: string;
    }>;
    ingredients_text?: string;
    ingredients_text_en?: string;
    nutriments?: {
      energy_kcal_100g?: number;
      fat_100g?: number;
      'saturated-fat_100g'?: number;
      carbohydrates_100g?: number;
      sugars_100g?: number;
      fiber_100g?: number;
      proteins_100g?: number;
      salt_100g?: number;
      sodium_100g?: number;
      [key: string]: any;
    };
    nutriscore_grade?: string;
    nova_group?: number;
    additives_tags?: string[];
    allergens_tags?: string[];
    traces_tags?: string[];
  };
}

export interface UserPreferences {
  userId: string;
  dietaryRestrictions: DietaryRestriction[];
  healthGoals: HealthGoal[];
  allergenWarnings: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type DietaryRestriction = 
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'dairy_free'
  | 'nut_free'
  | 'soy_free'
  | 'halal'
  | 'kosher';

export type HealthGoal = 
  | 'weight_loss'
  | 'muscle_gain'
  | 'heart_health'
  | 'diabetes_management'
  | 'low_sodium'
  | 'low_sugar';

export interface ProductHistory {
  userId: string;
  barcode: string;
  scannedAt: Date;
  product: Product;
}

export interface FavoriteProduct {
  userId: string;
  barcode: string;
  addedAt: Date;
}

