import type { Metadata } from "next";

export const metadata: Metadata = { title: "Community | Majestic Creations", description: "Discuss projects, ask questions, share feedback, and help shape what Majestic Creations builds next." };

const discussionUrl = "https://github.com/mcographics/mcographics.github.io/discussions";
const spaces = [
  { number: "01", title: "Announcements", text: "Official studio news, releases, and important project updates." },
  { number: "02", title: "Project Conversations", text: "Discuss Majestic Creations applications, games, experiments, and works in progress." },
  { number: "03", title: "Ideas & Feedback", text: "Suggest features, share constructive feedback, and help shape what comes next." },
  { number: "04", title: "Questions & Support", text: "Ask for help, compare solutions, and learn alongside other community members." },
];

export default function CommunityPage() {
  return <main className="community-page" id="top">
    <header className="site-header journal-header"><a className="brand" href="/" aria-label="Majestic Creations home"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a><nav aria-label="Primary navigation"><a href="/#work">Projects</a><a href="/#studio">Studio</a><a href="/blog">Blog</a><a href="/community" aria-current="page">Community</a><a href="/#support">Support</a><a href="/about">About Me</a></nav><a className="header-cta" href={discussionUrl} target="_blank" rel="noreferrer">Open discussions <span>↗</span></a></header>
    <section className="community-hero"><div className="about-grid" aria-hidden="true" /><div><p className="eyebrow"><span /> Built through conversation</p><h1>Your ideas.<br /><em>Our community.</em></h1><p>A place to ask questions, share feedback, discuss the projects, and help shape what Majestic Creations builds next.</p><a className="button primary" href={discussionUrl} target="_blank" rel="noreferrer">Enter the community <span>↗</span></a></div><img src="/brand/majestic-lion.png" alt="Majestic Creations gold lion" /></section>
    <section className="community-spaces"><div className="journal-section-heading"><p className="section-kicker">Conversation spaces</p><h2>Find your<br />place.</h2></div><div className="space-grid">{spaces.map((space) => <a key={space.number} href={discussionUrl} target="_blank" rel="noreferrer"><span>{space.number}</span><h3>{space.title}</h3><p>{space.text}</p><b>View discussions ↗</b></a>)}</div><p className="community-note">Reading is public. A free GitHub account is required to start a topic, reply, or react. Community conversations are moderated through GitHub Discussions.</p></section>
    <footer className="about-footer"><a className="brand" href="/"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a><p>Apps · Games · Worlds · Ideas</p><div><a href="/">Home</a><a href="/blog">Blog</a><a href="/about">About Me</a></div><small>© {new Date().getFullYear()} Majestic Creations. Built independently in Gatineau, Québec.</small></footer>
  </main>;
}
