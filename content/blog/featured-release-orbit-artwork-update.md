---
title: "Featured Release Orbit: Artwork and Motion Refinements"
description: "A focused homepage update for the featured-release orbit, including new Words of Yeshua and Public Nuisance artwork, circle-edge corrections, and a measured motion rollback."
date: "2026-08-29"
category: "Studio Journal"
tags:
  - Majestic Creations
  - Website Updates
  - Interface Design
  - Words of Yeshua
  - Public Nuisance
featured: false
published: true
coverImage: "/og.png"
coverAlt: "Majestic Creations gold lion and monogram"
---

The featured-release area on the Majestic Creations homepage has received a focused visual update. The goal was simple: make each release card feel like part of the same orbit while keeping the supplied project artwork clear, recognizable, and reusable in its original locations.

## New artwork for the featured cards

The Words of Yeshua card now opens with the supplied portrait home-screen artwork. It is a better fit for the tall featured-card frame because the complete reading experience remains visible instead of being compressed into a wide cover treatment.

The Public Nuisance card also received a dedicated featured image using the supplied **Local News — No BS** artwork. The original Public Nuisance cover remains unchanged on the project page and journal article, while the archive uses a separate wide banner designed for its list layout. The narrow featured-orbit presentation and the wide archive presentation can therefore each use the right composition without changing the article cover.

Keeping those assets separate matters. A featured card can have a composition designed for its narrow, tall frame without quietly changing the banner that identifies the project everywhere else.

## The circle edge is cleaner

The gold `circle.png` reaches very close to the edge of its source bitmap. When that image was enlarged, tilted, and rotated, the outer ring could develop a hard clipped edge. The orbit image now renders inside a slightly smaller internal box while remaining centered in the same 480-pixel orbit space. This gives the transformed gold edge room to render without changing the orbit’s intended position.

The page-level overflow boundary was also corrected earlier in the maintenance pass. The orbit can extend beyond its component box, while the document still prevents accidental horizontal page scrolling.

## Motion is being treated as part of the composition

One experiment placed the cards and circle inside a single rotating system, inspired by the slow circular platform motion in Krypton’s council chamber in *Man of Steel*. That test made the cards rotate with the ring, but it also rotated the card faces themselves. The change was reverted so the current presentation preserves the established card orientation and controls while the motion direction is evaluated separately.

That rollback is intentional. A visual experiment is useful even when it does not become the final behavior. The featured area needs to communicate the release title and application identity at a glance; motion should support that reading rather than compete with it.

## What was checked

This update was built and published through the normal GitHub Pages workflow. The checks included:

- A successful production Pages build.
- Rendered homepage and article tests.
- Verification that the new Words of Yeshua featured asset is used by card 2.
- Verification that the new Public Nuisance featured asset is used by card 3.
- Confirmation that the original Public Nuisance banner remains available separately.
- Live HTTP checks for the homepage and featured artwork assets.
- A clean working tree after publication.

The result is a more deliberate featured-release presentation: supplied artwork is respected, project banners remain stable, and the orbit has enough visual room to render its gold edge cleanly.
