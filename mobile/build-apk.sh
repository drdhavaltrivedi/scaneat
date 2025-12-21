#!/bin/bash

# Script to build Android APK for Scaneat
# This script provides options for building the APK

set -e

echo "📱 Scaneat Android APK Builder"
echo "================================"
echo ""

# Check if we're in the mobile directory
if [ ! -f "package.json" ] || [ ! -f "app.json" ]; then
    echo "❌ Error: Please run this script from the mobile directory"
    exit 1
fi

# Check if EAS CLI is available
if command -v eas &> /dev/null || npx eas-cli --version &> /dev/null; then
    echo "✅ EAS CLI found"
else
    echo "⚠️  EAS CLI not found. Installing..."
    npm install -g eas-cli || echo "⚠️  Global install failed, will use npx"
fi

echo ""
echo "Choose build method:"
echo "1) EAS Build (Cloud) - Recommended, easiest"
echo "2) Local Build (Requires Android Studio)"
echo "3) Check build status"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting EAS Build (Cloud)..."
        echo ""
        echo "Note: You'll need to:"
        echo "  1. Login to Expo: npx eas-cli login"
        echo "  2. Configure project: npx eas-cli build:configure"
        echo ""
        read -p "Press Enter to continue or Ctrl+C to cancel..."
        
        echo ""
        echo "Building APK..."
        npx eas-cli build --platform android --profile preview
        
        echo ""
        echo "✅ Build started! Check your Expo dashboard for progress."
        echo "   https://expo.dev/accounts/[your-account]/builds"
        ;;
    2)
        echo ""
        echo "🔧 Starting Local Build..."
        echo ""
        echo "Note: This requires Android Studio and Android SDK"
        echo ""
        read -p "Press Enter to continue or Ctrl+C to cancel..."
        
        echo ""
        echo "Step 1: Generating native Android project..."
        npx expo prebuild --platform android --clean
        
        if [ ! -d "android" ]; then
            echo "❌ Error: Android project not generated"
            exit 1
        fi
        
        echo ""
        echo "Step 2: Building APK..."
        cd android
        
        if [ -f "gradlew" ]; then
            chmod +x gradlew
            ./gradlew assembleRelease
            echo ""
            echo "✅ APK built successfully!"
            echo "   Location: android/app/build/outputs/apk/release/app-release.apk"
        else
            echo "❌ Error: gradlew not found. Please check Android Studio setup."
            exit 1
        fi
        ;;
    3)
        echo ""
        echo "📊 Checking build status..."
        npx eas-cli build:list --platform android --limit 5
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✨ Done!"

