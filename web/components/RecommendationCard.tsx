'use client';

import { HealthScore } from '../../shared/types/product';

interface RecommendationCardProps {
  healthScore: HealthScore;
}

export default function RecommendationCard({ healthScore }: RecommendationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Recommendations</h3>
      
      {/* Recommendations */}
      {healthScore.recommendations.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommendations</h4>
          <ul className="space-y-2">
            {healthScore.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {healthScore.warnings.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-red-700 mb-2">Warnings</h4>
          <ul className="space-y-2">
            {healthScore.warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">⚠</span>
                <span className="text-sm text-gray-700">{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Health Reasons */}
      {healthScore.reasons.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Analysis Details</h4>
          <div className="space-y-2">
            {healthScore.reasons.map((reason, index) => (
              <div
                key={index}
                className={`p-2 rounded text-xs ${
                  reason.type === 'positive'
                    ? 'bg-green-50 text-green-800'
                    : reason.type === 'negative'
                    ? 'bg-red-50 text-red-800'
                    : 'bg-yellow-50 text-yellow-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{reason.category}:</span>
                  <span>{reason.impact > 0 ? '+' : ''}{reason.impact}</span>
                </div>
                <p className="mt-1">{reason.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

