#!/bin/bash

# Quick deployment script for Scaneat
# This will prompt for Firebase login if needed

set -e

echo "🚀 Scaneat Deployment Script"
echo "=============================="
echo ""

cd "$(dirname "$0")/.."

# Check if already logged in
if npx firebase-tools projects:list &>/dev/null 2>&1; then
    echo "✅ Already authenticated with Firebase"
else
    echo "🔐 Please authenticate with Firebase..."
    echo "   This will open a browser window"
    npx firebase-tools login
fi

echo ""
echo "📦 Setting Firebase project..."
npx firebase-tools use scaneat-bc079

echo ""
echo "🔨 Building Cloud Functions..."
cd functions
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
fi
npm run build
cd ..

echo ""
echo "📋 Deploying Firestore rules and indexes..."
npx firebase-tools deploy --only firestore:rules,firestore:indexes

echo ""
echo "☁️  Deploying Cloud Functions..."
npx firebase-tools deploy --only functions

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Initialize database:"
echo "      https://us-central1-scaneat-bc079.cloudfunctions.net/setupDatabase"
echo ""
echo "   2. Test the app:"
echo "      cd web && npm run dev"
echo ""

