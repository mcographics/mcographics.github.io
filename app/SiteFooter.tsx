"use client";

import BrandImage from "./BrandImage";

export default function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <div className="site-footer-brand-group">
            <a className="site-footer-brand" href="/" aria-label="Majestic Creations home">
              <BrandImage alt="" />
              <span>MAJESTIC <b>CREATIONS</b></span>
            </a>
            <p className="site-footer-tagline">Apps · Games · Worlds · Ideas</p>
          </div>
        </div>
        <div className="site-footer-bottom">
          <small>© {new Date().getFullYear()} Majestic Creations. Built independently in Gatineau, Québec.</small>
          <nav className="site-footer-legal-nav" aria-label="Legal and community links">
            <a href="/privacy/">Privacy</a>
            <a href="/terms/">Terms</a>
            <a href="/cookies/">Cookies</a>
            <a href="/community-guidelines/">Community guidelines</a>
            <button type="button" onClick={() => window.dispatchEvent(new Event("open-privacy-settings"))}>Privacy settings</button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
