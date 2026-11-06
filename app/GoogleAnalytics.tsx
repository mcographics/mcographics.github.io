"use client";

import { useEffect } from "react";

const measurementId = process.env.NEXT_PUBLIC_GA_ID?.trim();
const validMeasurementId = measurementId && /^G-[A-Z0-9]+$/i.test(measurementId) ? measurementId : null;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  [key: string]: unknown;
};

function setAnalyticsConsent(enabled: boolean) {
  if (!validMeasurementId) return;
  const page = window as AnalyticsWindow;
  page["ga-disable-" + validMeasurementId] = !enabled;
  if (!enabled) {
    page.gtag?.("consent", "update", { analytics_storage: "denied" });
    return;
  }
  if (document.getElementById("majestic-google-analytics")) return;
  page.dataLayer = page.dataLayer || [];
  page.gtag = function gtag() { page.dataLayer?.push(arguments); };
  page.gtag("js", new Date());
  page.gtag("config", validMeasurementId, { anonymize_ip: true });
  const script = document.createElement("script");
  script.id = "majestic-google-analytics";
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(validMeasurementId);
  document.head.appendChild(script);
}

export default function GoogleAnalytics() {
  useEffect(() => {
    if (!validMeasurementId) return;
    const savedChoice = window.localStorage.getItem("majestic-creations-privacy-consent");
    setAnalyticsConsent(savedChoice === "analytics");
    const onChoiceChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ analyticsEnabled?: boolean }>).detail;
      setAnalyticsConsent(detail?.analyticsEnabled === true);
    };
    window.addEventListener("privacy-consent-changed", onChoiceChanged);
    return () => window.removeEventListener("privacy-consent-changed", onChoiceChanged);
  }, []);

  return null;
}
