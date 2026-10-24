import test from 'node:test';
import assert from 'node:assert/strict';
import {evidenceDate,orderRecords} from '../app/projects/forgemcp/encyclopedia/archive-order.mjs';

const records = [
  {title:'Beta',path:'b.md',date:'2026-10-24'},
  {title:'Alpha',path:'a.md',date:null},
  {title:'Gamma',path:'g.md',date:'2026-10-09'},
];
test('all four archive orders are correct and date orders put undated records last',()=>{
  assert.deepEqual(orderRecords(records,'oldest').map(r=>r.title),['Gamma','Beta','Alpha']);
  assert.deepEqual(orderRecords(records,'newest').map(r=>r.title),['Beta','Gamma','Alpha']);
  assert.deepEqual(orderRecords(records,'az').map(r=>r.title),['Alpha','Beta','Gamma']);
  assert.deepEqual(orderRecords(records,'za').map(r=>r.title),['Gamma','Beta','Alpha']);
  assert.equal(records[0].title,'Beta');
});
test('record dates prefer explicit headers and retain filename provenance',()=>{
  assert.deepEqual(evidenceDate('# Report\n\nChecked October 24, 2026.','report_20261023.md'),{date:'2026-10-24',dateBasis:'Document date'});
  assert.deepEqual(evidenceDate('**Date:** 2026-10-12','report.md'),{date:'2026-10-12',dateBasis:'Document date'});
  assert.deepEqual(evidenceDate('# Report','report_20261009T232404Z.md'),{date:'2026-10-09',dateBasis:'Filename date'});
  assert.deepEqual(evidenceDate('# Report\nA historical event happened in 2020.','report.md'),{date:null,dateBasis:'Undated'});
  assert.equal(evidenceDate('Date: 2026-02-30','report.md').date,null);
});
test('equal dates use a deterministic natural title order',()=>{
  const tied=[{title:'Session 10',path:'10.md',date:'2026-10-24'},{title:'Session 2',path:'2.md',date:'2026-10-24'}];
  for(const order of ['oldest','newest','az']) assert.equal(orderRecords(tied,order)[0].title,'Session 2');
});
