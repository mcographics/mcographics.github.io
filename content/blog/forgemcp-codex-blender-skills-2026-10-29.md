---
title: "Bringing Blender Production Skills Into ForgeMCP's Codex Workflow"
description: "ForgeMCP now includes 94 Blender production skills, adapted for Codex with clear boundaries around the tools and evidence the bridge supports."
date: "2026-10-29"
category: "Development Journal"
tags:
  - ForgeMCP
  - Blender
  - Codex
  - MCP
  - Open Source
coverImage: "/projects/forgemcp/banner-dark.png"
coverAlt: "ForgeMCP dark banner showing connected creative applications and workflow panels"
bannerImage: "/projects/forgemcp/banner.png"
bannerAlt: "ForgeMCP banner showing its Unreal Engine and Blender integration"
featured: false
published: true
---

Blender work often moves between several kinds of expertise: modeling, materials, lighting, animation, scene assembly, export, and visual direction. ForgeMCP now brings a broad set of that production guidance into the repository's Codex workflow, alongside instructions that explain how to use it through ForgeMCP's actual Blender bridge.

## A production library Codex can discover

The repository now includes the 94 skills from the Blender Skills project, with their shared reference material, under `.agents/skills`. They cover practical disciplines such as modeling, character work, rigging, lighting, rendering, optimization, export, and a wide range of visual styles. Codex can use these project-local skill instructions as context for relevant Blender tasks.

The source material comes from [Blender Skills by Arjun Shukla (`@arjun988`)](https://github.com/arjun988/blender-skills). The integrated snapshot is pinned to [upstream commit `8f778d2405a214b508d4c7d80742be8e43acdd52`](https://github.com/arjun988/blender-skills/commit/8f778d2405a214b508d4c7d80742be8e43acdd52). The original MIT license and author attribution are included in the [ForgeMCP repository](https://github.com/mcographics/ForgeMCP/blob/main/LICENSES/blender-skills-notice.md). The upstream production guidance remains credited to Arjun; the ForgeMCP bridge instructions and capability map are project-specific additions.

## The bridge keeps the guidance grounded

A production skill can describe a complete craft workflow, while an MCP integration only exposes selected operations. The new `forgemcp-blender` skill connects those two layers. It directs Codex to identify the active Blender session, inspect the scene, select supported typed operations, review previews before applying changes, and read back the result.

A companion capability map records what ForgeMCP currently exposes and where evidence has limits. It helps keep the instruction set useful without suggesting that every Blender action is available through MCP. The integration also routes work through ForgeMCP's own adapter, rather than adding a second Blender MCP implementation or unrestricted Python execution.

## Clear evidence for creative work

The bridge instructions keep several important outcomes distinct. An applied scene change does not by itself mean the `.blend` file was saved. A completed render job does not replace visual review. An exported mesh is not proof that Unreal imported it correctly. Those distinctions help Codex describe the evidence it has and the next check a creator may need.

This update is a skills and documentation integration. It adds no new Blender adapter operations, and it does not change the Unreal plugin or MCP server runtime. The available workflow remains defined by ForgeMCP's supported tools and their existing validation gates.

## Read the integration record

The [ForgeMCP encyclopedia report](/projects/forgemcp/encyclopedia/?record=26e515ea7e01b326) lists the integrated files, upstream attribution, structural checks, and the scope limits. You can also browse the [ForgeMCP source repository](https://github.com/mcographics/ForgeMCP) and the [original Blender Skills repository](https://github.com/arjun988/blender-skills).
