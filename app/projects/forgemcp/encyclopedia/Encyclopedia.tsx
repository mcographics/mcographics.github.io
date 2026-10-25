'use client';

import { useEffect, useRef, useState } from 'react';
import catalog from './catalog.json';
import { orderRecords, sortOptions } from './archive-order.mjs';
import { chronologyRecords, latestDevelopmentUpdates } from './chronology.mjs';

type RecordEntry = typeof catalog.records[number];
type Document = RecordEntry & { html: string; headings: {id:string;text:string;depth:number}[] };
const groups = [
  ['Start here', ['Overview','Chronology','Latest Development Updates','Timeline','Milestones']],
  ['Development record', ['Evidence Review','Sessions','Reports','Changelogs','Logs','Builds & Deployment','Failure & Recovery','Provenance','Architecture']],
  ['Integrations', ['Unreal Integration','Blender Integration','MCP Tooling','Landscape','Adoption']],
  ['Research & archive', ['Experiments','Research Notes','Media & Assets','Archive']],
] as const;
const categoryMatch: Record<string,string[]> = {
  'Evidence Review':['Publication_Review'], 'Builds & Deployment':['Builds_and_Versions','Builds and deployment','ForgeBuild','BuildLogs','Compile'], 'Failure & Recovery':['Bugs_and_Failures','Failure and recovery'], Provenance:['Provenance and inventory'],
  Timeline:['Development_Timeline'],Milestones:['Development_Timeline','Version_History'],
  Sessions:['Bootstrap','Saved'],Reports:['Development_Reports','Testing_and_Validation'],Changelogs:['Version_History','Builds_and_Versions'],
  Logs:['Logs_and_Diagnostics','Connection'],Architecture:['Architecture','Engineering','Security'],
  'Unreal Integration':['Unreal_Integration','Blueprint','ActorProperty','MaterialAutomation','AssetProperty'],
  'Blender Integration':['Blender','Roundtrip'], 'MCP Tooling':['Bridge_Protocol','Connection','Installation'],
  Landscape:['Landscape','Terrain','Lake','Stage2E'],Adoption:['Adoption'],Experiments:['Experiments','Demonstration','Proof'],
  'Research Notes':['Reference_Documents'], 'Media & Assets':['Logo','Visual','Tab_','Transfer'],Archive:[''],
};
const overviewToc = ['Project overview','Core vision','Architecture overview','Development chronology','Latest development updates','Evidence & acceptance','Archive index'];
const terrain = catalog.records.find(r=>r.path.includes('Terrain_Acceptance_Verification'))!;
const master = catalog.records.find(r=>r.path.endsWith('/ForgeMCP_Encyclopedia.md'))!;
const timelineSource = catalog.records.find(r=>r.path.endsWith('ForgeMCP_Development_Timeline.md'))!;

function dateLine(record:RecordEntry) {
  if(!record.date) return <span>Undated</span>;
  const verified=record.dateConfidence==='verified';
  return <><time dateTime={record.date}>{record.date}</time>{record.time&&<> · {record.time}{record.timezone?` ${record.timezone}`:''}</>} <span className={`enc-date-confidence ${verified?'verified':'inferred'}`}>{verified?'Verified source date':'Inferred date'} · {record.dateBasis}</span></>;
}

