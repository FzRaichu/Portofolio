"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { ProjectGallery } from "@/components/project-gallery";
import { ScrollReveal } from "@/components/scroll-reveal";
import { projects } from "@/lib/data";
export function Projects() {
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
              Ideas,{" "}
              <span className="text-dim">taking shape.</span>
            </h2>
          </div>
          <p className="section-intro">
            A closer look at the things I build. Explore the gallery, then open
            a project for the story behind it.
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
        {filtered.length > 0 && (
          <ProjectGallery
            key={filtered.map((project) => project.slug).join(",")}
            projects={filtered}
          />
        )}
      </div>
    </section>
  );
}
