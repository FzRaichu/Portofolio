"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { ProjectDialog } from "@/components/project-dialog";
import { ScrollReveal } from "@/components/scroll-reveal";
import { projects, type Project } from "@/lib/data";
export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");
  const tags = [...new Set(projects.flatMap((project) => project.tags))];
  const filtered = projects.filter(
    (project) =>
      (tag === "All" || project.tags.includes(tag)) &&
      (project.title + " " + project.summary + " " + project.tags.join(" "))
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <section id="projects" data-chapter className="chapter projects-chapter">
      <div className="chapter-inner">
        <ScrollReveal className="projects-heading">
          <div>
            <p className="eyebrow">04 / SELECTED EXPLORATIONS</p>
            <h2 className="section-title">
              Ideas,
              <br />
              <span className="text-dim">taking shape.</span>
            </h2>
          </div>
          <p className="section-intro">
            A space for things I build and lessons along the way. These sample
            cards will make room for real project stories.
          </p>
        </ScrollReveal>
        <div className="project-toolbar">
          <div
            className="project-filters"
            aria-label="Filter projects by technology"
          >
            {["All", ...tags].map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={tag === item}
                onClick={() => setTag(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="project-search">
            <Search size={15} />
            <input
              aria-label="Search projects"
              placeholder="Find a project"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        <p role="status" className="section-note project-count">
          {filtered.length} project{filtered.length === 1 ? "" : "s"} · sample
          content
        </p>
        {filtered.length === 0 && (
          <div className="project-empty">
            <p>No matching projects.</p>
            <button
              type="button"
              className="text-link"
              onClick={() => {
                setTag("All");
                setQuery("");
              }}
            >
              Clear filters ↗
            </button>
          </div>
        )}
        <div className="work-grid">
          {filtered.map((project, index) => (
            <ScrollReveal key={project.slug} delay={index * 0.06}>
              <ProjectCard
                project={project}
                index={projects.indexOf(project)}
                onOpen={() => {
                  setSelected(project);
                  setOpen(true);
                }}
              />
            </ScrollReveal>
          ))}
        </div>
        <ProjectDialog project={selected} open={open} onOpenChange={setOpen} />
      </div>
    </section>
  );
}
