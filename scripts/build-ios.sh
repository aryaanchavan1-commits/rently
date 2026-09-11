#!/bin/bash
# Build iOS App
# Usage: bash scripts/build-ios.sh
# NOTE: This must be run on macOS with Xcode installed

set -e

echo "🔨 Building Nivasa iOS App..."

# Step 1: Build Next.js
echo "📦 Building Next.js..."
npm run build

# Step 2: Sync Capacitor
echo "📱 Syncing Capacitor..."
npx cap sync ios

# Step 3: Open Xcode (manual step)
echo "🔧 Opening Xcode..."
npx cap open ios

echo "✅ Xcode opened. Build from Xcode:"
echo "   1. Select your Apple Developer Team"
echo "   2. Choose target device/simulator"
echo "   3. Press Cmd+R to build and run"
echo ""
echo "For App Store submission:"
echo "   1. Product → Archive"
echo "   2. Distribute App → App Store Connect"
echo "   3. Upload and submit for review"
