"use client";

import { useEffect, useRef } from "react";

const everyExpertEmbedUrl = "https://www.everyexpert.com/embed/kennethsalmon.js";

export default function EveryExpertEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const loadEmbed = () => {
      const script = document.createElement("script");
      script.src = everyExpertEmbedUrl;
      script.async = true;
      if (document.documentElement.dataset.theme !== "light") script.dataset.theme = "dark";
      container.replaceChildren(script);
    };

    loadEmbed();
    const themeObserver = new MutationObserver(loadEmbed);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      themeObserver.disconnect();
      container.replaceChildren();
    };
  }, []);

  return <div ref={containerRef} className="everyexpert-embed" aria-label="Kenneth Salmon on EveryExpert" />;
}
