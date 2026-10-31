export { archiveSortStorageKey, loadArchiveSort, orderRecords, saveArchiveSort, sortOptions } from '../../../archive-sort.mjs';

/** @param {string} value */
function validDate(value) {
  const normalized = value.replaceAll('/', '-');
  const parsed = new Date(`${normalized}T00:00:00Z`);
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0,10) === normalized ? normalized : null;
}

const verifiedDateBases = new Set(['Document date','JSON timestamp','Log timestamp','JSONL event timestamp']);

export function dateConfidence(dateBasis) {
  if(verifiedDateBases.has(dateBasis)) return 'verified';
  if(dateBasis==='Undated') return 'undated';
  return 'inferred';
}

/** Read the small, documented front-matter contract used by new records. */
export function documentMetadata(markdown) {
  const frontmatter=markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  const source=frontmatter?.[1]||'';
  const value=(key)=>source.match(new RegExp(`^(?:${key})\\s*:\\s*(.*)$`,'im'))?.[1]?.trim().replace(/^(?:"([^"]*)"|'([^']*)')$/,'$1$2')||'';
  const evidenceBlock=source.match(/^evidence\s*:\s*((?:\s+-\s+[^\r\n]+\r?\n?)+)/im)?.[1]||'';
  return {
    title:value('title'),
    created:value('created|date'),
    time:value('time'),
    timezone:value('timezone'),
    status:value('status'),
    summary:value('summary'),
    chronologyEligible:value('chronology').toLowerCase()!=='false',
    evidence:evidenceBlock.split(/\r?\n/).map(line=>line.replace(/^\s*-\s*/, '').trim()).filter(Boolean),
  };
}

/** Dates describe source records, not independently verified event times.
 * @param {string} markdown
 * @param {string} path
 */
export function evidenceDate(markdown, path, modifiedAt=null) {
  const metadata=documentMetadata(markdown);
  const header = markdown.split('\n').slice(0,25).join('\n').replaceAll('**','');
  const metadataDate=metadata.created.match(/20\d{2}[-/]\d{2}[-/]\d{2}/)?.[0];
  if(metadataDate) { const date = validDate(metadataDate); if(date) return {date,dateBasis:'Document date',dateConfidence:'verified'}; }
  const explicit = header.match(/\b(?:date|checked|updated|created|report date)\s*[:—-]?\s*(20\d{2}[-/]\d{2}[-/]\d{2})\b/i);
  if(explicit) { const date = validDate(explicit[1]); if(date) return {date,dateBasis:'Document date',dateConfidence:'verified'}; }
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const human = header.match(/\b(?:date|checked|updated|created|report date)\s*[:—-]?\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(20\d{2})\b/i);
  if(human) {
    const month = months.findIndex(m=>m.toLowerCase()===human[1].toLowerCase())+1;
    const date = validDate(`${human[3]}-${String(month).padStart(2,'0')}-${human[2].padStart(2,'0')}`);
    if(date) return {date,dateBasis:'Document date',dateConfidence:'verified'};
  }
  const filename = path.split('/').pop() || '';
  const named = filename.match(/(?:^|[^\d])(20\d{2})[-_]?([01]\d)[-_]?([0-3]\d)(?=[^\d]|$)/);
  if(named) { const date = validDate(`${named[1]}-${named[2]}-${named[3]}`); if(date) return {date,dateBasis:'Filename date',dateConfidence:'inferred'}; }
  const archived=path.match(/(?:^|[^\d])(20\d{2})(\d{2})(\d{2})(?=[^\d]|$)/);
  if(archived) { const date=validDate(`${archived[1]}-${archived[2]}-${archived[3]}`); if(date) return {date,dateBasis:'Archive path date',dateConfidence:'inferred'}; }
  if(modifiedAt instanceof Date && Number.isFinite(modifiedAt.valueOf())) {
    const date=modifiedAt.toISOString().slice(0,10);
    if(validDate(date)) return {date,dateBasis:'File modified timestamp',dateConfidence:'inferred'};
  }
  return {date:null,dateBasis:'Undated',dateConfidence:'undated'};
}
