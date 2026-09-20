"use client";

import { useEffect, useState } from "react";
import { discordConfig } from "./discord-config";

function DiscordFallback() {
  const href = discordConfig.inviteUrl || `https://discord.com/channels/${discordConfig.guildId}`;
  return <div className="community-fallback"><p className="section-kicker">Majestic Creations Community</p><h3>Join the conversation on Discord</h3><p>The live server widget is unavailable here, but the community is still open.</p><a className="button primary" href={href} target="_blank" rel="noreferrer">Join Discord <span>↗</span></a></div>;
}

export default function DiscordCommunityWidget() {
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  useEffect(() => {
    const timeout = window.setTimeout(() => setStatus((current) => current === "loading" ? "fallback" : current), 8000);
    const controller = new AbortController();
    fetch(`https://discord.com/api/guilds/${discordConfig.guildId}/widget.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Discord widget unavailable (${response.status})`);
      })
      .catch(() => setStatus("fallback"));
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, []);

  if (status === "fallback") return <DiscordFallback />;
  return <div className="discord-widget-frame"><iframe src={discordConfig.widgetUrl} title="Majestic Creations Discord community" onLoad={() => setStatus("ready")} onError={() => setStatus("fallback")} /><div className={`discord-widget-status${status === "ready" ? " is-ready" : ""}`} aria-live="polite">{status === "ready" ? "Official Discord community" : "Loading the official Discord community…"}</div></div>;
}
