---
title: "TanyaOS: Building an Original Cognitive Engine"
description: "TanyaOS replaces its active BrainCog dependency with an original 10,000-unit sparse engine, persistent learning, selective recall, and inspectable outcome predictions."
date: "2026-10-01"
category: "Research Project"
tags:
  - TanyaOS
  - Cognition
  - Local-First
  - Research
  - Development
coverImage: "/projects/tanyaos-identity-2026.png"
coverAlt: "TanyaOS concept artwork with luminous blue neural filaments"
bannerImage: "/projects/tanyaos-identity-2026.png"
bannerAlt: "Concept artwork representing TanyaOS's local cognitive research direction"
featured: false
archiveOrder: 1
published: true
---

The [earlier fork integration](/blog/tanyaos-braincog-fork-integration-2026-10-01/)
gave TanyaOS a maintained BrainCog dependency. The next architectural decision
changes that direction: build and own the active cognitive implementation.

TanyaOS now runs original source in `BACKEND/brain/cognition`. Neither the
original BrainCog checkout nor the maintained fork is required to start, test,
or package the application. The fork remains a separate historical research
project with its original licenses and credits.

## Learning connected to real cognitive events

The new NumPy engine implements sparse leaky integrate-and-fire dynamics,
deterministic event encoding, eligibility traces, and bounded outcome-driven
weight updates. Its configuration assigns exactly 10,000 units to twelve
ensembles: sensory input, attention, workspace, episodic association, semantic
association, self, affect, goals, prediction, action, skills, and reflection.

Inputs, decisions, and observed outcomes advance the network. Measured activity
also follows local model inference and speech callbacks. This is software
computation with inspectable state, not a biological measurement or evidence
of subjective experience.

Outcomes update empirical success predictions and neural weights. Candidate
ranking considers those predictions, risk, resource cost, and learned neural
associations. The protected cognitive kernel still owns identity, consent,
policy, and executive authority. A learned preference or successful previous
action cannot grant a missing permission.

## Continuity belongs to the local system

Eight memory classes share the existing account-scoped cognitive database.
Source IDs, confidence, approval, suppression, and links remain available for
inspection. Selective recall uses a token index and bounded candidate set,
allowing an older relevant episode to be retrieved without injecting the
entire archive into a language-model prompt.

Neural checkpoints preserve learned weights and traces, validate configuration
and checksums, and retain a known-good previous state. The latest checkpoint
payloads also reside in SQLite, so the existing database backup can restore
neural learning alongside cognitive records.

Repeated explicit communication preferences can gradually adjust response
detail within small bounds. Recorded revisions are reversible and cannot
rewrite core identity. Approved procedures reuse registered skill actions;
execution checks every step's permission and schema before the first side
effect, then records the actual outcome.

## Evidence and limits

The combined backend regression run passed **90 tests** across original
cognition, canonical processing, offline operation, accounts, recovery,
agentic execution, native desktop skills, and monitor HTTP behavior. Focused
learning tests demonstrate weight changes that survive restart, improved
predictions after repeated outcomes, changed later candidate selection,
account-isolated recall, checkpoint recovery, and blocked execution without
permission.

Renderer lint, the production build, action-contract checks, and all **16
Electron runtime tests** also passed. A small CPU benchmark measured roughly
24–51 milliseconds per sixteen-tick sample depending on concurrent load on this machine. Network arrays
occupy 1,270,000 bytes; this excludes models, Python, storage, and graphics.

This is a working first implementation of the larger architecture. GPU
execution is not implemented. The world model currently records empirical
task/action hypotheses, personality learning covers response detail, and
consolidation is operator-requested bounded replay. General causal reasoning,
automatic idle scheduling, broader trait learning, long-duration evaluation,
visible Windows/audio QA, and signed update installation remain open.

The [source implementation record](https://github.com/mcographics/TanyaOS/blob/main/DOCUMENTS/Architecture/ORIGINAL_COGNITION_10K_IMPLEMENTATION.md)
documents those boundaries and the remaining gates. Retained third-party
atlases, speech components, and other assets continue to carry their licenses
and attribution. An original cognitive engine changes ownership of that
implementation; it does not erase the provenance of other components.

Explore the [TanyaOS project](/projects/tanyaos/) and its
[source repository](https://github.com/mcographics/TanyaOS).
