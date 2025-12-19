# Quick Start Guide - Scaneat Firebase Setup

## 🚀 Firebase is Already Connected!

Your Firebase project `scaneat-bc079` is connected with Blaze plan. Follow these steps to complete the setup:

## Step 1: Enable Firestore API (Required)

**This is the only manual step needed!**

1. Visit: https://console.cloud.google.com/apis/api/firestore.googleapis.com/overview?project=scaneat-bc079
2. Click **"Enable"** button
3. Wait 1-2 minutes for the API to propagate

Alternatively, enable via Firebase Console:
1. Go to: https://console.firebase.google.com/project/scaneat-bc079/firestore
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we have security rules)
4. Select location: **us-central1** (or your preferred region)
5. Click **"Enable"**

## Step 2: Enable Authentication

1. Go to: https://console.firebase.google.com/project/scaneat-bc079/authentication
2. Click **"Get started"**
3. Enable these sign-in methods:
   - ✅ **Email/Password**
   - ✅ **Anonymous**

## Step 3: Get Firebase Config

1. Go to: https://console.firebase.google.com/project/scaneat-bc079/settings/general
2. Scroll to **"Your apps"**
3. Click **Web icon (</>)** → Register app: **"Scaneat Web"**
4. Copy the config values

## Step 4: Update Environment Files

### Web App (`web/.env.local`):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=scaneat-bc079.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=scaneat-bc079
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=scaneat-bc079.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Mobile App (`mobile/.env`):
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=scaneat-bc079.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=scaneat-bc079
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=scaneat-bc079.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

## Step 5: Deploy Firestore Rules & Indexes

```bash
cd /home/brilworks/scaneat
firebase deploy --only firestore:rules,firestore:indexes
```

## Step 6: Deploy Cloud Functions

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

## Step 7: Initialize Database

After deploying functions, visit:
https://us-central1-scaneat-bc079.cloudfunctions.net/setupDatabase

Or use curl:
```bash
curl https://us-central1-scaneat-bc079.cloudfunctions.net/setupDatabase
```

## Step 8: Test the Connection

```bash
node scripts/test-firebase-connection.js
```

## ✅ You're Ready!

Once Firestore API is enabled, everything will work automatically:

- ✅ Products will be cached in Firestore
- ✅ Health scores will be stored
- ✅ User authentication will work
- ✅ All data will persist

## Database Structure

The app will automatically create these collections:

- **`products/{barcode}`** - Product data from OpenFoodFacts
- **`users/{userId}`** - User data and preferences
- **`_system/{docId}`** - System metadata

## Need Help?

See `FIREBASE_SETUP.md` for detailed troubleshooting.

