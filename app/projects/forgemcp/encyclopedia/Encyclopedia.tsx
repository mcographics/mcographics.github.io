'use client';

import { useEffect, useRef, useState } from 'react';
import catalog from './catalog.json';

type RecordEntry = typeof catalog.records[number];
type Document = RecordEntry & { html: string; headings: {id:string;text:string;depth:number}[] };
const groups = [
  ['Start here', ['Overview','Chronology','Timeline','Milestones']],
  ['Development record', ['Sessions','Reports','Changelogs','Logs','Architecture']],
  ['Integrations', ['Unreal Integration','Blender Integration','MCP Tooling','Landscape','Adoption']],
  ['Research & archive', ['Experiments','Research Notes','Media & Assets','Archive']],
] as const;
const categoryMatch: Record<string,string[]> = {
  Chronology:['Development_Timeline'],Timeline:['Development_Timeline'],Milestones:['Development_Timeline','Version_History'],
  Sessions:['Bootstrap','Saved'],Reports:['Development_Reports','Testing_and_Validation'],Changelogs:['Version_History','Builds_and_Versions'],
  Logs:['Logs_and_Diagnostics','Connection'],Architecture:['Architecture','Engineering','Security'],
  'Unreal Integration':['Unreal_Integration','Blueprint','ActorProperty','MaterialAutomation','AssetProperty'],
  'Blender Integration':['Blender','Roundtrip'], 'MCP Tooling':['Bridge_Protocol','Connection','Installation'],
  Landscape:['Landscape','Terrain','Lake','Stage2E'],Adoption:['Adoption'],Experiments:['Experiments','Demonstration','Proof'],
  'Research Notes':['Reference_Documents'], 'Media & Assets':['Logo','Visual','Tab_','Transfer'],Archive:[''],
};
const overviewToc = ['Project overview','Core vision','Architecture overview','Development chronology','Evidence & acceptance','Archive index'];
const terrain = catalog.records.find(r=>r.path.includes('Terrain_Acceptance_Verification'))!;
const master = catalog.records.find(r=>r.path.endsWith('/ForgeMCP_Encyclopedia.md'))!;

