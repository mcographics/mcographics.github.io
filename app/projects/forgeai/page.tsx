import type { Metadata } from "next";
import SiteHeader from "../../SiteHeader";
import "../forgemcp/forge.css";

export const metadata: Metadata = {
  title: "ForgeAI | Intelligent 3D Creation · Majestic Creations",
  description: "ForgeAI is a developing Blender-focused intelligent 3D creation project exploring mesh diagnostics, guided repairs, AI-assisted modeling, and asset preparation.",
  alternates: { canonical: "/projects/forgeai/" },
};
const features = [
  ["01", "Mesh diagnostics", "Planned geometry inspection for non-manifold edges, disconnected components, intersecting faces, flipped normals, degeneracies and topology issues."],
  ["02", "Guided auto-repair", "Planned repair proposals with previews, reversible operations, confidence limits and before-and-after validation rather than destructive one-click promises."],
  ["03", "AI-assisted modeling", "Planned natural-language-assisted Blender operations, procedural creation and editing with explicit scene and object targeting."],
  ["04", "Topology and optimization", "Planned mesh cleanup, polygon-budget analysis and game-ready asset checks for practical 3D workflows."],
  ["05", "Asset preparation", "Planned export-readiness checks covering transforms, scale, normals, UVs and materials, including Unreal Engine-oriented workflows."],
  ["06", "Traceable workflows", "Planned diagnostic reports, change logs, user review gates and repeatable Blender-side tests."],
];
export default function ForgeAIPage() {
  return <main className="forge-page" id="top">
    <SiteHeader actionHref="/projects/forgemcp/" actionLabel="Explore ForgeMCP" actionIcon="→" actionExternal={false} />
    <div className="forge-wrap">
      <div className="forge-topline"><a href="/projects/forgemcp/">← ForgeMCP / Parent project</a><span className="forge-live-badge">Early development · Planned capabilities</span></div>
      <figure className="forge-banner">
        <img
          src="/projects/forgeai/banner-1916.webp"
          srcSet="/projects/forgeai/banner-1086.webp 1086w, /projects/forgeai/banner-1916.webp 1916w"
          sizes="(max-width: 1522px) 90vw, 1370px"
          alt="Official ForgeAI Intelligent 3D Creation banner with the ForgeAI wordmark and a 3D wireframe portrait."
          width={1916}
          height={821}
          fetchPriority="high"
          decoding="async"
        />
      </figure>
      <section className="forge-intro" aria-labelledby="forgeai-title">
        <div><p className="forge-kicker">ForgeMCP ecosystem · Blender · Intelligent 3D</p><h1 id="forgeai-title">ForgeAI: <span>Intelligent 3D Creation.</span></h1><p className="forge-lead">ForgeAI is a dedicated Blender-focused project designed to make complex 3D modeling, mesh inspection and repair workflows more understandable, controllable and efficient. It belongs to the ForgeMCP family but is developed as a separate product.</p><div className="forge-actions"><a className="forge-action" href="#capabilities">Explore the vision ↓</a><a className="forge-action secondary" href="/projects/forgemcp/">About ForgeMCP →</a></div></div>
        <aside className="forge-intro-side"><img className="forgeai-emblem" src="/projects/forgeai/orbit-emblem-640.webp" srcSet="/projects/forgeai/orbit-emblem-320.webp 320w, /projects/forgeai/orbit-emblem-640.webp 640w" sizes="132px" alt="Official ForgeAI Orbit Emblem." width={640} height={591} loading="lazy" decoding="async"/><p><strong>ForgeAI</strong><br/>An evolving Blender add-on concept combining deep mesh analysis, explainable repair and AI-assisted 3D workflows. Features listed below are development goals, not claims of released functionality.</p></aside>
      </section>
      <dl className="forge-facts"><div><dt>Parent ecosystem</dt><dd>ForgeMCP</dd></div><div><dt>Primary application</dt><dd>Blender</dd></div><div><dt>Project stage</dt><dd>Early development</dd></div><div><dt>Repository</dt><dd>Private</dd></div></dl>
    </div>
    <section className="forge-band" id="purpose"><div className="forge-wrap"><p className="forge-kicker">01 / Purpose</p><h2>From broken geometry to informed decisions.</h2><p>ForgeAI aims to analyze difficult meshes, identify the underlying issues, recommend appropriate repairs and verify outcomes inside Blender. The goal is to assist artists without concealing risks or silently changing original work.</p></div></section>
    <section className="forge-section" id="capabilities"><div className="forge-wrap"><p className="forge-kicker">02 / Planned capabilities</p><h2>A smarter Blender workflow.</h2><p>These are proposed development areas. Availability and supported Blender versions will be published only after implementation and testing.</p><div className="forge-feature-grid">{features.map(([number,title,description])=><article className="forge-feature" key={number}><small>{number} / FORGEAI · PLANNED</small><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
    <section className="forge-section" id="roadmap"><div className="forge-wrap"><p className="forge-kicker">03 / Roadmap</p><h2>Build, test, then expand.</h2><div className="forge-columns"><article className="forge-status-panel"><h3>Initial priorities</h3><ul><li>Establish Blender add-on architecture, documentation and test fixtures.</li><li>Build reliable mesh inspection and structured diagnostics.</li><li>Introduce previewable, reversible repair workflows with validation reports.</li></ul></article><article className="forge-status-panel forge-warning"><h3>Future development</h3><ul><li>AI-assisted modeling and procedural operations.</li><li>Topology optimization and game-asset preparation.</li><li>Broader compatibility and production testing.</li></ul></article></div></div></section>
    <section className="forge-section forge-faq"><div className="forge-wrap"><p className="forge-kicker">04 / About the project</p><h2>How ForgeAI relates to ForgeMCP.</h2><details><summary>Is ForgeAI the same product as ForgeMCP?</summary><p>No. ForgeMCP is the broader AI integration ecosystem for Unreal Engine and Blender. ForgeAI is a distinct Blender-focused product within that family.</p></details><details><summary>Can I download ForgeAI today?</summary><p>No public download is announced here. ForgeAI is in early development, and planned capabilities should not be mistaken for released features.</p></details><details><summary>Will ForgeAI modify meshes automatically?</summary><p>The intended design emphasizes explicit approval, previews, backups or undo-friendly operations, and verification before accepting repairs.</p></details></div></section>
    
  </main>;
}
