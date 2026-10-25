import {readdir,readFile} from 'node:fs/promises';
import {resolve,relative,sep,extname,basename} from 'node:path';
import {createHash} from 'node:crypto';

const roots=process.argv.slice(2).map(root=>resolve(root));
if(!roots.length)throw Error('Pass the same supplemental source roots used by the builder.');
const manifest=JSON.parse(await readFile('public/projects/forgemcp/encyclopedia/supplemental-source-review.json','utf8'));
const catalog=JSON.parse(await readFile('app/projects/forgemcp/encyclopedia/catalog.json','utf8'));
const byId=new Map(catalog.records.map(record=>[record.id,record]));
const safePath=path=>path.replace(/(ForgeMCPBootstrap-)\d+(\.jsonl)/gi,'$1[process]$2').replace(/\b[a-f0-9]{32}\b/gi,'[run-id]');
const actual=[];const actualLinks=[];
const checkpointInventory={regularFiles:0,symlinks:0,byExtension:Object.create(null),sourceSnapshotPaths:[]};
async function inventory(root,rootName,directory=root) {
  for(const entry of await readdir(directory,{withFileTypes:true})) {
    const path=resolve(directory,entry.name);
    if(entry.isSymbolicLink()){actualLinks.push(`${rootName}|${safePath(`${rootName}/${relative(root,path).split(sep).join('/')}`)}`);if(rootName==='ForgeMCP_Recovery_Checkpoints')checkpointInventory.symlinks++;continue;}
    if(entry.isDirectory())await inventory(root,rootName,path);
    else if(entry.isFile()) {
      const extension=extname(entry.name).slice(1).toLowerCase();
      if(rootName==='ForgeMCP_Recovery_Checkpoints') {
        checkpointInventory.regularFiles++;
        const type=extension||'(none)';checkpointInventory.byExtension[type]=(checkpointInventory.byExtension[type]||0)+1;
        if(['cpp','h','hpp','inl','cs','py','js','css','ush'].includes(extension))checkpointInventory.sourceSnapshotPaths.push(path);
      }
      const accepted=rootName==='Saved'?extension==='jsonl':['md','log','json','csv','jsonl','txt','out','sarif','runtime-xml','ini','sha256'].includes(extension);
      if(!accepted)continue;
      const bytes=await readFile(path);actual.push(`${rootName}|${extension}|${bytes.length}|${createHash('sha256').update(bytes).digest('hex')}`);
    }
  }
}
for(const root of roots)await inventory(root,basename(root));
const expectedCheckpointInventory=manifest.checkpointInventory;
if(expectedCheckpointInventory) {
  const extensions=values=>JSON.stringify(Object.fromEntries(Object.entries(values).sort(([a],[b])=>a.localeCompare(b))));
  if(checkpointInventory.regularFiles!==expectedCheckpointInventory.regularFiles||checkpointInventory.symlinks!==expectedCheckpointInventory.symlinks||extensions(checkpointInventory.byExtension)!==extensions(expectedCheckpointInventory.byExtension))throw Error(`Recursive checkpoint inventory differs from the reviewed snapshot: ${JSON.stringify({actualFiles:checkpointInventory.regularFiles,expectedFiles:expectedCheckpointInventory.regularFiles,actualSymlinks:checkpointInventory.symlinks,expectedSymlinks:expectedCheckpointInventory.symlinks})}`);
  const groups=new Map();
  for(const file of checkpointInventory.sourceSnapshotPaths) {
    const unix=file.replaceAll('\\','/');const prefix='/plugins/forge/';const index=unix.toLowerCase().lastIndexOf(prefix);const normalized=index>=0?unix.slice(index+prefix.length):safePath(unix.slice(roots.find(root=>basename(root)==='ForgeMCP_Recovery_Checkpoints').length+1));
    const hash=createHash('sha256').update(await readFile(file)).digest('hex');const hashes=groups.get(normalized)||new Map();hashes.set(hash,(hashes.get(hash)||0)+1);groups.set(normalized,hashes);
  }
  const variants=[...groups].filter(([,hashes])=>hashes.size>1).map(([path,hashes])=>({path,versions:[...hashes].map(([sha256,copies])=>({sha256,copies}))}));
  const expectedVariants=expectedCheckpointInventory.sourceSnapshotAudit?.variants||[];
  const variantKeys=values=>values.map(item=>`${item.path}|${item.versions.map(version=>`${version.sha256}:${version.copies}`).sort().join(',')}`).sort();
  if(checkpointInventory.sourceSnapshotPaths.length!==expectedCheckpointInventory.sourceSnapshotAudit?.files||groups.size!==expectedCheckpointInventory.sourceSnapshotAudit?.logicalPaths||variants.length!==expectedCheckpointInventory.sourceSnapshotAudit?.variantPaths||variantKeys(variants).join('\n')!==variantKeys(expectedVariants).join('\n'))throw Error('Landscape code snapshot hashes or variant counts differ from the reviewed checkpoint comparison.');
}
const expectedLinks=manifest.entries.filter(entry=>entry.type==='symlink').map(entry=>`${entry.sourceRoot}|${entry.path}`);
const expectedFiles=manifest.entries.filter(entry=>entry.type!=='symlink').map(entry=>`${entry.sourceRoot}|${entry.type}|${entry.bytes}|${entry.sha256}`);
actual.sort();expectedFiles.sort();actualLinks.sort();expectedLinks.sort();
const fileMismatchIndex=actual.findIndex((entry,index)=>entry!==expectedFiles[index]);
const linkMismatchIndex=actualLinks.findIndex((entry,index)=>entry!==expectedLinks[index]);
if(actual.length!==expectedFiles.length||fileMismatchIndex>=0||actualLinks.length!==expectedLinks.length||linkMismatchIndex>=0)throw Error(`Supplemental source inventory or SHA-256 differs from the reviewed snapshot: ${JSON.stringify({actualFiles:actual.length,expectedFiles:expectedFiles.length,fileMismatchIndex,actualFile:fileMismatchIndex>=0?actual[fileMismatchIndex]:null,expectedFile:fileMismatchIndex>=0?expectedFiles[fileMismatchIndex]:null,actualLinks:actualLinks.length,expectedLinks:expectedLinks.length,linkMismatchIndex,actualLink:linkMismatchIndex>=0?actualLinks[linkMismatchIndex]:null,expectedLink:linkMismatchIndex>=0?expectedLinks[linkMismatchIndex]:null})}`);
for(const entry of manifest.entries) {
  if(entry.recordId&&!byId.has(entry.recordId))throw Error(`Supplemental source points at a missing record: ${entry.path}`);
  if(entry.disposition==='Published Markdown derivative'||entry.disposition.startsWith('Published ')) {
    const record=byId.get(entry.recordId);
    if(!record||record.sha256!==entry.sha256)throw Error(`Published supplemental source receipt mismatch: ${entry.path}`);
  }
}
const review=byId.get(catalog.supplementalCoverage.reviewRecordId);
if(!review||review.sha256!==catalog.supplementalCoverage.manifestSha256)throw Error('Supplemental review record does not match its manifest');
console.log(JSON.stringify({supplementalSourceFilesVerified:actual.length,skippedSymlinks:actualLinks.length,publishedSourceRecords:manifest.summary.publishedSourceRecords,inventory:'exact match',sha256:'all supplemental receipts match',jsonl:manifest.summary.byType.jsonl||0}));
