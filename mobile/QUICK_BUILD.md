# 🚀 Quick Android APK Build Guide

## Fastest Method: EAS Build (Cloud)

### Step 1: Login to Expo
```bash
cd /home/brilworks/scaneat/mobile
npx eas-cli login
```
(You'll need to create a free Expo account if you don't have one)

### Step 2: Configure Build
```bash
npx eas-cli build:configure
```
(Just press Enter to use defaults)

### Step 3: Build APK
```bash
# Build preview APK (for testing)
npx eas-cli build --platform android --profile preview

# Or build production APK
npx eas-cli build --platform android --profile production
```

### Step 4: Download APK
- The build runs in the cloud (takes ~10-15 minutes)
- You'll get a download link when it's ready
- Or check: https://expo.dev/accounts/[your-account]/builds

---

## Alternative: Use Build Script

```bash
cd /home/brilworks/scaneat/mobile
./build-apk.sh
```

Follow the prompts!

---

## What You'll Get

- **APK File**: Ready to install on Android devices
- **Package**: `com.scaneat.app`
- **Version**: 1.0.0
- **Size**: ~20-30 MB (approximate)

---

## Install APK on Device

1. Transfer APK to Android device
2. Enable "Install from Unknown Sources" in Settings
3. Tap the APK file to install
4. Open Scaneat app!

---

**That's it! Your APK will be ready in ~15 minutes! 🎉**

