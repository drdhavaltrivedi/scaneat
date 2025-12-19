import * as admin from 'firebase-admin';

/**
 * Initialize database structure and indexes
 * Run this function once to set up the database
 */
export async function initDatabase() {
  const db = admin.firestore();

  // Sample product structure (for reference - not used)
  // This shows the expected structure of product documents

  // Create collections structure
  try {
    // Products collection - will be created automatically when first product is added
    console.log('Database structure initialized');
    
    // Create a test document to ensure collections are set up
    const testRef = db.collection('_system').doc('init');
    await testRef.set({
      initialized: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

