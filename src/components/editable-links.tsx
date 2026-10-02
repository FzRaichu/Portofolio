"use client";

import * as React from "react";
import { useEditMode } from "@/lib/edit-mode";
import type { SiteContent } from "@/lib/site-content";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FIELDS: { field: keyof SiteContent; label: string; multiline?: boolean }[] = [
  { field: "tagline", label: "Tagline" },
  { field: "bio", label: "About me", multiline: true },
  { field: "location", label: "Location" },
  { field: "education", label: "Education (optional)" },
  { field: "githubUrl", label: "GitHub URL (optional)" },
  { field: "email", label: "Email" },
  { field: "linkedinUrl", label: "LinkedIn URL (optional)" },
  { field: "instagramUrl", label: "Instagram URL (optional)" },
  { field: "resumeUrl", label: "Resume URL (optional)" },
];

function Field({ field, label, multiline, initialValue }: typeof FIELDS[number] & { initialValue: string }) {
  const { updateField } = useEditMode();
  const [value, setValue] = React.useState(initialValue);
  const Component = multiline ? Textarea : Input;
  return (
    <label className="grid gap-2 text-sm text-muted-foreground">
      {label}
      <Component value={value} onChange={(event) => setValue(event.target.value)}
        onBlur={() => void updateField(field, value)} className="text-foreground" />
    </label>
  );
}

export function EditableLinks() {
  const { isOwner, isEditing, content } = useEditMode();
  if (!isOwner || !isEditing) return null;
  return (
    <details className="mx-auto mt-6 max-w-lg rounded-xl border border-dashed border-primary/40 bg-card/80 p-4 text-left">
      <summary className="cursor-pointer text-sm font-medium">Edit profile & links</summary>
      <div className="mt-4 grid gap-4">
        <p className="text-xs text-muted-foreground">Changes save when you leave a field. Add a hosted resume link when it is ready.</p>
        {FIELDS.map((item) => <Field key={`${item.field}:${content[item.field]}`} {...item} initialValue={content[item.field]} />)}
      </div>
    </details>
  );
}
