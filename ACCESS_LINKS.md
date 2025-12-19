# 🔗 Scaneat Access Links

## 📦 GitHub Repository

**🔗 https://github.com/drdhavaltrivedi/scaneat**

- **Clone:** `git clone https://github.com/drdhavaltrivedi/scaneat.git`
- **View Code:** Browse all source code online
- **Issues:** Report bugs or request features

---

## 🌐 Web Application

### Deploy to Vercel (Recommended)

1. **Visit:** https://vercel.com
2. **Sign in** with GitHub
3. **Import** repository: `drdhavaltrivedi/scaneat`
4. **Set Root Directory:** `web`
5. **Add Environment Variables:**
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
6. **Deploy**

**Your app will be live at:** `https://scaneat-[your-username].vercel.app`

### Deploy to Firebase Hosting

```bash
cd /home/brilworks/scaneat
firebase deploy --only hosting
```

**Access:** https://scaneat-bc079.web.app

---

## 📱 Mobile App (Android APK)

### Build APK with Expo EAS

1. **Sign up:** https://expo.dev
2. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```
3. **Login:**
   ```bash
   eas login
   ```
4. **Build APK:**
   ```bash
   cd /home/brilworks/scaneat/mobile
   eas build:configure
   eas build --platform android --profile production
   ```
5. **Download APK:**
   - Visit: https://expo.dev/accounts/[your-account]/builds
   - Download the completed APK
   - Install on your Android device

### Quick Build Command

```bash
cd /home/brilworks/scaneat/mobile
npm install -g eas-cli
eas login
eas build --platform android --profile production
```

**APK will be available at:** Expo dashboard after build completes

---

## 🔥 Firebase Console

- **Project Dashboard:** https://console.firebase.google.com/project/scaneat-bc079
- **Firestore Database:** https://console.firebase.google.com/project/scaneat-bc079/firestore
- **Cloud Functions:** https://console.firebase.google.com/project/scaneat-bc079/functions
- **Authentication:** https://console.firebase.google.com/project/scaneat-bc079/authentication

---

## 🚀 Quick Start Commands

### Push to GitHub
```bash
cd /home/brilworks/scaneat
git push -u origin main
```

### Deploy Web App
```bash
# Option 1: Vercel (via web interface)
# Visit: https://vercel.com and import repository

# Option 2: Firebase Hosting
cd /home/brilworks/scaneat
firebase deploy --only hosting
```

### Build APK
```bash
cd /home/brilworks/scaneat/mobile
eas build --platform android --profile production
```

---

## 📝 Next Steps

1. ✅ **GitHub Repo:** https://github.com/drdhavaltrivedi/scaneat
2. ⏳ **Deploy Web App:** Follow Vercel/Firebase instructions above
3. ⏳ **Build APK:** Follow Expo EAS instructions above
4. ⏳ **Test:** Try scanning a barcode!

---

**All links and instructions are ready!** 🎉

