#!/bin/bash

# Build APK for Android using Expo EAS

cd "$(dirname "$0")/../mobile"

echo "📱 Building Android APK..."

# Check if EAS CLI is available
if ! command -v eas &> /dev/null; then
    echo "Installing EAS CLI..."
    npm install -g eas-cli
fi

# Login to Expo (if not already)
echo "Checking Expo authentication..."
eas whoami &>/dev/null || eas login

# Build APK
echo "Starting build..."
eas build --platform android --profile production

echo ""
echo "✅ APK build started!"
echo "📱 Check build status: https://expo.dev/accounts/[your-account]/builds"
echo ""
echo "Once complete, download the APK from the Expo dashboard"

