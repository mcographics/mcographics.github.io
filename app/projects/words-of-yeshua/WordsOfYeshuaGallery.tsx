"use client";

import { useState } from "react";

const screenshots = [
  { src: "/projects/words-of-yeshua-slides/viewingmode/lightmode/00-words-of-yeshua-cover.png", platform: "Windows", mode: "Light Mode", label: "Cover artwork", alt: "Words of Yeshua Scripture study cover artwork" },
  { src: "/projects/words-of-yeshua-slides/viewingmode/lightmode/words_of_yeshua_01_cropped.png", platform: "Windows", mode: "Light Mode", label: "Home screen", alt: "Words of Yeshua Windows home screen" },
  { src: "/projects/words-of-yeshua-slides/viewingmode/lightmode/words_of_yeshua_02_cropped.png", platform: "Windows", mode: "Light Mode", label: "Reading layout", alt: "Words of Yeshua Windows reading layout settings" },
  { src: "/projects/words-of-yeshua-slides/viewingmode/lightmode/words_of_yeshua_04_cropped.png", platform: "Windows", mode: "Light Mode", label: "Study details", alt: "Words of Yeshua Windows study details settings" },
  { src: "/projects/words-of-yeshua-slides/viewingmode/lightmode/words_of_yeshua_05_cropped.png", platform: "Windows", mode: "Light Mode", label: "Display settings", alt: "Words of Yeshua Windows display and window settings" },
  { src: "/projects/words-of-yeshua-slides/viewingmode/lightmode/words_of_yeshua_06_cropped.png", platform: "Windows", mode: "Light Mode", label: "Scripture exploration", alt: "Words of Yeshua Windows Scripture exploration screen" },
  { src: "/projects/words-of-yeshua-slides/viewingmode/lightmode/words_of_yeshua_07_cropped.png", platform: "Windows", mode: "Light Mode", label: "Passage search", alt: "Words of Yeshua Windows passage search screen" },
  { src: "/projects/words-of-yeshua-slides/viewingmode/lightmode/words_of_yeshua_08_cropped.png", platform: "Windows", mode: "Light Mode", label: "Chapter reading", alt: "Words of Yeshua Windows chapter reading screen" },
  { src: "/projects/words-of-yeshua-slides/viewingmode/lightmode/words_of_yeshua_09_cropped.png", platform: "Windows", mode: "Light Mode", label: "Saved passages", alt: "Words of Yeshua Windows saved passages screen" },
  { src: "/projects/words-of-yeshua-slides/viewingmode/lightmode/words_of_yeshua_10_cropped.png", platform: "Windows", mode: "Light Mode", label: "Application settings", alt: "Words of Yeshua Windows application settings screen" },
  { src: "/projects/words-of-yeshua-android-home.png", platform: "Android", mode: "Device capture", label: "Home screen", alt: "Words of Yeshua Android home screen captured on a Samsung phone" },
  { src: "/projects/words-of-yeshua-android-explore.png", platform: "Android", mode: "Device capture", label: "Explore screen", alt: "Words of Yeshua Android Explore screen captured on a Samsung phone" },
  { src: "/projects/words-of-yeshua-android-settings.png", platform: "Android", mode: "Device capture", label: "Settings and updates", alt: "Words of Yeshua Android Settings and App updates captured on a Samsung phone" },
] as const;

export default function WordsOfYeshuaGallery() {
  const [selected, setSelected] = useState(0);
  const active = screenshots[selected];

  return (
    <div className="product-gallery words-yeshua-gallery" data-gallery-theme="light">
      <figure className="product-gallery-stage">
        <img src={active.src} alt={active.alt} />
        <figcaption><span>{String(selected + 1).padStart(2, "0")} / {String(screenshots.length).padStart(2, "0")}</span><strong>{active.label}</strong><small>{active.platform} · {active.mode}</small></figcaption>
      </figure>
      <div className="product-gallery-thumbnails" role="group" aria-label="Words of Yeshua screenshot gallery">
        {screenshots.map((screenshot, index) => (
          <button type="button" key={screenshot.src} className={selected === index ? "active" : undefined} onClick={() => setSelected(index)} aria-label={`Show ${screenshot.platform} ${screenshot.label}`} aria-pressed={selected === index}>
            <img src={screenshot.src} alt="" />
            <span>{screenshot.platform} · {screenshot.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
