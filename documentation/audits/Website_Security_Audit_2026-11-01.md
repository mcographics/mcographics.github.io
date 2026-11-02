# Website Security Audit — 2026-11-01

Created: 2026-11-01
Last updated: 2026-11-01
Status: Complete for audit branch; draft pull request pending review
Version: 1.0

## Scope and method

- Repository: `mcographics/mcographics.github.io`
- Website: <https://mcographics.github.io/>
- Audit branch: `security/website-audit-2026-11-01`
- Base: latest fetched `main` at `aedd702a35149427871c916252f166445dfa901b`
- Runtime used for checks: Node.js `v24.19.0`, npm `11.6.4`
- The working tree was clean when the audit branch was created. Work was confined to this website repository. The separate ForgeAI and ForgeMCP repositories were not changed.

The audit ran `npm ci` and inspected the complete npm lockfile, package scripts, the Vinext/Cloudflare build and static-export flow, every workflow under `.github/workflows/`, public-data sync scripts, blog rendering, route and asset checks, and credential-like patterns in tracked source. `npm audit` advisory metadata was captured from the lockfile on `main` before dependency changes. No `npm audit fix --force` was used.

## Dependency audit results

| Audit | Info | Low | Moderate | High | Critical | Total |
|---|---:|---:|---:|---:|---:|---:|
| Initial `npm audit --json` on `main` | 0 | 1 | 21 | 18 | 0 | 40 |
| Initial `npm audit --omit=dev --json` | 0 | 0 | 0 | 1 | 0 | 1 |
| Final `npm audit --json` | 0 | 0 | 0 | 0 | 0 | 0 |
| Final `npm audit --omit=dev --json` | 0 | 0 | 0 | 0 | 0 | 0 |

The initial production-only finding was `js-yaml@3.15.1`, reached through the production dependency `gray-matter`. The other reported findings were in the build, test, lint, image, or Cloudflare tooling graph. Those packages still matter to CI and developer machines even where they are not shipped by the static Pages export.

The initial 40 npm records include parent-package rollups as well as the underlying vulnerable packages. The inventory below accounts for the direct and transitive records; advisory IDs are those emitted by the initial `npm audit --json` result.

### Initial vulnerable package inventory

