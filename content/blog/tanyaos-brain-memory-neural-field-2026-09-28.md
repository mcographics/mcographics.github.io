---
title: "Inside TanyaOS: Brain Atlases, Memory Mode, and a Measured Startup"
description: "A detailed September 2026 research update on TanyaOS: source-tracked brain atlas layers, a structurally checked single-neuron prototype, governed BrainCog telemetry, and one integrated startup sequence."
date: "2026-09-28"
category: "Research Project"
tags:
  - TanyaOS
  - BrainCog
  - Neuroscience Visualization
  - Local-First
  - Electron
  - Research
coverImage: "/projects/tanyaos-identity-2026.png"
coverAlt: "Tanya OS digital identity concept artwork in luminous blue neural filaments"
bannerImage: "/projects/tanyaos-identity-2026.png"
bannerAlt: "TanyaOS research identity artwork for a local cognitive desktop prototype"
featured: false
published: true
---

TanyaOS has moved through a dense research sprint. The project now has a more
carefully documented brain atlas pipeline, a more inspectable BrainCog
monitoring contract, a close-up single-neuron and synapse prototype, and a
startup flow that folds renderer and shader preparation into the system
initialization screen.

This update follows the [September 24 governed interaction milestone](/blog/tanyaos-universal-interaction-milestone-2026-09-24/).
That work connected the local cognitive runtime to a shared, reviewable action
system. The current sprint has turned toward a different question: how can the
brain and memory displays become more useful to inspect while staying honest
about which parts are source-derived, which parts are simulated, and which
parts are still only a visual prototype?

## A clearer boundary between cognition and its displays

TanyaOS is a local-first Windows desktop research prototype. Its Python
cognitive runtime owns the durable identity, memory, values, decisions, and
tool permissions. Electron hosts the React interface and the local runtime.
BrainCog is one replaceable simulation and monitoring faculty within that
system; it is not the cognitive core, and its visual output is not a reading
from a person's brain.

That distinction matters more as the graphics become more detailed. A labeled
brain mesh can provide anatomical context, but it does not show Tanya's
thoughts. A software spike can describe activity in a simulated unit, but it
is not a neuron firing in living tissue. A memory-themed scene can help a
person explore the interface, but it is not a map of where Tanya's stored
memories reside in the brain.

The latest monitor contract is versioned as `braincog-inference-only-v2`.
Monitor data is accepted only when it satisfies that contract, and stale or
legacy activity snapshots are rejected rather than being presented as current
work. The backend defines a 10,000-unit leaky integrate-and-fire simulation
arranged into eight software task groups. These are artificial model units,
not biological neuron counts. Event routing preserves the name and identifier
of the abstract Tanya subsystem that supplied a model event, while leaving
brain anatomy unbound by default.

The interface action registry also remains inspectable. The current frontend
checks find 122 backend and renderer actions in parity, 105 interactive
elements across 15 mounted surfaces, and full coverage of the elements that
are meant to be governed. These checks verify the software contract; they do
not establish that the system is conscious or that every possible runtime
interaction has been tested.

## Brain atlas work with provenance attached

The brain viewer work has expanded from one bundled model into a set of
source-aware atlas and reference-data paths. The repository now records
source versions, license information, checksums, coordinate-space metadata,
conversion scripts, and validation routines alongside the generated assets.
Current source-derived layers include:

- Human Reference Atlas v1.3 surfaces, with 283 named mesh surfaces and
  hemisphere labels where supplied;
- Allen HRA 3D ICBM 2009b surfaces, represented by 141 labeled structures;
- AAL3 v2 regional surfaces, Julich-Brain v3.1 areas, and the Schaefer 2018
  100-parcel, seven-network atlas;
- HCP1065 white-matter tract masks and streamline displays; and
- BigBrain cortical-layer boundary surfaces, plus a separately identified
  MNI152 reference-volume asset.

The point of this work is not to blend every dataset into one convenient
looking brain. Each source has its own grid, labels, license, and coordinate
frame. The viewer and validation scripts record those identities and avoid
claiming a registration when none is established. Source-name crosswalks and
ontology labels are tracked as crosswalks, not silently treated as exact
biological equivalences. BrainCog-to-atlas bindings remain empty by default.

