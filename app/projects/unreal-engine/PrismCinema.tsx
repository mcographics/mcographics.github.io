"use client";

import { useEffect, useRef, useState } from "react";

export default function PrismCinema() {
 const stage = useRef<HTMLDivElement>(null);
 const video = useRef<HTMLVideoElement>(null);
 const visible = useRef(false);
 const userPaused = useRef(false);
 const finished = useRef(false);
 const [ready, setReady] = useState(false);
 const [playing, setPlaying] = useState(false);
 const [ended, setEnded] = useState(false);
 const [failed, setFailed] = useState(false);

 useEffect(() => {
  const media = video.current;
  const container = stage.current;
  if (!media || !container) return;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const shouldAutoplay = () => !motion.matches && !document.documentElement.hasAttribute("data-reduce-motion") && !connection?.saveData;
  const resume = () => {
   if (!visible.current || document.hidden || userPaused.current || finished.current || !shouldAutoplay()) return;
   void media.play().then(() => {
    if (!visible.current || document.hidden) media.pause();
   }).catch(() => { /* The artwork and play button remain available if autoplay is blocked. */ });
  };
  const onVisibility = () => {
   if (document.hidden) media.pause();
   else resume();
  };
  const onMotionPreference = () => {
   if (!shouldAutoplay()) media.pause();
   else resume();
  };
  const observer = new IntersectionObserver(([entry]) => {
   visible.current = entry.isIntersecting && entry.intersectionRatio >= 0.2;
   if (visible.current) resume();
   else media.pause();
  }, { threshold: 0.2 });
  const preferences = new MutationObserver(onMotionPreference);
  preferences.observe(document.documentElement, { attributes: true, attributeFilter: ["data-reduce-motion"] });
  observer.observe(container);
  motion.addEventListener("change", onMotionPreference);
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
   observer.disconnect();
   preferences.disconnect();
   motion.removeEventListener("change", onMotionPreference);
   document.removeEventListener("visibilitychange", onVisibility);
   media.pause();
  };
 }, []);

 const toggle = () => {
  const media = video.current;
  if (!media || failed) return;
  if (!media.paused) {
   userPaused.current = true;
   media.pause();
   return;
  }
  userPaused.current = false;
  finished.current = false;
  setEnded(false);
  if (media.ended) media.currentTime = 0;
  void media.play().catch(() => { /* A blocked play request leaves the reference artwork visible. */ });
 };

 return <div ref={stage} className="prism-cinema prism-light-stage" data-rendering={ready && !failed ? "film" : "artwork"}>
  <picture><img src="/projects/jasperprism/banner.png" alt="JasperPrism: a stationary fused mineral and optical crystal revealing a spectrum beside landscape editing panels" width={2172} height={724} fetchPriority="high" /></picture>
  <video ref={video} id="prism-banner-film" className="prism-cinema-film" muted playsInline preload="none" aria-hidden="true"
   onPlaying={() => { setReady(true); setPlaying(true); }}
   onPause={() => setPlaying(false)}
   onEnded={() => { finished.current = true; setEnded(true); setPlaying(false); }}
   onError={() => { setFailed(true); setPlaying(false); setReady(false); }}>
   <source src="/projects/jasperprism/prism-banner-cinematic.mp4" type="video/mp4" />
  </video>
  <button className="prism-cinema-toggle" onClick={toggle} aria-controls="prism-banner-film" aria-pressed={playing} disabled={failed}>
   {failed ? "Animation unavailable" : playing ? "Pause animation" : ended ? "Replay animation" : "Play animation"}
   <span aria-hidden="true">{playing ? "Ⅱ" : ended ? "↻" : "▶"}</span>
  </button>
 </div>;
}
