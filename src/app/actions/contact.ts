"use server";

import { Resend } from "resend";
import { addMessage } from "@/lib/messages";
import { getSiteContent } from "@/lib/kv";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in every field." };
  }
  if (name.length > 100 || email.length > 254 || message.length > 5000) {
    return { status: "error", message: "Please keep your name under 100 characters and your message under 5,000 characters." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const content = await getSiteContent();
  let stored = false;
  try {
    stored = Boolean(await addMessage({ name, email, message }));
  } catch (error) {
    console.error("[contact] Message storage failed", error);
  }

  const apiKey = process.env.RESEND_API_KEY;
  let emailed = false;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>",
        to: content.email,
        replyTo: email,
        subject: `New message from ${name}`,
        text: message,
      });
      emailed = !error;
    } catch {
      // Storage already succeeded (if configured) — an email hiccup isn't fatal.
    }
  }

  if (stored || emailed) {
    return {
      status: "success",
      message: "Thanks — I'll get back to you soon.",
    };
  }

  return {
    status: "error",
    message: `Your message couldn't be delivered. Please email me directly at ${content.email}.`,
  };
}
