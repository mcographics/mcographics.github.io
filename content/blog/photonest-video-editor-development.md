---
title: "PhotoNest Development: Building the Video Editor Inside the Library"
description: "PhotoNest is growing from a photo organizer into one local media workspace, with an integrated Video Editor, project-only media imports, a program monitor, timeline foundations, and a careful path toward editing without touching originals."
date: "2026-09-10"
category: "Development Journal"
tags:
  - PhotoNest
  - Video Editor
  - App Development
  - Local-first
  - Electron
  - React
  - Windows
coverImage: "/projects/banner.png"
coverAlt: "PhotoNest glass media library workspace with navigation, gallery, and selected media details"
bannerImage: "/projects/banner.png"
bannerAlt: "PhotoNest media organizer workspace used as the development journal banner"
featured: false
published: true
---

PhotoNest started with a simple promise: an existing personal library should be easier to understand without being forced into somebody else’s cloud, folder system, or subscription. That promise is still the centre of the project. The latest development work is extending it from photographs into video, but the direction is deliberately different from bolting a second application onto the side of the organizer.

The Video Editor is being built as a mode of PhotoNest itself. When a person chooses Video Editor, the main PhotoNest workspace should be taken over by an editing environment with a program monitor, project media, an inspector, editing tools, and a timeline. It should feel like one application changing context—not PhotoNest launching an unrelated editor and leaving the library behind.

## One PhotoNest workspace, different creative modes

The supplied visual direction is intentionally closer to a professional non-linear editor than to a file picker. The editor needs a real program monitor in the centre, a project-media panel on the left, controls and color or graphics inspection on the right, and a substantial timeline underneath. The timeline is not an accessory below an audio console. Video editing is the primary surface.

That distinction has shaped the current implementation. The editor shell now has its own workspace model while inheriting the host application’s visual rules: PhotoNest light and dark mode values carry into the editor, the integrated shell keeps the same rounded frame language, and fullscreen or borderless presentation can use the full available display rather than looking like a small window trapped inside the application.

The editor’s top bar is also being treated as application chrome rather than decorative text. File, Edit, Clip, Sequence, Markers, Graphics, View, Window, and Help are the beginning of the editing vocabulary. Their actions need to connect to real project state, dialogs, timeline operations, preview controls, and export paths as the surrounding features mature. A visible button that does nothing is not considered finished.

## The program monitor is the centre of the work

The most important visual correction was moving the editor away from an empty or audio-first appearance. The centre of the workspace must clearly communicate that it is a video program monitor, even before a project has media on its timeline. It needs a video-oriented empty state, transport controls beneath the image area, a time display, a seek position, fit and playback options, and a clear relationship to the active sequence.

When a clip is placed on the sequence, the monitor should become the place where the editor’s decisions are visible. The timeline playhead, monitor timecode, sequence duration, clip selection, and inspector state need to describe the same project moment. That synchronization is more important than filling the screen with controls: the user should be able to tell what is being previewed and what will be exported.

The current work also uses the supplied concept as a geometry reference. The media bin, monitor, inspector, and timeline are being balanced around the proportions of a full desktop editing workspace instead of allowing one panel—especially an audio panel—to dominate the screen. The timeline has video tracks above audio tracks, title and graphics space, editing tools, visible playhead positioning, and room for clip-level work.

## Imported video belongs to the project, not automatically to Photos

One of the most important boundaries is what happens when a video is opened for editing. Choosing an external video for a Video Editor project should not silently add that file to PhotoNest’s main photo library. A project may use media without changing the library’s indexing state.

The editor is therefore being built with project-only media records for externally selected video and audio. Those records can provide the project with a path, metadata, duration, dimensions, preview source, and timeline identity without pretending that the asset was imported into the main PhotoNest collection. This keeps the distinction clear:

- Library media is indexed and browsable through PhotoNest’s organizer.
- Project media is available to a particular editing project.
- The source file remains where the user placed it.
- Exporting creates a new result rather than modifying the source.

That separation matters for a local-first application. A creative project should be able to reference a source without taking ownership of the original or creating an unexpected duplicate in the organizer.

## The editing foundation is intentionally constrained

The first export path is being developed as a dependable foundation rather than as a promise that every professional editing feature already exists. The current engineering boundary is a constrained sequential video workflow: one supported primary video track, compatible audio, and a validated H.264/AAC-style export path. Unsupported timeline states should be rejected and explained instead of being silently omitted from the result.

This gives the project a firm base for later work. Media probing, frame previews, waveform generation, project persistence, proxy and derived-media paths, render caching, LUT handling, and export queue plumbing can grow around a clear project model. More advanced features—multiple independent video tracks, transitions, effects, complex compositing, and broader codec coverage—remain explicit work rather than hidden assumptions.

The same rule applies to buttons and menus. A command can be staged, disabled, or report that a capability is not yet available, but it must not imply that an unsupported operation succeeded. Honest boundaries are part of the editor’s design.

## A shared light and dark visual system

PhotoNest’s editor should never feel like a separate product with a separate theme. The light workspace carries the organizer’s glass and neutral surfaces into the editing layout, while the dark workspace provides the quiet, high-contrast environment expected for judging video. Both modes need the same panel hierarchy, active states, focus indicators, disabled states, selection colors, borders, and rounded corners.

Fullscreen and borderless use the same principle. They are presentation changes to the PhotoNest workspace, not a second window with unrelated chrome. The editor should be able to take over the display while keeping its project state, controls, and theme coherent with the rest of the application.

## Reliability work belongs beside the visual work

The project has also exposed a shutdown race during development. A background face-analysis job could finish after PhotoNest had begun closing and attempt to update a catalog that was already closed. That produced a `catalog-not-open` error during application shutdown.

The queue now recognizes the shutdown boundary: new face work is refused, queued requests are resolved as shutting down, active work is cancelled, and post-scan catalog updates are skipped once the application begins closing. The catalog’s safety check remains intact; background work is now responsible for respecting it.

This is representative of the work happening underneath the interface. A convincing monitor is useful only if the application can preserve project state, avoid corrupting source media, release its resources, and close without turning normal shutdown into an error report.

## What is complete, and what is next

The current development slice has established the integrated editor shell, the video-first workspace direction, the project-only media boundary, the monitor and timeline foundation, project persistence and media plumbing, theme inheritance, fullscreen and borderless behavior, and source-level checks around the renderer and shutdown path. The Video Editor is still an in-development Windows desktop feature, not a finished public release.

The next work is focused and practical:

- tighten program-monitor proportions and transport behavior against real project media;
- finish the timeline’s clip selection, trim, ripple, snapping, track, and playhead interactions;
- continue wiring every top-bar menu and visible control to its intended operation or honest unavailable state;
- expand the supported project model only when export behavior can be validated;
- exercise external video imports without leaking project media into the PhotoNest library;
- test light mode, dark mode, rounded surfaces, maximized, fullscreen, and borderless layouts at real Windows sizes;
- perform runtime playback, export, shutdown, and packaged-application checks before calling the feature release-ready.

PhotoNest is becoming a broader local media workspace, but the original standard has not changed. The application should help a person understand and create with their own media while keeping the files, the project boundaries, and the truth about what has actually been tested under their control.
