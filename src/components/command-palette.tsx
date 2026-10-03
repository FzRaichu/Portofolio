"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Code2, FolderGit2, Home, Mail, User } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSectionNav, type SectionId } from "@/lib/section-nav";
import { useEditMode } from "@/lib/edit-mode";

const NAV_ITEMS: { label: string; id: SectionId; icon: typeof Home }[] = [
  { label: "Home", id: "home", icon: Home },
  { label: "About", id: "about", icon: User },
  { label: "Skills", id: "skills", icon: Code2 },
  { label: "Projects", id: "projects", icon: FolderGit2 },
  { label: "Contact", id: "contact", icon: Mail },
];

export function CommandPalette() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { goToId } = useSectionNav();
  const { content } = useEditMode();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (id: SectionId) => {
    setOpen(false);
    if (pathname === "/") goToId(id);
    else router.push(`/#${id}`);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command menu"
      description="Jump to a section or open a link"
    >
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {NAV_ITEMS.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => go(item.id)}
                value={item.label}
              >
                <item.icon />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Links">
            {content.githubUrl && (
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  window.open(
                    content.githubUrl,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
                value="GitHub"
              >
                <GithubIcon />
                Open GitHub
              </CommandItem>
            )}
            {content.resumeUrl && (
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  window.open(
                    content.resumeUrl,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
                value="Resume"
              >
                <FolderGit2 />
                View resume
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
