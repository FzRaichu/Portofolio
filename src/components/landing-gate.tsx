"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  animate,
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "motion/react";
import { ChevronDown } from "lucide-react";
import { LandingStarTrail } from "@/components/landing-star-trail";
import { useVisitor } from "@/lib/visitor";
import { AUTO_EDIT_KEY } from "@/lib/edit-mode";
import { useSessionValue, writeSessionValue } from "@/lib/browser-state";

export const LANDING_DISMISSED_KEY = "portfolio_landing_dismissed";
const OWNER_NAME = "Ferciano";

// Scroll-to-enter. Wheel/touch/keys accumulate into a 0→1 progress value that
// scrubs the exit: the starfield warps outward, the gate fades and pushes past
// the camera. Let go under COMMIT_AT and it springs back, so a stray scroll
// never throws you into the site.
const WHEEL_SPAN = 900; // px of wheel delta for a full sweep
const TOUCH_SPAN = 420;
const COMMIT_AT = 0.5;
const REST_MS = 150; // wheel has no "end" event — settle after a pause

export function LandingGate() {
  const router = useRouter();
  const { setVisitorName } = useVisitor();
  const [dismissed, setDismissed] = useSessionValue(LANDING_DISMISSED_KEY);
  const visible = dismissed !== "1";
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const isOwnerName = name.trim().toLowerCase() === OWNER_NAME.toLowerCase();

  // Exit progress. `warpRef` mirrors it for the canvas, which reads it inside
  // its own rAF loop rather than re-rendering React on every frame.
  const progress = useMotionValue(0);
  const warpRef = React.useRef(0);
  const committedRef = React.useRef(false);
  const nameRef = React.useRef(name);

  const overlayOpacity = useTransform(progress, [0, 0.75, 1], [1, 0.85, 0]);
  const overlayScale = useTransform(progress, [0, 1], [1, 1.08]);
  const contentOpacity = useTransform(progress, [0, 0.4], [1, 0]);
  const contentY = useTransform(progress, [0, 1], [0, -48]);
  const hintOpacity = useTransform(progress, [0, 0.2], [1, 0]);

  React.useEffect(() => {
    nameRef.current = name;
  }, [name]);

  React.useEffect(
    () => progress.on("change", (v) => (warpRef.current = v)),
    [progress]
  );

  React.useEffect(() => {
    if (isOwnerName) passwordRef.current?.focus();
  }, [isOwnerName]);

  const dismiss = React.useCallback(() => {
    setDismissed("1");
  }, [setDismissed]);

  const enterAsGuest = React.useCallback(
    (displayName: string) => {
      const trimmed = displayName.trim();
      if (trimmed) setVisitorName(trimmed);
      dismiss();
    },
    [dismiss, setVisitorName]
  );

  // Run the warp out to 1, then hand off to the site underneath.
  const commitExit = React.useCallback(() => {
    if (committedRef.current) return;
    committedRef.current = true;
    animate(progress, 1, {
      duration: 0.25 + 0.9 * (1 - progress.get()),
      ease: [0.4, 0, 0.2, 1],
      onComplete: () => enterAsGuest(nameRef.current),
    });
  }, [enterAsGuest, progress]);

  React.useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const main = document.getElementById("main-content");
    const header = document.querySelector("header");
    if (main) main.inert = true;
    if (header) header.inert = true;
    return () => {
      document.body.style.overflow = previousOverflow;
      if (main) main.inert = false;
      if (header) header.inert = false;
    };
  }, [visible]);

  React.useEffect(() => {
    if (!visible) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let restTimer: number | undefined;

    function settle() {
      if (committedRef.current) return;
      if (progress.get() >= COMMIT_AT) {
        commitExit();
      } else {
        animate(progress, 0, { type: "spring", stiffness: 260, damping: 30 });
      }
    }

    function advance(delta: number, span: number, scheduleRest: boolean) {
      if (committedRef.current) return;
      if (reduced) {
        // No warp worth watching — just go.
        enterAsGuest(nameRef.current);
        return;
      }
      const next = Math.max(0, Math.min(1, progress.get() + delta / span));
      progress.set(next);
      if (next >= 1) {
        commitExit();
        return;
      }
      if (scheduleRest) {
        window.clearTimeout(restTimer);
        restTimer = window.setTimeout(settle, REST_MS);
      }
    }

    function onWheel(e: WheelEvent) {
      if (e.deltaY === 0) return;
      e.preventDefault();
      advance(e.deltaY, WHEEL_SPAN, true);
    }

    let touching = false;
    let touchY = 0;

    function onTouchStart(e: TouchEvent) {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      touching = true;
      touchY = e.touches[0].clientY;
    }

    function onTouchMove(e: TouchEvent) {
      if (!touching || committedRef.current) return;
      const y = e.touches[0].clientY;
      const delta = touchY - y;
      touchY = y;
      if (delta === 0) return;
      e.preventDefault();
      advance(delta, TOUCH_SPAN, false);
    }

    function onTouchEnd() {
      if (!touching) return;
      touching = false;
      settle();
    }

    function onKeyDown(e: KeyboardEvent) {
      const inField = (e.target as HTMLElement).matches("input, textarea, [contenteditable]");
      if (inField) return;
      const isSpace = e.key === " " && !inField;
      if (e.key !== "ArrowDown" && e.key !== "PageDown" && !isSpace) return;
      e.preventDefault();
      // The section scroller also listens on window for ArrowDown — stop the
      // event here so it doesn't advance the page hidden behind the gate.
      e.stopPropagation();
      if (reduced) {
        enterAsGuest(nameRef.current);
        return;
      }
      commitExit();
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      window.clearTimeout(restTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, [visible, progress, commitExit, enterAsGuest]);

  function handleNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (isOwnerName) {
      passwordRef.current?.focus();
      return;
    }
    enterAsGuest(name);
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: OWNER_NAME, password }),
      });
      if (res.ok) {
        writeSessionValue(AUTO_EDIT_KEY, "1");
        dismiss();
        router.refresh();
        return;
      }
      // Wrong code: no error, no retry — just continue in like anyone else.
      enterAsGuest(name);
    } catch {
      enterAsGuest(name);
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Ferciano's portfolio"
      style={{ opacity: overlayOpacity, scale: overlayScale }}
      className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-background px-6"
    >
      <LandingStarTrail warpRef={warpRef} />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 w-full max-w-sm text-center"
      >
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleNameKeyDown}
          placeholder="tell me your name"
          aria-label="Your name"
          autoComplete="off"
          className="landing-field"
        />

        <AnimatePresence initial={false}>
          {isOwnerName && (
            <motion.form
              key="code"
              onSubmit={handlePasswordSubmit}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <input
                ref={passwordRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="the code"
                aria-label="Owner password"
                autoComplete="off"
                className="landing-field"
              />
            </motion.form>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => enterAsGuest(name)}
          className="mt-8 font-mono text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
        >
          skip →
        </button>
      </motion.div>

      <motion.div
        style={{ opacity: hintOpacity }}
        className="pointer-events-none absolute bottom-10 z-10 flex flex-col items-center gap-2 font-mono text-xs text-muted-foreground/60"
      >
        <span>scroll to enter</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-4" />
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
