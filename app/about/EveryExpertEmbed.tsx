"use client";

import { useEffect, useRef } from "react";

const everyExpertEmbedUrl = "https://www.everyexpert.com/embed/kennethsalmon.js";

export default function EveryExpertEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const script = document.createElement("script");
    script.src = everyExpertEmbedUrl;
    script.async = true;
    container.appendChild(script);

    return () => {
      container.replaceChildren();
    };
  }, []);

  return <div ref={containerRef} className="everyexpert-embed" aria-label="Kenneth Salmon on EveryExpert" />;
}
