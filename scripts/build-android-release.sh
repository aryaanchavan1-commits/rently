#!/bin/bash
# Build Android Release AAB (for Play Store)
# Usage: bash scripts/build-android-release.sh
# Requires: Java 21, Android SDK, signing keystore

set -e

echo "🔨 Building Nivasa Android Release AAB..."

# Step 1: Build Next.js
echo "📦 Building Next.js..."
npm run build

# Step 2: Sync Capacitor
echo "📱 Syncing Capacitor..."
npx cap sync android

# Step 3: Build Release AAB
echo "🔧 Building release AAB..."
cd android
./gradlew bundleRelease

# Step 4: Copy AAB to builds/
echo "📋 Copying AAB..."
mkdir -p ../builds
cp app/build/outputs/bundle/release/app-release.aab ../builds/nivasa-release.aab

echo "✅ Done! AAB at builds/nivasa-release.aab"
echo ""
echo "To upload to Play Store:"
echo "1. Go to https://play.google.com/console"
echo "2. Select Nivasa app"
echo "3. Go to Production → Create new release"
echo "4. Upload builds/nivasa-release.aab"
echo "5. Add release notes and submit"
