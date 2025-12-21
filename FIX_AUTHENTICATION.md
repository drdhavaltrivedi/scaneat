# Fix Authentication Error for Firebase Functions

## Problem
Functions are showing: "The request was not authenticated. Either allow unauthenticated invocations or set the proper Authorization header."

## Solution Options

### Option 1: Allow Unauthenticated Invocations (Quick Fix)

For callable functions that should be accessible without login:

```bash
cd /home/brilworks/scaneat

# Allow unauthenticated access to getProduct
npx firebase functions:config:set functions.invoker=public

# Or use gcloud to set IAM policy
gcloud functions add-iam-policy-binding getProduct \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/cloudfunctions.invoker \
  --project=scaneat-bc079

gcloud functions add-iam-policy-binding analyzeHealth \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/cloudfunctions.invoker \
  --project=scaneat-bc079
```

### Option 2: Use Firebase SDK Authentication (Recommended)

The Firebase SDK should handle authentication automatically. The issue might be that the client isn't authenticated. Let's ensure users can call functions anonymously:

1. **Sign in anonymously** before calling functions
2. **Or** configure functions to allow unauthenticated calls

### Option 3: Update Function Code to Allow Unauthenticated

Modify the functions to explicitly allow unauthenticated calls (if that's the desired behavior).

## Quick Fix - Allow Public Access

Run these commands to allow public access to the functions:

```bash
cd /home/brilworks/scaneat

# Allow public access to getProduct
gcloud run services add-iam-policy-binding getproduct \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/run.invoker \
  --project=scaneat-bc079

# Allow public access to analyzeHealth  
gcloud run services add-iam-policy-binding analyzehealth \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/run.invoker \
  --project=scaneat-bc079
```

Note: You need `gcloud` CLI installed and authenticated.

## Alternative: Sign in Anonymously

Update the web app to sign in anonymously before calling functions:

```typescript
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';

// Sign in anonymously before calling functions
await signInAnonymously(auth);
```

