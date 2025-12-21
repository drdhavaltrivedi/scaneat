# 🚨 URGENT: Fix CORS Error - Allow Public Access to Functions

## The Problem
```
Access to fetch at 'https://us-central1-scaneat-bc079.cloudfunctions.net/getProduct' 
from origin 'http://localhost:3001' has been blocked by CORS policy
```

## ✅ Solution: Allow Public Access via Google Cloud Console

### Step-by-Step Instructions:

1. **Open Google Cloud Console:**
   - Go to: https://console.cloud.google.com/run?project=scaneat-bc079
   - You may need to login with your Google account

2. **For `getProduct` function:**
   - Find and click on the service named `getproduct` (or `getProduct`)
   - Click on the **"Permissions"** tab
   - Click **"Add Principal"** button
   - In "New principals" field, type: `allUsers`
   - In "Select a role" dropdown, choose: **"Cloud Run Invoker"**
   - Click **"Save"**
   - Confirm when asked about making the function public

3. **For `analyzeHealth` function:**
   - Find and click on the service named `analyzehealth` (or `analyzeHealth`)
   - Repeat the same steps as above:
     - Click "Permissions" tab
     - Click "Add Principal"
     - Principal: `allUsers`
     - Role: `Cloud Run Invoker`
     - Click "Save"

4. **Refresh your browser** and try again!

## Alternative: Direct Links

If you can't find the functions, try these direct links:

- **getProduct**: https://console.cloud.google.com/run/detail/us-central1/getproduct/permissions?project=scaneat-bc079
- **analyzeHealth**: https://console.cloud.google.com/run/detail/us-central1/analyzehealth/permissions?project=scaneat-bc079

## What This Does

- Allows anyone (including localhost) to call the functions
- Removes the CORS blocking
- Functions will work without authentication

## After Fixing

1. ✅ CORS error will be gone
2. ✅ Functions will be callable from localhost
3. ✅ No authentication needed
4. ✅ App will work!

---

**This is the ONLY fix needed. Once you allow public access, everything will work!**

