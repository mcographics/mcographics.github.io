"use client";

import { useState } from "react";

const screenshots = [
  ["00-words-of-yeshua-cover.png", "Cover artwork", "Words of Yeshua Scripture study cover artwork"],
  ["words_of_yeshua_01_cropped.png", "Home screen", "Words of Yeshua home screen"],
  ["words_of_yeshua_02_cropped.png", "Reading layout", "Words of Yeshua reading layout settings"],
  ["words_of_yeshua_04_cropped.png", "Study details", "Words of Yeshua study details settings"],
  ["words_of_yeshua_05_cropped.png", "Windows display settings", "Words of Yeshua Windows display and window settings"],
  ["words_of_yeshua_06_cropped.png", "Scripture exploration", "Words of Yeshua Scripture exploration screen"],
  ["words_of_yeshua_07_cropped.png", "Passage search", "Words of Yeshua passage search screen"],
  ["words_of_yeshua_08_cropped.png", "Chapter reading", "Words of Yeshua chapter reading screen"],
  ["words_of_yeshua_09_cropped.png", "Saved passages", "Words of Yeshua saved passages screen"],
  ["words_of_yeshua_10_cropped.png", "Application settings", "Words of Yeshua application settings screen"],
] as const;

const screenshotPath = (file: string) => `/projects/words-of-yeshua-slides/viewingmode/lightmode/${file}`;

export default function WordsOfYeshuaGallery() {
  const [selected, setSelected] = useState(0);
  const active = screenshots[selected];

  return (
    <div className="product-gallery words-yeshua-gallery" data-gallery-theme="light">
      <figure className="product-gallery-stage">
        <img src={screenshotPath(active[0])} alt={active[2]} />
        <figcaption><span>{String(selected + 1).padStart(2, "0")} / {String(screenshots.length).padStart(2, "0")}</span><strong>{active[1]}</strong><small>Light Mode</small></figcaption>
      </figure>
      <div className="product-gallery-thumbnails" role="group" aria-label="Words of Yeshua screenshot gallery">
        {screenshots.map((screenshot, index) => (
          <button type="button" key={screenshot[0]} className={selected === index ? "active" : undefined} onClick={() => setSelected(index)} aria-label={`Show ${screenshot[1]}`} aria-pressed={selected === index}>
            <img src={screenshotPath(screenshot[0])} alt="" />
            <span>{screenshot[1]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
