'use client';

import { useState } from 'react';
import { Ingredient } from '../../shared/types/product';
import { getIngredientInfo, getIngredientConcernColor, getIngredientConcernText } from '../lib/ingredients';

interface IngredientListProps {
  ingredients: Ingredient[];
  showWarnings?: boolean;
}

export default function IngredientList({ ingredients, showWarnings = true }: IngredientListProps) {
  const [expandedIngredients, setExpandedIngredients] = useState<Set<number>>(new Set());

  const toggleIngredient = (index: number) => {
    const newExpanded = new Set(expandedIngredients);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedIngredients(newExpanded);
  };

  const getIngredientColor = (ingredient: Ingredient, info: any) => {
    if (ingredient.allergen || info?.dietaryInfo?.allergen) {
      return 'bg-red-50 border-red-200';
    }
    if (ingredient.additive) {
      return 'bg-yellow-50 border-yellow-200';
    }
    if (info?.concern === 'very_high' || info?.concern === 'high') {
      return 'bg-orange-50 border-orange-200';
    }
    if (info?.concern === 'moderate') {
      return 'bg-yellow-50 border-yellow-200';
    }
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900">Ingredients</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {ingredients.length} ingredients
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Ingredients are listed in order of quantity (highest first). Click any ingredient for detailed information.
      </p>
      <div className="space-y-3">
        {ingredients.map((ingredient, index) => {
          const info = getIngredientInfo(ingredient.name);
          const isExpanded = expandedIngredients.has(index);
          const concern = info?.concern || 'moderate';
          const concernColor = getIngredientConcernColor(concern);
          const concernText = getIngredientConcernText(concern);
          
          return (
            <div
              key={index}
              className={`border rounded-xl overflow-hidden transition-all ${getIngredientColor(ingredient, info)} ${
                isExpanded ? 'shadow-md' : 'hover:shadow-sm'
              }`}
            >
              {/* Ingredient Header - Clickable */}
              <button
                onClick={() => toggleIngredient(index)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-white/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-sm">
                    {ingredient.rank}
                  </div>
                  
                  {/* Ingredient Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900 text-base">{ingredient.name}</h4>
                      {info && (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${concernColor}`}>
                          {concernText}
                        </span>
                      )}
                    </div>
                    
                    {/* Dietary Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ingredient.vegan && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                          ✓ Vegan
                        </span>
                      )}
                      {ingredient.vegetarian && !ingredient.vegan && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                          ✓ Vegetarian
                        </span>
                      )}
                      {(ingredient.allergen || info?.dietaryInfo?.allergen) && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                          ⚠ Allergen
                        </span>
                      )}
                      {info?.dietaryInfo?.glutenFree === false && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                          Contains Gluten
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expand Icon */}
                <div className="flex-shrink-0 ml-4">
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && info && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-200 bg-white/80">
                  <div className="pt-4 space-y-4">
                    {/* Description */}
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                        {info.category}
                      </span>
                      <p className="text-sm text-gray-700">{info.description}</p>
                    </div>

                    {/* Why Consider */}
                    {info.whyConsider && info.whyConsider.length > 0 && (
                      <div>
                        <h5 className="text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Things to Consider
                        </h5>
                        <ul className="space-y-1">
                          {info.whyConsider.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-orange-500 mt-1">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Health Effects */}
                    {info.healthEffects && info.healthEffects.length > 0 && (
                      <div>
                        <h5 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Health Effects
                        </h5>
                        <ul className="space-y-1">
                          {info.healthEffects.map((effect, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{effect}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Benefits */}
                    {info.benefits && info.benefits.length > 0 && (
                      <div>
                        <h5 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Benefits
                        </h5>
                        <ul className="space-y-1">
                          {info.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-green-500 mt-1">✓</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Allergen Info */}
                    {info.dietaryInfo?.allergen && info.dietaryInfo.allergen.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h5 className="text-sm font-bold text-red-800 mb-1">⚠ Contains Allergens:</h5>
                        <p className="text-xs text-red-700">
                          {info.dietaryInfo.allergen.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* No Info Available */}
              {isExpanded && !info && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-200 bg-white/80">
                  <div className="pt-4">
                    <p className="text-sm text-gray-600">
                      Limited information available for this ingredient. Consider researching before consuming.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

