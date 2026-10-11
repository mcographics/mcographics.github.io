"use client";

import { useState } from "react";

export default function LightStudy() {
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [original, setOriginal] = useState(false);
  const reset = () => { setContrast(100); setSaturation(100); setOriginal(false); };

  return <div className="prism-study">
    <div className="prism-study-image"><picture><source type="image/webp" srcSet="/projects/jasperprism/banner-1086.webp 1086w, /projects/jasperprism/banner-2172.webp 2172w" sizes="(max-width: 760px) 90vw, 70vw" /><img src="/projects/jasperprism/banner.png" alt="JasperPrism brand artwork used for an illustrative colour study" width={2172} height={724} loading="lazy" decoding="async" style={{ filter: original ? "none" : `contrast(${contrast}%) saturate(${saturation}%)` }} /></picture><span className="prism-study-badge">{original ? "Original artwork" : "Browser light study"}</span></div>
    <div className="prism-study-controls"><div className="prism-control"><label htmlFor="prism-contrast">Contrast <output htmlFor="prism-contrast">{contrast}%</output></label><input id="prism-contrast" type="range" min="90" max="110" step="1" value={contrast} onChange={(event) => setContrast(Number(event.target.value))} /></div><div className="prism-control"><label htmlFor="prism-saturation">Colour <output htmlFor="prism-saturation">{saturation}%</output></label><input id="prism-saturation" type="range" min="90" max="110" step="1" value={saturation} onChange={(event) => setSaturation(Number(event.target.value))} /></div><div className="prism-study-buttons"><button type="button" aria-pressed={original} onClick={() => setOriginal((value) => !value)}>{original ? "View study" : "View original"}</button><button type="button" onClick={reset}>Reset</button></div></div>
    <p className="prism-study-note">Interactive brand study · Browser colour filters on supplied artwork. This is not a demonstration of the Unreal Engine plugin’s output.</p>
  </div>;
}
