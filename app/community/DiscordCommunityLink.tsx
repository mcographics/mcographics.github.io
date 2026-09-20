import { discordConfig, projectDiscordUrl } from "./discord-config";

type Props = { slug: string; title: string };

export default function DiscordCommunityLink({ slug, title }: Props) {
  const hasForum = Boolean(discordConfig.applicationForumIds[slug]);
  return <section className="project-discord-community" aria-labelledby="project-discord-heading">
    <div><p className="section-kicker">Community on Discord</p><h2 id="project-discord-heading">Keep building with {title}.</h2></div>
    <div><p>Ask questions, share ideas, report a problem, or help shape the next release with the Majestic Creations community.</p><div className="project-discord-actions">
      <a className="button primary" href={projectDiscordUrl(slug, "discussion")}>Discuss this app <span>↗</span></a>
      <a className="button ghost" href={projectDiscordUrl(slug, "support")}>Get support <span>↗</span></a>
      <a className="button ghost" href={projectDiscordUrl(slug, "feedback")}>Share feedback <span>↗</span></a>
    </div><small>{hasForum ? "This project has a dedicated Discord forum." : "Join the community now; this project’s dedicated forum will appear here when it is configured."}</small></div>
  </section>;
}
