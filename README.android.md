# CWGame Android

This repository packages the CWGame React/Vite edition as a native Android application with Capacitor.

## Included in the first Android edition

- The complete v0.45 gameplay set (Chapters 115 and Open Station), plus the latest visual-novel story presentation through the completed Chapter 6 server checkpoint (source baseline `c715e97`).
- Offline Web Audio CW keying and playback, local save slots, seven interface languages, and responsive touch input.
- The trained `QsoSemanticFormer v0.4` INT8 ONNX model runs locally through ONNX Runtime Web/WASM. If the runtime cannot load, the existing deterministic interpreter remains the safe fallback.
- Android back-button protection for active or completed-but-unsaved QSOs.
- Portrait phone layout, status-bar/safe-area handling, adaptive launcher assets, and an installable debug APK build.

## Server build

The project is developed and built on `gpu-821560` at `/home/ubuntu/cwgame-android`. A user-local JDK and Android SDK are used; no signing key is committed.

```sh
export PATH=/home/ubuntu/.local/share/cwgame-tools/node-v24.21.0-linux-x64/bin:$PATH
export JAVA_HOME=/home/ubuntu/.local/share/cwgame-android-tools/jdk-21
export ANDROID_SDK_ROOT=/home/ubuntu/.local/share/cwgame-android-tools/android-sdk
export PATH=$JAVA_HOME/bin:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$PATH
pnpm install --frozen-lockfile
pnpm test
pnpm android:debug
```

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`. Release signing and store publication are intentionally outside this first repository version.

## Verification

- `pnpm test` covers the complete game suite plus the Android bridge.
- `CWGAME_QA_CHROME=/path/to/chrome pnpm qa:android:semantic` loads the packaged WASM runtime in Chromium and performs real inference with the bundled model.
- `cd android && ./gradlew --no-daemon testDebugUnitTest lintDebug assembleDebug` verifies the native project and creates the debug APK.
- GitHub Actions repeats the tests and publishes the debug APK as a workflow artifact on every `main` push.

The application ID is `com.arsenicer.cwgame`, the minimum Android API level is 24 (Android 7.0), and the target API level is 36. A current Android System WebView is recommended for local ONNX/WASM inference.
