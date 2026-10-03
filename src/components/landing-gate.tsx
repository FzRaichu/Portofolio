"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useVisitor } from "@/lib/visitor";
import { AUTO_EDIT_KEY } from "@/lib/edit-mode";
import { writeSessionValue } from "@/lib/browser-state";

export const ACCESS_EVENT = "portfolio:open-access";
export function LandingGate() {
  const router = useRouter();
  const { setVisitorName } = useVisitor();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"name" | "code">("name");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const show = () => {
      setStep("name");
      setPassword("");
      setError("");
      setOpen(true);
    };
    window.addEventListener(ACCESS_EVENT, show);
    return () => window.removeEventListener(ACCESS_EVENT, show);
  }, []);
  const explore = () => {
    if (name.trim()) setVisitorName(name.trim());
    setOpen(false);
  };
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    if (step === "name") {
      if (name.trim().toLowerCase() === "ferciano") {
        setStep("code");
        setError("");
      } else explore();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Ferciano", password }),
      });
      if (!response.ok) {
        setError("That code didn't match. Please try again.");
        return;
      }
      writeSessionValue(AUTO_EDIT_KEY, "1");
      setPassword("");
      setOpen(false);
      router.refresh();
    } catch {
      setError("Couldn't connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setPassword("");
          setError("");
        }
      }}
    >
      <DialogContent className="access-dialog sm:max-w-md">
        <DialogHeader>
          <p className="eyebrow">A SMALL DOOR</p>
          <DialogTitle className="access-title">
            {step === "name" ? "This space is for you." : "Welcome back."}
          </DialogTitle>
          <DialogDescription>
            {step === "name"
              ? "Leave your name for a personal hello. Private greetings are coming soon."
              : "Enter your owner code to access the existing editing tools."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="access-form">
          {step === "name" ? (
            <label>
              Your name
              <input
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={60}
                placeholder="What should I call you?"
                autoComplete="given-name"
                required
              />
            </label>
          ) : (
            <label>
              Your code
              <input
                key="code"
                autoFocus
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
          )}
          {error && (
            <p role="alert" className="form-feedback">
              {error}
            </p>
          )}
          <button type="submit" className="action-primary" disabled={loading}>
            {loading ? "Checking..." : step === "name" ? "Continue" : "Enter"}
            <ArrowUpRight size={16} />
          </button>
        </form>
        <div className="access-footer">
          {step === "code" && (
            <button
              type="button"
              className="text-link"
              onClick={() => {
                setStep("name");
                setPassword("");
                setError("");
              }}
            >
              <ArrowLeft size={13} /> Back
            </button>
          )}
          <button type="button" className="text-link" onClick={explore}>
            Just explore ↗
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
