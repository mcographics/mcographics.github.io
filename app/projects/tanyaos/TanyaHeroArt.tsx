"use client";

import { useEffect, useState } from "react";

type SiteTheme = "dark" | "light";

const artwork = {
  dark: "/projects/tanyaos-identity-2026.png",
  light: "/projects/tanyaos-identity-2026_light.png",
} satisfies Record<SiteTheme, string>;

export default function TanyaHeroArt() {
  const [siteTheme, setSiteTheme] = useState<SiteTheme>("dark");

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setSiteTheme(root.dataset.theme === "light" ? "light" : "dark");
    const frame = window.requestAnimationFrame(syncTheme);
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <img
    src={artwork[siteTheme]}
    data-dark-src={artwork.dark}
    data-light-src={artwork.light}
    alt="An artistic vision of Tanya, a female digital face formed from luminous blue neural filaments."
    width={1671}
    height={941}
    fetchPriority="high"
  />;
}
