#!/bin/bash

# Fix GitHub authentication for pushing to repository

echo "🔧 Fixing GitHub Authentication..."
echo ""

cd "$(dirname "$0")/.."

# Option 1: Use Personal Access Token (Recommended)
echo "Option 1: Use Personal Access Token"
echo "======================================"
echo ""
echo "1. Create a Personal Access Token:"
echo "   Visit: https://github.com/settings/tokens"
echo "   Click 'Generate new token (classic)'"
echo "   Select scopes: repo (all)"
echo "   Copy the token"
echo ""
echo "2. Then run:"
echo "   git remote set-url origin https://YOUR_TOKEN@github.com/drdhavaltrivedi/scaneat.git"
echo "   git push -u origin main"
echo ""

# Option 2: Use SSH
echo ""
echo "Option 2: Use SSH (If SSH key is set up)"
echo "=========================================="
echo ""
echo "Run:"
echo "   git remote set-url origin git@github.com:drdhavaltrivedi/scaneat.git"
echo "   git push -u origin main"
echo ""

# Option 3: Use GitHub CLI
echo ""
echo "Option 3: Use GitHub CLI"
echo "======================="
echo ""
echo "Run:"
echo "   gh auth login"
echo "   git push -u origin main"
echo ""

echo "Choose one of the options above to fix authentication."

