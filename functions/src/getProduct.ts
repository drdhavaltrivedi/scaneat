import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { OpenFoodFactsProduct } from '../../shared/types/product';

const db = admin.firestore();
const OPENFOODFACTS_API_URL = 'https://world.openfoodfacts.org/api/v2';

/**
 * Fetch product from OpenFoodFacts API
 */
async function fetchProductFromOpenFoodFacts(barcode: string): Promise<OpenFoodFactsProduct | null> {
  try {
    const response = await axios.get<OpenFoodFactsProduct>(
      `${OPENFOODFACTS_API_URL}/product/${barcode}.json`,
      { timeout: 10000 }
    );
    
    if (response.data.status === 1 && response.data.product) {
      return response.data;
    }
    
    return null;
  } catch (error) {
    functions.logger.error('Error fetching from OpenFoodFacts:', error);
    return null;
  }
}

/**
 * Parse OpenFoodFacts product to our format
 */
function parseProduct(offProduct: OpenFoodFactsProduct, barcode: string): any {
  const product = offProduct.product;
  if (!product) {
    throw new Error('Invalid product data');
  }

  return {
    barcode,
    name: product.product_name || product.product_name_en || 'Unknown Product',
    brand: product.brands || '',
    category: product.categories || product.categories_tags?.[0] || '',
    imageUrl: product.image_url || product.image_front_url || product.image_front_small_url || '',
    ingredients: (product.ingredients || []).map((ing, index) => ({
      name: ing.text || `Ingredient ${index + 1}`,
      rank: ing.rank || index + 1,
      vegan: ing.vegan === 'yes',
      vegetarian: ing.vegetarian === 'yes',
    })),
    nutrition: {
      energy: product.nutriments?.energy_kcal_100g,
      fat: product.nutriments?.fat_100g,
      saturatedFat: product.nutriments?.['saturated-fat_100g'],
      carbohydrates: product.nutriments?.carbohydrates_100g,
      sugars: product.nutriments?.sugars_100g,
      fiber: product.nutriments?.fiber_100g,
      proteins: product.nutriments?.proteins_100g,
      salt: product.nutriments?.salt_100g,
      sodium: product.nutriments?.sodium_100g,
    },
    allergens: product.allergens_tags || product.traces_tags || [],
    additives: (product.additives_tags || []).map((tag) => ({
      code: tag.replace('en:', '').toUpperCase(),
      name: tag.replace('en:', '').toUpperCase(),
      category: 'Additive',
    })),
    novaGroup: product.nova_group,
    nutriScore: product.nutriscore_grade?.toUpperCase(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

/**
 * Cloud Function to get product by barcode
 * Checks cache first, then fetches from OpenFoodFacts if needed
 * 
 * HTTP version with CORS support for easier localhost access
 */
export const getProduct = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Get barcode from request body or query
  const barcode = req.body?.barcode || req.query?.barcode;

  if (!barcode || typeof barcode !== 'string') {
    res.status(400).json({
      error: 'invalid-argument',
      message: 'Barcode is required and must be a string'
    });
    return;
  }

  try {
    // Check cache in Firestore
    const productRef = db.collection('products').doc(barcode);
    let cachedProduct;
    
    try {
      cachedProduct = await productRef.get();
    } catch (error: any) {
      functions.logger.warn('Firestore read error, fetching from API:', error);
      // Continue to fetch from API if Firestore is not available
      cachedProduct = { exists: false };
    }

    if (cachedProduct.exists && 'data' in cachedProduct) {
      const productData = cachedProduct.data();
      // Check if cache is less than 7 days old
      const updatedAt = productData?.updatedAt;
      const cacheAge = updatedAt && 'toMillis' in updatedAt 
        ? Date.now() - updatedAt.toMillis()
        : Infinity;
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      if (cacheAge < sevenDays) {
        functions.logger.info(`Returning cached product for barcode: ${barcode}`);
        res.status(200).json(productData);
        return;
      }
    }

    // Fetch from OpenFoodFacts
    functions.logger.info(`Fetching product from OpenFoodFacts for barcode: ${barcode}`);
    const offProduct = await fetchProductFromOpenFoodFacts(barcode);

    if (!offProduct) {
      res.status(404).json({
        error: 'not-found',
        message: `Product with barcode ${barcode} not found in OpenFoodFacts`
      });
      return;
    }

    // Parse and save to Firestore
    const productData = parseProduct(offProduct, barcode);
    try {
      await productRef.set(productData, { merge: true });
    } catch (error: any) {
      functions.logger.warn('Firestore write error, continuing without cache:', error);
      // Continue even if cache write fails
    }

    functions.logger.info(`Product saved to cache: ${barcode}`);
    res.status(200).json(productData);
  } catch (error: any) {
    functions.logger.error('Error in getProduct:', error);
    
    res.status(500).json({
      error: 'internal',
      message: error.message || 'An error occurred while fetching the product'
    });
  }
});