export default function Encyclopedia() {
  const [category,setCategory] = useState('Overview');
  const [query,setQuery] = useState('');
  const [selected,setSelected] = useState<Document|null>(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [menu,setMenu] = useState(false);
  const [page,setPage] = useState(1);
  // The server renders Overview; sorted lists appear after client navigation.
  const [sortOrder,setSortOrder] = useState(()=>{
    if(typeof window==='undefined') return 'oldest';
    try { const saved=window.localStorage.getItem('forgemcp-archive-sort'); if(saved && sortOptions.some(([value])=>value===saved)) return saved; } catch { /* Storage may be unavailable. */ }
    return 'oldest';
  });
  const request = useRef(0);
  const markdownBody = useRef<HTMLDivElement>(null);
  const chronology=chronologyRecords(catalog.records);
  const latestUpdates=latestDevelopmentUpdates(catalog.records,6);
  function navigateCategory(name:string) {
    request.current++; setLoading(false); setError(''); setSelected(null); setCategory(name); setQuery(''); setMenu(false);setPage(1);
    window.history.pushState({},'',window.location.pathname); window.scrollTo({top:0});
  }
  async function openRecord(id:string, push=true) {
    const version = ++request.current;
    setLoading(true); setError(''); setMenu(false);
    try {
      const response = await fetch(`/projects/forgemcp/encyclopedia/records/${id}.json`,{cache:'no-cache'});
      if(!response.ok) throw new Error('The archive record could not be loaded. Please try again.');
      const document:Document = await response.json();
      if(version!==request.current) return;
      setSelected(document); setCategory('Archive');
      if(push) window.history.pushState({},'',`?record=${id}`);
      window.scrollTo({top:0});
    } catch(e) { if(version===request.current) setError(e instanceof Error ? e.message : 'Unable to load record.'); }
    finally { if(version===request.current) setLoading(false); }
  }
  useEffect(()=>{
    function shortcut(event:KeyboardEvent) {
      if(event.key==='/' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault(); setMenu(true);
        window.requestAnimationFrame(()=>document.querySelector<HTMLInputElement>('.enc-search input')?.focus());
      }
      if(event.key==='Escape') setMenu(false);
    }
    function restore() {
      const id = new URLSearchParams(window.location.search).get('record');
      if(id && catalog.records.some(r=>r.id===id)) void openRecord(id,false);
      else { request.current++; setSelected(null); setCategory('Overview'); setLoading(false); }
    }
    restore(); window.addEventListener('popstate',restore); window.addEventListener('keydown',shortcut);
    return ()=>{ window.removeEventListener('popstate',restore); window.removeEventListener('keydown',shortcut); };
  },[]);
  useEffect(()=>{
    const body = markdownBody.current;
    function followRecord(event:MouseEvent) {
      if(event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      const href = anchor?.getAttribute('href');
      if(href?.startsWith('?record=')) { event.preventDefault(); void openRecord(href.slice(8)); }
    }
    body?.addEventListener('click',followRecord);
    return ()=>body?.removeEventListener('click',followRecord);
  },[selected,loading]);
  const categoryRecords=category==='Chronology'?chronology:category==='Latest Development Updates'?latestUpdates:catalog.records.filter(r=>category==='Overview'||(categoryMatch[category]||['']).some(part=>`${r.path} ${r.category}`.toLowerCase().includes(part.toLowerCase())));
  const activeSort=category==='Chronology'?'oldest':category==='Latest Development Updates'?'newest':sortOrder;
  const filtered=orderRecords(categoryRecords.filter(r=>`${r.title} ${r.path} ${r.category} ${r.excerpt}`.toLowerCase().includes(query.toLowerCase())),activeSort);
  const pageCount=Math.max(1,Math.ceil(filtered.length/40));
  const currentPage=Math.min(page,pageCount);
  const visibleRecords=filtered.slice((currentPage-1)*40,currentPage*40);
  const isOverview = !selected && category==='Overview' && !query;
  const toc = selected ? selected.headings.filter(h=>h.depth===2) : isOverview ? overviewToc.map((text,i)=>({id:`overview-${i}`,text})) : [];
  return <main className="enc-shell">
    <a className="enc-skip" href="#enc-content">Skip to article</a>
    <header className="enc-header">
      <a className="enc-brand" href="/projects/forgemcp/"><img src="/projects/forgemcp/encyclopedia/logo.png" width="37" height="37" alt="ForgeMCP logo"/><span><b>ForgeMCP</b><small>ENCYCLOPEDIA</small></span></a>
      <span className="enc-header-label">Documentation / Engineering archive</span>
      <a href="/projects/forgemcp/">Project page ↗</a>
      <button className="enc-menu" aria-expanded={menu} aria-controls="enc-navigation" onClick={()=>setMenu(!menu)}>☰ Browse</button>
    </header>
    <div className="enc-layout">
      <aside className={`enc-left ${menu?'is-open':''}`} id="enc-navigation" aria-label="Encyclopedia navigation">
        <label className="enc-search"><span>⌕</span><input type="search" value={query} placeholder="Search the archive…" aria-label="Search archive titles, paths and summaries" onChange={e=>{setQuery(e.target.value);setPage(1);setSelected(null);request.current++;setLoading(false);}}/><kbd>/</kbd></label>
        <p className="enc-search-hint">Search titles, paths & summaries</p>
        <nav>{groups.map(([group,items])=><details open key={group}><summary>{group}</summary><div>{items.map(name=><button key={name} className={category===name?'active':''} aria-current={category===name?'page':undefined} onClick={()=>navigateCategory(name)}><span aria-hidden="true">{name==='Overview'?'◈':'▤'}</span>{name}{name==='Archive'&&<small>{catalog.records.length}</small>}{name==='Chronology'&&<small>{chronology.length}</small>}</button>)}</div></details>)}</nav>
        <div className="enc-sidebar-note"><span className="enc-dot"/> Versioned evidence<br/><small>Snapshot · {catalog.snapshot}<br/>Unreal Engine + Blender</small></div>
      </aside>
      <article className="enc-content" id="enc-content" tabIndex={-1}>
        <div className="enc-breadcrumb"><button onClick={()=>navigateCategory('Overview')}>Encyclopedia</button><span>/</span><span>{selected?selected.category:category}</span></div>
        {toc.length>0&&<details className="enc-mobile-toc"><summary>On this page</summary>{toc.map(h=><a key={h.id} href={`#${h.id}`}>{h.text}</a>)}</details>}
        {loading?<p role="status">Loading source record…</p>:error?<div className="enc-callout" role="alert">{error}<button onClick={()=>navigateCategory('Archive')}>Return to archive</button></div>:selected?<>
          <div className="enc-eyebrow">SOURCE RECORD <span className={`enc-badge ${selected.status==='Blocked'?'warning':''}`}>{selected.developmentStatus||selected.status}</span></div>
          <p className="enc-file-path">{selected.path}</p>
          <p className="enc-record-date">{dateLine(selected)}</p>
          <div className="enc-callout compact">Historical evidence · Status statements describe the source report’s scope and time. They do not establish current runtime readiness.</div>
          <div className="enc-markdown" ref={markdownBody} dangerouslySetInnerHTML={{__html:selected.html}}/>
          <details className="enc-integrity"><summary>Source integrity & publication notes</summary><p>{selected.integrityLabel}:</p><code>{selected.sha256}</code><p>The published derivative redacts local workstation paths and credential assignments, escapes raw HTML, and marks references outside this snapshot as “not indexed”. Diagnostic excerpts and structured summaries state their selection boundaries.</p></details>
        </>:isOverview?<>
          <div className="enc-eyebrow">THE ENGINEERING RECORD <span className="enc-badge">Living archive</span></div>
          <h1>ForgeMCP<br/><span>Encyclopedia</span></h1>
          <p className="enc-lead">The development history, documentation, and knowledge base for ForgeMCP. Decisions, experiments, breakthroughs, and the evidence behind them.</p>
          <div className="enc-meta-line"><span>▤ {catalog.records.length} indexed records</span><span>Snapshot {catalog.snapshot}</span><span>Documents & evidence</span></div>
          <div className="enc-callout"><b>A record of what happened.</b><p>Read the successful checks alongside failures, retries, and unresolved gates. Archived reports retain their historical meaning; a passing build does not establish live editor or independent reload acceptance.</p></div>
          <h2 id="overview-0">Project overview</h2><p>ForgeMCP connects an AI development client to supported native workflows in Unreal Engine and Blender through a local Model Context Protocol server. Each application retains its own runtime, project state, and adapter.</p>
          <h2 id="overview-1">Core vision</h2><ul><li>Connect creative workflows through natural-language tool calls.</li><li>Inspect the intended project or scene before planning a change.</li><li>Use typed native operations with preview, review, and bounded apply.</li><li>Keep architecture modular and development grounded in documented evidence.</li></ul>
          <h2 id="overview-2">Architecture overview</h2><p>One protocol boundary. Separate application runtimes.</p>
          <div className="enc-diagram" role="img" aria-label="AI client connects through MCP to the local ForgeMCP Python server, which routes authenticated requests separately to Unreal C++ on the game thread and Blender bpy on the main thread. Both return structured evidence."><div className="enc-diagram-node"><small>01 / CLIENT</small><b>AI / LLM client</b><span>Codex · MCP tools</span></div><div className="enc-connector">↓ Model Context Protocol</div><div className="enc-diagram-node primary"><small>02 / LOCAL BRIDGE</small><b>ForgeMCP server</b><span>Validation · routing · session identity</span></div><div className="enc-connector">↓ Authenticated loopback</div><div className="enc-diagram-pair"><div className="enc-diagram-node"><small>UNREAL ENGINE</small><b>Native C++ adapter</b><span>Editor game thread</span></div><div className="enc-diagram-node orange"><small>BLENDER</small><b>Python / bpy adapter</b><span>Application main thread</span></div></div><div className="enc-connector">↓ Structured results & diagnostics</div><div className="enc-diagram-foot">Project files / assets / tools / scripts / logs</div></div>
          <button className="enc-inline-link" onClick={()=>void openRecord(catalog.records.find(r=>r.path.endsWith('Bridge_Protocol.md'))!.id)}>Read the bridge protocol →</button>
          <h2 id="overview-3">Development chronology</h2><p>{chronology.length.toLocaleString('en')} unique dated development records, oldest to newest. Each entry opens the underlying source record. Exact-byte duplicates are collapsed. Date labels distinguish source timestamps from filename, archive-path, and file-modified inferences.</p>
          <div className="enc-timeline">{chronology.slice(0,3).map(record=><div key={record.id}><span className="enc-record-date">{dateLine(record)}</span><b>{record.title}</b><p>{record.summary||record.excerpt}</p><button onClick={()=>void openRecord(record.id)}>Read source record →</button></div>)}</div>
          <button className="enc-inline-link" onClick={()=>navigateCategory('Chronology')}>Browse the complete chronology →</button>
          <button className="enc-inline-link" onClick={()=>void openRecord(timelineSource.id)}>Read the original timeline note →</button>
          <h2 id="overview-4">Latest development updates</h2><p>These are the newest records from the same dated source set used by Chronology.</p>
          <div className="enc-timeline">{latestUpdates.slice(0,4).map(record=><div key={record.id}><span className="enc-record-date">{dateLine(record)}</span><b>{record.title}</b><p>{record.summary||record.excerpt}</p><button onClick={()=>void openRecord(record.id)}>Open source record →</button></div>)}</div>
          <button className="enc-inline-link" onClick={()=>navigateCategory('Latest Development Updates')}>Browse latest development updates →</button>
          <h2 id="overview-5">Evidence & acceptance</h2><div className="enc-evidence"><span className="enc-badge warning">Partial acceptance</span><h3>Landscape: retain the unresolved gates</h3><p>The October 24 report records five collision traces in the loaded Editor and a protected-file integrity audit. Independent reload and target-feature visual review remain blocked. The west hill retains its historical <code>validation_failed_partial</code> result.</p><button onClick={()=>void openRecord(terrain.id)}>Read the acceptance report →</button></div>
          <h3>Read status in context</h3><p><b>Verified</b> means a named check passed within its evidence boundary. <b>Partial</b>, <b>Failed</b>, <b>Pending</b>, and <b>Superseded</b> belong to individual historical claims. <b>Archived</b> identifies a preserved record; it does not certify its conclusions.</p>
          <pre><code>{`inspection → preview → review → authorized apply\n           → validation → saved / reloaded evidence\n\nBuild ≠ live editor ≠ visual acceptance ≠ performance`}</code></pre>
          <h2 id="overview-6">Archive index</h2><p>{catalog.scope} This is a published reading snapshot of the broader local archive, with coverage stated explicitly.</p>
          <div className="enc-callout"><b>Additional source evidence, reviewed</b><p>{catalog.coverage.markdown} archive Markdown documents plus {catalog.coverage.additionalSources.toLocaleString('en')} reviewed log, JSON and CSV sources. Useful diagnostics and structured evidence are categorized; empty files and exact duplicates are accounted for in the source review.</p><button className="enc-inline-link" onClick={()=>void openRecord(catalog.coverage.reviewRecordId)}>Read the archive evidence review →</button>{catalog.supplementalCoverage&&<button className="enc-inline-link" onClick={()=>void openRecord(catalog.supplementalCoverage.reviewRecordId)}>Read the recovery and JSONL source review →</button>}</div>
          <div className="enc-quick-links">{['Architecture','Reports','Landscape','Changelogs','Archive'].map(name=><button key={name} onClick={()=>navigateCategory(name)}>{name}<span>→</span></button>)}</div>
          <details className="enc-integrity"><summary>How this encyclopedia is maintained</summary><p>Markdown documents, selected diagnostic lines and bounded structured evidence are indexed into a reproducible snapshot. Source-derived records retain the original source-relative path and SHA-256. The derived publication review hashes its audit manifest. Credentials and workstation paths are redacted. Historical inventory counts remain source claims; website coverage counts include only available reading records.</p><button className="enc-inline-link" onClick={()=>void openRecord(master.id)}>Read the original master index →</button></details>
        </>:<>
          <div className="enc-eyebrow">BROWSE THE RECORD</div><h1>{query?'Search results':category}</h1><p className="enc-lead">{filtered.length} {category==='Chronology'?'dated development records in oldest-to-newest order':category==='Latest Development Updates'?'recent development records, newest first':'indexed records'}{query?` matching “${query}”`:'. Source documents, preserved in context.'}</p>
          <div className="enc-callout compact">Records are historical snapshots. “Archived” describes preservation, not a passing acceptance verdict.</div>
          {category!=='Chronology'&&category!=='Latest Development Updates'&&<div className="enc-sort-bar"><label htmlFor="enc-sort">Sort records</label><select id="enc-sort" value={sortOrder} onChange={event=>{const value=event.target.value;setSortOrder(value);setPage(1);try{window.localStorage.setItem('forgemcp-archive-sort',value);}catch{/* Keep sorting available without storage. */}}}>{sortOptions.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></div>}
          <p className="enc-sort-note">Verified labels mean the date appears in document, JSON, or log content. Inferred labels identify filename, archived-folder, or file-modified dates. They date the source record and do not independently verify when a development event occurred.</p>
          <p className="enc-list-count" role="status">{filtered.length ? `Showing ${(currentPage-1)*40+1}–${Math.min(currentPage*40,filtered.length)} of ${filtered.length} records` : 'No matching records'}</p>
          {filtered.length===0?<p>No published records match this view. Try another search or browse the complete archive.</p>:<div className="enc-record-list">{visibleRecords.map(record=><button key={record.id} onClick={()=>void openRecord(record.id)}><small>{record.category} · {record.format}<span className={`enc-badge ${record.status==='Blocked'?'warning':''}`}>{record.developmentStatus||record.status}</span></small><strong>{record.title}</strong><span className="enc-record-date">{dateLine(record)}</span><span>{record.summary||record.excerpt}</span><code>{record.path}</code></button>)}</div>}
          {pageCount>1&&<div className="enc-pagination" aria-label="Archive pagination"><button disabled={currentPage===1} onClick={()=>{setPage(currentPage-1);document.getElementById('enc-content')?.scrollIntoView();}}>← Previous</button><span>Page {currentPage} of {pageCount}</span><button disabled={currentPage===pageCount} onClick={()=>{setPage(currentPage+1);document.getElementById('enc-content')?.scrollIntoView();}}>Next →</button></div>}
        </>}
        <footer className="enc-footer"><span>ForgeMCP / Majestic Creations</span><a href="/projects/forgemcp/">Back to the project ↗</a></footer>
      </article>
      <aside className="enc-right" aria-label="Article context">
        <div><h2>ON THIS PAGE</h2><nav aria-label="Table of contents">{toc.length?toc.map(h=><a key={h.id} href={`#${h.id}`}>{h.text}</a>):<span>Choose a record to read its sections.</span>}</nav></div>
        <div><h2>PAGE STATUS</h2><span className={`enc-badge ${selected?.status==='Blocked'?'warning':''}`}>{selected?.status||'Curated index'}</span><p>{selected?'Historical source record. Read the report for individual check outcomes.':'Current source snapshot reviewed; public views are selected derivatives.'}</p></div>
        <div><h2>METADATA</h2><dl><dt>Snapshot</dt><dd>{catalog.snapshot}</dd><dt>Category</dt><dd>{selected?.category||category}</dd><dt>Format</dt><dd>{selected?.format||'Engineering index'}</dd><dt>Coverage</dt><dd>{catalog.records.length} published records</dd></dl></div>
        <div><h2>HISTORY SPOTLIGHT</h2><button onClick={()=>void openRecord(terrain.id)}>Terrain acceptance audit <span>24 Oct 2026 · Blocked gates</span></button><button onClick={()=>void openRecord(catalog.records.find(r=>r.path.includes('Version_History'))!.id)}>Version history <span>Recorded release progression</span></button></div>
        <div><h2>RELATED SOURCES</h2>{catalog.records.filter(r=>r.path.endsWith('Bridge_Protocol.md')||r.path.endsWith('ForgeMCP_Known_Issues.md')||r.id===master.id).map(r=><button key={r.id} onClick={()=>void openRecord(r.id)}>▤ {r.title}</button>)}</div>
        <p className="enc-right-foot">Keep the failures.<br/>Preserve the evidence.</p>
      </aside>
    </div>
  </main>;
}
