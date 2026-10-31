---
title: "ForgeMCP Corrects Finger Flexion in a Blender Hand Rig"
description: "A 22-bone hand rig now curls toward the palm in sampled tests after a minimal animation-sign correction; continuous timeline playback remains unverified."
date: "2026-10-30"
category: "Milestone"
tags:
  - ForgeMCP
  - Blender
  - Rigging
  - Character Animation
  - MCP
  - Open Source
coverImage: "/projects/forgemcp/banner-dark.png"
coverAlt: "ForgeMCP connects AI-assisted development workflows with Blender"
bannerImage: "/projects/forgemcp/banner.png"
bannerAlt: "ForgeMCP developer banner for Unreal Engine and Blender automation"
featured: false
published: true
---

A hand mesh that only sits in a scene is a useful asset. A hand that can be inspected, attached to a skeleton, weighted, posed and saved is a more demanding test of a 3D automation workflow. On October 30, ForgeMCP and Blender reached that next step with a functional hand-rigging prototype. A follow-up then corrected the backward finger bend on a versioned copy while preserving the working skeleton and skin weights.

## What the original prototype established

The v002 baseline contains a 22-bone custom hand skeleton: a root, wrist and palm, with separate chains for the thumb and four fingers. Twenty-one bones deform the rigged hand copy, which has 9,584 vertices and 19,175 polygons. Its source mesh remains alongside the rigged copy. The original coordinates, UV layout and material assignment were preserved.

Blender's native automatic weights cover all 9,584 vertices with 21,379 assignments; the audit found normalized weight sums and no more than four influences per vertex. The Armature modifier targets `Hand_Rig_Reconstructed`. The original `Hand_Demo_Animation` Action had 57 pose-bone rotation curves and 855 keyframes across frames 1–120 at 24 frames per second. The user had confirmed seeing the initial animation in Blender, though the backward finger bend made its motion anatomically wrong.

## Diagnosis and correction

The visual defect was clear: the four fingers bent away from the palm. Inspection of the Action and a controlled pose check identified the cause in its animation channels. Positive local-X flexion values made the index finger bend in the wrong direction for this skeleton. The same local-X sign was used for the other three finger chains.

The correction changed those animation values on a copy of the Action. Forty-eight nonzero local-X flexion keys across the four fingers were sign-reversed. The armature rest pose, bone hierarchy, mesh geometry, UVs, materials, weights and Armature modifier were not changed. The thumb was treated separately because its existing animation uses different channels. A stronger combined close pose was added at frame 108 in the corrected Action, with a corresponding thumb contribution.

The new artifact is `Hand_Rig_Animation_Final_20261030_v003_AnatomicalCorrection.blend`; its Action is `Hand_Demo_Animation.004`. The v002 baseline was restored to its original bytes and independently read back with its original Action. The [full correction report](https://mcographics.github.io/projects/forgemcp/encyclopedia/?record=c29624a02d0200c2) records the hashes, frame results and verification limits.

## Sampled deformation results

| Pose | Frame | Result |
|---|---:|---|
| Index curl | 12 | Curled toward the palm |
| Middle curl | 27 | Curled toward the palm |
| Ring curl | 42 | Curled toward the palm |
| Pinky curl | 57 | Curled toward the palm |
| Thumb articulation | 72 | Evaluated on its existing X/Z channels |
| Combined partial curl | 88, 100 | Multiple digits curled together |
| Strong close pose | 108 | Closed-hand pose inspected from several viewport views |
| Open hand | 78 | Finger pose returned to open |
| Neutral return | 120 | Zero pose rotations; evaluated geometry within about 1 × 10⁻⁷ world units of the source |

The saved v003 file was independently reopened in Blender 5.2.3. Readback confirmed 57 Action curves, the armature modifier, all 9,584 weighted vertices, 21,379 assignments and zero non-normalized vertices. The evaluated mesh changed at the curled poses and returned to neutral at frame 120. Captures of the closed pose were inspected from current, right and three-quarter views without an obvious collapse or finger crossing.

**The correction is not fully accepted yet.** Continuous timeline playback from frame 1 through 120 could not be verified because Blender's native UI-control pipe was unavailable. The open session still reported the v002 filepath while holding the corrected Action in memory, so v003 should be opened before any further save from that session. The complete front, back, side and palm view matrix, all intermediate fingertip paths, and self-intersection/contact checks remain pending.

The [flexion issue](https://mcographics.github.io/projects/forgemcp/encyclopedia/?record=4c1051b10281f9ce) now records a confirmed cause and partial resolution. The [anatomical correction milestone](https://mcographics.github.io/projects/forgemcp/encyclopedia/?record=cbb33b61de51e66a) remains partially complete until playback and broader visual acceptance pass. This remains a functional, hand-specific prototype—not a production character rig, a generalized automatic rigging system, or proof of game-engine readiness.

## Where ForgeMCP fit

ForgeMCP provided the live Blender connection and typed scene, object, rig, skin, animation and viewport inspections. The animation edits were reviewed and applied through the creative preview/apply path, then read back from Blender. A typed skin-binding preview could not process the mesh attribute payload within its configured limit; the weight step therefore used Blender's native automatic-parent-with-weights operation on a recoverable work copy. The final rig is custom and hand-only; it was not generated by Auto-Rig Pro.

The technical lesson is that bone and weight validity do not guarantee correct motion. The rig could move every finger independently and still curl in the wrong direction. The local rotation sign had to be checked against the actual bones, evaluated mesh and visible pose. This work establishes evidence for one saved hand and its tested frames, not a universal correction rule.

A separate [webcam motion-capture proposal](https://mcographics.github.io/projects/forgemcp/encyclopedia/?record=05d3a790871eecc4) still describes future local tracking and skeletal retargeting. No webcam capture, MediaPipe integration or live tracking loop was built in this milestone.

Explore [ForgeMCP](https://mcographics.github.io/projects/forgemcp/) and its [engineering encyclopedia](https://mcographics.github.io/projects/forgemcp/encyclopedia/).
