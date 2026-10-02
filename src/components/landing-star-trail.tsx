"use client";

import * as React from "react";

type Star = {
  bx: number;
  by: number;
  x: number;
  y: number;
  size: number;
  phase: number;
  twinkleSpeed: number;
};

const STAR_COUNT = 160;
const REPEL_RADIUS = 150;
const MAX_PUSH = 60;
const EASE = 0.12;
// Scroll-to-enter warp: `warpRef` is a plain ref rather than state so the
// scroll progress can drive the canvas every frame without re-rendering React.
// At warp 1 stars have flown well off-screen and stretched into streaks.
const WARP_PUSH = 2.4;
const WARP_STREAK = 0.55;

// Ambient starfield, like sly.systems: stars sit still and twinkle, but dodge away when the cursor gets close, then drift back once it moves off.
export function LandingStarTrail({
  warpRef,
}: {
  warpRef?: React.RefObject<number>;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars: Star[] = [];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: STAR_COUNT }, () => {
        const bx = Math.random() * width;
        const by = Math.random() * height;
        return {
          bx,
          by,
          x: bx,
          y: by,
          size: Math.random() * 1.5 + 0.4,
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.5 + 0.2,
        };
      });
    }
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: -9999, y: -9999 };

    function handlePointerMove(e: PointerEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function handlePointerLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    let raf = 0;
    let t = 0;

    function frame() {
      t += 1;
      ctx!.clearRect(0, 0, width, height);

      const warp = warpRef ? warpRef.current : 0;
      // Squared so the field barely stirs at the start of the gesture and
      // then tears away — the acceleration is what sells the departure.
      const warpEase = warp * warp;
      const cx = width / 2;
      const cy = height / 2;

      for (const star of stars) {
        let targetX = star.bx;
        let targetY = star.by;

        if (!reducedMotion) {
          const dx = star.bx - mouse.x;
          const dy = star.by - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS) {
            const strength = 1 - dist / REPEL_RADIUS;
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);
            targetX = star.bx + nx * strength * MAX_PUSH;
            targetY = star.by + ny * strength * MAX_PUSH;
          }
        }

        star.x += (targetX - star.x) * EASE;
        star.y += (targetY - star.y) * EASE;

        const twinkle =
          0.4 + 0.6 * Math.abs(Math.sin(t * 0.01 * star.twinkleSpeed + star.phase));
        let alpha = 0.15 + twinkle * 0.5;

        let px = star.x;
        let py = star.y;
        let streak = 0;

        if (warpEase > 0.001) {
          const ox = star.x - cx;
          const oy = star.y - cy;
          px = star.x + ox * warpEase * WARP_PUSH;
          py = star.y + oy * warpEase * WARP_PUSH;
          streak = Math.hypot(px - star.x, py - star.y) * WARP_STREAK;
          alpha = Math.min(1, alpha * (1 + warp * 1.2));
        }

        const color = `rgba(255,255,255,${alpha.toFixed(3)})`;

        if (streak > 1) {
          const len = Math.hypot(px - cx, py - cy) || 1;
          ctx!.strokeStyle = color;
          ctx!.lineWidth = star.size * 1.6;
          ctx!.lineCap = "round";
          ctx!.beginPath();
          ctx!.moveTo(px - ((px - cx) / len) * streak, py - ((py - cy) / len) * streak);
          ctx!.lineTo(px, py);
          ctx!.stroke();
        } else {
          ctx!.beginPath();
          ctx!.fillStyle = color;
          ctx!.arc(px, py, star.size, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [warpRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    />
  );
}
