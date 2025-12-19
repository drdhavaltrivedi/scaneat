import * as admin from 'firebase-admin';

admin.initializeApp();

// Export all cloud functions
export { getProduct } from './getProduct';
export { analyzeHealth } from './analyzeHealth';
export { setupDatabase } from './setupDatabase';

