import { readdir, readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { resolve, basename, posix } from 'node:path';
import { createHash } from 'node:crypto';
import { Marked } from 'marked';
import { evidenceDate, documentMetadata } from '../app/projects/forgemcp/encyclopedia/archive-order.mjs';
import { reviewEvidence, sanitizeEvidence, publicStructure } from './forgemcp-evidence.mjs';

// Explicit local snapshot. Read archive evidence only; never probe running applications.
const source = resolve(process.argv[2] || '../ForgeMCP/ForgeMCP_Encyclopedia');
const destination = resolve('public/projects/forgemcp/encyclopedia/records');
const escape = (s) => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const files = [];
async function collectMarkdown(directory,relativePath='') {
  for(const entry of await readdir(resolve(directory,relativePath),{withFileTypes:true})) {
    const path=posix.join(relativePath,entry.name);
    if(entry.isSymbolicLink()) throw Error(`Linked Markdown source requires review: ${path}`);
    if(entry.isDirectory()) await collectMarkdown(directory,path);
    else if(entry.isFile()&&entry.name.toLowerCase().endsWith('.md')) files.push(path);
  }
}
await collectMarkdown(source);
files.sort();
const review=await reviewEvidence(source);
const reviewPath='Publication_Review/Additional_Source_Review.md';
const ids = new Map([...files,...review.documents.map(d=>d.path),reviewPath].map(p => [p, createHash('sha256').update(p).digest('hex').slice(0,16)]));
for(const entry of review.audit.entries) entry.recordId=entry.recordPath?ids.get(entry.recordPath):null;
const auditText=JSON.stringify(review.audit,null,2);
await mkdir(destination, { recursive: true });
const records = [];
for (const path of files) {
  const bytes = await readFile(resolve(source,path));
  let markdown = bytes.toString('utf8');
  const details=await stat(resolve(source,path));
  const allowFileTimestamp=!/^(?:00_Master_Index|13_Reference_Documents)\//.test(path);
  const {date,dateBasis,dateConfidence}=evidenceDate(markdown,path,allowFileTimestamp?details.mtime:null);
  // Published derivatives omit workstation paths and credential-shaped assignments.
  markdown = sanitizeEvidence(markdown);
  // Some legacy notes have a truncated private-path destination after sanitization.
  // Keep the link label readable and mark the local-only target as unavailable.
  markdown = markdown.replace(/\[([^\]\r\n]+)\]\(\[local path\][^\r\n]*/gi,'[$1] [not indexed]');
  const metadata=documentMetadata(markdown);
  markdown=markdown.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/,'');
  const title = metadata.title || markdown.match(/^#\s+(.+)$/m)?.[1]?.replaceAll('**','') || basename(path,'.md').replaceAll('_',' ');
  const headings = [];
  const parser = new Marked({ gfm:true, renderer: {
    html({text}) { return escape(text); },
    image({text}) { return `<span class="enc-unavailable">[Image: ${escape(text)}]</span>`; },
    heading({tokens,depth}) { const text = this.parser.parseInline(tokens); const id = `section-${headings.length}`; headings.push({id,text:text.replace(/<[^>]+>/g,''),depth}); return `<h${depth} id="${id}">${text}</h${depth}>`; },
    link({href,tokens}) {
      const label = this.parser.parseInline(tokens);
      if (/^https:\/\//i.test(href)) return `<a href="${escape(href)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
      if (href.startsWith('#')) return `<span>${label}</span>`;
      const target = posix.normalize(posix.join(posix.dirname(path),href.split('#')[0])).replace(/^15_Saved\//,'14_Saved/');
      const id = ids.get(target);
      return id ? `<a href="?record=${id}">${label}</a>` : `<span class="enc-unavailable" title="Referenced file is outside this published snapshot">${label} [not indexed]</span>`;
    }
  }});
  const html = parser.parse(markdown);
  const id = ids.get(path);
  const status = path.includes('Terrain_Acceptance_Verification') ? 'Blocked' : 'Archived';
  const record = {id,title:sanitizeEvidence(title),path:sanitizeEvidence(path),category:path.split('/')[0].replace(/^\d+_/,'').replaceAll('_',' '),format:'Markdown derivative',integrityLabel:'SHA-256 of original source bytes',status,developmentStatus:sanitizeEvidence(metadata.status)||null,summary:sanitizeEvidence(metadata.summary)||null,supportingReferences:metadata.evidence.map(sanitizeEvidence),time:metadata.time||null,timezone:metadata.timezone||null,date,dateBasis,dateConfidence,sha256:createHash('sha256').update(bytes).digest('hex'),excerpt:sanitizeEvidence(markdown.replace(/[#*`|[\]]/g,'').replace(/\s+/g,' ').slice(0,220))};
  records.push(record);
  await writeFile(resolve(destination,`${id}.json`),JSON.stringify({...record,html,headings}));
}
const dispositionRows=Object.entries(review.audit.summary.byDisposition).map(([name,count])=>`<tr><td>${escape(name)}</td><td>${count}</td></tr>`).join('\n');
const categoryRows=Object.entries(review.audit.summary.categories).map(([name,count])=>`<tr><td>${escape(name)}</td><td>${count}</td></tr>`).join('\n');
const structuredLinks=review.documents.filter(d=>d.format!=='Log excerpt').map(d=>`<li><a href="?record=${ids.get(d.path)}">${escape(d.title)}</a> — ${escape(d.format)}</li>`).join('');
const reportHtml=`<h1 id="review-title">Additional source evidence review</h1><p>Checked October 26, 2026. A read-only review assessed ${review.audit.summary.reviewed} previously unpublished log, JSON and CSV files. No application was launched, edited, saved, or tested by this publication process.</p><h2 id="review-coverage">Coverage and dispositions</h2><p>The archive contains ${files.length} original Markdown documents plus ${review.audit.summary.reviewed} additional source files. Duplicate and empty files are accounted for rather than presented as new engineering milestones.</p><table><thead><tr><th>Disposition</th><th>Source files</th></tr></thead><tbody>${dispositionRows}</tbody></table><h2 id="review-categories">Published technical categories</h2><table><thead><tr><th>Category</th><th>Reading records</th></tr></thead><tbody>${categoryRows}</tbody></table><h2 id="review-structured">Structured evidence and inventory</h2><ul>${structuredLinks}</ul><h2 id="review-method">Method and limitations</h2><p>Log excerpts select warnings, errors, exceptions, test/build outcomes, and ForgeMCP diagnostic messages. Each excerpt includes original line numbers and selected-line coverage. They consolidate repeated lines and omit telemetry. Files with no matching diagnostic signal remain listed in the review manifest. Byte-identical duplicates link to their canonical reading record where one exists.</p><p>JSON views preserve bounded technical structure or summarize large inventories. The CSV view reports parsed record counts, fields, and distributions. Historical inventory counts describe those source snapshots, not current website coverage or current acceptance. Local paths, credential-valued fields, embedded media, and authentication material are removed from public derivatives. No current operational readiness is inferred.</p><p>This review index is derived. Its SHA-256 refers to the downloadable review manifest, rather than an original Markdown source file.</p><p><a href="https://mcographics.github.io/projects/forgemcp/encyclopedia/source-review.json">Download the per-source review manifest ↗</a></p>`;
const supplemental=[...review.documents,{path:reviewPath,title:'Additional source evidence review',category:'Publication review',format:'Review index',date:'2026-10-26',dateBasis:'Review date',dateConfidence:'verified',sha256:createHash('sha256').update(auditText).digest('hex'),html:reportHtml}];
for(const document of supplemental) {
  const id=ids.get(document.path);
  const headings=[];
  let html=document.html;
  if(!html) {
    const parser=new Marked({gfm:true,renderer:{html({text}){return escape(text);},heading({tokens,depth}){const label=this.parser.parseInline(tokens);const anchor=`section-${headings.length}`;headings.push({id:anchor,text:label.replace(/<[^>]+>/g,''),depth});return `<h${depth} id="${anchor}">${label}</h${depth}>`;},image({text}){return escape(text);},link({tokens}){return this.parser.parseInline(tokens);}}});
    html=parser.parse(document.logIntro||document.markdown);
    if(document.logLines) {const anchor='recorded-diagnostics';headings.push({id:anchor,text:'Recorded diagnostics',depth:2});html+=`<h2 id="${anchor}">Recorded diagnostics</h2><pre><code>${escape(document.logLines.map(line=>`L${line.line}: ${line.text}`).join('\n'))}</code></pre>`;}
    if(document.jsonlLines) {const anchor='recorded-events';headings.push({id:anchor,text:'Recorded events',depth:2});html+=`<h2 id="${anchor}">Recorded events</h2><pre><code>${escape(document.jsonlLines.map(line=>`L${line.line}: ${JSON.stringify(line.value)}`).join('\n'))}</code></pre>`;}
    if(document.structured) html+=`<pre><code>${escape(JSON.stringify(publicStructure(document.structured),null,2))}</code></pre>`;
  } else {
    for(const match of html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)) headings.push({id:match[1],text:match[2],depth:2});
  }
  const record={id,title:sanitizeEvidence(document.title),path:sanitizeEvidence(document.path),category:document.category,format:document.format,integrityLabel:document.path===reviewPath?'SHA-256 of review manifest':'SHA-256 of original source bytes',status:'Archived',developmentStatus:document.developmentStatus||null,summary:document.summary||null,supportingReferences:document.supportingReferences||[],date:document.date,dateBasis:document.dateBasis,dateConfidence:document.dateConfidence||'undated',sha256:document.sha256,excerpt:`${document.format} · ${document.category}. ${document.logLines||document.jsonlLines?'Historical diagnostic excerpt with original line numbers.':'Historical structured evidence and source provenance.'}`};
  records.push(record);
  await writeFile(resolve(destination,`${id}.json`),JSON.stringify({...record,html,headings}));
}
await writeFile(resolve('public/projects/forgemcp/encyclopedia/source-review.json'),auditText);
await writeFile(resolve('app/projects/forgemcp/encyclopedia/catalog.json'),JSON.stringify({snapshot:'2026-10-29',scope:'Original Markdown documents plus reviewed diagnostic excerpts, structured JSON evidence, inventory summaries, and a per-source publication review. Raw credentials, telemetry and runtime registrations are excluded.',coverage:{markdown:files.length,additionalSources:review.audit.summary.reviewed,...review.audit.summary,reviewRecordId:ids.get(reviewPath)},records},null,2));
console.log(JSON.stringify({readingRecords:records.length,markdown:files.length,...review.audit.summary}));
