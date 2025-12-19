'use client';

import { HealthScore as HealthScoreType } from '../../shared/types/product';

interface HealthScoreProps {
  healthScore: HealthScoreType;
  size?: 'small' | 'medium' | 'large';
}

export default function HealthScore({ healthScore, size = 'medium' }: HealthScoreProps) {
  const getGradeColor = (grade: HealthScoreType['grade']) => {
    switch (grade) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-green-400';
      case 'moderate':
        return 'bg-yellow-500';
      case 'poor':
        return 'bg-orange-500';
      case 'avoid':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getGradeText = (grade: HealthScoreType['grade']) => {
    switch (grade) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'moderate':
        return 'Moderate';
      case 'poor':
        return 'Poor';
      case 'avoid':
        return 'Avoid';
      default:
        return 'Unknown';
    }
  };

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Score Circle */}
      <div className="relative">
        <div className={`w-24 h-24 rounded-full ${getGradeColor(healthScore.grade)} flex items-center justify-center text-white font-bold ${sizeClasses[size]}`}>
          {healthScore.score}
        </div>
        {healthScore.nutriScore && (
          <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
            {healthScore.nutriScore}
          </div>
        )}
      </div>

      {/* Grade Badge */}
      <div className={`px-4 py-1 rounded-full ${getGradeColor(healthScore.grade)} text-white text-sm font-semibold`}>
        {getGradeText(healthScore.grade)}
      </div>

      {/* NOVA Group */}
      {healthScore.novaGroup && (
        <div className="text-xs text-gray-600">
          NOVA Group {healthScore.novaGroup}
        </div>
      )}
    </div>
  );
}

