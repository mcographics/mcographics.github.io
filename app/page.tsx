"use client";

import { useState } from "react";

type Category = "All" | "Apps" | "Game Dev" | "Creative" | "Experiments";

const categories: Category[] = ["All", "Apps", "Game Dev", "Creative", "Experiments"];

const projects = [
  {
    title: "Work Day with God",
    category: "Apps" as Category,
    type: "Windows + Android",
    status: "Released",
    description: "A completely free, private, offline devotional app with daily KJV Scripture, reflections, prayers, scenic imagery, reminders, and reading history.",
    image: "/projects/work-day-with-god.png",
    imagePosition: "top",
    link: "https://github.com/mcographics/WorkDaywithGod",
    tags: ["Electron", "Android", "Local-first"],
    color: "#d9af55",
  },
  {
    title: "Unified AI Studio",
    category: "Creative" as Category,
    type: "Creative software suite",
    status: "In development",
    description: "A modular AI-powered workspace for transforming images, video, and visual media through generation, reconstruction, and cinematic workflows.",
    image: "/projects/unified-ai-studio-logo.png",
    tags: ["Python", "PySide6", "AI tools"],
    color: "#d9af55",
  },
  {
    title: "Comic Organizer",
    category: "Apps" as Category,
    type: "Windows desktop app",
    status: "In development",
    description: "A private, local-first library for finding, organizing, searching, and safely managing CBZ and CBR comic archives.",
    image: "/projects/comic-organizer.png",
    tags: ["Electron", "React", "Local-first"],
    color: "#d9af55",
  },
  {
    title: "Words of Yeshua",
    category: "Apps" as Category,
    type: "Scripture study app",
    status: "Active release",
    description: "A Christ-centered desktop study companion for exploring the words of Yeshua inside complete KJV chapter context.",
    image: "/projects/words-of-yeshua.png",
    tags: ["TypeScript", "Electron", "KJV"],
    color: "#d9af55",
  },
  {
    title: "Truth News",
    category: "Apps" as Category,
    type: "Windows desktop app",
    status: "Public project",
    description: "A local-first Christian news, Scripture, history, timeline, and prophecy application built around evidence and context.",
    image: "/projects/truth-news.jpg",
    link: "https://github.com/mcographics/TruthNewsApp",
    tags: ["React", "TypeScript", "Research"],
    color: "#d9af55",
  },
  {
    title: "Re:TUI",
    category: "Experiments" as Category,
    type: "Android launcher",
    status: "Public project",
    description: "A fork of the Re:TUI Android launcher, customized for my preferences with terminal styling, widgets, modules, presets, and Termux integration.",
    link: "https://re-tui.pages.dev",
    tags: ["Kotlin", "Android", "Terminal UI"],
    color: "#d9af55",
    visual: "terminal",
  },
  {
    title: "BridgeForge",
    category: "Game Dev" as Category,
    type: "Unreal + Blender platform",
    status: "Building",
    description: "A focused ecosystem concept for Unreal Engine and Blender creators—bringing scattered tools, learning, and community resources together.",
    tags: ["Unreal Engine", "Blender", "Creator tools"],
    color: "#d9af55",
    image: "/projects/bridgeforge.png",
  },
  {
    title: "Grace Seek",
    category: "Apps" as Category,
    type: "Bible study desktop app",
    status: "In development",
    description: "A polished Scripture exploration app combining Bible search and reading with Strong’s lexicon, original-language datasets, and atlas-style place lookup.",
    tags: ["Bible study", "Strong’s", "Local datasets"],
    color: "#d9af55",
    image: "/projects/grace-seek.png",
  },
  {
    title: "Space Eye",
    category: "Experiments" as Category,
    type: "Space awareness app",
    status: "In development",
    description: "A real-time space-awareness experience that visualizes the solar system, tracks cosmic activity, and gathers public UFO and orb-sighting data.",
    tags: ["JavaScript", "Visualization", "Public data"],
    color: "#d9af55",
    image: "/projects/space-eye.png",
  },
  {
    title: "TanyaOS",
    category: "Experiments" as Category,
    type: "AI cognitive interface",
    status: "Research project",
    description: "A modular AI operating-system concept connecting a language model with structured memory, morality, reasoning, and autonomous decision-making subsystems.",
    tags: ["Python", "React", "Cognitive AI"],
    color: "#d9af55",
    image: "/projects/tanya-os.png",
  },
  {
    title: "WorkSpaces",
    category: "Creative" as Category,
    type: "Creative workspace",
    status: "In development",
    description: "An all-in-one creative environment that combines visual canvases, brainstorming, document writing, book formatting, and story architecture.",
    tags: ["TypeScript", "Writing", "Visual canvas"],
    color: "#d9af55",
    visual: "workspace",
    monogram: "WS",
  },
];

