---
title: "From Islam to Christ v0.2.0: A More Private First Step"
description: "A release note for the Windows and Android v0.2.0 build of From Islam to Christ, including the local PIN gate, inactivity lock, private-data reset, shared renderer, and the remaining release boundaries."
date: "2026-09-13"
category: "Faith and Technology"
tags:
  - From Islam to Christ
  - Android
  - Windows
  - Privacy
  - Bible Study
  - Electron
  - React
  - GitHub Releases
featured: false
published: true
coverImage: "/projects/from-islam-to-christ-banner.png"
coverAlt: "From Islam to Christ banner showing a path from a mosque silhouette toward a cross and open Bible"
bannerImage: "/projects/from-islam-to-christ-banner.png"
bannerAlt: "From Islam to Christ banner artwork"
---

From Islam to Christ v0.2.0 is now available for Windows and Android. This is the next official public build of the private, Bible-centered application: a quiet place to read Scripture, explore foundational Christian questions, save a few thoughts locally, and move through a guided beginning without creating an account.

The [v0.2.0 GitHub release](https://github.com/mcographics/FromIslamtoChrist/releases/tag/v0.2.0) includes a Windows x64 installer and an Android debug APK. The Windows installer is published with the existing application package identity for updater compatibility, while the website and release presentation use the public project name, **From Islam to Christ**.

## A local privacy step

The main v0.2 feature is an optional local PIN access gate. A person can set a four-to-eight-digit PIN in Settings, lock the app immediately with **Lock now**, and have the app lock itself after five minutes without pointer, touch, or keyboard activity. The stored verifier uses a per-install random salt and Web Crypto PBKDF2-SHA-256 rather than saving the PIN itself.

The release also adds an explicit **Delete private data** action. After confirmation, it removes the local bookmarks, highlights, private notes, journey progress, reader preferences, saved Bible position, discreet-mode setting, theme preference, and PIN state. The immutable, read-only content database remains in place so deleting personal state does not damage the application’s offline reading content.

This is a deliberately honest privacy boundary. The PIN is an access gate, not full-disk or database encryption. Someone with access to the device, operating-system storage, backups, screenshots, or a compromised device may still be able to reach application data. The app does not claim to provide protection that belongs to the operating system or a secured device.

## The same study experience on two platforms

The Windows build continues to use Electron with a React and Vite renderer. The Android build uses Capacitor around that same responsive renderer, with phone navigation and touch-friendly layout behavior. Both builds carry the same core feature set:

- offline Bible reading from the bundled SQLite database;
- 66-book navigation and local chapter loading;
- locally stored bookmarks, highlights, private notes, and reading preferences;
- Learn search and topic filters;
- the seven-step Start Here journey;
- Saved items and Bible passage actions;
- light mode, dark mode, and Discreet Mode;
- supplied application logo, icon, banner, and splash artwork; and
- GitHub-linked update discovery.

The raw development `Data` folder is still not shipped as a file browser or copied wholesale into the public repository. The runtime database currently indexes 1,566 local source assets and contains the 66-book, 31,102-verse KJV reader corpus. That conversion boundary remains separate from the licensing decision for each source item.

## What this release still does not claim

The Android artifact in this release is a debug-signed test APK for GitHub distribution and private evaluation. It is not a Play Store publication or a production-signed Android update channel. A stable production signing identity, physical-device installation matrix, and broader Android verification remain release gates.

The KJV material also remains subject to the project’s licensing and attribution review before a wider public content release. The app does not add cloud accounts, remote reading activity, analytics, AI question answering, mentor chat, or social sharing in v0.2.0.

For the people who need a quiet first step, this build makes the boundary clearer and the local study loop more useful. Install the [Windows x64 build](https://github.com/mcographics/FromIslamtoChrist/releases/download/v0.2.0/From-Darkness-to-Light-0.2.0-x64.exe) or the [Android debug APK](https://github.com/mcographics/FromIslamtoChrist/releases/download/v0.2.0/app-debug.apk), read offline, and use the new privacy controls from Settings when the device needs to be put away.
