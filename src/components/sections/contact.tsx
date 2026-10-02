"use client";

import { useActionState } from "react";
import { Mail, Send } from "lucide-react";
import { sendContactMessage, type ContactState } from "@/app/actions/contact";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/icons";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEditMode } from "@/lib/edit-mode";

const initialState: ContactState = { status: "idle", message: "" };

export function Contact() {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState
  );
  const { content } = useEditMode();

  return (
    <section
      id="contact"
      className="mx-auto flex min-h-full max-w-2xl flex-col justify-center px-6 py-24"
    >
      <ScrollReveal>
        <p className="mb-2 font-mono text-sm text-muted-foreground">
          05 — say hi
        </p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Let&apos;s talk
        </h2>
        <p className="mt-3 text-muted-foreground">
          Have a project in mind, a question, or something interesting to share?
          I&apos;d like to hear from you.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <form action={formAction} className="mt-10 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">Name<Input name="name" autoComplete="name" placeholder="Your name" maxLength={100} required /></label>
            <label className="grid gap-2 text-sm">Email<Input name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required /></label>
          </div>
          <label className="grid gap-2 text-sm">Message<Textarea
            name="message"
            placeholder="What's up?"
            rows={5}
            maxLength={5000}
            required
          /></label>
          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={pending}>
              <Send className="size-4" />
              {pending ? "Sending..." : "Send message"}
            </Button>
            {state.message && (
              <p
                role="status"
                aria-live="polite"
                className={
                  state.status === "success"
                    ? "text-sm text-green-600 dark:text-green-400"
                    : "text-sm text-muted-foreground"
                }
              >
                {state.message}
              </p>
            )}
          </div>
        </form>
      </ScrollReveal>

      <ScrollReveal delay={0.15} className="mt-6 text-sm text-muted-foreground">
        prefer email? reach me directly at{" "}
        <a href={`mailto:${content.email}`} className="underline underline-offset-4">
          {content.email}
        </a>
      </ScrollReveal>

      <ScrollReveal
        delay={0.2}
        className="mt-16 flex flex-col items-center gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row sm:justify-between"
      >
        <p className="font-mono">
          © {new Date().getFullYear()} {content.name} — built with Next.js
          &amp; way too much coffee.
        </p>
        <div className="flex items-center gap-4">
          {content.githubUrl && <a
            href={content.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" />
          </a>}
          {content.linkedinUrl && <a
            href={content.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="transition-colors hover:text-foreground"
          >
            <LinkedinIcon className="size-4" />
          </a>}
          {content.instagramUrl && <a
            href={content.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="transition-colors hover:text-foreground"
          >
            <InstagramIcon className="size-4" />
          </a>}
          <a
            href={`mailto:${content.email}`}
            aria-label="Email"
            className="transition-colors hover:text-foreground"
          >
            <Mail className="size-4" />
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
