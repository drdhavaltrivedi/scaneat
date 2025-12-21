# Fix CORS Error for Firebase Functions

## Problem
```
Access to fetch at 'https://us-central1-scaneat-bc079.cloudfunctions.net/getProduct' 
from origin 'http://localhost:3001' has been blocked by CORS policy
```

## Root Cause
Firebase callable functions should handle CORS automatically, but there might be an issue with:
1. Function deployment configuration
2. Authentication requirements
3. Function URL/region mismatch

## Solutions

### Solution 1: Allow Unauthenticated Invocations (Recommended)

Firebase callable functions require authentication by default. We need to allow unauthenticated calls:

```bash
# Allow unauthenticated access to functions
gcloud run services add-iam-policy-binding getproduct \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/run.invoker \
  --project=scaneat-bc079

gcloud run services add-iam-policy-binding analyzehealth \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/run.invoker \
  --project=scaneat-bc079
```

### Solution 2: Enable Anonymous Authentication

1. Go to: https://console.firebase.google.com/project/scaneat-bc079/authentication
2. Click "Sign-in method"
3. Enable "Anonymous"
4. Save

### Solution 3: Check Function URLs

Verify the function URLs match:
- Function URL: `https://us-central1-scaneat-bc079.cloudfunctions.net/getProduct`
- Region: `us-central1`
- Project: `scaneat-bc079`

### Solution 4: Redeploy Functions with CORS

If the above don't work, we might need to add explicit CORS headers to the functions (though callable functions should handle this automatically).

## Quick Fix

Run this command to allow public access:

```bash
cd /home/brilworks/scaneat

# Install gcloud if not installed
# Then run:
gcloud auth login
gcloud config set project scaneat-bc079

# Allow public access
gcloud run services add-iam-policy-binding getproduct \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/run.invoker

gcloud run services add-iam-policy-binding analyzehealth \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/run.invoker
```

## Alternative: Use HTTP Functions Instead

If callable functions continue to have CORS issues, we could convert them to HTTP functions with explicit CORS headers, but callable functions are preferred for Firebase integration.

---

**The CORS error is the main blocker. Once functions allow unauthenticated/public access, the error should be resolved.**

