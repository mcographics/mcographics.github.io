"use client";

import { useEffect, useState } from "react";

type SiteTheme = "dark" | "light";

const screenshots = [
  { file: "01-todays-devotional.png", title: "Today’s devotional", alt: "Work Day with God daily devotional reading with Scripture, reflection, and a pause-and-reflect prompt" },
  { file: "02-future-devotionals.png", title: "Future devotionals", alt: "Work Day with God future devotionals calendar" },
  { file: "03-reading-history.png", title: "Reading history", alt: "Work Day with God reading history calendar" },
  { file: "04-reading-menu.png", title: "Reading menu", alt: "Work Day with God devotional reading controls and accessibility tools" },
  { file: "05-reminder-settings.png", title: "Reminder settings", alt: "Work Day with God notification schedule and reminder settings" },
  { file: "06-appearance-settings.png", title: "Appearance & reading", alt: "Work Day with God appearance, colour mode, and Bible translation settings" },
  { file: "07-verse-card.png", title: "Daily verse card", alt: "Work Day with God scenic daily Scripture verse card" },
];

const screenshotPath = (theme: SiteTheme, file: string) => `/projects/work-day-with-god-slides/viewingmode/${theme}mode/${file}`;

export default function WorkDayGallery() {
  const [siteTheme, setSiteTheme] = useState<SiteTheme>("dark");
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setSiteTheme(root.dataset.theme === "light" ? "light" : "dark");
    const frame = window.requestAnimationFrame(syncTheme);
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const active = screenshots[selected];

  return (
    <div className="product-gallery" data-gallery-theme={siteTheme}>
      <figure className="product-gallery-stage">
        <img
          src={screenshotPath(siteTheme, active.file)}
          data-dark-src={screenshotPath("dark", active.file)}
          data-light-src={screenshotPath("light", active.file)}
          alt={active.alt}
          decoding="async"
        />
        <figcaption><span>{String(selected + 1).padStart(2, "0")} / {String(screenshots.length).padStart(2, "0")}</span><strong>{active.title}</strong><small>{siteTheme} mode</small></figcaption>
      </figure>
      <div className="product-gallery-thumbnails" role="group" aria-label="Work Day with God screenshot gallery">
        {screenshots.map((screenshot, index) => (
          <button type="button" key={screenshot.file} className={selected === index ? "active" : undefined} onClick={() => setSelected(index)} aria-label={`Show ${screenshot.title}`} aria-pressed={selected === index}>
            <img src={screenshotPath(siteTheme, screenshot.file)} alt="" loading="lazy" decoding="async" />
            <span>{screenshot.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
