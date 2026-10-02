"use client";

import * as React from "react";
import { useSectionNav, SECTION_IDS, type SectionId } from "@/lib/section-nav";
import { usePrefersReducedMotion } from "@/lib/browser-state";

export function SectionScroller({ sections }: { sections: { id: SectionId; node: React.ReactNode }[] }) {
  const { requestIndex, setActiveIndex, clearRequest, goToId } = useSectionNav();
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const readHash = () => {
      const id = window.location.hash.slice(1) as SectionId;
      if (SECTION_IDS.includes(id)) goToId(id);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [goToId]);

  React.useEffect(() => {
    if (requestIndex === null) return;
    const id = sections[requestIndex]?.id;
    if (id) {
      document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
      setActiveIndex(requestIndex);
    }
    clearRequest();
  }, [requestIndex, sections, reducedMotion, setActiveIndex, clearRequest]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Observe a band below the header, rather than requiring tall sections to
    // fit the viewport. Native scrolling keeps inputs and dialogs usable.
    const observer = new IntersectionObserver((entries) => {
      const current = entries.find((entry) => entry.isIntersecting);
      if (current) setActiveIndex(Number((current.target as HTMLElement).dataset.sectionIndex));
    }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    container.querySelectorAll("[data-section-index]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [setActiveIndex]);

  return (
    <div ref={containerRef}>
      {sections.map((section, index) => (
        <div key={section.id} data-section-index={index} className="min-h-svh [&>section]:min-h-svh">
          {section.node}
        </div>
      ))}
    </div>
  );
}
