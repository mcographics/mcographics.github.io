import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../SiteHeader";
import { projectDetails } from "../project-details";
import FieroLinkSafetyNotice from "../FieroLinkSafetyNotice";

const siteUrl = "https://mcographics.github.io";

export function generateStaticParams() {
  return projectDetails.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projectDetails.find((entry) => entry.slug === slug);
  if (!project) return { title: "Project | Majestic Creations", alternates: { canonical: `/projects/${slug}/` } };
  const title = `${project.title} | Majestic Creations`;
  const image = project.shareImage ?? project.image;
  const imageAlt = project.shareImageAlt ?? project.imageAlt ?? `${project.title} project artwork`;
  return {
    title,
    description: project.description,
    alternates: { canonical: `/projects/${slug}/` },
    openGraph: {
      type: "website",
      url: `/projects/${slug}/`,
      siteName: "Majestic Creations",
      title,
      description: project.description,
      images: image ? [{ url: image, alt: imageAlt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectDetails.find((entry) => entry.slug === slug);
  if (!project) return <main><SiteHeader /><section className="product-introduction"><h1>Project not found</h1></section></main>;
  const isFieroLink = project.slug === "fierolink-gt";
  const requestHref = isFieroLink ? "mailto:majesticcreationsottawa@outlook.com?subject=FieroLink%20GT%20access%20request" : project.requestHref;
  const headerActionHref = isFieroLink ? "#fierolink-safety-heading" : requestHref;
  const projectUrl = `${siteUrl}/projects/${project.slug}/`;
  const schema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: project.title, url: projectUrl, image: project.image ? `${siteUrl}${project.image}` : undefined, description: project.description, applicationCategory: project.category, operatingSystem: project.platforms, softwareVersion: project.release?.version, downloadUrl: project.release?.downloadUrl, isAccessibleForFree: true, author: { "@type": "Person", name: "Kenneth Salmon", url: `${siteUrl}/about/` }, publisher: { "@type": "Organization", name: "Majestic Creations", url: siteUrl }, sameAs: project.repository };
  return <main className="product-page generic-product" id="top">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replaceAll("<", "\\u003c") }} />
    <SiteHeader className="product-header" actionHref={project.repository ?? (project.specialAccess ? headerActionHref : undefined)} actionLabel={project.repository ? "View source" : project.specialAccess ? (isFieroLink ? "Read first" : project.requestLabel) : undefined} actionIcon="↗" actionExternal={Boolean(project.repository)} />
    <section className="product-hero"><div className="product-hero-copy"><a className="product-back" href="../../#work">← All projects</a><p className="section-kicker">{project.eyebrow}</p><h1>{project.title.split(" ").slice(0, -1).join(" ")}<br /><em>{project.title.split(" ").slice(-1)}.</em></h1><p className="product-deck">{project.description}</p><div className="product-hero-actions">{project.specialAccess ? <a className="button ghost" href={isFieroLink ? "#fierolink-safety-heading" : requestHref ?? "/about#connect"}>{isFieroLink ? "Read first" : "Request access"} <span>{isFieroLink ? "↓" : "↗"}</span></a> : project.repository ? <a className="button ghost" href={project.repository} target="_blank" rel="noreferrer">GitHub repository <span>↗</span></a> : null}{project.upstreamRepository ? <a className="button ghost" href={project.upstreamRepository} target="_blank" rel="noreferrer">Original developer repository <span>↗</span></a> : null}</div><dl className="product-facts"><div><dt>Status</dt><dd>{project.status}</dd></div><div><dt>Platform</dt><dd>{project.platforms}</dd></div><div><dt>Access</dt><dd>{project.specialAccess ? "Request required" : project.private ? "Private" : "Local-first"}</dd></div><div><dt>Category</dt><dd>{project.category}</dd></div></dl></div><figure className="product-cover">{project.image ? <img src={project.image} alt={project.imageAlt ?? `${project.title} project artwork`} /> : <div className="generated-visual abstract" aria-hidden="true"><span>MC</span><i /><i /><i /></div>}<figcaption><span>{project.category} · {project.status}</span><strong>Ideas worth making real.</strong></figcaption></figure></section>
    {project.slug === "fierolink-gt" && requestHref ? <FieroLinkSafetyNotice requestHref={requestHref} /> : null}
    <section className="product-introduction" aria-labelledby="product-purpose"><div><p className="section-kicker">The project</p><h2 id="product-purpose">A clear place for the idea to take shape.</h2></div><div><p>{project.purpose}</p><p>This page records the project’s current direction and confirmed scope. Availability is stated plainly: a project page is a fuller introduction, not a claim that an unreleased build is ready to download.</p></div></section>
    {project.screenshots?.length ? <section className="product-gallery-section project-screenshot-section" aria-labelledby="project-screenshots-heading"><header><p className="section-kicker">{project.screenshotEyebrow ?? "Captured from the Android test build"}</p><h2 id="project-screenshots-heading">See the app in use.</h2><p>{project.screenshotDescription ?? "These are direct screenshots from the installed Android test build, showing the current navigation and product surfaces."}</p></header><div className="project-screenshot-grid">{project.screenshots.map((screenshot) => <figure key={screenshot.src}><img src={screenshot.src} alt={screenshot.alt} /><figcaption><span>{screenshot.label}</span><strong>{screenshot.label} screen</strong></figcaption></figure>)}</div></section> : null}
    {project.release ? <section className="product-downloads" id="downloads" aria-labelledby="downloads-heading"><header><p className="section-kicker">Official Android release</p><h2 id="downloads-heading">{project.releaseHeading ?? "Start breaking the chains."}</h2><p>{project.releaseDescription ?? `ChainBreaker ${project.release.version} is available as a direct APK for Android 7.0 and newer. The release is local-first, account-free, and intended for private use on the reader’s own device.`}</p></header><div className="download-grid"><article><div><span className="download-platform">{project.releasePlatform ?? "Android 7.0+"}</span><strong>v{project.release.version}</strong><small>{project.releaseSmallText ?? "Signed release APK · local-first"}</small></div><p>Download the official APK from GitHub Releases. Review the release notes and verify the source before installing.</p><a className="button primary" href={project.release.downloadUrl}>Download APK <span>↓</span></a><a href={project.release.releaseUrl} target="_blank" rel="noreferrer">Release notes ↗</a></article><article><div><span className="download-platform">Source</span><strong>GitHub</strong><small>Public repository and history</small></div><p>Inspect the application source, bundled content, Android project, and release history in the public repository.</p><a className="button ghost" href={project.repository} target="_blank" rel="noreferrer">Open repository <span>↗</span></a><a href={project.release.releaseUrl} target="_blank" rel="noreferrer">View release ↗</a></article></div></section> : null}
    <section className="product-features" aria-labelledby="product-features-heading"><header><p className="section-kicker">What it is becoming</p><h2 id="product-features-heading">Built around a specific purpose.</h2></header><div className="product-feature-grid">{project.features.map((feature, index) => <article key={feature}><span>{String(index + 1).padStart(2, "0")}</span><h3>{feature}</h3>{project.featureDetails?.[index] ? <p>{project.featureDetails[index]}</p> : null}</article>)}</div></section>
    <section className="product-privacy" aria-labelledby="product-privacy-heading"><div><p className="section-kicker">Current facts</p><h2 id="product-privacy-heading">A maintained studio record.</h2></div><div className="privacy-commitments"><p>{project.title} is currently marked as <strong>{project.status.toLowerCase()}</strong> and intended for {project.platforms}. The page will be updated as the project gains confirmed releases, screenshots, or public documentation.</p><ul><li>Category: {project.category}</li><li>Platform scope: {project.platforms}</li><li>Tags: {project.tags.join(" · ")}</li>{project.upstreamRepository ? <li>Customized from the original developer repository: <a href={project.upstreamRepository} target="_blank" rel="noreferrer">{project.upstreamLabel ?? project.upstreamRepository}</a>.</li> : null}<li>{project.specialAccess ? "Special access only: a request is required before access can be granted." : project.private ? "Repository access is private at present." : "The project repository is publicly available."}</li></ul></div></section>
    <section className="product-related" aria-labelledby="related-heading"><div><p className="section-kicker">{project.journalSlug ? "From the journal" : "Keep exploring"}</p><h2 id="related-heading">{project.journalSlug ? (project.journalHeading ?? "Real headlines. Questionable commentary.") : "See the complete project archive."}</h2><p>{project.journalSlug ? (project.journalDescription ?? "Read the release story behind Public Nuisance, its source-first news layer, and the banner now used across the project’s site presence.") : "Return to the portfolio to compare this project with the other applications, tools, experiments, and worlds being built under Majestic Creations."}</p>{project.journalSlug ? <a className="button ghost" href={`/blog/${project.journalSlug}/`}>Read the project journal <span>→</span></a> : <a className="button ghost" href="../../#work">Back to all projects <span>→</span></a>}</div>{project.image ? <img src={project.image} alt={`${project.title} project preview`} /> : null}</section>
    <footer className="about-footer"><Link className="brand" href="/"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></Link><p>Apps · Games · Worlds · Ideas</p><div><a href="../../#work">Projects</a><Link href="/blog">Blog</Link><Link href="/about">About Me</Link><Link href="/contact">Contact Us</Link></div><small>© {new Date().getFullYear()} Majestic Creations. Built independently in Gatineau, Québec.</small></footer>
  </main>;
}
