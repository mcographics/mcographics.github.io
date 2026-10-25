import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {sanitizeEvidence,publicStructure,extractLog,extractJsonLines,csvInventory,reviewEvidence} from '../scripts/forgemcp-evidence.mjs';

test('public evidence removes credentials, personal paths, URL secrets and encoded media',()=>{
  const text='token="fake-session-secret" Bearer fake-bearer-secret --api-key fake-cli-secret https://name:fakepass@example.com/report?token=fake-url-secret C:\\Users\\PrivatePerson\\project\\a.cpp: error C2065: symbol missing';
  const clean=sanitizeEvidence(text);
  for(const secret of ['fake-session-secret','fake-bearer-secret','fake-cli-secret','fakepass','fake-url-secret','PrivatePerson'])assert.ok(!clean.includes(secret),secret);
  assert.equal(sanitizeEvidence('Basic fake-basic-secret'),'Basic [redacted]');
  assert.ok(!sanitizeEvidence('`[callstack] C:\\Users\\PrivatePerson\\file.cpp`').includes('PrivatePerson'));
  assert.equal(sanitizeEvidence('See https://example.com/path?token=fake-secret'),'See https://example.com/path');
  assert.ok(!sanitizeEvidence('"authorization_id": "fake-authorization-handle" --authorization-id fake-cli-handle').includes('fake-'));
  assert.ok(!sanitizeEvidence('session_id=fake-session-handle PID 123 unreal-456').includes('fake-session-handle'));
  assert.ok(!sanitizeEvidence('session_id=fake-session-handle PID 123 unreal-456').includes('unreal-456'));
  assert.ok(!sanitizeEvidence('session ID: fake-space-handle correlation ID: fake-correlation').includes('fake-space-handle'));
  assert.ok(!sanitizeEvidence(String.raw`{\"authorization_id\":\"fake-escaped-handle\"}`).includes('fake-'));
  const approvalId='0123456789ABCDEF0123456789ABCDEF';
  assert.ok(!sanitizeEvidence(`Existing approval ID: ${approvalId}`).includes(approvalId));
  assert.ok(!sanitizeEvidence(`Existing human-approved setup_layer grant ${approvalId}`).includes(approvalId));
  assert.ok(!sanitizeEvidence(`Request ID: ${approvalId}`).includes(approvalId));
  assert.ok(!sanitizeEvidence(`The only request/grant is ${approvalId}`).includes(approvalId));
  assert.ok(!sanitizeEvidence(`{"adoption_id":"${approvalId}"}`).includes(approvalId));
  assert.ok(!sanitizeEvidence(`Forge.Landscape.ApproveAdoption ${approvalId}`).includes(approvalId));
  assert.match(clean,/error C2065: symbol missing/);
  const safe=publicStructure({token:'fake-token',pid:24264,authorization:{id:'fake-grant',scope:'Landscape',approved:true},adoption_id:approvalId,preview_id:'fake-preview',image:'A'.repeat(300),sha256:'a'.repeat(64)});
  assert.equal(safe.token,'[redacted]');assert.equal(safe.authorization.id,'[redacted]');assert.equal(safe.authorization.scope,'Landscape');assert.equal(safe.authorization.approved,true);assert.equal(safe.adoption_id,'[redacted]');assert.equal(safe.preview_id,'[redacted]');assert.equal(safe.image,'[binary or encoded payload omitted]');assert.equal(safe.sha256,'a'.repeat(64));
  assert.equal(safe.pid,'[redacted]');
});
test('diagnostic selection retains original line numbers and late failures without telemetry',()=>{
  const log=extractLog('noise\nLogForge: bridge started\nLogForge: bridge started\nTelemetry Error: send event\nFatal error: Landscape failed\nvalidation_failed_partial\n');
  assert.deepEqual(log.selected.map(line=>line.line),[2,5,6]);assert.equal(log.matchingLines,4);assert.equal(log.uniqueLines,3);
});
test('JSONL events preserve outcome timestamps while excluding process and identity material',()=>{
  const row=JSON.stringify({component:'forgemcp_bootstrap',event:'tool_registry_constructed',utc_ns:1792729166264393700,pid:11960,correlation_id:'fake-correlation',exit_code:0});
  const result=extractJsonLines(row,'Saved/ForgeMCPBootstrap-11960.jsonl');
  assert.equal(result.selected.length,1);
  assert.equal(result.selected[0].value.event,'tool_registry_constructed');
  assert.equal(result.selected[0].value.exit_code,0);
  assert.match(result.selected[0].value.timestamp_utc,/^2026-10-/);
  assert.ok(!JSON.stringify(result.selected).includes('11960'));
  assert.ok(!JSON.stringify(result.selected).includes('fake-correlation'));
  assert.equal(extractJsonLines(row,'Saved/runtime/identity-parent-deadbeef.jsonl').selected.length,0);
  assert.equal(extractJsonLines(JSON.stringify({component:'forgemcp_bootstrap',event:'python_entry',utc_ns:1792729166264393700}),'Saved/ForgeMCPBootstrap.jsonl').selected.length,0);
});
test('checkpoint save and crash evidence is summarized safely and marked as corroborating',async()=>{
  const root=await mkdtemp(join(tmpdir(),'forgemcp-checkpoint-evidence-'));
  const crashContext=`<CrashContext><CrashType>Assert</CrashType><ErrorMessage>Assertion failed: ModuleManager.IsModuleLoaded(ModuleName) [File: C:\\Users\\Private\\Engine\\ModuleManager.cpp]\nTried to get module interface for unloaded module: &apos;LevelEditor&apos;</ErrorMessage><TimeOfCrash>639283390917640000</TimeOfCrash><EngineVersion>5.6.1</EngineVersion><IsAssert>true</IsAssert><IsEnsure>false</IsEnsure><MachineId>private-machine-id</MachineId><UserName>PrivateUser</UserName></CrashContext>`;
  const saveTrace=['[2026.10.23-07.42.12:406][714]LogAudioMixer: Display: underrun',...Array.from({length:17},(_,i)=>`[2026.10.23-07.42.56:528][651]LogSavePackage: Moving output files for package: /Game/__ExternalActors__/PrivateActorId${i}`),'[2026.10.23-07.42.56:859][651]LogFileHelpers: InternalPromptForCheckoutAndSave took 2.99 sec','[2026.10.23-07.42.56:997][651]LogContentValidation: Display: Starting to validate 17 assets'].join('\n');
  await Promise.all([
    writeFile(join(root,'manual_save_log_excerpt.txt'),saveTrace),
    writeFile(join(root,'CrashContext.runtime-xml'),crashContext),
    writeFile(join(root,'empty.sarif'),JSON.stringify({version:'2.1.0',runs:[{results:[]}]})),
    writeFile(join(root,'settings.ini'),'[Editor]\nPrivatePath=C:\\Users\\Private\\Project\n'),
    writeFile(join(root,'worker.out'),'ordinary worker output\n'),
    writeFile(join(root,'checks.sha256'),'0'.repeat(64)+'  report.json\n'),
  ]);
  try {
    const {documents,audit}=await reviewEvidence(root,{extensions:['txt','runtime-xml','sarif','ini','out','sha256']});
    assert.equal(audit.summary.reviewed,6);
    const save=documents.find(item=>item.format==='Save trace summary');
    const crash=documents.find(item=>item.format==='Crash-context summary');
    assert.equal(save.date,'2026-10-23');assert.equal(save.time,'07:42:56.859');assert.equal(save.chronologyEligible,false);
    assert.match(save.markdown,/17 package output moves/);assert.doesNotMatch(save.markdown,/PrivateActorId/);
    assert.equal(crash.date,'2026-10-23');assert.equal(crash.time,'07:58:11.764');assert.equal(crash.chronologyEligible,false);
    assert.match(crash.markdown,/unloaded module: 'LevelEditor'/);assert.doesNotMatch(JSON.stringify(crash),/private-machine-id|PrivateUser|Users\\Private/);
    assert.equal(audit.summary.byDisposition['No selected development event'],1);
    assert.equal(audit.summary.byDisposition['No selected engineering signal'],1);
    assert.equal(audit.summary.byDisposition['Configuration snapshot; no discrete development event'],1);
    assert.equal(audit.summary.byDisposition['Integrity manifest accounted; not a development event'],1);
  } finally {await import('node:fs/promises').then(fs=>fs.rm(root,{recursive:true,force:true}));}
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
