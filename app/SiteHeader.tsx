"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import AccessibilityMenu from "./AccessibilityMenu";
import BrandImage from "./BrandImage";
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

type NavigationChild = {
  label: string;
  href: string;
  page?: ActivePage;
  mobileClassName?: string;
};

type NavigationLink = {
  key: string;
  label: string;
  href: string;
  page?: ActivePage;
  children?: NavigationChild[];
};

const links: NavigationLink[] = [
  {
    key: "projects",
    label: "Projects",
    href: "/#work",
    children: [
      { label: "Jasper Prism", href: "/projects/jasperprism/", mobileClassName: "mobile-unreal-engine-link" },
      { label: "Research Project: Tanya OS", href: "/projects/tanyaos/", mobileClassName: "mobile-research-link" },
      { label: "ForgeMCP", href: "/projects/forgemcp/" },
      { label: "↳ ForgeAI", href: "/projects/forgeai/", mobileClassName: "mobile-nav-sub-link forgeai-child-link" },
    ],
  },
  {
    key: "collaborations",
    label: "Collaborations",
    href: "/collaborations/",
    children: [
      { label: "Journey with Jesus", href: "/collaborations/journey-with-jesus/" },
    ],
  },
  {
    key: "blog",
    label: "Blog",
    href: "/blog",
    page: "blog",
    children: [{ label: "Community", href: "/community", page: "community" }],
  },
  {
    key: "studio",
    label: "Studio",
    href: "/#studio",
    children: [{ label: "About Me", href: "/about", page: "about" }],
  },
  {
    key: "contact",
    label: "Contact Us",
    href: "/contact",
    children: [{ label: "Support", href: "/#support" }],
  },
];

export default function SiteHeader({ activePage, className = "", home = false, actionHref = "https://linktr.ee/Ken_S", actionLabel = "Portfolios & Socials", actionIcon = "↗", actionExternal = true }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopOpenMenu, setDesktopOpenMenu] = useState<string | null>(null);
  const [mobileOpenMenu, setMobileOpenMenu] = useState<string | null>(null);
  const desktopTriggerRefs = useRef(new Map<string, HTMLAnchorElement>());
  const mobileNavigationRef = useRef<HTMLElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      const activeElement = document.activeElement;
      if (mobileNavigationRef.current?.contains(activeElement)) {
        setMobileMenuOpen(false);
        setMobileOpenMenu(null);
        mobileMenuButtonRef.current?.focus();
      }

      const focusedDropdown = links.find((link) =>
        link.children?.length && desktopTriggerRefs.current.get(link.key)?.parentElement?.contains(activeElement),
      );
      if (focusedDropdown) desktopTriggerRefs.current.get(focusedDropdown.key)?.focus();
      setDesktopOpenMenu(null);
      setMobileOpenMenu(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const hrefFor = (href: string) => home && href.startsWith("/#") ? href.slice(1) : href;
  const pageAttributes = (page?: ActivePage) => page && page === activePage ? { "aria-current": "page" as const } : {};
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileOpenMenu(null);
  };

  const navigation = (mobile = false) => links.map((link) => {
    const submenuId = mobile ? `mobile-${link.key}-submenu` : link.key === "projects" ? "projects-submenu" : `${link.key}-submenu`;

    if (link.children?.length && mobile) {
      const isOpen = mobileOpenMenu === link.key;
      return (
        <Fragment key={link.key}>
          <div className="mobile-nav-group">
            <a href={hrefFor(link.href)} {...pageAttributes(link.page)} onClick={closeMobileMenu}>{link.label}</a>
            <button
              className="mobile-nav-group-toggle"
              type="button"
              aria-label={`${isOpen ? "Collapse" : "Expand"} ${link.label} links`}
              aria-expanded={isOpen}
              aria-controls={submenuId}
              onClick={() => setMobileOpenMenu((openMenu) => openMenu === link.key ? null : link.key)}
            >
              <span aria-hidden="true" />
            </button>
          </div>
          <div className="mobile-nav-submenu" id={submenuId} hidden={!isOpen}>
            {link.children.map((child) => (
              <a key={child.label} className={child.mobileClassName ?? "mobile-nav-sub-link"} href={hrefFor(child.href)} {...pageAttributes(child.page)} onClick={closeMobileMenu}>{child.label}</a>
            ))}
          </div>
        </Fragment>
      );
    }

    if (link.children?.length) {
      const isOpen = desktopOpenMenu === link.key;
      return (
        <div
          key={link.key}
          className="nav-dropdown"
          data-open={isOpen}
          onMouseEnter={() => setDesktopOpenMenu(link.key)}
          onMouseLeave={(event) => { if (!event.currentTarget.contains(document.activeElement)) setDesktopOpenMenu(null); }}
          onFocus={() => setDesktopOpenMenu(link.key)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDesktopOpenMenu(null); }}
        >
          <a
            ref={(element) => {
              if (element) desktopTriggerRefs.current.set(link.key, element);
              else desktopTriggerRefs.current.delete(link.key);
            }}
            href={hrefFor(link.href)}
            aria-expanded={isOpen}
            aria-controls={submenuId}
            {...pageAttributes(link.page)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowDown") return;
              event.preventDefault();
              setDesktopOpenMenu(link.key);
              window.requestAnimationFrame(() => document.getElementById(submenuId)?.querySelector<HTMLAnchorElement>("a")?.focus());
            }}
          >
            {link.label}
          </a>
          <div className="nav-dropdown-panel" id={submenuId} hidden={!isOpen}>
            {link.children.map((child) => (
              <a key={child.label} className={child.label === "↳ ForgeAI" ? "forgeai-child-link" : undefined} href={hrefFor(child.href)} {...pageAttributes(child.page)} onClick={() => setDesktopOpenMenu(null)}>{child.label}</a>
            ))}
          </div>
        </div>
      );
    }

    return <a key={link.key} href={hrefFor(link.href)} {...pageAttributes(link.page)} onClick={mobile ? closeMobileMenu : undefined}>{link.label}</a>;
  });

  return (
    <header className={`site-header${className ? ` ${className}` : ""}`}>
      <a className="brand" href={home ? "#top" : "/"} aria-label="Majestic Creations home"><BrandImage alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a>
      <nav aria-label="Primary navigation">{navigation()}</nav>
      <div className="header-actions">
        <AccessibilityMenu />
        <ThemeToggle />
        <ShareButton />
        <a className="header-cta" href={actionHref} target={actionExternal ? "_blank" : undefined} rel={actionExternal ? "noreferrer" : undefined} aria-label={actionLabel}>{actionLabel} <span>{actionIcon}</span></a>
        <button ref={mobileMenuButtonRef} className={`mobile-menu-toggle${mobileMenuOpen ? " open" : ""}`} type="button" aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-controls="mobile-navigation" aria-expanded={mobileMenuOpen} onClick={() => { setMobileMenuOpen((open) => !open); setMobileOpenMenu(null); }}><i /><i /><i /></button>
      </div>
      <nav ref={mobileNavigationRef} id="mobile-navigation" className={`mobile-nav-panel${mobileMenuOpen ? " open" : ""}`} aria-label="Mobile navigation">{navigation(true)}<ShareButton mobile /></nav>
    </header>
  );
}
