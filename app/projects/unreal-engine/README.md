# JasperPrism Unreal Engine section

Route: /projects/unreal-engine/

A product-specific midnight, mineral and spectral identity, scoped by .prism-page. The existing site navigation already reaches this route. Page navigation intentionally uses its own design, reusing only the accessibility and sharing components. The global theme preference does not recolour this product identity.

Content basis: the supplied shared conversation (https://chatgpt.com/share/6acbc5a0-bd40-83ea-9f26-3096f2b6b58f) establishes substance, illumination and the Render / Transform / Realize Light philosophy. Photo V0.1 capabilities and validation boundaries were read from the local JasperPrism README on October 11, 2026. No download, measured performance, completed shader validation, or plugin screenshots are claimed.

Assets: supplied Banner.png and logo.png copied unchanged. The hero retains the full original panoramic banner on narrow screens. Responsive WebP derivatives serve the smaller transparent philosophy artwork. Lower artwork is lazy-loaded. The browser light study applies CSS contrast and saturation only; it is explicitly labelled as illustrative rather than Unreal output.

Motion: fixed artwork with GPU-composited illumination only. OS reduced-motion and site accessibility preferences restore the original picture. No object/camera movement, pointer tilt, autoplay video or animation library.

Validation: npm run build:pages; node --test tests/rendered-html.test.mjs; targeted ESLint. Inspect desktop and narrow mobile layouts, range controls, original/reset, FAQ disclosures, sharing, accessibility, and return navigation in browser.

## Stationary artwork and illumination

PrismCinema uses the original banner.png on every screen size with the full 3:1 composition visible. PrismIdentity uses the transparent cutout requested for the philosophy section; original logo.png remains intact. Both use PrismIllumination: a small transparent WebGL overlay sampling the actual underlying picture without any coordinate displacement, mesh, object transforms, camera movement or image deformation. Fixed light-path masks select the incoming beam, contact point, illuminated facets and refracted rays; travelling intensity waves follow those paths. An eight-second periodic phase produces seamless light changes. The original image is always underneath. Pausing or reduced motion hides the overlay immediately, restoring the source picture, rather than retaining a frozen light effect.

Rendering caps at 30fps and 1280px wide for the banner / 640px for the smaller overlay, with limited DPR. There is no animation-frame callback or drawing when paused, offscreen, backgrounded or reduced-motion is enabled. Hover / keyboard focus activates the identity light; tap toggles it. Native image fallback covers WebGL initialization failure/context loss. Observers, listeners, animation frames and GPU resources are cleaned up on unmount.

## Biblical inspiration

A short verified AMP excerpt from Revelation 21:11 is linked to Bible Gateway in the philosophy paragraph. It connects the name to jasper and crystalline radiance without adding a religious product claim.

## Transparent cutout provenance

The built-in image_gen tool edited the supplied logo to remove background, floor and lettering while retaining the crystal and light rays. The output contains actual alpha transparency; 640/960 WebP derivatives are lazy-loaded.

Final image edit prompt:

> Use case: background-extraction. Edit target: the supplied JasperPrism logo image. Create a faithful transparent cutout of this EXACT crystal AND its light rays. Remove ALL dark background, floor, floor reflections, and ALL text/lettering/tagline below the crystal. Preserve the crystal silhouette, asymmetric faceted geometry, original jasper mineral texture on the left, clear glass facets on the right, colors and internal reflections as closely as possible. Preserve the incoming thin white beam from the left edge and the outgoing complete rainbow fan to the right edge, including soft luminous translucent edges on actual alpha transparency. The crystal and beams alone float on transparent background. No new background, no checkerboard baked into pixels, no added text, no extra objects. Keep similar square framing and orientation, center the remaining crystal+beams vertically to avoid empty text area.
