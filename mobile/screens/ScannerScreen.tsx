import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchProductFromOpenFoodFacts } from '../lib/openFoodFacts';
import BarcodeScanner from '../components/BarcodeScanner';

export default function ScannerScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleScan = async (barcode: string) => {
    setLoading(true);

    try {
      // Fetch product directly from OpenFoodFacts API
      const productData = await fetchProductFromOpenFoodFacts(barcode);

      if (!productData) {
        throw new Error('Product not found in OpenFoodFacts database.');
      }

      // Navigate to product detail
      navigation.navigate('ProductDetail' as never, { barcode } as never);
    } catch (err: any) {
      console.error('Error fetching product:', err);
      Alert.alert('Error', err.message || 'Failed to fetch product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: Error) => {
    Alert.alert('Scanner Error', error.message);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <BarcodeScanner onScan={handleScan} onError={handleError} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

