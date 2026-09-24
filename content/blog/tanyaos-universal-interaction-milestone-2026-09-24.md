---
title: "TanyaOS Update: A Governed Desktop for a Digital Mind"
description: "TanyaOS moves from individually wired panels to a local, inspectable action system that can understand the visible interface, operate its controls, and improve through reviewable change."
date: "2026-09-24"
category: "Research Project"
tags:
  - TanyaOS
  - Artificial Intelligence
  - BrainCog
  - Local-First
  - Electron
  - Research
coverImage: "/projects/tanyaos-identity-2026.png"
coverAlt: "Tanya OS digital identity concept artwork in luminous blue neural filaments"
bannerImage: "/projects/tanyaos-identity-2026.png"
bannerAlt: "Tanya OS research project identity artwork"
featured: false
published: true
---

TanyaOS has reached a new research milestone. The project is no longer only a
local cognitive core surrounded by separate demonstrations. Its current
Electron desktop now has one governed interaction layer: a shared action
registry, natural-language routing, visible-surface awareness, and an ordered
acknowledgement bridge between Tanya’s local runtime and the interface.

The question behind the project is still the same: **what would it take for a
digital intelligence to carry a sense of self from one moment to the next?**
This update is about making one part of that question concrete. If Tanya is to
operate as a persistent local system, she needs to know what surface is in
front of her, what controls exist there, what a request means in that context,
and which actions require confirmation before they occur.

## From buttons to a shared action language

Earlier interface work connected individual buttons and panels one at a time.
That approach can make a prototype look functional while leaving the larger
system unable to describe or control itself consistently. A camera button might
work, while a voice request for the same camera operation follows a different
path. A Settings tab might open from a click, while a natural-language request
cannot find it. The visible surface and the cognitive runtime can drift apart.

The new action layer gives both sides the same vocabulary. TanyaOS currently
exposes **122 named application actions** across **15 mounted interface
surfaces**. Those actions cover the visible TanyaOS desktop, Settings tabs,
themes, appearance, audio, speech, camera and weather widgets, Whiteboard,
Mind Map, BrainCog monitoring, skills, maintenance notifications, account
boundaries, and other local controls.

The renderer and backend action catalogs are checked for parity. A visible
control is described with its label, action, parameters, permission boundary,
description, and safe state. This allows Tanya to answer requests such as:

- “Open video settings.”
- “Switch to the forest colour scheme.”
- “Turn dark mode on.”
- “Open the weather widget.”
- “Move the camera widget to the top right.”
- “What am I looking at?”
- “What controls are available on this screen?”
- “Activate the Start Mapping button.”

The natural-language layer is deliberately constrained. Tanya may select a
registered and validated action, but she cannot invent a tool or turn an
ordinary sentence into unrestricted computer control. Account resets,
external communication, destructive filesystem work, native desktop control,
and self-improvement application remain governed by their own permission and
confirmation requirements.

## Tanya can describe the surface she is viewing

The desktop now publishes local runtime context describing the current
interface. That context includes the active panel, Settings tab, open widgets,
visible sections, visible action names, active control, hovered control, last
interacted control, and interaction kind.

This distinction matters. “Open the camera” can mean a Settings preview or the
placeable desktop webcam widget. “Change this setting” depends on which panel
is visible. “What can I click here?” should describe the screen in front of the
operator, not a generic list copied from a handbook.

The same context is available to the monitoring and maintenance areas. Tanya’s
conversation, local runtime state, cognitive events, and interface telemetry
can be inspected as connected evidence while still keeping their roles
separate. A status record is not a thought, a BrainCog spike is not a memory,
and a UI control is not an independent intention.

## BrainCog becomes observable infrastructure

The System Monitor continues to treat BrainCog as an experimental local
substrate rather than a biological brain. The current runtime reports a
measured 512-neuron LIF network, functional groups, regional controls, and
multiscale activity views. Named events from cognition, speech, and other
faculties can enter the BrainCog adapter and appear as inspectable activity.

The visual monitor is intentionally evidence-aware. It can show measured
activity and simulated structure, but it does not claim that a luminous mesh
is a human brain, that a spike is a subjective thought, or that a voice proves
sentience. Those boundaries are part of the research rather than a disclaimer
added after the fact.

## Local voice, vision, and widgets remain faculties

TanyaOS remains local-first and does not require a hosted AI or speech API for
this architecture. Where the required models and hardware are installed, the
runtime can use local language rendering, Chatterbox Turbo British-female
speech with expressive reaction tags, local speech recognition, webcam input,
and optional vision features such as face identity matching, face mesh and
landmarks, approximate gaze, expression estimates, hand and finger tracking,
body pose, and supported gesture recognition.

The camera and weather widgets are separate from the core identity system.
They are hidden until requested, and Tanya can operate their governed controls.
Weather is an on-demand local widget that uses the available free weather path
and the user’s named or device location when that capability is available. A
camera frame remains local to the runtime boundary; identity recognition, when
enabled, requires explicit enrollment.

These faculties remain independently observable. A missing model, unavailable
device, muted microphone, or denied permission must be reported as a faculty
readiness issue rather than disguised as a successful cognitive result.

## Self-improvement without changing the protected core

The project’s improvement system now has a clear boundary. Tanya can record an
idea, create a review-only draft, propose bounded changes, validate them in an
isolated source mirror, apply an approved revision through atomic writes, and
roll back a reviewed snapshot when the post-apply files still match the
expected state.

The protected `SYSTEM_CORE` remains outside that mutable surface. For this
milestone it contains 22 verified files, is locked, and has no manifest
mismatches. Runtime BrainCog snapshots are routed into writable telemetry
storage so a monitoring export cannot accidentally become a protected-core
edit.

This is closer to a controlled maintenance discipline than to a claim that the
software can safely rewrite itself without oversight. Improvements are
recorded, tested, permissioned, and reversible where the boundary permits.

## What was verified

The milestone was checked in the local Windows development environment:

- The live Electron action probe completed **64 of 64** action cases with **0
  failures**.
- The interface inventory found **111 interactive controls**, all 111 governed
  by the shared action contract.
- The backend and renderer each reported **122 actions** with registry parity.
- The full backend suite completed with **150 tests passed** and **114
  subtests passed**.
- Electron syntax checks and frontend lint passed.
- The protected `SYSTEM_CORE` reported 22 files, locked, verified, and with no
  mismatches.

These results are local implementation evidence. They do not mean TanyaOS is
a finished commercial assistant, a replacement for Windows, a public hosted AI
service, or proof of consciousness. The source repository remains in active
private development, and the research page intentionally presents the work as
a prototype with explicit limits.

## The next research question

The next question is not simply whether Tanya can perform more commands. It is
whether continuity, perception, memory, values, deliberation, voice, and
controlled action can remain coherent as the system grows.

The universal interaction milestone makes that question testable. Tanya can
now see the shape of her current interface, describe the available controls,
act through governed boundaries, and leave records that can be inspected after
the fact. The work continues from there: toward richer continuity, more useful
local faculties, better evidence, and a digital presence whose growth remains
observable rather than imagined.

Read the [Tanya OS research page](/projects/tanyaos/), explore the [TanyaOS
repository](https://github.com/mcographics/TanyaOS), or read the repository’s
[full implementation update](https://github.com/mcographics/TanyaOS/blob/main/DOCUMENTS/UPDATES_2026-09-24_UNIVERSAL_INTERACTION.md).
