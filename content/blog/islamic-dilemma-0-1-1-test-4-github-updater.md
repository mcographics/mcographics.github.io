---
title: "The Islamic Dilemma 0.1.1-test.4: A GitHub-Aware Research App"
description: "A thorough release update for The Islamic Dilemma covering the Sharia Law archive, the new Settings update checker, manual APK installation, release verification, and the boundaries of this Android test build."
date: "2026-08-31"
category: "Release Notes"
tags:
  - The Islamic Dilemma
  - Android
  - GitHub Releases
  - Sharia Law
  - Offline-First
  - Release Engineering
coverImage: "/projects/islamic-dilemma-banner.png"
coverAlt: "The Islamic Dilemma research application artwork"
featured: false
published: true
---

The Islamic Dilemma has reached Android test build **0.1.1-test.4**. This release is a practical step in the life of the application: the research surface has grown, the public APK path has been checked from end to end, and the app can now look to its GitHub release channel from inside Settings.

The project remains what it has always been intended to be: an offline-first research workspace for examining difficult questions about the Qur’an’s relationship to the Torah and Gospel. It is not presented as a replacement for Scripture, a substitute for serious scholarship, or a permission slip to treat a conclusion as settled before its sources have been examined. The release work is therefore concerned with two things at once: making the research material easier to reach, and making the boundaries around that material easier to see.

## What 0.1.1-test.4 adds

The most visible addition in this build is the **Updates** section in the app’s Settings screen. It checks the public GitHub releases for **mcographics/Islamic-Dilemma-Test-Builds**, compares the newest published Android release with the installed version, and identifies the APK asset attached to that release.

When Settings opens, the app checks GitHub and presents a clear state rather than silently doing work in the background. The section can show that the app is checking, that it is up to date, that a newer build is available, or that GitHub could not be reached. A separate **Check for updates** button lets the reader retry deliberately when a network connection becomes available.

The release card includes the latest release name, version, APK size, release notes, and the time of the most recent check in the current Settings view. It also provides two distinct actions:

- **Download APK** opens the APK through the Android browser/download system for manual installation.
- **View release** opens the complete GitHub release page, where the release notes and checksum asset can be inspected.

That distinction is intentional. The app can find and present a release, but Android should remain in control of the final installation confirmation. A research app should not quietly install a new application package behind the reader’s back, and Android’s security model should not be bypassed by pretending that a download is the same thing as an installation.

## A release channel built around the public GitHub asset

