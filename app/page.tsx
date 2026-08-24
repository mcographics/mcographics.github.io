const disciplines = [
  { number: "01", title: "Desktop & Mobile Apps", text: "Useful, thoughtfully crafted software designed for real people and everyday work." },
  { number: "02", title: "Unreal Engine", text: "Interactive worlds, gameplay systems, environments, and experiments built in Unreal Engine." },
  { number: "03", title: "Unity", text: "Games, prototypes, and cross-platform interactive experiences built with Unity." },
  { number: "04", title: "Creative Portfolio", text: "A growing collection of design, development, storytelling, and multidisciplinary work." },
];

const projects = [
  { kind: "APPLICATION", title: "Creator-built software", text: "Original desktop and mobile tools focused on privacy, usefulness, and lasting value.", accent: "gold" },
  { kind: "UNREAL ENGINE", title: "Worlds in development", text: "Game concepts, environments, technical systems, and behind-the-scenes progress.", accent: "blue" },
  { kind: "UNITY", title: "Interactive experiments", text: "Playable prototypes and ideas shaped through iteration, curiosity, and craft.", accent: "violet" },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Majestic Creations home"><span className="brand-mark">M</span><span>MAJESTIC <b>CREATIONS</b></span></a>
        <nav aria-label="Primary navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#support">Support</a></nav>
        <a className="header-cta" href="https://linktr.ee/KennethSalmon" target="_blank" rel="noreferrer">Let&apos;s talk <span>↗</span></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow" />
        <p className="eyebrow"><span /> Independent multidisciplinary studio</p>
        <h1>Ideas made<br /><em>majestic.</em></h1>
        <p className="hero-copy">Apps, games, immersive worlds, and creative experiments—designed and developed with purpose by one passionate creator.</p>
        <div className="hero-actions"><a className="button primary" href="#work">Explore the work <span>↓</span></a><a className="text-link" href="#about">Meet the creator <span>↗</span></a></div>
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="hero-note">BUILDING ACROSS<br /><b>CODE × WORLDS × DESIGN</b></div>
      </section>

      <section className="manifesto" id="about">
        <p className="section-label">What I create</p>
        <div><h2>One creator.<br /><span>Many disciplines.</span></h2><p>Majestic Creations is where software engineering, game development, and visual creativity meet. Every project begins with a simple question: <em>can this be useful, memorable, or meaningful?</em></p></div>
      </section>

      <section className="disciplines" aria-label="Creative disciplines">
        {disciplines.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><b>↗</b></article>)}
      </section>

      <section className="work" id="work">
        <div className="section-heading"><div><p className="section-label">Selected directions</p><h2>A studio in motion.</h2></div><p>The portfolio is growing alongside the work. Follow each discipline as new projects, releases, and development stories arrive.</p></div>
        <div className="project-grid">
          {projects.map((project, index) => <article className={`project-card ${project.accent}`} key={project.kind}><div className="project-visual"><span>0{index + 1}</span><i /></div><p>{project.kind}</p><h3>{project.title}</h3><div className="project-copy">{project.text}<span>Coming soon</span></div></article>)}
        </div>
      </section>

      <section className="support" id="support">
        <div><p className="section-label">Fuel independent creation</p><h2>Help keep the ideas<br /><em>moving forward.</em></h2></div>
        <div><p>Support helps fund continued development, maintenance, tools, and the time it takes to keep independent apps and creative projects alive.</p><a className="button primary" href="https://linktr.ee/KennethSalmon" target="_blank" rel="noreferrer">Connect & follow <span>♡</span></a><small>Direct donation options are coming soon.</small></div>
      </section>

      <footer><a className="brand" href="#top"><span className="brand-mark">M</span><span>MAJESTIC <b>CREATIONS</b></span></a><p>Apps. Games. Worlds. Ideas.</p><div><a href="https://linktr.ee/KennethSalmon" target="_blank" rel="noreferrer">Connect</a><a href="#work">Portfolio</a><a href="#support">Support</a></div><small>© {new Date().getFullYear()} Majestic Creations. Built independently.</small></footer>
    </main>
  );
}
