import type { Metadata } from "next";
import SiteHeader from "../SiteHeader";
import DiscordCommunityWidget from "./DiscordCommunityWidget";
import { discordAppInviteUrl, discordUrlForChannel } from "./discord-config";

export const metadata: Metadata = { title: "Community | Majestic Creations", description: "Create. Connect. Build Together. Join the official Majestic Creations Discord community.", alternates: { canonical: "/community/" } };

const joinUrl = discordAppInviteUrl();
const spaces = [
  { number: "01", title: "Announcements", text: "Official studio news, releases, and Majestic Creations journal posts.", href: discordUrlForChannel("announcements") },
  { number: "02", title: "General Community", text: "Talk with the community, introduce yourself, and share what you are building.", href: discordUrlForChannel("general") },
  { number: "03", title: "App Discussions", text: "Discuss Majestic Creations applications and projects in focused community spaces.", href: discordUrlForChannel("appsCategory") },
  { number: "04", title: "Feedback", text: "Suggest improvements, share ideas, and help shape what comes next.", href: discordUrlForChannel("general") },
  { number: "05", title: "Support", text: "Get help with a Majestic Creations application or ask a practical question.", href: discordUrlForChannel("support") },
  { number: "06", title: "Bug Reports", text: "Report an application problem with enough context for the community to help.", href: discordUrlForChannel("support") },
];

export default function CommunityPage() {
  return <main className="community-page" id="top">
    <SiteHeader className="journal-header" activePage="community" actionHref={joinUrl} actionLabel="Open Discord" actionExternal={false} />
    <section className="community-hero"><div className="about-grid" aria-hidden="true" /><div><p className="eyebrow"><span /> Majestic Creations Community</p><h1>Create.<br /><em>Connect. Build Together.</em></h1><p>A focused home for announcements, application discussions, honest feedback, practical support, and the people helping Majestic Creations grow.</p><div className="community-cta-row"><a className="button primary" href={joinUrl}>Join the Discord <span>↗</span></a><a className="button ghost" href={discordUrlForChannel("general")}>Open Discord <span>↗</span></a></div></div><img src="/brand/majestic-lion.png" alt="Majestic Creations gold lion" /></section>
    <section className="community-widget-section"><div className="journal-section-heading"><div><p className="section-kicker">The official server</p><h2>Step inside<br />the studio.</h2></div><p className="community-widget-intro">The live Discord community is where the work becomes a conversation: news arrives, questions get answered, and new ideas find their people.</p></div><DiscordCommunityWidget /></section>
    <section className="community-spaces"><div className="journal-section-heading"><div><p className="section-kicker">Conversation spaces</p><h2>Find your<br />place.</h2></div><p className="community-widget-intro">Choose a direct channel below, or use the server invite if you are joining for the first time.</p></div><div className="space-grid">{spaces.map((space) => <a key={space.number} href={space.href}><span>{space.number}</span><h3>{space.title}</h3><p>{space.text}</p><b>Open in Discord ↗</b></a>)}</div><p className="community-note">The server invite is the fallback for visitors who are not already members. Dedicated application forums appear as Community setup is completed.</p></section>
    <footer className="about-footer"><a className="brand" href="/"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a><p>Apps · Games · Worlds · Ideas</p><div><a href="/">Home</a><a href="/blog">Blog</a><a href="/community">Community</a><a href="/about">About Me</a><a href="/contact">Contact Us</a></div><small>© {new Date().getFullYear()} Majestic Creations. Built independently in Gatineau, Québec.</small></footer>
  </main>;
}
