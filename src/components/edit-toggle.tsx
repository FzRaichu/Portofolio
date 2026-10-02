"use client";

import * as React from "react";
import { Inbox, LogOut, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANDING_DISMISSED_KEY } from "@/components/landing-gate";
import { AUTO_EDIT_KEY, useEditMode } from "@/lib/edit-mode";
import type { ContactMessage } from "@/lib/messages";
import { useVisitor } from "@/lib/visitor";
import { writeSessionValue } from "@/lib/browser-state";

export function EditToggle() {
  const { isOwner, isEditing, setIsEditing, saving, saveError } =
    useEditMode();
  const { setVisitorName } = useVisitor();
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [logoutError, setLogoutError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOwner) return;
    fetch("/api/messages")
      .then((res) => (res.ok ? res.json() : []))
      .then((messages: ContactMessage[]) => {
        setUnreadCount(messages.filter((m) => !m.read).length);
      })
      .catch(() => {});
  }, [isOwner]);

  if (!isOwner) return null;

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError(null);
    try {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) throw new Error("Couldn't log out. Please try again.");
    // Drop the flags the landing gate reads, then do a full document
    // navigation. router.refresh() would clear the owner session but keep
    // client state, and the gate is already mounted with visible=false — only
    // a fresh load makes it show again.
    setVisitorName(null);
    writeSessionValue(AUTO_EDIT_KEY, null);
    writeSessionValue(LANDING_DISMISSED_KEY, null);
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- a hard reload is the point: it remounts the gate and resets the section scroller
    window.location.href = "/";
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "Couldn't reach the server.");
      setLoggingOut(false);
    }
  }

  return (
    <div className="fixed right-3 bottom-3 z-50 flex max-w-[calc(100vw-1.5rem)] flex-wrap justify-end gap-2 rounded-xl border border-border bg-background/90 p-2 shadow-lg backdrop-blur-md sm:right-6 sm:bottom-6">
      {logoutError && <span role="alert" className="text-xs text-destructive">{logoutError}</span>}
      {isEditing && saveError && (
        <span role="alert" className="max-w-64 rounded-full bg-destructive/10 px-3 py-1 text-xs text-destructive backdrop-blur-md">
          {saveError}
        </span>
      )}
      {isEditing && !saveError && (
        <span className="rounded-full bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur-md">
          {saving ? "Saving..." : "Editing"}
        </span>
      )}
      <Button
        variant="outline"
        size="icon"
        className="relative bg-background/80 backdrop-blur-md"
        aria-label="Inbox"
        nativeButton={false}
        render={<a href="/inbox" />}
      >
        <Inbox className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="bg-background/80 backdrop-blur-md"
        aria-label={isEditing ? "Exit edit mode" : "Edit this site"}
        onClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? <X className="size-4" /> : <Pencil className="size-4" />}
      </Button>
      <Button
        variant="outline"
        className="bg-background/80 backdrop-blur-md"
        title="Log out and return to the landing page"
        onClick={handleLogout}
        disabled={loggingOut}
      >
        <LogOut className="size-4" />
        {loggingOut ? "Exiting..." : "Exit to landing"}
      </Button>
    </div>
  );
}
