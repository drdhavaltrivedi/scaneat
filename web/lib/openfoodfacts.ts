import axios from 'axios';
import { OpenFoodFactsProduct, Product, Ingredient, NutritionInfo, Additive } from '../../shared/types/product';

const OPENFOODFACTS_API_URL = 'https://world.openfoodfacts.org/api/v2';

/**
 * Fetch product data from OpenFoodFacts API by barcode
 */
export async function fetchProductByBarcode(barcode: string): Promise<OpenFoodFactsProduct | null> {
  try {
    const response = await axios.get<OpenFoodFactsProduct>(
      `${OPENFOODFACTS_API_URL}/product/${barcode}.json`
    );
    
    if (response.data.status === 1 && response.data.product) {
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product from OpenFoodFacts:', error);
    return null;
  }
}

/**
 * Parse OpenFoodFacts product data into our Product format
 */
export function parseOpenFoodFactsProduct(
  offProduct: OpenFoodFactsProduct,
  barcode: string
): Partial<Product> {
  const product = offProduct.product;
  if (!product) {
    throw new Error('Invalid product data');
  }

  // Parse ingredients
  const ingredients: Ingredient[] = [];
  if (product.ingredients) {
    product.ingredients.forEach((ing, index) => {
      ingredients.push({
        name: ing.text || `Ingredient ${index + 1}`,
        rank: ing.rank || index + 1,
        vegan: ing.vegan === 'yes',
        vegetarian: ing.vegetarian === 'yes',
      });
    });
  }

  // Parse nutrition information
  const nutriments = product.nutriments || {};
  const nutrition: NutritionInfo = {
    energy: nutriments.energy_kcal_100g,
    fat: nutriments.fat_100g,
    saturatedFat: nutriments['saturated-fat_100g'],
    carbohydrates: nutriments.carbohydrates_100g,
    sugars: nutriments.sugars_100g,
    fiber: nutriments.fiber_100g,
    proteins: nutriments.proteins_100g,
    salt: nutriments.salt_100g,
    sodium: nutriments.sodium_100g,
  };

  // Parse additives
  const additives: Additive[] = [];
  if (product.additives_tags) {
    product.additives_tags.forEach((tag) => {
      // Extract E-number from tag (e.g., "en:e102" -> "E102")
      const eNumber = tag.replace('en:', '').toUpperCase();
      additives.push({
        code: eNumber,
        name: eNumber,
        category: 'Additive',
      });
    });
  }

  return {
    barcode,
    name: product.product_name || product.product_name_en || 'Unknown Product',
    brand: product.brands,
    category: product.categories || product.categories_tags?.[0],
    imageUrl: product.image_url || product.image_front_url || product.image_front_small_url,
    ingredients,
    nutrition,
    allergens: product.allergens_tags || product.traces_tags || [],
    additives,
    novaGroup: product.nova_group,
    nutriScore: product.nutriscore_grade?.toUpperCase(),
  };
}

/**
 * Get product by barcode (fetches and parses)
 */
export async function getProductByBarcode(barcode: string): Promise<Partial<Product> | null> {
  const offProduct = await fetchProductByBarcode(barcode);
  if (!offProduct) {
    return null;
  }

  try {
    return parseOpenFoodFactsProduct(offProduct, barcode);
  } catch (error) {
    console.error('Error parsing product:', error);
    return null;
  }
}

