"use client";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import type { Project } from "@/lib/data";

export function ProjectCard({
  project,
  index = 0,
  onOpen,
}: {
  project: Project;
  index?: number;
  onOpen: () => void;
}) {
  const sample = project.slug.startsWith("project-");
  return (
    <article className="work-card">
      <button
        type="button"
        className="work-card-main"
        onClick={onOpen}
        aria-label={"Read about " + project.title}
      >
        <div className={"work-art work-art-" + (index % 3)} aria-hidden="true">
          <div className="work-art-grid" />
          <svg viewBox="0 0 320 180" fill="none">
            <path
              d={
                index % 3 === 0
                  ? "M45 100 115 30 195 135 270 60M45 100 195 135 170 45 270 60M115 30 170 45"
                  : index % 3 === 1
                    ? "M85 40 220 55 250 125 110 145 85 40 180 95 220 55M110 145 180 95 250 125"
                    : "M40 105Q100 10 160 90T280 80M40 85Q100 150 160 70T280 100M65 120 160 45 255 125"
              }
            />
            <circle
              cx={index % 3 === 1 ? 180 : 160}
              cy={index % 3 === 1 ? 95 : 90}
              r="4"
            />
          </svg>
          <span className="work-art-number">0{index + 1}</span>
          <span className="work-art-type">
            {sample ? "SAMPLE STUDY" : "SELECTED WORK"}
          </span>
          <span className="work-open">
            <ArrowUpRight size={19} />
          </span>
        </div>
        <div className="work-card-copy">
          <div className="work-card-heading">
            <h3>{project.title}</h3>
            <span>↗</span>
          </div>
          <p>{project.summary}</p>
          <div className="work-tags">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </button>
      {!sample && (project.github || project.live) && (
        <div className="work-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer">
              <GithubIcon className="size-3.5" /> Source
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer">
              Live demo <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      )}
    </article>
  );
}
