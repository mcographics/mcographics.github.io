import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../SiteHeader";
import WorkDayGallery from "./WorkDayGallery";

const siteUrl = "https://mcographics.github.io";
const projectUrl = `${siteUrl}/projects/work-day-with-god/`;
const repositoryUrl = "https://github.com/mcographics/WorkDaywithGod";
const coverUrl = `${siteUrl}/projects/work-day-with-god-slides/00-work-day-with-god-cover.png`;

const downloads = {
  windows: "https://github.com/mcographics/WorkDaywithGod/releases/download/v1.4.3/Work-Day-with-God-Setup-1.4.3.exe",
  android: "https://github.com/mcographics/WorkDaywithGod/releases/download/android-v1.0.1/Work-Day-with-God-Android-1.0.1.apk",
  androidChecksum: "https://github.com/mcographics/WorkDaywithGod/releases/download/android-v1.0.1/Work-Day-with-God-Android-1.0.1.apk.sha256",
  linuxAppImage: "https://github.com/mcographics/WorkDaywithGod/releases/download/v1.2.2-linux-beta.1/Work-Day-with-God-1.2.2-linux-x86_64.AppImage",
  linuxDeb: "https://github.com/mcographics/WorkDaywithGod/releases/download/v1.2.2-linux-beta.1/Work-Day-with-God-1.2.2-linux-amd64.deb",
  linuxRpm: "https://github.com/mcographics/WorkDaywithGod/releases/download/v1.2.2-linux-beta.1/Work-Day-with-God-1.2.2-linux-x86_64.rpm",
};

export const metadata: Metadata = {
  title: "Work Day with God — Offline Christian Devotional App | Majestic Creations",
  description: "A free, private, account-free Christian devotional app for Windows, Android, and Linux with 366 Christ-centred devotionals, KJV Scripture, reminders, and offline reading.",
  alternates: { canonical: "/projects/work-day-with-god/" },
  openGraph: {
    type: "website",
    url: projectUrl,
    siteName: "Majestic Creations",
    title: "Work Day with God — Offline Christian Devotional App",
    description: "366 Christ-centred devotionals, bundled Scripture, gentle reminders, and private offline reading on Windows, Android, and Linux.",
    images: [{ url: coverUrl, width: 941, height: 1672, alt: "Work Day with God — Work, Faith, Purpose cover artwork" }],
  },
  twitter: { card: "summary_large_image", title: "Work Day with God — Offline Christian Devotional App", description: "Free, private, account-free devotional reading for Windows, Android, and Linux.", images: [coverUrl] },
};

const softwareApplication = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Work Day with God",
  url: projectUrl,
  image: coverUrl,
  screenshot: [
    `${siteUrl}/projects/work-day-with-god-slides/viewingmode/darkmode/07-verse-card.png`,
    `${siteUrl}/projects/work-day-with-god-slides/viewingmode/darkmode/01-todays-devotional.png`,
    `${siteUrl}/projects/work-day-with-god-slides/viewingmode/darkmode/05-reminder-settings.png`,
  ],
  description: "A free, private, offline Christian devotional application with 366 Christ-centred devotionals, bundled KJV Scripture, reflections, prayers, reminders, favourites, reading history, and a full-chapter Bible reader.",
  applicationCategory: "LifestyleApplication",
  applicationSubCategory: "Christian devotional application",
  operatingSystem: "Windows 10 or newer; Android 7.0 or newer; Linux x64 testing preview",
  softwareVersion: "Windows 1.4.3; Android 1.0.1; Linux 1.2.2 beta.1",
  datePublished: "2026-07-31",
  dateModified: "2026-08-05",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "CAD", availability: "https://schema.org/InStock" },
  downloadUrl: [downloads.windows, downloads.android, downloads.linuxAppImage],
  installUrl: [downloads.windows, downloads.android, downloads.linuxAppImage],
  featureList: ["366 Christ-centred daily devotionals", "Complete offline operation after installation", "Bundled KJV Scripture and nine full-chapter Bible translations", "Configurable devotional reminders", "Reading history, favourites, and streak tracking", "No accounts, advertisements, subscriptions, or paid features"],
  author: { "@type": "Person", name: "Kenneth Salmon", url: `${siteUrl}/about/` },
  publisher: { "@type": "Organization", name: "Majestic Creations", url: siteUrl },
  sameAs: repositoryUrl,
};

