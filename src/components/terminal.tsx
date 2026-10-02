"use client";

import * as React from "react";
import { projects, skills } from "@/lib/data";
import { useEditMode } from "@/lib/edit-mode";
import type { SiteContent } from "@/lib/site-content";

type Line = { type: "input" | "output"; text: string };

const HELP = [
  "available commands:",
  "  help        show this list",
  "  about       who am I",
  "  skills      what I work with",
  "  projects    what I've built",
  "  contact     how to reach me",
  "  sudo        try it",
  "  clear       clear the terminal",
];

function runCommand(raw: string, content: SiteContent): string[] {
  const cmd = raw.trim().toLowerCase();

  if (cmd === "" ) return [];
  if (cmd === "help") return HELP;
  if (cmd === "about")
    return [`${content.name} — ${content.role}`, content.tagline];
  if (cmd === "skills")
    return skills.map((g) => `${g.category}: ${g.items.join(", ")}`);
  if (cmd === "projects")
    return projects.map((p) => `${p.title} — ${p.summary}`);
  if (cmd === "contact") return [`email: ${content.email}`];
  if (cmd.startsWith("sudo"))
    return ["nice try. permission denied (you're not root here either)."];
  if (cmd === "whoami") return ["a curious CS student, apparently"];
  return [`command not found: ${cmd} — type "help" to see what works`];
}

export function Terminal() {
  const { content } = useEditMode();
  const [history, setHistory] = React.useState<Line[]>([
    { type: "output", text: `Welcome. Type "help" to get started.` },
  ]);
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = input;
    setInput("");

    if (value.trim().toLowerCase() === "clear") {
      setHistory([]);
      return;
    }

    const output = runCommand(value, content);
    setHistory((prev) => [
      ...prev,
      { type: "input", text: value },
      ...output.map((text): Line => ({ type: "output", text })),
    ]);
  }

  return (
    <div
      className="rounded-lg border border-border/60 bg-black font-mono text-sm text-green-400 shadow-inner"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="size-2.5 rounded-full bg-red-500/70" />
        <span className="size-2.5 rounded-full bg-yellow-500/70" />
        <span className="size-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-white/40">guest@portfolio:~</span>
      </div>

      <div ref={scrollRef} className="h-64 space-y-1 overflow-y-auto p-4 wrap-anywhere">
        {history.map((line, i) => (
          <div key={i}>
            {line.type === "input" ? (
              <p>
                <span className="text-green-500">guest@portfolio</span>
                <span className="text-white/50">:~$ </span>
                {line.text}
              </p>
            ) : (
              <p className="text-white/70">{line.text}</p>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex min-w-0 items-center border-t border-white/10 px-4 py-2 text-xs sm:text-sm">
        <span className="text-green-500">guest@portfolio</span>
        <span className="text-white/50">:~$&nbsp;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-green-400 outline-none"
          autoComplete="off"
          spellCheck={false}
          aria-label="Terminal input"
        />
      </form>
    </div>
  );
}
