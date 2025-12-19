import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Cloud Function to set up database structure
 * Call this once after deploying functions
 */
export const setupDatabase = functions.https.onRequest(async (req: any, res: any) => {
  try {
    const db = admin.firestore();
    
    // Create a test document to verify Firestore is working
    const testRef = db.collection('_system').doc('health');
    await testRef.set({
      status: 'healthy',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      message: 'Database is operational',
    });

    res.status(200).json({
      success: true,
      message: 'Database setup complete',
      collections: {
        products: 'Will be created automatically when first product is scanned',
        users: 'Will be created automatically when first user signs up',
      },
    });
  } catch (error: any) {
    console.error('Database setup error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

