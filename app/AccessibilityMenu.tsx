"use client";

import { useEffect, useRef, useState } from "react";

type AccessibilityPreferences = {
  contrast: boolean;
  colorVision: boolean;
  linkUnderline: boolean;
  motion: boolean;
  textSize: "default" | "large" | "x-large";
};

const storageKey = "majestic-creations-accessibility";
const defaults: AccessibilityPreferences = {
  contrast: false,
  colorVision: false,
  linkUnderline: false,
  motion: false,
  textSize: "default",
};

function applyPreferences(preferences: AccessibilityPreferences) {
  const root = document.documentElement;
  root.dataset.textSize = preferences.textSize;
  root.toggleAttribute("data-high-contrast", preferences.contrast);
  root.toggleAttribute("data-color-vision", preferences.colorVision);
  root.toggleAttribute("data-link-underline", preferences.linkUnderline);
  root.toggleAttribute("data-reduce-motion", preferences.motion);
}

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState(defaults);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let saved = defaults;
    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? "null");
      if (stored && typeof stored === "object") saved = { ...defaults, ...stored };
    } catch { /* Use the accessible defaults when storage is unavailable or invalid. */ }
    applyPreferences(saved);
    const frame = window.requestAnimationFrame(() => setPreferences(saved));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent | MouseEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") setOpen(false);
      if (event instanceof MouseEvent && menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("mousedown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("mousedown", close);
    };
  }, []);

  const update = (change: Partial<AccessibilityPreferences>) => {
    const next = { ...preferences, ...change };
    setPreferences(next);
    applyPreferences(next);
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Preferences still apply for this visit. */ }
  };

  const reset = () => update(defaults);

  return <div className="accessibility-menu" ref={menuRef}>
    <button
      type="button"
      className="accessibility-toggle"
      aria-label="Accessibility settings"
      aria-controls="accessibility-panel"
      aria-expanded={open}
      onClick={() => setOpen((current) => !current)}
    >
      <span aria-hidden="true">Aa</span><b>Accessibility</b>
    </button>
    {open && <div id="accessibility-panel" className="accessibility-panel" role="group" aria-label="Accessibility preferences">
      <div className="accessibility-heading"><strong>Ease of use</strong><small>Display preferences</small></div>
      <div className="accessibility-field">
        <span><label htmlFor="accessibility-text-size">Text size</label><small>Make writing easier to read</small></span>
        <select id="accessibility-text-size" value={preferences.textSize} onChange={(event) => update({ textSize: event.target.value as AccessibilityPreferences["textSize"] })}>
          <option value="default">Default</option>
          <option value="large">Large</option>
          <option value="x-large">Extra large</option>
        </select>
      </div>
      <PreferenceToggle id="high-contrast" label="High contrast" description="Stronger text and boundaries" checked={preferences.contrast} onChange={(contrast) => update({ contrast })} />
      <PreferenceToggle id="color-vision" label="Color-vision friendly" description="Blue and amber visual cues" checked={preferences.colorVision} onChange={(colorVision) => update({ colorVision })} />
      <PreferenceToggle id="link-underline" label="Underline links" description="Identify links without color" checked={preferences.linkUnderline} onChange={(linkUnderline) => update({ linkUnderline })} />
      <PreferenceToggle id="reduce-motion" label="Reduce motion" description="Stop animation and transitions" checked={preferences.motion} onChange={(motion) => update({ motion })} />
      <button type="button" className="accessibility-reset" onClick={reset}>Reset accessibility settings</button>
    </div>}
  </div>;
}

function PreferenceToggle({ id, label, description, checked, onChange }: { id: string; label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <div className="accessibility-field accessibility-switch">
    <span id={`accessibility-${id}-label`}><b>{label}</b><small>{description}</small></span>
    <button
      id={`accessibility-${id}`}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={`accessibility-${id}-label`}
      onClick={() => onChange(!checked)}
    ><i aria-hidden="true" /></button>
  </div>;
}
