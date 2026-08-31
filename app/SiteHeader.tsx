"use client";

import { useEffect, useState } from "react";
import AccessibilityMenu from "./AccessibilityMenu";
import ShareButton from "./ShareButton";
import ThemeToggle from "./ThemeToggle";

type ActivePage = "blog" | "community" | "about";

type SiteHeaderProps = {
  activePage?: ActivePage;
  className?: string;
  home?: boolean;
  actionHref?: string;
  actionLabel?: string;
  actionIcon?: string;
  actionExternal?: boolean;
};

const links = [
  { label: "Projects", href: "/#work" },
  { label: "Blog", href: "/blog", page: "blog" as ActivePage },
  { label: "Community", href: "/community", page: "community" as ActivePage },
  { label: "About Me", href: "/about", page: "about" as ActivePage },
  { label: "Studio", href: "/#studio" },
  { label: "Support", href: "/#support" },
];

export default function SiteHeader({ activePage, className = "", home = false, actionHref = "https://linktr.ee/Ken_S", actionLabel = "Portfolios & Socials", actionIcon = "↗", actionExternal = true }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const hrefFor = (href: string) => home && href.startsWith("/#") ? href.slice(1) : href;
  const navigation = (mobile = false) => links.map((link) => (
    <a key={link.label} href={hrefFor(link.href)} aria-current={link.page && link.page === activePage ? "page" : undefined} onClick={mobile ? () => setMobileMenuOpen(false) : undefined}>{link.label}</a>
  ));

  return (
    <header className={`site-header${className ? ` ${className}` : ""}`}>
      <a className="brand" href={home ? "#top" : "/"} aria-label="Majestic Creations home"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a>
      <nav aria-label="Primary navigation">{navigation()}</nav>
      <div className="header-actions">
        <AccessibilityMenu />
        <ThemeToggle />
        <ShareButton />
        <a className="header-cta" href={actionHref} target={actionExternal ? "_blank" : undefined} rel={actionExternal ? "noreferrer" : undefined} aria-label={actionLabel}>{actionLabel} <span>{actionIcon}</span></a>
        <button className={`mobile-menu-toggle${mobileMenuOpen ? " open" : ""}`} type="button" aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-controls="mobile-navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}><i /><i /><i /></button>
      </div>
      <nav id="mobile-navigation" className={`mobile-nav-panel${mobileMenuOpen ? " open" : ""}`} aria-label="Mobile navigation">{navigation(true)}<ShareButton mobile /></nav>
    </header>
  );
}
