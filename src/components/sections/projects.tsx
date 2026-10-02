"use client";

import * as React from "react";
import { CardSpinReveal } from "@/components/card-spin-reveal";
import { ProjectCard } from "@/components/project-card";
import { ProjectDialog } from "@/components/project-dialog";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { projects, type Project } from "@/lib/data";

export function Projects() {
  const [selected, setSelected] = React.useState<Project | null>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [tag, setTag] = React.useState("All");
  const tags = [...new Set(projects.flatMap((project) => project.tags))];
  const filteredProjects = projects.filter((project) =>
    (tag === "All" || project.tags.includes(tag)) &&
    `${project.title} ${project.summary} ${project.tags.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section
      id="projects"
      className="mx-auto flex min-h-full max-w-5xl flex-col justify-center overflow-x-hidden px-6 py-24"
    >
      <ScrollReveal>
        <p className="mb-2 font-mono text-sm text-muted-foreground">
          03 — projects
        </p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Things I&apos;ve built
        </h2>
        <p className="mt-3 max-w-lg text-muted-foreground">
          Click a card for the full story — the problem, my approach, and
          what I learned.
        </p>
      </ScrollReveal>

      <div className="mt-8 space-y-4">
        <Input aria-label="Search projects" placeholder="Search projects or technologies..." value={query} onChange={(event) => setQuery(event.target.value)} className="max-w-md bg-card/60" />
        <div className="flex flex-wrap gap-2" aria-label="Filter projects by technology">
          {["All", ...tags].map((item) => <Button key={item} variant={tag === item ? "default" : "outline"} size="sm" aria-pressed={tag === item} onClick={() => setTag(item)}>{item}</Button>)}
        </div>
        <p role="status" className="text-xs text-muted-foreground">{filteredProjects.length} project{filteredProjects.length === 1 ? "" : "s"}</p>
      </div>
      {filteredProjects.length === 0 && <p className="mt-6 text-sm text-muted-foreground">No matching projects. Try another search or technology.</p>}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {filteredProjects.map((project, i) => (
          <CardSpinReveal key={project.slug} delay={i * 0.12}>
            <ProjectCard
              project={project}
              onOpen={() => {
                setSelected(project);
                setOpen(true);
              }}
            />
          </CardSpinReveal>
        ))}
      </div>

      <ProjectDialog project={selected} open={open} onOpenChange={setOpen} />
    </section>
  );
}
