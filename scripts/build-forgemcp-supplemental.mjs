import {readdir,readFile,writeFile,stat} from 'node:fs/promises';
import {resolve,basename,posix} from 'node:path';
import {createHash} from 'node:crypto';
import {Marked} from 'marked';
import {documentMetadata,evidenceDate} from '../app/projects/forgemcp/encyclopedia/archive-order.mjs';
import {reviewEvidence,sanitizeEvidence} from './forgemcp-evidence.mjs';

const roots=process.argv.slice(2).map(root=>resolve(root));
if(!roots.length) throw Error('Pass the recovery checkpoint directories and Saved directory explicitly.');
const catalogPath='app/projects/forgemcp/encyclopedia/catalog.json';
const recordsDirectory='public/projects/forgemcp/encyclopedia/records';
const manifestPath='public/projects/forgemcp/encyclopedia/supplemental-source-review.json';
const reviewPath='Publication_Review/Supplemental_Development_Source_Review.md';
const catalog=JSON.parse(await readFile(catalogPath,'utf8'));
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const recordId=path=>createHash('sha256').update(path).digest('hex').slice(0,16);
const generatedRoots=new Set(['ForgeMCP_Recovery_Checkpoints','09_Recovery_and_Checkpoints','Saved']);
const generatedReviewId=recordId(reviewPath);
const generatedComparisonId=recordId('Publication_Review/Landscape_Checkpoint_Code_Snapshot_Comparison.md');
catalog.records=catalog.records.filter(record=>record.id!==generatedReviewId&&record.id!==generatedComparisonId&&!generatedRoots.has((record.path||'').split('/')[0]));
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const safePath=path=>sanitizeEvidence(path)
  .replace(/(ForgeMCPBootstrap-)\d+(\.jsonl)/gi,'$1[process]$2')
  .replace(/\b[a-f0-9]{32}\b/gi,'[run-id]');

async function walk(directory,rootName,relativePath='',symlinks=[],inventory=null) {
  const files=[];
  for(const entry of await readdir(resolve(directory,relativePath),{withFileTypes:true})) {
    const path=posix.join(relativePath,entry.name);
    if(entry.isSymbolicLink()) {if(inventory)inventory.symlinks++;symlinks.push({sourceRoot:rootName,path:safePath(`${rootName}/${path}`)});continue;}
    if(entry.isDirectory()) files.push(...await walk(directory,rootName,path,symlinks,inventory));
    else if(entry.isFile()) {
      if(inventory) {
        inventory.regularFiles++;
        const extension=posix.extname(path).slice(1).toLowerCase()||'(none)';
        inventory.byExtension[extension]=(inventory.byExtension[extension]||0)+1;
        if(['cpp','h','hpp','inl','cs','py','js','css','ush'].includes(extension))inventory.sourceSnapshotPaths.push(resolve(directory,path));
      }
      if(entry.name.toLowerCase().endsWith('.md')) files.push(path);
    }
  }
  return files;
}

