"use client";

import type { RefObject } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, X } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { ProjectThumbnail } from "@/components/project-thumbnail";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Project } from "@/lib/data";

export function ProjectDialog({
  project,
  open,
  onOpenChange,
  index,
  total,
  onNavigate,
  finalFocus,
}: {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  index: number;
  total: number;
  onNavigate: (index: number) => void;
  finalFocus: RefObject<HTMLButtonElement | null>;
}) {
  const sample = project.slug.startsWith("project-");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="project-detail"
        showCloseButton={false}
        finalFocus={finalFocus}
        onKeyDown={(event) => {
          // Portal events still bubble to the carousel; keep its selection independent.
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
            event.stopPropagation();
          if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            onNavigate(index - 1);
          }
          if (event.key === "ArrowRight" && index < total - 1) {
            event.preventDefault();
            onNavigate(index + 1);
          }
        }}
      >
        <div className="project-detail-bar">
          <span className="micro-label">
            PROJECT / {String(index + 1).padStart(2, "0")}{" "}
            <span className="text-dim">
              OF {String(total).padStart(2, "0")}
            </span>
          </span>
          <div className="project-detail-actions">
            <button
              type="button"
              className="gallery-arrow"
              aria-label="Previous project details"
              disabled={index === 0}
              onClick={() => onNavigate(index - 1)}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              className="gallery-arrow"
              aria-label="Next project details"
              disabled={index === total - 1}
              onClick={() => onNavigate(index + 1)}
            >
              <ArrowRight size={18} />
            </button>
            <DialogClose
              className="gallery-arrow project-detail-close"
              aria-label="Close project details"
            >
              <X size={20} />
            </DialogClose>
          </div>
        </div>
        <div className="project-detail-scroll" key={project.slug}>
          <div className="project-detail-preview">
            <ProjectThumbnail project={project} />
            <p className="micro-label">
              {sample
                ? "ILLUSTRATIVE PREVIEW / SAMPLE CONTENT"
                : "PROJECT PREVIEW"}
            </p>
          </div>
          <div className="project-detail-copy">
            <p className="eyebrow">
              {sample ? "SAMPLE PROJECT" : "BEHIND THE PROJECT"}
            </p>
            <DialogTitle className="project-detail-title">
              {project.title}
            </DialogTitle>
            <DialogDescription className="project-detail-description">
              {project.description}
            </DialogDescription>
            <div className="work-tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="project-story">
              <div>
                <h3>The problem</h3>
                <p>{project.problem}</p>
              </div>
              <div>
                <h3>My approach</h3>
                <p>{project.approach}</p>
              </div>
              <div>
                <h3>What I learned</h3>
                <p>{project.learnings}</p>
              </div>
            </div>
            {!sample && (project.github || project.live) && (
              <div className="project-detail-links">
                {project.github && (
                  <a
                    className="action-text"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GithubIcon className="size-4" /> Source
                  </a>
                )}
                {project.live && (
                  <a
                    className="action-primary"
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Live demo <ExternalLink size={16} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
