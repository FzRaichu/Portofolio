"use client";

import { usePrefersReducedMotion } from "@/lib/browser-state";
import { Canvas } from "@react-three/fiber";
import { ParticleField } from "@/components/three/particle-field";

export function StarfieldBackground() {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,_var(--color-muted)_0%,_transparent_60%)]"
      />
    );
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      className="!fixed inset-0 -z-10"
    >
      <ParticleField />
    </Canvas>
  );
}
