"use client";

import BrandImage from "./BrandImage";

export default function SiteLegalFooter() {
  return <footer className="site-legal-footer" aria-label="Site policies">
    <a className="site-legal-brand" href="/" aria-label="Majestic Creations home"><BrandImage alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a>
    <nav aria-label="Legal and community links">
      <a href="/privacy/">Privacy Policy</a>
      <a href="/terms/">Terms of Use</a>
      <a href="/cookies/">Cookie Notice</a>
      <a href="/community-guidelines/">Community Guidelines</a>
      <button type="button" onClick={() => window.dispatchEvent(new Event("open-privacy-settings"))}>Privacy settings</button>
    </nav>
    <small>© {new Date().getFullYear()} Majestic Creations · Gatineau, Québec</small>
  </footer>;
}
