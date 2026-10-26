import {readdir,readFile,stat} from 'node:fs/promises';
import {resolve,posix} from 'node:path';
import {createHash} from 'node:crypto';
import {evidenceDate} from '../app/projects/forgemcp/encyclopedia/archive-order.mjs';

const sha = bytes=>createHash('sha256').update(bytes).digest('hex');
const secretKey = /(?:token|secret|password|credential|api[_-]?key|authorization|confirmation|(?:adoption|approval|grant|request)[_-]?id|preview_id|editing_session_id|session[_-]?id|correlation|nonce|cookie|signature|csrf|(?:^|[_-])(?:p?pid|handle)(?:$|[_-]))/i;

export function sanitizeEvidence(text) {
  return String(text)
    .replace(/\bunreal-\d+\b/gi,'[session id redacted]')
    .replace(/\b(?:parent_)?pid\s*[:=]\s*\d+\b/gi,'pid=[redacted]')
    .replace(/\bPID\s*\d+\b/g,'PID [redacted]')
    .replace(/\b((?:adoption|approval|authorization|grant)(?:\s+(?:request|id)){0,2}\s+id\s*[:=]\s*)[a-f0-9-]{16,}\b/gi,'$1[redacted]')
    .replace(/\b(request\s+id\s*[:=]\s*)[a-f0-9-]{16,}\b/gi,'$1[redacted]')
    .replace(/\b((?:request|adoption|approval|authorization|grant)(?:[-_/\s]+(?:request|id|grant|approval|adoption|confirmation)){0,3}\s*(?:id\s*)?(?::|=|\bis\s+))([a-f0-9-]{16,})\b/gi,'$1[redacted]')
    .replace(/\b((?:adoption|approval|authorization|grant)(?:[-_\s]+(?:request|id|grant|approval|adoption))?\s+)[a-f0-9-]{16,}\b/gi,'$1[redacted]')
    .replace(/\b(Forge\.Landscape\.ApproveAdoption\s+)[a-f0-9-]{16,}\b/gi,'$1[redacted]')
    .replace(/\b((?:session|correlation)\s+id|editor_pid)\s*[:=]\s*[^\s,;}]+/gi,'$1 [redacted]')
    .replace(/-----BEGIN [^-]*PRIVATE KEY-----[\s\S]*?-----END [^-]*PRIVATE KEY-----/g,'[redacted private key]')
    .replace(/\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)\b/g,'[redacted credential]')
    .replace(/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/-]+=*/gi,'$1 [redacted]')
    .replace(/https?:\/\/[^\s<>"'`)\]]+/g,raw=>{try{const u=new URL(raw);u.username='';u.password='';u.search='';u.hash='';return u.href;}catch{return '[URL omitted]';}})
    .replace(/(--?(?:[\w-]{0,80}(?:token|secret|password|credential)|api[_-]?key|authorization|authorization[-_]?id|grant[-_]?id|preview[-_]?id|editing[-_]?session[-_]?id)(?:=|\s+))(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\s]+)/gi,'$1[redacted]')
    .replace(/((?:(?:\\*["'])?\b(?:[\w-]{0,80}(?:token|secret|password|credential|api_key)|authorization|authorization[-_]?id|adoption[-_]?id|approval[-_]?id|request[-_]?id|confirmation|grant[-_]?id|preview[-_]?id|editing[-_]?session[-_]?id|session[ _-]?id|correlation[ _-]?id|child[-_]?pid|parent[-_]?pid|editor[-_]?pid|pid|ppid|handle|nonce|cookie|signature|csrf)(?:\\*["'])?)\s*[:=]\s*)(?:\\+["'][^\r\n]*\\+["']|"[^"\r\n]*"|'[^'\r\n]*'|[^\s,}\r\n]+)/gi,'$1"[redacted]"')
    .replace(/data:[^;,\s]+;base64,[A-Za-z0-9+/=]+/g,'[embedded data omitted]')
    .replace(/(["'`])(?:[A-Za-z]:[\\/]|\\\\)[^\r\n]*?\1/g,'$1[local path]$1')
    .replace(/(?:\b[A-Za-z]:[\\/]|(?<![\w\\])\\\\)[^\r\n"'`|]*?(?=(?:\(\d+(?:,\d+)?\))?: (?:error|warning|fatal)|["'`|]|$)/gim,'[local path]')
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,'[email redacted]');
}

/** Preserve technical structure, with explicit bounds and secret-valued fields removed. */
export function publicStructure(value,depth=0,context='') {
  if(depth>12) return '[nested detail omitted]';
  if(typeof value==='string') {
    if(value.length>200 && /^[A-Za-z0-9+/_=\r\n-]+$/.test(value)) return '[binary or encoded payload omitted]';
    return sanitizeEvidence(value.length>1200 ? `${value.slice(0,1200)}… [string truncated]` : value);
  }
  if(Array.isArray(value)) {
    const items=value.slice(0,80).map(v=>publicStructure(v,depth+1,context));
    if(value.length>80) items.push(`[${value.length-80} additional array items omitted]`);
    return items;
  }
  if(value && typeof value==='object') return Object.fromEntries(Object.entries(value).slice(0,160).map(([key,v])=>[
    sanitizeEvidence(key),
    ((secretKey.test(key)&&(!v||typeof v!=='object'||Array.isArray(v)||! /^(?:authorization|grant|editing_session)$/i.test(key)))||(/authorization|grant|editing_session/i.test(context)&&key==='id'))
      ? '[redacted]' : publicStructure(v,depth+1,`${context}/${key}`),
  ]));
  return value;
}

export function classifyEvidence(path, text='') {
  if(/crash|exception|recovery|forensics/i.test(path)||/Fatal error|Assertion failed|Unhandled Exception|error (?:C\d+|LNK\d+)|BUILD FAILED|Result:\s*Failed|Traceback|validation_failed/i.test(text)) return 'Failure and recovery';
  if(/landscape|terrain|riverbed|RDG|A7K/i.test(path)) return 'Landscape diagnostics';
  if(/blender|rig|roundtrip|transfer|wooden_box/i.test(path)) return 'Blender and transfers';
  if(/build|compile|deployment/i.test(path)) return 'Builds and deployment';
  if(/connection|bootstrap|bridge|panel/i.test(path)) return 'Connection diagnostics';
  return 'Editor diagnostics';
}

const privateJsonlPath=/(?:identity|transcript|responses\.jsonl|probe\d*\.jsonl|manifest\.jsonl|(?:^|\/)parent\.jsonl$)/i;
const jsonlFields=['component','event','phase','exit_code','result','status','outcome','message','error','code','elapsed_ms','budget_seconds','remaining_ms','editor_responding','responding','process_present','critical_log_matches','fatal_log_entries','rdg_assertion_hits','uds_compile_error_count','world_partitioned','map_initialize_complete','world_partition_initialized','cdb_attached','new_crash_directories'];
const jsonlOutcomeFields=new Set(['exit_code','result','status','outcome','error','critical_log_matches','fatal_log_entries','rdg_assertion_hits','uds_compile_error_count','editor_responding','responding','process_present','world_partitioned','map_initialize_complete','world_partition_initialized','new_crash_directories']);

function jsonlDate(value,key) {
  if(value===null||value===undefined) return null;
  let milliseconds=NaN;
  if(/_ns$/i.test(key)) {
    try { milliseconds=Number(BigInt(String(value))/1000000n); } catch { return null; }
  } else if(typeof value==='number') milliseconds=value>1e14?value/1000000:value;
  else if(typeof value==='string') milliseconds=Date.parse(value);
  if(!Number.isFinite(milliseconds)) return null;
  const date=new Date(milliseconds);
  return Number.isFinite(date.valueOf())&&date.getUTCFullYear()>=2000?date:null;
}

export function extractJsonLines(text,path='') {
  if(privateJsonlPath.test(path)) return {lineCount:text.split(/\r?\n/).filter(Boolean).length,selected:[],date:null,excluded:'Runtime identity, transcript, request/response, or provenance JSONL'};
  const selected=[];const seen=new Set();let date=null;let lineCount=0;
  for(const [index,line] of text.split(/\r?\n/).entries()) {
    if(!line.trim()) continue;
    lineCount++;
    let value;try{value=JSON.parse(line);}catch{continue;}
    if(!value||typeof value!=='object'||Array.isArray(value)) continue;
    const event=typeof value.event==='string'?value.event:'';
    const hasOutcome=Object.keys(value).some(key=>jsonlOutcomeFields.has(key)&&value[key]!==null&&value[key]!==undefined);
    const meaningfulOutcome=hasOutcome||/tool_registry_constructed|assertion|crash|failure|recovery|test_passed|test_failed|validation|build_(?:passed|failed)|editor_(?:ready|failed)|landscape_(?:ready|failed)/i.test(event);
    if(!meaningfulOutcome||event==='python_entry') continue;
    const projection={};
    for(const key of jsonlFields) {
      const item=value[key];
      if(typeof item==='string'||typeof item==='number'||typeof item==='boolean') projection[key]=item;
    }
    let rowDate=null;
    for(const key of ['timestamp_utc','utc','timestamp','created_at','utc_ns','timestamp_ns']) {rowDate=jsonlDate(value[key],key);if(rowDate)break;}
    if(rowDate) {projection.timestamp_utc=rowDate.toISOString();date=rowDate;}
    const signature=JSON.stringify(projection);
    if(!seen.has(signature)) {seen.add(signature);selected.push({line:index+1,value:publicStructure(projection)});}
    if(selected.length>=120) break;
  }
  return {lineCount,selected,date,excluded:null};
}

const relevant = /LogForge|ForgeMCP.{0,80}(?:start|bridge|auth|connect|error|warn|preview|apply|build|version)|\b(?:error|warning|fatal|assertion|exception|validation_failed(?:_\w+)?|passed|failed|succeeded|completed)\b|Automation Test|ExitCode|Result:|tests? (?:passed|failed)|\b(?:Blender|Python|ForgeMCP)\s+(?:v(?:ersion)?\s*)?\d+\.\d+|Using Visual Studio|Using bundled DotNet|Engine Version:|^\s*(?:OK|FAILED|PASS|FAIL)\s*$/i;
const omittedLine = /Telemetry|Analytics|MachineId|EpicAccountId|LoginId|Command Line:|UserName|ComputerName|OAuth|Cookie|access_token|aqProf\.dll|VtuneApi|WinPix/i;

export function extractLog(text) {
  const lines=text.split(/\r?\n/); const hits=[]; const signatures=new Map();
  for(let i=0;i<lines.length;i++) {
    if(!relevant.test(lines[i])||omittedLine.test(lines[i])) continue;
    const safe=sanitizeEvidence(lines[i]);
    const normalized=safe.replace(/^\[(?:20\d{2}[.-]\d{2}[.-]\d{2}[^\]]*|\d{2}:\d{2}:\d{2}[^\]]*)\](?:\[\s*\d+\])?/,'').trim();
    if(!normalized) continue;
    const count=signatures.get(normalized)||0; signatures.set(normalized,count+1);
    if(count===0) hits.push({line:i+1,text:safe.length>1400?`${safe.slice(0,1400)} … [line truncated after 1400 characters]`:safe});
  }
  // Retain every distinct matching diagnostic, including failures in the middle of a run.
  const selected=hits;
  return {lineCount:lines.length,matchingLines:[...signatures.values()].reduce((a,b)=>a+b,0),uniqueLines:hits.length,selected};
}

async function walk(root,prefix='',extensions=['log','json','csv'],skipSymlinks=false) {
  const result=[];
  for(const entry of await readdir(resolve(root,prefix),{withFileTypes:true})) {
    const path=posix.join(prefix,entry.name);
    if(entry.isSymbolicLink()) {if(skipSymlinks)continue;throw Error('Archive contains a linked entry; review required before publication.');}
    if(entry.isDirectory()) result.push(...await walk(root,path,extensions,skipSymlinks));
    else if(entry.isFile() && extensions.includes(posix.extname(path).slice(1).toLowerCase())) result.push(path);
  }
  return result.sort();
}

function counts(values) { return values.reduce((acc,value)=>(acc[String(value)]=(acc[String(value)]||0)+1,acc),Object.create(null)); }
export function csvInventory(text) {
  let quoted=false,cell='',row=[],columns=[],records=0;
  const distributions={};
  function finishRow() {
    row.push(cell);cell='';
    if(!columns.length) columns=row.map(s=>s.replace(/^\uFEFF/,''));
    else if(row.some(Boolean)) {
      records++;
      columns.forEach((key,index)=>{if(/^(?:extension|category|outcome|disposition)$/i.test(key)){const values=distributions[key]??=Object.create(null);const value=sanitizeEvidence(row[index]||'Unspecified');values[value]=(values[value]||0)+1;}});
    }
    row=[];
  }
  for(let i=0;i<text.length;i++) {
    const ch=text[i];
    if(ch==='"') {if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
    else if(ch===','&&!quoted){row.push(cell);cell='';}
    else if((ch==='\n'||ch==='\r')&&!quoted){finishRow();if(ch==='\r'&&text[i+1]==='\n')i++;}
    else cell+=ch;
  }
  if(quoted)throw Error('Malformed quoted CSV field');
  if(cell||row.length)finishRow();
  return {columns,records,distributions};
}
function jsonSummary(value) {
  if(Array.isArray(value)) return {type:'array',items:value.length};
  if(!value || typeof value!=='object') return {type:typeof value};
  return Object.fromEntries(Object.entries(value).map(([key,v])=>{
    if(Array.isArray(v)) {
      const objects=v.filter(x=>x&&typeof x==='object');
      return [key,{items:v.length,fields:objects[0]?Object.keys(objects[0]):[],recordedStatuses:counts(objects.map(x=>x.status??x.outcome??x.disposition??'Unspecified')),
        ...Object.fromEntries(['category','subsystem','forgemcp_version','development_phase'].filter(field=>objects.some(x=>x[field])).map(field=>[field,counts(objects.map(x=>x[field]||'Unspecified'))]))}];
    }
    if(v&&typeof v==='object') return [key,{fields:Object.keys(v).length,preview:publicStructure(v)}];
    return [key,publicStructure(v)];
  }));
}

function sourceDate(path,text,modifiedAt=null) {
  const declared=evidenceDate(text,'');
  if(declared.date) return declared;
  const stamp=text.match(/(?:^|\n)\[?(20\d{2})[-.](\d{2})[-.](\d{2})/);
  if(stamp) {const found=evidenceDate(`Date: ${stamp[1]}-${stamp[2]}-${stamp[3]}`,'');if(found.date)return {...found,dateBasis:'Log timestamp',dateConfidence:'verified'};}
  const named=evidenceDate('',path);
  if(named.date)return named;
  const directory=path.match(/(?:^|[^\d])(20\d{2})(\d{2})(\d{2})(?=[^\d]|$)/);
  if(directory) {const found=evidenceDate(`Date: ${directory[1]}-${directory[2]}-${directory[3]}`,'');if(found.date)return {...found,dateBasis:'Archive path date',dateConfidence:'inferred'};}
  return evidenceDate('',path,modifiedAt);
}

function decodeXml(value) {
  return String(value).replace(/&(?:amp|lt|gt|quot|apos);/g,entity=>({
    '&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",
  })[entity]);
}

/** Read only a safe whitelist from Unreal's crash-context XML. */
export function extractCrashContext(text) {
  const read=key=>{
    const match=String(text).match(new RegExp(`<${key}>([\\s\\S]*?)</${key}>`,'i'));
    return match?sanitizeEvidence(decodeXml(match[1].replace(/<[^>]+>/g,' ').trim())):'';
  };
  let occurredAt=null;
  try {
    const ticks=BigInt(read('TimeOfCrash'));
    const unixTicks=ticks-621355968000000000n;
    const milliseconds=Number(unixTicks/10000n);
    const date=new Date(milliseconds);
    if(Number.isFinite(date.valueOf())&&date.getUTCFullYear()>=2000)occurredAt=date.toISOString();
  } catch { occurredAt=null; }
  return {
    crashType:read('CrashType'),errorMessage:read('ErrorMessage').slice(0,500),
    engineVersion:read('EngineVersion'),isAssert:read('IsAssert'),isEnsure:read('IsEnsure'),occurredAt,
  };
}

/** Summarize the bounded Stage 2C save excerpt without exposing package IDs or local paths. */
export function summarizeManualSaveTrace(text) {
  const completion=String(text).match(/^\[(20\d{2})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}):(\d{3})\]\[\s*\d+\]LogFileHelpers: InternalPromptForCheckoutAndSave took ([\d.]+) sec/m);
  if(!completion)return null;
  const [,year,month,day,hour,minute,second,millisecond,elapsedSeconds]=completion;
  const validation=String(text).match(/LogContentValidation: Display: Starting to validate (\d+) assets/i);
  return {
    date:`${year}-${month}-${day}`,time:`${hour}:${minute}:${second}.${millisecond}`,
    packageMoves:(String(text).match(/LogSavePackage: Moving output files for package:/g)||[]).length,
    validationAssets:validation?Number(validation[1]):null,elapsedSeconds:Number(elapsedSeconds),
  };
}

export async function reviewEvidence(root,{extensions=['log','json','csv'],skipSymlinks=false}={}) {
  const paths=await walk(root,'',extensions,skipSymlinks); const documents=[]; const entries=[]; const canonical=new Map();
  for(const path of paths) {
    const absolute=resolve(root,path);const [bytes,details]=await Promise.all([readFile(absolute),stat(absolute)]); const hash=sha(bytes); const extension=posix.extname(path).slice(1).toLowerCase();
    const item={path:sanitizeEvidence(path),sha256:hash,bytes:bytes.length,type:extension,category:'',disposition:'',recordPath:null};
    entries.push(item);
    if(!bytes.length || !bytes.toString('utf8').trim()) {item.disposition='Empty file';item.category='Empty evidence';continue;}
    if(extension==='jsonl'&&privateJsonlPath.test(path)) {item.disposition='Excluded private or non-event JSONL';item.category='Runtime identity and transcript artifacts';continue;}
    if(canonical.has(hash)) {const first=canonical.get(hash);item.disposition='Byte-identical duplicate';item.category=first.category;item.recordPath=first.recordPath;continue;}
    canonical.set(hash,item);
    const text=bytes.toString('utf8').replace(/^\uFEFF/,'');
    const name=posix.basename(path);const inventory=/catalog|manifest|inventory/i.test(name)||extension==='csv';
    let date=sourceDate(path,text,inventory?null:details.mtime);
    const title=name.replace(/\.(log|json|jsonl|csv|txt|out|sarif|runtime-xml|ini|sha256)$/i,'').replaceAll('_',' ');
    let markdown=''; let format='';
    if(extension==='jsonl') {
      const log=extractJsonLines(text,path);
      if(log.excluded) {item.disposition='Excluded private or non-event JSONL';item.category='Runtime identity and transcript artifacts';continue;}
      if(!log.selected.length) {item.disposition='No selected development event';item.category=classifyEvidence(path);continue;}
      if(log.date) date={date:log.date.toISOString().slice(0,10),dateBasis:'JSONL event timestamp',dateConfidence:'verified'};
      item.category=classifyEvidence(path,JSON.stringify(log.selected));item.disposition='Published JSONL event summary';format='JSONL event summary';
      markdown=`# ${title}\n\n## Evidence boundary\n\nHistorical JSONL event summary. The source contains ${log.lineCount} non-empty JSONL rows; ${log.selected.length} distinct engineering outcome rows are projected. Process identifiers, correlation values, request/response bodies, and runtime identity material are omitted. This record documents the source event only and does not establish current readiness.\n\n## Recorded events\n\n`;
      documents.push({path,title,category:item.category,format,date:date.date,dateBasis:date.dateBasis,dateConfidence:date.dateConfidence,sha256:hash,markdown,jsonlLines:log.selected});
    } else if(extension==='txt') {
      if(/manual_save_log_excerpt\.txt$/i.test(path)) {
        const trace=summarizeManualSaveTrace(text);
        if(!trace) {item.disposition='No selected development event';item.category='Landscape diagnostics';continue;}
        const summary=`The Unreal save trace records ${trace.packageMoves} package output moves; the save prompt completed in ${trace.elapsedSeconds} seconds and began validation of ${trace.validationAssets??'an unspecified number of'} assets. The source excerpt contains no validation completion result.`;
        const relatedSourcePath=path.replace(/manual_save_log_excerpt\.txt$/i,'stage2c_report_after_manual_save.md');
        markdown=`# Stage 2C manual save trace\n\n## Recorded evidence\n\nThe Unreal log records ${trace.packageMoves} package output moves for the landscape save. The save prompt completed at ${trace.date} ${trace.time} in ${trace.elapsedSeconds} seconds. The excerpt then starts validation for ${trace.validationAssets??'an unspecified number of'} assets; it does not record validation completion.\n\nThis is supporting evidence for the existing Stage 2C save report, not a separate development event. The log does not identify a timezone.\n`;
        item.category='Landscape diagnostics';item.disposition='Published corroborating evidence summary';format='Save trace summary';
        documents.push({path,title:'Stage 2C manual save trace',category:item.category,format,date:trace.date,dateBasis:'Log timestamp',dateConfidence:'verified',time:trace.time,summary,developmentStatus:'Corroborating evidence',chronologyEligible:false,relatedSourcePath,markdown});
      } else {
        item.category=/native_save_source_evidence/i.test(name)?'Licensed source excerpt':'Recovery checkpoint evidence';
        item.disposition=/native_save_source_evidence/i.test(name)?'Excluded licensed source excerpt':/editor_settings_diff/i.test(name)?'Excluded environment-specific settings':/DDCKey-Editor/i.test(name)?'Excluded generated cache key':/LICENSE\.txt$/i.test(name)?'Excluded license text':'No selected development event';
        continue;
      }
    } else if(extension==='runtime-xml') {
      const crash=extractCrashContext(text);
      if(!crash.occurredAt||!crash.crashType) {item.disposition='No selected development event';item.category='Failure and recovery';continue;}
      const occurredAt=crash.occurredAt.replace(/Z$/,'');
      const snapshot=path.split('/')[0].replaceAll('_',' ');
      item.category='Failure and recovery';item.disposition='Published corroborating crash-context summary';format='Crash-context summary';
      const relatedLogPath=path.replace(/CrashContext\.runtime-xml$/i,'UnrealEditor.log');
      const summary=`Corroborating ${crash.crashType.toLowerCase()} crash context for the already indexed UnrealEditor log; the failure names an unloaded LevelEditor module.`;
      markdown=`# ${snapshot} crash context\n\n## Recorded failure\n\n- Recorded time: ${occurredAt} (the XML does not identify a timezone)\n- Crash type: ${crash.crashType}\n- Engine version: ${crash.engineVersion||'not recorded'}\n- Assert: ${crash.isAssert||'not recorded'}; ensure: ${crash.isEnsure||'not recorded'}\n- Error: ${crash.errorMessage||'No error message recorded'}\n\nThis crash-context file corroborates the existing UnrealEditor log entry. It adds the crash classification and source timestamp; it is not a separate timeline event.\n`;
      documents.push({path,title:`${snapshot} crash context`,category:item.category,format,date:occurredAt.slice(0,10),dateBasis:'Crash timestamp',dateConfidence:'verified',time:occurredAt.slice(11,23),summary,developmentStatus:'Corroborating evidence',chronologyEligible:false,relatedLogPath,markdown});
    } else if(extension==='ini') {
      item.category='Unreal configuration snapshots';item.disposition='Configuration snapshot; no discrete development event';continue;
    } else if(extension==='sha256') {
      item.category='Provenance and inventory';item.disposition='Integrity manifest accounted; not a development event';continue;
    } else if(extension==='log'||extension==='out') {
      const log=extractLog(text);item.category=classifyEvidence(path,log.selected.map(v=>v.text).join('\n'));
      if(!log.selected.length) {item.disposition='No selected engineering signal';continue;}
      item.disposition='Published diagnostic excerpt';format='Log excerpt';
      markdown=`# ${title}\n\n## Evidence boundary\n\nHistorical diagnostic excerpt. A matching log line is not an independently verified pass, failure verdict, or current runtime acceptance. Original source has ${log.lineCount} lines; ${log.matchingLines} matching diagnostic lines; ${log.uniqueLines} distinct diagnostic lines. This reading view selects ${log.selected.length} distinct lines, with original line numbers. Repeated messages, telemetry, workstation paths, and credential values are omitted or redacted.\n\n## Recorded diagnostics\n\n`+log.selected.map(v=>`L${v.line}: ${v.text}`).join('\n');
      // Code fencing is added by the renderer; diagnostic strings never become Markdown instructions.
      documents.push({path,title,category:item.category,format,date:date.date,dateBasis:date.dateBasis,dateConfidence:date.dateConfidence,sha256:hash,markdown,logLines:log.selected,logIntro:markdown.split('## Recorded diagnostics')[0]});
    } else if(extension==='json'||extension==='sarif') {
      const value=JSON.parse(text); const large=bytes.length>250000;
      if(extension==='sarif') {
        const results=(value.runs||[]).flatMap(run=>run.results||[]);
        item.category='Builds and deployment';
        if(!results.length) {item.disposition='No selected development event';continue;}
        const findings=results.slice(0,80).map(result=>({ruleId:sanitizeEvidence(result.ruleId||''),level:sanitizeEvidence(result.level||'unspecified'),message:sanitizeEvidence(result.message?.text||result.message?.markdown||'').slice(0,500)}));
        item.disposition='Published structured evidence';format='SARIF diagnostic summary';
        markdown=`# ${title}\n\n## Evidence boundary\n\nHistorical static-analysis results. This summary includes diagnostic rule, severity, and sanitized message only; machine paths and environment identifiers are omitted.\n\n## Findings\n\n${findings.length} result(s) are summarized from ${value.runs?.length||0} SARIF run(s).`;
        documents.push({path,title,category:item.category,format,date:date.date,dateBasis:date.dateBasis,dateConfidence:date.dateConfidence,sha256:hash,markdown,structured:findings});
        item.recordPath=path;
        continue;
      }
      for(const key of ['timestamp','deployment_utc','created_utc','checked_at']) {
        const stamp=value?.[key];
        if(typeof stamp==='string' && /^20\d{2}-\d{2}-\d{2}/.test(stamp)) {const declared=evidenceDate(`Date: ${stamp.slice(0,10)}`,'');if(declared.date){date={...declared,dateBasis:'JSON timestamp'};break;}}
      }
      item.category=/Catalog|Manifest/i.test(name)?'Provenance and inventory':classifyEvidence(path);
      item.disposition=large?'Published structured summary':'Published structured evidence';format=large?'JSON summary':'JSON evidence';
      const structure=large?jsonSummary(value):publicStructure(value);
      markdown=`# ${title}\n\n## Evidence boundary\n\nHistorical structured evidence from a JSON source. Recorded status values remain source claims; no current Editor, reload, client-tool, or performance acceptance is inferred. ${large?'Large file: the public view summarizes collection sizes, schemas, recorded status counts, and metadata.':'The public view preserves bounded technical structure.'} Arrays show at most 80 entries, object views at most 160 fields, nested detail at most 12 levels, and long strings at most 1200 characters. Credentials, local paths, and embedded media are redacted.\n\n## Structured record\n\n`;
      documents.push({path,title,category:item.category,format,date:date.date,dateBasis:date.dateBasis,dateConfidence:date.dateConfidence,sha256:hash,markdown,structured:structure});
    } else {
      // CSV is the duplicate inventory representation, so publish its schema and historical totals.
      const inventory=csvInventory(text);
      item.category='Provenance and inventory';item.disposition='Published catalog summary';format='CSV summary';
      markdown=`# ${title} — CSV inventory\n\n## Evidence boundary\n\nHistorical inventory, not a current website coverage count. This source has ${inventory.records} parsed data records (excluding its header). The matching JSON master catalog is the structured counterpart. The raw CSV is not republished because it repeats internal project paths and catalog data.\n\n## Catalog fields\n\n${inventory.columns.map(s=>`- ${sanitizeEvidence(s)}`).join('\n')}\n\n## Recorded inventory distributions\n\n`;
      documents.push({path,title:`${title} — CSV inventory`,category:item.category,format,date:date.date,dateBasis:date.dateBasis,dateConfidence:date.dateConfidence,sha256:hash,markdown,structured:inventory.distributions});
    }
    item.recordPath=path;
  }
  const summary={reviewed:entries.length,byType:counts(entries.map(e=>e.type)),byDisposition:counts(entries.map(e=>e.disposition)),publishedSourceRecords:documents.length,categories:counts(documents.map(d=>d.category))};
  return {documents,audit:{snapshot:'2026-10-26',method:'Read-only source scan; SHA-256 duplicate consolidation; bounded sanitized technical derivatives. No runtime probes.',summary,entries}};
}
