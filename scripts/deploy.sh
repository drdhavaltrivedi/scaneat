#!/bin/bash

# Deployment script for Scaneat Firebase project
# Run this after: firebase login

set -e

echo "🚀 Deploying Scaneat to Firebase..."
echo ""

# Check if logged in
if ! npx firebase-tools projects:list &>/dev/null; then
    echo "❌ Not logged in to Firebase. Please run: firebase login"
    exit 1
fi

# Set project
echo "📦 Setting Firebase project..."
npx firebase-tools use scaneat-bc079

# Build functions
echo "🔨 Building Cloud Functions..."
cd functions
npm install
npm run build
cd ..

# Deploy Firestore rules and indexes
echo "📋 Deploying Firestore rules and indexes..."
npx firebase-tools deploy --only firestore:rules,firestore:indexes

# Deploy Cloud Functions
echo "☁️  Deploying Cloud Functions..."
npx firebase-tools deploy --only functions

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Initialize database: https://us-central1-scaneat-bc079.cloudfunctions.net/setupDatabase"
echo "2. Test the app: cd web && npm run dev"

