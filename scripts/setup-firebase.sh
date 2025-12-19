#!/bin/bash

# Script to set up Firebase project for Scaneat
# This script helps configure Firebase services

echo "🚀 Setting up Firebase for Scaneat..."

# Check if firebase-tools is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Login to Firebase
echo "📝 Logging in to Firebase..."
firebase login

# Initialize Firebase project
echo "🔧 Initializing Firebase project..."
cd "$(dirname "$0")/.."

# Set project
echo "📦 Setting Firebase project..."
firebase use scaneat-bc079 || firebase use --add

# Enable Firestore
echo "🗄️  Enabling Firestore..."
echo "Please enable Firestore in the Firebase Console:"
echo "https://console.firebase.google.com/project/scaneat-bc079/firestore"

# Deploy Firestore rules and indexes
echo "📤 Deploying Firestore rules and indexes..."
firebase deploy --only firestore:rules,firestore:indexes

# Deploy functions
echo "☁️  Deploying Cloud Functions..."
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions

# Setup database structure
echo "🗃️  Setting up database structure..."
echo "Call the setupDatabase function to initialize the database:"
echo "https://us-central1-scaneat-bc079.cloudfunctions.net/setupDatabase"

echo "✅ Firebase setup complete!"
echo ""
echo "Next steps:"
echo "1. Enable Firestore in Firebase Console"
echo "2. Enable Authentication (Email/Password and Anonymous)"
echo "3. Update .env files with your Firebase config"
echo "4. Call setupDatabase function to initialize database"

