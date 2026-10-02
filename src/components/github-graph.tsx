"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useEditMode } from "@/lib/edit-mode";
import { useHydrated } from "@/lib/browser-state";

export function GithubGraph() {
  const { resolvedTheme } = useTheme();
  const mounted = useHydrated();
  const { content } = useEditMode();
  const [failedUrl, setFailedUrl] = React.useState<string | null>(null);
  let username = "";
  try {
    const url = new URL(content.githubUrl);
    if (url.hostname === "github.com" || url.hostname === "www.github.com") username = url.pathname.split("/").filter(Boolean)[0] ?? "";
  } catch { /* No GitHub profile configured yet. */ }

  const color = mounted && resolvedTheme === "light" ? "216e39" : "39d353";
  const imageUrl = `https://ghchart.rshah.org/${color}/${encodeURIComponent(username)}`;
  if (!username) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-border/60 bg-card p-4">
      {failedUrl === imageUrl ? <p className="text-sm text-muted-foreground">The contribution graph is unavailable. <a href={content.githubUrl} target="_blank" rel="noreferrer" className="underline">View GitHub</a></p> :
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={imageUrl}
        alt={`${username}'s GitHub contribution graph`}
        loading="lazy"
        onError={() => setFailedUrl(imageUrl)}
        className="min-w-[600px]"
      />}
    </div>
  );
}
