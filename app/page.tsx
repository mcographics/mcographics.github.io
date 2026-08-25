"use client";

import { useEffect, useState } from "react";
import repositoryStatus from "./repository-status.json";
import scriptureVerses from "./scripture-verses.json";
import SiteHeader from "./SiteHeader";

type Category = "All" | "Apps" | "Game Dev" | "Creative" | "Experiments";
type ProjectFilter = Category | "Releases Available";

const categories: ProjectFilter[] = ["Releases Available", "All", "Apps", "Creative", "Game Dev", "Experiments"];
const statusPriority: Record<string, number> = {
  "Release available": 0,
  "Public project": 1,
  "In development": 2,
  Building: 3,
  "Research project": 4,
};
const projectStatusOrder = Object.keys(statusPriority);

const featuredSlides = [
  { src: "/projects/work-day-with-god-slides/00-work-day-with-god-cover.png", alt: "Work Day with God — Work, Faith, Purpose cover artwork" },
  { src: "/projects/work-day-with-god-slides/01-hero-verse-card.png", alt: "Work Day with God mobile hero and daily verse screen" },
  { src: "/projects/work-day-with-god-slides/02-daily-devotional.png", alt: "Work Day with God daily devotional mobile screen" },
  { src: "/projects/work-day-with-god-slides/03-future-calendar.png", alt: "Work Day with God future devotional calendar mobile screen" },
  { src: "/projects/work-day-with-god-slides/04-reminder-settings.png", alt: "Work Day with God reminder settings mobile screen" },
  { src: "/projects/work-day-with-god-slides/05-reminder-types-and-appearance.png", alt: "Work Day with God reminder types and appearance mobile screen" },
  { src: "/projects/work-day-with-god-slides/06-offline-scripture-library.png", alt: "Work Day with God offline Scripture library mobile screen" },
];

