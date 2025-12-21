# Troubleshooting Firebase "internal" Error

## Problem
Getting `FirebaseError: internal` when searching for barcode `8901058851298` (or any barcode).

## Common Causes

### 1. Cloud Functions Not Deployed ⚠️ (Most Likely)

The Cloud Functions need to be deployed to Firebase before they can be called from the web app.

**Solution:**
```bash
cd /home/brilworks/scaneat

# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Set the project
firebase use scaneat-bc079

# Build functions
cd functions
npm install
npm run build
cd ..

# Deploy functions
firebase deploy --only functions
```

### 2. Functions Region Mismatch

The functions might be deployed to a different region than expected.

**Check:**
- Functions are deployed to `us-central1` by default
- The web app is configured to use `us-central1` (see `web/lib/firebase.ts`)

**Solution:**
If functions are in a different region, update `web/lib/firebase.ts`:
```typescript
export const functions: Functions = getFunctions(app, 'your-region');
```

### 3. Firestore Permissions

The service account might not have proper permissions.

**Check:**
1. Go to: https://console.cloud.google.com/iam-admin/iam?project=scaneat-bc079
2. Find: `firebase-adminsdk-fbsvc@scaneat-bc079.iam.gserviceaccount.com`
3. Ensure it has: `Cloud Datastore User` and `Firebase Admin` roles

### 4. Firestore API Not Enabled

**Check:**
1. Visit: https://console.cloud.google.com/apis/api/firestore.googleapis.com/overview?project=scaneat-bc079
2. If not enabled, click "Enable"

### 5. Function Runtime Error

The function might be throwing an error during execution.

**Check logs:**
```bash
firebase functions:log
```

Or in Firebase Console:
https://console.firebase.google.com/project/scaneat-bc079/functions/logs

## Quick Test

Test if the function is deployed:
```bash
# Check deployed functions
firebase functions:list
```

Should show:
- `getProduct`
- `analyzeHealth`
- `setupDatabase`

## Testing the Function Directly

You can test the function via HTTP (if deployed as HTTP function) or check the logs:

1. **Via Firebase Console:**
   - Go to: https://console.firebase.google.com/project/scaneat-bc079/functions
   - Click on `getProduct`
   - Check logs for errors

2. **Test with curl (if HTTP function):**
   ```bash
   curl -X POST https://us-central1-scaneat-bc079.cloudfunctions.net/getProduct \
     -H "Content-Type: application/json" \
     -d '{"data":{"barcode":"8901058851298"}}'
   ```

## Improved Error Handling

I've updated the error handling to show more helpful messages:

- ✅ Better error extraction from Firebase errors
- ✅ User-friendly error messages
- ✅ Specific messages for different error types

The error handler is in `web/lib/errorHandler.ts` and is now used in:
- `web/app/page.tsx`
- `web/app/product/[barcode]/page.tsx`

## Next Steps

1. **Deploy Functions** (if not deployed):
   ```bash
   firebase deploy --only functions
   ```

2. **Verify Deployment**:
   - Check Firebase Console Functions page
   - Verify all 3 functions are listed

3. **Test Again**:
   - Try searching for barcode `8901058851298`
   - Check browser console for detailed error messages
   - Check Firebase Functions logs

4. **If Still Failing**:
   - Check Firebase Functions logs for runtime errors
   - Verify Firestore is enabled and accessible
   - Ensure service account has proper permissions

---

**Note**: The product `8901058851298` exists in OpenFoodFacts API (verified), so the issue is likely with the Cloud Functions deployment or configuration.

