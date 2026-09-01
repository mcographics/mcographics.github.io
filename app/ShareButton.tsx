"use client";

import { useEffect, useRef, useState } from "react";

type ShareButtonProps = {
  mobile?: boolean;
  compact?: boolean;
  title?: string;
  text?: string;
  url?: string;
};

export default function ShareButton({ mobile = false, compact = false, title, text, url }: ShareButtonProps) {
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

  const shareTitle = title ?? (typeof document === "undefined" ? "Majestic Creations" : document.title);
  const shareText = text ?? (typeof document === "undefined" ? "Majestic Creations" : document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "Majestic Creations");
  const targetUrl = () => {
    if (typeof window === "undefined") return url ?? "";
    return new URL(url ?? window.location.href, window.location.origin).toString();
  };

  const share = async () => {
    const data = { title: shareTitle, text: shareText, url: targetUrl() };
    const compactMobile = compact && window.matchMedia("(max-width: 760px)").matches;
    if ((mobile || compactMobile) && navigator.share) {
      try { await navigator.share(data); } catch { /* The visitor dismissed the system share sheet. */ }
      return;
    }
    setOpen((current) => !current);
  };

  const encodedUrl = typeof window === "undefined" ? "" : encodeURIComponent(targetUrl());
  const encodedTitle = encodeURIComponent(shareTitle);
  const copyLink = async () => {
    await navigator.clipboard.writeText(targetUrl());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const className = compact ? " project-share" : mobile ? " mobile-share" : " desktop-share";
  const label = compact ? `Share ${shareTitle}` : "Share this page";

  return <div className={`site-share${className}`} ref={root}>
    <button type="button" className="site-share-toggle" onClick={share} aria-label={label} title={label} aria-expanded={open}>{compact ? "Share" : <>Share <span>↗</span></>}</button>
    {open ? <div className="share-menu" role="menu" aria-label={label}>
      <a role="menuitem" href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer">X</a>
      <a role="menuitem" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer">Facebook</a>
      <a role="menuitem" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer">LinkedIn</a>
      <a role="menuitem" href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}>Email</a>
      <button type="button" role="menuitem" onClick={copyLink}>{copied ? "Copied!" : "Copy link"}</button>
    </div> : null}
  </div>;
}
