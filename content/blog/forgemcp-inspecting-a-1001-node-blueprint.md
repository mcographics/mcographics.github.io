---
title: "ForgeMCP: Inspecting a 1,001-Node Blueprint"
description: "A native large-graph inspection milestone, a successful journal build, and the startup failure that stopped the next acceptance tests."
date: "2026-10-26"
category: "Development Journal"
tags:
  - ForgeMCP
  - Unreal Engine
  - Blueprints
  - MCP
  - Developer Tools
coverImage: "/projects/forgemcp/banner-dark.png"
coverAlt: "ForgeMCP banner showing its connected Unreal Engine, Blender, code, and workflow panels"
bannerImage: "/projects/forgemcp/banner.png"
bannerAlt: "ForgeMCP banner showing its Unreal Engine and Blender integration"
featured: false
published: true
---

A Blueprint graph can hold a great deal of a game's behavior. Before a tool changes that graph, it needs a reliable way to see the relevant nodes, identify their pins, follow their connections, and recognize when the graph has changed since it was inspected.

ForgeMCP reached a concrete milestone in that work: **a native Unreal Engine 5.6.1 inspection test passed against a transient Blueprint graph containing 1,001 nodes**. The full Editor target built successfully, the updated native adapter loaded, and the test finished with zero errors and zero warnings.

That is one completed inspection gate within a larger Blueprint infrastructure effort. The next editing layer also passed its full native build, but an approved reopen failed during Editor startup before its acceptance tests could run. Both results belong in the development record.

## Seeing beyond the first page

The audit that started this phase found a 128-node limit in the legacy inspection view. It also found separate limits in the older editing system's whole-asset snapshots. Those constraints matter when the Blueprint being inspected is much larger than the operation a user wants to perform.

The new inspection interfaces provide paged graph and pin information, explicit identifiers, filtering, and connection tracing. Pagination lets a client request bounded results and continue through a large graph. Node and pin identity give later operations a precise target. Stale-cursor checks help prevent a client from continuing an inspection against graph state that has changed underneath it.

The native automation test exercised complete page coverage and unique node GUIDs, filtered results, and forward, backward, and combined traversal. It also checked rejection of stale cursors, duplicate node GUIDs, and ambiguous graph names. The fixture contained 1,000 branch nodes and one custom event.

This fixture existed in memory for the test. It was not a saved Blueprint reloaded from disk, and it did not test Niagara activation or gameplay behavior. Those boundaries are part of the result.

## Activating the inspection build

The project folder had moved during this work. Reconnection included verifying the selected Unreal project and active level through the owning MCP client. A running service or an old session identifier would have been insufficient evidence of the intended Editor connection.

The inspection build then went through one explicitly approved Editor close, binary backup, full build, and reopen. Ten original binary files were preserved and checked with SHA-256 hashes. The full Editor target completed successfully, the reopened adapter exposed the inspection commands, and a native capabilities call succeeded.

The large-graph test recorded **one successful test, zero errors, and zero warnings**. A complete post-test dirty-package inventory found no dirty project Content. This establishes the inspection milestone for the tested environment and fixture; it leaves broader release acceptance separate.

## A smaller journal for a precise edit

After inspection passed, development moved to scoped edits on existing graphs. The new source provides four typed operations: moving a node, setting a supported primitive input default, connecting pins, and disconnecting pins.

The design records the before-values needed for the proposed operation sequence. It also creates a separate, hash-verified backup of the original local package files before mutation. Exact selectors and preconditions bind an operation to the reviewed graph state. Native compilation and semantic comparisons check the result and the state outside the intended edit.

Restoration has its own limits. The source attempts to reverse completed operations only when it can identify the current operation prefix and verify that unrelated semantics still match. Unexpected changes require an owner decision. The package backup is retained separately and is not automatically copied over project content.

These mechanisms are implemented in source. Python lint and the complete **568-test Python suite** pass, and all four affected C++ translation units passed compile-only checks against Unreal Engine 5.6.1. A subsequent full Editor build also succeeded. The two new patch tools are still absent from the owning client's live tool set, leaving that integration gate open.

The next native test is prepared in source. It specifies a disposable 1,006-node Blueprint, a second untouched graph, preserved variables and component defaults, a real compiler-error case, an injected failure, scoped rollback, and refusal to restore through an unexpected outside-scope change. **Those native assertions have not run yet.**

## Where the latest activation stopped

The additional controlled activation was approved. Ten current binary files were backed up with verified hashes, the Editor closed normally, and the full `ForgeMCPDevEditor` target completed **37 actions** successfully. The same project was then reopened once with only the inspection regression and scoped journal test queued.

Startup stopped at an assertion: TedsOutliner requested the `LevelEditor` module before that module was loaded. The Editor exited before establishing an authenticated session or producing an automation report. **Both queued tests were not run**, and no disposable journal fixture was created. There is currently no connected Editor from that attempt.

The complete disk audit matched all **2,798 Content files** against their original SHA-256 hashes, with zero additions, modifications, or deletions. Native changes stopped at the failed startup gate. No extra launch, binary restoration, engine patch, or asset recovery was attempted. The earlier passing inspection test remains evidence from its successful activation; it was not rerun after this failure.

The recorded startup stack identifies a module-loading failure. It does not establish a defect in the journal's graph-editing behavior or a corrupt Blueprint. Those claims would require different evidence.

## The next acceptance gates

Read-only diagnosis of the startup failure is the next dependency, followed by a scoped resolution and successful native acceptance. The prepared compiler-failure, rollback, and preservation tests remain unexecuted.

The wider work still includes structural authoring, own and inherited Niagara component defaults, generic native function authoring, and actual runtime behavior. Explicit save and independent disk-backed reload need separate implementation and acceptance. Baseline-saving a disposable test asset would not establish that a modified production Blueprint survives an independent reload.

ViperBP remains untouched while those infrastructure gates are open. Existing Landscape reload, visual, collision, and release gaps also remain separate from this Blueprint result.

The [ForgeMCP Encyclopedia progress record](/projects/forgemcp/encyclopedia/?record=b04246fd2a515ef2) contains the current acceptance matrix and links to the implementation reports and activation evidence. The [project page](/projects/forgemcp/) introduces the broader integration. Future updates will carry the same distinction between source checks, native tests, live client exposure, saved state, and runtime behavior.
