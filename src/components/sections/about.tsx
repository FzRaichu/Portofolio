"use client";
import { ArrowUpRight, TerminalSquare } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Terminal } from "@/components/terminal";
import { GithubGraph } from "@/components/github-graph";
import { useEditMode } from "@/lib/edit-mode";
import { funFacts, nowPlaying } from "@/lib/data";

export function About() {
  const { content } = useEditMode();
  return (
    <section id="about" data-chapter className="chapter about-chapter">
      <div className="chapter-inner about-grid">
        <div className="chapter-aside" aria-hidden="true">
          <span className="micro-label">01 — THE PERSON</span>
          <span className="aside-caption">
            Always a work
            <br />
            in progress.
          </span>
        </div>
        <div className="about-copy">
          <ScrollReveal>
            <p className="eyebrow">02 / ABOUT</p>
            <h2 className="section-title">
              Curiosity,
              <br />
              <span className="text-dim">in progress.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <div className="about-bio">
              {content.bio.split(/\n\s*\n/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="identity-lines">
              <div>
                <span>LOCATION</span>
                <p>{content.location}</p>
              </div>
              <div>
                <span>FOCUS</span>
                <p>{content.role}</p>
              </div>
              {content.education && (
                <div>
                  <span>EDUCATION</span>
                  <p>{content.education}</p>
                </div>
              )}
            </div>
            {content.linkedinUrl && (
              <a
                href={content.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                A little more about me <ArrowUpRight size={15} />
              </a>
            )}
            <details data-terminal className="terminal-disclosure" id="fun">
              <summary>
                <TerminalSquare size={16} />
                <span>For the curious</span>
                <span className="disclosure-plus">+</span>
              </summary>
              <div className="terminal-content">
                <p className="section-note">
                  A little terminal to explore. Try <code>help</code>.
                </p>
                <Terminal />
                <div className="fun-facts">
                  {funFacts.map((fact) => (
                    <p key={fact}>{fact}</p>
                  ))}
                  {nowPlaying.song && (
                    <p>
                      On repeat: {nowPlaying.song} — {nowPlaying.artist}
                    </p>
                  )}
                </div>
                <GithubGraph />
              </div>
            </details>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
