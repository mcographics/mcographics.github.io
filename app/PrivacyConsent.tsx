"use client";

import { useEffect, useState } from "react";

type ConsentChoice = "essential" | "analytics";

function publishChoice(choice: ConsentChoice) {
  window.localStorage.setItem("majestic-creations-privacy-consent", choice);
  window.dispatchEvent(new CustomEvent("privacy-consent-changed", { detail: { analyticsEnabled: choice === "analytics" } }));
}

export default function PrivacyConsent() {
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("majestic-creations-privacy-consent");
    if (saved === "essential" || saved === "analytics") {
      setChoice(saved);
      setAnalyticsEnabled(saved === "analytics");
    }
    setReady(true);
    const openSettings = () => setSettingsOpen(true);
    window.addEventListener("open-privacy-settings", openSettings);
    return () => window.removeEventListener("open-privacy-settings", openSettings);
  }, []);

  const saveChoice = (next: ConsentChoice) => {
    publishChoice(next);
    setChoice(next);
    setAnalyticsEnabled(next === "analytics");
    setSettingsOpen(false);
  };

  if (!ready) return null;
  const panelOpen = choice === null || settingsOpen;

  return (
    <div className="privacy-consent-widget">
      {panelOpen ? (
        <section className="privacy-consent-panel" aria-labelledby="privacy-consent-title">
          <div className="privacy-consent-copy">
            <p className="section-kicker">Your privacy choices</p>
            <h2 id="privacy-consent-title">{settingsOpen && choice !== null ? "Privacy settings" : "Choose optional analytics"}</h2>
            <p>Essential browser storage remembers your display, accessibility, and privacy choices. Optional Google Analytics helps measure site visits and stays off unless you allow it. Read the <a href="/privacy/">Privacy Policy</a> and <a href="/cookies/">Cookie Notice</a>.</p>
          </div>
          {settingsOpen && choice !== null && (
            <label className="privacy-analytics-toggle">
              <input type="checkbox" checked={analyticsEnabled} onChange={(event) => setAnalyticsEnabled(event.target.checked)} />
              <span><b>Optional analytics</b><small>Allow Google Analytics measurement when it is configured.</small></span>
            </label>
          )}
          <div className="privacy-consent-actions">
            <button type="button" className="privacy-choice-button secondary" onClick={() => saveChoice("essential")}>Reject optional</button>
            {settingsOpen && choice !== null
              ? <button type="button" className="privacy-choice-button primary" onClick={() => saveChoice(analyticsEnabled ? "analytics" : "essential")}>Save preferences</button>
              : <button type="button" className="privacy-choice-button primary" onClick={() => saveChoice("analytics")}>Allow analytics</button>}
            {settingsOpen && choice !== null && <button type="button" className="privacy-choice-close" onClick={() => setSettingsOpen(false)}>Close</button>}
          </div>
        </section>
      ) : (
        <button type="button" className="privacy-settings-button" onClick={() => setSettingsOpen(true)}>Privacy settings</button>
      )}
    </div>
  );
}
