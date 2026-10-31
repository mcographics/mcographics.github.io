import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
const root = new URL('../',import.meta.url);
const catalog = JSON.parse(await readFile(new URL('app/projects/forgemcp/encyclopedia/catalog.json',root),'utf8'));

test('encyclopedia route renders its reading interface and project entry point links to it',async()=>{
  const {default:worker} = await import(new URL('dist/server/index.js',root));
  const response = await worker.fetch(new Request('http://localhost/projects/forgemcp/encyclopedia',{headers:{accept:'text/html'}}),{ASSETS:{fetch:async()=>new Response('Not found',{status:404})}},{waitUntil(){},passThroughOnException(){}});
  assert.equal(response.status,200);
  const html = await response.text();
  assert.match(html,/enc-layout/);
  assert.match(html,/Architecture overview/);
  assert.match(html,/Encyclopedia navigation/);
  const project = await readFile(new URL('app/projects/forgemcp/page.tsx',root),'utf8');
  assert.match(project,/href="\/projects\/forgemcp\/encyclopedia\/"/);
  assert.doesNotMatch(project,/Encyclopedia coming soon/);
});

test('every indexed archive document exists and has valid local references and source receipts',async()=>{
  const ids = new Set(catalog.records.map(r=>r.id));
  assert.equal(ids.size,catalog.records.length);
  assert.ok(ids.size>0);
  const payloads=await readdir(new URL('public/projects/forgemcp/encyclopedia/records/',root));
  assert.deepEqual(new Set(payloads.filter(name=>name.endsWith('.json')).map(name=>name.slice(0,-5))),ids);
  for(const record of catalog.records) {
    assert.match(record.sha256,/^[0-9a-f]{64}$/);
    const document = JSON.parse(await readFile(new URL(`public/projects/forgemcp/encyclopedia/records/${record.id}.json`,root),'utf8'));
    assert.equal(document.path,record.path);
    assert.ok(document.html.length>0);
    assert.doesNotMatch(document.html,/<(?:script|iframe|img|object)\b|(?:href|src)="(?:javascript|data):/i);
    assert.doesNotMatch(document.html,/\]\(\[local path\]/i);
    assert.doesNotMatch(document.html,/\bgh[pousr]_[A-Za-z0-9_]{20,}\b|\bsk-[A-Za-z0-9_-]{20,}\b/);
    assert.doesNotMatch(document.html,/\b[A-Za-z]:[\\/]+Users[\\/]+/i);
    assert.doesNotMatch(document.html,/\bunreal-\d{3,}\b|\bPID\s+\d{3,}\b/);
    const decoded=document.html.replaceAll('&quot;','"').replaceAll('&amp;','&').replace(/\\+"/g,'"');
    assert.doesNotMatch(decoded,/"(?:token|api_key|password|confirmation|grant_id|preview_id|authorization_id|editing_session_id)"\s*:\s*"(?!\[redacted)[^"\n]+"/i);
    assert.doesNotMatch(decoded,/"(?:session_id|sessionId|correlation_id|pid|ppid|child_pid|parent_pid)"\s*:\s*"?(?!\[redacted)[A-Za-z0-9-]+/i);
    for(const match of document.html.matchAll(/href="\?record=([a-f0-9]+)"/g)) assert.ok(ids.has(match[1]));
    for(const heading of document.headings) assert.ok(document.html.includes(`id="${heading.id}"`));
  }
});

test('Chronology and Latest Development Updates share unique dated source records',async()=>{
  const {chronologyRecords,latestDevelopmentUpdates}=await import('../app/projects/forgemcp/encyclopedia/chronology.mjs');
  const chronology=chronologyRecords(catalog.records);
  assert.ok(chronology.length>700);
  assert.deepEqual(chronology.map(record=>record.date),[...chronology.map(record=>record.date)].sort());
  assert.equal(new Set(chronology.map(record=>record.sha256||record.id)).size,chronology.length);
  assert.deepEqual(latestDevelopmentUpdates(catalog.records,6).map(record=>record.id),chronology.slice(-6).reverse().map(record=>record.id));
  const report=catalog.records.find(record=>record.path.endsWith('stage2c_report_after_manual_save.md'));
  assert.ok(report,'latest manual-save checkpoint report is indexed');
  assert.equal(report.date,'2026-10-23');
  assert.equal(report.dateConfidence,'verified');
  const client=await readFile(new URL('app/projects/forgemcp/encyclopedia/Encyclopedia.tsx',root),'utf8');
  assert.match(client,/Latest development updates/);
  assert.doesNotMatch(client,/Landscape adoption & native activation/);
});

test('chronology cards retain responsive mobile layout and touch-sized source links',async()=>{
  const css=await readFile(new URL('app/projects/forgemcp/encyclopedia/encyclopedia.css',root),'utf8');
  assert.match(css,/@media\(max-width:720px\)/);
  assert.match(css,/\.enc-timeline>div>button\{min-height:44px/);
  assert.match(css,/\.enc-content\{[^}]*overflow-wrap:anywhere/s);
});

test('terrain acceptance preserves blocked gates and original failed-partial result',async()=>{
  const record = catalog.records.find(r=>r.path.includes('Terrain_Acceptance_Verification'));
  assert.equal(record.status,'Blocked');
  const document = JSON.parse(await readFile(new URL(`public/projects/forgemcp/encyclopedia/records/${record.id}.json`,root),'utf8'));
  assert.match(document.html,/independent disk reload/i);
  assert.match(document.html,/validation_failed_partial/);
  assert.match(document.html,/BLOCKED/);
});

test('additional evidence review accounts for every source and publishes all structured sources',async()=>{
  const auditText=await readFile(new URL('public/projects/forgemcp/encyclopedia/source-review.json',root),'utf8');
  const audit=JSON.parse(auditText);const ids=new Map(catalog.records.map(record=>[record.id,record]));
  assert.equal(audit.entries.length,audit.summary.reviewed);
  assert.equal(Object.values(audit.summary.byDisposition).reduce((a,b)=>a+b,0),audit.entries.length);
  assert.equal(catalog.coverage.additionalSources,audit.entries.length);
  for(const entry of audit.entries) {
    assert.match(entry.sha256,/^[a-f0-9]{64}$/);
    if(entry.recordId){assert.ok(ids.has(entry.recordId));assert.equal(ids.get(entry.recordId).sha256,entry.sha256);}
    if(entry.type==='json'||entry.type==='csv')assert.ok(entry.recordId,entry.path);
  }
  const {createHash}=await import('node:crypto');
  assert.equal(ids.get(catalog.coverage.reviewRecordId).sha256,createHash('sha256').update(auditText).digest('hex'));
});

test('supplemental recovery and JSONL review accounts for sources without exposing runtime identity data',async()=>{
  const audit=JSON.parse(await readFile(new URL('public/projects/forgemcp/encyclopedia/supplemental-source-review.json',root),'utf8'));
  const ids=new Map(catalog.records.map(record=>[record.id,record]));
  assert.equal(audit.entries.length,audit.summary.reviewed);
  assert.equal(audit.summary.byType.jsonl,81);
  assert.equal(audit.summary.byDisposition['Skipped symlink target; not traversed'],25);
  assert.equal(audit.summary.byType['runtime-xml'],2);
  assert.equal(audit.summary.byType.sarif,120);
  assert.equal(audit.summary.publishedSourceRecords,149);
  assert.equal(audit.checkpointInventory.regularFiles,30712);
  assert.equal(audit.checkpointInventory.indexedEvidenceFiles,440);
  assert.equal(audit.checkpointInventory.sourceSnapshotAudit.files,377);
  assert.equal(audit.checkpointInventory.sourceSnapshotAudit.logicalPaths,101);
  assert.equal(audit.checkpointInventory.sourceSnapshotAudit.variantPaths,5);
  assert.equal(Object.values(audit.summary.byDisposition).reduce((a,b)=>a+b,0),audit.entries.length);
  assert.doesNotMatch(JSON.stringify(audit),/ForgeMCPBootstrap-\d+\.jsonl|identity-(?:parent|child)-[a-f0-9]{32}/i);
  for(const entry of audit.entries) {
    if(entry.sha256)assert.match(entry.sha256,/^[a-f0-9]{64}$/);
    if(entry.recordId)assert.ok(ids.has(entry.recordId),entry.path);
  }
  for(const record of catalog.records.filter(record=>record.path.startsWith('ForgeMCP_Recovery_Checkpoints/'))) {
    const document=JSON.parse(await readFile(new URL(`public/projects/forgemcp/encyclopedia/records/${record.id}.json`,root),'utf8'));
    assert.doesNotMatch(document.html,/\bunreal-\d{3,}\b|\bPID\s+\d{3,}\b/);
  }
  const chronology=(await import('../app/projects/forgemcp/encyclopedia/chronology.mjs')).chronologyRecords(catalog.records);
  assert.ok(!chronology.some(record=>record.format==='Save trace summary'||record.format==='Crash-context summary'||record.format==='Checkpoint source comparison'));
  assert.equal(catalog.records.filter(record=>record.format==='Crash-context summary').length,2);
  assert.equal(catalog.records.filter(record=>record.format==='Save trace summary').length,1);
  assert.equal(catalog.records.filter(record=>record.format==='Checkpoint source comparison').length,1);
  const saveId=catalog.records.find(record=>record.format==='Save trace summary').id;
  const stage2c=catalog.records.find(record=>record.path.endsWith('stage2c_report_after_manual_save.md'));
  const stage2cPayload=JSON.parse(await readFile(new URL(`public/projects/forgemcp/encyclopedia/records/${stage2c.id}.json`,root),'utf8'));
  assert.match(stage2cPayload.html,new RegExp(`href="\\?record=${saveId}"`));
  for(const record of catalog.records.filter(item=>item.format==='Crash-context summary')) {
    const payload=JSON.parse(await readFile(new URL(`public/projects/forgemcp/encyclopedia/records/${record.id}.json`,root),'utf8'));
    assert.match(payload.html,/href="\?record=[a-f0-9]{16}"/);
  }
});

test('hand-rig milestone is the latest dated event and linked issue/proposals stay out of chronology',async()=>{
  const milestone=catalog.records.find(record=>record.path.endsWith('ForgeMCP_Hand_Rigging_Skinning_Animation_Milestone_2026-10-30.md'));
  const issue=catalog.records.find(record=>record.path.endsWith('ForgeMCP_Incorrect_Hand_Finger_Flexion_Direction_2026-10-30.md'));
  const correction=catalog.records.find(record=>record.path.endsWith('ForgeMCP_Anatomical_Rig_Validation_Correction_Milestone_Proposed_2026-10-30.md'));
  const webcam=catalog.records.find(record=>record.path.endsWith('ForgeMCP_Real_Time_Hand_Motion_Capture_Milestone_Proposed_2026-10-30.md'));
  assert.ok(milestone); assert.ok(issue); assert.ok(correction); assert.ok(webcam);
  assert.equal(milestone.date,'2026-10-30');
  assert.equal(milestone.dateConfidence,'verified');
  assert.equal(milestone.chronologyEligible,true);
  for(const record of [issue,correction,webcam]) assert.equal(record.chronologyEligible,false);
  const {chronologyRecords,latestDevelopmentUpdates}=await import('../app/projects/forgemcp/encyclopedia/chronology.mjs');
  const chronology=chronologyRecords(catalog.records);
  assert.ok(chronology.some(record=>record.id===milestone.id));
  assert.ok(![issue,correction,webcam].some(expected=>chronology.some(record=>record.id===expected.id)));
  assert.equal(latestDevelopmentUpdates(catalog.records,1)[0].id,milestone.id);
  const document=JSON.parse(await readFile(new URL('public/projects/forgemcp/encyclopedia/records/'+milestone.id+'.json',root),'utf8'));
  assert.match(document.html,/9,584/);
  assert.match(document.html,/reverse finger flexion/i);
  assert.match(document.html,new RegExp('href="\\?record='+issue.id+'"'));
  assert.match(document.html,new RegExp('href="\\?record='+correction.id+'"'));
  assert.match(document.html,new RegExp('href="\\?record='+webcam.id+'"'));
});
