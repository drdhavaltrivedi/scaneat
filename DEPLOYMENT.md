# Deployment Guide

## Prerequisites

1. ✅ Firebase project created: `scaneat-bc079`
2. ✅ Firestore database enabled
3. ✅ Authentication enabled
4. ✅ Functions built successfully

## Step 1: Authenticate with Firebase

```bash
cd /home/brilworks/scaneat
npx firebase-tools login
```

This will open a browser window for authentication.

## Step 2: Deploy Everything

### Option A: Use the deployment script (Recommended)

```bash
cd /home/brilworks/scaneat
./scripts/deploy.sh
```

### Option B: Deploy manually

```bash
cd /home/brilworks/scaneat

# Set Firebase project
npx firebase-tools use scaneat-bc079

# Build functions
cd functions
npm install
npm run build
cd ..

# Deploy Firestore rules and indexes
npx firebase-tools deploy --only firestore:rules,firestore:indexes

# Deploy Cloud Functions
npx firebase-tools deploy --only functions
```

## Step 3: Initialize Database

After deployment, initialize the database:

```bash
curl https://us-central1-scaneat-bc079.cloudfunctions.net/setupDatabase
```

Or visit in browser:
https://us-central1-scaneat-bc079.cloudfunctions.net/setupDatabase

## Step 4: Verify Deployment

### Check Functions

Visit Firebase Console:
https://console.firebase.google.com/project/scaneat-bc079/functions

You should see:
- `getProduct`
- `analyzeHealth`
- `setupDatabase`

### Check Firestore

Visit:
https://console.firebase.google.com/project/scaneat-bc079/firestore

You should see:
- Collections: `_system`, `products`
- Rules deployed
- Indexes created

### Test a Function

```bash
curl -X POST https://us-central1-scaneat-bc079.cloudfunctions.net/getProduct \
  -H "Content-Type: application/json" \
  -d '{"data":{"barcode":"3017620422003"}}'
```

## Deployment Status

After successful deployment:

✅ **Firestore Rules** - Deployed  
✅ **Firestore Indexes** - Created  
✅ **Cloud Functions** - Deployed  
✅ **Database** - Initialized  

## Troubleshooting

### Error: "Failed to authenticate"
```bash
npx firebase-tools login
```

### Error: "Functions deploy failed"
1. Check Node.js version: `node --version` (should be 18+)
2. Rebuild functions: `cd functions && npm run build`
3. Check Firebase project: `npx firebase-tools use scaneat-bc079`

### Error: "Firestore rules deploy failed"
1. Check `firestore.rules` syntax
2. Validate rules: `npx firebase-tools firestore:rules:validate`

### Functions not appearing
1. Wait 1-2 minutes for propagation
2. Check Firebase Console
3. Check function logs: `npx firebase-tools functions:log`

## Next Steps

After deployment:

1. **Update environment variables** in `web/.env.local` and `mobile/.env`
2. **Start the web app**: `cd web && npm run dev`
3. **Start the mobile app**: `cd mobile && npm start`
4. **Test scanning**: Try scanning a barcode!

## Continuous Deployment

For automatic deployments, set up:
- GitHub Actions
- CI/CD pipeline
- Automated testing

See `scripts/deploy.sh` for the deployment script.

