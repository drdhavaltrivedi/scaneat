# ✅ Firebase Configuration Updated

## Changes Made

### 1. Updated Storage Bucket
- **Web**: Updated default storage bucket from `scaneat-bc079.appspot.com` to `scaneat-bc079.firebasestorage.app`
- **Mobile**: Updated default storage bucket from `scaneat-bc079.appspot.com` to `scaneat-bc079.firebasestorage.app`

### 2. Created Environment Files
- **Web**: Created `web/.env.local` with Firebase configuration
- **Mobile**: Created `mobile/.env` with Firebase configuration

### 3. Updated Mobile Package Name
- Changed Android package name from `com.scaneat.app` to `com.brilworks.scaneat` in `mobile/app.json`

## Configuration Details

### Project Information
- **Project ID**: `scaneat-bc079`
- **Project Number**: `127152302014`
- **Storage Bucket**: `scaneat-bc079.firebasestorage.app`

### API Key
- **API Key**: `AIzaSyA3JiZ1oxbEwgvvKolNw3jaDy_DEKw8jeI` ✅ Configured

### Mobile App
- **Package Name**: `com.brilworks.scaneat` ✅ Updated
- **App ID**: `1:127152302014:android:2efce1e767927a11c67bef` ✅ Configured

### Web App
- **Messaging Sender ID**: `127152302014` ✅ Configured
- **App ID**: ⚠️ **Needs to be set** (see below)

## ⚠️ Action Required: Web App ID

The web app ID is not yet configured. You need to register a web app in Firebase Console:

1. Go to: https://console.firebase.google.com/project/scaneat-bc079/settings/general
2. Scroll down to **"Your apps"** section
3. Click the **Web icon (</>)** to add a web app
4. Register app name: **"Scaneat Web"**
5. Copy the `appId` from the config
6. Update `web/.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_APP_ID=<your-web-app-id>
   ```

## Verification

To verify the configuration is working:

### Web App
```bash
cd web
npm run dev
```
Check browser console for Firebase initialization errors.

### Mobile App
```bash
cd mobile
npm start
```
Check Expo logs for Firebase initialization errors.

## Files Updated

1. ✅ `web/lib/firebase.ts` - Updated storage bucket default
2. ✅ `mobile/lib/firebase.ts` - Updated storage bucket default
3. ✅ `mobile/app.json` - Updated Android package name
4. ✅ `web/.env.local` - Created with Firebase config
5. ✅ `mobile/.env` - Created with Firebase config

## Next Steps

1. ✅ Register web app in Firebase Console (if not done)
2. ✅ Update `NEXT_PUBLIC_FIREBASE_APP_ID` in `web/.env.local`
3. ✅ Test web app: `cd web && npm run dev`
4. ✅ Test mobile app: `cd mobile && npm start`
5. ✅ Deploy Firestore rules: `firebase deploy --only firestore:rules,firestore:indexes`

---

**Status**: Configuration updated successfully! 🎉

