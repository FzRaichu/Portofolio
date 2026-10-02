"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Command, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSectionNav, type SectionId } from "@/lib/section-nav";
import { cn } from "@/lib/utils";
import { useEditMode } from "@/lib/edit-mode";
import { useHydrated } from "@/lib/browser-state";

const NAV_LINKS: { label: string; id: SectionId }[] = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Fun", id: "fun" },
  { label: "Contact", id: "contact" },
];

export function Nav() {
  const { activeId, goToId } = useSectionNav();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { content } = useEditMode();
  const hydrated = useHydrated();
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    if (pathname !== "/" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    goToId(id);
  };

  const isMac =
    hydrated && /Mac|iPhone/.test(navigator.platform);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        activeId !== "home"
          ? "border-b border-border/60 bg-background/80 backdrop-blur-md"
          : "border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/#home"
          onClick={(event) => navigate(event, "home")}
          aria-label={`${content.name}, home`}
          className="inline-flex items-center gap-3 font-mono text-sm font-semibold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs text-primary">FW</span>
          <span className="hidden sm:inline">{content.name.split(" ")[0]}<span className="text-primary">.</span></span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <Link
                href={`/#${link.id}`}
                onClick={(event) => navigate(event, link.id)}
                aria-current={pathname === "/" && activeId === link.id ? "location" : undefined}
                className={cn(
                  "transition-colors hover:text-foreground",
                  activeId === link.id
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden gap-2 text-xs text-muted-foreground sm:flex"
            onClick={() =>
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true })
              )
            }
          >
            <Command className="size-3.5" />
            {isMac ? "⌘K" : "Ctrl K"}
          </Button>
          <ThemeToggle />

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="font-mono">{content.name}</SheetTitle>
              </SheetHeader>
              <ul className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={`/#${link.id}`}
                      onClick={(event) => { navigate(event, link.id); setMenuOpen(false); }}
                      className="block w-full rounded-md px-2 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
