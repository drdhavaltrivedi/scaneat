# 📱 Building Android APK for Scaneat

## Option 1: EAS Build (Recommended - Cloud Build)

EAS Build is the easiest way to build your APK in the cloud.

### Prerequisites:
1. Expo account (free) - Sign up at https://expo.dev
2. EAS CLI installed

### Steps:

1. **Install EAS CLI** (if not already installed):
```bash
npm install -g eas-cli
```

2. **Login to Expo**:
```bash
cd /home/brilworks/scaneat/mobile
eas login
```

3. **Configure EAS** (if not already done):
```bash
eas build:configure
```

4. **Build APK**:
```bash
# For preview/testing (APK)
npm run build:android

# Or for production (APK)
npm run build:android:prod
```

5. **Download APK**:
   - The build will run in the cloud
   - You'll get a link to download the APK when it's ready
   - Or check: https://expo.dev/accounts/[your-account]/builds

---

## Option 2: Local Build (Requires Android Studio)

Build the APK locally on your machine.

### Prerequisites:
1. Android Studio installed
2. Android SDK configured
3. Java JDK installed

### Steps:

1. **Generate native Android project**:
```bash
cd /home/brilworks/scaneat/mobile
npx expo prebuild --platform android
```

2. **Build APK**:
```bash
cd android
./gradlew assembleRelease
```

3. **Find APK**:
   - Location: `android/app/build/outputs/apk/release/app-release.apk`

---

## Option 3: Expo Development Build (For Testing)

1. **Start development server**:
```bash
npm start
```

2. **Build development client**:
```bash
eas build --profile development --platform android
```

3. **Install on device and scan QR code** from Expo Go or development build

---

## Quick Build Commands

```bash
# Navigate to mobile directory
cd /home/brilworks/scaneat/mobile

# Build APK with EAS (cloud)
npm run build:android

# Build production APK
npm run build:android:prod

# Local build (requires Android Studio)
npm run build:local:android
```

---

## APK Location After Build

### EAS Build:
- Download link provided in terminal
- Or check: https://expo.dev/accounts/[your-account]/builds

### Local Build:
- `android/app/build/outputs/apk/release/app-release.apk`

---

## Notes:

- **Package Name**: `com.scaneat.app`
- **Version**: 1.0.0
- **Permissions**: Camera access required
- **Minimum Android**: Check Expo SDK 54 requirements

---

## Troubleshooting:

1. **EAS not logged in**: Run `eas login`
2. **Build fails**: Check error messages in terminal
3. **Missing dependencies**: Run `npm install` first
4. **Android Studio issues**: Make sure Android SDK is properly configured

---

**Ready to build! Choose the method that works best for you! 🚀**

