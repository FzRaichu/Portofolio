import { profile } from "@/lib/data";

export type SiteContent = {
  name: string;
  role: string;
  email: string;
  githubUrl: string;
  tagline: string;
  bio: string;
  location: string;
  education: string;
  linkedinUrl: string;
  instagramUrl: string;
  resumeUrl: string;
};

export const EDITABLE_FIELDS: (keyof SiteContent)[] = [
  "name",
  "role",
  "email",
  "githubUrl",
  "tagline",
  "bio",
  "location",
  "education",
  "linkedinUrl",
  "instagramUrl",
  "resumeUrl",
];

export const defaultSiteContent: SiteContent = {
  name: profile.name,
  role: profile.role,
  email: profile.email,
  githubUrl: profile.socials.github,
  tagline: profile.tagline,
  bio: profile.bio.join("\n\n"),
  location: profile.location,
  education: "",
  linkedinUrl: profile.socials.linkedin,
  instagramUrl: profile.socials.instagram,
  resumeUrl: profile.resumeUrl,
};

export const OPTIONAL_FIELDS: (keyof SiteContent)[] = [
  "education", "githubUrl", "linkedinUrl", "instagramUrl", "resumeUrl",
];

export function validateContentField(field: keyof SiteContent, value: string): string | null {
  if (!value) return OPTIONAL_FIELDS.includes(field) ? null : `${field} cannot be empty.`;
  const limit = field === "bio" ? 6000 : 500;
  if (value.length > limit) return `${field} must be ${limit} characters or fewer.`;
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter a valid email address.";
  }
  if (field.endsWith("Url")) {
    if (field === "resumeUrl" && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return null;
    try {
      const url = new URL(value);
      if (!["https:", "http:"].includes(url.protocol)) return "Links must use https:// or http://.";
    } catch {
      return "Enter a complete URL, starting with https://.";
    }
  }
  return null;
}
