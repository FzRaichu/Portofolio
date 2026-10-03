"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
const StarfieldBackground = dynamic(
  () => import("./starfield-background").then((m) => m.StarfieldBackground),
  { ssr: false },
);
export function StarfieldMount() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return (
    <div className="space-backdrop" aria-hidden="true">
      <div className="space-static">
        <div className="static-signal" />
        <div className="static-stars" />
      </div>
      <StarfieldBackground />
      <div className="space-vignette" />
    </div>
  );
}
