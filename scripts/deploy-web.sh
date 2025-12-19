#!/bin/bash

# Deploy web app to Vercel
# Alternative: Deploy to Firebase Hosting

cd "$(dirname "$0")/../web"

echo "🌐 Deploying Scaneat Web App..."

# Check if Vercel CLI is available
if command -v vercel &> /dev/null; then
    echo "Using Vercel..."
    vercel --prod
else
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
    vercel --prod
fi

echo ""
echo "✅ Web app deployed!"
echo "🔗 Check the deployment URL above"

