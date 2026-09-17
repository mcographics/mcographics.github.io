"use client";

import { useEffect, useRef, useState } from "react";

type ShareButtonProps = {
  mobile?: boolean;
  compact?: boolean;
  title?: string;
  text?: string;
  url?: string;
  shareImage?: string;
};

export default function ShareButton({ mobile = false, compact = false, title, text, url, shareImage }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"link" | "instagram" | null>(null);
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
  const shareImageUrl = () => {
    if (!shareImage) return "";
    if (typeof window === "undefined") return shareImage;
    return new URL(shareImage, window.location.origin).toString();
  };
  const bannerFile = async () => {
    if (!shareImage) return null;
    try {
      const response = await fetch(shareImageUrl(), { credentials: "same-origin" });
      if (!response.ok) return null;
      const blob = await response.blob();
      const type = blob.type || "image/png";
      const extension = type.split("/")[1]?.replace("jpeg", "jpg") || "png";
      const fileBase = shareTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "majestic-creations";
      return new File([blob], `${fileBase}-banner.${extension}`, { type });
    } catch {
      return null;
    }
  };

  const share = async () => {
    const data: ShareData = { title: shareTitle, text: shareText, url: targetUrl() };
    const compactMobile = compact && window.matchMedia("(max-width: 760px)").matches;
    if ((mobile || compactMobile) && navigator.share) {
      try {
        const file = await bannerFile();
        const shareData = file && navigator.canShare?.({ files: [file] }) ? { ...data, files: [file] } : data;
        await navigator.share(shareData);
      } catch { /* The visitor dismissed the system share sheet or the app rejected the optional image. */ }
      return;
    }
    setOpen((current) => !current);
  };

  const absoluteUrl = typeof window === "undefined" ? url ?? "" : targetUrl();
  const absoluteImageUrl = typeof window === "undefined" ? shareImage ?? "" : shareImageUrl();
  const encodedUrl = encodeURIComponent(absoluteUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedEmailBody = encodeURIComponent([shareText, absoluteUrl, absoluteImageUrl ? `Project banner: ${absoluteImageUrl}` : ""].filter(Boolean).join("\n\n"));
  const encodedWhatsAppMessage = encodeURIComponent([shareTitle, shareText, absoluteUrl].filter(Boolean).join("\n\n"));
  const copyTargetUrl = async (source: "link" | "instagram") => {
    try {
      await navigator.clipboard.writeText(targetUrl());
      setCopied(source);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      // Clipboard access can be unavailable outside a secure browsing context.
    }
  };
  const copyLink = async () => {
    await copyTargetUrl("link");
  };
  const copyInstagramPayload = async () => {
    try {
      const file = await bannerFile();
      if (file && navigator.clipboard.write && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([new ClipboardItem({
          [file.type]: file,
          "text/plain": new Blob([targetUrl()], { type: "text/plain" }),
        })]);
      } else {
        await navigator.clipboard.writeText(targetUrl());
      }
      setCopied("instagram");
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      // Clipboard access can be unavailable outside a secure browsing context.
    }
  };
  const shareToInstagram = async () => {
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    await copyInstagramPayload();
  };

  const className = compact ? " project-share" : mobile ? " mobile-share" : " desktop-share";
  const label = compact ? `Share ${shareTitle}` : "Share this page";

  return <div className={`site-share${className}`} ref={root}>
    <button type="button" className="site-share-toggle" onClick={share} aria-label={label} title={label} aria-expanded={open}>{compact ? "Share" : <>Share <span>↗</span></>}</button>
    {open ? <div className="share-menu" role="menu" aria-label={label}>
      <a role="menuitem" href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer">X</a>
      <a role="menuitem" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer">Facebook</a>
      <a role="menuitem" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer">LinkedIn</a>
      <button type="button" role="menuitem" data-share-target="instagram" aria-label="Copy project banner and link, then open Instagram" title="Copy project banner and link, then open Instagram" onClick={shareToInstagram}>{copied === "instagram" ? "Instagram ✓" : "Instagram"}</button>
      <a role="menuitem" href={`https://wa.me/?text=${encodedWhatsAppMessage}`} target="_blank" rel="noreferrer">WhatsApp</a>
      <a role="menuitem" href={`mailto:?subject=${encodedTitle}&body=${encodedEmailBody}`}>Email</a>
      <button type="button" role="menuitem" onClick={copyLink}>{copied === "link" ? "Copied!" : "Copy link"}</button>
    </div> : null}
  </div>;
}
