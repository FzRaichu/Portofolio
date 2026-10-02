"use client";

import * as React from "react";

export const SECTION_IDS = [
  "home",
  "about",
  "skills",
  "projects",
  "fun",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

type SectionNavContextValue = {
  activeIndex: number;
  activeId: SectionId;
  requestIndex: number | null;
  setActiveIndex: (index: number) => void;
  clearRequest: () => void;
  goToIndex: (index: number) => void;
  goToId: (id: SectionId) => void;
};

const SectionNavContext = React.createContext<SectionNavContextValue | null>(
  null
);

export function SectionNavProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeIndex, setActiveIndexState] = React.useState(0);
  const [requestIndex, setRequestIndex] = React.useState<number | null>(null);

  const setActiveIndex = React.useCallback((index: number) => {
    setActiveIndexState(index);
  }, []);

  const clearRequest = React.useCallback(() => setRequestIndex(null), []);

  const goToIndex = React.useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(SECTION_IDS.length - 1, index));
    setRequestIndex(clamped);
  }, []);

  const goToId = React.useCallback(
    (id: SectionId) => goToIndex(SECTION_IDS.indexOf(id)),
    [goToIndex]
  );

  const value = React.useMemo<SectionNavContextValue>(
    () => ({
      activeIndex,
      activeId: SECTION_IDS[activeIndex],
      requestIndex,
      setActiveIndex,
      clearRequest,
      goToIndex,
      goToId,
    }),
    [activeIndex, requestIndex, setActiveIndex, clearRequest, goToIndex, goToId]
  );

  return (
    <SectionNavContext.Provider value={value}>
      {children}
    </SectionNavContext.Provider>
  );
}

export function useSectionNav() {
  const ctx = React.useContext(SectionNavContext);
  if (!ctx) {
    throw new Error("useSectionNav must be used within a SectionNavProvider");
  }
  return ctx;
}