This makes the data more traceable, but it does not turn the display into a
clinical tool. Some source labels remain unmapped, some atlas layers are not
represented, and different atlases do not become spatially interchangeable
because they can be selected by the same interface. The detailed inventory,
licenses, unmapped structures, and coordinate limitations are kept in the
repository's [atlas registry](https://github.com/mcographics/TanyaOS/blob/main/DOCUMENTS/ATLAS_REGISTRY.md)
and [anatomical data sources](https://github.com/mcographics/TanyaOS/blob/main/DOCUMENTS/ANATOMICAL_DATA_SOURCES.md)
notes.

## A single-neuron prototype with measurable structure

The current close-up morphology prototype now has a dedicated structural
verifier. It checks the generated geometry for a soma, branching neurites,
spines, an axon, boutons, and explicit synaptic junctions rather than relying
on a handful of decorative node objects. The latest verification reported:

- 7 primary dendrites and 469 generated dendritic branches over five branch
  generations;
- 1,790 dendritic spines across mushroom, thin, stubby, and filopodia-like
  forms;
- 23 axon branches terminating in 23 boutons; and
- 5 explicit junctions with separate pre- and postsynaptic structures and
  small, nonzero cleft gaps.

The geometry is generated from a deterministic prototype configuration and
checked against the selected reference region. The activity material is mapped
to axonal geometry, with the intended route running through the neurite
surface to a bouton and synaptic contact. It is not represented primarily as
glowing particles floating through empty space.

Those figures are useful structural evidence, but they are not a certificate
of anatomical fidelity. The most important review step is still a very close
visual inspection of the hero neuron: the soma must read as an organic cell
body, branch junctions must blend, taper must remain continuous, and spine and
synapse forms must hold up at microscope scale. The current code does **not**
pass that visual quality gate yet. We are keeping that gap visible instead of
using branch counts to imply that the biomedical rendering is finished.

Memory Mode now has a region-seeded, zoom-adaptive Three.js field with curved
neurites, instanced details, fog, restrained depth of field, and activity that
is gated by compatible BrainCog telemetry. It is an interaction and rendering
prototype. Its generated structures are neither Tanya's actual memory
topology nor a measured connectome, and the layered field is not a substitute
for passing the single-neuron close-up review.

## Making the System Monitor easier to investigate

The brain view has also gained clearer focus levels for whole-brain, region,
cluster, neuron, and synapse inspection. Closer views refine local branch and
junction detail; broader views reduce that detail to keep the larger anatomy
readable. Synapse views separate the presynaptic bouton from the postsynaptic
spine and preserve a visible gap. Internal display routes and synthetic cell
placements remain illustrative; they are not presented as a source-registered
connectome.

The maintenance flow received a related reliability fix. A Vite dependency
optimization reload could previously send a first Maintenance visit back to
the login screen. The renderer now prebundles the relevant graphics packages
and restores a still-valid local session and the chosen panel after that
reload. A focused headless browser check exercised the first-click path,
including a reload while keeping the Admin tab selected; a separate invalid
session check still returned to login and cleared the stale token.

## One initialization screen, with actual graphics preparation

Shader and graphics preparation used to be shown as a second loader after the
system initialization view. The current Electron flow keeps one initialization
panel visible, automatically scrolls that panel to the graphics stages, then
fades into the already-warmed desktop. Brain View and Memory Mode are prepared
in a hidden renderer while the original initialization screen remains on
screen, so the graphics work has a measurable place in startup instead of
appearing as a second UI layer.

One local desktop run measured Memory Mode at 57 ms for shader compilation,
133 ms to its first frame, and 495 ms total. The Brain View run measured 490
ms for shader compilation and 80 ms to its first frame, with 11.862 seconds
total including atlas asset loading. These are measurements from that machine
and run, not fixed startup guarantees. The brain path still has a meaningful
asset-loading cost. That run also emitted Three.js and WebGL development
warnings, which remain part of the graphics follow-up rather than being
hidden by the successful ready state.

The single-panel flow does not mean all loading work is complete before the
screen appears. It means the user sees one continuous initialization report,
including the shader stages, followed by a fade when the app reports ready.

## What passed in this update

The current source passed frontend ESLint, the production Vite build, the full
atlas, coordinate, coverage, action, surface, morphology, and monitor-contract
verifier chain, and the focused single-neuron structure check. The build still
reports large JavaScript chunks above Vite's 500 kB advisory threshold. These
are local source and build checks; this update does not claim a published
installer, cross-GPU rendering approval, or manual sign-off of the close-up
neuron art.

The latest source and a longer implementation record are available in the
[TanyaOS repository](https://github.com/mcographics/TanyaOS) (access may be
restricted) and its [September 28 progress update](https://github.com/mcographics/TanyaOS/blob/main/DOCUMENTS/UPDATES_2026-09-28_BRAIN_MEMORY_PROGRESS.md).
For the project overview, visit the [TanyaOS research page](/projects/tanyaos/).

## The next quality gate

The next neural-art milestone remains deliberately specific: refine one hero
neuron until the soma, continuous tapered arbor, fine terminals, spines, axon,
boutons, synaptic clefts, and activity materials read convincingly in an
extreme close-up. Then verify it in a live rendered view on the target desktop.
Only after that review should the project treat denser neuron populations,
additional layers, and their level-of-detail transitions as visually
validated work.

In parallel, atlas layers need continued provenance checks, BrainCog monitor
changes need contract coverage, and any faster startup result needs to remain
measured rather than promised. The research direction is ambitious; the
evidence should stay just as legible as the interface.
