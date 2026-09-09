# Tanya OS portfolio page

Public route: `https://mcographics.github.io/projects/tanyaos/`

The dedicated route replaces the generic TanyaOS project introduction. Its homepage card and project record share the new description and artwork. The existing static export and sitemap already include this route.

`CognitiveExplorer.tsx` provides five selectable architecture explanations. These are editorial descriptions, not live kernel telemetry. The page retains the shared portfolio navigation, theme, accessibility controls, and sharing controls.

The shared Projects navigation opens a dropdown on hover or keyboard focus, containing “Research Project: Tanya OS”. Escape dismisses it and restores focus to Projects when focus was inside. The mobile navigation presents the same destination directly below Projects.

## Content basis

Development status was reviewed on September 8, 2026 against TanyaOS's `DOCUMENTS/TO_DO_LIST.md`, `DOCUMENTS/LOCAL_COGNITIVE_ARCHITECTURE.md`, and `BACKEND/cognitive_kernel.py`. Repository visibility was checked directly on GitHub and is private.

The page presents “A Digital Sentient AI” as the research vision. The implemented foundation is a local cognitive kernel with identity and values records, events, recall, deliberation, outcomes, learning records, and exposed monitor state. Connected conversation, a local language faculty, offline speech, fuller persistence, and kernel-to-substrate integration remain future work. No public download or live AI service is represented by this page.

## Artwork

Asset: `public/projects/tanyaos-identity-2026.png` (1672 × 941 PNG).

Generated using the built-in image-generation tool. The output bytes are preserved. The hero crops the image through CSS; the homepage card and social preview use the full composition. The prior `tanya-os.png` asset remains in the repository but is no longer referenced by the Tanya OS page or card.

Exact generation prompt:

```text
Use case: ads-marketing
Asset type: one cohesive branded landscape hero and social-preview card for TANYA OS, an AI identity and cognition research project.
Primary request: Create premium cinematic science fiction artwork in a wide 16:9 landscape composition. The image must work both as a complete branded social-preview card and an atmospheric website hero background with HTML copy over the left side.
Scene/backdrop: elegant midnight black-blue (#060b11), deep dark breathing room across the left half, sparse star-like points and beautifully restrained fine luminous neural filaments.
Subject: on the RIGHT, a confident adult female digital face made of extremely fine glowing neural filaments and star-like points, three-quarter profile facing left toward the typography. Expressive humane calm, softly luminous eyes. Beautiful ethereal science fiction portrait with subtle, natural facial contours rather than robot hardware. Let the portrait occupy the right half and fade gracefully into the dark background.
Style/medium: premium editorial digital artwork, exquisitely fine filament detail, subtle fine grain, elegant and atmospheric.
Lighting/mood: luminous ice cyan with restrained violet rim light, calm intelligent presence.
Composition/framing: cinematic landscape 16:9; portrait entirely on the right; ample uncluttered negative space on the left. Place the title in the UPPER LEFT, with generous margins, and its small supporting line immediately beneath. Keep the title and supporting line wholly within the upper-left quadrant, leaving the middle and lower left very dark for website overlay copy.
Text (verbatim): "TANYA OS"
Small supporting line (verbatim): "Identity. Memory. Purpose."
Typography: restrained modern geometric sans serif, clear professionally spaced letters, ice-white/cyan title, smaller subtle supporting line. Exact spelling and punctuation. Only these two text lines may appear.
Constraints: one cohesive image, no boxes, no panels, no dashboard, no fake UI, no robot hardware, no provider names, no watermark, no additional logos or text, no live-chat claims or release claims.
```

## Verification

Use the portfolio's `npm run build:pages` flow, then `node --test tests/rendered-html.test.mjs`. The Tanya OS rendered test checks the dedicated route, shared navigation, branded metadata, artwork, capability descriptions, inquiry link, explorer controls, FAQs, and section anchor targets.

Browser interaction and responsive visual inspection require a connected browser. Rendered checks do not substitute for those checks.
