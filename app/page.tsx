"use client";

import { useEffect, useRef, useState } from "react";
import repositoryStatus from "./repository-status.json";
import scriptureVerses from "./scripture-verses.json";
import workDayReleases from "./projects/work-day-with-god/releases.json";
import ShareButton from "./ShareButton";
import SiteHeader from "./SiteHeader";

type Category = "All" | "Apps" | "Game Dev" | "Creative" | "Experiments" | "Faith-Based" | "Automotive";
type ProjectFilter = Category | "Releases Available";

const categories: ProjectFilter[] = ["Releases Available", "All", "Apps", "Creative", "Game Dev", "Experiments", "Faith-Based", "Automotive"];
const appCategoryExceptions = new Set(["TanyaOS", "BridgeForge"]);
const automotiveProjects = new Set(["FieroLink GT"]);

function projectCategories(project: { title: string; category: Category }) {
  const categories: Category[] = [project.category];
  if (automotiveProjects.has(project.title)) categories.push("Automotive");
  if (project.category !== "Apps" && !appCategoryExceptions.has(project.title)) categories.push("Apps");
  return categories;
}

function projectMatchesCategory(project: { title: string; category: Category }, category: Category) {
  return projectCategories(project).includes(category);
}
const statusPriority: Record<string, number> = {
  "Release available": 0,
  "Test build": 1,
  "Public project": 2,
  "In development": 3,
  Building: 4,
  "Research project": 5,
};
const projectStatusOrder = Object.keys(statusPriority);

