# 🚀 Start Building Android APK Now!

## Quick Start (3 Steps)

### 1. Navigate to Mobile Directory
```bash
cd /home/brilworks/scaneat/mobile
```

### 2. Login to Expo (First Time Only)
```bash
npx eas-cli login
```
- If you don't have an account, create one at https://expo.dev (free)
- Enter your email and password

### 3. Build APK
```bash
# For testing/preview
npx eas-cli build --platform android --profile preview

# Or for production
npx eas-cli build --platform android --profile production
```

---

## What Happens Next?

1. **Build starts** in the cloud (Expo servers)
2. **Takes ~10-15 minutes** to complete
3. **You'll get a link** to download the APK
4. **Install on Android** device and test!

---

## Alternative: Interactive Build Script

```bash
cd /home/brilworks/scaneat/mobile
./build-apk.sh
```

This will guide you through the process step by step.

---

## Build Configuration

✅ **Already configured:**
- Package name: `com.scaneat.app`
- Version: 1.0.0
- Build type: APK (not AAB)
- Camera permission: Enabled
- EAS build profiles: preview & production

---

## After Build Completes

1. **Download APK** from the link provided
2. **Transfer to Android device** (via USB, email, or cloud)
3. **Enable "Install from Unknown Sources"** in Android Settings
4. **Install and test!**

---

## Troubleshooting

**"Not logged in" error:**
```bash
npx eas-cli login
```

**"Project not configured" error:**
```bash
npx eas-cli build:configure
```

**Build fails:**
- Check error messages in terminal
- Ensure all dependencies are installed: `npm install`
- Verify app.json is correct

---

## Ready to Build!

Run this command to start:
```bash
cd /home/brilworks/scaneat/mobile && npx eas-cli build --platform android --profile preview
```

**Your APK will be ready in ~15 minutes! 📱✨**

