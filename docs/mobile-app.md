# Packaging LocalReviewApp as a Mobile App

This guide shows how to wrap the existing web app into native Android and iOS apps using [Capacitor](https://capacitorjs.com/). Capacitor loads your web build in a WebView while exposing native device APIs.

## 1. Install Capacitor

```bash
npm install --save @capacitor/core @capacitor/cli
npx cap init LocalReviewApp com.example.localreviewapp
```

The first command installs Capacitor. `npx cap init` creates `capacitor.config.ts` and sets the app name and ID. Use your own app ID.

## 2. Build the Web App

Before adding native platforms, create a production build:

```bash
npm run build
```

Capacitor will copy the `build/` directory into the native projects.

## 3. Add Platforms

```bash
npx cap add android
npx cap add ios
```

This generates `android/` and `ios/` folders containing native projects. Open them in Android Studio or Xcode for further configuration.

## 4. App Icons and Splash Screens

Replace the default icons and splash images in the respective platform folders:

- `android/app/src/main/res/` for Android assets
- `ios/App/App/Assets.xcassets/` for iOS assets

You can generate assets with the [Capacitor Assets](https://capacitorjs.com/docs/guides/assets) tool.

## 5. Enable Offline Support

Capacitor caches your `build/` files, so basic offline functionality works automatically once the app is loaded. For richer offline support, consider a service worker or local storage within the web app.

## 6. Building and Running

```bash
# Copy the latest web build to native projects
npx cap copy

# Open the platform project
npx cap open android
npx cap open ios
```

Use Android Studio or Xcode to run on a device or emulator. When you change the web code, rerun `npm run build` and `npx cap copy`.

## 7. Preparing for Release

### Android

1. Follow the Android Studio wizard to generate a signed APK/AAB.
2. Update `android/app/src/main/AndroidManifest.xml` with any required permissions and the correct app ID.
3. Upload the release build to the Google Play Console.

### iOS

1. In Xcode, set the signing team and bundle identifier.
2. Archive the app (`Product > Archive`) and upload via the Organizer.
3. Complete the listing on App Store Connect.

Capacitor’s documentation has [detailed publishing guides](https://capacitorjs.com/docs/v5/getting-started/publishing) for each platform.

## 8. Useful Commands

```bash
# After installing or updating platforms
npx cap sync

# Clean and rebuild native projects
npx cap clean android
npx cap clean ios
```

This should give you a starting point for shipping LocalReviewApp on both stores without rewriting the app.
