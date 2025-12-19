# 🚀 Complete Deployment Guide

## ✅ GitHub Repository

**Repository Created:** https://github.com/drdhavaltrivedi/scaneat

### Push Code to GitHub

```bash
cd /home/brilworks/scaneat

# If not already pushed, use one of these methods:

# Method 1: Using GitHub CLI (if authenticated)
gh auth login
git push -u origin main

# Method 2: Using Personal Access Token
git remote set-url origin https://YOUR_TOKEN@github.com/drdhavaltrivedi/scaneat.git
git push -u origin main

# Method 3: SSH (if SSH key is set up)
git remote set-url origin git@github.com:drdhavaltrivedi/scaneat.git
git push -u origin main
```

---

## 🌐 Deploy Web App

### Option 1: Deploy to Vercel (Recommended - Easiest)

1. **Go to Vercel:**
   - Visit: https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project:**
   - Click "Add New Project"
   - Import from GitHub: `drdhavaltrivedi/scaneat`
   - Root Directory: `web`
   - Framework Preset: Next.js

3. **Environment Variables:**
   Add these in Vercel project settings:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=scaneat-bc079.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=scaneat-bc079
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=scaneat-bc079.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Deploy:**
   - Click "Deploy"
   - Your app will be live at: `https://scaneat.vercel.app` (or custom domain)

### Option 2: Deploy to Firebase Hosting

```bash
cd /home/brilworks/scaneat

# Build the web app
cd web
npm install
npm run build

# Deploy to Firebase
cd ..
firebase deploy --only hosting
```

**Access:** https://scaneat-bc079.web.app

### Option 3: Deploy to Netlify

1. Visit: https://app.netlify.com
2. Connect GitHub repository
3. Build settings:
   - Base directory: `web`
   - Build command: `npm run build`
   - Publish directory: `web/.next`

---

## 📱 Build Android APK

### Prerequisites

1. **Expo Account:**
   - Sign up at: https://expo.dev
   - Install EAS CLI: `npm install -g eas-cli`

2. **Login to Expo:**
   ```bash
   eas login
   ```

### Build APK

```bash
cd /home/brilworks/scaneat/mobile

# Initialize EAS (first time only)
eas build:configure

# Build Android APK
eas build --platform android --profile production
```

### Alternative: Local Build (Development APK)

```bash
cd /home/brilworks/scaneat/mobile

# Install dependencies
npm install

# Build APK locally (requires Android SDK)
npx expo export:embed
npx expo prebuild
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### Download Built APK

After EAS build completes:
1. Visit: https://expo.dev/accounts/[your-account]/builds
2. Download the APK file
3. Install on your Android device

---

## 🔗 Access Links

### GitHub Repository
**🔗 https://github.com/drdhavaltrivedi/scaneat**

### Web App (After Deployment)
- **Vercel:** https://scaneat.vercel.app (or your custom domain)
- **Firebase Hosting:** https://scaneat-bc079.web.app
- **Netlify:** https://scaneat.netlify.app (or your custom domain)

### Mobile App
- **APK Download:** Available after EAS build completes
- **Expo Go:** Scan QR code from Expo dashboard for testing

### Firebase Console
- **Project:** https://console.firebase.google.com/project/scaneat-bc079
- **Functions:** https://console.firebase.google.com/project/scaneat-bc079/functions
- **Firestore:** https://console.firebase.google.com/project/scaneat-bc079/firestore

---

## 📋 Quick Deployment Checklist

### GitHub
- [x] Repository created: https://github.com/drdhavaltrivedi/scaneat
- [ ] Code pushed to GitHub
- [ ] README updated

### Web App
- [ ] Deploy to Vercel/Firebase/Netlify
- [ ] Environment variables configured
- [ ] Domain configured (optional)
- [ ] Test live deployment

### Mobile App
- [ ] Expo account created
- [ ] EAS CLI installed and logged in
- [ ] APK built via EAS
- [ ] APK downloaded and tested

### Firebase
- [ ] Cloud Functions deployed
- [ ] Firestore rules deployed
- [ ] Database initialized

---

## 🛠️ Troubleshooting

### GitHub Push Issues
```bash
# Use token authentication
git remote set-url origin https://YOUR_TOKEN@github.com/drdhavaltrivedi/scaneat.git
git push -u origin main
```

### Vercel Deployment Issues
- Check environment variables are set
- Verify build command: `npm run build`
- Check build logs in Vercel dashboard

### APK Build Issues
- Ensure Expo account is active
- Check EAS build status: https://expo.dev/builds
- Verify app.json configuration

---

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/drdhavaltrivedi/scaneat/issues
- Documentation: See README.md

