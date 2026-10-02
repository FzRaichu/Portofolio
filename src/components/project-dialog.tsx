"use client";

import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Project } from "@/lib/data";

export function ProjectDialog({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-mono">{project.title}</DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="mb-1 font-semibold">The problem</h3>
            <p className="text-muted-foreground">{project.problem}</p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold">My approach</h3>
            <p className="text-muted-foreground">{project.approach}</p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold">What I learned</h3>
            <p className="text-muted-foreground">{project.learnings}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {project.github && (
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={
                <a href={project.github} target="_blank" rel="noreferrer">
                  <GithubIcon className="size-4" />
                  Source
                </a>
              }
            />
          )}
          {project.live && (
            <Button
              size="sm"
              nativeButton={false}
              render={
                <a href={project.live} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-4" />
                  Live demo
                </a>
              }
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
