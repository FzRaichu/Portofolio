"use client";

import { GraduationCap, MapPin } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEditMode } from "@/lib/edit-mode";

export function About() {
  const { content } = useEditMode();
  const initials = content.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <section
      id="about"
      className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-24"
    >
      <ScrollReveal>
        <p className="mb-2 font-mono text-sm text-muted-foreground">
          01 — about
        </p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Who I am
        </h2>
      </ScrollReveal>

      <div className="mt-12 grid gap-12 sm:grid-cols-[auto_1fr]">
        <ScrollReveal delay={0.1}>
          <Avatar className="size-28 border">
            <AvatarFallback className="font-mono text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
        </ScrollReveal>

        <ScrollReveal delay={0.15} className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {content.education && <Badge variant="secondary" className="gap-1.5">
              <GraduationCap className="size-3.5" />
              {content.education}
            </Badge>}
            <Badge variant="secondary" className="gap-1.5">
              <MapPin className="size-3.5" />
              {content.location}
            </Badge>
          </div>

          {content.bio.split(/\n\s*\n/).map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
