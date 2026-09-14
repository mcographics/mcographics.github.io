---
title: "From Islam to Christ: A Private Bible Explorer Takes Shape"
description: "A look at the first Windows and Android build of From Islam to Christ, including the supplied banner, shared React renderer, offline SQLite Bible database, and the release gates still ahead."
date: "2026-09-13"
category: "Faith and Technology"
tags:
  - From Islam to Christ
  - Android
  - Windows
  - Bible Study
  - Electron
  - React
  - Local-First
  - GitHub Releases
featured: false
published: true
coverImage: "/projects/from-islam-to-christ-banner.png"
coverAlt: "From Islam to Christ banner showing a path from a mosque silhouette toward a cross and open Bible"
bannerImage: "/projects/from-islam-to-christ-banner.png"
bannerAlt: "From Islam to Christ banner artwork used for the From Islam to Christ project"
---

From Islam to Christ began with a question about what a private, respectful, Bible-centered application could feel like for someone moving through difficult questions. The answer is not a loud feed, a pressure campaign, or a cloud account that records every page a person reads. The first build is taking shape as a quiet place to read Scripture, examine foundational Christian ideas, and move at an honest pace.

The project now has a first cross-platform build. The Windows application is built with Electron, React, and Vite. The Android application uses Capacitor around the same responsive renderer, with the navigation, reading surfaces, study actions, and visual identity adapted for a phone. The two targets are released independently, but they share the same product direction and the same local-first boundary.

## The supplied banner gives the project its visual language

The supplied **From Islam to Christ** banner is now part of the website’s project identity. Its composition moves from a dark city silhouette and crescent on the left, through an illuminated path and open Bible, toward a cross in the sunrise on the right. That progression says what the project needs to say visually without making the website explain the idea before the visitor has even opened the page.

The original banner file is used as supplied on the portfolio project card, the featured-release area, the full project page, and this journal entry. The application itself uses the supplied logo and icon for its identity, while the desktop and Android interfaces use a separate responsive hero treatment so the website banner and in-app reading surface each have room to work.

## One renderer, two ways to read

The desktop build provides the larger workspace a reader may want when comparing ideas, reading for longer periods, or writing private notes. Electron keeps the application local and gives the project a native Windows release path. The renderer remains a normal React/Vite application, which keeps the core product surfaces easier to carry to Android.

On Android, the same foundation is wrapped for a phone-first experience. The navigation becomes a compact mobile surface, the drawer is available from the top bar, and the hero artwork has a dedicated portrait composition. The Android app is not a screenshot-only companion to the Windows version; it carries the same Home, Bible, Learn, Journey, Saved, Settings, theme, discreet-mode, update, and local study behavior.

That shared foundation matters for a private study application. A person should not have to learn a completely different product depending on whether they picked up a phone or opened a computer. The screen size changes. The basic promise does not.

## The source folder became a runtime database

The local `Data` folder contains a large mixture of Bible material, Strong’s and original-language research, structured files, documents, references, tooling, archives, and images. It is useful as a conversion source, but its presence on a development drive is not proof that every item may be redistributed in an application or published on GitHub.

The application therefore does not expose the source folder as a file browser. A repeatable build step converts the runtime-ready boundary into a versioned SQLite database. The current database indexes all **1,566 local source assets** and carries a structured KJV corpus with **66 books and 31,102 verses**. The Bible reader queries chapters locally as the reader moves through the text, while the raw DOCX, lexicon, Hebrew, Greek, Text-Fabric, archive, and other research files remain outside the public application bundle.

This distinction is important for both privacy and content stewardship. The database is an internal application layer. It is not a claim that every source record is cleared for public redistribution, and it is not a reason to publish a two-gigabyte research folder simply because the application can see it during development.

## What the first build can do

The first working slice now includes:

- a 66-book Bible index with book and chapter navigation;
- offline chapter loading from the SQLite content database;
- local bookmarks, highlights, and private verse notes;
- copy-to-clipboard for Scripture passages;
- adjustable Bible text size and Paper, Sepia, and Low-light reading tones;
- Learn search with topic filters for Jesus, Questions, Bible, Foundations, Practice, and Life;
- a seven-step Journey surface with locally persisted progress;
- Saved items for bookmarked articles and passages;
- light mode, dark mode, and Discreet Mode;
- branded desktop and Android splash screens; and
- GitHub-linked update checks, with the Windows app using `electron-updater` and Android handing the user’s chosen APK to the operating system installer.

The [v0.1.5 release](https://github.com/mcographics/FromIslamtoChrist/releases/tag/v0.1.5) of From Islam to Christ is a prototype milestone. It includes the [Windows x64 installer](https://github.com/mcographics/FromIslamtoChrist/releases/download/v0.1.5/From-Darkness-to-Light-0.1.5-x64.exe) and an [Android debug APK](https://github.com/mcographics/FromIslamtoChrist/releases/download/v0.1.5/app-debug.apk), alongside the release metadata used by the desktop update path. The [source repository](https://github.com/mcographics/FromIslamtoChrist) contains the renderer, Electron shell, Capacitor Android project, database conversion script, and verification script.

## The boundaries stay visible

There are several things this release does not pretend to have finished. The KJV source still needs formal licensing and attribution review in the project’s content manifest before a wider public content release. The Android artifact is a debug-signed test APK, not a production-signed store release. I have verified the build and package structure, but a physical-device tap-through and a complete Android device matrix are separate release gates.

The app also does not include AI question answering, mentor chat, cloud accounts, social sharing, audio or video libraries, or a hidden analytics layer. Those may be considered later, but they do not belong in the first private Bible Explorer until their safety, privacy, content, and operational requirements are understood.

The goal is simple enough to test: a person can install the application, read the Bible offline, search a reference, save a passage locally, explore an honest foundational article, and continue a private journey without creating an account. The first build is not the finished destination. It is the point where that promise becomes a real application that can be tested, challenged, and improved.
