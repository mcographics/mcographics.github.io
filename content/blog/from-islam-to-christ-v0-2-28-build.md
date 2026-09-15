---
title: "From Islam to Christ v0.2.28: Build Carefully, Keep the Light Honest"
description: "The v0.2.28 source continuation adds privacy, multilingual study, content review, updater safety, and in-app legal information, with Windows and Android packaging evidence recorded honestly."
date: "2026-09-14"
category: "Faith and Technology"
tags:
  - From Islam to Christ
  - Android
  - Windows
  - Privacy
  - Bible Study
  - Multilingual
  - GitHub Releases
featured: false
published: true
coverImage: "/projects/from-islam-to-christ-banner.png"
coverAlt: "From Islam to Christ banner showing a path from a mosque silhouette toward a cross and open Bible"
bannerImage: "/projects/from-islam-to-christ-banner.png"
bannerAlt: "From Islam to Christ banner artwork"
---

From Islam to Christ v0.2.28 is the newest source continuation of the private, Bible-centered application. The source is now pushed in commit [`d45df25`](https://github.com/mcographics/FromIslamtoChrist/commit/d45df25), while the latest public download remains [From Islam to Christ v0.2.27](https://github.com/mcographics/FromIslamtoChrist/releases/tag/v0.2.27).

This distinction matters. A build can compile, a package can exist, and a public release can still be unsafe or incomplete if signing, rights, or device evidence are missing. This update records each boundary plainly.

## What v0.2.28 carries forward

The source continuation brings together the recent product work:

- A first-launch decision screen with the requested solemn “YOU MADE THE RIGHT DECISION” message, John 14:6, and “ENTER THE LIGHT” action.
- An immediate Privacy Protection choice with discreet startup behavior, an Android Quick close action, bounded local PIN failure throttling, Android backup exclusion, and an Offline-only network boundary.
- Automatic in-app language translation with English as the main language, bundled-language fallback, translation status, local caching, and right-to-left layout for Arabic, Persian, and Urdu. Private notes, reflections, typed searches, and other user-entered content remain outside translation requests.
- Facts & Info educational reading paths, Muslim-seeker questions, Bible navigation, study packs, testimonies, prayer, local read-aloud, and source-library routing that keeps the raw local research boundary visible.
- GitHub-linked updater safety: Android downloads into private app storage and hands the package to Android’s installer only after the user chooses Install update; Windows remains inside the Electron updater path.
- In-app About, Terms & Conditions, Rights & Usage, Credits, source notices, software credits, and external-service boundaries.

## Two platform packages were built

The shared renderer and SQLite content boundary were rebuilt for both targets. Each data-index pass reported 1,566 local Data assets, 66 Bible books, 31,102 verses, 14,197 Strong’s entries, 3,369 Vine’s entries, and 12,234 original-language alignments.

The Windows x64 NSIS installer completed with Electron Builder 26.15.3 and Electron 44.3.0. The local file is named `From-Islam-to-Christ-0.2.28-x64.exe`, and the generated `latest.yml` identifies version 0.2.28 and the same product-named installer. The installer is not Authenticode-signed on this machine, so it is recorded as a local package rather than a signed public Windows release.

The Android release variant completed with version code 30, version name 0.2.28, package `com.mcographics.fromdarknesstolight`, application label **From Islam to Christ**, and compile/target SDK 36. It is a release-mode package, not a debug APK. The local signing inspection reports that it does not verify because no app-specific production signing configuration is present. It is therefore not uploaded or offered as an update over the signed v0.2.27 installation.

## Verification remains part of the feature

The source passed the database, content review, Bible navigation, audio-state, accessibility, content-link, source-coverage, privacy, updater-safety, legal-information, license-audit, and artwork checks. The content review is still an audit, not permission: 1,553 assets need review and 13 carry source notices, with 0 of 1,566 cleared for redistribution. The public release workflow correctly refuses to turn that state into a public content release.

The local build also exposed the practical toolchain boundary. The machine’s default Java 26 runtime could not compile the project’s Java 21 source level, so the Android package was rebuilt with a portable Temurin 21 runtime kept outside the repository. That build succeeded without changing the project’s Android identity.

## The public download remains v0.2.27

The public [v0.2.27 release](https://github.com/mcographics/FromIslamtoChrist/releases/tag/v0.2.27) remains the correct download entry while the next release’s rights and signing work is unfinished. Its Android asset is product-named and was verified separately as an APK v2/v3 signed package. The website now points directly to the corrected product-named Windows and Android assets instead of the older `app-debug.apk` path.

The next release step is straightforward but important: complete the per-asset redistribution review, configure and protect one stable signing key for this Android application, sign the Windows installer if public Windows trust is required, then run the tag-driven workflow and verify the public assets before calling v0.2.28 available.
