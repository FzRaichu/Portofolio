"use client";
import { Component, useCallback, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import {
  useMotionSetting,
  usePageVisible,
  useSmallScreen,
} from "@/lib/browser-state";
import { useSectionNav } from "@/lib/section-nav";
import { SpaceScene } from "./space-scene";

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function StarfieldBackground() {
  const { progress } = useSectionNav();
  const { paused } = useMotionSetting();
  const small = useSmallScreen();
  const visible = usePageVisible();
  const { resolvedTheme } = useTheme();
  const [failed, setFailed] = useState(false);
  const [lowQuality, setLowQuality] = useState(false);
  const onContextLost = useCallback(() => setFailed(true), []);
  const onDegrade = useCallback(() => setLowQuality(true), []);
  if (paused || failed) return null;
  return (
    <SceneBoundary>
      <div
        className="space-canvas"
        data-scene-quality={small || lowQuality ? "low" : "high"}
        style={{ opacity: resolvedTheme === "light" ? 0.42 : 1 }}
      >
        <Canvas
          dpr={small || lowQuality ? 1 : [1, 1.5]}
          camera={{ position: [0, 0, 8.4], fov: 45, near: 0.1, far: 100 }}
          gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
          frameloop={visible ? "always" : "never"}
          fallback={null}
        >
          <SpaceScene
            progress={progress}
            compact={small}
            onContextLost={onContextLost}
            onDegrade={onDegrade}
          />
        </Canvas>
      </div>
    </SceneBoundary>
  );
}
