"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight, Mail, MapPin } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { EditableLinks } from "@/components/editable-links";
import { EditableText } from "@/components/editable-text";
import { useEditMode } from "@/lib/edit-mode";
import { useSectionNav } from "@/lib/section-nav";
import { useVisitor } from "@/lib/visitor";
import { usePrefersReducedMotion } from "@/lib/browser-state";

export function Hero() {
  const { goToId } = useSectionNav();
  const { content } = useEditMode();
  const { visitorName } = useVisitor();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="home"
      className="relative flex min-h-full items-center justify-center px-6 py-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,var(--primary)_-400%,transparent_65%)]" />
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <p className="mb-4 font-mono text-sm text-muted-foreground">
          {visitorName ? `hello, ${visitorName}, I'm` : "hello world, I'm"}
        </p>
        <EditableText
          field="name"
          as="h1"
          className="text-balance text-5xl font-bold tracking-tight sm:text-7xl"
        />
        <EditableText
          field="role"
          as="p"
          className="mt-4 text-lg text-muted-foreground"
        />
        <EditableText field="tagline" as="p" className="mx-auto mt-6 max-w-lg text-balance text-muted-foreground" />
        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1.5 font-mono text-xs text-muted-foreground"><MapPin className="size-3" />{content.location}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={() => goToId("projects")}>Explore my work <ArrowUpRight className="size-4" /></Button>
          {content.githubUrl && <Button
            variant="outline"
            nativeButton={false}
            render={
              <a href={content.githubUrl} target="_blank" rel="noreferrer">
                <GithubIcon className="size-4" />
                GitHub
              </a>
            }
          />}
          <Button
            variant="ghost"
            nativeButton={false}
            render={
              <a href={`mailto:${content.email}`}>
                <Mail className="size-4" />
                Say hi
              </a>
            }
          />
        </div>

        <EditableLinks />
        {content.resumeUrl && <a href={content.resumeUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground underline underline-offset-4">View resume <ArrowUpRight className="size-3" /></a>}
      </motion.div>

      <motion.button
        type="button"
        onClick={() => goToId("about")}
        aria-label="Go to about section"
        className="absolute bottom-8 z-10 text-muted-foreground"
        animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="size-5" />
      </motion.button>
    </section>
  );
}
