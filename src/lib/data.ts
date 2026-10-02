export const profile = {
  name: "Ferciano Wirawan",
  role: "Developer",
  tagline: "Building things. Learning along the way.",
  location: "Tangerang, Banten",
  school: "",
  major: "",
  year: "",
  bio: [
    "I'm Ferciano, a developer based in Tangerang, Banten. This is where I share the things I build and what I learn along the way.",
  ],
  email: "ferciano6@gmail.com",
  socials: {
    github: "",
    linkedin: "https://www.linkedin.com/in/ferciano-wirawan/",
    instagram: "https://www.instagram.com/fercianow/",
  },
  resumeUrl: "",
};

export const skills = [
  {
    category: "Languages",
    items: ["TypeScript", "Python", "Java", "C++", "SQL"],
  },
  {
    category: "Frameworks & Libraries",
    items: ["React", "Next.js", "Node.js", "TensorFlow", "Tailwind CSS"],
  },
  {
    category: "Tools & Platforms",
    items: ["Git", "Docker", "PostgreSQL", "AWS", "Linux"],
  },
];

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  problem: string;
  approach: string;
  learnings: string;
  tags: string[];
  github?: string;
  live?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    summary: "A short one-line hook describing what this project does.",
    description:
      "A longer description of the project — what it is, who it's for, and what makes it interesting.",
    problem:
      "Describe the problem you set out to solve and why it mattered.",
    approach:
      "Describe your technical approach, key decisions, and any interesting challenges you solved.",
    learnings:
      "What you learned building this — technically or otherwise.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    github: "https://github.com/yourusername/project-one",
    live: "https://project-one.example.com",
    featured: true,
  },
  {
    slug: "project-two",
    title: "Project Two",
    summary: "A short one-line hook describing what this project does.",
    description:
      "A longer description of the project — what it is, who it's for, and what makes it interesting.",
    problem:
      "Describe the problem you set out to solve and why it mattered.",
    approach:
      "Describe your technical approach, key decisions, and any interesting challenges you solved.",
    learnings:
      "What you learned building this — technically or otherwise.",
    tags: ["Python", "Machine Learning", "Flask"],
    github: "https://github.com/yourusername/project-two",
    featured: true,
  },
  {
    slug: "project-three",
    title: "Project Three",
    summary: "A short one-line hook describing what this project does.",
    description:
      "A longer description of the project — what it is, who it's for, and what makes it interesting.",
    problem:
      "Describe the problem you set out to solve and why it mattered.",
    approach:
      "Describe your technical approach, key decisions, and any interesting challenges you solved.",
    learnings:
      "What you learned building this — technically or otherwise.",
    tags: ["React", "Express", "MongoDB"],
    github: "https://github.com/yourusername/project-three",
  },
];

export const funFacts = [
  "You can find me on Instagram as @fercianow.",
  "This portfolio has a terminal. Type help and have a look around.",
];

export const nowPlaying = {
  song: "",
  artist: "",
};

export const githubUsername = "yourusername";
