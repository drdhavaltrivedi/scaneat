'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BarcodeScanner from '../components/BarcodeScanner';
import AuthButton from '../components/AuthButton';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (barcode: string) => {
    setLoading(true);
    setError(null);

    try {
      // Call cloud function to get product
      const getProduct = httpsCallable(functions, 'getProduct');
      const result = await getProduct({ barcode });

      // Navigate to product detail page
      router.push(`/product/${barcode}`);
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to fetch product. Please try again.');
      setLoading(false);
    }
  };

  const handleError = (err: Error) => {
    setError(err.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <AuthButton />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Scaneat</h1>
          <p className="text-lg text-gray-600">
            Scan food barcodes to get instant health analysis
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading && (
          <div className="max-w-2xl mx-auto mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-center">
            Loading product information...
          </div>
        )}

        <BarcodeScanner onScan={handleScan} onError={handleError} />
      </div>
    </div>
  );
}
