export const sortOptions = [
  ['oldest', 'Earliest date → latest'],
  ['newest', 'Latest date → earliest'],
  ['az', 'Title: A → Z'],
  ['za', 'Title: Z → A'],
];

/** @param {string} value */
function validDate(value) {
  const normalized = value.replaceAll('/', '-');
  const parsed = new Date(`${normalized}T00:00:00Z`);
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0,10) === normalized ? normalized : null;
}

/** Dates describe source records, not independently verified event times.
 * @param {string} markdown
 * @param {string} path
 */
export function evidenceDate(markdown, path) {
  const header = markdown.split('\n').slice(0,25).join('\n').replaceAll('**','');
  const explicit = header.match(/\b(?:date|checked|updated|created|report date)\s*[:—-]?\s*(20\d{2}[-/]\d{2}[-/]\d{2})\b/i);
  if(explicit) { const date = validDate(explicit[1]); if(date) return {date,dateBasis:'Document date'}; }
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const human = header.match(/\b(?:date|checked|updated|created|report date)\s*[:—-]?\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(20\d{2})\b/i);
  if(human) {
    const month = months.findIndex(m=>m.toLowerCase()===human[1].toLowerCase())+1;
    const date = validDate(`${human[3]}-${String(month).padStart(2,'0')}-${human[2].padStart(2,'0')}`);
    if(date) return {date,dateBasis:'Document date'};
  }
  const filename = path.split('/').pop() || '';
  const named = filename.match(/(?:^|[^\d])(20\d{2})[-_]?([01]\d)[-_]?([0-3]\d)(?=[^\d]|$)/);
  if(named) { const date = validDate(`${named[1]}-${named[2]}-${named[3]}`); if(date) return {date,dateBasis:'Filename date'}; }
  return {date:null,dateBasis:'Undated'};
}

/** @template {{title:string,path:string,date:string|null}} T
 * @param {T[]} records
 * @param {string} order
 * @returns {T[]}
 */
export function orderRecords(records, order) {
  const compare = new Intl.Collator('en',{numeric:true,sensitivity:'base'}).compare;
  return [...records].sort((a,b)=>{
    const alpha = compare(a.title,b.title) || compare(a.path,b.path);
    if(order==='az') return alpha;
    if(order==='za') return -alpha;
    if(!a.date && !b.date) return alpha;
    if(!a.date) return 1;
    if(!b.date) return -1;
    const chronological = a.date.localeCompare(b.date);
    return (order==='newest' ? -chronological : chronological) || alpha;
  });
}
