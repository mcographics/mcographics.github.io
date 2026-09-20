import {
  discordUrlForChannel,
  projectDiscordUrl,
  type DiscordChannelKey,
} from "../community/discord-config";

type BlogDiscussionDestination =
  | { project: string }
  | { channel: DiscordChannelKey };

// Keep this mapping explicit so a project article always lands in that
// project's forum, while broader studio and website articles can use the
// appropriate community channel.
const blogDiscussionDestinations: Record<string, BlogDiscussionDestination> = {
  "bible-recorder-note-taker-1-0-0": { project: "bible-recorder-note-taker" },
  "chainbreaker-android-mvp": { project: "chainbreaker" },
  "creative-whiteboard-alpha": { project: "creative-whiteboard" },
  "dossier-builder-local-first-workspace": { project: "dossier-builder" },
  "from-darkness-to-light-first-build": { project: "from-darkness-to-light" },
  "from-islam-to-christ-v0-2-0": { project: "from-darkness-to-light" },
  "from-islam-to-christ-v0-2-28-build": { project: "from-darkness-to-light" },
  "from-islam-to-christ-v0-2-29-translation-and-release": { project: "from-darkness-to-light" },
  "islamic-dilemma-0-1-1-test-4-github-updater": { project: "the-islamic-dilemma" },
  "project-database-v0-1-0": { project: "project-database" },
  "public-nuisance-v1-1-1": { project: "public-nuisance" },
  "responsive-verse-card-design": { project: "work-day-with-god" },
  "smart-app-control-work-day-with-god": { project: "work-day-with-god" },
  "words-of-yeshua-android-v0-1-0": { project: "words-of-yeshua" },
  "words-of-yeshua-android-v0-1-2": { project: "words-of-yeshua" },
  "words-of-yeshua-v0-5-2": { project: "words-of-yeshua" },
  "work-day-with-god-1-4-9-android-1-0-3-update": { project: "work-day-with-god" },
  "work-day-with-god-before-the-website": { project: "work-day-with-god" },
  "work-day-with-god-linux-1-4-4-preview": { project: "work-day-with-god" },
  "work-day-with-god-windows-1-4-4-display-scaling": { project: "work-day-with-god" },
  "work-day-with-god-windows-linux-installation": { project: "work-day-with-god" },
  "featured-release-orbit-artwork-update": { channel: "websiteUpdates" },
  "portfolio-accessibility-and-app-categories": { channel: "websiteUpdates" },
  "site-maintenance-update-august-2026": { channel: "websiteUpdates" },
};

export function blogDiscussionUrl(articleSlug: string) {
  const destination = blogDiscussionDestinations[articleSlug];
  if (!destination) return discordUrlForChannel("general");
  return "project" in destination
    ? projectDiscordUrl(destination.project, "discussion")
    : discordUrlForChannel(destination.channel);
}
