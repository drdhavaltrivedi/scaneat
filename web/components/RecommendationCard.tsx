'use client';

import { HealthScore } from '../../shared/types/product';

interface RecommendationCardProps {
  healthScore: HealthScore;
}

export default function RecommendationCard({ healthScore }: RecommendationCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 rounded-full p-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Health Recommendations</h3>
      </div>
      
      {/* Recommendations */}
      {healthScore.recommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="bg-green-100 rounded-full p-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
            Recommendations
          </h4>
          <ul className="space-y-3">
            {healthScore.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3 bg-green-50 rounded-lg p-3 border border-green-200">
                <span className="text-green-600 mt-0.5 font-bold">✓</span>
                <span className="text-sm text-gray-800 flex-1">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {healthScore.warnings.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
            <span className="bg-red-100 rounded-full p-1">
              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </span>
            Warnings
          </h4>
          <ul className="space-y-3">
            {healthScore.warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-3 bg-red-50 rounded-lg p-3 border border-red-200">
                <span className="text-red-600 mt-0.5 font-bold">⚠</span>
                <span className="text-sm text-gray-800 flex-1">{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Health Reasons */}
      {healthScore.reasons.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="bg-blue-100 rounded-full p-1">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            Analysis Details
          </h4>
          <div className="space-y-3">
            {healthScore.reasons.map((reason, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border text-sm ${
                  reason.type === 'positive'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : reason.type === 'negative'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold capitalize">{reason.category.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className={`font-bold text-lg ${reason.impact > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {reason.impact > 0 ? '+' : ''}{reason.impact}
                  </span>
                </div>
                <p className="text-xs mt-1 opacity-90">{reason.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

