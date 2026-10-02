import { Music, Sparkles } from "lucide-react";
import { GithubGraph } from "@/components/github-graph";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Terminal } from "@/components/terminal";
import { Card, CardContent } from "@/components/ui/card";
import { funFacts, nowPlaying } from "@/lib/data";

export function Fun() {
  return (
    <section
      id="fun"
      className="flex min-h-full flex-col justify-center border-t border-border/60 bg-muted/20"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-24">
        <ScrollReveal>
          <p className="mb-2 font-mono text-sm text-muted-foreground">
            04 — off the clock
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Beyond the projects
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ScrollReveal className="min-w-0 space-y-6">
            <Card>
              <CardContent className="space-y-3 pt-6">
                {funFacts.map((fact, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <p>{fact}</p>
                  </div>
                ))}
                {nowPlaying.song && <div className="flex items-center gap-2 border-t border-border/60 pt-3 text-sm text-muted-foreground">
                  <Music className="size-4 shrink-0" />
                  <span>
                    on repeat: {nowPlaying.song} — {nowPlaying.artist}
                  </span>
                </div>}
              </CardContent>
            </Card>

            <GithubGraph />
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="min-w-0">
            <p className="mb-3 text-sm text-muted-foreground">
              or poke around this terminal — it doesn&apos;t bite.
            </p>
            <Terminal />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
