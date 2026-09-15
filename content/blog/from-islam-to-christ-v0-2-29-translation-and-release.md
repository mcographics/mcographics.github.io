---
title: "From Islam to Christ v0.2.29: A Translation Button, a Deeper Reader, and an Honest Release"
description: "The v0.2.29 build brings translation choices into the Bible reader, rebuilds Windows and Android from the same source, prepares the journal for archive pages, and records exactly what is ready for public release."
date: "2026-09-15"
category: "Faith and Technology"
tags:
  - From Islam to Christ
  - Bible Study
  - Translation
  - Android
  - Windows
  - Privacy
  - GitHub Releases
  - Building in Public
featured: false
published: true
coverImage: "/projects/from-islam-to-christ-banner.png"
coverAlt: "From Islam to Christ banner showing a path from a mosque silhouette toward a cross and open Bible"
bannerImage: "/projects/from-islam-to-christ-banner.png"
bannerAlt: "From Islam to Christ banner artwork"
---

Version 0.2.29 of [From Islam to Christ](https://github.com/mcographics/FromIslamtoChrist) is a source and build milestone built around a simple product question: if a reader is looking at the Bible, can the app make it easier to read the text in the language that helps them understand it best?

The answer in this build is now visible inside the Bible reader itself. The reader controls are arranged in a direct, intentional line:

```text
A−   100%   A+   ·   Translation   ·   Paper
```

The new Translation button sits between the font-size controls and the reading-tone control. It opens the available language choices, shows which text is bundled locally, and lets the reader choose the language used for the chapter on the page. The selection is remembered locally through the same preference system that already stores font scale and reading tone.

This is a small interface change, but it closes an important gap. Translation choices existed in the application before this build, yet a useful capability is not really useful if it is hidden in a secondary area where a reader may never look. The Bible is the central experience of this application. Language belongs beside the words, not in a distant settings drawer.

## A translation control that explains itself

The Translation button does more than expose a dropdown. It gives the reader a compact explanation of what each choice means.

The first group is the locally bundled Bible text. English is the main language, and the current database also carries Bulgarian, Chinese, and Spanish verse variants. Those choices remain available when the device is offline because they are part of the application’s local content boundary.

The other configured language choices use the existing cached and automatic translation service when a network connection is available. If a translation has already been cached on the device, the app can reuse it. If the app is operating in Offline-only mode, it does not make a new network request; it stays with bundled or cached content instead.

That distinction is deliberately visible. “Bundled with the app” and “Translate this chapter when online” are different promises. A reader should not have to guess whether a language will work on an airplane, in a private offline session, or during a weak connection.

The menu also includes a direct path to compare the bundled text variants. That comparison view keeps the same chapter aligned in columns so that a reader can inspect how the available local texts differ. It is a study aid, not a claim that a translation choice removes the need for context, manuscript awareness, or careful interpretation.

## The chapter remains the center of the experience

Changing the selected language updates the verse rendering already used by the reader, the current chapter, and local read-aloud. The Bible reader does not move the user to a browser or open a separate translation website. The chapter stays in the app, and the language selection follows it.

That matters especially for someone who is reading slowly or returning to a difficult passage. A translation action that breaks the reading context creates friction at exactly the moment the reader is trying to pay attention. The new control keeps the book, chapter, notes, highlights, word-study links, and cross-reference tools in the same place.

The source database continues to provide the complete 66-book KJV index and 31,102 verse rows. The latest database verification reports the following local translation coverage:

- English: 31,102 verses.
- Bulgarian: 31,101 verses.
- Chinese: 31,022 verses.
- Spanish: 31,066 verses.

The small coverage differences remain visible through the existing fallback behavior. When a local variant is unavailable for an individual verse, the reader can still use the base text or the configured translation path rather than receiving an empty chapter.

## Privacy still shapes the translation feature

Language support cannot be treated as an excuse to send everything a person types to a remote service. From Islam to Christ is designed for readers who may have questions, fears, family pressure, or legitimate reasons to keep their spiritual exploration private.

The translation path therefore preserves the app’s existing privacy boundary. Public interface text and Bible reading text can be processed through the configured translation service when the user has not enabled Offline-only mode. Private notes, reflections, and typed searches remain on the device and are not included in translation requests.

The app also keeps the Discreet Mode boundary separate from translation. A neutral startup surface can reduce the chance that the Christian identity of the app is revealed casually, but it does not pretend to provide perfect safety. A user must still decide what is safe on their own device and in their own circumstances. Privacy protection is a product feature, not a decorative badge.

The new reader button follows that same principle: make the useful choice easy to find, but do not hide the boundary behind a friendly label.

## One source, two platform builds

The v0.2.29 Windows and Android builds were generated after the Translation control was added. Both targets use the same production renderer and the same generated local database. The build process indexed 1,566 Data assets, the Bible corpus, word-study material, source-library information, and the original-language alignments before packaging.

The Windows x64 NSIS installer completed with Electron Builder 26.15.3 and Electron 44.3.0. The Android package completed its Capacitor sync and Gradle `assembleRelease` task with the project’s Java 21 toolchain and Android SDK 36 target. The shared renderer compiled successfully, including the new reader menu, responsive styling, and language-copy additions.

That is useful build evidence. It shows that the feature exists in the source and that the two platform packaging paths can consume it. It does not, by itself, prove that every screen has been clicked through on every device. The project keeps those claims separate because “it compiled” and “a person used it successfully” are different kinds of evidence.

## Why the public release is not being overstated

The [public GitHub release history](https://github.com/mcographics/FromIslamtoChrist/releases) still identifies v0.2.28 as the latest public release while v0.2.29 is being prepared. The local v0.2.29 artifacts are release-mode outputs, but they are not yet the same thing as a production-distributed release.

The Windows installer is not Authenticode-signed on the current build machine. It can be packaged and tested as an installer, but Windows will not identify a trusted signing publisher for it.

The Android `assembleRelease` output is unsigned until a stable production keystore is supplied. A separate local device copy can be signed with the existing development key for direct testing, but that is not an appropriate substitute for a production identity. Android signing is an update chain: the key used today affects whether an app can receive an update tomorrow. A new key must be protected and retained, not generated casually for one upload.

The fresh Windows installer, updater metadata, and unsigned Android engineering APK have now been uploaded to a maintainer-only GitHub draft release named `From Islam to Christ v0.2.29 — engineering build`. That draft makes the artifacts available for internal review without presenting them as a safe public download. It does not change the public latest release, which remains v0.2.28.

There is also a content-rights gate. The application can index and use the supplied Data material locally while the source inventory is being reviewed, but inclusion in a working database is not automatic permission to redistribute every file. The strict release check still requires license or attribution decisions for the 1,566 indexed assets.

These constraints are not being hidden in the release copy. The goal is for someone reading the website or downloading an artifact to know whether they are receiving a public, signed, rights-cleared release or a local engineering build.

## Preparing the journal for more pages

This article also arrives with a structural website change. The Majestic Creations Journal previously rendered the featured article and the entire remaining archive on one page. That worked while the archive was smaller, but it would become an increasingly long scroll as more project stories are added.

The blog is now prepared for archive pagination. The main `/blog/` page shows the featured story and the first group of archive articles. Additional groups use predictable routes such as `/blog/page/2/` and `/blog/page/3/`. The archive currently uses eight articles per page, and the page count is calculated from the published Markdown content rather than hard-coded to a fixed number.

The preparation includes:

- A shared pagination component with previous, next, current-page, and numbered-page states.
- Static page generation for only the archive pages that currently contain published articles.
- Direct slash-terminated anchors that work in the GitHub Pages export.
- Sitemap entries for additional blog pages.
- Exporter support so the generated `index.html` files are actually written into `pages-dist`.
- Documentation in the blog content README explaining how future articles become new archive pages.
- Archive numbering that continues across pages instead of restarting at one in every view.

The article URLs themselves do not change. A post remains available at `/blog/article-slug/`, while the archive gains additional routes around it. That is important for links, search results, RSS entries, and project pages that already point to individual journals.

## A better record of building in public

There is a temptation in software work to write only the pleasant half of a release story: the feature exists, the screenshots look good, and the download link is presented as if the work ends there. A serious product record needs the other half too.

For v0.2.29, the pleasant half is clear. The Bible reader now puts translation in reach. The configured local texts are easier to use. The current chapter stays inside the reader. The same source builds for Windows and Android. The website journal is ready to grow beyond a single archive page.

The other half is just as clear. Production Android signing is still a required release step. Windows trust signing is still absent. The content-rights review is still open. The public release page remains v0.2.28 until those boundaries are resolved and the new assets can be verified from GitHub itself.

That honesty is part of the product identity. From Islam to Christ is intended to lead a reader toward Jesus Christ through Scripture, careful questions, and an experience that respects the seriousness of their situation. The technology should reflect that seriousness. It should make the next good action easier, keep the reader’s agency intact, and say plainly what has been built, what has been tested, and what still needs responsible attention.

The next step is not mysterious: protect one stable production Android signing identity, complete the per-asset license and attribution review, optionally configure Windows Authenticode signing, publish the verified v0.2.29 artifacts, update the website links, and verify the public download from the same URLs visitors will use. Until then, this build is a meaningful engineering milestone—and this journal records it as one.