| Package(s) and affected lock version(s) | Severity | Advisory detail / path |
|---|---|---|
| `@babel/core@7.29.0` | Low | `GHSA-4x5r-pxfx-6jf8`: arbitrary file read through a `sourceMappingURL` comment. |
| `@cloudflare/vite-plugin@1.37.1`, `miniflare@4.20260515.0`, `wrangler@4.92.0`, `ws@8.18.0` | High | Parent records rolled up vulnerable Miniflare, Wrangler, esbuild, and WebSocket dependencies. `ws` advisories: `GHSA-58qx-3vcg-4xpx`, `GHSA-96hv-2xvq-fx4p`. See also the esbuild, sharp, and undici rows. |
| `@esbuild-kit/core-utils@3.3.2`, `@esbuild-kit/esm-loader@2.6.5`, `drizzle-kit@0.31.10`, `esbuild@0.18.20`, `esbuild@0.27.3`, `esbuild@0.28.0` | Moderate | Drizzle Kit retained a deprecated loader pinned to old esbuild. `GHSA-67mh-4wv8-2f99` covers development-server request/response exposure; `GHSA-g7r4-m6w7-qqqr` covers arbitrary file read on Windows. |
| `@eslint-community/eslint-utils@4.9.1`, `@eslint/config-array@0.21.2`, `@eslint/eslintrc@3.3.5`, `eslint@9.39.4`, `eslint-plugin-jsx-a11y@6.10.2`, `eslint-plugin-react@7.37.5`, `@typescript-eslint/eslint-plugin@8.59.3`, `@typescript-eslint/parser@8.59.3`, `@typescript-eslint/type-utils@8.59.3`, `@typescript-eslint/typescript-estree@8.59.3`, `@typescript-eslint/utils@8.59.3`, `typescript-eslint@8.59.3`, `minimatch@10.2.5`, `minimatch@3.1.5` | Moderate | The parent ESLint and TypeScript-ESLint records rolled up `GHSA-g3hv-75wg-m249`: minimatch globparts amplification can cause denial of service. |
| `@vercel/og@0.8.6`, `satori@0.16.0` | Moderate | `GHSA-wx4j-mvgx-mqwp`: improper escaping in Satori-generated SVG. |
| `vinext@1.0.0-beta.2`, `image-size@2.0.2` | High | Vinext rolled up `@vercel/og` and image-size. `image-size` advisories `GHSA-5p2g-fcmc-qvqq` and `GHSA-w3rx-r6r6-pgpr` describe parser denial-of-service cases for JXL/HEIF and ICNS. |
| `baseline-browser-mapping@2.10.30` | Moderate | `GHSA-w5vr-8v7q-w6rv`: process termination on invalid input. |
| `brace-expansion@5.0.6`, `brace-expansion@1.1.14` | High | Six DoS advisories: `GHSA-3jxr-9vmj-r5cp`, `GHSA-mh99-v99m-4gvg`, `GHSA-rgw5-rvv9-x895`, `GHSA-q2hr-2g5m-vwhr`, `GHSA-qhr7-859c-m2p7`, `GHSA-6j4f-fj2g-mc7p`. |
| `browserslist@4.28.2` | High | `GHSA-c83g-rgw3-j3cx` (unbounded memory growth) and `GHSA-73wf-gq98-2v4g` (crash/prototype write from custom browser stats). |
| `fast-uri@3.1.2` | High | Eleven SSRF, authority/host-confusion, and URI-normalization advisories: `GHSA-v2hh-gcrm-f6hx`, `GHSA-7p8r-x3mc-p8w7`, `GHSA-f65p-4m7j-42xc`, `GHSA-fph4-wmhf-6fwf`, `GHSA-jqff-g426-hqxp`, `GHSA-4c8g-83qw-93j6`, `GHSA-qw65-cvwx-89v3`, `GHSA-hrr3-gc8f-f4qj`, `GHSA-w74x-v6f9-j3xg`, `GHSA-xhq7-xmqj-769h`, `GHSA-333x-w4r6-6crp`. |
| `fflate@0.7.4` | Moderate | `GHSA-px8p-9vwx-vf98`: malformed ZIP64 input can make `unzipSync` loop indefinitely. |
| `js-yaml@3.15.1`, `js-yaml@4.1.1` | High | Merge-key and alias CPU denial of service: `GHSA-h67p-54hq-rp68`, `GHSA-52cp-r559-cp3m`, `GHSA-5p4m-2wfm-xmqj`, `GHSA-2883-xcg3-v3hh`. The 3.x instance caused the initial production-only finding. |
| `nanoid@3.3.12` | High | `GHSA-28wg-ghj8-5hjv`, `GHSA-2v37-7h3g-55p8`: generator loops for invalid sizes. |
| `postcss@8.5.14` | High | `GHSA-fxqj-rqcc-2cmp`, `GHSA-r28c-9q8g-f849`: source-map path traversal and disclosure of local `.map` files. |
| `react-server-dom-webpack@19.2.6` | High | `GHSA-wx67-qw84-cm4g`: denial of service in React Server Functions. It was a development/build dependency in this static-export project, not a deployed RSC server. |
| `sharp@0.34.5` | High | Three native image-library advisories: `GHSA-f88m-g3jw-g9cj`, `GHSA-rgj7-g3m4-5g8c`, `GHSA-wq5f-xc86-pv6w`. Miniflare's parent record also rolled up image-library findings. |
| `source-map-js@1.2.1` | High | `GHSA-68fv-2mgg-jv7q`: event-loop denial of service from indexed source-map section offsets. |
| `undici@7.24.8` | High | The audit reported 29 TLS validation, SSRF/routing, cookie/header injection, cache disclosure/poisoning, response splitting, and denial-of-service advisories: `GHSA-vmh5-mc38-953g`, `GHSA-p88m-4jfj-68fv`, `GHSA-vxpw-j846-p89q`, `GHSA-hm92-r4w5-c3mj`, `GHSA-g8m3-5g58-fq7m`, `GHSA-pr7r-676h-xcf6`, `GHSA-8xcm-r25x-g524`, `GHSA-4cwx-7wf7-3272`, `GHSA-m8rv-5g2x-5cg5`, `GHSA-jr45-8vmc-qm54`, `GHSA-v3r7-h72x-cjcm`, `GHSA-35p6-xmwp-9g52`, `GHSA-pmjh-fq2x-6v4x`, `GHSA-r53p-7pc4-xj5r`, `GHSA-rfgv-xxqx-mfg5`, `GHSA-3xpg-4rpp-hhhm`, `GHSA-2jfj-6hjv-fm6j`, `GHSA-2gqq-gqf2-x968`, `GHSA-w293-vg96-wgc3`, `GHSA-8436-99hf-9mmv`, `GHSA-rx4f-c7p8-82vq`, `GHSA-4qv8-2p9j-2685`, `GHSA-f72v-6w45-q472`, `GHSA-xjj6-f33q-929c`, `GHSA-4w7w-5xrc-9h26`, `GHSA-2m5v-pch6-74hx`, `GHSA-qrxm-fqhp-jwvm`, `GHSA-9fm3-97px-rjf6`, `GHSA-55wc-3pg8-jfw6`. |
| `vite@8.0.13` | High | Seven Vite/launch-editor advisories: `GHSA-v6wh-96g9-6wx3`, `GHSA-698v-4r3x-3vcv`, `GHSA-r825-w8mm-5pxw`, `GHSA-587h-7wmj-h5pm`, `GHSA-9jrq-w75r-8gcw`, `GHSA-rq7h-c2jc-7f22`, `GHSA-fx2h-pf6j-xcff`. |
| `zod@4.4.3` | High | `GHSA-mrhx-c7xc-m3w5`: memory exhaustion while validating oversized constrained collections. |

