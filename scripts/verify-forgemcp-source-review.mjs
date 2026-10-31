import {readdir,readFile} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {extractLog} from './forgemcp-evidence.mjs';

const root=resolve(process.argv[2]||'../ForgeMCP/ForgeMCP_Encyclopedia');
const catalog=JSON.parse(await readFile('app/projects/forgemcp/encyclopedia/catalog.json','utf8'));
const audit=JSON.parse(await readFile('public/projects/forgemcp/encyclopedia/source-review.json','utf8'));
const primaryMarkdown=catalog.records.filter(record=>record.format==='Markdown derivative'&&!/^(?:ForgeMCP_Recovery_Checkpoints|09_Recovery_and_Checkpoints|Saved)\//.test(record.path));
const receipts=[...primaryMarkdown,...audit.entries];
const expected=new Set(receipts.map(record=>record.path));
async function inventory(directory) {
  const paths=[];
  for(const item of await readdir(directory,{withFileTypes:true})) {
    const absolute=resolve(directory,item.name);
    if(item.isSymbolicLink())throw Error('Linked source entry requires review');
    if(item.isDirectory())paths.push(...await inventory(absolute));
    else if(item.isFile())paths.push(relative(root,absolute).split(sep).join('/'));
  }
  return paths;
}
const actual=await inventory(root);
if(actual.length!==expected.size||actual.some(path=>!expected.has(path)))throw Error('Source inventory differs from reviewed snapshot');
let cursor=0;
await Promise.all(Array.from({length:8},async()=>{
  while(cursor<receipts.length) {
    const record=receipts[cursor++];const absolute=resolve(root,record.path);
    if(!absolute.startsWith(`${root}${sep}`))throw Error('Source path outside archive');
    const bytes=await readFile(absolute);
    const digest=createHash('sha256').update(bytes).digest('hex');
    if(digest!==record.sha256||(record.bytes!==undefined&&record.bytes!==bytes.length))throw Error(`Source receipt mismatch: ${record.path}`);
    if(record.disposition==='Published diagnostic excerpt') {
      const expected=extractLog(bytes.toString('utf8').replace(/^\uFEFF/,'')).selected.map(line=>`L${line.line}: ${line.text}`).join('\n').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
      const published=JSON.parse(await readFile(`public/projects/forgemcp/encyclopedia/records/${record.recordId}.json`,'utf8'));
      if(!published.html.includes(`<pre><code>${expected}</code></pre>`))throw Error(`Diagnostic derivative mismatch: ${record.path}`);
    }
  }
}));
console.log(JSON.stringify({sourceFilesVerified:receipts.length,markdown:catalog.coverage.markdown,additionalSources:audit.entries.length,inventory:'exact match',sha256:'all receipts match',diagnostics:'all selected lines match current extraction'}));