const platformRows = [
  { platform: "Windows x64", version: "1.4.3", status: "Stable", detail: "Unsigned per-user installer", available: true },
  { platform: "Android 7.0+", version: "1.0.1", status: "Stable GitHub APK", detail: "Signed with the project release key", available: true },
  { platform: "Linux x64", version: "1.2.2 beta.1", status: "Testing preview", detail: "Unsigned AppImage, DEB, and RPM", available: true },
  { platform: "iOS 15+", version: "1.0.0 source", status: "Not publicly released", detail: "Native project ready; requires Xcode signing", available: false },
];

export default function WorkDayWithGodPage() {
  return (
    <main className="product-page work-day-product" id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication).replaceAll("<", "\\u003c") }} />
      <SiteHeader className="product-header" actionHref={repositoryUrl} actionLabel="View source" actionIcon="↗" />

      <section className="product-hero">
        <div className="product-hero-copy">
          <Link className="product-back" href="/#work">← All projects</Link>
          <p className="section-kicker">Featured faith-based application</p>
          <h1>Work Day<br /><em>with God.</em></h1>
          <p className="product-deck">A quiet, Christ-centred companion for Scripture, reflection, and prayer throughout the working day—completely free, private, account-free, and available offline.</p>
          <div className="product-hero-actions">
            <a className="button primary" href="#downloads">Download the app <span>↓</span></a>
            <a className="button ghost" href={repositoryUrl} target="_blank" rel="noreferrer">GitHub repository <span>↗</span></a>
          </div>
          <dl className="product-facts">
            <div><dt>Devotionals</dt><dd>366</dd></div><div><dt>Price</dt><dd>Free</dd></div><div><dt>Account</dt><dd>Never</dd></div><div><dt>Offline</dt><dd>Yes</dd></div>
          </dl>
        </div>
        <figure className="product-cover"><img src="/projects/work-day-with-god-slides/00-work-day-with-god-cover.png" alt="Work Day with God — Work, Faith, Purpose cover artwork" /><figcaption><span>Work · Faith · Purpose</span><strong>Made for a quieter workday.</strong></figcaption></figure>
      </section>

      <section className="product-introduction" aria-labelledby="product-purpose">
        <div><p className="section-kicker">Purpose before engagement</p><h2 id="product-purpose">Make room for Scripture in the middle of the day.</h2></div>
        <div><p>Each calendar day presents a KJV anchor verse, an original Christ-centred reflection, a practical question, a closing thought, a prayer, and scenic artwork. Gentle reminders help the reader return without turning faith into another attention-demanding system.</p><p>The application began on Windows before the Majestic Creations website existed, then expanded to native Android notifications and a Linux testing preview while keeping the devotional content and personal reading state on the user’s own device.</p></div>
      </section>

      <section className="product-gallery-section" aria-labelledby="product-gallery-heading">
        <header><p className="section-kicker">Application preview</p><h2 id="product-gallery-heading">The interface follows your site theme.</h2><p>Switch the website between dark and light mode and every screenshot below changes to the matching Work Day with God capture while keeping your selected screen.</p></header>
        <WorkDayGallery />
      </section>

      <section className="product-features" aria-labelledby="product-features-heading">
        <header><p className="section-kicker">A complete devotional year</p><h2 id="product-features-heading">Built to support attention—not compete for it.</h2></header>
        <div className="product-feature-grid">
          <article><span>01</span><h3>Daily devotion</h3><p>366 original Christ-centred devotionals with KJV anchors, reflections, questions, closing thoughts, prayers, and scenic backgrounds.</p></article>
          <article><span>02</span><h3>Bible reading</h3><p>A full-chapter reader with nine locally bundled historical translations, including KJV, ASV, Darby, Douay-Rheims, Geneva 1560, and YLT.</p></article>
          <article><span>03</span><h3>Gentle reminders</h3><p>Choose scheduled times or repeating intervals, active weekdays, quiet hours, snooze behaviour, and pause controls appropriate to your day.</p></article>
          <article><span>04</span><h3>Your reading rhythm</h3><p>Revisit days through the calendar, preserve completion history and favourites, adjust reading controls, and use focus or reduced-motion modes.</p></article>
        </div>
      </section>

      <section className="product-privacy" aria-labelledby="product-privacy-heading">
        <div><p className="section-kicker">Free, private, and local-first</p><h2 id="product-privacy-heading">Your devotional life is not a dataset.</h2></div>
        <div className="privacy-commitments">
          <p>Work Day with God requires no account, subscription, advertising profile, or internet connection after installation. It does not send personal reading information to a server.</p>
          <ul><li>Settings, favourites, completion history, streaks, and reminders stay on your device.</li><li>Android cloud backup is disabled; manual JSON backup and restore remain under your control.</li><li>No runtime AI generates or changes devotional content.</li><li>Discord support is optional and is never connected to reading activity.</li></ul>
          <p className="privacy-note">Free of charge describes the cost of using the official application; it does not place the original writing, artwork, branding, or source code in the public domain.</p>
        </div>
      </section>

      <section className="product-downloads" id="downloads" aria-labelledby="downloads-heading">
        <header><p className="section-kicker">Official releases</p><h2 id="downloads-heading">Choose your platform.</h2><p>Downloads are served directly from the project’s GitHub Releases. Read the platform notice before installing.</p></header>
        <div className="platform-table" role="table" aria-label="Work Day with God platform availability">
          <div className="platform-table-heading" role="row"><span role="columnheader">Platform</span><span role="columnheader">Version</span><span role="columnheader">Status</span><span role="columnheader">Availability</span></div>
          {platformRows.map((row) => <div className="platform-row" role="row" key={row.platform}><span role="cell"><strong>{row.platform}</strong><small>{row.detail}</small></span><span role="cell">{row.version}</span><span role="cell">{row.status}</span><span role="cell" className={row.available ? "available" : "unavailable"}><i />{row.available ? "Available" : "Not released"}</span></div>)}
        </div>
        <div className="download-grid">
          <article><div><span className="download-platform">Windows x64</span><strong>1.4.3</strong><small>Stable · approximately 181 MiB</small></div><p>The public installer is unsigned, so Windows SmartScreen may show “Unknown publisher.” Confirm the filename and source before choosing “More info” and “Run anyway.”</p><a className="button primary" href={downloads.windows}>Download EXE <span>↓</span></a><a href="https://github.com/mcographics/WorkDaywithGod/releases/tag/v1.4.3" target="_blank" rel="noreferrer">Release notes ↗</a></article>
          <article><div><span className="download-platform">Android 7.0+</span><strong>1.0.1</strong><small>Stable GitHub APK · approximately 92.5 MiB</small></div><p>The APK is signed with the dedicated Work Day with God release key. Android may ask you to allow installation from your browser or file manager.</p><a className="button primary" href={downloads.android}>Download APK <span>↓</span></a><a href={downloads.androidChecksum}>SHA-256 checksum ↓</a></article>
          <article className="linux-download"><div><span className="download-platform">Linux x64</span><strong>1.2.2</strong><small>Experimental testing preview · unsigned</small></div><p>This is an older prerelease for feedback, not the current stable line. Choose the package suited to your distribution.</p><div className="linux-formats"><a href={downloads.linuxAppImage}>AppImage ↓</a><a href={downloads.linuxDeb}>DEB ↓</a><a href={downloads.linuxRpm}>RPM ↓</a></div><a href="https://github.com/mcographics/WorkDaywithGod/releases/tag/v1.2.2-linux-beta.1" target="_blank" rel="noreferrer">Testing notes ↗</a></article>
        </div>
      </section>

      <section className="product-related" aria-labelledby="related-heading">
        <div><p className="section-kicker">From the journal</p><h2 id="related-heading">The app that came before the website.</h2><p>Read how Work Day with God established the local-first, provenance-conscious, and Christ-centred principles that would later shape Majestic Creations.</p><Link className="button ghost" href="/blog/work-day-with-god-before-the-website">Read the origin story <span>→</span></Link></div>
        <img src="/projects/work-day-with-god.png" alt="Work Day with God devotional application artwork" />
      </section>

      <footer className="about-footer"><Link className="brand" href="/"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></Link><p>Apps · Games · Worlds · Ideas</p><div><Link href="/#work">Projects</Link><Link href="/blog">Blog</Link><Link href="/about">About Me</Link></div><small>© {new Date().getFullYear()} Majestic Creations. Built independently in Gatineau, Québec.</small></footer>
    </main>
  );
}
