import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm,access} from 'node:fs/promises';
import {resolve,join,basename,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import catalog from '../app/projects/forgemcp/encyclopedia/catalog.json' with {type:'json'};
import {documentMetadata,evidenceDate} from '../app/projects/forgemcp/encyclopedia/archive-order.mjs';
import {isChronologyRecord,chronologyRecords,latestDevelopmentUpdates} from '../app/projects/forgemcp/encyclopedia/chronology.mjs';

const projectRoot=resolve(fileURLToPath(new URL('../',import.meta.url)));

test('chronology is oldest-first, deduplicated, and excludes indexes and inventories',()=>{
  const records=chronologyRecords(catalog.records);
  assert.ok(records.length>300);
  assert.deepEqual(records.map(record=>record.date),[...records.map(record=>record.date)].sort());
  assert.equal(new Set(records.map(record=>record.sha256||record.id)).size,records.length);
  assert.ok(records.every(record=>record.date&&record.category!=='Master Index'&&record.category!=='Provenance and inventory'));
  assert.ok(!records.some(record=>record.format==='Review index'||record.format==='CSV summary'));
});

test('latest development updates are the newest records from the same chronology source',()=>{
  const chronology=chronologyRecords(catalog.records);
  const latest=latestDevelopmentUpdates(catalog.records,8);
  assert.deepEqual(latest.map(record=>record.id),chronology.slice(-8).reverse().map(record=>record.id));
});

test('file timestamp dates do not pull undated reference or index notes into the event feed',()=>{
  const reference={id:'reference',sha256:'reference',date:'2026-10-11',dateBasis:'File modified timestamp',category:'Reference Documents',format:'Markdown derivative'};
  const index={id:'index',sha256:'index',date:'2026-10-11',dateBasis:'File modified timestamp',category:'Master Index',format:'Markdown derivative'};
  const corroborating={id:'corroborating',sha256:'corroborating',date:'2026-10-11',dateBasis:'Log timestamp',category:'Failure and recovery',format:'Crash-context summary',chronologyEligible:false};
  assert.equal(isChronologyRecord(reference),false);
  assert.equal(isChronologyRecord(index),false);
  assert.equal(isChronologyRecord(corroborating),false);
});

test('temporary dated Markdown record becomes eligible without a category rule and is removed',async()=>{
  const prefix=resolve(projectRoot,'.tmp-chronology-sample-');
  const directory=await mkdtemp(prefix);
  assert.ok(directory.startsWith(`${projectRoot}${sep}`));
  assert.ok(basename(directory).startsWith('.tmp-chronology-sample-'));
  const sampleFile=join(directory,'automatic-record.md');
  try {
    await writeFile(sampleFile,`---\ntitle: Temporary chronology sample\ncreated: 2026-10-25\ntime: "14:30:00"\ntimezone: America/Toronto\nstatus: Completed\nsummary: Confirms a newly dated record enters the shared development index.\nevidence:\n  - tests/temporary-proof.json\n---\n\n# Temporary chronology sample\n`,'utf8');
    const markdown=await readFile(sampleFile,'utf8');
    const metadata=documentMetadata(markdown);
    const date=evidenceDate(markdown,'future/automatic-record.md');
    const sample={id:'temporary-sample',sha256:'temporary-sample-hash',path:'future/automatic-record.md',title:metadata.title,category:'Future records',format:'Markdown derivative',date:date.date,dateBasis:date.dateBasis,dateConfidence:date.dateConfidence,time:metadata.time,timezone:metadata.timezone,developmentStatus:metadata.status,summary:metadata.summary,supportingReferences:metadata.evidence};
    const indexed=chronologyRecords([...catalog.records,sample]);
    assert.ok(indexed.some(record=>record.id===sample.id));
    assert.equal(indexed.find(record=>record.id===sample.id).dateConfidence,'verified');
    assert.equal(indexed.find(record=>record.id===sample.id).supportingReferences[0],'tests/temporary-proof.json');
    assert.ok(latestDevelopmentUpdates([...catalog.records,sample],1).some(record=>record.id===sample.id));
  } finally {
    await rm(directory,{recursive:true,force:true});
  }
  await assert.rejects(access(directory));
});

test('file timestamp fallback is explicitly inferred',()=>{
  const value=evidenceDate('# Undated report','reports/undated.md',new Date('2026-10-12T23:59:00Z'));
  assert.deepEqual(value,{date:'2026-10-12',dateBasis:'File modified timestamp',dateConfidence:'inferred'});
});
