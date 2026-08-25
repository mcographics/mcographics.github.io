"use client";

import { useEffect, useRef, useState } from "react";

export default function ShareButton({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") setOpen(false);
      if (event instanceof MouseEvent && root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("click", close); document.removeEventListener("keydown", close); };
  }, []);

  const share = async () => {
    const data = { title: document.title, text: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "Majestic Creations", url: window.location.href };
    if (mobile && navigator.share) {
      try { await navigator.share(data); } catch { /* The visitor dismissed the system share sheet. */ }
      return;
    }
    setOpen((current) => !current);
  };

  const encodedUrl = typeof window === "undefined" ? "" : encodeURIComponent(window.location.href);
  const encodedTitle = typeof document === "undefined" ? "" : encodeURIComponent(document.title);
  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return <div className={`site-share${mobile ? " mobile-share" : " desktop-share"}`} ref={root}>
    <button type="button" className="site-share-toggle" onClick={share} aria-label="Share this page" aria-expanded={open}>Share <span>↗</span></button>
    {open ? <div className="share-menu" role="menu" aria-label="Share this page">
      <a role="menuitem" href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer">X</a>
      <a role="menuitem" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer">Facebook</a>
      <a role="menuitem" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer">LinkedIn</a>
      <a role="menuitem" href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}>Email</a>
      <button type="button" role="menuitem" onClick={copyLink}>{copied ? "Copied!" : "Copy link"}</button>
    </div> : null}
  </div>;
}
