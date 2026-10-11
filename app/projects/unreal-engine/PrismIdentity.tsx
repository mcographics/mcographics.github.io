"use client";
import { useEffect, useRef, useState } from "react";

export default function PrismIdentity() {
 const videoRef = useRef<HTMLVideoElement>(null);
 const buttonRef = useRef<HTMLButtonElement>(null);
 const [requested, setRequested] = useState(false);
 const [revealed, setRevealed] = useState(false);
 useEffect(() => {
  const video = videoRef.current;
  if (!video) return;
  let cancelled = false;
  setRevealed(false);
  if (requested) {
   void video.play().catch(() => { if (!cancelled) setRequested(false); });
  } else {
   video.pause();
   video.currentTime = 0;
  }
  return () => { cancelled = true; video.pause(); };
 }, [requested]);
 useEffect(() => {
  const stop = () => setRequested(false);
  const onVisibility = () => { if (document.hidden) stop(); };
  const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) stop(); });
  if (buttonRef.current) observer.observe(buttonRef.current);
  document.addEventListener("visibilitychange", onVisibility);
  return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
 }, []);
 const autoPlay = () => {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && !document.documentElement.hasAttribute("data-reduce-motion")) setRequested(true);
 };
 return <>
  <button ref={buttonRef} type="button" className="prism-identity-interactive prism-light-stage prism-video-reveal" data-revealed={revealed && requested ? "true" : "false"} aria-pressed={requested} aria-label={requested ? "Stop JasperPrism reveal" : "Play JasperPrism reveal"} aria-describedby="prism-identity-hint"
   onClick={() => setRequested(value => !value)}
   onPointerEnter={event => { if (event.pointerType === "mouse") autoPlay(); }}
   onPointerLeave={event => { if (event.pointerType === "mouse") setRequested(false); }}
   onFocus={event => { if (event.currentTarget.matches(":focus-visible")) autoPlay(); }}
   onBlur={() => setRequested(false)}>
   <picture><source type="image/webp" srcSet="/projects/jasperprism/crystal-cutout-640.webp 640w, /projects/jasperprism/crystal-cutout-960.webp 960w" sizes="(max-width: 760px) 90vw, 40vw" /><img src="/projects/jasperprism/crystal-cutout.png" alt="JasperPrism mineral and optical crystal with white and rainbow light rays, isolated without text" width={1254} height={1254} loading="lazy" decoding="async" /></picture>
   <video ref={videoRef} src="/projects/jasperprism/prism-reveal.mp4" muted playsInline preload="none" aria-hidden="true" tabIndex={-1} onPlaying={() => setRevealed(true)} onEnded={() => setRequested(false)} onError={() => setRequested(false)} />
  </button>
  <figcaption>One identity. Two complementary ideas.<span id="prism-identity-hint">{requested ? "Reveal active · Tap to stop" : "Hover or focus to reveal · Tap to play"}</span></figcaption>
 </>;
}
