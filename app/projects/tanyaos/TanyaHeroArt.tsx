"use client";

import { useEffect, useRef, useState } from "react";

type SiteTheme = "dark" | "light";

const artwork = {
  dark: "/projects/tanyaos-identity-2026.png",
  light: "/projects/tanyaos-identity-2026_light.png",
} satisfies Record<SiteTheme, string>;

const motionVideo = {
  dark: "/projects/tanya-presence-dark-v1.mp4",
  light: "/projects/tanya-presence-light-v1.mp4",
} satisfies Record<SiteTheme, string>;

export default function TanyaHeroArt() {
  const [siteTheme, setSiteTheme] = useState<SiteTheme>("dark");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [requestedThemes, setRequestedThemes] = useState<SiteTheme[]>([]);
  const [readyTheme, setReadyTheme] = useState<SiteTheme | null>(null);
  const motionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const enabled = readyTheme === siteTheme && !reducedMotion;
  const playing = enabled && !paused && inView && pageVisible;

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
    // Start the download only when the portrait is visible and motion is allowed.
    if (!inView || reducedMotion) return;
    const frame = window.requestAnimationFrame(() => {
      setRequestedThemes((requested) => requested.includes(siteTheme) ? requested : [...requested, siteTheme]);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [inView, reducedMotion, siteTheme]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    if (playing) {
      void video.play().catch(() => {
        // A browser that blocks autoplay still offers an explicit Play button.
        if (!cancelled) setPaused(true);
      });
    } else {
      video.pause();
    }
    return () => {
      cancelled = true;
      video.pause();
    };
  }, [playing, siteTheme]);

  const togglePlayback = () => {
    if (paused) {
      setPaused(false);
      void videoRef.current?.play().catch(() => setPaused(true));
    } else {
      videoRef.current?.pause();
      setPaused(true);
    }
  };

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
      data-playing={playing}
      aria-hidden="true"
    >
      <video
        key={siteTheme}
        ref={videoRef}
        className="tanya-portrait-video"
        data-motion-src={motionVideo[siteTheme]}
        data-ready={readyTheme === siteTheme}
        src={requestedThemes.includes(siteTheme) ? motionVideo[siteTheme] : undefined}
        width={1672}
        height={940}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        onLoadedData={() => setReadyTheme(siteTheme)}
        onError={() => setReadyTheme(null)}
      />
    </div>
    {enabled && <button
      type="button"
      className="tanya-motion-toggle"
      onClick={togglePlayback}
      aria-label={paused ? "Play Tanya's animation" : "Pause Tanya's animation"}
    >
      <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
      {paused ? "Play animation" : "Pause animation"}
    </button>}
  </>;
}
