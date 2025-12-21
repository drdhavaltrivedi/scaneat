#!/bin/bash

# Script to allow public access to Firebase Functions
# This fixes the CORS error

echo "🔧 Allowing public access to Firebase Functions..."
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed."
    echo ""
    echo "Please use Google Cloud Console instead:"
    echo "1. Go to: https://console.cloud.google.com/run?project=scaneat-bc079"
    echo "2. For each function (getproduct, analyzehealth):"
    echo "   - Click on the function"
    echo "   - Go to 'Permissions' tab"
    echo "   - Click 'Add Principal'"
    echo "   - Principal: allUsers"
    echo "   - Role: Cloud Run Invoker"
    echo "   - Click 'Save'"
    echo ""
    exit 1
fi

# Check if logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Please login to gcloud:"
    gcloud auth login
fi

# Set project
echo "📦 Setting project to scaneat-bc079..."
gcloud config set project scaneat-bc079

# Allow public access to getProduct
echo ""
echo "🔓 Allowing public access to getProduct..."
gcloud run services add-iam-policy-binding getproduct \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/run.invoker \
  --project=scaneat-bc079

if [ $? -eq 0 ]; then
    echo "✅ getProduct is now publicly accessible"
else
    echo "⚠️  Failed to allow public access to getProduct"
fi

# Allow public access to analyzeHealth
echo ""
echo "🔓 Allowing public access to analyzeHealth..."
gcloud run services add-iam-policy-binding analyzehealth \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/run.invoker \
  --project=scaneat-bc079

if [ $? -eq 0 ]; then
    echo "✅ analyzeHealth is now publicly accessible"
else
    echo "⚠️  Failed to allow public access to analyzeHealth"
fi

echo ""
echo "✨ Done! Refresh your browser and try again."
echo ""

