"use client";

import * as React from "react";
import { validateContentField, type SiteContent } from "@/lib/site-content";
import { useSessionValue } from "@/lib/browser-state";

export const AUTO_EDIT_KEY = "portfolio_auto_edit";

type EditModeContextValue = {
  isOwner: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  content: SiteContent;
  updateField: (field: keyof SiteContent, value: string) => Promise<void>;
  saving: boolean;
  saveError: string | null;
};

const EditModeContext = React.createContext<EditModeContextValue | null>(
  null
);

export function EditModeProvider({
  isOwner,
  initialContent,
  children,
}: {
  isOwner: boolean;
  initialContent: SiteContent;
  children: React.ReactNode;
}) {
  const [editFlag, setEditFlag] = useSessionValue(AUTO_EDIT_KEY);
  const isEditing = isOwner && editFlag === "1";
  const setIsEditing = React.useCallback((value: boolean) => {
    setEditFlag(isOwner && value ? "1" : null);
  }, [isOwner, setEditFlag]);
  const [content, setContent] = React.useState(initialContent);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const saveQueue = React.useRef<Promise<void>>(Promise.resolve());
  const pendingSaves = React.useRef(0);
  const contentRef = React.useRef(initialContent);
  const confirmedContent = React.useRef(initialContent);

  const updateField = React.useCallback(
    async (field: keyof SiteContent, value: string) => {
      const trimmed = value.trim();
      if (!isOwner || trimmed === contentRef.current[field]) return;
      const validationError = validateContentField(field, trimmed);
      if (validationError) {
        setSaveError(validationError);
        return;
      }
      contentRef.current = { ...contentRef.current, [field]: trimmed };
      setContent(contentRef.current);
      pendingSaves.current++;
      setSaving(true);
      setSaveError(null);
      const save = async () => {
        try {
          const res = await fetch("/api/site-content", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [field]: trimmed }),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error ?? "Couldn't save. Please try again.");
          }
          const saved: SiteContent = await res.json();
          confirmedContent.current = { ...confirmedContent.current, [field]: saved[field] };
          if (contentRef.current[field] === trimmed) {
            contentRef.current = { ...contentRef.current, [field]: saved[field] };
            setContent(contentRef.current);
          }
        } catch (error) {
          if (contentRef.current[field] === trimmed) {
            contentRef.current = { ...contentRef.current, [field]: confirmedContent.current[field] };
            setContent(contentRef.current);
          }
          setSaveError(error instanceof Error ? error.message : "Couldn't reach the server. Please try again.");
        } finally {
          pendingSaves.current--;
          setSaving(pendingSaves.current > 0);
        }
      };
      const queued = saveQueue.current.then(save);
      saveQueue.current = queued;
      await queued;
    },
    [isOwner]
  );

  const value = React.useMemo<EditModeContextValue>(
    () => ({
      isOwner,
      isEditing,
      setIsEditing,
      content,
      updateField,
      saving,
      saveError,
    }),
    [isOwner, isEditing, setIsEditing, content, updateField, saving, saveError]
  );

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const ctx = React.useContext(EditModeContext);
  if (!ctx) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }
  return ctx;
}
