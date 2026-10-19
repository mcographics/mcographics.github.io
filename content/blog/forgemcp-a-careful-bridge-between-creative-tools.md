---
title: "ForgeMCP: A Careful Bridge Between Creative Tools"
description: "How ForgeMCP connects AI clients with Unreal Engine and Blender through local tools, reviewed actions, and clear limits."
date: "2026-10-19"
category: "Development Journal"
tags:
  - ForgeMCP
  - Unreal Engine
  - Blender
  - MCP
  - Developer Tools
  - Open Source
coverImage: "/projects/forgemcp/banner-dark.png"
coverAlt: "ForgeMCP dark banner showing connected Unreal Engine, Blender, code, and workflow panels"
bannerImage: "/projects/forgemcp/banner.png"
bannerAlt: "ForgeMCP banner showing its Unreal Engine and Blender integration"
featured: false
published: true
---

Creative applications hold years of decisions inside projects, scenes, assets, and editor state. Asking an AI client to help with that work is useful only when it can interact with those applications in a way the creator can inspect and control.

**ForgeMCP** is an open-source local integration for supported workflows in Unreal Engine and Blender. It uses the Model Context Protocol (MCP) to let an AI development client discover and call specific tools exposed by ForgeMCP. The server coordinates with native Unreal and Blender adapters; the editors remain separate applications, and the creator stays in control of the chosen project or scene.

## Connect the tools without hiding the work

A request does not become a completed change just because an AI describes one. The useful workflow has several visible steps: identify the target session, inspect the relevant project state, prepare an operation, review what it will change, apply it, and read back the result. Depending on the operation, that can include compilation or other validation.

ForgeMCP is being built around that distinction. Its local tools support inspection and selected operations for actors, assets, and Blueprint work in Unreal Engine, along with object, rig, animation, and material workflows in Blender. For supported static-mesh transfers, the integration can stage the asset, check geometry and material information, and bring it into Unreal through a reviewed transfer.

That does not mean every editor action is available through a prompt. ForgeMCP is a focused tool layer with different validation levels for different capabilities. A clear limit or diagnostic is more useful than a confident claim that an unsupported operation succeeded.

## Small, verified steps

The project has development milestones across MCP communication, guarded Blueprint workflows, Blender inspection, and cross-application asset transfer. A bounded Unreal Landscape proof of concept has also passed creation, sculpting, smoothing, save, and reload checks in an isolated test. That result is useful evidence for that specific workflow; it is not proof of a complete city-building system or general Landscape support in arbitrary projects.

The next work is just as important: broadening supported operations carefully, documenting compatibility, and validating complete workflows across real project setups. Complex systems such as World Partition, PCG, UMG, skeletal interchange, and whole-world generation still have meaningful gaps.

## Built for local creative work

ForgeMCP is free and MIT-licensed. Its server and adapters are designed to run locally and do not require a paid cloud API. Codex in Visual Studio Code is the primary development workflow; broader MCP client compatibility still needs validation.

That local structure matters because a game project or Blender scene is not a disposable prompt. It contains assets and state that deserve care. The aim is to make AI-assisted work practical while keeping the operation, target, and evidence visible.

ForgeMCP is in active development. You can explore the [project page](/projects/forgemcp/), review the [source on GitHub](https://github.com/mcographics/ForgeMCP), and read the [installation guide](https://github.com/mcographics/ForgeMCP/blob/main/Documentation/Installation.md).