## Remediation applied

### Dependency updates and overrides

| Dependency area | Change |
|---|---|
| React/RSC | `react`, `react-dom`, and `react-server-dom-webpack` `19.2.6` → `19.3.1`. |
| Cloudflare/Vinext build | `@cloudflare/vite-plugin` `1.37.1` → `1.67.0`; `@cloudflare/workers-types` → `5.20261101.1`; `wrangler` `4.92.0` → `4.156.1`; `vinext` `1.0.0-beta.2` → `1.4.1`; `@vitejs/plugin-rsc` `0.5.26` → `0.5.38`; Vite `8.0.13` → `8.3.5`. |
| Image/render toolchain | `sharp` `0.34.5` → `0.35.5`; `@vercel/og` resolves to `1.0.3`; Satori resolves to `0.33.5`; vulnerable `image-size@2.0.2` is no longer installed. |
| Lint/type tooling | `eslint`/`@eslint/js` `9.39.4` → `9.39.5`; `typescript-eslint` `8.59.3` → `8.72.1`; `drizzle-kit` `0.31.10` → `0.31.11`. |
| Patched transitive utilities | `baseline-browser-mapping` → `2.11.34`; `brace-expansion` → `5.0.12`; `browserslist` → `4.29.5`; `fast-uri` → `3.1.9`; `fflate` → `0.7.5`; `js-yaml` → `3.15.2`/`4.3.2`; `nanoid` → `3.3.20`; `postcss` → `8.5.32`; `source-map-js` → `1.2.2`; `undici` → `7.30.1`; `zod` → `4.6.7`; vulnerable `ws` resolves to `8.21.0`/`8.22.0`. |
| esbuild under Drizzle Kit | Added a path-scoped override from `@esbuild-kit/esm-loader` through `@esbuild-kit/core-utils` to patched `esbuild@0.25.12`. This preserves the loader's used transform API without selecting the `drizzle-kit` downgrade suggested by npm's automatic fix metadata. A temporary isolated-config `drizzle-kit generate` check completed and reported no schema changes. |
| minimatch consumers | `minimatch` resolves to patched `11.0.1`. Its API no longer provides the old default callable export used by the currently published ESLint plugins, so four small patches update those consumers to the named exports. Added `patch-package@8.0.1` and a `postinstall` hook; a fresh `npm ci` reapplied all four checked-in patches successfully. |

