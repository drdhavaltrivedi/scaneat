# 🚀 Deploy Now - Quick Guide

## One-Command Deployment

Since Firebase CLI requires interactive authentication, run this command:

```bash
cd /home/brilworks/scaneat
./scripts/deploy-now.sh
```

This script will:
1. ✅ Check if you're logged in (prompt if not)
2. ✅ Set the Firebase project
3. ✅ Build Cloud Functions
4. ✅ Deploy Firestore rules and indexes
5. ✅ Deploy Cloud Functions

## Manual Steps (if script doesn't work)

### Step 1: Login to Firebase
```bash
cd /home/brilworks/scaneat
npx firebase-tools login
```
This will open a browser for authentication.

### Step 2: Deploy
```bash
# Set project
npx firebase-tools use scaneat-bc079

# Deploy everything
npx firebase-tools deploy --only firestore:rules,firestore:indexes,functions
```

## After Deployment

1. **Initialize Database:**
   Visit: https://us-central1-scaneat-bc079.cloudfunctions.net/setupDatabase

2. **Verify Functions:**
   Check: https://console.firebase.google.com/project/scaneat-bc079/functions

3. **Test the App:**
   ```bash
   cd web && npm run dev
   ```

## Current Status

✅ Functions built and ready  
✅ Firestore connected  
✅ Configuration complete  
⏳ Waiting for deployment  

---

**Ready to deploy!** Run `./scripts/deploy-now.sh` when ready.

