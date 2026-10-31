---
title: "ForgeMCP Builds and Animates a Hand Rig in Blender"
description: "A saved 22-bone hand rig, automatic weights and five isolated finger tests mark a functional ForgeMCP prototype—with a visible anatomy defect still to fix."
date: "2026-10-30"
category: "Development Journal"
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

A hand mesh that only sits in a scene is a useful asset. A hand that can be inspected, attached to a skeleton, weighted, posed and saved is a more demanding test of a 3D automation workflow. On October 30, ForgeMCP and Blender reached that next step with a functional hand-rigging prototype.

The result is meaningful because each stage depends on the previous one. Bone names must agree with vertex groups. The Armature modifier must target the intended skeleton. The animation curves must reference real pose bones. The saved file must still contain those relationships when it is reopened. In the final saved version, the connected Blender session read back the hand mesh, the armature, a sampled page of weights and the animation Action.

## What the saved prototype contains

The rigged hand copy has 9,584 vertices, 28,761 edges and 19,175 polygons. It preserves the source coordinates, UV layout and material assignment. Its custom hand skeleton contains 22 bones: a root, wrist and palm, followed by separate chains for the thumb and four fingers. Twenty-one bones deform the mesh.

Blender generated the weights automatically on the recoverable copy. Every mesh vertex has weight coverage, there are 21,379 assignments in total, and no vertex has more than four influences. The audit found per-vertex weight sums within floating-point tolerance. The Armature modifier points to the new hand rig.

A separate deformation check posed each finger chain on its own. The index, middle, ring and pinky regions moved while average motion in other digit regions stayed near zero. The thumb also moved independently, including a measured pose toward the palm. These tests show that the skeleton and weights can drive the intended regions. They do not prove that the motion looks anatomically right.

The Action named Hand_Demo_Animation spans frames 1 to 120 at 24 frames per second. It contains 57 pose-bone rotation curves and 855 keyframes. The saved file returned to its neutral pose at frame 120 in the independent audit, and the user confirmed seeing the animation play in Blender.

## A prototype with a clear defect

The most important review finding is visual: the fingers bend backward instead of curling toward the palm. That makes this a functional prototype, not a production-ready rig or animation.

The numerical tests and the visual review answer different questions. A displacement check can show that a finger moved independently, even when its local axis or rotation sign makes the movement anatomically wrong. Possible causes include bone roll, local-axis orientation, parent transforms, rest-pose assumptions or reversed rotation signs. Those are investigation paths, not confirmed root causes.

The [full milestone record](https://mcographics.github.io/projects/forgemcp/encyclopedia/?record=b051ffee4534ac10) documents the saved-file evidence, hierarchy, weight measurements, action, acceptance matrix and remaining gaps. The [open flexion issue](https://mcographics.github.io/projects/forgemcp/encyclopedia/?record=4c1051b10281f9ce) defines the correction criteria. The next proposed milestone focuses on anatomical axis validation and stable deformation.

## Where ForgeMCP fit

ForgeMCP supplied the local Blender connection and read-only inspection of scene, object, rig, skin and animation state. The typed skin-binding preview could not process the source’s attribute payload within its configured limit. The final weight step therefore used Blender’s native automatic-parent-with-weights operation on a saved work copy, followed by independent inspection and saved-file readback.

Auto-Rig Pro was available in the Blender setup, but the final v002 asset uses a custom 22-bone hand rig; it is not an Auto-Rig Pro-generated skeleton. The report keeps that distinction visible. This milestone demonstrates coordinated inspection, rigging, skinning and animation work around one existing hand. It does not establish guaranteed automatic rigging for arbitrary characters.

The rig also has not passed full-fist visual review, exhaustive mesh-intersection checks, export, or game-engine import and playback. Those gates remain open. A separate [webcam motion-capture proposal](https://mcographics.github.io/projects/forgemcp/encyclopedia/?record=05d3a790871eecc4) describes future local tracking and retargeting; no webcam system was implemented here.

The next step is to correct the flexion direction on a recoverable copy, validate every joint against a labeled hand coordinate frame, review the motion from multiple views, then save and reopen the corrected file. ForgeMCP has now crossed an important integration threshold: a static hand became a weighted, animated Blender asset. The engineering milestone is real, and so is the defect still to resolve.

Explore [ForgeMCP](https://mcographics.github.io/projects/forgemcp/) and its [engineering encyclopedia](https://mcographics.github.io/projects/forgemcp/encyclopedia/).
