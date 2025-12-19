#!/bin/bash

# Script to create GitHub repository and push code
# Requires: GitHub CLI (gh) or manual creation

REPO_NAME="scaneat"
DESCRIPTION="Food Barcode Scanner & Health Analyzer - Scan food products and get instant health analysis"

echo "🚀 Creating GitHub repository..."

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    echo "Using GitHub CLI..."
    
    # Check if authenticated
    if gh auth status &>/dev/null; then
        # Create repository
        gh repo create "$REPO_NAME" \
            --public \
            --description "$DESCRIPTION" \
            --source=. \
            --remote=origin \
            --push
        
        echo "✅ Repository created and code pushed!"
        echo "🔗 Repository URL: https://github.com/$(gh api user --jq .login)/$REPO_NAME"
    else
        echo "❌ Not authenticated with GitHub CLI"
        echo "Run: gh auth login"
        exit 1
    fi
else
    echo "GitHub CLI not found. Manual steps:"
    echo ""
    echo "1. Create repository on GitHub:"
    echo "   https://github.com/new"
    echo "   Name: $REPO_NAME"
    echo "   Description: $DESCRIPTION"
    echo "   Visibility: Public"
    echo ""
    echo "2. Then run:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
fi