`npm audit fix` was run without `--force` for compatible in-range updates. Major updates were selected only where current peer compatibility and the build supported them. ESLint 10.14.0 was reviewed but not installed: `eslint-plugin-jsx-a11y@6.10.2` and `eslint-plugin-react@7.37.5` declare peers only through ESLint 9. ESLint 9.39.5 emits npm's unsupported-version warning; upgrading the major while those plugins reject ESLint 10 would be an unverified compatibility break. This is a maintenance blocker, not an npm advisory remaining in the lockfile.

### Static export/runtime compatibility

After the Cloudflare/Vinext updates, `vinext start` attempted to load a Worker-only `cloudflare:` module in Node and the existing static exporter timed out. Directly starting the built output through `wrangler dev --config dist/server/wrangler.json` served `/`, `/projects/forgeai`, and `/projects/forgemcp` with HTTP 200. `scripts/export-pages.mjs` now starts that Wrangler local Worker runtime, drains its output, and reports startup diagnostics if it exits. The Pages artifact remains `pages-dist`, produced by the existing Vinext build and export path.

### Markdown XSS

The blog pipeline previously inserted Marked output into `dangerouslySetInnerHTML`. The build rejected script/iframe tags and inline event attributes, but Marked preserved `javascript:` and `data:` links and raw HTML. A controlled parser in `scripts/markdown-security.mjs` now escapes all raw HTML, only emits links with `http`, `https`, `mailto`, or `tel` schemes, and only emits images with `http` or `https` schemes; blocked links become text and blocked images become alt text. The build regenerates blog HTML before both `npm run dev` and `npm run build`, in addition to the existing Pages build regeneration. Current blog content contains no scriptable URL patterns. A regression test exercises raw event-handler HTML and `javascript:`/`data:` link and image payloads.

The ForgeMCP encyclopedia's separate publication renderer already escapes raw HTML and restricts external links to HTTPS while resolving archived links to indexed records. It was reviewed and left unchanged.

## Workflow and repository security review

- All four workflows parsed as YAML. All 11 third-party action references now use immutable full commit SHAs with version comments. Tags and SHAs were resolved from the official action repositories: checkout `v7.0.1`, setup-node `v7.1.0`, configure-pages `v6.0.0`, upload-pages-artifact `v5.0.0`, and deploy-pages `v5.0.1`.
- The deployment workflow still uses the GitHub Pages artifact flow, `github-pages` environment, least-privilege `contents: read`, `pages: write`, and `id-token: write` permissions, and serialized `pages` concurrency. It now runs `npm audit --audit-level=low` after `npm ci`, before the production build/deploy steps.
- The maintenance workflow now audits all severities (`--audit-level=low`) rather than only high. It continues to report failures and fail its job.
- Public release-sync and Pages build steps no longer receive the cross-repository `PORTFOLIO_REPO_STATUS_TOKEN`; the release-sync job uses its scoped `github.token`, and the Pages build does not need a token. The private-repository visibility workflow retains the secret because that API check must read private repository visibility.
- The audit branch is not covered by the deployment workflow's `push` trigger, which remains `main` only. No deployment or merge was performed.
- No app route-handler/middleware files, tracked `.env` files, or credential-pattern matches were found in the source scan. `.gitignore` excludes `.env*` and `*.pem`. `next.config.ts` has no security settings, and no repository `_headers`/`.htaccess` policy file exists. GitHub Pages response headers and repository/organization settings are outside this static source audit and remain unverified.

