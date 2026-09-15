---
title: "The Islamic Dilemma 0.2.3: From Test Build to Production Release"
description: "A detailed release record for The Islamic Dilemma 0.2.3: the permanent Android production signing line, offline research surfaces, Sharia provenance checks, external source links, emulator validation, and the honest limits of a direct GitHub release."
date: "2026-09-15"
category: "Release Notes"
tags:
  - The Islamic Dilemma
  - Android
  - GitHub Releases
  - Sharia Law
  - Offline-First
  - Release Engineering
  - Source Transparency
coverImage: "/projects/islamic-dilemma-banner.png"
coverAlt: "The Islamic Dilemma research application artwork"
featured: false
published: true
---

The Islamic Dilemma has moved from its Android test-build channel into a public production release. Version **0.2.3** is now published in the dedicated [Islamic-Dilemma-Production GitHub repository](https://github.com/mcographics/Islamic-Dilemma-Production/releases/tag/v0.2.3), with a signed APK for direct Android installation, an Android App Bundle prepared for managed distribution, and checksum files that let the artifact be checked independently.

That change is more than a version-number update. The early `0.1.1-test.4` line was useful for proving the first Android package, the Settings release checker, and the basic update workflow. It was debug-signed and intentionally treated as a test line. The new `0.2.x` line has a permanent RSA-4096 production identity, an explicit production update channel, a repeatable release script, and a public release record that matches the application’s installed version.

The application itself remains what it was meant to be: an offline-first research workspace for examining the Qur’an’s relationship to the Torah and Gospel. It does not ask the reader to accept a conclusion merely because a screen presents it. It keeps the passage, interpretation, source type, context, and uncertainty visible wherever the current content supports that distinction.

## What changed between the test line and 0.2.3

The production release carries the research foundation forward while closing several gaps that matter when an app moves beyond private testing.

### A real production release channel

The stable app now reads its update information from **mcographics/Islamic-Dilemma-Production**. Stable builds refuse to fall back to the older test repository, which prevents a production APK from quietly pointing readers at a debug or prerelease channel. The release page, APK, AAB, and checksum files are all public and inspectable.

The production package identity is:

- Package: `com.majesticcreations.islamicdilemma`
- Android version: `0.2.3`
- Android version code: `20003`
- Distribution: direct GitHub APK, with an AAB prepared for a future managed-distribution decision
- Release tag: [`v0.2.3`](https://github.com/mcographics/Islamic-Dilemma-Production/releases/tag/v0.2.3)

The APK and AAB use the same permanent production signing certificate as the earlier stable `0.2.0`, `0.2.1`, and `0.2.2` releases. The certificate SHA-256 fingerprint is:

```text
e59e6d35b90264f8fd4281b096d44405249a2c432c08771e006b6f11ab66730e
```

Keeping the signing identity stable is essential. A future installation of `0.2.4` or later can update a `0.2.3` production installation normally because Android recognizes the same signing identity. That is different from the old debug test package, which Android correctly treats as a separate signing line.

### Android navigation and external research references

Android system Back now participates in the app’s route history. A reader can enter a nested dilemma or research screen and return to the previous app route without the Capacitor activity closing unexpectedly. The root route still yields to normal Android history when appropriate.

Reference links received the same platform-specific attention. Hadith, academic, legal, human-rights, and other source links in the Sharia research archive now use the Capacitor Browser handoff on Android. This sends the reader to the system browser or custom tab instead of trying to turn an external source into an in-app WebView page. A browser fallback remains available for ordinary web builds.

That boundary is useful for both usability and honesty. The app can keep a source record, locator, note, and link together; the external publisher remains the place where the reader can inspect the current source. The application does not pretend that an archived description inside the app is the same thing as the source itself.

### Stronger Sharia provenance checks

The Sharia archive is deliberately structured as a source-oriented research layer. Version 0.2.3 adds integrity checks that verify:

- topic source IDs resolve to the source registry;
- hadith source IDs resolve to hadith source records;
- source records include the notes needed to explain their limits and use;
- dated jurisdiction records point to the source queue and use valid date labels;
- the current country records remain represented as a research queue rather than an unsupported claim that an entire country operates under one uniform version of “full Sharia.”

The content is organized to keep Qur’an, hadith, tafsir, fiqh, classical jurisprudence, academic scholarship, modern law, and human-rights standards from collapsing into one undifferentiated category. That matters especially for topics such as apostasy, blasphemy, family law, religious minorities, criminal-law categories, and freedom of belief. A classical legal position is not automatically a current statute, and a current statute is not automatically a complete description of every school or historical period.

The archive’s current research surfaces include the major Sunni legal schools and Ja’fari tradition, classical legal categories, focused topic records, country profiles, a human-rights comparison workflow, claim verification, and side-by-side debate reading. These are research tools and records, not a claim that every scholarly citation, current statute, or historical question has reached final editorial review.

## The production app remains offline-first

The core library is packaged locally for reading without an account or a continuously available server. The current application includes:

- four distinct dilemma routes covering preservation, the Gospel Christians possessed, textual corruption, and the meaning of confirmation;
- a chronological evidence timeline separate from the manuscript collection;
- focused Qur’anic evidence records with context, interpretive readings, related terms, and related passages;
- Bible reading and full-text search across the bundled translation corpus;
- manuscript and historical-witness material;
- Hebrew and Greek lexical study surfaces;
- a Sharia Law archive with source and confidence labels;
- private bookmarks, notes, theme settings, reading depth, and last-route state stored on the device.

The network is used for specific boundaries rather than for the core reading experience: checking the public GitHub release channel, opening external references, and downloading a newer APK. Research notes, saved passages, and preferences are not uploaded to GitHub by the release checker.

If the release channel is unavailable, the application reports that update check as unavailable while the packaged research remains available. That separation is part of the product design: a network failure should not make the offline library look like it has disappeared, and a stale response should not be presented as current scholarship or current law.

## The official 0.2.3 artifacts

The [public v0.2.3 release](https://github.com/mcographics/Islamic-Dilemma-Production/releases/tag/v0.2.3) contains the APK, AAB, and matching SHA-256 sidecars.

| Artifact | Size | SHA-256 |
| --- | ---: | --- |
| [`Islamic-Dilemma-0.2.3.apk`](https://github.com/mcographics/Islamic-Dilemma-Production/releases/download/v0.2.3/Islamic-Dilemma-0.2.3.apk) | 27,296,581 bytes | `4d6e57b5ff8ab755d86da86cccbb7918af55d67dcf176c6ce4f69be99324a361` |
| [`Islamic-Dilemma-0.2.3.aab`](https://github.com/mcographics/Islamic-Dilemma-Production/releases/download/v0.2.3/Islamic-Dilemma-0.2.3.aab) | 27,147,340 bytes | `95b02caadaaef9f22369313f8caf8a27ef4aa0168003e0f8b39b1fa6e8147da3` |

The checksum sidecars are published beside the artifacts. A reader who wants an independent check can calculate SHA-256 for the downloaded file and compare it with the value in the matching sidecar and the release record.

## Installation and upgrade paths

For a fresh installation, download the APK from the release page, open it on the Android device, review Android’s installation confirmation, and approve the normal install-source prompt if the browser or file manager asks for permission. The AAB is not the direct sideload artifact; it is prepared for a future store or managed-distribution path.

For a device that already has production `0.2.0`, `0.2.1`, or `0.2.2`, the new APK is intended to update in place because the production signing identity is unchanged. Device-local settings, saved passages, and private notes are expected to remain under Android’s normal update behavior.

The older `0.1.1-test.4` package is different. It was debug-signed. Android will reject a direct update from that package to the production-signed APK with a certificate mismatch, even though the package name is the same. Removing the debug test package can make the production install possible, but Android removes the old package’s local data as part of that transition. That should be a deliberate test-data decision, not something hidden inside a release button.

The connected Samsung SM-G781W currently remains on that debug-signed `0.1.1-test.4` test package. The safe device verifier attempted the production installation without erasing anything, detected the signature mismatch, and stopped. No uninstall, data clear, or overwrite was performed. The production APK was instead installed and launched on a disposable Android 35 emulator, where the new external-browser reference path was also exercised.

## What was verified

The release was checked at multiple levels so that “the file exists on GitHub” would not be mistaken for complete application validation.

The current source suite passed **12 tests**. Those checks cover version consistency, Bible and original-language corpus manifests, timeline/source integrity, Sharia records and provenance, update-channel rules, production-signing guards, Android Back wiring, and the native Browser handoff for external references.

The production verification command completed the data checks and Vite build. The web build transformed **1,837 modules**, the offline Bible search index was generated, Capacitor synchronized the packaged web assets into Android, and Gradle produced both the release APK and AAB with JDK 21 and Android SDK 36.

Android packaging checks confirmed the package name, `0.2.3` version, version code `20003`, one APK signer, RSA-4096 certificate identity, APK Signature Scheme v2, and the AAB’s `jarsigner` verification. The local APK and AAB hashes were recorded in sidecars and published beside the GitHub release.

The signed APK was installed through the safe device-verification path on the disposable Android 35 emulator. Runtime smoke coverage included the app launch, the research navigation surface, Sharia source browsing, the external handoff from an “Open reference” action to Chrome, and Android Back returning to the app’s `MainActivity`.

The physical phone remains intentionally separate from that emulator proof. It has not received the production build yet because the existing test package uses a different key. This release therefore proves a clean production install and runtime path on the disposable emulator, but it does not claim a physical-phone upgrade or a vendor-specific visual tap-through.

## What 0.2.3 does not claim

This is a public direct GitHub release, not a Google Play publication. The AAB is ready for a future managed-distribution decision, but no Play Console upload or store review has been performed.

The app is a serious research foundation, not a finished encyclopedic scholarly corpus. Sharia source citations still require continued independent review. Modern law records must be refreshed against current primary statutes and reliable monitoring sources. Case records, historical claims, translations, and packaged-source licensing and attribution also remain ongoing editorial gates.

The production signing key is kept outside the public repository. Its secure backup and recovery plan remain an operational responsibility for the project owner. Losing the only usable production signing identity would make future Android updates substantially more difficult.

The Android browser handoff is verified on the disposable emulator. Browser behavior, download permissions, installer prompts, and visual layout can vary by device vendor and Android configuration, so a physical-device validation remains a separate release gate. The connected Samsung test installation has been protected rather than silently destroyed to make that gate appear closed.

## A new release line, with the evidence still visible

The Islamic Dilemma is now easier to distribute without making its limits less visible. GitHub holds the signed public artifacts and checksums. The website points to the same production repository and release. Settings can check the stable channel. Android keeps the final installation confirmation. The research library remains local-first, while external references return the reader to the source publisher.

That is the purpose of **0.2.3**: move the application out of the test-build lane with a repeatable, inspectable production path while continuing to say exactly what has been built, what has been tested, and what still deserves careful review.
