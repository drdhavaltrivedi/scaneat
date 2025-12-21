# Enable Anonymous Authentication in Firebase

## Problem
Getting error: `auth/configuration-not-found` when trying to sign in anonymously.

## Solution: Enable Anonymous Authentication

Anonymous authentication needs to be enabled in Firebase Console:

### Steps:

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/project/scaneat-bc079/authentication

2. **Enable Anonymous Sign-in:**
   - Click on the "Sign-in method" tab
   - Find "Anonymous" in the list
   - Click on it
   - Toggle "Enable" to ON
   - Click "Save"

3. **Alternative: Use gcloud CLI:**
   ```bash
   gcloud auth login
   gcloud config set project scaneat-bc079
   
   # Enable anonymous auth
   gcloud identity providers create \
     --project=scaneat-bc079 \
     --provider-id=anonymous \
     --enabled
   ```

## After Enabling

Once anonymous authentication is enabled:
- The app will automatically sign in users anonymously
- Functions can be called with proper authentication
- No user registration required

## Alternative: Allow Unauthenticated Function Calls

If you don't want to use authentication, you can allow unauthenticated calls to functions:

```bash
# Allow public access to functions
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

## Current Status

The code has been updated to handle auth errors gracefully:
- If anonymous auth fails, it continues without auth
- Functions will be called without authentication
- This works if functions allow unauthenticated calls

---

**Quick Fix**: Enable Anonymous authentication in Firebase Console (recommended).