function ProjectVisual({ project }: { project: (typeof projects)[number] }) {
  if (project.image) {
    return <img src={project.image} alt={`${project.title} project preview`} style={{ objectPosition: project.imagePosition ?? "center" }} />;
  }
  return (
    <div className={`generated-visual ${project.visual ?? "abstract"}`} aria-hidden="true">
      <span>{project.visual === "terminal" ? ">_" : project.monogram ?? "MC"}</span>
      <i /><i /><i />
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const visibleProjects = activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory);

  return (
    <main id="top">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Majestic Creations home"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a>
        <nav aria-label="Primary navigation"><a href="#work">Projects</a><a href="#studio">Studio</a><a href="#support">Support</a></nav>
        <a className="header-cta" href="https://linktr.ee/Ken_S" target="_blank" rel="noreferrer">Connect <span>↗</span></a>
      </header>

      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orbit" aria-hidden="true"><i /><i /><i /></div>
        <div className="hero-content">
          <p className="eyebrow"><span /> Independent multidisciplinary studio</p>
          <h1>Building useful<br /><em>digital worlds.</em></h1>
          <p className="hero-copy">A living portfolio of local-first apps, game-development projects, and creative technology—designed and built by Kenneth Salmon.</p>
          <div className="hero-actions"><a className="button primary" href="#work">Explore projects <span>↓</span></a><a className="button ghost" href="https://github.com/mcographics" target="_blank" rel="noreferrer">GitHub profile <span>↗</span></a></div>
          <div className="hero-stats"><span><b>{projects.length}</b> GitHub projects</span><span><b>04</b> disciplines</span><span><b>01</b> independent studio</span></div>
        </div>
        <a className="hero-feature" href="https://github.com/mcographics/WorkDaywithGod" target="_blank" rel="noreferrer">
          <div className="feature-chrome"><span>Featured release</span><i>01 / {projects.length}</i></div>
          <img src="/projects/work-day-with-god.png" alt="Work Day with God application interface" />
          <div className="feature-caption"><span><small>Devotional application</small><strong>Work Day with God</strong></span><b>↗</b></div>
        </a>
        <div className="scroll-cue">Scroll to explore <span>↓</span></div>
      </section>

      <section className="work" id="work">
        <div className="work-intro">
          <div><p className="section-kicker">Complete project archive</p><h2>All<br /><em>projects.</em></h2></div>
          <p>Every GitHub project by Majestic Creations—software, tools, experiments, and worlds at different stages of the journey, from released applications to ambitious ideas taking shape.</p>
        </div>

        <div className="filter-bar" role="group" aria-label="Filter projects">
          {categories.map((category) => <button key={category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category}>{category}<span>{category === "All" ? projects.length : projects.filter((project) => project.category === category).length}</span></button>)}
        </div>

        <div className="project-grid" aria-live="polite">
          {visibleProjects.map((project) => (
            <article className="project-card" key={project.title} style={{ "--project-color": project.color } as React.CSSProperties}>
              <div className="project-media"><ProjectVisual project={project} /><div className="project-status"><i />{project.status}</div><span className="project-category">{project.category}</span></div>
              <div className="project-info">
                <div className="project-heading"><span><small>{project.type}</small><h3>{project.title}</h3></span>{project.link ? <a href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}>↗</a> : <span className="project-lock">Studio project</span>}</div>
                <p>{project.description}</p>
                <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="studio" id="studio">
        <div className="studio-statement"><p className="section-kicker">The studio</p><h2>One creator.<br />No creative borders.</h2></div>
        <div className="studio-copy"><p>Majestic Creations is the umbrella for everything I build: practical desktop software, mobile experiences, AI-assisted creative tools, Unreal and Unity development, visual design, and the strange experiments between them.</p><p>The common thread is independence—useful products, thoughtful interfaces, local-first foundations, and ideas worth maintaining.</p></div>
        <div className="discipline-marquee" aria-label="Studio disciplines"><span>APP DEVELOPMENT</span><i>✦</i><span>UNREAL ENGINE</span><i>✦</i><span>UNITY</span><i>✦</i><span>CREATIVE AI</span><i>✦</i><span>VISUAL DESIGN</span></div>
      </section>

      <section className="support" id="support">
        <div><p className="section-kicker">Support independent work</p><h2>Help the next idea<br /><em>become real.</em></h2></div>
        <div className="support-copy"><p>Support helps cover development time, maintenance, testing, hosting, creative tools, and the unglamorous work that keeps independent software alive.</p><a className="button primary" href="https://linktr.ee/Ken_S" target="_blank" rel="noreferrer">Connect & follow <span>♡</span></a><small>Direct donation options will be added here soon.</small></div>
      </section>

      <footer>
        <a className="brand" href="#top"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a>
        <p>Apps · Games · Worlds · Ideas</p>
        <div><a href="https://github.com/mcographics" target="_blank" rel="noreferrer">GitHub</a><a href="https://linktr.ee/Ken_S" target="_blank" rel="noreferrer">Connect</a><a href="#support">Support</a></div>
        <small>© {new Date().getFullYear()} Majestic Creations. Built independently in Gatineau, Québec.</small>
      </footer>
    </main>
  );
}
