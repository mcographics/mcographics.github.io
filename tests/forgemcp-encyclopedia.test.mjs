import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
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
  for(const record of catalog.records) {
    assert.match(record.sha256,/^[0-9a-f]{64}$/);
    const document = JSON.parse(await readFile(new URL(`public/projects/forgemcp/encyclopedia/records/${record.id}.json`,root),'utf8'));
    assert.equal(document.path,record.path);
    assert.ok(document.html.length>0);
    assert.doesNotMatch(document.html,/<(?:script|iframe|img|object)\b|(?:href|src)="(?:javascript|data):/i);
    assert.doesNotMatch(document.html,/\bgh[pousr]_[A-Za-z0-9_]{20,}\b|\bsk-[A-Za-z0-9_-]{20,}\b/);
    for(const match of document.html.matchAll(/href="\?record=([a-f0-9]+)"/g)) assert.ok(ids.has(match[1]));
    for(const heading of document.headings) assert.ok(document.html.includes(`id="${heading.id}"`));
  }
});

test('terrain acceptance preserves blocked gates and original failed-partial result',async()=>{
  const record = catalog.records.find(r=>r.path.includes('Terrain_Acceptance_Verification'));
  assert.equal(record.status,'Blocked');
  const document = JSON.parse(await readFile(new URL(`public/projects/forgemcp/encyclopedia/records/${record.id}.json`,root),'utf8'));
  assert.match(document.html,/independent disk reload/i);
  assert.match(document.html,/validation_failed_partial/);
  assert.match(document.html,/BLOCKED/);
});
