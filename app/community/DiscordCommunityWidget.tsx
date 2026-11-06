"use client";

import { useState } from "react";
import { discordAppInviteUrl, discordConfig } from "./discord-config";

function DiscordFallback() {
  const href = discordAppInviteUrl();
  return <div className="community-fallback"><p className="section-kicker">Majestic Creations Community</p><h3>Join the conversation on Discord</h3><p>The live server widget is unavailable here, but the community is still open.</p><a className="button primary" href={href}>Join Discord <span>↗</span></a></div>;
}

export default function DiscordCommunityWidget() {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) return <DiscordFallback />;
  if (!loaded) return <div className="community-fallback"><p className="section-kicker">Optional third-party preview</p><h3>Preview the Discord community</h3><p>Discord will receive a connection from your browser only after you choose to load its preview.</p><button className="button primary" type="button" onClick={() => setLoaded(true)}>Load Discord preview <span>↗</span></button><p><a href={discordAppInviteUrl()}>Join Discord directly</a></p></div>;

  return <div className="discord-widget-frame"><iframe src={discordConfig.widgetUrl} title="Majestic Creations Discord community" onError={() => setFailed(true)} referrerPolicy="no-referrer" /><div className="discord-widget-status is-ready" aria-live="polite">Official Discord community</div></div>;
}
