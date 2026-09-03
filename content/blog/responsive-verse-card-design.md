---
title: "Designing a Verse Card for Real Screens"
description: "The design decisions behind a Verse Card that adapts across DPI settings, resolutions, and the devotional reader."
date: "2026-08-27"
category: "Design and Development"
tags:
  - Work Day with God
  - Interface Design
  - Accessibility
  - Typography
coverImage: "/projects/work-day-with-god.png"
coverAlt: "Work Day with God devotional application"
bannerImage: "/projects/work-day-with-god-card-banner.png"
bannerAlt: "Work Day with God wide banner artwork showing work, faith, and purpose"
featured: false
published: true
---

A Verse Card looks simple until it meets a real monitor. A fixed quotation size may be comfortable on one desktop and overflow on another. A header clock that seems balanced at full size can collide with the wordmark when the card is scaled down. Buttons that fit neatly in a footer can become a row of competing symbols.

The 1.4.4 work on Work Day with God treated the card as a responsive composition rather than a fixed picture. The quotation responds to its available width, longer passages receive additional protection, and the header and footer use coordinated spacing and typography. The Local and Jerusalem date-time block is centered, while branding and window controls keep their own areas.

There are also separate controls for separate needs. PC display scaling changes the desktop window's presentation. PC window resolution changes the actual Electron window dimensions. Verse Card text size changes the Scripture quotation. Devotional text size changes the expanded reflection. Keeping these controls independent prevents one preference from unexpectedly changing another surface.

The result is not merely a smaller version of the original card. At a narrow size, the interface has to decide what deserves room: the Scripture, its reference, the invitation to read, and the controls that help a person return. Responsive design is therefore a prioritization exercise as much as a measurement exercise.

The same principle carries into the devotional reader. The reader needs more space for paragraphs, reflection questions, prayer, and Scripture context. The Verse Card needs clarity and immediate recognition. Both surfaces share the same content and local state, but they do not need to behave identically.

For a devotional application, this care is worthwhile. The interface should become quieter as the screen becomes smaller, not more frantic. A person should be able to read a verse without fighting the window that is meant to help them pause.
