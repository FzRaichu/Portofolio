"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectThumbnail } from "@/components/project-thumbnail";
import { ProjectDialog } from "@/components/project-dialog";
import { useMotionSetting } from "@/lib/browser-state";
import type { Project } from "@/lib/data";

export function ProjectGallery({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const activeRef = useRef(0);
  const drag = useRef({ start: 0, left: 0, down: false, moved: false });
  const { paused } = useMotionSetting();

  function goTo(index: number, instant = false) {
    const container = track.current;
    const slide = container?.children[index] as HTMLElement | undefined;
    if (!container || !slide) return;
    activeRef.current = index;
    setActive(index);
    container.scrollTo({
      left: slide.offsetLeft - (container.clientWidth - slide.offsetWidth) / 2,
      behavior: paused || instant ? "instant" : "smooth",
    });
  }

  useEffect(() => {
    const container = track.current;
    if (!container) return;
    // Keep the current thumbnail centered across orientation/viewport changes.
    const observer = new ResizeObserver(() => {
      const slide = container.children[activeRef.current] as
        HTMLElement | undefined;
      if (slide)
        container.scrollTo({
          left:
            slide.offsetLeft - (container.clientWidth - slide.offsetWidth) / 2,
          behavior: "instant",
        });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  function readPosition() {
    const container = track.current;
    if (!container) return;
    const center = container.scrollLeft + container.clientWidth / 2;
    let nearest = 0;
    let distance = Infinity;
    Array.from(container.children).forEach((child, index) => {
      const slide = child as HTMLElement;
      const next = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
      if (next < distance) {
        nearest = index;
        distance = next;
      }
    });
    activeRef.current = nearest;
    setActive(nearest);
  }

  return (
    <div
      className="project-gallery"
      role="region"
      aria-roledescription="carousel"
      aria-label="Project gallery"
      onKeyDown={(event) => {
        const index =
          event.key === "ArrowRight"
            ? Math.min(active + 1, projects.length - 1)
            : event.key === "ArrowLeft"
              ? Math.max(active - 1, 0)
              : event.key === "Home"
                ? 0
                : event.key === "End"
                  ? projects.length - 1
                  : null;
        if (index === null) return;
        event.preventDefault();
        goTo(index);
        (
          track.current?.children[index]?.querySelector(
            "button",
          ) as HTMLButtonElement | null
        )?.focus({ preventScroll: true });
      }}
    >
      <div className="gallery-topline">
        <span className="micro-label">THE PROJECT ARCHIVE</span>
        <span className="gallery-hint">
          Swipe or drag to explore · select to open
        </span>
      </div>
      <div
        className="gallery-track"
        ref={track}
        onScroll={readPosition}
        onPointerDown={(event) => {
          drag.current.down = false;
          drag.current.moved = false;
          if (event.pointerType !== "mouse" || event.button !== 0) return;
          drag.current = {
            start: event.clientX,
            left: event.currentTarget.scrollLeft,
            down: true,
            moved: false,
          };
        }}
        onPointerMove={(event) => {
          const state = drag.current;
          if (!state.down) return;
          const delta = event.clientX - state.start;
          if (Math.abs(delta) > 6 && !state.moved) {
            state.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.dataset.dragging = "true";
          }
          if (state.moved) {
            event.preventDefault();
            event.currentTarget.scrollLeft = state.left - delta;
          }
        }}
        onPointerUp={(event) => {
          drag.current.down = false;
          delete event.currentTarget.dataset.dragging;
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
          if (drag.current.moved) goTo(activeRef.current);
        }}
        onPointerCancel={(event) => {
          drag.current.down = false;
          delete event.currentTarget.dataset.dragging;
        }}
        onPointerLeave={() => {
          if (!drag.current.moved) drag.current.down = false;
        }}
        onClickCapture={(event) => {
          if (drag.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            drag.current.moved = false;
          }
        }}
      >
        {projects.map((project, index) => (
          <div
            key={project.slug}
            className="gallery-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${projects.length}: ${project.title}`}
            data-position={
              index === active ? "center" : index < active ? "left" : "right"
            }
          >
            <button
              type="button"
              className="gallery-card"
              aria-label={`View ${project.title}`}
              aria-haspopup="dialog"
              onFocus={() => goTo(index)}
              onClick={(event) => {
                opener.current = event.currentTarget;
                setSelected(index);
                setOpen(true);
              }}
            >
              <div className="gallery-image">
                <ProjectThumbnail project={project} />
                <span className="gallery-image-label">
                  {project.slug.startsWith("project-")
                    ? "SAMPLE PREVIEW"
                    : "SELECTED WORK"}
                </span>
                <span className="gallery-expand">
                  <ArrowUpRight size={20} />
                  <span>Explore project</span>
                </span>
              </div>
              <div className="gallery-caption">
                <span className="gallery-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.tags.slice(0, 3).join(" / ")}</p>
                </div>
                <ArrowUpRight size={22} />
              </div>
            </button>
          </div>
        ))}
      </div>
      <div className="gallery-controls">
        <button
          type="button"
          className="gallery-arrow"
          aria-label="Previous project"
          disabled={active === 0}
          onClick={() => goTo(active - 1)}
        >
          <ArrowLeft size={20} />
        </button>
        <div
          className="gallery-position"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>{String(active + 1).padStart(2, "0")}</span>
          <span className="gallery-progress">
            <span
              style={{ width: `${((active + 1) / projects.length) * 100}%` }}
            />
          </span>
          <span>{String(projects.length).padStart(2, "0")}</span>
          <span className="sr-only">{projects[active]?.title}</span>
        </div>
        <button
          type="button"
          className="gallery-arrow"
          aria-label="Next project"
          disabled={active === projects.length - 1}
          onClick={() => goTo(active + 1)}
        >
          <ArrowRight size={20} />
        </button>
      </div>
      <ProjectDialog
        project={projects[selected]}
        open={open}
        onOpenChange={setOpen}
        finalFocus={opener}
        index={selected}
        total={projects.length}
        onNavigate={(index) => setSelected(index)}
      />
    </div>
  );
}
