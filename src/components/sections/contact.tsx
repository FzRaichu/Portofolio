"use client";
import { useActionState } from "react";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { sendContactMessage, type ContactState } from "@/app/actions/contact";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useEditMode } from "@/lib/edit-mode";
import { useSectionNav } from "@/lib/section-nav";
const initialState: ContactState = { status: "idle", message: "" };
export function Contact() {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState,
  );
  const { content } = useEditMode();
  const { goToId } = useSectionNav();
  const socials = [
    ["GitHub", content.githubUrl],
    ["LinkedIn", content.linkedinUrl],
    ["Instagram", content.instagramUrl],
  ].filter(([, url]) => Boolean(url));
  return (
    <section id="contact" data-chapter className="chapter contact-chapter">
      <div className="chapter-inner">
        <div className="contact-grid">
          <ScrollReveal className="contact-copy">
            <p className="eyebrow">05 / MAKE CONTACT</p>
            <h2 className="section-title">
              Every good thing
              <br />
              starts with <span className="text-dim">hello.</span>
            </h2>
            <p className="section-intro">
              An idea, a question, or just a conversation.
              <br />
              I&apos;d like to hear from you.
            </p>
            <a className="contact-email" href={"mailto:" + content.email}>
              {content.email}
              <ArrowUpRight size={20} />
            </a>
            <div className="social-links">
              {socials.map(([label, url]) => (
                <a key={label} href={url} target="_blank" rel="noreferrer">
                  {label}
                  <ArrowUpRight size={13} />
                </a>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1} className="contact-form-panel">
            <p className="micro-label">LEAVE A MESSAGE</p>
            <form action={formAction} className="contact-form">
              <div className="contact-fields">
                <label>
                  Your name
                  <input
                    name="name"
                    autoComplete="name"
                    placeholder="How should I call you?"
                    maxLength={100}
                    required
                  />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    maxLength={254}
                    required
                  />
                </label>
              </div>
              <label>
                What&apos;s on your mind?
                <textarea
                  name="message"
                  placeholder="Tell me a little about it..."
                  rows={4}
                  maxLength={5000}
                  required
                />
              </label>
              <button
                type="submit"
                disabled={pending}
                className="action-primary"
              >
                {pending ? "Sending..." : "Send message"}
                <ArrowUpRight size={16} />
              </button>
              {state.message && (
                <p
                  role="status"
                  aria-live="polite"
                  className={
                    state.status === "success"
                      ? "form-success"
                      : "form-feedback"
                  }
                >
                  {state.message}
                </p>
              )}
            </form>
          </ScrollReveal>
        </div>
        <footer className="portfolio-footer">
          <p>
            © {new Date().getFullYear()} {content.name}
          </p>
          <span>Made with curiosity. Built for the web.</span>
          <button type="button" onClick={() => goToId("home")}>
            Back to the stars <ArrowUp size={13} />
          </button>
        </footer>
      </div>
    </section>
  );
}
