import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me | Majestic Creations",
  description: "Biography and background of Kenneth Salmon, the independent creator behind Majestic Creations.",
};

export default function AboutPage() {
  return (
    <main className="about-page" id="top">
      <header className="site-header about-header">
        <a className="brand" href="/" aria-label="Majestic Creations home"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a>
        <nav aria-label="Primary navigation"><a href="/#work">Projects</a><a href="/#studio">Studio</a><a href="/blog">Blog</a><a href="/community">Community</a><a href="/#support">Support</a><a href="/about" aria-current="page">About Me</a></nav>
        <a className="header-cta" href="https://linktr.ee/Ken_S" target="_blank" rel="noreferrer">Connect / View Portfolios <span>↗</span></a>
      </header>

      <section className="about-hero">
        <div className="about-grid" aria-hidden="true" />
        <div className="about-intro">
          <p className="eyebrow"><span /> The person behind the projects</p>
          <h1>About<br /><em>me.</em></h1>
          <p>From traditional digital media and professional audio-visual production to artificial intelligence, coding, and modern creative technology.</p>
        </div>

        <div className="biography-layout">
          <div className="portrait-column">
            <figure className="portrait-photo">
              <img src="/about/kenneth-salmon.png" alt="Portrait of Kenneth Salmon" />
            </figure>
            <div className="about-socials">
              <p className="section-kicker">Socials</p>
              <a href="https://x.com/Cmdr_Striker" target="_blank" rel="noreferrer" aria-label="Follow Kenneth Salmon on X at Cmdr Striker">
                <span className="social-platform">X</span>
                <span><small>Username</small><span className="social-username">@Cmdr_Striker</span></span>
                <b aria-hidden="true">↗</b>
              </a>
            </div>
          </div>
          <article className="biography-content">
            <p className="section-kicker">Biography</p>
            <h2>Kenneth<br />Salmon</h2>
            <div className="bio-rule" />
            <p>Kenneth is a multidisciplinary digital creative with a professional background spanning graphic design, multimedia production, videography, video editing, photography, live streaming, web design, digital media, and audio-visual production.</p>
            <p>After completing his training in Creative Digital Media and continuing his studies in Multimedia &amp; Animation, Kenneth spent the years from 2012 through 2024 applying those skills across a wide range of creative and technical environments. His work included graphic design, multimedia production, promotional content, videography and post-production, live-event recording, live streaming, audio-visual setup and operation, and other professional media-production responsibilities.</p>
            <p>A significant part of that experience involved church and event media production, including recording and editing church sermons, operating live-streaming systems, producing video content, managing audio and visual equipment, and supporting live presentations and services. He also worked with wedding videography and event production, capturing important moments and transforming raw footage into polished finished media.</p>
            <p>Over those years, Kenneth developed practical experience working across the entire production process—from cameras, audio equipment, lighting, computers, and live-streaming systems to editing, graphics, digital publishing, and final delivery. His background gave him an understanding not only of visual design, but of how multiple technologies come together behind the scenes to create a professional finished product.</p>
            <p>Beginning in 2025, his creative direction began shifting toward the rapidly evolving world of artificial intelligence and software development.</p>
            <p>AI has since become a major part of his creative workflow and experimentation. Kenneth has increasingly explored AI-assisted design, image generation, application concepts, UI/UX design, creative automation, digital research, content development, and AI-driven production workflows, combining emerging technology with more than a decade of traditional multimedia experience.</p>
            <p>At the same time, he has been branching further into coding and application development, largely through self-directed learning. Rather than approaching programming as a separate discipline, Kenneth sees it as an extension of the same creative process he has followed throughout his career: identifying an idea, understanding the tools needed to build it, experimenting, solving problems, and continually learning along the way.</p>
            <p>Today, his focus sits at the intersection of design, artificial intelligence, coding, and digital product development. He continues to teach himself new technologies while building applications, interfaces, creative tools, visual concepts, and experimental projects that combine his established multimedia background with the possibilities offered by modern AI.</p>
            <p>His career has evolved alongside the technology itself—from traditional graphic design, cameras, editing suites, live production, and multimedia systems to AI-powered creative workflows and software development.</p>
            <p>For Kenneth, the tools may have changed, but the objective has remained the same: take an idea, learn what is necessary to build it, and turn it into something real.</p>
          </article>
        </div>
      </section>

      <footer className="about-footer">
        <a className="brand" href="/"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a>
        <p>Apps · Games · Worlds · Ideas</p>
        <div><a href="/">Home</a><a href="https://github.com/mcographics" target="_blank" rel="noreferrer">GitHub</a><a href="https://linktr.ee/Ken_S" target="_blank" rel="noreferrer">Connect</a></div>
        <small>© {new Date().getFullYear()} Majestic Creations. Built independently in Gatineau, Québec.</small>
      </footer>
    </main>
  );
}
