"use client";
import { useState } from "react";
import PrismIllumination from "./PrismIllumination";
export default function PrismIdentity() {
 const [playing,setPlaying]=useState(false),[hovered,setHovered]=useState(false),[focused,setFocused]=useState(false);
 return <>
 <button type="button" className="prism-identity-interactive prism-light-stage" data-playing={playing?"true":"false"} aria-pressed={playing} aria-label="Animate JasperPrism light" aria-describedby="prism-identity-hint"
 onClick={()=>{setPlaying(value=>!value);setHovered(false);setFocused(false);}} onPointerEnter={event=>{if(event.pointerType==="mouse")setHovered(true);}} onPointerLeave={()=>setHovered(false)} onFocus={event=>setFocused(event.currentTarget.matches(":focus-visible"))} onBlur={()=>setFocused(false)}>
 <picture><source type="image/webp" srcSet="/projects/jasperprism/crystal-cutout-640.webp 640w, /projects/jasperprism/crystal-cutout-960.webp 960w" sizes="(max-width: 760px) 90vw, 40vw" /><img src="/projects/jasperprism/crystal-cutout.png" alt="JasperPrism mineral and optical crystal with white and rainbow light rays, isolated without text" width={1254} height={1254} loading="lazy" decoding="async" /></picture>
 <PrismIllumination active={playing||hovered||focused} variant="identity" />
 </button>
 <figcaption>One identity. Two complementary ideas.<span id="prism-identity-hint">{playing?"Light animation on · Tap to pause":"Hover or focus to illuminate · Tap to animate"}</span></figcaption>
 </>;
}
