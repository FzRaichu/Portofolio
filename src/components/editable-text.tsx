"use client";

import * as React from "react";
import { useEditMode } from "@/lib/edit-mode";
import type { SiteContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export function EditableText({
  field,
  as: Tag = "span",
  className,
}: {
  field: keyof SiteContent;
  as?: "h1" | "p" | "span";
  className?: string;
}) {
  const { isOwner, isEditing, content, updateField } = useEditMode();

  if (!isOwner || !isEditing) {
    return <Tag className={className}>{content[field]}</Tag>;
  }

  return (
    <Tag
      className={cn(
        className,
        "rounded-sm outline-2 outline-dashed outline-primary/40 outline-offset-4 transition-colors focus:outline-primary"
      )}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const text = e.currentTarget.textContent ?? "";
        void updateField(field, text);
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    >
      {content[field]}
    </Tag>
  );
}
