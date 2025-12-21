# Deploy Firebase Functions

## Quick Deploy (Using npx - No Global Install Needed)

Since you don't have permissions for global npm install, use `npx` instead:

```bash
cd /home/brilworks/scaneat

# Login to Firebase (first time only)
npx firebase login

# Set the project
npx firebase use scaneat-bc079

# Build functions (already done, but verify)
cd functions
npm run build
cd ..

# Deploy functions
npx firebase deploy --only functions
```

## Alternative: Install Firebase CLI Locally

If you prefer, you can install firebase-tools locally in the project:

```bash
cd /home/brilworks/scaneat
npm install --save-dev firebase-tools

# Then use:
npx firebase login
npx firebase use scaneat-bc079
npx firebase deploy --only functions
```

## What Happened in Your Terminal

1. **Permission Error**: `npm install -g` requires sudo/admin rights
   - Solution: Use `npx` instead (no install needed)

2. **Firebase Not Found**: Because global install failed
   - Solution: `npx firebase` works (version 15.1.0 available)

3. **Functions Built**: ✅ TypeScript compiled successfully
   - Ready to deploy!

4. **Node Version Warning**: Functions require Node 18, you have Node 20
   - This is usually fine - Node 20 is backward compatible
   - If issues occur, you can use `nvm` to switch to Node 18

## Deploy Now

Run these commands:

```bash
cd /home/brilworks/scaneat

# Login (if not already logged in)
npx firebase login

# Deploy
npx firebase deploy --only functions
```

This will deploy:
- `getProduct` - Fetch products from OpenFoodFacts
- `analyzeHealth` - Calculate health scores
- `setupDatabase` - Initialize database structure

After deployment, the "internal" error should be resolved!

