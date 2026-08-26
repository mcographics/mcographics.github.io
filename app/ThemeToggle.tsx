"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const storageKey = "majestic-creations-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    let savedTheme: Theme = "dark";
    try {
      if (window.localStorage.getItem(storageKey) === "light") savedTheme = "light";
    } catch { /* Dark remains the safe default when storage is unavailable. */ }
    applyTheme(savedTheme);
    const frame = window.requestAnimationFrame(() => setTheme(savedTheme));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    try { window.localStorage.setItem(storageKey, nextTheme); } catch { /* The active theme still applies for this visit. */ }
  };

  const nextTheme = theme === "dark" ? "light" : "dark";

  return <button
    type="button"
    className="theme-toggle"
    onClick={toggleTheme}
    aria-label={`Switch to ${nextTheme} mode`}
    aria-pressed={theme === "light"}
    title={`Switch to ${nextTheme} mode`}
  >
    <span className="theme-toggle-icon" aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
    <span className="theme-toggle-label">{theme === "dark" ? "Light" : "Dark"}</span>
  </button>;
}
