# Firebase Setup Guide for Scaneat

## Prerequisites

- Firebase Blaze Plan (already enabled)
- Firebase project: `scaneat-bc079`

## Step 1: Enable Required APIs

### Enable Firestore API

1. Go to [Firebase Console - Firestore](https://console.firebase.google.com/project/scaneat-bc079/firestore)
2. Click "Create database"
3. Choose "Start in production mode" (we have security rules)
4. Select a location (e.g., `us-central1`)
5. Click "Enable"

### Enable Authentication

1. Go to [Firebase Console - Authentication](https://console.firebase.google.com/project/scaneat-bc079/authentication)
2. Click "Get started"
3. Enable the following sign-in methods:
   - Email/Password
   - Anonymous

### Enable Cloud Functions

1. Go to [Firebase Console - Functions](https://console.firebase.google.com/project/scaneat-bc079/functions)
2. Functions should be enabled automatically with Blaze plan

## Step 2: Get Firebase Configuration

1. Go to [Firebase Console - Project Settings](https://console.firebase.google.com/project/scaneat-bc079/settings/general)
2. Scroll down to "Your apps"
3. Click the web icon (</>) to add a web app
4. Register app name: "Scaneat Web"
5. Copy the Firebase configuration

Update `web/.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=scaneat-bc079.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=scaneat-bc079
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=scaneat-bc079.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

For mobile app, update `mobile/.env`:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=scaneat-bc079.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=scaneat-bc079
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=scaneat-bc079.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Step 3: Deploy Firestore Rules and Indexes

```bash
cd /home/brilworks/scaneat
firebase deploy --only firestore:rules,firestore:indexes
```

## Step 4: Deploy Cloud Functions

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

## Step 5: Initialize Database

After deploying functions, call the setup function:

```bash
curl https://us-central1-scaneat-bc079.cloudfunctions.net/setupDatabase
```

Or visit in browser:
https://us-central1-scaneat-bc079.cloudfunctions.net/setupDatabase

## Database Structure

### Collections

#### `products/{barcode}`
Stores product information from OpenFoodFacts
- Fields: name, brand, category, ingredients, nutrition, healthScore, etc.
- Public read access
- Only Cloud Functions can write

#### `users/{userId}`
User data and preferences
- Subcollections:
  - `preferences/{preferenceId}` - User dietary preferences
  - `history/{historyId}` - Scanned product history
  - `favorites/{favoriteId}` - Favorite products

#### `_system/{docId}`
System metadata
- Used for health checks and initialization

## Security Rules

Firestore security rules are defined in `firestore.rules`:
- Products: Public read, functions-only write
- Users: Users can only access their own data

## Indexes

Firestore indexes are defined in `firestore.indexes.json`:
- User history queries by userId and scannedAt

## Testing the Connection

### Test Firestore Connection

```javascript
// In browser console or Node.js
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

const testRef = doc(db, '_system', 'health');
const snapshot = await getDoc(testRef);
console.log('Database connected:', snapshot.exists());
```

### Test Cloud Functions

```bash
# Test getProduct function
curl -X POST https://us-central1-scaneat-bc079.cloudfunctions.net/getProduct \
  -H "Content-Type: application/json" \
  -d '{"data":{"barcode":"3017620422003"}}'
```

## Troubleshooting

### Firestore API Not Enabled
Error: `PERMISSION_DENIED: Cloud Firestore API has not been used`

Solution: Enable Firestore in [Google Cloud Console](https://console.cloud.google.com/apis/api/firestore.googleapis.com/overview?project=scaneat-bc079)

### Functions Not Deploying
Error: `Functions deploy failed`

Solution:
1. Ensure you're logged in: `firebase login`
2. Check Node.js version (should be 18+)
3. Run `npm install` in functions directory
4. Check Firebase project: `firebase use scaneat-bc079`

### Authentication Not Working
Error: `auth/configuration-not-found`

Solution:
1. Verify Firebase config in `.env` files
2. Check Authentication is enabled in Firebase Console
3. Verify sign-in methods are enabled

## Next Steps

1. ✅ Enable Firestore API
2. ✅ Enable Authentication
3. ✅ Deploy Firestore rules and indexes
4. ✅ Deploy Cloud Functions
5. ✅ Initialize database
6. ✅ Test connection
7. ✅ Start scanning products!

