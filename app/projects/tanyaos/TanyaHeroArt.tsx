"use client";

import { useEffect, useRef, useState } from "react";

type SiteTheme = "dark" | "light";

const artwork = {
  dark: "/projects/tanyaos-identity-2026.png",
  light: "/projects/tanyaos-identity-2026_light.png",
} satisfies Record<SiteTheme, string>;

export default function TanyaHeroArt() {
  const [siteTheme, setSiteTheme] = useState<SiteTheme>("dark");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [loadedExpressions, setLoadedExpressions] = useState<string[]>([]);
  const motionRef = useRef<HTMLDivElement>(null);
  const expressionsReady = ["blink", "smile"].every((expression) => loadedExpressions.includes(`${siteTheme}-${expression}`));
  const enabled = expressionsReady && !reducedMotion;

  useEffect(() => {
    const root = document.documentElement;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreferences = () => {
      setSiteTheme(root.dataset.theme === "light" ? "light" : "dark");
      setReducedMotion(motionPreference.matches || root.hasAttribute("data-reduce-motion"));
    };
    const syncVisibility = () => setPageVisible(!document.hidden);
    const frame = window.requestAnimationFrame(() => {
      syncPreferences();
      syncVisibility();
    });
    const observer = new MutationObserver(syncPreferences);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme", "data-reduce-motion"] });
    const intersection = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (motionRef.current) intersection.observe(motionRef.current);
    motionPreference.addEventListener("change", syncPreferences);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      motionPreference.removeEventListener("change", syncPreferences);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useEffect(() => {
    // Exported pages can finish loading their images before React attaches onLoad.
    const frame = window.requestAnimationFrame(() => {
      const images = motionRef.current?.querySelectorAll("img");
      const ready = ["blink", "smile"]
        .filter((_, index) => images?.[index]?.complete && images[index].naturalWidth > 0)
        .map((expression) => `${siteTheme}-${expression}`);
      setLoadedExpressions((loaded) => ready.every((asset) => loaded.includes(asset)) ? loaded : [...new Set([...loaded, ...ready])]);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [siteTheme]);

  return <>
    <img
      src={artwork[siteTheme]}
      data-dark-src={artwork.dark}
      data-light-src={artwork.light}
      alt="An artistic vision of Tanya, a female digital face formed from luminous blue neural filaments."
      width={siteTheme === "light" ? 1671 : 1672}
      height={941}
      fetchPriority="high"
    />
    <div
      ref={motionRef}
      className="tanya-portrait-motion"
      data-enabled={enabled}
      data-playing={enabled && !paused && inView && pageVisible}
      aria-hidden="true"
    >
      {(["blink", "smile"] as const).map((expression) => {
        const asset = `${siteTheme}-${expression}`;
        return <img
          key={asset}
          className={`tanya-expression tanya-expression-${expression}`}
          src={`/projects/tanya-expressions/${asset}.webp`}
          alt=""
          width={siteTheme === "light" ? 1671 : 1672}
          height={941}
          decoding="async"
          draggable={false}
          onLoad={() => setLoadedExpressions((loaded) => loaded.includes(asset) ? loaded : [...loaded, asset])}
        />;
      })}
    </div>
    {enabled && <button
      type="button"
      className="tanya-motion-toggle"
      onClick={() => setPaused((value) => !value)}
      aria-label={paused ? "Play Tanya's animation" : "Pause Tanya's animation"}
    >
      <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
      {paused ? "Play animation" : "Pause animation"}
    </button>}
  </>;
}