export default function Encyclopedia() {
  const [category,setCategory] = useState('Overview');
  const [query,setQuery] = useState('');
  const [selected,setSelected] = useState<Document|null>(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [menu,setMenu] = useState(false);
  const request = useRef(0);
  const markdownBody = useRef<HTMLDivElement>(null);
  function navigateCategory(name:string) {
    request.current++; setLoading(false); setError(''); setSelected(null); setCategory(name); setQuery(''); setMenu(false);
    window.history.pushState({},'',window.location.pathname); window.scrollTo({top:0});
  }
  async function openRecord(id:string, push=true) {
    const version = ++request.current;
    setLoading(true); setError(''); setMenu(false);
    try {
      const response = await fetch(`/projects/forgemcp/encyclopedia/records/${id}.json`);
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
  const filtered = catalog.records.filter(r => (category==='Overview' || (categoryMatch[category]||['']).some(part=>r.path.toLowerCase().includes(part.toLowerCase()))) && `${r.title} ${r.path} ${r.excerpt}`.toLowerCase().includes(query.toLowerCase()));
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
        <label className="enc-search"><span>⌕</span><input type="search" value={query} placeholder="Search the archive…" aria-label="Search archive titles, paths and summaries" onChange={e=>{setQuery(e.target.value);setSelected(null);request.current++;setLoading(false);}}/><kbd>/</kbd></label>
        <p className="enc-search-hint">Search titles, paths & summaries</p>
        <nav>{groups.map(([group,items])=><details open key={group}><summary>{group}</summary><div>{items.map(name=><button key={name} className={category===name?'active':''} aria-current={category===name?'page':undefined} onClick={()=>navigateCategory(name)}><span aria-hidden="true">{name==='Overview'?'◈':'▤'}</span>{name}{name==='Archive'&&<small>{catalog.records.length}</small>}</button>)}</div></details>)}</nav>
        <div className="enc-sidebar-note"><span className="enc-dot"/> Versioned evidence<br/><small>Snapshot · {catalog.snapshot}<br/>Unreal Engine + Blender</small></div>
      </aside>
      <article className="enc-content" id="enc-content" tabIndex={-1}>
        <div className="enc-breadcrumb"><button onClick={()=>navigateCategory('Overview')}>Encyclopedia</button><span>/</span><span>{selected?selected.category:category}</span></div>
        {toc.length>0&&<details className="enc-mobile-toc"><summary>On this page</summary>{toc.map(h=><a key={h.id} href={`#${h.id}`}>{h.text}</a>)}</details>}
        {loading?<p role="status">Loading source record…</p>:error?<div className="enc-callout" role="alert">{error}<button onClick={()=>navigateCategory('Archive')}>Return to archive</button></div>:selected?<>
          <div className="enc-eyebrow">SOURCE RECORD <span className={`enc-badge ${selected.status==='Blocked'?'warning':''}`}>{selected.status}</span></div>
          <p className="enc-file-path">{selected.path}</p>
          <div className="enc-callout compact">Historical evidence · Status statements describe the source report’s scope and time. They do not establish current runtime readiness.</div>
          <div className="enc-markdown" ref={markdownBody} dangerouslySetInnerHTML={{__html:selected.html}}/>
          <details className="enc-integrity"><summary>Source integrity & publication notes</summary><p>SHA-256 of original source bytes:</p><code>{selected.sha256}</code><p>The published derivative redacts local workstation paths and credential assignments, escapes raw HTML, and marks references outside this snapshot as “not indexed”.</p></details>
        </>:isOverview?<>
          <div className="enc-eyebrow">THE ENGINEERING RECORD <span className="enc-badge">Living archive</span></div>
          <h1>ForgeMCP<br/><span>Encyclopedia</span></h1>
          <p className="enc-lead">The development history, documentation, and knowledge base for ForgeMCP. Decisions, experiments, breakthroughs, and the evidence behind them.</p>
          <div className="enc-meta-line"><span>▤ {catalog.records.length} indexed records</span><span>Snapshot {catalog.snapshot}</span><span>Markdown sources</span></div>
          <div className="enc-callout"><b>A record of what happened.</b><p>Read the successful checks alongside failures, retries, and unresolved gates. Archived reports retain their historical meaning; a passing build does not establish live editor or independent reload acceptance.</p></div>
          <h2 id="overview-0">Project overview</h2><p>ForgeMCP connects an AI development client to supported native workflows in Unreal Engine and Blender through a local Model Context Protocol server. Each application retains its own runtime, project state, and adapter.</p>
          <h2 id="overview-1">Core vision</h2><ul><li>Connect creative workflows through natural-language tool calls.</li><li>Inspect the intended project or scene before planning a change.</li><li>Use typed native operations with preview, review, and bounded apply.</li><li>Keep architecture modular and development grounded in documented evidence.</li></ul>
          <h2 id="overview-2">Architecture overview</h2><p>One protocol boundary. Separate application runtimes.</p>
          <div className="enc-diagram" role="img" aria-label="AI client connects through MCP to the local ForgeMCP Python server, which routes authenticated requests separately to Unreal C++ on the game thread and Blender bpy on the main thread. Both return structured evidence."><div className="enc-diagram-node"><small>01 / CLIENT</small><b>AI / LLM client</b><span>Codex · MCP tools</span></div><div className="enc-connector">↓ Model Context Protocol</div><div className="enc-diagram-node primary"><small>02 / LOCAL BRIDGE</small><b>ForgeMCP server</b><span>Validation · routing · session identity</span></div><div className="enc-connector">↓ Authenticated loopback</div><div className="enc-diagram-pair"><div className="enc-diagram-node"><small>UNREAL ENGINE</small><b>Native C++ adapter</b><span>Editor game thread</span></div><div className="enc-diagram-node orange"><small>BLENDER</small><b>Python / bpy adapter</b><span>Application main thread</span></div></div><div className="enc-connector">↓ Structured results & diagnostics</div><div className="enc-diagram-foot">Project files / assets / tools / scripts / logs</div></div>
          <button className="enc-inline-link" onClick={()=>void openRecord(catalog.records.find(r=>r.path.endsWith('Bridge_Protocol.md'))!.id)}>Read the bridge protocol →</button>
          <h2 id="overview-3">Development chronology</h2><p>The master timeline separates evidence-backed milestones from dates extracted from filenames. File dates are not independently verified event times.</p>
          <div className="enc-timeline"><div><time>23 OCT 2026</time><b>Landscape adoption & native activation</b><p>Adoption/save evidence and 0.2.17 alpha activation, followed by bounded World Partition sculpt operations.</p></div><div><time>23–24 OCT 2026</time><b>Independent reload attempt blocked</b><p>Stage 2E startup failed before Landscape acceptance. Offline diagnosis investigated a probable TedsOutliner startup-order path.</p></div><div><time>24 OCT 2026</time><b>Terrain reconciliation & acceptance audit</b><p>Live collision and package integrity checks passed. Independent disk reload and close-up visual acceptance remain blocked in the report.</p></div></div>
          <button className="enc-inline-link" onClick={()=>void openRecord(catalog.records.find(r=>r.path.includes('Development_Timeline'))!.id)}>Open the full recorded chronology →</button>
          <h2 id="overview-4">Evidence & acceptance</h2><div className="enc-evidence"><span className="enc-badge warning">Partial acceptance</span><h3>Landscape: retain the unresolved gates</h3><p>The October 24 report records five collision traces in the loaded Editor and a protected-file integrity audit. Independent reload and target-feature visual review remain blocked. The west hill retains its historical <code>validation_failed_partial</code> result.</p><button onClick={()=>void openRecord(terrain.id)}>Read the acceptance report →</button></div>
          <h3>Read status in context</h3><p><b>Verified</b> means a named check passed within its evidence boundary. <b>Partial</b>, <b>Failed</b>, <b>Pending</b>, and <b>Superseded</b> belong to individual historical claims. <b>Archived</b> identifies a preserved record; it does not certify its conclusions.</p>
          <pre><code>{`inspection → preview → review → authorized apply\n           → validation → saved / reloaded evidence\n\nBuild ≠ live editor ≠ visual acceptance ≠ performance`}</code></pre>
          <h2 id="overview-5">Archive index</h2><p>{catalog.scope} This is a published reading snapshot of the broader local archive, with coverage stated explicitly.</p>
          <div className="enc-quick-links">{['Architecture','Reports','Landscape','Changelogs','Archive'].map(name=><button key={name} onClick={()=>navigateCategory(name)}>{name}<span>→</span></button>)}</div>
          <details className="enc-integrity"><summary>How this encyclopedia is maintained</summary><p>Original Markdown records are indexed into a reproducible snapshot. Each record retains its source-relative path and SHA-256 of the original bytes. Local paths and credential assignments are redacted from published text. Nested archives and raw runtime evidence require separate publication review. The source master index contains historical inventory figures; the count above covers only records actually available here.</p><button className="enc-inline-link" onClick={()=>void openRecord(master.id)}>Read the original master index →</button></details>
        </>:<>
          <div className="enc-eyebrow">BROWSE THE RECORD</div><h1>{query?'Search results':category}</h1><p className="enc-lead">{filtered.length} indexed records{query?` matching “${query}”`:'. Source documents, preserved in context.'}</p>
          <div className="enc-callout compact">Records are historical snapshots. “Archived” describes preservation, not a passing acceptance verdict.</div>
          {filtered.length===0?<p>No published records match this view. Try another search or browse the complete archive.</p>:<div className="enc-record-list">{filtered.map(record=><button key={record.id} onClick={()=>void openRecord(record.id)}><small>{record.category}<span className={`enc-badge ${record.status==='Blocked'?'warning':''}`}>{record.status}</span></small><strong>{record.title}</strong><span>{record.excerpt}</span><code>{record.path}</code></button>)}</div>}
        </>}
        <footer className="enc-footer"><span>ForgeMCP / Majestic Creations</span><a href="/projects/forgemcp/">Back to the project ↗</a></footer>
      </article>
      <aside className="enc-right" aria-label="Article context">
        <div><h2>ON THIS PAGE</h2><nav aria-label="Table of contents">{toc.length?toc.map(h=><a key={h.id} href={`#${h.id}`}>{h.text}</a>):<span>Choose a record to read its sections.</span>}</nav></div>
        <div><h2>PAGE STATUS</h2><span className={`enc-badge ${selected?.status==='Blocked'?'warning':''}`}>{selected?.status||'Curated index'}</span><p>{selected?'Historical source record. Read the report for individual check outcomes.':'Source-backed overview. Broader archive ingestion remains partial.'}</p></div>
        <div><h2>METADATA</h2><dl><dt>Snapshot</dt><dd>{catalog.snapshot}</dd><dt>Category</dt><dd>{selected?.category||category}</dd><dt>Format</dt><dd>{selected?'Markdown derivative':'Engineering index'}</dd><dt>Coverage</dt><dd>{catalog.records.length} published records</dd></dl></div>
        <div><h2>HISTORY SPOTLIGHT</h2><button onClick={()=>void openRecord(terrain.id)}>Terrain acceptance audit <span>24 Oct 2026 · Blocked gates</span></button><button onClick={()=>void openRecord(catalog.records.find(r=>r.path.includes('Version_History'))!.id)}>Version history <span>Recorded release progression</span></button></div>
        <div><h2>RELATED SOURCES</h2>{catalog.records.filter(r=>r.path.endsWith('Bridge_Protocol.md')||r.path.endsWith('ForgeMCP_Known_Issues.md')||r.id===master.id).map(r=><button key={r.id} onClick={()=>void openRecord(r.id)}>▤ {r.title}</button>)}</div>
        <p className="enc-right-foot">Keep the failures.<br/>Preserve the evidence.</p>
      </aside>
    </div>
  </main>;
}
