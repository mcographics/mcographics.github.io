const excludedCategories=new Set(['Master Index','Provenance and inventory','Publication review']);
const datePriority=basis=>basis==='Document date'||basis==='JSON timestamp'||basis==='Log timestamp'||basis==='JSONL event timestamp'?3:
  basis==='Filename date'||basis==='Archive path date'?2:basis==='File modified timestamp'?1:0;

/** One dated, meaningful source record becomes one timeline entry. */
export function isChronologyRecord(record) {
  if(record.chronologyEligible===false) return false;
  if(!/^20\d{2}-\d{2}-\d{2}$/.test(record.date||'')) return false;
  if(excludedCategories.has(record.category)||record.format==='Review index'||record.format==='CSV summary') return false;
  // A filesystem timestamp alone dates the record copy, not a general reference note.
  if(record.dateBasis==='File modified timestamp'&&record.category==='Reference Documents') return false;
  return true;
}

/**
 * Use catalog records as the sole source for both chronology and latest updates.
 * Exact-byte duplicates stay readable in Archive but appear only once here.
 */
export function chronologyRecords(records) {
  const eligible=records.filter(isChronologyRecord);
  const groups=new Map();
  for(const record of eligible) {
    const key=record.sha256||record.id;
    const bucket=groups.get(key)||[];
    bucket.push(record);
    groups.set(key,bucket);
  }
  const unique=[...groups.values()].map(bucket=>bucket.sort((a,b)=>
    datePriority(b.dateBasis)-datePriority(a.dateBasis)||a.date.localeCompare(b.date)||a.path.localeCompare(b.path)
  )[0]);
  return unique.sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title,'en',{numeric:true,sensitivity:'base'})||a.path.localeCompare(b.path));
}

export function latestDevelopmentUpdates(records,limit=6) {
  return chronologyRecords(records).slice(-Math.max(0,limit)).reverse();
}
