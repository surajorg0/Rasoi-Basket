#!/bin/bash
echo "Building Rasoi Basket for Android..."
echo

# Build the app with production settings
ionic build --prod

# Sync with Capacitor and update Android project
npx cap sync android

echo
echo "Build complete! You can now open Android Studio with:"
echo "npx cap open android"
echo
echo "Then build the APK from Android Studio:"
echo "Build -> Build Bundle(s) / APK(s) -> Build APK(s)"
echo 