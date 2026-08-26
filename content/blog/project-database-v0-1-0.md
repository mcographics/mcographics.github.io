---
title: "Project Database v0.1.0: Give Every Project a Place"
description: "A first public release for a local-first Windows workspace that keeps project files, images, collections, and context together."
date: "2026-08-26"
category: "Release Notes"
tags:
  - Project Database
  - Local-First
  - Windows
coverImage: "/projects/project-database.png"
coverAlt: "Project Database desktop application interface"
featured: false
published: true
---

Creative projects rarely live in one file. They spread across folders, reference images, documents, notes, collections, timelines, and unfinished pieces whose importance may not become obvious until much later. **Project Database** began with a straightforward question: what if each project had one secure place for all of that surrounding context?

Version 0.1.0 is the first public Windows release of that idea.

## A visual library for active work

Project Database is designed as a desktop workspace rather than a generic cloud table. Its gallery-oriented interface makes projects feel like things that can be seen and explored, while the underlying structure is intended to hold the less visible material that gives each project meaning.

The application brings together:

- project records and collections;
- documents and images;
- related creative assets;
- timelines and supporting context;
- a visual way to move through a growing body of work.

The purpose is not simply storage. Ordinary folders can store files. The value comes from preserving relationships—knowing which material belongs to which effort and being able to return to it without reconstructing the whole story from scattered directories.

## Local ownership with a native seam

The application combines Electron, React, TypeScript, and a C++ native component. That architecture allows the interface to remain flexible while leaving room for desktop-specific capabilities behind a narrow, controlled boundary.

Security matters especially in a tool designed to handle personal project material. The renderer does not receive unrestricted access to the computer. Native and operating-system operations pass through explicit application interfaces, keeping the convenience of a desktop app without treating every piece of interface code as fully trusted.

The database is local-first by design. A project organizer should not become useless because an account expires, a service changes direction, or an internet connection disappears.

## Reaching the first release

Preparing v0.1.0 also required separating the web renderer's build output from the Windows packager's output. Those two processes originally competed for the same destination, which made a normal rebuild risk disturbing packaged files. Giving each stage its own directory made the build safer and more predictable.

The resulting installer was built, published, downloaded again from the public release, and compared against the original artifact. That verification closes an important gap: producing a local installer is not the same thing as proving that visitors can retrieve the intended file.

Project Database v0.1.0 establishes the foundation. The work ahead is to deepen the connections between projects, assets, collections, and time—until reopening an old project feels less like archaeology and more like continuing a conversation.
