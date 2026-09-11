#!/bin/bash
# Build Android APK (Debug)
# Usage: bash scripts/build-android.sh

set -e

echo "🔨 Building Nivasa Android APK..."

# Step 1: Build Next.js
echo "📦 Building Next.js..."
npm run build

# Step 2: Sync Capacitor
echo "📱 Syncing Capacitor..."
npx cap sync android

# Step 3: Build APK
echo "🔧 Building debug APK..."
cd android
./gradlew assembleDebug

# Step 4: Copy APK to builds/
echo "📋 Copying APK..."
mkdir -p ../builds
cp app/build/outputs/apk/debug/app-debug.apk ../builds/nivasa-debug.apk

echo "✅ Done! APK at builds/nivasa-debug.apk"
