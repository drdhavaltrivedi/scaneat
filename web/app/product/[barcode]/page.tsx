'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductFromOpenFoodFacts } from '../../../lib/openFoodFacts';
import { analyzeProductHealth } from '../../../lib/healthAnalysis';
import { Product } from '../../../../shared/types/product';
import { getErrorMessage } from '../../../lib/errorHandler';
import HealthScore from '../../../components/HealthScore';
import IngredientList from '../../../components/IngredientList';
import RecommendationCard from '../../../components/RecommendationCard';
import { getAdditiveInfo, getConcernColor, getConcernText } from '../../../lib/additives';

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

        // Fetch product directly from OpenFoodFacts API
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out')), 30000)
        );
        
        const productData = await Promise.race([
          fetchProductFromOpenFoodFacts(barcode),
          timeoutPromise
        ]) as any;
        
        if (!productData) {
          throw new Error('Product not found in OpenFoodFacts database.');
        }

        // Analyze health directly in the browser
        const healthScore = analyzeProductHealth(productData);

        // Combine data
        const fullProduct: Product = {
          ...productData,
          healthScore,
          createdAt: productData.createdAt || new Date(),
          updatedAt: productData.updatedAt || new Date(),
        };

        setProduct(fullProduct);
      } catch (err: any) {
        console.error('Error fetching product:', {
          error: err,
          code: err?.code,
          message: err?.message,
          details: err?.details,
          barcode
        });
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    // Fetch product directly (no auth needed)
    if (barcode) {
      fetchProduct();
    }
  }, [barcode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">Analyzing Product</p>
          <p className="text-sm text-gray-500">Fetching nutrition data and calculating health score...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="mb-6 group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Scanner</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Product Header */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {product.imageUrl && (
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">{product.name}</h1>
                  {product.brand && (
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2 md:mb-3">
                      <span className="text-base md:text-lg text-gray-600 font-medium">{product.brand}</span>
                    </div>
                  )}
                  {product.category && (
                    <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
                      {product.category.split(',')[0]}
                    </div>
                  )}
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg inline-block">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <span>Barcode: {product.barcode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Score */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Health Analysis</h2>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Score out of 100</span>
                </div>
              </div>
              <div className="flex justify-center mb-4 md:mb-6">
                <HealthScore healthScore={product.healthScore} size="large" />
              </div>
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                <p className="text-xs md:text-sm text-gray-600 text-center">
                  This score is calculated based on nutrition facts, additives, processing level, and ingredient quality
                </p>
              </div>
            </div>

            {/* Nutrition Information */}
            {product.nutrition && (
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-2">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Nutrition Facts</h2>
                  <span className="text-xs md:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Per 100g</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {product.nutrition.energy && (
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                      <p className="text-xs font-medium text-orange-700 mb-1">Energy</p>
                      <p className="text-2xl font-bold text-orange-900">{product.nutrition.energy}</p>
                      <p className="text-xs text-orange-600 mt-1">kcal</p>
                    </div>
                  )}
                  {product.nutrition.fat && (
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
                      <p className="text-xs font-medium text-yellow-700 mb-1">Fat</p>
                      <p className="text-2xl font-bold text-yellow-900">{product.nutrition.fat}</p>
                      <p className="text-xs text-yellow-600 mt-1">grams</p>
                    </div>
                  )}
                  {product.nutrition.carbohydrates && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <p className="text-xs font-medium text-blue-700 mb-1">Carbs</p>
                      <p className="text-2xl font-bold text-blue-900">{product.nutrition.carbohydrates}</p>
                      <p className="text-xs text-blue-600 mt-1">grams</p>
                    </div>
                  )}
                  {product.nutrition.proteins && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <p className="text-xs font-medium text-green-700 mb-1">Protein</p>
                      <p className="text-2xl font-bold text-green-900">{product.nutrition.proteins}</p>
                      <p className="text-xs text-green-600 mt-1">grams</p>
                    </div>
                  )}
                  {product.nutrition.sugars && (
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                      <p className="text-xs font-medium text-red-700 mb-1">Sugars</p>
                      <p className="text-2xl font-bold text-red-900">{product.nutrition.sugars}</p>
                      <p className="text-xs text-red-600 mt-1">grams</p>
                    </div>
                  )}
                  {product.nutrition.salt && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <p className="text-xs font-medium text-purple-700 mb-1">Salt</p>
                      <p className="text-2xl font-bold text-purple-900">{product.nutrition.salt}</p>
                      <p className="text-xs text-purple-600 mt-1">grams</p>
                    </div>
                  )}
                  {product.nutrition.fiber && (
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                      <p className="text-xs font-medium text-emerald-700 mb-1">Fiber</p>
                      <p className="text-2xl font-bold text-emerald-900">{product.nutrition.fiber}</p>
                      <p className="text-xs text-emerald-600 mt-1">grams</p>
                    </div>
                  )}
                  {product.nutrition.saturatedFat && (
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                      <p className="text-xs font-medium text-amber-700 mb-1">Saturated Fat</p>
                      <p className="text-2xl font-bold text-amber-900">{product.nutrition.saturatedFat}</p>
                      <p className="text-xs text-amber-600 mt-1">grams</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 border border-gray-100">
                <IngredientList ingredients={product.ingredients} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Recommendations */}
            <RecommendationCard healthScore={product.healthScore} />

            {/* Allergens */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-red-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Allergens</h3>
                </div>
                <div className="space-y-2">
                  {product.allergens.map((allergen, index) => (
                    <div key={index} className="bg-red-50 border-l-4 border-red-500 rounded-lg p-3 text-sm text-red-800 flex items-center gap-2">
                      <span className="text-red-600">⚠️</span>
                      <span className="font-medium">{allergen.replace('en:', '').replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additives */}
            {product.additives && product.additives.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-yellow-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-yellow-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Additives</h3>
                  <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {product.additives.length} found
                  </span>
                </div>
                <div className="space-y-4">
                  {product.additives.map((additive, index) => {
                    const additiveInfo = getAdditiveInfo(additive.code);
                    const concern = additiveInfo?.concern || 'moderate';
                    const concernColor = getConcernColor(concern);
                    const concernText = getConcernText(concern);
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        {/* Additive Header */}
                        <div className={`${concernColor} px-4 py-3 flex items-center justify-between`}>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-lg">{additive.code}</span>
                            <span className="font-semibold">{additiveInfo?.name || additive.name}</span>
                          </div>
                          <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                            {concernText}
                          </span>
                        </div>
                        
                        {/* Additive Details */}
                        <div className="p-4 bg-gray-50">
                          {additiveInfo ? (
                            <>
                              <div className="mb-3">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                  {additiveInfo.category}
                                </span>
                                <p className="text-sm text-gray-700 mt-1">{additiveInfo.description}</p>
                              </div>
                              
                              {/* Why Avoid */}
                              {additiveInfo.whyAvoid && additiveInfo.whyAvoid.length > 0 && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Why Avoid This Additive
                                  </h4>
                                  <ul className="space-y-1">
                                    {additiveInfo.whyAvoid.map((reason, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-red-500 mt-1">•</span>
                                        <span>{reason}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Health Effects */}
                              {additiveInfo.healthEffects && additiveInfo.healthEffects.length > 0 && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Potential Health Effects
                                  </h4>
                                  <ul className="space-y-1">
                                    {additiveInfo.healthEffects.map((effect, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-orange-500 mt-1">•</span>
                                        <span>{effect}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Alternatives */}
                              {additiveInfo.alternatives && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <h4 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Better Alternatives
                                  </h4>
                                  <p className="text-sm text-gray-700">{additiveInfo.alternatives}</p>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-sm text-gray-600">
                              <p className="font-medium mb-1">{additive.code}: {additive.name}</p>
                              <p className="text-xs text-gray-500">Limited information available for this additive. Consider researching before consuming.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* General Additive Warning */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Many additives are generally safe, but some may cause reactions in sensitive individuals. 
                    Consider limiting processed foods with multiple additives for better health.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

