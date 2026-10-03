"use client";
import * as React from "react";
import { useSectionNav, SECTION_IDS, type SectionId } from "@/lib/section-nav";
import { useMotionSetting } from "@/lib/browser-state";
import { progressAtScroll } from "@/lib/journey";

export function SectionScroller({
  sections,
}: {
  sections: { id: SectionId; node: React.ReactNode }[];
}) {
  const { progress, requestIndex, setActiveIndex, clearRequest, goToId } =
    useSectionNav();
  const { paused } = useMotionSetting();
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const readHash = () => {
      const id = window.location.hash.slice(1);
      if (id === "fun") {
        const terminal =
          document.querySelector<HTMLDetailsElement>("[data-terminal]");
        if (terminal) terminal.open = true;
        goToId("about");
      } else if (SECTION_IDS.includes(id as SectionId)) goToId(id as SectionId);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    window.addEventListener("popstate", readHash);
    return () => {
      window.removeEventListener("hashchange", readHash);
      window.removeEventListener("popstate", readHash);
    };
  }, [goToId]);
  React.useEffect(() => {
    if (requestIndex === null) return;
    const id = sections[requestIndex]?.id;
    if (id) {
      const target = document.getElementById(id);
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
        target.scrollIntoView({
          behavior: paused ? "instant" : "smooth",
          block: "start",
        });
      }
      if (window.location.hash !== "#" + id)
        window.history.pushState(null, "", "#" + id);
    }
    clearRequest();
  }, [requestIndex, sections, paused, clearRequest]);
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const root = document.documentElement;
    root.classList.add("journey-scroll");
    let frame = 0;
    let starts: number[] = [];
    let previousIndex = -1;
    const update = () => {
      frame = 0;
      const value = progressAtScroll(window.scrollY, starts);
      progress.set(value);
      const index = Math.min(
        sections.length - 1,
        Math.floor(value * (sections.length - 1) + 0.35),
      );
      if (index !== previousIndex) {
        previousIndex = index;
        setActiveIndex(index);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      starts = sections.map(({ id }) => {
        const section = document.getElementById(id);
        if (!section) return 0;
        const offset =
          parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
        return Math.max(
          0,
          section.getBoundingClientRect().top + window.scrollY - offset,
        );
      });
      schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(container);
    container
      .querySelectorAll("[data-chapter]")
      .forEach((node) => resize.observe(node));
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      root.classList.remove("journey-scroll");
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
  }, [progress, sections, setActiveIndex]);
  return (
    <div ref={containerRef} className="journey-sections">
      {sections.map((section) => (
        <React.Fragment key={section.id}>{section.node}</React.Fragment>
      ))}
    </div>
  );
}
