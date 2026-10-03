"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Command, ArrowUpRight } from "lucide-react";
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
import { useEditMode } from "@/lib/edit-mode";
import { ACCESS_EVENT } from "@/components/landing-gate";

const LINKS: { label: string; id: SectionId }[] = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];
export function Nav() {
  const { activeId, goToId } = useSectionNav();
  const [menuOpen, setMenuOpen] = useState(false);
  const afterMenu = useRef<SectionId | "access" | null>(null);
  const handoffFrame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(handoffFrame.current), []);
  const pathname = usePathname();
  const { content } = useEditMode();
  const navigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: SectionId,
  ) => {
    if (
      pathname !== "/" ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    if (menuOpen) {
      afterMenu.current = id;
      setMenuOpen(false);
    } else goToId(id);
  };
  const access = () => {
    if (menuOpen) {
      afterMenu.current = "access";
      setMenuOpen(false);
    } else window.dispatchEvent(new Event(ACCESS_EVENT));
  };
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link
          href="/#home"
          onClick={(event) => navigate(event, "home")}
          aria-label={content.name + ", home"}
          className="wordmark"
        >
          <span className="brand-symbol" aria-hidden="true">
            ✳
          </span>
          {content.name.split(" ")[0].toLowerCase()}
          <span className="brand-period">.</span>
        </Link>
        <ul className="desktop-nav">
          {LINKS.map((link) => (
            <li key={link.id}>
              <Link
                href={"/#" + link.id}
                onClick={(event) => navigate(event, link.id)}
                aria-current={
                  pathname === "/" && activeId === link.id
                    ? "location"
                    : undefined
                }
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-tools">
          <button type="button" className="private-entry" onClick={access}>
            For you <ArrowUpRight size={12} />
          </button>
          <button
            type="button"
            className="command-trigger"
            aria-label="Open command menu"
            onClick={() =>
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true }),
              )
            }
          >
            <Command size={15} />
          </button>
          <ThemeToggle />
          <Sheet
            open={menuOpen}
            onOpenChange={setMenuOpen}
            onOpenChangeComplete={(open) => {
              if (open) return;
              // Wait for the sheet's scroll lock and focus trap to release.
              const destination = afterMenu.current;
              if (!destination) return;
              handoffFrame.current = requestAnimationFrame(() => {
                afterMenu.current = null;
                if (destination === "access")
                  window.dispatchEvent(new Event(ACCESS_EVENT));
                else goToId(destination);
              });
            }}
          >
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
              <Menu size={18} />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="mobile-nav-sheet"
              finalFocus={() => !afterMenu.current}
            >
              <SheetHeader>
                <SheetTitle>{content.name}</SheetTitle>
              </SheetHeader>
              <ul className="mobile-nav">
                {LINKS.map((link, index) => (
                  <li key={link.id}>
                    <Link
                      href={"/#" + link.id}
                      onClick={(event) => {
                        navigate(event, link.id);
                        setMenuOpen(false);
                      }}
                    >
                      <span>0{index + 2}</span>
                      {link.label}
                      <ArrowUpRight size={17} />
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mobile-private-entry"
                onClick={access}
              >
                For you <ArrowUpRight size={15} />
              </button>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
