"use client";
import * as React from "react";
import { useSectionNav, SECTION_IDS, type SectionId } from "@/lib/section-nav";
import { useMotionSetting } from "@/lib/browser-state";
import { progressAtScroll } from "@/lib/journey";
import { chapterMotion } from "@/lib/chapter-motion";

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
    container.classList.toggle("chapter-motion-enabled", !paused);
    let frame = 0;
    let starts: number[] = [];
    let chapters: { node: HTMLElement; top: number; height: number }[] = [];
    let reveals: { node: HTMLElement; top: number }[] = [];
    let viewport = window.innerHeight;
    let compact = window.innerWidth < 1024;
    let previousIndex = -1;
    const update = () => {
      frame = 0;
      const value = progressAtScroll(window.scrollY, starts);
      progress.set(value);
      if (!paused) {
        chapters.forEach(({ node, top, height }, index) => {
          const pose = chapterMotion(
            top - window.scrollY,
            height,
            viewport,
            index,
            compact,
          );
          for (const [key, value] of Object.entries(pose)) {
            const unit = ["x", "y", "depth"].includes(key)
              ? "px"
              : ["turn", "tilt"].includes(key)
                ? "deg"
                : "";
            node.style.setProperty("--chapter-" + key, value.toFixed(4) + unit);
          }
          node.dataset.inTransit = String(
            (pose.enter > 0 || pose.exit > 0) &&
              top - window.scrollY < viewport * 1.2 &&
              top - window.scrollY + height > 0,
          );
        });
        reveals.forEach(({ node, top }) => {
          const entry = Math.max(
            0,
            Math.min(
              1,
              (top - window.scrollY - viewport * 0.7) / (viewport * 0.5),
            ),
          );
          node.style.setProperty("--reveal-progress", entry.toFixed(4));
        });
      }
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
      viewport = window.innerHeight;
      compact = window.innerWidth < 1024;
      // Offset positions ignore the visual transforms, avoiding a feedback loop.
      reveals = Array.from(
        container.querySelectorAll<HTMLElement>(".scroll-reveal"),
      ).map((node) => {
        let top = 0;
        let ancestor: HTMLElement | null = node;
        while (ancestor) {
          top += ancestor.offsetTop;
          ancestor = ancestor.offsetParent as HTMLElement | null;
        }
        return { node, top };
      });
      chapters = sections.flatMap(({ id }, index) => {
        const section = document.getElementById(id);
        if (!section) return [];
        section.dataset.coordinate = "0" + (index + 1);
        return [
          {
            node: section,
            top: section.getBoundingClientRect().top + window.scrollY,
            height: section.offsetHeight,
          },
        ];
      });
      starts = chapters.map(({ node: section, top }) => {
        const offset =
          parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
        return Math.max(0, top - offset);
      });
      schedule();
    };
    const resize = new ResizeObserver(measure);
    const contentChanges = new MutationObserver(measure);
    contentChanges.observe(container, { childList: true, subtree: true });
    resize.observe(container);
    container
      .querySelectorAll("[data-chapter]")
      .forEach((node) => resize.observe(node));
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      root.classList.remove("journey-scroll");
      container.classList.remove("chapter-motion-enabled");
      cancelAnimationFrame(frame);
      resize.disconnect();
      contentChanges.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
  }, [progress, sections, setActiveIndex, paused]);
  return (
    <div ref={containerRef} className="journey-sections">
      {sections.map((section) => (
        <React.Fragment key={section.id}>{section.node}</React.Fragment>
      ))}
    </div>
  );
}
