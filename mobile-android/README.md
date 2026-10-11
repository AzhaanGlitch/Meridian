# Meridian Android Application

This folder contains the complete, isolated **Android application** for Meridian, ready to be opened, built, and compiled directly in **Android Studio**.

> **Note:** The web frontend (`client/`) and server (`server/`) remain completely untouched and independent.

---

## 🚀 How to Open & Compile in Android Studio

1. **Launch Android Studio**.
2. Click **Open** (or `File` -> `Open`).
3. Navigate to and select the `android` folder located inside this directory:
   ```
   d:\Full Stack Projects\Meridian\mobile-android\android
   ```
4. Click **OK** to open the project.
5. Wait a moment while Android Studio and Gradle sync all dependencies.
6. To run the app:
   - Connect your Android phone via USB (with Developer options & USB debugging enabled), OR
   - Start an Android Emulator / Virtual Device (AVD).
7. Click the green **Run (▶)** button or press `Shift + F10` in Android Studio.

---

## 📦 To Generate a Standalone APK in Android Studio

1. Go to the top menu in Android Studio: `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`.
2. Once the build completes, click the notification popup **locate** to find your `.apk` file (located under `app/build/outputs/apk/debug/app-debug.apk`).

---

## 🔄 Updating Web Assets (If needed in future)

If you make web changes later and want to sync them to this Android project:
```powershell
# In client/ folder:
npm run build

# In mobile-android/ folder:
Copy-Item -Path "..\client\dist\*" -Destination "dist\" -Recurse -Force
npx cap sync android
```
