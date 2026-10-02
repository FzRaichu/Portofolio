import { ScrollReveal } from "@/components/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { skills } from "@/lib/data";

export function Skills() {
  return (
    <section
      id="skills"
      className="flex min-h-full flex-col justify-center border-t border-border/60 bg-muted/20"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-24">
        <ScrollReveal>
          <p className="mb-2 font-mono text-sm text-muted-foreground">
            02 — skills
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What I work with
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {skills.map((group, i) => (
            <ScrollReveal key={group.category} delay={i * 0.1}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="font-mono text-base">
                    {group.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
