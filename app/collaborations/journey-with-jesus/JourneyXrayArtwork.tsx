"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

// Serve optimized copies from this GitHub Pages site so both layers load together.
const mainArtwork = "/images/journey-with-jesus-main.webp";
const revealedArtwork = "/images/journey-with-jesus-glory.webp";

export default function JourneyXrayArtwork() {
  const [showLens, setShowLens] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const touchDragging = useRef(false);

  const moveLens = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
    const y = Math.max(0, Math.min(bounds.height, event.clientY - bounds.top));
    event.currentTarget.style.setProperty("--collab-xray-x", `${x}px`);
    event.currentTarget.style.setProperty("--collab-xray-y", `${y}px`);
  };

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      moveLens(event);
      setShowAll(false);
      setShowLens(true);
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" && !touchDragging.current) return;
    moveLens(event);
    if (!showAll) setShowLens(true);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") {
      touchDragging.current = true;
      moveLens(event);
      setShowAll(false);
      setShowLens((previous) => !previous);
    } else {
      moveLens(event);
      setShowLens(true);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setShowLens(false);
    setShowAll((previous) => !previous);
  };

  return (
    <div
      className={`collab-detail-visual collab-xray-visual${showLens && !showAll ? " is-revealing" : ""}${showAll ? " is-revealed-all" : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={showAll}
      aria-label="Journey with Jesus interactive artwork. Move your mouse over the image to reveal the radiant second image. On touch screens, tap to toggle the reveal and drag to move it. Press Enter or Space to toggle the complete reveal."
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") setShowLens(false);
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={() => { touchDragging.current = false; }}
      onPointerCancel={() => { touchDragging.current = false; }}
      onKeyDown={handleKeyDown}
      onBlur={() => { setShowLens(false); setShowAll(false); }}
      onDoubleClick={() => { setShowLens(false); setShowAll((previous) => !previous); }}
    >
      <img
        className="collab-xray-art collab-xray-hidden-art"
        src={revealedArtwork}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
      <img
        className="collab-xray-art collab-xray-main-art"
        src={mainArtwork}
        alt="Jesus gestures toward a glowing valley beside a young man under an autumn tree."
        loading="eager"
        decoding="async"
      />
      <span className="collab-xray-art-label" aria-hidden="true">Journey with Jesus / Visual study</span>
      <span className="collab-xray-instruction" aria-hidden="true">
        <span className="collab-xray-instruction-desktop">Move cursor to reveal</span>
        <span className="collab-xray-instruction-touch">Tap and drag to reveal</span>
      </span>
    </div>
  );
}
