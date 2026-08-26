---
title: "Dossier Builder: Professional Documents Without Giving Up Control"
description: "Inside the design of a secure local-first desktop workspace for building structured dossiers from reusable document templates."
date: "2026-08-26"
category: "Development Journal"
tags:
  - Dossier Builder
  - Local-First
  - Document Tools
coverImage: "/projects/dossier-builder.png"
coverAlt: "Dossier Builder desktop application interface"
featured: false
published: true
---

A professional dossier is more than a long document. It has sections, repeated structures, source material, revisions, presentation rules, and information that may be sensitive. **Dossier Builder** is being developed to handle that work as a purpose-built desktop process instead of forcing it into a loose collection of files and generic editors.

The project is publicly visible, but it remains in active development. That distinction matters. Open source allows the work to be examined; it does not automatically turn an unfinished application into a released product.

## Structure without rigidity

Dossier Builder starts from reusable document templates. A template provides an intentional structure, while the workspace allows the content inside that structure to remain editable. This makes it possible to begin with a blank dossier or derive a working template from an existing DOCX document rather than rebuilding familiar formats by hand.

The application is intended to support the complete working path:

- create a dossier from a reusable template;
- organize its sections and content;
- edit material inside a focused desktop workspace;
- save the project in its own `.dossier` format;
- export the finished result for use outside the application.

That project format exists to preserve more than rendered pages. It can carry the structure and application state needed to continue editing later.

## A secure desktop foundation

Dossier Builder uses Electron, React, TypeScript, and a C++ native component, with a carefully limited bridge between the visible interface and the operating system. File access and native operations are exposed through specific application functions rather than giving the renderer general computer access.

The project also includes recovery-minded persistence. Professional work should not depend on a single fragile save operation, particularly when a dossier may represent hours of organization and writing.

Because the application is local-first, the user's documents do not need to be uploaded to a remote service merely to be edited. No account is required to begin working, and control of the underlying files remains on the computer.

## Documentation is part of the product

Recent work expanded the project's README, security documentation, architecture explanation, development instructions, file-format guidance, and production security review. That writing is not separate from engineering. A tool that manages important documents should explain how it stores them, where its trust boundaries are, and what remains unfinished.

The development build is launched through Electron Forge with `npm start`, while packaged and installed builds follow their own Windows paths. Keeping those routes clear avoids the common confusion between running source code and using an installed application.

Dossier Builder is not being presented as finished before its time. What exists today is a substantial, documented foundation for a private professional writing tool—and a commitment to make the final workflow as deliberate as the documents it is meant to produce.
