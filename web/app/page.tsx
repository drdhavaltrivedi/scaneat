'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BarcodeScanner from '../components/BarcodeScanner';
import { fetchProductFromOpenFoodFacts } from '../lib/openFoodFacts';
import { getErrorMessage } from '../lib/errorHandler';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (barcode: string) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch product directly from OpenFoodFacts API
      console.log('Fetching product from OpenFoodFacts for barcode:', barcode);
      
      // Add timeout protection
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out. Please try again.')), 30000)
      );
      
      let productData: any;
      try {
        productData = await Promise.race([
          fetchProductFromOpenFoodFacts(barcode),
          timeoutPromise
        ]);
        console.log('Product fetched successfully:', productData);
      } catch (fetchError: any) {
        console.error('Error fetching product:', fetchError);
        throw new Error(fetchError.message || 'Failed to fetch product from OpenFoodFacts');
      }

      if (!productData) {
        throw new Error('Product not found in OpenFoodFacts database.');
      }

      // Navigate to product detail page
      router.push(`/product/${barcode}`);
    } catch (err: any) {
      // Capture all possible error information
      const errorInfo: any = {
        barcode,
        timestamp: new Date().toISOString(),
      };
      
      // Try to extract all error information
      if (err) {
        errorInfo.name = err.name;
        errorInfo.message = err.message;
        errorInfo.code = err.code;
        errorInfo.details = err.details;
        errorInfo.stack = err.stack;
        errorInfo.toString = err.toString();
        
        // Get all properties
        try {
          errorInfo.allProperties = Object.getOwnPropertyNames(err).reduce((acc, key) => {
            try {
              acc[key] = (err as any)[key];
            } catch (e) {
              acc[key] = '[Unable to access]';
            }
            return acc;
          }, {} as any);
        } catch (e) {
          errorInfo.propertyExtractionError = String(e);
        }
        
        // Check if it's a Firebase error
        if (err.code && err.code.startsWith('functions/')) {
          errorInfo.isFirebaseError = true;
        }
      } else {
        errorInfo.errorIsNull = true;
      }
      
      console.error('Error fetching product - Full details:', errorInfo);
      
      const errorMessage = getErrorMessage(err || { message: 'Unknown error occurred' });
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleError = (err: Error) => {
    setError(err.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in px-4">
          <div className="inline-block mb-3 md:mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-3 md:p-4 shadow-lg">
              <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 md:mb-4">
            Scaneat
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-2 font-medium">
            Know What You Eat
          </p>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Scan any food barcode to get instant health analysis, nutrition facts, and personalized recommendations
          </p>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-6 md:mb-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-blue-100 text-center hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Scan Barcode</h3>
              <p className="text-sm text-gray-600">Use your camera or enter the barcode manually</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-purple-100 text-center hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Get Analysis</h3>
              <p className="text-sm text-gray-600">Instant health score and nutrition breakdown</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-green-100 text-center hover:shadow-lg transition-shadow">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Make Decisions</h3>
              <p className="text-sm text-gray-600">Get recommendations based on your health goals</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 animate-slide-down">
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="max-w-2xl mx-auto mb-6 animate-pulse">
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <p className="font-medium">Analyzing product information...</p>
              </div>
            </div>
          </div>
        )}

        <BarcodeScanner onScan={handleScan} onError={handleError} />
      </div>
    </div>
  );
}
