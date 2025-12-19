import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { Product } from '../../shared/types/product';

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { barcode } = route.params as { barcode: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get product data
        const getProduct = httpsCallable(functions, 'getProduct');
        const productResult = await getProduct({ barcode });
        const productData = productResult.data as any;

        // Analyze health
        const analyzeHealth = httpsCallable(functions, 'analyzeHealth');
        const healthResult = await analyzeHealth({ barcode });
        const healthScore = healthResult.data as any;

        // Combine data
        const fullProduct: Product = {
          ...productData,
          healthScore,
          createdAt: productData.createdAt?.toDate() || new Date(),
          updatedAt: productData.updatedAt?.toDate() || new Date(),
        };

        setProduct(fullProduct);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
        Alert.alert('Error', err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (barcode) {
      fetchProduct();
    }
  }, [barcode]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'excellent':
        return '#10B981';
      case 'good':
        return '#34D399';
      case 'moderate':
        return '#FBBF24';
      case 'poor':
        return '#F97316';
      case 'avoid':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading product information...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Product Not Found</Text>
        <Text style={styles.errorText}>{error || 'The product could not be found.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Product Header */}
      <View style={styles.header}>
        {product.imageUrl && (
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
        )}
        <Text style={styles.title}>{product.name}</Text>
        {product.brand && <Text style={styles.brand}>{product.brand}</Text>}
        {product.category && <Text style={styles.category}>{product.category}</Text>}
      </View>

      {/* Health Score */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Score</Text>
        <View style={styles.scoreContainer}>
          <View
            style={[
              styles.scoreCircle,
              { backgroundColor: getGradeColor(product.healthScore.grade) },
            ]}
          >
            <Text style={styles.scoreText}>{product.healthScore.score}</Text>
          </View>
          <Text style={styles.gradeText}>{product.healthScore.grade.toUpperCase()}</Text>
        </View>
      </View>

      {/* Nutrition */}
      {product.nutrition && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition (per 100g)</Text>
          <View style={styles.nutritionGrid}>
            {product.nutrition.energy && (
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Energy</Text>
                <Text style={styles.nutritionValue}>{product.nutrition.energy} kcal</Text>
              </View>
            )}
            {product.nutrition.fat && (
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Fat</Text>
                <Text style={styles.nutritionValue}>{product.nutrition.fat}g</Text>
              </View>
            )}
            {product.nutrition.carbohydrates && (
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Carbs</Text>
                <Text style={styles.nutritionValue}>{product.nutrition.carbohydrates}g</Text>
              </View>
            )}
            {product.nutrition.proteins && (
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={styles.nutritionValue}>{product.nutrition.proteins}g</Text>
              </View>
            )}
            {product.nutrition.sugars && (
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Sugars</Text>
                <Text style={styles.nutritionValue}>{product.nutrition.sugars}g</Text>
              </View>
            )}
            {product.nutrition.salt && (
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Salt</Text>
                <Text style={styles.nutritionValue}>{product.nutrition.salt}g</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Recommendations */}
      {product.healthScore.recommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {product.healthScore.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.recommendationText}>✓ {rec}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Warnings */}
      {product.healthScore.warnings.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Warnings</Text>
          {product.healthScore.warnings.map((warning, index) => (
            <View key={index} style={styles.warningItem}>
              <Text style={styles.warningText}>⚠ {warning}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Ingredients */}
      {product.ingredients && product.ingredients.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {product.ingredients.map((ing, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientText}>
                {ing.rank}. {ing.name}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Allergens */}
      {product.allergens && product.allergens.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Allergens</Text>
          {product.allergens.map((allergen, index) => (
            <View key={index} style={styles.allergenItem}>
              <Text style={styles.allergenText}>⚠ {allergen}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 10,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 5,
  },
  brand: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  gradeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    width: '48%',
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 10,
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  recommendationItem: {
    padding: 10,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#065F46',
  },
  warningItem: {
    padding: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#991B1B',
  },
  ingredientItem: {
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 5,
  },
  ingredientText: {
    fontSize: 14,
    color: '#111827',
  },
  allergenItem: {
    padding: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    marginBottom: 8,
  },
  allergenText: {
    fontSize: 14,
    color: '#991B1B',
  },
});

