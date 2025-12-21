# Allow Public Access to Firebase Functions

## Problem
CORS error blocking requests from localhost. Functions need to allow unauthenticated/public access.

## Quick Fix via Firebase Console

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/run?project=scaneat-bc079

2. **For each function (getProduct, analyzeHealth):**
   - Click on the function name
   - Go to "Permissions" tab
   - Click "Add Principal"
   - Principal: `allUsers`
   - Role: `Cloud Run Invoker`
   - Click "Save"

## Alternative: Use gcloud CLI

If you have gcloud installed:

```bash
# Login
gcloud auth login

# Set project
gcloud config set project scaneat-bc079

# Allow public access to getProduct
gcloud run services add-iam-policy-binding getproduct \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/run.invoker

# Allow public access to analyzeHealth
gcloud run services add-iam-policy-binding analyzehealth \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/run.invoker
```

## After Allowing Public Access

1. Refresh your browser
2. Try searching for barcode again
3. CORS error should be resolved
4. Functions should work without authentication

---

**This is the main fix needed to resolve the CORS error!**

