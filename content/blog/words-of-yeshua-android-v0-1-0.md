---
title: "Words of Yeshua Android v0.1.0: A Phone-First Way to Read His Words"
description: "Words of Yeshua now has a public Android release, a phone-first settings experience, and an explicit GitHub update path that keeps Scripture study local and the installation decision with Android."
date: "2026-08-31"
category: "Faith and Technology"
tags:
  - Words of Yeshua
  - Android
  - Scripture
  - Local-First
  - Release Notes
coverImage: "/projects/words-of-yeshua.png"
coverAlt: "Words of Yeshua Scripture study application"
featured: false
published: true
---

Words of Yeshua began as a Windows study companion: a quiet place to search the recorded words of Jesus, open the complete King James Version chapter around them, and keep selected passages nearby without creating an account. The first public Android release carries that same purpose onto a phone.

Android version **0.1.0** is now available from the [Words of Yeshua GitHub release](https://github.com/mcographics/WordsofYeshua/releases/tag/android-v0.1.0). It is a direct APK release rather than a Play Store listing, and it uses its own Android version line so it can move independently from the Windows 0.5.4 release.

## A phone-first reader, not a shrunken desktop window

The Android build uses the same local React reader inside a Capacitor shell, but the phone experience has its own platform boundary. The navigation is touch-sized, the layout respects the device safe area, the reader remains scrollable, and the app does not ask a phone to pretend that it is a desktop monitor.

That distinction is visible in Settings. Windows has controls for DPI, display scale, and window resolution because a desktop window can be resized and a high-density monitor can need a deliberate scale preference. Android removes those controls completely. The phone supplies its own display metrics, so the mobile Settings screen stays focused on reading comfort, study details, saved passages, appearance, and updates.

The Android shell also keeps the app’s local-first promise intact. The catalogue, KJV chapter text, search data, saved passages, and preferences are packaged or stored on the device. Reading does not require a sign-in, a subscription, a cloud database, or a constantly available connection.

## What is in Android 0.1.0

The first release includes:

- the complete local Words of Yeshua catalogue across Matthew, Mark, Luke, John, Acts, and Revelation;
- full KJV chapter context and Read Chapter Mode;
- search across quotations, references, events, people, places, themes, periods, related passages, Greek lemmas, and Strong’s numbers;
- device-local saved passages and reading preferences;
- touch-friendly Home, Explore, Saved, and Settings navigation;
- the same careful separation between Biblical text, application guidance, and supporting study material;
- a phone-specific Settings screen without PC display and window controls.

The application remains a study aid rather than a replacement for Scripture. A focused saying can help a reader find a passage, but the surrounding chapter still matters: who was present, what question was being answered, what warning or promise was being given, and what the larger passage says.

## Updates are visible and deliberate

The Android release also establishes a real update channel. Android versions use tags in the form `android-v<version>`, beginning with `android-v0.1.0`. The APK attached to each release must use the matching filename, such as `Words-of-Yeshua-Android-0.1.0.apk`.

From Settings, the reader can:

- check GitHub for the latest stable Android release;
- see whether the installed version is current or a newer build is available;
- download an available APK with visible progress;
- open Android’s normal package installer for the final confirmation;
- open the official GitHub release page to inspect the notes and artifact.

The updater does not silently install an application, grant Android security permissions, or accept an arbitrary download URL from the renderer. It checks the public GitHub release feed, validates the Android tag and exact asset name, rejects unexpected redirects and oversized files, and then hands installation to Android.

Only the update check needs a network connection. If GitHub is unavailable, the app reports the failed check while the existing Bible reader remains available. Saved passages and preferences are never uploaded as part of the update process.

## The release key is part of the update promise

The public APK is signed with the Words of Yeshua Android release key. Future Android updates must use that same signing identity or Android will correctly reject them as a different application. That is why the key is kept outside the source repository and why the published APK is checked before it becomes part of the public release channel.

The release artifact is:

- Package: `com.mcographics.wordsofyeshua`
- Version: `0.1.0`
- Version code: `100000`
- Minimum Android: API 24 / Android 7.0
- Target Android: API 36
- APK Signature Scheme v2: verified
- SHA-256: `7CFB5F27F023642FC66AB2D50A438952DE9CE435E44C7A68EF178EA3DBEE003D`

The direct file is [Words-of-Yeshua-Android-0.1.0.apk](https://github.com/mcographics/WordsofYeshua/releases/download/android-v0.1.0/Words-of-Yeshua-Android-0.1.0.apk). Android may ask the browser or file manager used to open the APK for permission to install applications from that source. That permission remains an Android decision and should be reviewed before continuing.

## What was verified

The web reader compiled, the generated assets synchronized into the Capacitor project, and Gradle produced both debug and signed release APKs. The package metadata, version code, target SDK, and Android permissions were inspected with Android’s packaging tools. The signed release passed APK Signature Scheme v2 verification with one 4096-bit RSA signer.

The phone pass used a connected Samsung device. The mobile home screen rendered at the device’s 1080×2400 display, Explore opened through the bottom navigation, Settings opened by touch, and the Android update panel appeared with its phone-specific copy. The app also reached GitHub and reported the correct release state after the public Android release was created.

The phone already contained a debug-signed copy, so the production-signed APK was not installed over it in place. Android correctly identified the certificate mismatch. The debug build used for the UI pass contained the same Android reader, updater, and phone-first Settings code; the production APK was separately verified locally and then downloaded again from GitHub to confirm that the public asset matched the local hash exactly.

## One reader, two honest platform boundaries

Words of Yeshua now has two public release paths: Windows 0.5.4 through the Electron desktop channel and Android 0.1.0 through the Capacitor phone channel. The catalogue and study direction are shared, but the platform responsibilities are not blurred. Windows can expose desktop window controls. Android can use the phone’s native display and installer. Each surface says what it is capable of and leaves the rest to the operating system.

That is the standard this project is trying to keep: Christ at the centre, Scripture identifiable and in context, private study state kept local, and release information that can be checked rather than merely promised. Android 0.1.0 is the first mobile step, but it is built around the same quiet purpose as the desktop reader—make room to return to what is written.
