# ForgeMCP Encyclopedia publication

Route: `/projects/forgemcp/encyclopedia/`. The existing ForgeMCP project button links here.

The October 24, 2026 snapshot indexes 132 direct Markdown records from category folders in the local `ForgeMCP_Encyclopedia` directory. It does not claim to publish the complete local evidence collection. Nested Saved archives, raw logs, runtime registrations, JSON manifests and binary artifacts are excluded. The original master index's larger counts remain historical inventory claims, not website coverage figures.

To refresh from an explicitly selected local archive, run:

```powershell
node scripts/build-forgemcp-encyclopedia.mjs G:/ForgeMCP/ForgeMCP_Encyclopedia
```

The generator writes the catalog and public JSON reading derivatives. It retains source-relative paths and SHA-256 of original bytes, redacts workstation paths and credential assignments, escapes source HTML, suppresses embedded images, permits HTTPS external links, and rewrites references only when a corresponding record is published. References outside coverage are marked as not indexed. Historical `15_Saved` references resolve to the current `14_Saved` category when possible.

Review the generated changes before publication. If records are removed from the source, remove their obsolete public JSON derivatives explicitly; the generator never deletes files. Update the snapshot date when preparing a later snapshot. Do not point the generator at arbitrary runtime or registration directories.

Navigation uses descriptive collections over real source paths. Search covers titles, paths and summaries, not full document bodies. Records load on demand, and `?record=<id>` links support reload and sharing. Status `Archived` means preserved historical evidence, not verified readiness. The terrain acceptance report is explicitly marked Blocked; individual evidence gates remain in the report body.

Archive lists and search results offer earliest-to-latest (default), latest-to-earliest, title A–Z and title Z–A sorting. The preference is remembered locally when browser storage is available. Date metadata prefers an explicit date in the document header, then a validated date in the filename; otherwise the record remains undated. Dates do not independently establish event times. Both date orders place undated records last, with natural alphabetical tie-breaking. Cards and articles display the date's provenance.

Validation:

```powershell
npx tsc --noEmit
node --test tests/forgemcp-encyclopedia.test.mjs
node --test tests/forgemcp-archive-order.test.mjs
npm test
npm run build:pages
```

GitHub Pages export includes the encyclopedia route. Publish only the intended website changes, preserve unrelated working files, and verify the deployed route and record JSON.
