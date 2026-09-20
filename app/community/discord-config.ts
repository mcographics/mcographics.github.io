// Public Discord identifiers only. Never add a bot token, client secret, or webhook secret here.
export const discordConfig = {
  guildId: "1533387552092848248",
  inviteUrl: "https://discord.gg/ZCrytJXEFC",
  widgetUrl: "https://discord.com/widget?id=1533387552092848248&theme=dark",
  channels: {
    startHere: "1551321513238466651",
    announcements: "1551321514727444573",
    websiteUpdates: "1551328047914029246",
    general: "1551321519286780034",
    introductions: "1551321520121315349",
    support: "1551321523619500073",
    appsCategory: "",
  },
  // Filled with public Discord forum channel IDs after Community mode is enabled and setup is rerun.
  applicationForumIds: {} as Record<string, string>,
} as const;

export type DiscordChannelKey = keyof typeof discordConfig.channels;

export function discordChannelUrl(channelId?: string) {
  return channelId
    ? `https://discord.com/channels/${discordConfig.guildId}/${channelId}`
    : discordConfig.inviteUrl || `https://discord.com/channels/${discordConfig.guildId}`;
}

export function discordUrlForChannel(key: DiscordChannelKey) {
  return discordChannelUrl(discordConfig.channels[key]);
}

export function projectDiscordUrl(slug: string, purpose: "discussion" | "support" | "feedback" = "discussion") {
  const forumId = discordConfig.applicationForumIds[slug];
  if (forumId) return discordChannelUrl(forumId);
  if (purpose === "support" || purpose === "feedback") return discordUrlForChannel("support");
  return discordUrlForChannel("general");
}