The current public test release is [The Islamic Dilemma 0.1.1-test.4 on GitHub](https://github.com/mcographics/Islamic-Dilemma-Test-Builds/releases/tag/test-build-0.1.1-test.4). The release includes the APK and a matching `.apk.sha256` checksum file.

The direct APK is [Islamic-Dilemma-0.1.1-test.4.apk](https://github.com/mcographics/Islamic-Dilemma-Test-Builds/releases/download/test-build-0.1.1-test.4/Islamic-Dilemma-0.1.1-test.4.apk). The published artifact is **29,603,952 bytes**, and its SHA-256 value is:

```text
4c5c62f454a019d6b3a2b9f363fa59cd4647415c10686fa7fe18b4470ec6c92f
```

The updater reads GitHub’s public releases API rather than depending on a second custom update server. It considers published releases, finds an APK asset, and compares version identifiers—including the test-build suffix—to the installed application version. This keeps the release source visible and gives a reader a straightforward way to move from the app’s Settings screen to the exact release record that supplied the APK.

There is no account or sign-in step in this update path. The app does not require a private GitHub token, and it does not send research notes, saved passages, or personal study information to GitHub. The network request is for public release metadata. The actual research experience remains local-first.

## The Sharia Law archive remains source-oriented

The update checker is a release-engineering improvement, but the release also carries forward the expanded Sharia Law research module. The module is organized as an archive and a reading workflow rather than a single undifferentiated wall of claims.

The current research surfaces include:

- foundations that distinguish sharia, fiqh, Qur’an, Sunnah, and ijtihad;
- the major Sunni legal schools and the Ja’fari tradition;
- classical criminal-law categories, thresholds, and distinctions between hudud, qisas, diya, and ta’zir;
- focused topic pages covering apostasy, blasphemy, theft, zina, qadhf, hirabah, intoxication, evidence, and testimony;
- women and family law, child marriage, slavery and concubinage, jizya and jihad, religious minorities, and LGBTQ-related jurisprudence;
- country profiles that separate active, partial, regional, disputed, repealed, and not-currently-enforced classifications;
- a human-rights comparison workflow that names the rule, the standard, and the point of conflict;
- a claim-verification workflow and a side-by-side debate mode.

The design keeps source types visibly distinct. Primary text, commentary, scholarship, interpretation, and apologetic claims should not collapse into one visual category merely because they appear on the same screen. The purpose of the archive is to help a reader trace a question through its layers and understand where a conclusion comes from.

That structure matters especially for subjects where legal schools, historical periods, modern jurisdictions, and contemporary political claims are often spoken about as if they were interchangeable. A country profile is not automatically a summary of every classical ruling. A classical legal category is not automatically a description of current enforcement. A quotation in a debate is not automatically a complete account of the source surrounding it. The app’s research controls are built to make those distinctions easier to maintain.

## Offline-first still defines the application

The Islamic Dilemma is an Android research app designed around locally available material. Its Bible translations, focused Qur’anic evidence, manuscript material, lexical study, tafsir summaries, source registry, and Sharia Law archive are packaged for local reading. The reader can continue examining the bundled research without maintaining an online account or depending on a live feed for every screen.

The new update section does not change that boundary. Only the update check needs network access. If GitHub is unavailable, the app reports that the check failed while the existing local research remains available. The result is a useful separation: the library does not disappear merely because the release channel cannot be reached, and the app does not pretend that a stale or failed update response is current information.

## Manual APK installation remains explicit

The update action is designed for the normal Android manual-install process:

1. Open Settings and run the update check.
2. Select **Download APK** for the available release.
3. Allow the browser or file manager to install unknown apps if Android requests that permission.
4. Open the downloaded APK from Downloads or Files.
5. Review Android’s installation prompt and confirm the installation.

The checksum file is available beside the APK on the GitHub release page. Verifying the downloaded file before installation is a useful extra step when a release is being transferred between devices or downloaded through an unfamiliar network.

The test line is debug-signed with the key used for these Android builds. A matching test build can normally be updated in place, preserving its local settings and saved research. If Android reports a signature conflict, the older application was signed with a different key. Uninstalling that older build may resolve the conflict, but it can also remove local app data, so it should only be done when that trade-off is understood.

## What was verified for this release

The build was checked at several layers rather than treating a public GitHub URL as proof that the release was ready.

The web application compiled successfully, Capacitor synchronized the generated assets into Android, and Gradle produced the debug APK with version code **4** and version name **0.1.1-test.4**. The package identifier remains `com.majesticcreations.islamicdilemma`.

The generated APK was inspected with Android’s packaging tools. Its package name and version were confirmed, APK Signature Scheme v2 verification passed with one signer, and zip alignment completed successfully. The Capacitor Browser plugin was included in the Android build so that the Settings download action has a native browser handoff available.

The public artifact was then downloaded again from the GitHub release URL. The downloaded file measured **29,603,952 bytes**, returned the expected Android package content type, used the expected `.apk` attachment filename, and produced the same SHA-256 value as the local release artifact and the published checksum file.

The portfolio release metadata was updated to point to the `.4` release, and the direct APK link is now available from the [Islamic Dilemma project page](/projects/the-islamic-dilemma/). The GitHub Pages deployment completed successfully after the metadata update, and the live page was checked for the exact `.4` download anchor.

## What this release does not claim

This is still an Android test build. It is not a production-signed Play Store package, and it has not gone through the complete Play Console release process. The app’s Settings updater can locate a release and open its manual-install path, but it does not silently install or relaunch the application.

The final build verification environment did not have a physical Android device connected through ADB. That means the APK’s package, signature, alignment, public download, and compiled application contents were verified, but a device-specific tap-through from Settings to the browser download and installation confirmation remains a hands-on test for the next connected-device pass.

That limitation is recorded deliberately. A successful Gradle build is evidence that the package can be produced. A successful GitHub download is evidence that the public asset is reachable and intact. Neither one, by itself, proves that every Android vendor’s download manager, permission screen, or installer behaves identically. The next useful test is therefore simple and concrete: install 0.1.1-test.4 on a device, open Settings, check GitHub, download the APK, and confirm Android presents the expected installation flow.

## A clearer path from research to release

The Islamic Dilemma now has a more complete loop between its local research library and its public release channel. The app keeps its evidence and study material available offline, while Settings gives the reader a visible way to learn whether a newer test build exists. GitHub holds the release record and checksum, the website points to the same artifact, and the manual installation instructions describe the decisions Android still leaves with the user.

That is the direction for this project: careful source boundaries inside the research experience, honest platform boundaries around the Android build, and release information that can be checked rather than merely asserted. Version 0.1.1-test.4 is another test step, but it is a meaningful one—a better-informed app, a more dependable update path, and a clearer account of what was actually built.
