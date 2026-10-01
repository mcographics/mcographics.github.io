---
title: "TanyaOS: A Memory Archive, a Responsive Core, and the Next Desktop Milestone"
description: "The October 1 TanyaOS progress report: approved local memories in a navigable archive, separate inference and speech activity, stronger local account boundaries, runtime recovery, and the work still ahead."
date: "2026-10-01"
category: "Research Project"
tags:
  - TanyaOS
  - Local-First
  - Cognitive AI
  - BrainCog
  - Electron
  - Development
coverImage: "/projects/tanyaos-identity-2026.png"
coverAlt: "TanyaOS identity concept artwork in luminous blue neural filaments"
bannerImage: "/projects/tanyaos-identity-2026.png"
bannerAlt: "Concept artwork for the TanyaOS local cognitive desktop research project"
featured: false
archiveOrder: 2
published: true
---

TanyaOS is taking shape as a more connected local desktop. The latest work
brings approved memories into an explorable archive, gives the interface a
procedural chamber around its central core, connects processing light to model
and speech lifecycles, and strengthens the boundaries around local accounts.
It also gives us a clearer record of what is ready and what still needs work.

The larger goal remains the same: explore whether a digital system can develop
continuity through identity, memory, values, decisions, outcomes, and learning.
The cognitive kernel owns those records and decisions. Language models, voice,
vision, BrainCog, and the interface are faculties around it. Digital sentience
is the research ambition; the current mechanisms do not establish subjective
experience.

## Memories now have an archive of their own

Memory Mode has moved from the earlier neural rendering experiment to a
read-only chamber of approved local memory records. Suspended slabs represent
records belonging to the signed-in account, arranged by date. The source
supports scroll travel, hover previews, approaching a selected memory,
metadata, related records, and search through loaded entries.

This gives the visual experience a concrete connection to stored information.
The scene loads account-authorized records rather than inventing memories to
fill the room. It pages up to 1,000 records and reports when more records exist.
Search covers that loaded set. Approval, editing, deletion, and upload remain
outside this view.

The archive still needs visible desktop interaction review, particularly for
navigation, readability, account changes, and larger record collections. Its
source implementation and production build are a useful milestone; they do
not settle the quality of every gesture.

## A chamber around the core, with activity tied to real software events

The desktop now has a procedural Three.js chamber with pathways, lighting,
and reflective surfaces around the central interface. Its activity responds
to compatible processing and speech state. The separate HRA brain view has a
graphite treatment, a cyan sulcal circuit mask, and a warm-gold processing
channel with eased activation and decay.

Under that presentation, BrainCog now uses 10,000 simulated LIF units arranged
in eight software task groups. Model generation and spoken output have
separate start and finish events, because generating a response can finish
before the voice finishes playing it. The monitor contract rejects missing,
legacy, or incompatible activity snapshots. The current simulation requests
CUDA and retains a CPU fallback when GPU initialization or execution fails.

These lights and task groups describe software activity. They are not human
neural recordings, a measured connectome, or a reviewed correspondence between
BrainCog and anatomical regions. The reviewed production anatomy binding
registry remains empty. Close-up visual acceptance and hardware performance
review remain part of the next desktop milestone.

## Local voice and account boundaries

The current source starts continuous local listening after sign-in when the
required models and devices are available, selecting the Windows default
microphone. Ordinary speech can enter the local cognition path without a
mandatory wake name, and listening stops on logout or an explicit stop.
Voice output follows the Windows default speaker route, while Settings
exposes more useful microphone, GPU, and runtime diagnostics.

Sign-in has distinct password and optional PIN fields. The PIN is a convenience
unlock, not a second factor. That distinction matters while the account
implementation continues to mature.

The local API now limits browser origins to the intended loopback surfaces;
packaged Electron carries a per-process capability for its opaque origin.
Sensitive memory and kernel routes require a local account session and hold
the account context under a lock. Electron media permissions are restricted
to the known app window and renderer. These are implemented protections with
regression coverage, alongside open work on password strength, hashing
migration, account authority, and bearer-session storage.

Local models and speech remain central to the project. Hosted AI and speech
APIs are not required for the cognitive workflow. Optional features such as
weather can make external requests when selected, so local-first describes
the architecture without implying that every optional feature is offline.

## Recovery is becoming part of the desktop architecture

Development supervision now separates ordinary renderer updates from backend,
Vite, and Electron restarts. A coordinator classifies source changes, validates
them, records recovery state, and works with the Electron process that owns
the affected children. Retry limits, readiness checks, and reconnect behavior
make failures more inspectable.

Packaged updating is a separate implementation path. It still needs a
configured release feed, signed test artifacts, installation from an older
package, and observed post-install health. Automated updater and supervisor
tests do not establish that a production update or rollback has been installed
successfully.

## A clearer source tree and an honest progress record

The documentation now has a master reference and dedicated Architecture,
Product, Guides, Brain, History, and Archive folders. Earlier Blender neuron
and synapse studies have been retired, with their notes archived and local
model/render outputs recycled. Those studies are historical work, rather than
the current Memory Mode or an active modeling milestone. The separate
procedural neuron illustration in the frontend remains in source.

The [September brain and startup report](/blog/tanyaos-brain-memory-neural-field-2026-09-28/)
remains available as a dated account of that earlier stage. This update
records the direction the desktop has taken since then.

For the current source, frontend lint and production build passed, along with
16 Electron runtime tests, parity across the 120-action registry, and the
current BrainCog monitor contract. The interactive-surface checker still
reports 14 controls missing governance metadata. The build also reports large
App and brain-view bundles that need further optimization. Backend test
results are included in the repository's dated publication record.

## What we are continuing to build

The immediate work is to close those control metadata gaps and exercise the
archive, account isolation, graphics, audio routing, and reconnect behavior in
the target Windows desktop. Restart and rollback need a disposable development
checkout; signed packaged updates need a controlled test feed and installation
evidence. Graphics work needs measured frame time and memory budgets, followed
by further bundle reduction.

A real-time 3D embodiment production plan is also documented. It is a future
implementation plan, and does not establish a completed avatar or physical
embodiment. The core's continuity and governed behavior remain the foundation
for that work.

TanyaOS remains in private development, with no public installer announced in
this update. Follow the [TanyaOS research page](/projects/tanyaos/) for the
project overview and current progress. The next milestone is a desktop whose
memory, actions, voice, and recovery can be inspected and exercised together.
