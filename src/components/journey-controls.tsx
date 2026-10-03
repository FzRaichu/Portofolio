"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { usePathname } from "next/navigation";
import { CHAPTERS } from "@/lib/journey";
import { useSectionNav } from "@/lib/section-nav";
import { useMotionSetting } from "@/lib/browser-state";

export function JourneyControls() {
  const { progress, activeIndex, goToId } = useSectionNav();
  const { paused, reduced, toggle } = useMotionSetting();
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "still" : "full";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [paused]);
  if (pathname !== "/") return null;
  return (
    <>
      <div aria-hidden="true" className="journey-progress">
        <motion.div style={{ scaleX: progress }} />
      </div>
      <nav className="chapter-rail" aria-label="Journey chapters">
        {CHAPTERS.map((chapter, index) => (
          <button
            key={chapter.id}
            type="button"
            aria-label={`Go to ${chapter.label.toLowerCase()}`}
            aria-current={index === activeIndex ? "step" : undefined}
            onClick={() => goToId(chapter.id)}
          >
            <span className="rail-label">{chapter.label}</span>
            <span className="rail-mark" />
          </button>
        ))}
      </nav>
      <div className="journey-status">
        <span className="status-chapter">
          <span className="status-dot" />
          {String(activeIndex + 1).padStart(2, "0")} / 05{" "}
          <span className="status-divider">—</span>{" "}
          {CHAPTERS[activeIndex].label}
        </span>
        <button
          type="button"
          onClick={toggle}
          disabled={reduced}
          aria-pressed={paused}
          aria-label={
            reduced
              ? "Reduced motion enabled by your device"
              : paused
                ? "Enable animation"
                : "Pause animation"
          }
        >
          {paused ? <Play size={12} /> : <Pause size={12} />}
          <span>{paused ? "Still view" : "Motion on"}</span>
        </button>
      </div>
    </>
  );
}
