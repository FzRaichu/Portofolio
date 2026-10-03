"use client";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { EditableLinks } from "@/components/editable-links";
import { EditableText } from "@/components/editable-text";
import { useEditMode } from "@/lib/edit-mode";
import { useSectionNav } from "@/lib/section-nav";
import { useVisitor } from "@/lib/visitor";

export function Hero() {
  const { goToId } = useSectionNav();
  const { content } = useEditMode();
  const { visitorName } = useVisitor();
  return (
    <section id="home" data-chapter className="chapter hero-chapter">
      <div className="chapter-inner hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-cross" /> A PERSONAL CORNER OF THE INTERNET
          </p>
          <p className="hero-greeting">
            {visitorName ? "Welcome, " + visitorName + ". I'm" : "Hello, I'm"}
          </p>
          <EditableText field="name" as="h1" className="hero-name" />
          <div className="hero-role">
            <span className="status-dot" />
            <EditableText field="role" />
          </div>
          <EditableText field="tagline" as="p" className="hero-tagline" />
          <div className="hero-actions">
            <button
              type="button"
              className="action-primary"
              onClick={() => goToId("projects")}
            >
              Explore my work <ArrowUpRight size={17} />
            </button>
            <button
              type="button"
              className="action-text"
              onClick={() => goToId("contact")}
            >
              Let&apos;s talk <span>↗</span>
            </button>
          </div>
          <EditableLinks />
          {content.resumeUrl && (
            <a
              className="text-link"
              href={content.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              View resume ↗
            </a>
          )}
        </div>
        <div className="hero-art-caption" aria-hidden="true">
          <span className="caption-line" />
          <span>
            FORM / 001
            <br />
            <b>An idea in motion.</b>
          </span>
        </div>
        <div className="hero-bottom">
          <div>
            <span className="micro-label">BASED IN</span>
            <p>{content.location}</p>
          </div>
          <button
            type="button"
            className="scroll-invitation"
            onClick={() => goToId("about")}
          >
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
