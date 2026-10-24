# ForgeMCP Encyclopedia publication

Route: `/projects/forgemcp/encyclopedia/`. The project button links here.

## Source review and public reading records

The snapshot includes the direct Markdown records and reviews every archived `.log`, `.json` and `.csv` source recursively. The generator only reads the selected source directory. It never connects to, launches, saves or edits Unreal or Blender.

- Markdown is rendered as a sanitized reading derivative.
- Diagnostic logs select technical warnings, errors, exceptions, build/test outcomes, environment versions and ForgeMCP messages, retaining every distinct matching line and its original line number. Repeated lines are consolidated; individual lines are bounded to 1400 characters after redaction.
- Empty files and byte-identical duplicates receive explicit dispositions. Duplicate entries link to a canonical reading record when one exists. Logs without selected engineering signals remain listed in the manifest; compiler stdout that contains only a source filename is one example.
- JSON evidence preserves bounded technical structure. Large inventories summarize collection counts, schemas, status distributions and metadata. Arrays are bounded to 80 items, object views to 160 fields, nesting to 12 levels and strings to 1200 characters. These are reading views rather than lossless raw exports.
- The CSV inventory has a quoted-field parser and exposes parsed record totals, schema and categorical distributions.
- Credentials, authorization/preview secrets, local paths, telemetry and embedded media are excluded or redacted. Source HTML is escaped. Runtime registrations are not published.

Every reviewed source has a disposition, byte size and SHA-256 in public `source-review.json`. Source-derived records retain original source-relative paths and hashes. The derived Evidence Review page hashes its manifest rather than claiming an original Markdown source.

Historical inventory counts, recorded statuses and logs do not establish current readiness. The October 24 terrain acceptance report remains Blocked for its unresolved gates. Publication runs no new Editor acceptance tests.

## Refresh and validate

```powershell
node scripts/build-forgemcp-encyclopedia.mjs G:/ForgeMCP/ForgeMCP_Encyclopedia
node scripts/verify-forgemcp-source-review.mjs G:/ForgeMCP/ForgeMCP_Encyclopedia
node --test tests/forgemcp-evidence.test.mjs tests/forgemcp-archive-order.test.mjs
npm run build:pages
node --test tests/rendered-html.test.mjs tests/forgemcp-encyclopedia.test.mjs
```

Review generated derivatives before publishing. Update snapshot dates for later reviews. The generator never deletes files; explicitly review obsolete public payloads if sources are removed. Keep runtime registration directories outside the selected archive. The verifier checks the exact local source inventory and every source hash against the reading-record and review receipts.

## Reading interface

Navigation includes evidence review, build/deployment, failure/recovery and provenance collections. Search covers titles, paths, categories and summaries. Records load on demand; `?record=<id>` links support sharing and reload.

Results are paginated at 40 records. Sorting applies to the entire filtered collection before pagination. Options are earliest-to-latest (default), latest-to-earliest, title A-Z and title Z-A; browser storage remembers the preference when available. Dates identify their provenance, including JSON or log/archive timestamps. Dates do not independently establish event times. Undated records remain last in either date order.

GitHub Pages export includes the route and all public evidence payloads. Publish only focused changes, preserve unrelated work, wait for deployment, then verify the live bundle, reading records and review manifest.