function projectSlug(title: string) {
  return title.toLowerCase().replaceAll("&", "and").replaceAll(":", "-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type ProjectRelease = { label: string; url: string };
type ProjectAvailability = { windows?: boolean; linux?: string[]; android?: boolean; ios?: boolean };
type Project = {
  title: string;
  category: Category;
  type: string;
  status: string;
  description: string;
  image?: string;
  imagePosition?: string;
  repository?: string;
  link?: string;
  detailsHref?: string;
  releaseUrl?: string;
  downloadUrl?: string;
  downloadLabel?: string;
  releaseVersions?: ProjectRelease[];
  private?: boolean;
  specialAccess?: boolean;
  requestHref?: string;
  requestLabel?: string;
  availability?: ProjectAvailability;
  tags: string[];
  color: string;
  visual?: string;
  monogram?: string;
};

const featuredReleases = [
  { id: "bible-recorder-note-taker", title: "Bible Recorder & Note Taker", eyebrow: "Android Bible study application", href: "/projects/bible-recorder-note-taker", image: "/projects/bible-recorder-splash.png", alt: "Bible Recorder and Note Taker splash artwork with the microphone, open Bible, and gold accents" },
  { id: "work-day-with-god", title: "Work Day with God", eyebrow: "Devotional application", href: "/projects/work-day-with-god", image: "/projects/work-day-with-god-slides/00-work-day-with-god-cover.png", alt: "Work Day with God — Work, Faith, Purpose cover artwork" },
  { id: "words-of-yeshua", title: "Words of Yeshua", eyebrow: "Scripture study application", href: "/projects/words-of-yeshua", image: "/projects/words-of-yeshua-featured.png", alt: "Words of Yeshua Scripture study title artwork" },
  { id: "public-nuisance", title: "Public Nuisance", eyebrow: "Android satire news app", href: "/projects/public-nuisance", image: "/projects/public-nuisance-featured.png", alt: "Public Nuisance Local News No BS title artwork" },
  { id: "chainbreaker", title: "ChainBreaker", eyebrow: "Android faith and growth app", href: "/projects/chainbreaker", image: "/projects/chainbreaker-splash.png", alt: "ChainBreaker title artwork showing hands breaking a chain before a glowing cross" },
];

const projects: Project[] = [
  {
    title: "The Islamic Dilemma",
    category: "Faith-Based" as Category,
    type: "Android test build",
    status: "Test build",
    description: "A private, offline-first research app examining the Qur’an’s relationship to the Torah and Gospel through Bible evidence, Qur’anic passages, manuscripts, Hebrew and Greek lexical study, Strong’s references, and Vine’s excerpts.",
    image: "/projects/islamic-dilemma-banner.png",
    imagePosition: "center",
    repository: "Islamic-Dilemma-Test-Builds",
    private: true,
    availability: { android: true },
    tags: ["Android", "React", "Offline research"],
    color: "#d9af55",
  },
  {
    title: "Work Day with God",
    category: "Faith-Based" as Category,
    type: "Windows + Android",
    status: "Release available",
    description: "A completely free, private, offline devotional app with daily KJV Scripture, reflections, prayers, scenic imagery, reminders, and reading history.",
    image: "/projects/work-day-with-god-card-banner.png",
    imagePosition: "center",
    repository: "WorkDaywithGod",
    link: "https://github.com/mcographics/WorkDaywithGod",
    detailsHref: "/projects/work-day-with-god",
    releaseVersions: [
      { label: `Windows x64 · EXE · v${workDayReleases.windows.version}`, url: workDayReleases.windows.installer.url },
      { label: `Android 7.0+ · APK · v${workDayReleases.android.version}`, url: workDayReleases.android.apk.url },
      { label: `Linux x64 · AppImage · v${workDayReleases.linux.version}`, url: workDayReleases.linux.appImage.url },
      { label: `Linux x64 · DEB · v${workDayReleases.linux.version}`, url: workDayReleases.linux.deb.url },
      { label: `Linux x64 · RPM · v${workDayReleases.linux.version}`, url: workDayReleases.linux.rpm.url },
    ],
    availability: { windows: true, linux: ["DEB", "RPM", "AppImage"], android: true },
    tags: ["Electron", "Android", "Local-first"],
    color: "#d9af55",
  },
  {
    title: "ChainBreaker",
    category: "Faith-Based" as Category,
    type: "Android local-first app",
    status: "Release available",
    description: "A private Android rule of life for breaking chains and building strength through Scripture, daily missions, training, reflection, and brotherhood.",
    image: "/projects/chainbreaker-banner.png",
    imagePosition: "center",
    repository: "ChainBreakerApp",
    link: "https://github.com/mcographics/ChainBreakerApp",
    detailsHref: "/projects/chainbreaker",
    releaseVersions: [{ label: "Android 7.0+ · APK · v0.0.4", url: "https://github.com/mcographics/ChainBreakerApp/releases/download/v0.0.4/ChainBreaker-0.0.4.apk" }],
    availability: { android: true },
    tags: ["Android", "React", "KJV", "Local-first"],
    color: "#d9af55",
  },
  {
    title: "Bible Recorder & Note Taker",
    category: "Faith-Based" as Category,
    type: "Android Bible study app",
    status: "Release available",
    description: "A focused Android study workspace for recording teaching, capturing Audio Snaps, linking notes to Scripture, and keeping study history in one place.",
    image: "/projects/bible-recorder-banner.png",
    imagePosition: "center",
    repository: "Bible-Recorder-Note-Taker",
    link: "https://github.com/mcographics/Bible-Recorder-Note-Taker",
    detailsHref: "/projects/bible-recorder-note-taker",
    releaseVersions: [{ label: "Android 7.0+ · APK · v1.0.2", url: "https://github.com/mcographics/Bible-Recorder-Note-Taker/releases/download/v1.0.2/Bible-Recorder-Note-Taker-1.0.2.apk" }],
    availability: { android: true },
    tags: ["Android", "React", "Bible study", "Audio Snap"],
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
    title: "FieroLink GT",
    category: "Apps" as Category,
    type: "Windows vehicle intelligence app",
    status: "In development",
    description: "A local-first Windows Fiero telemetry prototype with a simulator, receive-only ALDL serial transport, raw capture monitoring, and a path toward verified diagnostics.",
    image: "/projects/fierolink-gt.png",
    repository: "fierolink-gt",
    specialAccess: true,
    requestHref: "mailto:majesticcreationsottawa@outlook.com?subject=FieroLink%20GT%20access%20request",
    requestLabel: "Request Required",
    availability: { windows: true },
    tags: ["Electron", "React", "ALDL diagnostics"],
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
    availability: { windows: true },
    tags: ["Electron", "TypeScript", "Local-first"],
    color: "#d9af55",
  },
  {
    title: "Words of Yeshua",
    category: "Faith-Based" as Category,
    type: "Windows + Android Scripture study app",
    status: "Release available",
    description: "A Christ-centered local-first Scripture study companion for exploring the words of Yeshua inside complete KJV chapter context on Windows and Android.",
    image: "/projects/words-of-yeshua.png",
    repository: "WordsofYeshua",
    link: "https://github.com/mcographics/WordsofYeshua",
    detailsHref: "/projects/words-of-yeshua",
    availability: { windows: true, android: true },
    tags: ["TypeScript", "Electron", "Android", "KJV"],
    color: "#d9af55",
  },
  {
    title: "Truth News",
    category: "Apps" as Category,
    type: "Windows desktop app",
    status: "In development",
    description: "A local-first Christian news, Scripture, history, timeline, and prophecy application built around evidence and context.",
    image: "/projects/truth-news.jpg",
    repository: "TruthNewsApp",
    link: "https://github.com/mcographics/TruthNewsApp",
    availability: { windows: true },
    tags: ["React", "TypeScript", "Research"],
    color: "#d9af55",
  },
  {
    title: "Public Nuisance",
    category: "Apps" as Category,
    type: "Android satire news app",
    status: "Release available",
    description: "A live Canadian and U.S. news reader that keeps verified publisher links visible while layering original GTA-style satire, roast controls, and source-first context on top.",
    image: "/projects/public-nuisance-card-banner.png",
    repository: "REALLIFENEWS--GTA-STYLED-",
    detailsHref: "/projects/public-nuisance",
    availability: { android: true },
    tags: ["Android", "React", "Live news"],
    color: "#d9af55",
  },
  {
    title: "Netrunner-Launcher",
    category: "Experiments" as Category,
    type: "Android launcher",
    status: "Public project",
    description: "My customized fork of DvilSpawn's Re:TUI Android launcher, preserving the original developers' command-first foundation while adding my red dashboard, fixed quick apps, system and weather monitoring, notification workflow, and interface changes.",
    repository: "Netrunner-Launcher",
    link: "https://github.com/mcographics/Netrunner-Launcher",
    image: "/projects/netrunner-launcher-banner-v1.png",
    availability: { android: true },
    tags: ["Kotlin", "Android", "Customized Re:TUI fork"],
    color: "#d9af55",
  },
  {
    title: "BridgeForge",
    category: "Game Dev" as Category,
    type: "Unreal + Blender platform",
    status: "Building",
    description: "A focused ecosystem concept for Unreal Engine and Blender creators—bringing scattered tools, learning, and community resources together.",
    repository: "BridgeForge",
    private: true,
    availability: { windows: true },
    tags: ["Unreal Engine", "Blender", "Creator tools"],
    color: "#d9af55",
    image: "/projects/bridgeforge.png",
  },
  {
    title: "Grace Seek",
    category: "Faith-Based" as Category,
    type: "Bible study desktop app",
    status: "In development",
    description: "A polished Scripture exploration app combining Bible search and reading with Strong’s lexicon, original-language datasets, and atlas-style place lookup.",
    repository: "Grace-Seek",
    private: true,
    availability: { windows: true },
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
    availability: { windows: true },
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
    availability: { windows: true },
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
    availability: { windows: true },
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
    repository: "Character-Profile-Maker",
    availability: { windows: true },
    tags: ["Character design", "Worldbuilding", "Export tools"],
    color: "#d9af55",
  },
];

function ProjectVisual({ project }: { project: (typeof projects)[number] }) {
  if (project.image) {
    const isFirstProject = project.title === "Work Day with God";
    return <img src={project.image} alt={`${project.title} project preview`} loading={isFirstProject ? "eager" : "lazy"} decoding="async" fetchPriority={isFirstProject ? "high" : "low"} style={{ objectPosition: project.imagePosition ?? "center" }} />;
  }
  return (
    <div className={`generated-visual ${project.visual ?? "abstract"}`} aria-hidden="true">
      <span>{project.visual === "terminal" ? ">_" : project.monogram ?? "MC"}</span>
      <i /><i /><i />
    </div>
  );
}

function PlatformAvailability({ project }: { project: (typeof projects)[number] }) {
  const availability = project.availability;
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
  const [scriptureIndex, setScriptureIndex] = useState(0);
  const [scripturePaused, setScripturePaused] = useState(false);
  const [featuredPaused, setFeaturedPaused] = useState(false);
  const [selectedReleaseIndex, setSelectedReleaseIndex] = useState(0);
  const [featuredSpinPaused, setFeaturedSpinPaused] = useState(false);
  const featuredResumeTimer = useRef<number | null>(null);
  const [siteTheme, setSiteTheme] = useState<SiteTheme>("dark");
  const [releaseProject, setReleaseProject] = useState<{ title: string; versions: { label: string; url: string }[] } | null>(null);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("filter") !== "releases") return;
    const frame = window.requestAnimationFrame(() => setActiveCategory("Releases Available"));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (scripturePaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setScriptureIndex((current) => (current + 1) % scriptureVerses.length), 9000);
    return () => window.clearInterval(timer);
  }, [scripturePaused]);
  useEffect(() => () => {
    if (featuredResumeTimer.current !== null) window.clearTimeout(featuredResumeTimer.current);
  }, []);
  const holdFeaturedRotation = () => {
    setFeaturedSpinPaused(true);
    if (featuredResumeTimer.current !== null) window.clearTimeout(featuredResumeTimer.current);
    featuredResumeTimer.current = window.setTimeout(() => {
      setFeaturedSpinPaused(false);
      featuredResumeTimer.current = null;
    }, 12000);
  };
  const selectFeaturedRelease = (direction: -1 | 1) => {
    setSelectedReleaseIndex((current) => (current + direction + featuredReleases.length) % featuredReleases.length);
    holdFeaturedRotation();
  };
  const selectFeaturedReleaseAt = (releaseIndex: number) => {
    setSelectedReleaseIndex(releaseIndex);
    holdFeaturedRotation();
  };
  useEffect(() => {
    if (featuredPaused || featuredSpinPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setSelectedReleaseIndex((current) => (current + 1) % featuredReleases.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [featuredPaused, featuredSpinPaused]);
  const currentVerse = scriptureVerses[scriptureIndex];
  const synchronizedProjects = projects.map((project) => {
    if (!project.repository) return project;
    const repository = (repositoryStatus.repositories as Record<string, { visibility: "PUBLIC" | "PRIVATE"; url: string; releaseUrl?: string; downloadUrl?: string; downloadLabel?: string; releaseVersions?: ProjectRelease[] }>)[project.repository];
    if (!repository) return project;
    return {
      ...project,
      link: repository.visibility === "PUBLIC" ? repository.url : undefined,
      private: repository.visibility === "PRIVATE",
      releaseUrl: repository.releaseUrl,
      downloadUrl: repository.downloadUrl,
      downloadLabel: repository.downloadLabel,
      releaseVersions: repository.releaseVersions ?? project.releaseVersions,
    };
  }).sort((left, right) => (statusPriority[left.status] ?? 99) - (statusPriority[right.status] ?? 99));
  const releaseProjects = synchronizedProjects.filter((project) => /release|released/i.test(project.status));
  const visibleProjects = activeCategory === "All"
    ? synchronizedProjects
    : activeCategory === "Releases Available"
      ? releaseProjects
      : synchronizedProjects.filter((project) => projectMatchesCategory(project, activeCategory));
  const projectGroups = projectStatusOrder
    .map((status) => ({ status, projects: visibleProjects.filter((project) => project.status === status) }))
    .filter((group) => group.projects.length > 0);
  const activeFeaturedRelease = featuredReleases[selectedReleaseIndex];

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
        <div className="hero-content">
          <p className="eyebrow"><span /> Independent multidisciplinary studio</p>
          <h1>Turning bold ideas<br /><em>into digital reality.</em></h1>
          <p className="hero-copy">A living portfolio of local-first apps, game-development projects, and creative technology—designed and built by Kenneth Salmon.</p>
          <div className="hero-actions"><a className="button primary" href="#work">Explore projects <span>↓</span></a><a className="button ghost" href="https://github.com/mcographics" target="_blank" rel="noreferrer">GitHub profile <span>↗</span></a></div>
          <div className="hero-stats"><span><b>{projects.length}</b> GitHub projects</span><span><b>04</b> disciplines</span><span><b>01</b> independent studio</span></div>
        </div>
        <div className="hero-feature" aria-label="Featured releases carousel" onMouseEnter={() => setFeaturedPaused(true)} onMouseLeave={() => setFeaturedPaused(false)} onFocusCapture={() => setFeaturedPaused(true)} onBlurCapture={() => setFeaturedPaused(false)}>
          <div className="featured-orbital-stage">
            <div className="featured-orbit-system">
              <div className="featured-orbit-card-track">
                {featuredReleases.map((release, releaseIndex) => {
                  const offset = (releaseIndex - selectedReleaseIndex + featuredReleases.length) % featuredReleases.length;
                  const position = offset === 0 ? "is-active" : offset === 1 ? "is-next" : "is-previous";
                  return <a key={release.id} className={`featured-release-card featured-release-card-${releaseIndex} ${position}`} href={release.href} aria-current={offset === 0 ? "true" : undefined} aria-label={offset === 0 ? `View the ${release.title} featured release` : `Select ${release.title} as the featured release`} onClick={(event) => {
                    if (offset === 0) return;
                    event.preventDefault();
                    selectFeaturedReleaseAt(releaseIndex);
                  }}>
                    <img className="active" src={release.image} alt={release.alt} loading={offset === 0 ? "eager" : "lazy"} decoding="async" fetchPriority={offset === 0 ? "high" : "low"} aria-hidden={offset !== 0} />
                    <span className="featured-card-label" aria-hidden="true"><small>Release {String(releaseIndex + 1).padStart(2, "0")}</small><strong>{release.title}</strong></span>
                  </a>;
                })}
              </div>
            </div>
          </div>
          <div className="featured-app-control" role="group" aria-label="Featured application control">
            <button type="button" onClick={() => selectFeaturedRelease(-1)} aria-label="Select previous featured application">←</button>
            <span className="featured-app-status" aria-live="polite"><small>App Control</small><strong>{activeFeaturedRelease.title}</strong></span>
            <button type="button" onClick={() => selectFeaturedRelease(1)} aria-label="Select next featured application">→</button>
          </div>
          <div className="featured-release-pagination" role="group" aria-label="Choose a featured application">
            {featuredReleases.map((release, releaseIndex) => <button key={release.id} type="button" className={releaseIndex === selectedReleaseIndex ? "active" : undefined} onClick={() => selectFeaturedReleaseAt(releaseIndex)} aria-label={`Select ${release.title}`} aria-pressed={releaseIndex === selectedReleaseIndex} />)}
          </div>
          <div className="feature-chrome"><span>Featured releases</span><i>{String(featuredReleases.length).padStart(2, "0")} cards</i></div>
        </div>
        <div className="scroll-cue">Scroll to explore <span>↓</span></div>
      </section>

      <section className="work" id="work">
        <div className="work-intro">
          <div><p className="section-kicker">Complete project archive</p><h2>All<br /><em>projects.</em></h2></div>
          <p>Every GitHub project by Majestic Creations—software, tools, experiments, and worlds at different stages of the journey, from released applications to ambitious ideas taking shape.</p>
        </div>

        <div className="filter-bar" role="group" aria-label="Filter projects">
          {categories.map((category) => <button key={category} data-filter={category} className={`${activeCategory === category ? "active" : ""}${category === "Releases Available" ? " release-filter" : ""}`.trim()} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category}>{category === "Releases Available" ? <><span className="release-label full">Releases Available</span><span className="release-label short">Releases</span></> : category}<span className="filter-count">{category === "All" ? synchronizedProjects.length : category === "Releases Available" ? releaseProjects.length : synchronizedProjects.filter((project) => projectMatchesCategory(project, category)).length}</span></button>)}
        </div>

        <div className="project-status-list" aria-live="polite">
          {projectGroups.map((group) => (
            <section className={`project-status-group group-${group.status.toLowerCase().replaceAll(" ", "-")}`} key={group.status} aria-labelledby={`status-${group.status.toLowerCase().replaceAll(" ", "-")}`}>
              <header className="status-group-heading"><span><small>Current status</small><h3 id={`status-${group.status.toLowerCase().replaceAll(" ", "-")}`}>{group.status}</h3></span><b>{String(group.projects.length).padStart(2, "0")}</b></header>
              <div className="project-grid">
                {group.projects.map((project) => (
                  <article className="project-card" key={project.title} data-project-title={project.title} data-categories={projectCategories(project).join(" ")} style={{ "--project-color": project.color } as React.CSSProperties}>
                    <div className="project-media"><ProjectVisual project={project} /><div className={`project-status status-${project.status.toLowerCase().replaceAll(" ", "-")}`}><i />{project.status}</div><span className="project-category">{projectCategories(project).join(" · ")}</span></div>
                    <div className="project-info">
                      <div className="project-heading"><span><small>{project.type}</small><h3>{project.title}</h3></span><div className="project-actions">{project.title !== "TanyaOS" ? <ShareButton compact title={`${project.title} | Majestic Creations`} text={project.description} url={project.detailsHref ?? `/projects/${projectSlug(project.title)}`} /> : null}{"releaseVersions" in project && project.releaseVersions?.length ? project.releaseVersions.length === 1 && /\.apk$/i.test(project.releaseVersions[0].url) ? <a className="project-download" href={project.releaseVersions[0].url} aria-label={`Download ${project.title}`}>Download</a> : <button type="button" className="project-download" onClick={() => setReleaseProject({ title: project.title, versions: project.releaseVersions! })} aria-label={`Choose a version of ${project.title}`}>Choose Version</button> : "downloadUrl" in project && project.downloadUrl ? <a className="project-download" href={project.downloadUrl} aria-label={`${project.downloadLabel ?? "Download"} for ${project.title}`}>Download</a> : null}{"specialAccess" in project && project.specialAccess ? <>{project.private ? <span className="project-lock private">Private</span> : null}<a className="project-lock special" href={project.requestHref ?? "/about#connect"} aria-label={`Request access to ${project.title}`}>{project.requestLabel ?? "Request Required"}</a></> : project.link ? <><span className="project-lock public">Public</span><a href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><img src="/brand/github-invertocat-white.png" alt="" /></a></> : <span className={`project-lock${project.private ? " private" : ""}`}>{project.private ? "Private" : "Studio project"}</span>}</div></div>
                      <p>{project.description}</p>
                      <a className="project-details-link" href={project.detailsHref ?? `/projects/${projectSlug(project.title)}`}>Explore the full project <span>→</span></a>
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
        <div><a href="https://github.com/mcographics" target="_blank" rel="noreferrer">GitHub</a><a href="./blog/">Blog</a><a href="./community/">Community</a><a href="./about/">About Me</a><a href="./contact/">Contact Us</a><a href="#support">Support</a></div>
        <small>© {new Date().getFullYear()} Majestic Creations. Built independently in Gatineau, Québec.</small>
      </footer>
      {releaseProject ? <div className="release-modal-backdrop" role="presentation"><button type="button" className="release-modal-dismiss" onClick={() => setReleaseProject(null)} aria-label="Close version chooser" /><section className="release-modal" role="dialog" aria-modal="true" aria-labelledby="release-modal-title"><button type="button" className="release-modal-close" onClick={() => setReleaseProject(null)} aria-label="Close version chooser">×</button><small>DOWNLOAD RELEASE</small><h2 id="release-modal-title">{releaseProject.title}</h2><p>Choose the version you want to download.</p><div className="release-version-list">{releaseProject.versions.map((version) => <a key={version.url} href={version.url} className="release-version-button">{version.label}<span>↗</span></a>)}</div></section></div> : null}
    </main>
  );
}
