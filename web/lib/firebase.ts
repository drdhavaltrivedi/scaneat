import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getFunctions, Functions } from 'firebase/functions';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Firebase configuration
// These should be set as environment variables in production
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'your-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'scaneat-bc079.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'scaneat-bc079',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'scaneat-bc079.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'your-sender-id',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'your-app-id',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
// Initialize Functions with region (us-central1 is default)
export const functions: Functions = getFunctions(app, 'us-central1');

// Verify Firebase initialization
if (typeof window !== 'undefined') {
  console.log('Firebase initialized:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    functionsRegion: 'us-central1',
    hasAuth: !!auth,
    hasFunctions: !!functions,
  });
}

// Initialize Analytics (only in browser environment)
// Analytics is initialized lazily to avoid SSR issues
export const initAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  } catch (error) {
    console.warn('Firebase Analytics initialization failed:', error);
  }
  
  return null;
};

// Export analytics getter (will be set after initialization)
export let analytics: Analytics | null = null;

// Auto-initialize analytics in browser
if (typeof window !== 'undefined') {
  initAnalytics().then((analyticsInstance) => {
    analytics = analyticsInstance;
  });
}

// Helper function to call HTTP functions (with CORS support)
export const callFunction = async (functionName: string, data: any): Promise<any> => {
  const functionUrl = `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/${functionName}`;
  
  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Error calling ${functionName}:`, error);
    throw error;
  }
};

export default app;

