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
        <nav aria-label="Primary navigation"><a href="/#work">Projects</a><a href="/#studio">Studio</a><a href="/#support">Support</a><a href="/about" aria-current="page">About Me</a></nav>
        <a className="header-cta" href="https://linktr.ee/Ken_S" target="_blank" rel="noreferrer">Connect <span>↗</span></a>
      </header>

      <section className="about-hero">
        <div className="about-grid" aria-hidden="true" />
        <div className="about-intro">
          <p className="eyebrow"><span /> The person behind the projects</p>
          <h1>About<br /><em>me.</em></h1>
          <p>This biography page is ready for your story. Your background, creative journey, areas of expertise, and personal message will be added here when you provide them.</p>
        </div>

        <div className="biography-layout">
          <figure className="portrait-photo">
            <img src="/about/kenneth-salmon.png" alt="Portrait of Kenneth Salmon" />
          </figure>
          <article className="biography-placeholder">
            <p className="section-kicker">Biography</p>
            <h2>Kenneth<br />Salmon</h2>
            <div className="bio-rule" />
            <p>Your full biography will appear here. This space is prepared for information about who you are, what inspired Majestic Creations, the disciplines you work across, and the purpose behind the software, games, worlds, and ideas you create.</p>
            <p className="bio-note">Biography content to be supplied.</p>
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
