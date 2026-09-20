// Public Discord identifiers only; private credentials stay server-side.
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
    appsCategory: "1551352279842431097",
  },
  applicationForumIds: {
    "the-islamic-dilemma": "1551352281142788107",
    "work-day-with-god": "1551352283034550374",
    "chainbreaker": "1551352284305297459",
    "bible-recorder-note-taker": "1551352285794279635",
    "from-darkness-to-light": "1551352287018876948",
    "creative-whiteboard": "1551352287832838184",
    "dossier-builder": "1551352288256458826",
    "words-of-yeshua": "1551352289451835492",
    "truth-news": "1551352289971802243",
    "public-nuisance": "1551352291158786200",
    "netrunner-launcher": "1551352292517740645",
    "project-database": "1551352293566455932",
    "gamingbible": "1551352294711361636",
    "character-profile-maker": "1551352295554547806",
  },
} as const;

export type DiscordChannelKey = keyof typeof discordConfig.channels;

export function discordWebChannelUrl(channelId?: string) {
  return channelId
    ? `https://discord.com/channels/${discordConfig.guildId}/${channelId}`
    : discordConfig.inviteUrl || `https://discord.com/channels/${discordConfig.guildId}`;
}

export function discordAppChannelUrl(channelId?: string) {
  return channelId
    ? `discord://-/channels/${discordConfig.guildId}/${channelId}`
    : `discord://-/channels/${discordConfig.guildId}`;
}

export function discordChannelUrl(channelId?: string) {
  return discordAppChannelUrl(channelId);
}

export function discordAppInviteUrl() {
  const inviteCode = discordConfig.inviteUrl.match(/discord\.gg\/([^/?#]+)/i)?.[1];
  return inviteCode ? `discord://discord.gg/${inviteCode}` : discordAppChannelUrl();
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
