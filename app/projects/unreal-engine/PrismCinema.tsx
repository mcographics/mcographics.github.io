"use client";
import { useState } from "react";
import PrismIllumination from "./PrismIllumination";
export default function PrismCinema() {
 const [ready,setReady]=useState(false),[paused,setPaused]=useState(false);
 return <div className="prism-cinema prism-light-stage" data-rendering={ready?"live":"artwork"}>
 <picture><img src="/projects/jasperprism/banner.png" alt="JasperPrism: original mineral and glass crystal artwork with white and refracted spectrum rays" width={2172} height={724} fetchPriority="high" /></picture>
 <PrismIllumination active={!paused} variant="banner" onReady={setReady} label="Animated JasperPrism artwork: traveling illumination along the original rays of a stationary crystal" />
 {ready && <button className="prism-cinema-toggle" onClick={()=>setPaused(value=>!value)} aria-pressed={paused}>{paused?"Play animation":"Pause animation"}<span aria-hidden="true">{paused?"▶":"Ⅱ"}</span></button>}
 </div>;
}
