'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../lib/firebase';
import { Product } from '../../../../shared/types/product';
import HealthScore from '../../../components/HealthScore';
import IngredientList from '../../../components/IngredientList';
import RecommendationCard from '../../../components/RecommendationCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const barcode = params.barcode as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get product data
        const getProduct = httpsCallable(functions, 'getProduct');
        const productResult = await getProduct({ barcode });
        const productData = productResult.data as any;

        // Analyze health
        const analyzeHealth = httpsCallable(functions, 'analyzeHealth');
        const healthResult = await analyzeHealth({ barcode });
        const healthScore = healthResult.data as any;

        // Combine data
        const fullProduct: Product = {
          ...productData,
          healthScore,
          createdAt: productData.createdAt?.toDate() || new Date(),
          updatedAt: productData.updatedAt?.toDate() || new Date(),
        };

        setProduct(fullProduct);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (barcode) {
      fetchProduct();
    }
  }, [barcode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product information...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product could not be found.'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Scanner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Scanner
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex gap-6">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                  {product.brand && (
                    <p className="text-lg text-gray-600 mb-2">{product.brand}</p>
                  )}
                  {product.category && (
                    <p className="text-sm text-gray-500">{product.category}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Barcode: {product.barcode}</p>
                </div>
              </div>
            </div>

            {/* Health Score */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Health Analysis</h2>
              <div className="flex justify-center">
                <HealthScore healthScore={product.healthScore} size="large" />
              </div>
            </div>

            {/* Nutrition Information */}
            {product.nutrition && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Nutrition Information</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.nutrition.energy && (
                    <div>
                      <p className="text-sm text-gray-600">Energy</p>
                      <p className="text-lg font-semibold">{product.nutrition.energy} kcal</p>
                    </div>
                  )}
                  {product.nutrition.fat && (
                    <div>
                      <p className="text-sm text-gray-600">Fat</p>
                      <p className="text-lg font-semibold">{product.nutrition.fat}g</p>
                    </div>
                  )}
                  {product.nutrition.carbohydrates && (
                    <div>
                      <p className="text-sm text-gray-600">Carbs</p>
                      <p className="text-lg font-semibold">{product.nutrition.carbohydrates}g</p>
                    </div>
                  )}
                  {product.nutrition.proteins && (
                    <div>
                      <p className="text-sm text-gray-600">Protein</p>
                      <p className="text-lg font-semibold">{product.nutrition.proteins}g</p>
                    </div>
                  )}
                  {product.nutrition.sugars && (
                    <div>
                      <p className="text-sm text-gray-600">Sugars</p>
                      <p className="text-lg font-semibold">{product.nutrition.sugars}g</p>
                    </div>
                  )}
                  {product.nutrition.salt && (
                    <div>
                      <p className="text-sm text-gray-600">Salt</p>
                      <p className="text-lg font-semibold">{product.nutrition.salt}g</p>
                    </div>
                  )}
                  {product.nutrition.fiber && (
                    <div>
                      <p className="text-sm text-gray-600">Fiber</p>
                      <p className="text-lg font-semibold">{product.nutrition.fiber}g</p>
                    </div>
                  )}
                  {product.nutrition.saturatedFat && (
                    <div>
                      <p className="text-sm text-gray-600">Saturated Fat</p>
                      <p className="text-lg font-semibold">{product.nutrition.saturatedFat}g</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-4">Per 100g</p>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <IngredientList ingredients={product.ingredients} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommendations */}
            <RecommendationCard healthScore={product.healthScore} />

            {/* Allergens */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Allergens</h3>
                <div className="space-y-2">
                  {product.allergens.map((allergen, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-800">
                      ⚠️ {allergen}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additives */}
            {product.additives && product.additives.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Additives</h3>
                <div className="space-y-1">
                  {product.additives.map((additive, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      {additive.code}: {additive.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