const projects = [
  {
    title: "Work Day with God",
    category: "Apps" as Category,
    type: "Windows + Android",
    status: "Release available",
    description: "A completely free, private, offline devotional app with daily KJV Scripture, reflections, prayers, scenic imagery, reminders, and reading history.",
    image: "/projects/work-day-with-god.png",
    imagePosition: "top",
    repository: "WorkDaywithGod",
    link: "https://github.com/mcographics/WorkDaywithGod",
    availability: { windows: true, linux: ["DEB", "RPM", "AppImage"], android: true },
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
    repository: "Unified-Ai-Studio",
    private: true,
    availability: { windows: true },
    tags: ["Python", "PySide6", "AI tools"],
    color: "#d9af55",
  },
  {
    title: "Creative Whiteboard",
    category: "Creative" as Category,
    type: "Infinite canvas desktop app",
    status: "In development",
    description: "An offline-first infinite whiteboard for drawing, annotation, document review, brainstorming, visual planning, and project organization.",
    image: "/projects/creative-whiteboard.png",
    repository: "CreativeWhiteboard",
    link: "https://github.com/mcographics/CreativeWhiteboard",
    availability: { windows: true },
    tags: ["Electron", "React", "Infinite canvas"],
    color: "#d9af55",
  },
  {
    title: "Comic Organizer",
    category: "Apps" as Category,
    type: "Windows desktop app",
    status: "In development",
    description: "A private, local-first library for finding, organizing, searching, and safely managing CBZ and CBR comic archives.",
    image: "/projects/comic-organizer.png",
    repository: "Comic-Organizer",
    private: true,
    availability: { windows: true },
    tags: ["Electron", "React", "Local-first"],
    color: "#d9af55",
  },
  {
    title: "Dossier Builder",
    category: "Apps" as Category,
    type: "Windows desktop app",
    status: "In development",
    description: "A secure, local-first desktop workspace for creating, structuring, editing, and exporting professional dossiers from reusable document templates.",
    image: "/projects/dossier-builder.png",
    repository: "Dosseir-Builder",
    link: "https://github.com/mcographics/Dosseir-Builder",
    tags: ["Electron", "TypeScript", "Local-first"],
    color: "#d9af55",
  },
  {
    title: "Words of Yeshua",
    category: "Apps" as Category,
    type: "Scripture study app",
    status: "Release available",
    description: "A Christ-centered desktop study companion for exploring the words of Yeshua inside complete KJV chapter context.",
    image: "/projects/words-of-yeshua.png",
    repository: "WordsofYeshua",
    private: true,
    availability: { windows: true },
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
    repository: "TruthNewsApp",
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
    repository: "Re-TUI",
    link: "https://github.com/mcographics/Re-TUI",
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
    repository: "BridgeForge",
    private: true,
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
    repository: "Grace-Seek",
    private: true,
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
    repository: "Space_Eye",
    private: true,
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
    repository: "TanyaOS",
    private: true,
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
    repository: "WorkSpaces",
    private: true,
    tags: ["TypeScript", "Writing", "Visual canvas"],
    color: "#d9af55",
    image: "/projects/workspaces.png",
  },
  {
    title: "Project Database",
    category: "Apps" as Category,
    type: "Windows desktop app",
    status: "In development",
    description: "A local-first desktop workspace for organizing projects, documents, images, collections, timelines, and related creative assets in one secure place.",
    image: "/projects/project-database.png",
    repository: "ProjectDatabase",
    link: "https://github.com/mcographics/ProjectDatabase",
    availability: { windows: true },
    tags: ["Electron", "React", "C++"],
    color: "#d9af55",
  },
  {
    title: "GamingBible",
    category: "Apps" as Category,
    type: "Gaming news desktop app",
    status: "In development",
    description: "A personalized desktop hub for gaming news, upcoming releases, studios, industry coverage, esports, hardware, and rumors—all gathered in one focused app.",
    image: "/projects/gamingbible.png",
    repository: "GamingBible",
    link: "https://github.com/mcographics/GamingBible",
    tags: ["Electron", "React", "Gaming news"],
    color: "#d9af55",
  },
  {
    title: "Character Profile Maker",
    category: "Creative" as Category,
    type: "Character design desktop app",
    status: "In development",
    description: "A flexible character-building workspace for creating detailed visual profiles, organizing reference views, importing artwork, and exporting polished character sheets.",
    image: "/projects/character-profile-maker.png",
    tags: ["Character design", "Worldbuilding", "Export tools"],
    color: "#d9af55",
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

function PlatformAvailability({ project }: { project: (typeof projects)[number] }) {
  const availability = "availability" in project ? project.availability : undefined;
  const platforms = [
    { key: "windows", label: "Windows", available: Boolean(availability?.windows) },
    { key: "linux", label: "Linux", available: Boolean(availability?.linux?.length), formats: availability?.linux },
    { key: "android", label: "Android", available: Boolean(availability?.android) },
    { key: "ios", label: "iOS", available: Boolean(availability?.ios) },
  ];

  return (
    <div className="platform-availability" aria-label={`${project.title} version availability`}>
      <small>Versions</small>
      <div>
        {platforms.map((platform) => (
          <span key={platform.key} className={platform.available ? "available" : "unavailable"} aria-label={`${platform.label} version ${platform.available ? "available" : "not available"}`}>
            <i />{platform.label}{platform.formats?.length ? <em>{platform.formats.join(" · ")}</em> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<ProjectFilter>("All");
  const [featuredSlide, setFeaturedSlide] = useState(0);
  const [featuredPaused, setFeaturedPaused] = useState(false);
  const [scriptureIndex, setScriptureIndex] = useState(0);
  const [scripturePaused, setScripturePaused] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("filter") === "releases") setActiveCategory("Releases Available");
  }, []);
  useEffect(() => {
    if (featuredPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setFeaturedSlide((current) => (current + 1) % featuredSlides.length), 5500);
    return () => window.clearInterval(timer);
  }, [featuredPaused]);
  useEffect(() => {
    if (scripturePaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setScriptureIndex((current) => (current + 1) % scriptureVerses.length), 9000);
    return () => window.clearInterval(timer);
  }, [scripturePaused]);
  const currentVerse = scriptureVerses[scriptureIndex];
  const synchronizedProjects = projects.map((project) => {
    if (!("repository" in project)) return project;
    const repository = (repositoryStatus.repositories as Record<string, { visibility: "PUBLIC" | "PRIVATE"; url: string }>)[project.repository];
    if (!repository) return project;
    return {
      ...project,
      link: repository.visibility === "PUBLIC" ? repository.url : undefined,
      private: repository.visibility === "PRIVATE",
    };
  }).sort((left, right) => (statusPriority[left.status] ?? 99) - (statusPriority[right.status] ?? 99));
  const releaseProjects = synchronizedProjects.filter((project) => /release|released/i.test(project.status));
  const visibleProjects = activeCategory === "All"
    ? synchronizedProjects
    : activeCategory === "Releases Available"
      ? releaseProjects
      : synchronizedProjects.filter((project) => project.category === activeCategory);
  const projectGroups = projectStatusOrder
    .map((status) => ({ status, projects: visibleProjects.filter((project) => project.status === status) }))
    .filter((group) => group.projects.length > 0);

  return (
    <main id="top">
      <SiteHeader home />

      <section className="hero">
        <aside className="scripture-ticker" aria-label="Bible verses of encouragement" onMouseEnter={() => setScripturePaused(true)} onMouseLeave={() => setScripturePaused(false)} onFocusCapture={() => setScripturePaused(true)} onBlurCapture={() => setScripturePaused(false)}>
          <div className="scripture-ticker-copy" aria-live="polite" aria-atomic="true">
            <p className={currentVerse.wordsOfChrist ? "words-of-christ" : undefined}>“{currentVerse.text}”</p>
            <span>{currentVerse.wordsOfChrist ? "✝ Words of Christ · " : ""}{currentVerse.reference} · KJV</span>
          </div>
        </aside>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orbit" aria-hidden="true"><i /><i /><i /></div>
        <div className="hero-content">
          <p className="eyebrow"><span /> Independent multidisciplinary studio</p>
          <h1>Turning bold ideas<br /><em>into digital reality.</em></h1>
          <p className="hero-copy">A living portfolio of local-first apps, game-development projects, and creative technology—designed and built by Kenneth Salmon.</p>
          <div className="hero-actions"><a className="button primary" href="#work">Explore projects <span>↓</span></a><a className="button ghost" href="https://github.com/mcographics" target="_blank" rel="noreferrer">GitHub profile <span>↗</span></a></div>
          <div className="hero-stats"><span><b>{projects.length}</b> GitHub projects</span><span><b>04</b> disciplines</span><span><b>01</b> independent studio</span></div>
        </div>
        <div className="hero-feature" onMouseEnter={() => setFeaturedPaused(true)} onMouseLeave={() => setFeaturedPaused(false)} onFocusCapture={() => setFeaturedPaused(true)} onBlurCapture={() => setFeaturedPaused(false)}>
          <div className="feature-chrome"><span>Featured release</span><i>{String(featuredSlide + 1).padStart(2, "0")} / {String(featuredSlides.length).padStart(2, "0")}</i></div>
          <a className="feature-slideshow" href="https://github.com/mcographics/WorkDaywithGod" target="_blank" rel="noreferrer" aria-label={`View Work Day with God on GitHub — slide ${featuredSlide + 1} of ${featuredSlides.length}`}>
            {featuredSlides.map((slide, index) => <img key={slide.src} className={featuredSlide === index ? "active" : ""} src={slide.src} alt={slide.alt} aria-hidden={featuredSlide !== index} loading={index === 0 ? "eager" : "lazy"} />)}
          </a>
          <div className="feature-controls" aria-label="Work Day with God slideshow controls">
            <button type="button" onClick={() => setFeaturedSlide((current) => (current - 1 + featuredSlides.length) % featuredSlides.length)} aria-label="Previous slide">←</button>
            <div>{featuredSlides.map((slide, index) => <button type="button" key={slide.src} className={featuredSlide === index ? "active" : ""} onClick={() => setFeaturedSlide(index)} aria-label={`Show slide ${index + 1}`} aria-current={featuredSlide === index ? "true" : undefined} />)}</div>
            <button type="button" onClick={() => setFeaturedSlide((current) => (current + 1) % featuredSlides.length)} aria-label="Next slide">→</button>
          </div>
          <a className="feature-caption" href="https://github.com/mcographics/WorkDaywithGod" target="_blank" rel="noreferrer"><span><small>Devotional application</small><strong>Work Day with God</strong></span><b>↗</b></a>
        </div>
        <div className="scroll-cue">Scroll to explore <span>↓</span></div>
      </section>

      <section className="work" id="work">
        <div className="work-intro">
          <div><p className="section-kicker">Complete project archive</p><h2>All<br /><em>projects.</em></h2></div>
          <p>Every GitHub project by Majestic Creations—software, tools, experiments, and worlds at different stages of the journey, from released applications to ambitious ideas taking shape.</p>
        </div>

        <div className="filter-bar" role="group" aria-label="Filter projects">
          {categories.map((category) => <button key={category} data-filter={category} className={`${activeCategory === category ? "active" : ""}${category === "Releases Available" ? " release-filter" : ""}`.trim()} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category}>{category === "Releases Available" ? <><span className="release-label full">Releases Available</span><span className="release-label short">Releases</span></> : category}<span className="filter-count">{category === "All" ? synchronizedProjects.length : category === "Releases Available" ? releaseProjects.length : synchronizedProjects.filter((project) => project.category === category).length}</span></button>)}
        </div>

        <div className="project-status-list" aria-live="polite">
          {projectGroups.map((group) => (
            <section className={`project-status-group group-${group.status.toLowerCase().replaceAll(" ", "-")}`} key={group.status} aria-labelledby={`status-${group.status.toLowerCase().replaceAll(" ", "-")}`}>
              <header className="status-group-heading"><span><small>Current status</small><h3 id={`status-${group.status.toLowerCase().replaceAll(" ", "-")}`}>{group.status}</h3></span><b>{String(group.projects.length).padStart(2, "0")}</b></header>
              <div className="project-grid">
                {group.projects.map((project) => (
                  <article className="project-card" key={project.title} style={{ "--project-color": project.color } as React.CSSProperties}>
                    <div className="project-media"><ProjectVisual project={project} /><div className={`project-status status-${project.status.toLowerCase().replaceAll(" ", "-")}`}><i />{project.status}</div><span className="project-category">{project.category}</span></div>
                    <div className="project-info">
                      <div className="project-heading"><span><small>{project.type}</small><h3>{project.title}</h3></span>{project.link ? <a href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><img src="/brand/github-invertocat-white.png" alt="" /></a> : <span className={`project-lock${project.private ? " private" : ""}`}>{project.private ? "Private" : "Studio project"}</span>}</div>
                      <p>{project.description}</p>
                      <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                      <PlatformAvailability project={project} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
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
        <div className="support-copy">
          <p>Support helps cover development time, maintenance, testing, hosting, creative tools, and the unglamorous work that keeps independent software alive.</p>
          <div className="support-actions">
            <a className="button ghost" href="https://linktr.ee/Ken_S" target="_blank" rel="noreferrer">Connect &amp; Follow <span>♡</span></a>
            <a className="button primary" href="https://ko-fi.com/cmdrstriker" target="_blank" rel="noreferrer">Ko-fi Donate <span>↗</span></a>
            <a className="button paypal" href="https://paypal.me/mcographics?locale.x=en_US&amp;country.x=CA" target="_blank" rel="noreferrer">PayPal Donate <span>↗</span></a>
          </div>
        </div>
      </section>

      <footer>
        <a className="brand" href="#top"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a>
        <p>Apps · Games · Worlds · Ideas</p>
        <div><a href="https://github.com/mcographics" target="_blank" rel="noreferrer">GitHub</a><a href="/blog">Blog</a><a href="/community">Community</a><a href="/about">About Me</a><a href="#support">Support</a></div>
        <small>© {new Date().getFullYear()} Majestic Creations. Built independently in Gatineau, Québec.</small>
      </footer>
    </main>
  );
}
