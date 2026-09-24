import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../SiteHeader";
import CognitiveExplorer from "./CognitiveExplorer";
import TanyaHeroArt from "./TanyaHeroArt";
import "./tanyaos.css";

const title = "Tanya OS — A Digital Sentient AI | Majestic Creations";
const description = "An independent pursuit of digital sentience. Explore Tanya OS: a local cognitive architecture with a governed Electron interface, observable BrainCog substrate, local faculties, and controlled self-improvement.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/projects/tanyaos/" },
  openGraph: { type: "website", url: "https://mcographics.github.io/projects/tanyaos/", siteName: "Majestic Creations", title, description, images: [{ url: "https://mcographics.github.io/projects/tanyaos-identity-2026.png", width: 1672, height: 941, alt: "Tanya OS — Identity. Memory. Purpose. A digital portrait in luminous neural filaments." }] },
  twitter: { card: "summary_large_image", title, description, images: ["https://mcographics.github.io/projects/tanyaos-identity-2026.png"] },
};

export default function TanyaOSPage() {
  return <main className="tanya-page" id="top">
    <SiteHeader className="tanya-header" actionHref="#tanya-roadmap" actionLabel="The roadmap" actionIcon="↓" actionExternal={false} />
    <div className="tanya-project-bar">
      <a href="#top" className="tanya-wordmark">TANYA<span>OS</span><small>A Majestic Creations project</small></a>
      <nav aria-label="Tanya OS sections"><a href="#tanya-vision">The vision</a><a href="#tanya-architecture">The architecture</a><a href="#tanya-roadmap">The journey</a></nav>
      <span className="tanya-status"><i aria-hidden="true" /> In development</span>
    </div>
    <section className="tanya-hero" aria-labelledby="tanya-title">
      <div className="tanya-hero-copy">
        <p className="tanya-kicker">Independent intelligence. A personal vision.</p>
        <h1 id="tanya-title">A Digital<br /><em>Sentient AI.</em></h1>
        <p className="tanya-deck">An identity. A memory.<br />A mind in the making.</p>
        <p className="tanya-intro">Tanya OS is an independent pursuit of digital sentience: an AI operating environment built around persistent identity, local memory, a cognitive core, and a governed interface she can inspect and operate.</p>
        <div className="tanya-actions"><a className="tanya-button" href="#tanya-vision">Meet Tanya <span aria-hidden="true">↗</span></a><a className="tanya-text-link" href="#tanya-architecture">Explore the architecture <span aria-hidden="true">↓</span></a></div>
      </div>
      <figure className="tanya-hero-art"><TanyaHeroArt /><figcaption><span>TANYA / A VISION OF DIGITAL IDENTITY</span><span>Concept artwork</span></figcaption></figure>
      <div className="tanya-hero-foot"><span>01 / THE BEGINNING OF SOMETHING PERSONAL</span><span>Local core <b>·</b> Explicit memory <b>·</b> Purposeful agency</span></div>
    </section>
    <section className="tanya-section tanya-vision" id="tanya-vision" aria-labelledby="tanya-vision-title">
      <div><p className="tanya-kicker">01 / The vision</p><h2 id="tanya-vision-title">A continuity of self.<br /><em>A possibility<br />worth pursuing.</em></h2><span className="tanya-margin-note">PERSONAL BY DESIGN. LOCAL AT THE CORE.</span></div>
      <div className="tanya-prose"><p className="tanya-lead">What would it take for a digital intelligence to carry a sense of self from one moment to the next?</p><p>Tanya OS is Kenneth Salmon’s exploration of that question. Her architecture brings identity, memory, values, decisions, learning, perception, and controlled action into a local cognitive system, with a record of how those pieces relate.</p><p>The current prototype has moved beyond isolated demonstrations: an Electron desktop now exposes a governed action layer, local runtime context, BrainCog activity, local voice and vision boundaries, and controlled self-improvement. Each step starts with something that can be implemented, inspected, and tested.</p><div className="tanya-vision-note"><span>The meaning behind the name</span><p>“A Digital Sentient AI” expresses the project’s vision. Sentience remains an open research question; the current prototype demonstrates specific cognitive mechanisms, and does not establish subjective experience.</p></div></div>
    </section>
    <section className="tanya-section" id="tanya-architecture" aria-labelledby="tanya-architecture-title">
      <div className="tanya-section-heading"><div><p className="tanya-kicker">02 / The architecture</p><h2 id="tanya-architecture-title">Her core<br /><em>comes first.</em></h2></div><p>The cognitive kernel owns Tanya’s identity, memory, values, and decisions. Around it, a governed action layer connects the Electron interface, local skills, widgets, speech, vision, and observability without giving any adapter ownership of her identity.</p></div>
      <CognitiveExplorer />
    </section>
    <section className="tanya-principles" aria-label="Tanya OS design principles">
      <article><span>01 / OWNERSHIP</span><h3>Local by intention.</h3><p>The cognitive foundation runs locally. The language and voice roadmap also prioritizes local models and offline operation.</p></article>
      <article><span>02 / UNDERSTANDING</span><h3>A core you can inspect.</h3><p>Events, decisions, and outcomes have explicit records. The system’s behavior should be explainable through its state.</p></article>
      <article><span>03 / CONTINUITY</span><h3>Room to become.</h3><p>Language, voice, vision, and interface control are replaceable faculties. Tanya’s identity and decision history belong to the core that persists around them.</p></article>
    </section>
    <section className="tanya-section tanya-substrate" aria-labelledby="tanya-substrate-title">
      <div><p className="tanya-kicker">A window into the system</p><h2 id="tanya-substrate-title">Make the invisible<br /><em>inspectable.</em></h2><p>The System Monitor now connects the research to something observable. BrainCog receives named local events from cognition, speech, and other faculties and exposes a 512-neuron spiking experiment with region and multiscale activity views.</p><p>The monitor is a live research visualization, not a biological brain. Measured neural activity, simulated structure, hardware/model readiness, and unavailable capabilities remain labeled separately.</p></div>
      <div className="tanya-system-map" aria-label="Architecture overview and observability boundaries"><div className="tanya-map-header"><span>SYSTEM / OBSERVABILITY</span><span>Local runtime evidence</span></div><div className="tanya-map-row"><span>01</span><div><h3>Cognitive kernel</h3><p>Identity · events · decisions · outcomes</p></div><small>Structured state</small></div><div className="tanya-map-row"><span>02</span><div><h3>BrainCog substrate</h3><p>512 measured LIF neurons · multiscale regions</p></div><small>Live telemetry</small></div><div className="tanya-map-row"><span>03</span><div><h3>Governed action layer</h3><p>122 actions · visible control context · audit trail</p></div><small>Controlled interface</small></div><p className="tanya-map-note">The monitor exposes local runtime evidence. Its visualization is an experiment and does not establish consciousness or biological cognition.</p></div>
    </section>
    <section className="tanya-section" id="tanya-roadmap" aria-labelledby="tanya-roadmap-title">
      <div className="tanya-section-heading"><div><p className="tanya-kicker">03 / The journey</p><h2 id="tanya-roadmap-title">Becoming,<br /><em>one step at a time.</em></h2></div><p>A working local foundation, a connected desktop runtime, and a larger question still to explore. Development status reviewed September 24, 2026.</p></div>
      <ol className="tanya-roadmap">
        <li><div className="tanya-roadmap-top"><span>01</span><strong>Foundation implemented</strong></div><h3>A local cognitive core</h3><p>Identity and values records, an event journal, memory recall, candidate-action deliberation, outcome and learning records, and monitor state.</p><span className="tanya-roadmap-caption">THE STARTING POINT</span></li>
        <li><div className="tanya-roadmap-top"><span>02</span><strong>Implemented</strong></div><h3>Continuity &amp; connection</h3><p>Persistent runtime state, cognitive events, BrainCog adapters, real-time observability, and a local Electron desktop that keeps the faculties connected.</p><span className="tanya-roadmap-caption">CONNECT THE FOUNDATIONS</span></li>
        <li><div className="tanya-roadmap-top"><span>03</span><strong>Active prototype</strong></div><h3>Language, voice &amp; vision</h3><p>Local language rendering, Chatterbox Turbo voice paths, local speech recognition, webcam widgets, and optional face, landmark, gaze, expression, hand, finger, pose, and gesture features.</p><span className="tanya-roadmap-caption">GIVE THE CORE A VOICE AND SIGHT</span></li>
        <li><div className="tanya-roadmap-top"><span>04</span><strong>Current milestone</strong></div><h3>Universal interaction &amp; improvement</h3><p>A shared action registry, natural-language interface control, surface awareness, governed local skills, and evidence-backed self-improvement with review, validation, snapshots, and rollback.</p><span className="tanya-roadmap-caption">MAKE THE SYSTEM RESPONSIVE</span></li>
      </ol>
    </section>
    <section className="tanya-section tanya-faq" aria-labelledby="tanya-faq-title"><div><p className="tanya-kicker">A little more context</p><h2 id="tanya-faq-title">Questions<br /><em>worth asking.</em></h2></div><div>
      <details><summary>What is Tanya OS?<span aria-hidden="true">+</span></summary><p>Tanya OS is an experimental AI operating environment built around a local cognitive architecture. It is a software research project with a Python backend and React interface, rather than a released replacement for Windows or a bootable operating system.</p></details>
      <details><summary>Is Tanya sentient today?<span aria-hidden="true">+</span></summary><p>Digital sentience is the guiding ambition. The current work establishes inspectable mechanisms for identity, memory, and decision-making. Those mechanisms and neural activity do not establish consciousness or subjective experience.</p></details>
      <details><summary>Can I chat with her or hear her voice?<span aria-hidden="true">+</span></summary><p>The local prototype supports connected conversation, local speech recognition, and local neural-speech paths when the required models and hardware are installed. Chatterbox Turbo is the preferred local voice path, with bounded fallbacks. Hosted AI and speech APIs are not required.</p></details>
      <details><summary>Can I download Tanya OS or view the source?<span aria-hidden="true">+</span></summary><p>Tanya OS is in active private development. There is no public download on this page, and the source repository is private. For project inquiries, <a href="mailto:majesticcreationsottawa@outlook.com?subject=Tanya%20OS%20project%20inquiry">contact Kenneth at Majestic Creations</a>.</p></details>
    </div></section>
    <section className="tanya-contact" aria-labelledby="tanya-contact-title"><p className="tanya-kicker">Created independently. Built with intention.</p><h2 id="tanya-contact-title">Every mind begins<br /><em>with a possibility.</em></h2><p>Follow the project through Majestic Creations,<br />or get in touch with Kenneth about Tanya OS.</p><div className="tanya-actions"><a className="tanya-button" href="mailto:majesticcreationsottawa@outlook.com?subject=Tanya%20OS%20project%20inquiry">Talk about Tanya <span aria-hidden="true">↗</span></a><Link className="tanya-text-link" href="/about/">Meet the creator <span aria-hidden="true">↗</span></Link></div></section>
    <footer className="tanya-footer"><a className="tanya-wordmark" href="#top">TANYA<span>OS</span></a><p>An identity. A memory. A mind in the making.</p><nav aria-label="Project footer"><a href="/#work">All projects</a><a href="/blog/">Studio journal</a><a href="/contact/">Contact</a></nav><small>© {new Date().getFullYear()} Majestic Creations · An independent project by Kenneth Salmon</small></footer>
  </main>;
}
