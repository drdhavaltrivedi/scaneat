'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../shared/types/product';
import HealthScore from './HealthScore';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const getGradeColor = (grade: Product['healthScore']['grade']) => {
    switch (grade) {
      case 'excellent':
        return 'border-green-500';
      case 'good':
        return 'border-green-400';
      case 'moderate':
        return 'border-yellow-500';
      case 'poor':
        return 'border-orange-500';
      case 'avoid':
        return 'border-red-500';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <Link href={`/product/${product.barcode}`}>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${getGradeColor(product.healthScore.grade)} hover:shadow-lg transition-shadow cursor-pointer`}>
        <div className="flex">
          {/* Product Image */}
          <div className="w-32 h-32 flex-shrink-0 bg-gray-100">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">
                {product.name}
              </h3>
              {product.brand && (
                <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
              )}
              {product.category && (
                <p className="text-xs text-gray-500">{product.category}</p>
              )}
            </div>

            {!compact && (
              <div className="mt-2">
                <HealthScore healthScore={product.healthScore} size="small" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

