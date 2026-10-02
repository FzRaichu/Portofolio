"use client";

import dynamic from "next/dynamic";

const StarfieldBackground = dynamic(
  () =>
    import("@/components/three/starfield-background").then(
      (m) => m.StarfieldBackground
    ),
  { ssr: false }
);

export function StarfieldMount() {
  return <StarfieldBackground />;
}
