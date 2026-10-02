"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Mail, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContactMessage } from "@/lib/messages";

function sortMessages(list: ContactMessage[]) {
  return [...list].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function InboxView({
  initialMessages,
}: {
  initialMessages: ContactMessage[];
}) {
  const router = useRouter();
  const [messages, setMessages] = React.useState(initialMessages);
  const [error, setError] = React.useState<string | null>(null);
  const [pendingIds, setPendingIds] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const unread = initialMessages.filter((m) => !m.read);
    if (unread.length === 0) return;
    let cancelled = false;
    for (const m of unread) {
      fetch(`/api/messages/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      }).then((response) => {
        if (!response.ok) throw new Error("Couldn't mark messages as read.");
        if (!cancelled) setMessages((prev) => prev.map((entry) => entry.id === m.id ? { ...entry, read: true } : entry));
      }).catch(() => { if (!cancelled) setError("Couldn't mark messages as read. Refresh to try again."); });
    }
    return () => { cancelled = true; };
  }, [initialMessages]);

  async function togglePriority(id: string, priority: boolean) {
    setPendingIds((prev) => [...prev, id]);
    setError(null);
    try {
    const response = await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority }),
    });
    if (!response.ok) throw new Error("Couldn't update priority. Please try again.");
    setMessages((prev) => sortMessages(prev.map((m) => m.id === id ? { ...m, priority } : m)));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Couldn't reach the server.");
    } finally { setPendingIds((prev) => prev.filter((pending) => pending !== id)); }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this message? This can't be undone.")) return;
    setPendingIds((prev) => [...prev, id]);
    setError(null);
    try {
      const response = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Couldn't delete the message. Please try again.");
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Couldn't reach the server.");
    } finally { setPendingIds((prev) => prev.filter((pending) => pending !== id)); }
  }

  const unreadCount = messages.filter((m) => !m.read).length;
  const filteredMessages = messages.filter((m) => `${m.name} ${m.email} ${m.message}`.toLowerCase().includes(query.toLowerCase().trim()));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-mono text-sm text-muted-foreground">inbox</p>
          <h1 className="text-2xl font-bold tracking-tight">
            {messages.length} message{messages.length === 1 ? "" : "s"}
            {unreadCount > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({unreadCount} new)
              </span>
            )}
          </h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/")}>
          Back to site
        </Button>
      </div>

      {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
      <Input aria-label="Search messages" placeholder="Search your inbox..." value={query} onChange={(event) => setQuery(event.target.value)} className="mb-6" />
      {filteredMessages.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {messages.length === 0 ? "Nothing yet — messages sent through the contact form will show up here." : "No matching messages."}
        </p>
      ) : (
        <ul className="space-y-3">
          {filteredMessages.map((m) => (
            <li
              key={m.id}
              className={`rounded-lg border p-4 ${
                m.priority
                  ? "border-primary/50 bg-primary/5"
                  : "border-border"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!m.read && (
                      <span
                        className="size-2 shrink-0 rounded-full bg-primary"
                        aria-label="Unread"
                      />
                    )}
                    <p className="truncate font-medium">{m.name}</p>
                  </div>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    {m.email}
                  </a>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <span className="mr-2 text-xs whitespace-nowrap text-muted-foreground">
                    <time dateTime={m.createdAt}>{m.createdAt.slice(0, 10)}</time>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={
                      m.priority ? "Unmark priority" : "Mark as priority"
                    }
                    onClick={() => togglePriority(m.id, !m.priority)}
                    disabled={pendingIds.includes(m.id)}
                  >
                    <Star
                      className={`size-4 ${m.priority ? "fill-primary text-primary" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete message"
                    onClick={() => handleDelete(m.id)}
                    disabled={pendingIds.includes(m.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    nativeButton={false}
                    aria-label="Reply by email"
                    render={<a href={`mailto:${m.email}`} />}
                  >
                    <Mail className="size-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-sm wrap-anywhere whitespace-pre-wrap">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
