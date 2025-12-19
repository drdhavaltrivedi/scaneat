'use client';

import { Ingredient } from '../../shared/types/product';

interface IngredientListProps {
  ingredients: Ingredient[];
  showWarnings?: boolean;
}

export default function IngredientList({ ingredients, showWarnings = true }: IngredientListProps) {
  const getIngredientColor = (ingredient: Ingredient) => {
    if (ingredient.allergen) {
      return 'bg-red-50 border-red-200';
    }
    if (ingredient.additive) {
      return 'bg-yellow-50 border-yellow-200';
    }
    if (ingredient.healthConcern === 'high' || ingredient.healthConcern === 'very_high') {
      return 'bg-orange-50 border-orange-200';
    }
    return 'bg-gray-50 border-gray-200';
  };

  const getIngredientIcon = (ingredient: Ingredient) => {
    if (ingredient.allergen) {
      return '⚠️';
    }
    if (ingredient.additive) {
      return '🔬';
    }
    if (ingredient.healthConcern === 'high' || ingredient.healthConcern === 'very_high') {
      return '⚠️';
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Ingredients</h3>
      <div className="space-y-1">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${getIngredientColor(ingredient)}`}
          >
            <div className="flex items-start gap-2">
              {getIngredientIcon(ingredient) && (
                <span className="text-lg">{getIngredientIcon(ingredient)}</span>
              )}
              <div className="flex-1">
                <span className="text-sm text-gray-800">
                  {ingredient.rank}. {ingredient.name}
                </span>
                {ingredient.description && (
                  <p className="text-xs text-gray-600 mt-1">{ingredient.description}</p>
                )}
                <div className="flex gap-2 mt-1">
                  {ingredient.vegan && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                      Vegan
                    </span>
                  )}
                  {ingredient.vegetarian && !ingredient.vegan && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                      Vegetarian
                    </span>
                  )}
                  {ingredient.allergen && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      Allergen
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

