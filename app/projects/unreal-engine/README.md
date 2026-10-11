# JasperPrism Unreal Engine section

Route: /projects/unreal-engine/

A product-specific midnight, mineral and spectral identity, scoped by .prism-page. The existing site navigation already reaches this route. Page navigation intentionally uses its own design, reusing only the accessibility and sharing components. The global theme preference does not recolour this product identity.

Content basis: the supplied shared conversation (https://chatgpt.com/share/6acbc5a0-bd40-83ea-9f26-3096f2b6b58f) establishes substance, illumination and the Render / Transform / Realize Light philosophy. Photo V0.1 capabilities and validation boundaries were read from the local JasperPrism README on October 11, 2026. No download, measured performance, completed shader validation, or plugin screenshots are claimed.

Assets: supplied Banner.png and logo.png copied unchanged. The hero retains the full original panoramic banner on narrow screens. Responsive WebP derivatives serve the smaller transparent philosophy artwork. Lower artwork is lazy-loaded. The browser light study applies CSS contrast and saturation only; it is explicitly labelled as illustrative rather than Unreal output.

Motion: the hero retains GPU-composited illumination. The philosophy image fades into the supplied video on mouse hover or keyboard focus; tap toggles playback. OS reduced-motion and site accessibility preferences disable automatic hover/focus playback and remove fades; explicit activation can still play the clip.

Validation: npm run build:pages; node --test tests/rendered-html.test.mjs; targeted ESLint. Inspect desktop and narrow mobile layouts, range controls, original/reset, FAQ disclosures, sharing, accessibility, and return navigation in browser.

## Stationary artwork and illumination

PrismCinema uses the original banner.png on every screen size with the full 3:1 composition visible. Its PrismIllumination overlay changes lighting without moving the artwork. Rendering caps at 30fps and 1280px wide, with limited DPR; drawing stops while paused, offscreen, backgrounded or reduced motion is enabled.

PrismIdentity retains the transparent cutout at rest and plays the user-supplied prism-edit.mp4 as a reveal. The published prism-reveal.mp4 preserves the original 1080x1080 H.264 frames at 25fps (6.44 seconds), removes the audio track, and moves MP4 metadata to the front for progressive playback. The source file is unchanged. preload=none avoids downloading the clip until interaction. After onPlaying, the picture covers the first two seconds of playback to conceal the supplied clip's opening artifacts, then crossfades into the video over 1.4 seconds. Stopping restores the picture with the shorter 0.45-second fade. Playback errors leave the image visible. The clip plays once and returns to the image when it ends (the supplied clip ends on black). Mouse leave, blur, another tap, scrolling out of view, or tab hiding also resets it. No additional WebGL overlay is applied to this video. The square footprint and object-fit:contain prevent layout shift and cropping.

## Biblical inspiration

A short verified AMP excerpt from Revelation 21:11 is linked to Bible Gateway in the philosophy paragraph. It connects the name to jasper and crystalline radiance without adding a religious product claim.

## Transparent cutout provenance

The built-in image_gen tool edited the supplied logo to remove background, floor and lettering while retaining the crystal and light rays. The output contains actual alpha transparency; 640/960 WebP derivatives are lazy-loaded.

Final image edit prompt:

> Use case: background-extraction. Edit target: the supplied JasperPrism logo image. Create a faithful transparent cutout of this EXACT crystal AND its light rays. Remove ALL dark background, floor, floor reflections, and ALL text/lettering/tagline below the crystal. Preserve the crystal silhouette, asymmetric faceted geometry, original jasper mineral texture on the left, clear glass facets on the right, colors and internal reflections as closely as possible. Preserve the incoming thin white beam from the left edge and the outgoing complete rainbow fan to the right edge, including soft luminous translucent edges on actual alpha transparency. The crystal and beams alone float on transparent background. No new background, no checkerboard baked into pixels, no added text, no extra objects. Keep similar square framing and orientation, center the remaining crystal+beams vertically to avoid empty text area.