function renderMarkdown(markdown,sourcePath,idBySourcePath,baseRecordIds) {
  markdown=markdown.replace(/\]\(\[local path\][^)\r\n]*/gi,'](unindexed-local-source)');
  const headings=[];
  const parser=new Marked({gfm:true,renderer:{
    html({text}){return escape(text);},
    image({text}){return `<span class="enc-unavailable">[Image: ${escape(text)}]</span>`;},
    heading({tokens,depth}){const label=this.parser.parseInline(tokens);const id=`section-${headings.length}`;headings.push({id,text:label.replace(/<[^>]+>/g,''),depth});return `<h${depth} id="${id}">${label}</h${depth}>`;},
    link({href,tokens}){
      const label=this.parser.parseInline(tokens);
      if(/^https:\/\//i.test(href))return `<a href="${escape(href)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
      if(/^\?record=[a-f0-9]{16}$/i.test(href))return `<a href="${escape(href)}">${label}</a>`;
      if(href.startsWith('#'))return `<span>${label}</span>`;
      const target=posix.normalize(posix.join(posix.dirname(sourcePath),href.split('#')[0])).replace(/^15_Saved\//,'14_Saved/');
      const id=idBySourcePath.get(target)||baseRecordIds.get(target.replace(/^ForgeMCP_Encyclopedia\//,''));
      return id?`<a href="?record=${id}">${label}</a>`:`<span class="enc-unavailable" title="Referenced file is outside this indexed snapshot">${label} [not indexed]</span>`;
    },
  }});
  return {html:parser.parse(markdown),headings};
}

const baseRecordIds=new Map(catalog.records.map(record=>[record.path,record.id]));
const knownHash=new Map(catalog.records.map(record=>[record.sha256,{path:record.path,id:record.id,category:record.category}]));
const candidates=[];const manifestEntries=[];const sourcePathToId=new Map();
let checkpointInventory=null;
for(const root of roots) {
  const rootName=basename(root);
  const skippedLinks=[];
  const inventory=rootName==='ForgeMCP_Recovery_Checkpoints'?{root:resolve(root),regularFiles:0,symlinks:0,byExtension:Object.create(null),sourceSnapshotPaths:[]}:null;
  const mdPaths=await walk(root,rootName,'',skippedLinks,inventory);
  if(inventory)checkpointInventory=inventory;
  const extensions=rootName==='Saved'?['jsonl']:['log','json','csv','jsonl','txt','out','sarif','runtime-xml','ini','sha256'];
  const review=await reviewEvidence(root,{extensions,skipSymlinks:true});
  const localDocMap=new Map(review.documents.map(document=>[document.path,document]));
  const sourceItems=[];
  for(const path of mdPaths) {
    const absolute=resolve(root,path);const bytes=await readFile(absolute);
    sourceItems.push({kind:'markdown',root,rootName,path,publicPath:safePath(`${rootName}/${path}`),absolute,bytes,sha256:digest(bytes),category:'Recovery checkpoints'});
  }
  for(const entry of review.audit.entries) {
    const document=localDocMap.get(entry.recordPath||entry.path)||localDocMap.get(entry.path);
    sourceItems.push({kind:'evidence',root,rootName,path:entry.path,publicPath:safePath(`${rootName}/${entry.path}`),absolute:resolve(root,entry.path),sha256:entry.sha256,bytes:entry.bytes,category:entry.category,disposition:entry.disposition,entry,document});
  }
  sourceItems.sort((a,b)=>a.path.localeCompare(b.path,'en',{numeric:true,sensitivity:'base'}));
  for(const item of sourceItems) {
    const id=recordId(`${item.rootName}/${item.path}`);
    item.id=id;
    const recordable=item.kind==='markdown'||Boolean(item.document);
    const existing=knownHash.get(item.sha256);
    let disposition=item.disposition||'Published Markdown derivative';
    let recordPath=recordable?item.publicPath:null;
    let canonicalId=recordable?id:null;
    if(existing) {
      disposition='Byte-identical duplicate';
      item.category=existing.category;
      recordPath=existing.path;
      canonicalId=existing.id;
    } else if(recordable) {
      knownHash.set(item.sha256,{path:item.publicPath,id,category:item.category});
      candidates.push(item);
    }
    if(canonicalId)sourcePathToId.set(`${item.rootName}/${item.path}`,canonicalId);
    item.disposition=disposition;
    item.recordPath=recordPath;
    item.recordId=canonicalId;
    manifestEntries.push({sourceRoot:item.rootName,path:item.publicPath,sha256:item.sha256,bytes:item.kind==='markdown'?item.bytes.length:item.bytes,type:item.kind==='markdown'?'md':posix.extname(item.path).slice(1).toLowerCase(),category:item.category||'Uncategorized',disposition,recordId:canonicalId});
  }
  for(const link of skippedLinks)manifestEntries.push({sourceRoot:link.sourceRoot,path:link.path,sha256:null,bytes:null,type:'symlink',category:'Skipped filesystem link',disposition:'Skipped symlink target; not traversed',recordId:null});
}

const idsForRender=new Map([...baseRecordIds,...sourcePathToId]);
const supplementalRecords=[];
for(const item of candidates) {
  if(item.kind==='markdown') {
    const raw=item.bytes.toString('utf8');
    const recordPath=`${item.rootName}/${item.path}`;
    const parsedDate=evidenceDate(raw,recordPath);
    const eventDocument=/report|evidence|milestone|validation|acceptance|execution|test|result|failure|crash|save|recovery|diagnostic|preflight|audit|plan|baseline|checkpoint_verification/i.test(basename(item.path));
    const date=parsedDate.date?parsedDate:eventDocument?evidenceDate(raw,recordPath,(await stat(item.absolute)).mtime):parsedDate;
    let markdown=sanitizeEvidence(raw);const metadata=documentMetadata(markdown);
    markdown=markdown.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/,'');
    if(/stage2c_report_after_manual_save\.md$/i.test(item.path)) {
      const tracePath=posix.join(posix.dirname(item.path),'manual_save_log_excerpt.txt');
      const traceId=sourcePathToId.get(`${item.rootName}/${tracePath}`);
      if(traceId)markdown+=`\n\n## Supporting log evidence\n\n[Read the sanitized manual-save trace summary](?record=${traceId})`;
    }
    const title=sanitizeEvidence(metadata.title||markdown.match(/^#\s+(.+)$/m)?.[1]||basename(item.path,'.md').replaceAll('_',' '));
    const rendered=renderMarkdown(markdown,recordPath,idsForRender,baseRecordIds);
    const record={id:item.id,title,path:item.publicPath,category:item.category,format:'Markdown derivative',integrityLabel:'SHA-256 of original source bytes',status:'Archived',developmentStatus:sanitizeEvidence(metadata.status)||null,summary:sanitizeEvidence(metadata.summary)||null,supportingReferences:metadata.evidence.map(sanitizeEvidence),time:metadata.time||null,timezone:metadata.timezone||null,date:date.date,dateBasis:date.dateBasis,dateConfidence:date.dateConfidence,sha256:item.sha256,excerpt:sanitizeEvidence(markdown.replace(/[#*`|[\]]/g,'').replace(/\s+/g,' ').slice(0,220))};
    supplementalRecords.push({record,payload:{...record,...rendered}});
  } else {
    const document=item.document;
    if(!document)continue;
    const headings=[];
    const parser=new Marked({gfm:true,renderer:{html({text}){return escape(text);},image({text}){return escape(text);},heading({tokens,depth}){const label=this.parser.parseInline(tokens);const id=`section-${headings.length}`;headings.push({id,text:label.replace(/<[^>]+>/g,''),depth});return `<h${depth} id="${id}">${label}</h${depth}>`;},link({href,tokens}){const label=this.parser.parseInline(tokens);return /^\?record=[a-f0-9]{16}$/i.test(href)?`<a href="${escape(href)}">${label}</a>`:label;}}});
    let markdown=sanitizeEvidence(document.markdown||'');
    for(const [relatedPath,label] of [[document.relatedSourcePath,'Related Stage 2C report'],[document.relatedLogPath,'Corresponding UnrealEditor log']]) {
      if(!relatedPath)continue;
      const relatedId=sourcePathToId.get(`${item.rootName}/${relatedPath}`)||baseRecordIds.get(safePath(`${item.rootName}/${relatedPath}`));
      if(relatedId)markdown+=`\n\n[${label}](?record=${relatedId})`;
    }
    let html=parser.parse(markdown);
    if(document.logLines||document.jsonlLines) {
      const anchor=document.jsonlLines?'recorded-events':'recorded-diagnostics';
      const label=document.jsonlLines?'Recorded events':'Recorded diagnostics';
      headings.push({id:anchor,text:label,depth:2});
      const rows=document.jsonlLines?document.jsonlLines.map(line=>`L${line.line}: ${JSON.stringify(line.value)}`):document.logLines.map(line=>`L${line.line}: ${line.text}`);
      html+=`<h2 id="${anchor}">${label}</h2><pre><code>${escape(rows.join('\n'))}</code></pre>`;
    }
    if(document.structured)html+=`<pre><code>${escape(JSON.stringify(document.structured,null,2))}</code></pre>`;
    const date={date:document.date,dateBasis:document.dateBasis,dateConfidence:document.dateConfidence||'undated'};
    const record={id:item.id,title:safePath(document.title),path:item.publicPath,category:document.category,format:document.format,integrityLabel:'SHA-256 of original source bytes',status:'Archived',developmentStatus:sanitizeEvidence(document.developmentStatus)||null,summary:sanitizeEvidence(document.summary)||null,supportingReferences:[],date:date.date,dateBasis:date.dateBasis,dateConfidence:date.dateConfidence,time:document.time||null,timezone:document.timezone||null,chronologyEligible:document.chronologyEligible===false?false:true,sha256:item.sha256,excerpt:`${document.format} · ${document.category}. Historical source evidence with bounded, sanitized detail.`};
    supplementalRecords.push({record,payload:{...record,html,headings}});
  }
}

let sourceSnapshotAudit=null;
if(checkpointInventory) {
  const groups=new Map();
  for(const absolute of checkpointInventory.sourceSnapshotPaths) {
    const bytes=await readFile(absolute);const unix=absolute.replaceAll('\\','/');const prefix='/plugins/forge/';
    const index=unix.toLowerCase().lastIndexOf(prefix);const normalized=index>=0?unix.slice(index+prefix.length):safePath(unix.slice(checkpointInventory.root.length+1));
    const versions=groups.get(normalized)||new Map();const hash=digest(bytes);const copies=versions.get(hash)||[];
    copies.push(safePath(unix.slice(checkpointInventory.root.length+1)));versions.set(hash,copies);groups.set(normalized,versions);
  }
  const variants=[...groups].filter(([,versions])=>versions.size>1).map(([path,versions])=>({path,versions:[...versions].map(([sha256,copies])=>({sha256,copies:copies.length}))}));
  sourceSnapshotAudit={files:checkpointInventory.sourceSnapshotPaths.length,logicalPaths:groups.size,variantPaths:variants.length,identicalCopies:checkpointInventory.sourceSnapshotPaths.length-[...groups.values()].reduce((n,versions)=>n+versions.size,0),variants};
  if(variants.length) {
    const title='Landscape checkpoint source snapshots — variant comparison';
    const relatedReports=[
      catalog.records.find(r=>r.path.includes('ForgeMCP_Stage2ER_IsolatedEditor_Startup_Forensics')),
      catalog.records.find(r=>r.title.includes('Stage 2E Independent Reload, Approved Attempt')),
    ].filter(Boolean);
    const relatedLinks=relatedReports.map(r=>`- [${r.title}](?record=${r.id})`).join('\n');
    const markdown=`# ${title}

## Scope and result

Read-only hash comparison of ${sourceSnapshotAudit.files} C++, header, inline, C#, Python, JavaScript, CSS, and shader-source files across ${sourceSnapshotAudit.logicalPaths} normalized plugin source paths. ${sourceSnapshotAudit.variantPaths} paths have more than one content variant; other copied source files are byte-identical within their normalized path groups.

## Architecture differences

The differing snapshots cover five Landscape implementation files: ForgeLandscape.cpp, ForgeLandscape.h, ForgeLandscapeAdoption.inl, ForgeLandscapeAdoptionTests.inl, and MajesticForgeModule.cpp. Across the variants, edit-session and read-region command wiring differs from adoption readiness, clean-package and backup checks, one-operation use tracking, and job polling. Edit-session state and layer-protection checks also appear in different files across the variants. The automation fixture changes its generated-data root from ProjectDir/Saved to ProjectSavedDir.

## Date and lineage status

Checkpoint folder names place these copies around October 23–24, 2026, but the code snapshots contain no commit identity or reliable ordering that establishes which variant superseded another or which one was active in production. This comparison is therefore undated and does not claim a production architecture change or successful runtime adoption.

## Related reports

${relatedLinks||'The related startup and reload reports remain the authoritative event records.'}
`;
    const id=recordId('Publication_Review/Landscape_Checkpoint_Code_Snapshot_Comparison.md');
    const rendered=renderMarkdown(markdown,'Publication_Review/Landscape_Checkpoint_Code_Snapshot_Comparison.md',idsForRender,baseRecordIds);
    const record={id,title,path:'Publication_Review/Landscape_Checkpoint_Code_Snapshot_Comparison.md',category:'Architecture',format:'Checkpoint source comparison',integrityLabel:'SHA-256 of generated comparison note',status:'Archived',developmentStatus:'Snapshot lineage unresolved',summary:'Five Landscape source paths contain two code variants across recovery checkpoints; snapshot order and production lineage are unverified.',supportingReferences:[],date:null,dateBasis:'Undated',dateConfidence:'undated',chronologyEligible:false,sha256:digest(Buffer.from(markdown)),excerpt:'Read-only comparison of duplicated Landscape source snapshots; code lineage and ordering remain unresolved.'};
    supplementalRecords.push({record,payload:{...record,...rendered}});
  }
  checkpointInventory.indexedEvidenceFiles=manifestEntries.filter(entry=>entry.sourceRoot==='ForgeMCP_Recovery_Checkpoints'&&entry.type!=='symlink').length;
  checkpointInventory.sourceSnapshotAudit=sourceSnapshotAudit;
  delete checkpointInventory.root;
  delete checkpointInventory.sourceSnapshotPaths;
}

const reviewEntries=manifestEntries;
const summary={reviewed:reviewEntries.length,byType:Object.create(null),byDisposition:Object.create(null),publishedSourceRecords:supplementalRecords.length,categories:Object.create(null)};
for(const entry of reviewEntries){summary.byType[entry.type]=(summary.byType[entry.type]||0)+1;summary.byDisposition[entry.disposition]=(summary.byDisposition[entry.disposition]||0)+1;if(entry.disposition==='Published Markdown derivative'||entry.disposition.startsWith('Published '))summary.categories[entry.category]=(summary.categories[entry.category]||0)+1;}
const supplementalAudit={snapshot:'2026-10-24',method:'Read-only scan of checkpoint documentation, structured reports, logs, text evidence, configuration and manifest files; full recursive checkpoint inventory; byte-hash duplicate consolidation; credentials, runtime identity, local paths and non-event source material excluded or redacted.',summary,checkpointInventory,derivedRecords:supplementalRecords.filter(item=>item.record.format==='Checkpoint source comparison').map(item=>({id:item.record.id,title:item.record.title,dateConfidence:item.record.dateConfidence,chronologyEligible:false})),entries:reviewEntries};
const auditText=JSON.stringify(supplementalAudit,null,2);
await writeFile(manifestPath,auditText);
const auditHash=digest(Buffer.from(auditText));
const reviewId=recordId(reviewPath);
const dispositionRows=Object.entries(summary.byDisposition).map(([name,count])=>`<tr><td>${escape(name)}</td><td>${count}</td></tr>`).join('');
const checkpointInventoryHtml=checkpointInventory?` The <code>ForgeMCP_Recovery_Checkpoints</code> tree contained ${checkpointInventory.regularFiles.toLocaleString('en')} regular files across ${Object.keys(checkpointInventory.byExtension).length} extensions; ${checkpointInventory.indexedEvidenceFiles.toLocaleString('en')} selected sources are individually dispositioned below. ${checkpointInventory.sourceSnapshotAudit.files.toLocaleString('en')} code snapshots were hash-compared across ${checkpointInventory.sourceSnapshotAudit.logicalPaths.toLocaleString('en')} normalized paths, with ${checkpointInventory.sourceSnapshotAudit.variantPaths} paths containing multiple variants.`:'';
const reviewHtml=`<h1 id="supplemental-review">Recovery and checkpoint source review</h1><p>Read-only review of ${summary.reviewed} selected source files from the ForgeMCP recovery checkpoint folders and Saved JSONL logs. Original evidence remains unchanged.${checkpointInventoryHtml}</p><h2 id="supplemental-dispositions">Review outcomes</h2><table><thead><tr><th>Disposition</th><th>Files</th></tr></thead><tbody>${dispositionRows}</tbody></table><h2 id="supplemental-boundary">Publication boundary</h2><p>Unique recovery reports, test evidence, corroborating save and crash-context summaries, and selected JSONL outcome rows are published as linked derivatives. Identity/correlation traces, process handles, request/response transcripts, environment-specific settings, binary Unreal assets, generated caches, and files without a selected development event are accounted for but are not exposed as reading records. Credentials and workstation paths are redacted. The per-source manifest hashes selected sources; the full checkpoint inventory records extension counts without copying binary assets.</p><p><a href="/projects/forgemcp/encyclopedia/supplemental-source-review.json">Download the supplemental source review manifest ↗</a></p>`;
const reviewRecord={id:reviewId,title:'Recovery and checkpoint source review',path:reviewPath,category:'Publication review',format:'Review index',integrityLabel:'SHA-256 of supplemental review manifest',status:'Archived',developmentStatus:null,summary:'Audit of recovery checkpoint files, selected text and structured evidence, code snapshot variants, and project JSONL records.',supportingReferences:[],date:'2026-10-24',dateBasis:'Review date',dateConfidence:'verified',sha256:auditHash,excerpt:`${summary.reviewed} supplemental source files reviewed; ${summary.publishedSourceRecords} unique records published.`};
const reviewPayload={...reviewRecord,html:reviewHtml,headings:[{id:'supplemental-dispositions',text:'Review outcomes',depth:2},{id:'supplemental-boundary',text:'Publication boundary',depth:2}]};
await writeFile(resolve(recordsDirectory,`${reviewId}.json`),JSON.stringify(reviewPayload));
for(const item of supplementalRecords)await writeFile(resolve(recordsDirectory,`${item.record.id}.json`),JSON.stringify(item.payload));
catalog.records=[...catalog.records.filter(record=>record.id!==reviewId&&!supplementalRecords.some(item=>item.record.id===record.id)),...supplementalRecords.map(item=>item.record),reviewRecord];
catalog.supplementalCoverage={...summary,reviewRecordId:reviewId,manifestSha256:auditHash,roots:roots.map(root=>basename(root))};
catalog.scope='Original archive Markdown, reviewed diagnostic and structured evidence, plus selected recovery checkpoint documents, corroborating save/crash evidence, a checkpoint code-variant comparison, and sanitized JSONL outcome summaries. Raw credentials, runtime identity registrations, unrelated runtime transcripts, binaries and generated caches are excluded.';
await writeFile(catalogPath,JSON.stringify(catalog,null,2));
console.log(JSON.stringify({supplementalRecords:supplementalRecords.length,reviewRecordId:reviewId,...summary}));
