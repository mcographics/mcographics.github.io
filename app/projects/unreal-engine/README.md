# JasperPrism Unreal Engine section

Route: /projects/unreal-engine/

A product-specific midnight, mineral and spectral identity, scoped by .prism-page. The existing site navigation already reaches this route. Page navigation intentionally uses its own design, reusing only the accessibility and sharing components. The global theme preference does not recolour this product identity.

Content basis: the supplied shared conversation (https://chatgpt.com/share/6acbc5a0-bd40-83ea-9f26-3096f2b6b58f) establishes substance, illumination and the Render / Transform / Realize Light philosophy. Photo V0.1 capabilities and validation boundaries were read from the local JasperPrism README on October 11, 2026. No download, measured performance, completed shader validation, or plugin screenshots are claimed.

Assets: supplied Banner.png and logo.png copied unchanged. Responsive WebP derivatives preserve composition, with the complete square identity selected for narrow screens. Lower artwork is lazy-loaded. The browser light study applies CSS contrast and saturation only; it is explicitly labelled as illustrative rather than Unreal output.

Motion: one entrance and a finite two-cycle halo, with both OS reduced-motion and site accessibility preferences respected. No canvas, WebGL, pointer tracking, autoplay video or animation library.

Validation: npm run build:pages; node --test tests/rendered-html.test.mjs; targeted ESLint. Inspect desktop and narrow mobile layouts, range controls, original/reset, FAQ disclosures, sharing, accessibility, and return navigation in browser.

## Browser-rendered hero

PrismCinema renders a faceted 3D crystal using a small WebGL shader. The supplied artwork is the environment and static fallback, not a video. Eight analytic plane intersections shade mineral and glass faces; spectrum beams, specular light, camera drift and particles animate independently. This is a brand visualization, not Unreal plugin footage. No new runtime dependencies.

Rendering caps at 30fps, 1440 pixels wide, DPR 1 on mobile / 1.25 desktop; no GPU draws while offscreen, backgrounded or paused. OS and site reduced-motion settings render a still frame. ResizeObserver updates artwork and resolution. WebGL initialization failures and context loss retain the original picture. All animation, observers, GPU resources and image handlers are cleaned up on unmount.
