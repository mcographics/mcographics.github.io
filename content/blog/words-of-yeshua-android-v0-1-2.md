---
title: "Words of Yeshua Android v0.1.2: A Production-Signed Update Path"
description: "A detailed Android release update covering the failed corrective installation, the production-signed v0.1.2 fix, download verification, and the normal GitHub update path."
date: "2026-09-01"
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

The first Words of Yeshua Android release proved that the reader could live comfortably on a phone, but the first corrective test build exposed an important difference between producing an APK and delivering a dependable update. Android can be strict about package signatures, install-source permission, and which application receives a shared file URI. Those rules are useful, but the release path needs to respect them deliberately.

Android **0.1.2** is the stable production follow-up to the v0.1.1 corrective test build. It carries the installation fixes forward while returning the Android release line to the same production signing identity as v0.1.0. The result is a normal update path for the original signed app rather than another debug replacement that requires an uninstall.

## What the corrective path exposed

The v0.1.1 corrective APK was debug-signed so it could be used for installation testing. That made it useful for diagnosing the first package, but it also meant Android correctly refused to install it over the signed v0.1.0 application. The phone reported a certificate mismatch because an Android update must be signed by the same signing identity as the installed package.

The first updater implementation also removed `REQUEST_INSTALL_PACKAGES` from the manifest while retaining an in-app updater that downloads an APK and opens Android's package installer. That permission is part of the updater flow. Without it, the app could download an artifact but Android could still block the app from requesting the installation step.

Finally, the FileProvider handoff needed to be explicit for modern Android package installers. The v0.1.2 updater grants read access to the exact APK URI and attaches that URI through clip data as well as the intent flag. This keeps the downloaded file inside the app's cache while giving the system installer the access it needs.

## What Android 0.1.2 changes

The stable build includes:

- the corrected Android manifest and the install-source permission required by the in-app updater;
- a preflight check that opens Android's per-app install-source settings when permission has not been granted;
- an explicit FileProvider URI grant for the package installer;
- a User-Agent on the GitHub download request and a bounded, temporary download file;
- SHA-256 verification against GitHub's published asset digest before the installer is opened;
- the Android version line `0.1.2` with version code `100002`;
- the original production Android signing certificate, checked against the public v0.1.0 APK before release publication.

The update checker continues to use only stable tags matching `android-v<version>`. It ignores the Windows releases and the v0.1.1 prerelease, selects the exact APK filename for the newest stable Android tag, and keeps the release page available for inspection.

## The official artifact

The [Words of Yeshua Android v0.1.2 release on GitHub](https://github.com/mcographics/WordsofYeshua/releases/tag/android-v0.1.2) is the stable production release. The direct file is [Words-of-Yeshua-Android-0.1.2.apk](https://github.com/mcographics/WordsofYeshua/releases/download/android-v0.1.2/Words-of-Yeshua-Android-0.1.2.apk), and the matching [SHA-256 checksum file](https://github.com/mcographics/WordsofYeshua/releases/download/android-v0.1.2/Words-of-Yeshua-Android-0.1.2.apk.sha256) is published beside it.

The published APK is **43,588,714 bytes** with this SHA-256 value:

```text
B8BDD0FC76DA92BB26BBC3D7CCE8044F1EBF422B6B7266AC1C239A5E2270B93A
```

Its application identity is:

- Package: `com.mcographics.wordsofyeshua`
- Android version: `0.1.2`
- Version code: `100002`
- Minimum Android: API 24 / Android 7.0
- Target Android: API 36
- Distribution: direct GitHub APK
- Release status: stable production Android release

## Updating from the original Android release

If Android v0.1.0 is installed, v0.1.2 is intended to install as a normal update because both builds use the same production signing certificate. A normal update preserves the app's device-local saved passages, reading positions, and preferences.

If the v0.1.1 debug corrective build was installed instead, Android will require that test package to be removed before v0.1.2 can be installed. Removing a package removes its local app data, so that transition should be treated as a deliberate test-build cleanup rather than an ordinary update.

For a manual installation, download the APK from the release page, open it on the Android phone, and approve Android's normal installation confirmation. Android may also ask the browser or file manager used to open the file for permission to install applications from that source. That is controlled by Android and should be reviewed before proceeding.

The installed app's Settings screen also keeps the three parts of the update path visible: **Check for update**, **Install Update**, and **View Latest on GitHub**. The install action checks the stable Android release line, downloads the exact expected APK, reports progress, verifies the asset when GitHub provides its digest, and opens Android's installer for the final user confirmation.

## What was verified

The application test suite passed **41 tests**. The Android production build completed through the web build, Capacitor synchronization, Java compilation, manifest processing, lint, and Gradle release assembly. Android packaging tools confirmed the package name, version, install permission, APK Signature Scheme v2, and zip alignment.

The new v0.1.2 certificate digest matched the public v0.1.0 certificate digest exactly. The final APK was then published to the `android-v0.1.2` GitHub release and downloaded again from that public release. The local and public SHA-256 values matched byte-for-byte.

The build and public artifact checks are complete. A separate physical-device tap-through of the v0.1.2 Settings download, Android permission screen, and installer confirmation remains a device interaction test; the release record does not present the package checks as a substitute for that hands-on flow.

## A quiet purpose, delivered carefully

Words of Yeshua remains a local-first Scripture study companion. The Android app bundles the reader, catalogue, and KJV chapter context on the device. The update service needs a network connection only when checking GitHub or downloading a newer APK; saved passages and preferences are not uploaded as part of that process.

The point of this release is therefore practical and simple: make it easier to return to the words of Yeshua without making the delivery path mysterious. Scripture remains identifiable and in context, the reader's private study state remains local, and the Android operating system retains the final say over installation.
