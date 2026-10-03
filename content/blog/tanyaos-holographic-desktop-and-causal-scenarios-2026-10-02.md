---
title: "TanyaOS: A Holographic Desktop, Aero Glass, and Inspectable What-If Reasoning"
description: "October 2 progress: dock-projected floating windows, a Halo-inspired blue glass interface, more reliable source updates, and explicitly hypothetical causal scenarios."
date: "2026-10-02"
category: "Research Project"
tags:
  - TanyaOS
  - Local-First
  - Desktop
  - Cognition
  - Development
coverImage: "/projects/tanyaos-halo-aero-preview-2026-10-02.png"
coverAlt: "Isolated render of TanyaOS Chat and its 3D chamber using the new blue Aero glass theme"
bannerImage: "/projects/tanyaos-halo-aero-preview-2026-10-02.png"
bannerAlt: "TanyaOS material preview with an actual Chat component, simplified dock, and sample conversation"
featured: false
archiveOrder: 1
published: true
---

TanyaOS now treats its desktop as a persistent environment. Chat, Whiteboard,
Mind Map, Settings, and Image Gen open as floating glass windows above that
space, rather than replacing it with another full-screen surface.

This October 2 update brings the interface closer to that spatial design while
continuing the original cognitive architecture. The changes are published in
[TanyaOS on GitHub](https://github.com/mcographics/TanyaOS).

## Windows projected from the dock

The left sidebar has become a compact, bottom-centered glass dock. Its glowing
listening ring opens the live cognition status panel when needed, keeping the
center of the desktop clear. Settings, System, Logout, and Shutdown remain
available through their existing governed controls.

Each floating application measures its own dock button's position. A restrained
projection rises from that button, the window materializes above it, and
minimizing or closing reverses the motion toward the same origin. The desktop,
central core, branding, clock, and dock remain visible beneath these windows.

Chat's composer integrates attachments, message input, push-to-talk, and Send.
Secondary microphone selection, continuous listening, speech status, and Clear
live in an expandable voice section. Desktop dialogue bubbles are hidden while
Chat is open, avoiding a second copy of the conversation behind the window.

Whiteboard fits its drawing canvas into the floating window while preserving its
drawing buffer. Opened panels keep local state when minimized, including Chat
drafts and Whiteboard work. Image Gen has received the window treatment, but its
content remains the existing coming-soon placeholder; this update does not add
an image-generation engine.

## A fixed hologram-blue palette and Aero finish

The decorative palette is now built around **#4AA8FF**, with deeper blue shadows
and icy highlights. It is a Halo Cortana-inspired artistic interpretation, not a
sampled match to a particular game frame. The previous time-of-day hue drift has
been removed so the interface maintains a consistent blue identity.

Translucent surfaces, saturated backdrop blur, diagonal sheen, illuminated inset
edges, and softer shadows provide a Vista-era Aero direction. The chamber's
lighting and beveled glass floor rings share the same base blue. Semantic colors
still distinguish warnings, errors, and successful states.

The article's image is an **isolated component render** using the actual theme,
Chat, and 3D chamber code. Its simplified dock and sample conversation illustrate
materials; it is not a screenshot proving full live desktop acceptance.

## More reliable source notifications

The development watcher previously repeated warnings when the local backend
could not accept source-change notifications. Failed batches were also dropped.

Notifications now retain pending changes, serialize requests, and retry with
bounded backoff. One warning marks an outage and one message confirms delivery
has recovered. The diagnostics distinguish notification transport loss from a
filesystem watcher failure. Backend hash scanning resumes when the backend is
available; it cannot operate while that process is unreachable.

## What-if reasoning stays hypothetical

The causal-hypothesis ledger now supports a small, account-owned binary scenario:
what effect probability is assumed when a declared cause is present or absent?

The caller supplies the probability assumptions. Missing assumptions stay unknown;
the result carries provenance and an explicit hypothetical status. Simulation
neither writes an observed memory nor executes an action, establishes causation,
or grants permission. Candidate ranking can retain the scenario for inspection
without treating unverified probabilities as a scoring advantage.

This is a bounded inspectable what-if mechanism, not validated intervention
learning, a general causal model, or evidence of sentience.

## Evidence and the next acceptance gates

The latest focused causal/world/value/HTTP test run passed **54 tests**. The
source-notification change passed all **17 Electron runtime tests**, including a
local failure/recovery test. UI updates passed component lint, production builds,
action registry checks, and desktop preflight with **22 protected core files**
verified.

Isolated Electron fixtures checked dock-origin alignment, window lifecycle,
retained drafts, and retained drawing pixels. These checks are narrower than
live end-to-end desktop, microphone, attachment, and multi-resolution acceptance.
The broader interactive-surface checker still has 14 existing unrelated gaps.

The supplied cognitive examination documents are plans for future evaluation.
Long-duration cognition, independent human comparisons, and packaged update
installation remain separate acceptance gates. The project's ambition is
unchanged; its present-tense claims stay tied to the evidence available.

