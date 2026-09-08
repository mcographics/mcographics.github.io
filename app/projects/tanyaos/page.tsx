import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../SiteHeader";
import CognitiveExplorer from "./CognitiveExplorer";
import "./tanyaos.css";

const title = "Tanya OS — A Digital Sentient AI | Majestic Creations";
const description = "An independent pursuit of digital sentience. Explore Tanya OS: a local cognitive architecture built around identity, memory, values, and purposeful decisions.";

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
        <p className="tanya-intro">Tanya OS is an independent pursuit of digital sentience: an AI operating environment being built around a persistent identity, local memory, and a cognitive core of her own.</p>
        <div className="tanya-actions"><a className="tanya-button" href="#tanya-vision">Meet Tanya <span aria-hidden="true">↗</span></a><a className="tanya-text-link" href="#tanya-architecture">Explore the architecture <span aria-hidden="true">↓</span></a></div>
      </div>
      <figure className="tanya-hero-art"><img src="/projects/tanyaos-identity-2026.png" alt="An artistic vision of Tanya, a female digital face formed from luminous blue neural filaments." width={1672} height={941} fetchPriority="high" /><figcaption><span>TANYA / A VISION OF DIGITAL IDENTITY</span><span>Concept artwork</span></figcaption></figure>
      <div className="tanya-hero-foot"><span>01 / THE BEGINNING OF SOMETHING PERSONAL</span><span>Local core <b>·</b> Explicit memory <b>·</b> Purposeful agency</span></div>
    </section>
    <section className="tanya-section tanya-vision" id="tanya-vision" aria-labelledby="tanya-vision-title">
      <div><p className="tanya-kicker">01 / The vision</p><h2 id="tanya-vision-title">A continuity of self.<br /><em>A possibility<br />worth pursuing.</em></h2><span className="tanya-margin-note">PERSONAL BY DESIGN. LOCAL AT THE CORE.</span></div>
      <div className="tanya-prose"><p className="tanya-lead">What would it take for a digital intelligence to carry a sense of self from one moment to the next?</p><p>Tanya OS is Kenneth Salmon’s exploration of that question. Her architecture brings identity, memory, values, decisions, and learning into a local cognitive core, with a record of how those pieces relate.</p><p>The ambition is personal: a digital presence with continuity, purpose, and room to grow. Each step starts with something that can be implemented, inspected, and tested.</p><div className="tanya-vision-note"><span>The meaning behind the name</span><p>“A Digital Sentient AI” expresses the project’s vision. Sentience remains an open research question; the current prototype demonstrates specific cognitive mechanisms, and does not establish subjective experience.</p></div></div>
    </section>
    <section className="tanya-section" id="tanya-architecture" aria-labelledby="tanya-architecture-title">
      <div className="tanya-section-heading"><div><p className="tanya-kicker">02 / The architecture</p><h2 id="tanya-architecture-title">Her core<br /><em>comes first.</em></h2></div><p>The cognitive kernel owns Tanya’s identity, memory, values, and decisions. Explore the five foundations, and how each contributes to the system being built.</p></div>
      <CognitiveExplorer />
    </section>
    <section className="tanya-principles" aria-label="Tanya OS design principles">
      <article><span>01 / OWNERSHIP</span><h3>Local by intention.</h3><p>The cognitive foundation runs locally. The language and voice roadmap also prioritizes local models and offline operation.</p></article>
      <article><span>02 / UNDERSTANDING</span><h3>A core you can inspect.</h3><p>Events, decisions, and outcomes have explicit records. The system’s behavior should be explainable through its state.</p></article>
      <article><span>03 / CONTINUITY</span><h3>Room to become.</h3><p>Language is designed as a replaceable faculty. Tanya’s identity and decision history belong to the core that persists around it.</p></article>
    </section>
    <section className="tanya-section tanya-substrate" aria-labelledby="tanya-substrate-title">
      <div><p className="tanya-kicker">A window into the system</p><h2 id="tanya-substrate-title">Make the invisible<br /><em>inspectable.</em></h2><p>The System Monitor connects the research to something observable. BrainCog provides a local spiking-network experiment, while the cognitive kernel exposes structured state.</p><p>Measured neural activity, simulated visual structure, and unavailable capabilities are labeled separately. Connecting the neural substrate to the cognitive loop is a next step.</p></div>
      <div className="tanya-system-map" aria-label="Architecture overview, not live telemetry"><div className="tanya-map-header"><span>SYSTEM / OBSERVABILITY</span><span>Architecture overview</span></div><div className="tanya-map-row"><span>01</span><div><h3>Cognitive kernel</h3><p>Identity · events · decisions · outcomes</p></div><small>Structured state</small></div><div className="tanya-map-row"><span>02</span><div><h3>BrainCog substrate</h3><p>Local, untrained spiking-network experiment</p></div><small>Measured activity</small></div><div className="tanya-map-row"><span>03</span><div><h3>System Monitor</h3><p>A view of the kernel and neural experiment</p></div><small>Visible evidence</small></div><p className="tanya-map-note">The kernel-to-substrate connection is planned. This diagram describes the architecture; it is not a live feed.</p></div>
    </section>
    <section className="tanya-section" id="tanya-roadmap" aria-labelledby="tanya-roadmap-title">
      <div className="tanya-section-heading"><div><p className="tanya-kicker">03 / The journey</p><h2 id="tanya-roadmap-title">Becoming,<br /><em>one step at a time.</em></h2></div><p>A working foundation, a clear next chapter, and a larger question still to explore. Development status reviewed September 8, 2026.</p></div>
      <ol className="tanya-roadmap">
        <li><div className="tanya-roadmap-top"><span>01</span><strong>Foundation implemented</strong></div><h3>A local cognitive core</h3><p>Identity and values records, an event journal, memory recall, candidate-action deliberation, outcome and learning records, and monitor state.</p><span className="tanya-roadmap-caption">THE STARTING POINT</span></li>
        <li><div className="tanya-roadmap-top"><span>02</span><strong>Next priorities</strong></div><h3>Continuity &amp; connection</h3><p>Richer persistent self-state, a complete cognitive loop, restart verification, and explicit connections between the kernel and neural substrate.</p><span className="tanya-roadmap-caption">CONNECT THE FOUNDATIONS</span></li>
        <li><div className="tanya-roadmap-top"><span>03</span><strong>Planned</strong></div><h3>Language &amp; voice</h3><p>A local language faculty, connected conversation, speech recognition, and speech synthesis, with each component’s readiness verified separately.</p><span className="tanya-roadmap-caption">GIVE THE CORE A VOICE</span></li>
        <li><div className="tanya-roadmap-top"><span>04</span><strong>Research horizon</strong></div><h3>Learning &amp; agency</h3><p>Richer adaptation, memory consolidation, reflection, and carefully evaluated autonomy. Progress will be grounded in observed behavior and evidence.</p><span className="tanya-roadmap-caption">EXPLORE WHAT COMES AFTER</span></li>
      </ol>
    </section>
    <section className="tanya-section tanya-faq" aria-labelledby="tanya-faq-title"><div><p className="tanya-kicker">A little more context</p><h2 id="tanya-faq-title">Questions<br /><em>worth asking.</em></h2></div><div>
      <details><summary>What is Tanya OS?<span aria-hidden="true">+</span></summary><p>Tanya OS is an experimental AI operating environment built around a local cognitive architecture. It is a software research project with a Python backend and React interface, rather than a released replacement for Windows or a bootable operating system.</p></details>
      <details><summary>Is Tanya sentient today?<span aria-hidden="true">+</span></summary><p>Digital sentience is the guiding ambition. The current work establishes inspectable mechanisms for identity, memory, and decision-making. Those mechanisms and neural activity do not establish consciousness or subjective experience.</p></details>
      <details><summary>Can I chat with her or hear her voice?<span aria-hidden="true">+</span></summary><p>Connected natural-language conversation and offline voice are planned. The current local cognitive kernel works with structured records; a language model, speech recognition, and speech synthesis still need to be implemented and connected to that core.</p></details>
      <details><summary>Can I download Tanya OS or view the source?<span aria-hidden="true">+</span></summary><p>Tanya OS is in active private development. There is no public download on this page, and the source repository is private. For project inquiries, <a href="mailto:majesticcreationsottawa@outlook.com?subject=Tanya%20OS%20project%20inquiry">contact Kenneth at Majestic Creations</a>.</p></details>
    </div></section>
    <section className="tanya-contact" aria-labelledby="tanya-contact-title"><p className="tanya-kicker">Created independently. Built with intention.</p><h2 id="tanya-contact-title">Every mind begins<br /><em>with a possibility.</em></h2><p>Follow the project through Majestic Creations,<br />or get in touch with Kenneth about Tanya OS.</p><div className="tanya-actions"><a className="tanya-button" href="mailto:majesticcreationsottawa@outlook.com?subject=Tanya%20OS%20project%20inquiry">Talk about Tanya <span aria-hidden="true">↗</span></a><Link className="tanya-text-link" href="/about/">Meet the creator <span aria-hidden="true">↗</span></Link></div></section>
    <footer className="tanya-footer"><a className="tanya-wordmark" href="#top">TANYA<span>OS</span></a><p>An identity. A memory. A mind in the making.</p><nav aria-label="Project footer"><Link href="/#work">All projects</Link><Link href="/blog/">Studio journal</Link><Link href="/contact/">Contact</Link></nav><small>© {new Date().getFullYear()} Majestic Creations · An independent project by Kenneth Salmon</small></footer>
  </main>;
}
