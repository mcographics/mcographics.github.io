---
title: "Work Day with God 1.4.9: A Better Windows Release and a Proper Android Update Path"
description: "The latest Work Day with God release refreshes the Windows channel, adds GitHub-based Android updates, and gives phone users a UI size control for more comfortable reading."
date: "2026-08-31"
category: "Release Notes"
tags:
  - Work Day with God
  - Android
  - Windows
  - Accessibility
  - Release Notes
coverImage: "/projects/work-day-with-god.png"
coverAlt: "Work Day with God devotional application"
bannerImage: "/projects/work-day-with-god-card-banner.png"
bannerAlt: "Work Day with God wide banner artwork showing work, faith, and purpose"
featured: false
published: true
---

Work Day with God has two new platform releases: Windows 1.4.9 and Android 1.0.3. The update keeps the app’s original promise—Scripture, reflection, prayer, and reminders that remain useful without an account or a constant connection—while making the release experience clearer on both platforms.

## Windows 1.4.9

The Windows release has been refreshed on the existing GitHub updater channel. The packaged NSIS installer, block map, and `latest.yml` metadata are published together so the desktop updater has the information it needs to check, download, show progress, install, close, and relaunch the application.

Windows users can also open Settings and see the current release status, check GitHub manually, install the latest release, or view the release page. The installer is still unsigned, so Windows may show its standard unknown-publisher warning. Confirm the official filename and GitHub source before continuing.

## Android now has its own update channel

Android 1.0.3 uses a separate `android-v1.0.3` GitHub release rather than sharing the Windows version line. The phone app checks the public stable Android release feed, accepts only the official Android release tag and APK asset, and keeps the update check non-blocking when the phone is offline.

When a newer Android release is available, the app can place an update-availability notification alongside its devotional reminders. The Android Updates section in Settings provides the three actions needed on a phone:

- Update checks GitHub for the next stable Android release.
- Install downloads the release APK with visible progress and passes it to Android’s package installer.
- View on GitHub opens the official release page for inspection.

Android may ask the user to allow Work Day with God to install packages from that source. The app explains this permission at the installer handoff; it does not silently change the phone’s security settings. The published 1.0.3 APK is signed with the project’s Android release key and includes a SHA-256 checksum beside the download.

## A phone UI size control

Phone accessibility settings can make an application’s global text unexpectedly large. Android 1.0.3 adds a Phone UI size slider in Settings, from 85% to 140%, so the app can compensate while keeping devotional text controls separate.

The mobile layout also uses fluid typography, safe-area spacing, larger touch targets, wrapping action rows, and scrollable settings and reading surfaces. The goal is simple: an older person who chooses a larger phone interface should still be able to open the app, read the verse, reach the controls, and move through the settings without the first screen becoming a collection of clipped labels.

The native Android shell stabilizes the WebView’s global text zoom, while the app’s own controls remain responsible for devotional, Verse Card, Scripture, and phone-interface sizing. That separation prevents one accessibility preference from unexpectedly changing every reading surface at once.

## Verification and local-first behaviour

The release was checked with 49 automated tests, a production Vite build, and a Gradle Android release build. The Android APK passed APK Signature Scheme v2 verification and includes its matching checksum file. The Windows installer was built successfully and remains explicitly identified as unsigned.

All personal reading state stays local: settings, favourites, completion history, streaks, reminders, and reading positions are not sent to GitHub. GitHub is used only as the public release source for update metadata and downloadable platform assets. The devotional library remains available offline after installation.

Download the official releases from the [Work Day with God project page](/projects/work-day-with-god/) or inspect the [Work Day with God GitHub releases](https://github.com/mcographics/WorkDaywithGod/releases).
