import type { Metadata } from "next";
import SiteHeader from "../../SiteHeader";
import "./forge.css";

const sourceUrl = "https://github.com/mcographics/ForgeMCP";

export const metadata: Metadata = {
  title: "ForgeMCP | Unreal Engine & Blender AI Automation · Majestic Creations",
  description: "ForgeMCP is a free, open-source local MCP integration connecting AI development clients such as Codex with Unreal Engine and Blender through reviewed native workflows.",
  alternates: { canonical: "/projects/forgemcp/" },
  openGraph: { title: "ForgeMCP | Majestic Creations", description: "AI-powered Unreal Engine and Blender automation. Free and open source, in active development.", url: "/projects/forgemcp/", images: [{ url: "/projects/forgemcp/banner.jpg", width: 1536, height: 658, alt: "ForgeMCP developer tooling banner" }] },
  twitter: { card: "summary_large_image", title: "ForgeMCP | Majestic Creations", images: ["/projects/forgemcp/banner.jpg"] },
};
const features = [
  ["01","Unreal Engine integration","Read project and editor state, inspect actors and assets, and use reviewed native commands for supported actor and Blueprint operations."],
  ["02","Blender integration","Inspect objects, rigs, animation and materials; perform bounded scene operations through a purpose-built Blender add-on."],
  ["03","Asset transfers","Stage supported static meshes from Blender, validate geometry and material facts, and import them into Unreal through reviewed transfers."],
  ["04","Blueprint engineering","Create and compile Blueprint actors, add approved graph elements and functions, and report compiler diagnostics instead of guessing at success."],
  ["05","Landscape experiments","Native Landscape preview/apply, hill, valley, smoothing, heightmap and coastline tools have passed an isolated proof of concept, not full city-world acceptance."],
  ["06","Safety and verification","Local authenticated connections, explicit target sessions, one-use previews, approvals, validation receipts and guarded recovery operations."],
];
const steps = [
  ["01","Codex / MCP client","A developer gives a natural-language instruction."],
  ["02","ForgeMCP server","The local Python MCP server validates and routes the request."],
  ["03","Native adapters","The Unreal C++ plugin or Blender Python add-on handles supported operations."],
  ["04","Editor workflow","Actions run in the chosen project or scene with review boundaries."],
  ["05","Verified result","The client receives structured results, errors and diagnostics."],
];
export default function ForgeMCPPage() {
  return <main className="forge-page" id="top">
    <SiteHeader actionHref={sourceUrl} actionLabel="Source on GitHub" actionIcon="↗" />
    <div className="forge-wrap">
      <div className="forge-topline"><a href="/projects/unreal-engine/">← Unreal Engine / JasperPrism</a><span className="forge-live-badge">Open source · In development</span></div>
      <figure className="forge-banner"><img src="/projects/forgemcp/banner.jpg" width={1536} height={658} alt="ForgeMCP geometric logo and a visual diagram connecting Unreal Engine and Blender tools" /><figcaption>ForgeMCP identity and pipeline illustration. Brand artwork, not a screenshot of the running tools.</figcaption></figure>
      <section className="forge-intro" aria-labelledby="forge-title">
        <div><p className="forge-kicker">Unreal Engine · Blender · Developer tools</p><h1 id="forge-title">Your creative applications, <span>connected to AI.</span></h1><p className="forge-lead">ForgeMCP is an original, free and open-source integration that helps an AI development client inspect, build and automate supported tasks inside Unreal Engine and Blender—without pretending those applications are a single black box.</p><div className="forge-actions"><a className="forge-action" href={sourceUrl} target="_blank" rel="noopener noreferrer">Explore the source ↗</a><a className="forge-action secondary" href="#how-it-works">How it works ↓</a></div></div>
        <aside className="forge-intro-side"><p>Developed by Majestic Creations with OpenAI Codex in Visual Studio Code as the primary intended client. ForgeMCP uses the open Model Context Protocol (MCP) so supported AI clients can call well-defined local tools.</p></aside>
      </section>
      <dl className="forge-facts"><div><dt>License</dt><dd>MIT · Open source</dd></div><div><dt>Primary workflow</dt><dd>VS Code + Codex</dd></div><div><dt>Editor integration</dt><dd>Unreal 5.6.1 / Blender</dd></div><div><dt>Availability</dt><dd>Development source</dd></div></dl>
    </div>
    <section className="forge-band" id="how-it-works"><div className="forge-wrap"><p className="forge-kicker">01 / The connection</p><h2>What exactly is an MCP?</h2><p>Model Context Protocol is an open standard for letting AI applications discover and call external tools. ForgeMCP is the bridge—not the AI model or a replacement game engine. Its local server exposes approved capabilities, communicates with the editor adapters, then returns results the AI client can inspect. Unreal and Blender remain separate applications under the creator’s control.</p><div className="forge-pipeline">{steps.map(([number,title,description])=><article key={number}><strong>{title}</strong><span>{description}</span></article>)}</div></div></section>
    <section className="forge-section" id="capabilities"><div className="forge-wrap"><p className="forge-kicker">02 / Capabilities</p><h2>One bridge. Two creative worlds.</h2><p>ForgeMCP is built as a focused tool layer for professional workflows. Support is intentionally scoped: individual capabilities have different validation levels, and unsupported operations should return clear errors.</p><div className="forge-feature-grid">{features.map(([number,title,description])=><article className="forge-feature" key={number}><small>{number} / FORGEMCP</small><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
    <section className="forge-section" id="status"><div className="forge-wrap"><p className="forge-kicker">03 / Development status</p><h2>Working foundations. Carefully expanding.</h2><div className="forge-columns"><article className="forge-status-panel"><h3>Validated development milestones</h3><ul><li>Foundation inspection and MCP communication between Codex, the local server and native adapters.</li><li>Guarded Blueprint creation, compilation, graph edits and actor workflows in isolated Unreal test sessions.</li><li>Blender inspection, static-mesh export and reviewed cross-application transfers with validation receipts.</li><li>An isolated Unreal Landscape test passed creation, sculpting, smoothing, saving and reload checks.</li></ul></article><article className="forge-status-panel forge-warning"><h3>Still in development</h3><ul><li>General-purpose control over every Blueprint, actor type, material and engine feature.</li><li>Broad World Partition, PCG, UMG, skeletal asset and complex character interchange workflows.</li><li>Interactive performance and end-to-end acceptance across arbitrary user projects and installations.</li><li>A polished general release with compatibility guarantees beyond the documented development targets.</li></ul></article></div></div></section>
    <section className="forge-section forge-faq" id="faq"><div className="forge-wrap"><p className="forge-kicker">04 / Frequently asked</p><h2>Important details before you start.</h2>
      <details><summary>Does ForgeMCP replace Unreal Engine or Blender?</summary><p>No. Both programs remain separately installed. ForgeMCP exposes selected native operations so an authorized MCP client can automate supported tasks.</p></details>
      <details><summary>Does ForgeMCP require Codex?</summary><p>Codex inside Visual Studio Code is the main development and testing workflow. The core server uses the open MCP standard, although wider client compatibility has not all been validated.</p></details>
      <details><summary>Can it build an entire city automatically?</summary><p>Not as a completed, validated end-to-end feature. Bounded landscape and actor workflows exist, but whole-world generation, road grading, asset assembly and performance still require separate development and acceptance tests.</p></details>
      <details><summary>Is it cloud-based or paid?</summary><p>ForgeMCP itself is a free, locally running MIT-licensed integration. The server and adapters do not require a paid cloud API. Your choice of AI client and software installations have their own requirements.</p></details>
      <details><summary>Where can I find installation instructions?</summary><p>The public GitHub repository contains the source and a <a href="https://github.com/mcographics/ForgeMCP/blob/main/Documentation/Installation.md" target="_blank" rel="noopener noreferrer"><u>source installation guide ↗</u></a>. This is development software; supported builds, adapter versions and current validation limits are documented there.</p></details>
      <details><summary>Is this an official Epic Games or Blender product?</summary><p>No. ForgeMCP is independently developed by Majestic Creations and is not affiliated with or endorsed by Epic Games or the Blender Foundation.</p></details>
    </div></section>
    <footer className="forge-footer"><div className="forge-footer-inner forge-wrap"><div><strong>ForgeMCP</strong><p>Build with intention. Verify every step.</p></div><nav aria-label="ForgeMCP footer links"><a href="/projects/unreal-engine/">JasperPrism</a><a href={sourceUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="/contact/">Contact</a><a href="/">Majestic Creations</a></nav></div></footer>
  </main>;
}