# ForgeMCP Encyclopedia publication

Route: `/projects/forgemcp/encyclopedia/`. The project button links here.

## Source review and public reading records

The snapshot includes Markdown records plus recursively reviewed `.log`, `.json` and `.csv` evidence from `ForgeMCP_Encyclopedia`. A supplemental pass reviews recovery checkpoint folders and JSONL sources under `Saved`. The current audit inventories 30,712 regular files in `ForgeMCP_Recovery_Checkpoints` by extension and records the 440 selected documentation/evidence files with their dispositions and source hashes. It also hash-compares 377 code snapshot files across 101 logical paths. Binary assets, editor caches, and build outputs are counted for inventory but are not opened, restored, or published. The generators only read these selected source roots. They never execute recovery scripts or connect to, launch, save or edit Unreal or Blender.

- Markdown is rendered as a sanitized reading derivative.
- Diagnostic logs select technical warnings, errors, exceptions, build/test outcomes, environment versions and ForgeMCP messages, retaining every distinct matching line and its original line number. Repeated lines are consolidated; individual lines are bounded to 1400 characters after redaction.
- Empty files and byte-identical duplicates receive explicit dispositions. Duplicate entries link to a canonical reading record when one exists. Logs without selected engineering signals remain listed in the manifest; compiler stdout that contains only a source filename is one example.
- JSON evidence preserves bounded technical structure. Large inventories summarize collection counts, schemas, status distributions and metadata. Arrays are bounded to 80 items, object views to 160 fields, nesting to 12 levels and strings to 1200 characters. These are reading views rather than lossless raw exports.
- The CSV inventory has a quoted-field parser and exposes parsed record totals, schema and categorical distributions.
- JSONL review keeps bounded event outcomes and timestamps. Process IDs, session/correlation identifiers, request/response transcripts and private runtime identity traces are excluded or redacted. Each source remains listed in `supplemental-source-review.json` with a disposition and source-byte hash.
- Checkpoint review also classifies `.ini`, `.txt`, `.out`, `.sarif`, `.runtime-xml` and `.sha256` evidence. Empty-result SARIF files and identical copies remain represented in the audit manifest without creating duplicate reading records. Sanitized save-trace and crash-context summaries link back to existing chronology records as corroboration; they are deliberately marked ineligible for a second chronology event. Differing Landscape source snapshots are documented in one undated comparison note because snapshot ordering does not establish which variant superseded another or prove runtime status.
- Credentials, authorization/preview secrets, local paths, telemetry and embedded media are excluded or redacted. Source HTML is escaped. Runtime registrations are not published.

Every reviewed text/evidence source has a disposition, byte size and SHA-256 in public `source-review.json` or `supplemental-source-review.json`. The checkpoint inventory and code snapshot comparison are reproducible using the supplemental verifier. Source-derived records retain original source-relative paths and hashes. The derived Evidence Review page hashes its manifest rather than claiming an original Markdown source. Unreal Engine source excerpts, credentials, local configuration details, and binary/cache contents are not reproduced in public reading records.

Historical inventory counts, recorded statuses and logs do not establish current readiness. The October 24 terrain acceptance report remains Blocked for its unresolved gates. Publication runs no new Editor acceptance tests.

## Refresh and validate

```powershell
$forgeRoot = $env:FORGEMCP_ROOT
if (-not $forgeRoot) { throw 'Set FORGEMCP_ROOT to the local ForgeMCP project root.' }
$archive = Join-Path $forgeRoot 'ForgeMCP_Encyclopedia'
$checkpoints = Join-Path $forgeRoot 'ForgeMCP_Recovery_Checkpoints'
$otherCheckpoints = Join-Path $forgeRoot '09_Recovery_and_Checkpoints'
$saved = Join-Path $forgeRoot 'Saved'
node scripts/build-forgemcp-encyclopedia.mjs $archive
node scripts/build-forgemcp-supplemental.mjs $checkpoints $otherCheckpoints $saved
node scripts/verify-forgemcp-source-review.mjs $archive
node scripts/verify-forgemcp-supplemental-sources.mjs $checkpoints $otherCheckpoints $saved
node --test tests/forgemcp-evidence.test.mjs tests/forgemcp-archive-order.test.mjs
node --test tests/forgemcp-chronology.test.mjs tests/forgemcp-encyclopedia.test.mjs
npm run build:pages
node --test tests/rendered-html.test.mjs tests/forgemcp-encyclopedia.test.mjs
```

Review generated derivatives before publishing. Update snapshot dates for later reviews. The generators never delete files; explicitly review obsolete public payloads if sources are removed. Keep runtime registration directories outside the source roots. The verifiers check exact source inventories and source hashes.

## Reading interface

Navigation includes evidence review, build/deployment, failure/recovery and provenance collections. Search covers titles, paths, categories and summaries. Records load on demand; `?record=<id>` links support sharing and reload.

Results are paginated at 40 records. Sorting applies to the entire filtered collection before pagination. Options are earliest-to-latest (default), latest-to-earliest, title A-Z and title Z-A; browser storage remembers the preference when available. Chronology and Latest Development Updates derive from the same dated catalog records. Document, JSON, JSONL and log timestamps are marked as verified source timestamps; filename, archive-path and filesystem-modified dates are marked as inferred. Filesystem timestamps are used only for event-oriented records, not undated reference notes or indexes.

## Future development records

Use `content/forgemcp-development-record-template.md` for new Markdown records. Required front matter: descriptive `title`, `created` (`YYYY-MM-DD`), development `status`, one-sentence `summary`, and at least one `evidence` reference. Add `time` (`HH:MM:SS`) and `timezone` when the source records them. A valid `created` date makes the record eligible for Chronology automatically; no manual category mapping is needed. The same catalog record then feeds Latest Development Updates. Date provenance remains visible, and exact-byte duplicates are collapsed in the timeline.

GitHub Pages export includes the route and all public evidence payloads. Publish only focused changes, preserve unrelated work, wait for deployment, then verify the live bundle, reading records and review manifest.
