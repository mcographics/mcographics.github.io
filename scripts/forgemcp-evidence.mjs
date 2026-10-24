import {readdir,readFile} from 'node:fs/promises';
import {resolve,posix} from 'node:path';
import {createHash} from 'node:crypto';
import {evidenceDate} from '../app/projects/forgemcp/encyclopedia/archive-order.mjs';

const sha = bytes=>createHash('sha256').update(bytes).digest('hex');
const secretKey = /(?:token|secret|password|credential|api[_-]?key|authorization|confirmation|grant_id|preview_id|editing_session_id|nonce|cookie|signature|csrf)/i;

export function sanitizeEvidence(text) {
  return String(text)
    .replace(/-----BEGIN [^-]*PRIVATE KEY-----[\s\S]*?-----END [^-]*PRIVATE KEY-----/g,'[redacted private key]')
    .replace(/\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)\b/g,'[redacted credential]')
    .replace(/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/-]+=*/gi,'$1 [redacted]')
    .replace(/https?:\/\/[^\s<>"'`)\]]+/g,raw=>{try{const u=new URL(raw);u.username='';u.password='';u.search='';u.hash='';return u.href;}catch{return '[URL omitted]';}})
    .replace(/(--?(?:[\w-]{0,80}(?:token|secret|password|credential)|api[_-]?key|authorization|authorization[-_]?id|grant[-_]?id|preview[-_]?id|editing[-_]?session[-_]?id)(?:=|\s+))(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\s]+)/gi,'$1[redacted]')
    .replace(/((?:(?:\\*["'])?\b(?:[\w-]{0,80}(?:token|secret|password|credential|api_key)|authorization|authorization[-_]?id|confirmation|grant[-_]?id|preview[-_]?id|editing[-_]?session[-_]?id|nonce|cookie|signature|csrf)(?:\\*["'])?)\s*[:=]\s*)(?:\\+["'][^\r\n]*\\+["']|"[^"\r\n]*"|'[^'\r\n]*'|[^\s,}\r\n]+)/gi,'$1"[redacted]"')
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
    (secretKey.test(key)||(/authorization|grant|editing_session/i.test(context)&&key==='id')) && (typeof v==='string'||Array.isArray(v))
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

async function walk(root,prefix='') {
  const result=[];
  for(const entry of await readdir(resolve(root,prefix),{withFileTypes:true})) {
    const path=posix.join(prefix,entry.name);
    if(entry.isSymbolicLink()) throw Error('Archive contains a linked entry; review required before publication.');
    if(entry.isDirectory()) result.push(...await walk(root,path));
    else if(entry.isFile() && /\.(?:log|json|csv)$/i.test(path)) result.push(path);
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

function sourceDate(path,text) {
  const declared=evidenceDate(text,path);
  if(declared.date) return declared;
  const stamp=text.match(/(?:^|\n)\[?(20\d{2})[-.](\d{2})[-.](\d{2})/);
  if(stamp) {const found=evidenceDate(`Date: ${stamp[1]}-${stamp[2]}-${stamp[3]}`,'');if(found.date)return {...found,dateBasis:'Log timestamp'};}
  const directory=path.match(/(?:^|[^\d])(20\d{2})(\d{2})(\d{2})(?=[^\d]|$)/);
  if(directory) {const found=evidenceDate(`Date: ${directory[1]}-${directory[2]}-${directory[3]}`,'');if(found.date)return {...found,dateBasis:'Archive path date'};}
  return declared;
}

export async function reviewEvidence(root) {
  const paths=await walk(root); const documents=[]; const entries=[]; const canonical=new Map();
  for(const path of paths) {
    const bytes=await readFile(resolve(root,path)); const hash=sha(bytes); const extension=posix.extname(path).slice(1).toLowerCase();
    const item={path:sanitizeEvidence(path),sha256:hash,bytes:bytes.length,type:extension,category:'',disposition:'',recordPath:null};
    entries.push(item);
    if(!bytes.length || !bytes.toString('utf8').trim()) {item.disposition='Empty file';item.category='Empty evidence';continue;}
    if(canonical.has(hash)) {const first=canonical.get(hash);item.disposition='Byte-identical duplicate';item.category=first.category;item.recordPath=first.recordPath;continue;}
    canonical.set(hash,item);
    const text=bytes.toString('utf8').replace(/^\uFEFF/,''); let date=sourceDate(path,text);
    const name=posix.basename(path); const title=name.replace(/\.(log|json|csv)$/i,'').replaceAll('_',' ');
    let markdown=''; let format='';
    if(extension==='log') {
      const log=extractLog(text);item.category=classifyEvidence(path,log.selected.map(v=>v.text).join('\n'));
      if(!log.selected.length) {item.disposition='No selected engineering signal';continue;}
      item.disposition='Published diagnostic excerpt';format='Log excerpt';
      markdown=`# ${title}\n\n## Evidence boundary\n\nHistorical diagnostic excerpt. A matching log line is not an independently verified pass, failure verdict, or current runtime acceptance. Original source has ${log.lineCount} lines; ${log.matchingLines} matching diagnostic lines; ${log.uniqueLines} distinct diagnostic lines. This reading view selects ${log.selected.length} distinct lines, with original line numbers. Repeated messages, telemetry, workstation paths, and credential values are omitted or redacted.\n\n## Recorded diagnostics\n\n`+log.selected.map(v=>`L${v.line}: ${v.text}`).join('\n');
      // Code fencing is added by the renderer; diagnostic strings never become Markdown instructions.
      documents.push({path,title,category:item.category,format,date:date.date,dateBasis:date.dateBasis,sha256:hash,markdown,logLines:log.selected,logIntro:markdown.split('## Recorded diagnostics')[0]});
    } else if(extension==='json') {
      const value=JSON.parse(text); const large=bytes.length>250000;
      for(const key of ['timestamp','deployment_utc','created_utc','checked_at']) {
        const stamp=value?.[key];
        if(typeof stamp==='string' && /^20\d{2}-\d{2}-\d{2}/.test(stamp)) {const declared=evidenceDate(`Date: ${stamp.slice(0,10)}`,'');if(declared.date){date={...declared,dateBasis:'JSON timestamp'};break;}}
      }
      item.category=/Catalog|Manifest/i.test(name)?'Provenance and inventory':classifyEvidence(path);
      item.disposition=large?'Published structured summary':'Published structured evidence';format=large?'JSON summary':'JSON evidence';
      const structure=large?jsonSummary(value):publicStructure(value);
      markdown=`# ${title}\n\n## Evidence boundary\n\nHistorical structured evidence from a JSON source. Recorded status values remain source claims; no current Editor, reload, client-tool, or performance acceptance is inferred. ${large?'Large file: the public view summarizes collection sizes, schemas, recorded status counts, and metadata.':'The public view preserves bounded technical structure.'} Arrays show at most 80 entries, object views at most 160 fields, nested detail at most 12 levels, and long strings at most 1200 characters. Credentials, local paths, and embedded media are redacted.\n\n## Structured record\n\n`;
      documents.push({path,title,category:item.category,format,date:date.date,dateBasis:date.dateBasis,sha256:hash,markdown,structured:structure});
    } else {
      // CSV is the duplicate inventory representation, so publish its schema and historical totals.
      const inventory=csvInventory(text);
      item.category='Provenance and inventory';item.disposition='Published catalog summary';format='CSV summary';
      markdown=`# ${title} — CSV inventory\n\n## Evidence boundary\n\nHistorical inventory, not a current website coverage count. This source has ${inventory.records} parsed data records (excluding its header). The matching JSON master catalog is the structured counterpart. The raw CSV is not republished because it repeats internal project paths and catalog data.\n\n## Catalog fields\n\n${inventory.columns.map(s=>`- ${sanitizeEvidence(s)}`).join('\n')}\n\n## Recorded inventory distributions\n\n`;
      documents.push({path,title:`${title} — CSV inventory`,category:item.category,format,date:date.date,dateBasis:date.dateBasis,sha256:hash,markdown,structured:inventory.distributions});
    }
    item.recordPath=path;
  }
  const summary={reviewed:entries.length,byType:counts(entries.map(e=>e.type)),byDisposition:counts(entries.map(e=>e.disposition)),publishedSourceRecords:documents.length,categories:counts(documents.map(d=>d.category))};
  return {documents,audit:{snapshot:'2026-10-24',method:'Read-only source scan; SHA-256 duplicate consolidation; bounded sanitized technical derivatives. No runtime probes.',summary,entries}};
}
