---
title: "Site Maintenance Update: A Clearer Home for Words of Yeshua"
description: "A detailed maintenance update covering the new Words of Yeshua product page, featured-release controls, visual refinements, and the checks behind this portfolio release."
date: "2026-08-28"
category: "Studio Journal"
tags:
  - Majestic Creations
  - Website Updates
  - Words of Yeshua
  - Interface Design
  - Local-First
coverImage: "/og.png"
coverAlt: "Majestic Creations gold lion and monogram"
featured: false
published: true
---

The Majestic Creations website has received another maintenance pass. This update is about orientation: helping a visitor understand what a project is, giving a featured release a more deliberate place in the homepage composition, and making sure the path from a portfolio card to a complete product page is clear.

The largest part of the work is a dedicated product page for **Words of Yeshua**. The smaller changes around it—release-card behavior, control placement, contrast, spacing, and sitemap coverage—support the same goal. A portfolio should not merely display attractive images. It should provide enough context for a visitor to know what they are looking at, where to go next, and which details are confirmed.

## Words of Yeshua now has a complete product page

Words of Yeshua previously had a project card and a journal entry describing the v0.5.2 milestone. It now has its own full product route at [`/projects/words-of-yeshua/`](/projects/words-of-yeshua/), structured in the same product-page family as Work Day with God.

The page introduces the application as a Christ-centred, local-first Scripture study companion for exploring the words of Yeshua inside complete King James Version chapter context. That description is intentionally careful. The application is meant to help a reader return to the text, not to replace Scripture, manufacture doctrine, or blur the difference between Biblical text and interface presentation.

The new page includes:

- A dedicated hero section using the Words of Yeshua cover artwork.
- Current Windows x64 release information for v0.5.3.
- A direct link to the official GitHub release and installer.
- A clear note that the Windows installer is unsigned.
- Product facts covering release version, price, account requirements, and offline use.
- A purpose section explaining why chapter context matters.
- A feature grid for context reading, Scripture exploration, saved passages, and reading-room settings.
- A local-first privacy section describing account-free use and local study preferences.
- A platform table that distinguishes the available Windows release from platforms without a public build listed.
- A related journal link for the earlier v0.5.2 release story.

The route also includes SoftwareApplication metadata and social-preview information. This gives search engines and shared links a more accurate description of the actual application instead of relying only on a general portfolio card.

## The supplied Light Mode artwork is now a working gallery

The Words of Yeshua page uses the supplied artwork from the `viewingmode/WordsofYeshua/Light Mode` collection. The files were preserved as the site’s Light Mode presentation rather than being substituted with Work Day with God screenshots or generic placeholders.

The gallery contains the cover plus nine application captures. Visitors can move through the home screen, reading layout, study details, display settings, Scripture exploration, passage search, chapter reading, saved passages, and application settings. Each thumbnail is a real button, so the gallery is usable with a mouse, touch input, keyboard focus, Enter, or Space.

The source captures are Light Mode assets. The page labels them as Light Mode instead of implying that a separate dark capture set exists. That distinction is small, but it matters for provenance and for communicating what the visitor is actually seeing.

## Featured releases received an App Control

The homepage featured-release area now has a dedicated control below the circular display:

`← App Control →`

The arrows select the previous or next featured application. At present, the featured applications are Work Day with God and Words of Yeshua. The selected card receives an active visual treatment and an accessible current-state marker, while the links still open the appropriate full product page.

Pressing either arrow pauses both the circle animation and the card-track animation. The pause lasts while the visitor is interacting, and a fifteen-second inactivity timer begins after the most recent arrow press. If the visitor does nothing else, the automatic orbit resumes after those fifteen seconds. Pressing another arrow during the pause selects again and starts the fifteen-second window over.

This behavior gives the orbit two purposes without making either one fight the other. Automatic motion keeps the featured area alive when it is being passively viewed. Manual control gives the visitor a stable moment to decide which application to open. The motion also respects the existing reduced-motion preference, which disables decorative animation for visitors who request less movement.

## The featured-release information is easier to read

Several small layout refinements followed the control work. The App Control was moved upward and then aligned with the release information beneath it. The “Featured releases” label and “02 cards” count now sit together as a centered row below the control rather than appearing as a separate, offset header.

The changes were made incrementally because the orbit is a spatial composition rather than a normal flat card. The circle, card track, controls, and labels each have their own positioning context. Moving one element without checking the others can make the entire group feel crooked even when every individual element is technically centered in its own box.

The result is a simpler reading order:

1. See the circular featured-release display.
2. Use App Control to select an application.
3. Read the centered release count beneath the controls.
4. Open the selected application’s full product page.

## Project-card contrast was improved

The portfolio’s **Explore the full project** link received a small but important contrast update. In dark mode, the text is now white and slightly larger. In light mode, it is black and slightly larger. The gold hover treatment remains so that the interaction still has a clear identity without depending on a tiny, low-contrast label.

This kind of maintenance is easy to overlook because it changes only a few CSS values. It is nevertheless part of the site’s larger accessibility direction. Link text needs to remain legible against its card background, and a visitor should not have to search for the action that leads from a project summary to more information.

## Release and discovery paths were checked

The Words of Yeshua project data now reflects the public repository and current v0.5.3 release. The featured-release card links to the product page, and the project archive’s full-project link points to the same destination. That prevents the homepage from sending a visitor only to an older journal entry when a complete product page is available.

The static Pages exporter was also updated to include the Words of Yeshua product route. This was necessary because the site uses a static export for GitHub Pages: a route can build successfully in the application while still being absent from the published folder if the exporter does not write its `index.html` file.

The sitemap now includes the Words of Yeshua product route as well. The blog generator continues to create the article archive, RSS feed, category and tag archives, and published article pages from the Markdown source files.

## What was verified

The maintenance pass was built and deployed through the GitHub Pages workflow. Checks included:

- A successful production build with the Words of Yeshua route recognized.
- Rendered HTML checks for the Words of Yeshua product page, metadata, release link, gallery label, and journal link.
- Static export verification for `projects/words-of-yeshua/index.html`.
- Successful GitHub Pages deployment for the updated commits.
- Live HTTP checks for the product page, homepage, stylesheet, cover artwork, and chapter-reading artwork.
- A clean working tree after publication.

The existing broad rendered-page test suite still contains an older homepage expectation for a Comic Organizer download label that no longer exists in the current portfolio markup. The new Words of Yeshua route test passes, and the production build and deployed route are healthy. That legacy assertion remains a separate cleanup item rather than being presented as a failure of this maintenance update.

## A quieter, clearer portfolio

This update does not change the purpose of Majestic Creations. It makes the existing direction more visible: local-first applications, clear project boundaries, honest release notes, supplied artwork treated carefully, and interfaces that give visitors enough control to look around at their own pace.

Words of Yeshua now has a proper home beside Work Day with God. The featured orbit can be paused and directed. The project links are easier to see. The static export and discovery paths know that the page exists. These are modest changes individually, but together they make the portfolio feel more like a maintained studio record and less like a collection of disconnected previews.
