---
title: "Public Nuisance v1.1.1: Real Headlines, Questionable Commentary"
description: "A source-first Android news reader that puts verified Canadian and U.S. headlines beside a deliberately ridiculous satire layer."
date: "2026-08-29"
category: "Release Notes"
tags:
  - Public Nuisance
  - Android
  - Live News
  - React
coverImage: "/projects/public-nuisance-banner.png"
coverAlt: "Public Nuisance local news satire banner"
featured: false
published: true
---

The news cycle already has enough drama. **Public Nuisance** adds a little more—while keeping the actual source visible underneath the noise.

Version 1.1.1 is the current public Android release of a live-news reader built around a simple separation: publisher reporting stays identifiable, and the deliberately crude GTA-style commentary remains an extra layer that the reader can turn up, turn down, or ignore.

## The source stays in the room

Public Nuisance pulls current feed metadata from selected Canadian and U.S. publishers, including Canadian national and local coverage alongside Fox News and CNN. The app does not pretend that a joke is a source. Each story keeps its original publisher link available, and the reader can open the real article in the browser at any time.

That boundary matters. The satire is there to make the headline experience entertaining, not to disguise where the reporting came from or quietly replace the article with invented facts.

## Roast controls for the daily nonsense

The reader includes roast levels from zero to five. At the lower settings, the presentation stays close to a straightforward headline summary. At the higher settings, the commentary becomes more sarcastic, blunt, and ridiculous while the source link and source identity remain visible.

The result is intentionally not a serious newsroom voice. It is a reaction layer for people who want to look at the day’s headlines and mutter, “You have got to be kidding me,” with a little production value.

## Canada, the U.S., and fewer stale headlines

The app separates Canadian and U.S. feeds so switching regions does not leave yesterday’s stories pretending to be today’s selection. News refreshes immediately when the app launches and can continue while it is open on a five-, ten-, fifteen-, or twenty-minute interval chosen in Settings.

The refresh interval is stored locally, and the Settings screen shows when the last successful refresh completed. If a feed has a bad day, the app can report the failure without pretending that old data is fresh.

## A small Android release with a real update path

Public Nuisance is an Android-only app built with React and Vite inside a Capacitor native shell. Version 1.1.1 is published through the project’s [GitHub release page](https://github.com/mcographics/REALLIFENEWS--GTA-STYLED-/releases/tag/v1.1.1), where the APK and release details remain available.

The app can check that public release channel from Settings and notify the reader when a newer release exists. Android still controls the final installation permission and confirmation, because an app should not silently install another app version behind the user’s back.

## The banner says exactly what the app is

The new Public Nuisance banner is now used throughout the portfolio card, full project page, journal archive, and this article. It has the right amount of Canadian chaos: a press bear, a suspiciously confident newspaper, a maple leaf, and the important reminder that the facts are verified even when the language is questionable.

For the app itself, the principle is the same: keep the source visible, label the joke as the joke, and let the reader decide how much nonsense they want with their news.
