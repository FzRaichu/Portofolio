import type { ReactNode } from "react";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Fun } from "@/components/sections/fun";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { SectionScroller } from "@/components/section-scroller";
import type { SectionId } from "@/lib/section-nav";

const SECTIONS: { id: SectionId; node: ReactNode }[] = [
  { id: "home", node: <Hero /> },
  { id: "about", node: <About /> },
  { id: "skills", node: <Skills /> },
  { id: "projects", node: <Projects /> },
  { id: "fun", node: <Fun /> },
  { id: "contact", node: <Contact /> },
];

export default function Home() {
  return <SectionScroller sections={SECTIONS} />;
}
