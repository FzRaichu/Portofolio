"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      style={{ "--reveal-order": 1 + delay * 5 } as React.CSSProperties}
      className={cn("scroll-reveal", className)}
    >
      {children}
    </div>
  );
}
