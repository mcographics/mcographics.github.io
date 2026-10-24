import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {sanitizeEvidence,publicStructure,extractLog,csvInventory,reviewEvidence} from '../scripts/forgemcp-evidence.mjs';

test('public evidence removes credentials, personal paths, URL secrets and encoded media',()=>{
  const text='token="fake-session-secret" Bearer fake-bearer-secret --api-key fake-cli-secret https://name:fakepass@example.com/report?token=fake-url-secret C:\\Users\\PrivatePerson\\project\\a.cpp: error C2065: symbol missing';
  const clean=sanitizeEvidence(text);
  for(const secret of ['fake-session-secret','fake-bearer-secret','fake-cli-secret','fakepass','fake-url-secret','PrivatePerson'])assert.ok(!clean.includes(secret),secret);
  assert.equal(sanitizeEvidence('Basic fake-basic-secret'),'Basic [redacted]');
  assert.ok(!sanitizeEvidence('`[callstack] C:\\Users\\PrivatePerson\\file.cpp`').includes('PrivatePerson'));
  assert.equal(sanitizeEvidence('See https://example.com/path?token=fake-secret'),'See https://example.com/path');
  assert.ok(!sanitizeEvidence('"authorization_id": "fake-authorization-handle" --authorization-id fake-cli-handle').includes('fake-'));
  assert.ok(!sanitizeEvidence(String.raw`{\"authorization_id\":\"fake-escaped-handle\"}`).includes('fake-'));
  assert.match(clean,/error C2065: symbol missing/);
  const safe=publicStructure({token:'fake-token',authorization:{id:'fake-grant',scope:'Landscape',approved:true},preview_id:'fake-preview',image:'A'.repeat(300),sha256:'a'.repeat(64)});
  assert.equal(safe.token,'[redacted]');assert.equal(safe.authorization.id,'[redacted]');assert.equal(safe.authorization.scope,'Landscape');assert.equal(safe.authorization.approved,true);assert.equal(safe.preview_id,'[redacted]');assert.equal(safe.image,'[binary or encoded payload omitted]');assert.equal(safe.sha256,'a'.repeat(64));
});
test('diagnostic selection retains original line numbers and late failures without telemetry',()=>{
  const log=extractLog('noise\nLogForge: bridge started\nLogForge: bridge started\nTelemetry Error: send event\nFatal error: Landscape failed\nvalidation_failed_partial\n');
  assert.deepEqual(log.selected.map(line=>line.line),[2,5,6]);assert.equal(log.matchingLines,4);assert.equal(log.uniqueLines,3);
});
test('CSV inventory handles quoted commas, escaped quotes and multiline records',()=>{
  const stats=csvInventory('category,outcome,note\r\n"Build, compile",PASS,"two\nlines"\r\nTerrain,FAILED,"a ""quote"""\r\n');
  assert.equal(stats.records,2);assert.equal(stats.distributions.category['Build, compile'],1);assert.equal(stats.distributions.outcome.FAILED,1);
});
test('long logs retain every distinct matching diagnostic',()=>{
  const log=extractLog(Array.from({length:150},(_,i)=>`Error C${2000+i}: diagnostic ${i}`).join('\n'));
  assert.equal(log.selected.length,150);assert.equal(log.selected[75].line,76);
  assert.match(extractLog(`Error: ${'x'.repeat(1500)}`).selected[0].text,/\[line truncated after 1400 characters\]$/);
});
test('different component identifiers and crash addresses remain distinct evidence',()=>{
  const log=extractLog('Error component 11111111111111111111111111111111 at 0x1111\nError component 22222222222222222222222222222222 at 0x2222\n');
  assert.equal(log.selected.length,2);assert.match(log.selected[1].text,/22222222222222222222222222222222/);
  assert.equal(extractLog('[Warning] component message\n[Error] component message').selected.length,2);
  assert.equal(extractLog('[2026.10.24-01:00:00][ 1]LogForge: started\n[2026.10.24-01:00:01][ 2]LogForge: started').selected.length,1);
});
test('every reviewed file gets a disposition and duplicates link to canonical records',async()=>{
  const root=await mkdtemp(join(tmpdir(),'forgemcp-publication-test-'));
  await mkdir(join(root,'logs'));
  await Promise.all([writeFile(join(root,'logs','a_20261024.log'),'LogForge: bridge started\n'),writeFile(join(root,'logs','b.log'),'LogForge: bridge started\n'),writeFile(join(root,'logs','empty.log'),''),writeFile(join(root,'logs','noise.log'),'ordinary startup text'),writeFile(join(root,'report.json'),JSON.stringify({status:'failed',token:'fake-secret'}))]);
  const {documents,audit}=await reviewEvidence(root);
  assert.equal(audit.summary.reviewed,5);assert.equal(documents.length,2);
  assert.equal(audit.summary.byDisposition['Empty file'],1);assert.equal(audit.summary.byDisposition['Byte-identical duplicate'],1);assert.equal(audit.summary.byDisposition['No selected engineering signal'],1);
  assert.equal(audit.entries.find(e=>e.path.endsWith('b.log')).recordPath,'logs/a_20261024.log');
  assert.ok(!JSON.stringify(documents).includes('fake-secret'));
});