## Verification results

| Check | Result |
|---|---|
| `npm ci` | PASS — installed 500 packages; `postinstall` applied the four ESLint compatibility patches. |
| `npm audit --json` | PASS — 0 vulnerabilities across all severities. |
| `npm audit --omit=dev --json` | PASS — 0 production dependency vulnerabilities. |
| `npm run build:pages` | PASS — Vinext production build, Wrangler-backed route rendering, `pages-dist` export, and export verifier succeeded. Vinext/Rolldown emitted non-fatal sourcemap, dynamic-import, and large-chunk warnings. |
| `npm test` | PARTIAL — 39 passed, 14 failed, 53 total. The new Markdown XSS regression test passed. The 14 failures are the same existing shared-navigation assertion and blog pagination/discovery assertion failures observed on starting `main` (baseline 38/52 before the added regression test): portfolio, About, Contact, blog, article, paginated blog, Work Day with God, Words of Yeshua, card-only project pages, TanyaOS, journal articles, category/tag archives, blog discovery files, and community gateway. |
| `npm run lint` | PARTIAL — 2 errors and 20 warnings. The unchanged errors are `app/blog/PostArchive.tsx:10` and `app/projects/forgemcp/encyclopedia/Encyclopedia.tsx:87` (`react-hooks/set-state-in-effect`). The 20 warnings are existing `<img>` usage warnings. The changed JavaScript files pass a targeted ESLint run. |
| `npm run images:check` | PASS — all homepage, About, brand-logo, ForgeAI branding, and social-card image variants verified. |
| Pages route/asset verifier | PASS — verified `pages-dist/index.html`, ForgeMCP, ForgeAI, both home navigation links, and all four official ForgeAI banner/emblem assets. |
| Local built Worker route check | PASS — `/`, `/projects/forgeai`, and `/projects/forgemcp` each returned HTTP 200 with the expected page title. |
| Generated blog HTML security scan | PASS — scanned all 45 generated published posts; no script/iframe tags, inline event attributes, or `javascript:`/`data:` URL attributes found. |
| Workflow YAML/action pin check | PASS — four workflows parsed; all action references are full SHA pins. |
| `git diff --check` | PASS for source, config, and report files. The full check flags whitespace-only context-marker lines in the checked-in unified `patch-package` patch files; those spaces are part of patch syntax. Git also reported line-ending normalization notices for edited YAML files. |

## Remaining risks and limits

- Zero npm advisories is a lockfile result, not a comprehensive proof that the website or its hosting configuration is secure. The site is published as static HTML; there are no application API routes in the audited tree.
- GitHub Pages/organization response headers, custom-domain DNS, repository secrets and branch protections were not changed. Response-header behavior should be verified in the hosting settings/live response separately.
- ESLint 9's deprecation and the two existing lint errors remain. The tests also retain the 14 baseline assertion failures listed above. They are not caused by the security dependency changes, but they remain quality-gate debt.
- The updated Cloudflare Vite plugin currently resolves Miniflare `5.20261101.0-beta`; it has no npm audit advisory in the final lockfile but is a prerelease dependency, so it should be revisited when a stable compatible release is available.
- No pull request CI workflow currently runs on `pull_request`; this audit verified checks locally. Deployment remains gated to `main` and was not invoked from this branch.

## Review and publication boundary

The verified changes are scoped to `security/website-audit-2026-11-01` for review against `main`. No merge or deployment was performed. Review the test/lint baseline debt and the ESLint/Miniflare lifecycle notes before approval.
