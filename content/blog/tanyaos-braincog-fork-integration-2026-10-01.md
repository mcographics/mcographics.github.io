---
title: "TanyaOS and BrainCog: One Maintained Integration, One Tested Runtime"
description: "TanyaOS now consumes a pinned BrainCog fork, shares its simulation and lifecycle code, preserves local storage boundaries, and carries upstream licenses and credits through the desktop packaging path."
date: "2026-10-01"
category: "Research Project"
tags:
  - TanyaOS
  - BrainCog
  - Local-First
  - Open Source
  - Electron
  - Development
coverImage: "/projects/tanyaos-identity-2026.png"
coverAlt: "TanyaOS concept artwork with luminous blue neural filaments"
bannerImage: "/projects/tanyaos-identity-2026.png"
bannerAlt: "Concept artwork representing TanyaOS's local cognitive research direction"
featured: false
archiveOrder: 1
published: true
---

The [earlier October 1 update](/blog/tanyaos-local-desktop-progress-2026-10-01/)
covered TanyaOS's memory archive, separate inference and speech activity, local
account boundaries, and runtime recovery. This follow-up connects one of those
pieces to a maintainable source dependency: TanyaOS now uses our
[Brain-Cog-TanyaOS fork](https://github.com/mcographics/Brain-Cog-TanyaOS).

Creating the fork was the first step. Making the application consume it required
a second change across backend imports, storage, desktop startup, and packaging.
Those paths now agree on the same pinned dependency.

## A fork that the application actually uses

The fork preserves the original BrainCog project and adds a reusable
`tanyaos_braincog` package. That package contains the diagnostic monitor,
multiscale simulation, and cognitive event adapter developed for TanyaOS.

TanyaOS includes the fork as a Git submodule under `vendor/braincog`, initially
pinned to revision `29768a0ebd8b8ff8f87e40be2ca4f7e1a0bf8f34`. A source checkout
therefore records the exact dependency used for this migration. A new commit
in the fork does not silently change the application. Updating the dependency
requires selecting a revision, testing it, and committing the new pin.

The application previously kept its own implementation of those same monitor
and adapter components. Those files are now thin compatibility adapters around
the shared fork code. Simulation changes have one maintained home, while
existing application imports continue to work.

## What each part owns

TanyaOS's cognitive kernel continues to own identity, durable memory, values,
goals, decisions, outcomes, learning records, and tool authority. Local language
and speech components supply their own functions. BrainCog provides an
experimental spiking-network simulation and observable telemetry around the
application's work.

The monitor contains **10,000 simulated LIF units** arranged into eight software
task groups, each with four computational partitions. Activity comes from the
simulation's tensors. Group names provide software routing hints; they do not
establish anatomical registration or a measurement of a living brain.

The broader pursuit of digital sentience remains TanyaOS's research ambition.
This integration establishes a reproducible dependency and specific runtime
behavior. It does not establish subjective experience or turn the simulation
into the executive decision maker.

## Keeping inference and speech synchronized

The shared monitor retains separate lifecycle hooks for model inference and
speech playback. Inference tokens support overlapping calls. A completed model
generation does not imply that spoken playback has finished.

During speech, the simulation uses a frontal-only output phase. When speech
finishes, it returns to distributed thinking if an inference call is still
active. When both phases end, activity returns to zero. Kernel events retain
software provenance so an observed event can be traced to its routing group
without presenting it as an anatomical firing measurement.

The standalone example exercises those hooks diagnostically. It does not run
Qwen or play audio itself. TanyaOS's local model and speech implementations are
responsible for calling the hooks at their real execution boundaries.

## Existing local memories keep their storage boundary

The standalone package uses an explicitly supplied runtime directory. TanyaOS
has an established storage policy: source runs use the backend data directory,
and packaged runs use writable storage outside the installed application.

The fork now accepts a host storage provider. TanyaOS passes its protected-core
storage function to the shared monitor, preserving that policy. The migration
does not move existing account or memory records into a separate standalone
storage folder. Regression checks verify both the source storage path and the
packaged storage override, including a read-only memory summary.

The protected `SYSTEM_CORE` was not modified by this migration.

## Desktop startup and packaging use the same source

Backend discovery, Electron development launch, desktop preflight, the desktop
builder, and offline-runtime preparation now use the maintained fork. Desktop
resources carry it under `brain-cog`; the packaged backend receives that path
explicitly.

The build checks that the shared integration and required license files are
present. An explicit override that points at an upstream-only checkout fails
with setup instructions, rather than quietly loading an older implementation.
Dependency changes are routed through the runtime's dependency workflow and
require deliberate validation and restart.

New checkouts initialize the pinned dependency with
`git submodule update --init --recursive`. No cloud API or hosted inference
service is added to the application runtime by this work.

## Preserving licenses and giving credit

The fork is based on [BrainCog-X/Brain-Cog](https://github.com/BrainCog-X/Brain-Cog).
The upstream Git history, authorship, source notices, README, and research
citation remain intact. BrainCog's original Apache 2.0 license is preserved,
alongside the separate GPLv3 license in its MAToM-SNN example. The new integration
is licensed under Apache 2.0 with credit to Kenneth Salmon.

The [credits and license inventory](https://github.com/mcographics/Brain-Cog-TanyaOS/blob/tanyaos-integration/CREDITS.md)
records those scopes and acknowledges development assistance from OpenAI Codex.
The package also records the original TanyaOS source revision and file hashes.
Existing upstream license terms are not replaced by the integration's license.

The desktop packaging paths retain those files with the fork resources. No new
model weights, voice packs, anatomical atlas assets, user databases, or
credentials were added to the fork integration.

## What the checks prove

The migration passed the application's **16 BrainCog HTTP/runtime regression
tests** with the real engine loaded from the pinned fork on an RTX 3060. Those
checks cover zero idle activity, measured simulation advancement, pause,
shared stream identity, event persistence, cognitive routing, frontal speech,
and the handoff back to active inference.

Three additional application tests verify that shared classes come from the
pinned fork and that source and packaged storage boundaries are preserved.
The related cognition, offline, speech, maintenance, and update checks passed,
including a new regression for dependency-change classification. The fork's
four focused integration tests also passed.

Frontend lint, the production build, all 16 Electron runtime tests, action
parity, and the brain-monitor contract passed. Desktop preflight found the
pinned integration, local Python environment, native worker, built frontend,
and verified protected core. The builder's dependency and license checks also
passed.

These results establish source integration and a running local engine through
the HTTP regression harness. **No new signed installer or production OTA
installation is claimed.** Complete visible desktop, graphics, and audio QA
remains on the roadmap, along with the previously documented interactive-control
metadata gaps and graphics-budget work.

## The next development path

Reusable simulation and telemetry changes can now be developed in the fork,
validated there, and then adopted through TanyaOS's dependency pin. Application
behavior, accounts, memory, executive policy, local faculties, and the interface
remain in TanyaOS.

That gives the project a clearer development path: one maintained BrainCog
integration, explicit application boundaries, preserved attribution, and a
tested revision that can be reproduced from source.
