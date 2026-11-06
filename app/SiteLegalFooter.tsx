"use client";

export default function SiteLegalFooter() {
  return <footer className="site-legal-footer" aria-label="Site policies">
    <nav aria-label="Legal and community links">
      <a href="/privacy/">Privacy</a>
      <a href="/terms/">Terms</a>
      <a href="/cookies/">Cookies</a>
      <a href="/community-guidelines/">Community guidelines</a>
      <button type="button" onClick={() => window.dispatchEvent(new Event("open-privacy-settings"))}>Privacy settings</button>
    </nav>
  </footer>;
}
