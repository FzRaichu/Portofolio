import Image from "next/image";
import type { Project } from "@/lib/data";

export function ProjectThumbnail({ project }: { project: Project }) {
  return (
    <div className="project-thumbnail">
      {project.thumbnail ? (
        <Image
          src={project.thumbnail.src}
          alt={project.thumbnail.alt}
          width={1200}
          height={750}
          sizes="(max-width: 767px) 85vw, (max-width: 1200px) 65vw, 760px"
          draggable={false}
        />
      ) : (
        <div
          className="project-thumbnail-fallback"
          aria-label={`${project.title} preview coming soon`}
        >
          <span aria-hidden="true">✳</span>
          <p>{project.title}</p>
          <small>Preview coming soon</small>
        </div>
      )}
    </div>
  );
}
