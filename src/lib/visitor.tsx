"use client";

import * as React from "react";
import { useSessionValue } from "@/lib/browser-state";

const VISITOR_NAME_KEY = "portfolio_visitor_name";

type VisitorContextValue = {
  visitorName: string | null;
  setVisitorName: (name: string | null) => void;
};

const VisitorContext = React.createContext<VisitorContextValue | null>(null);

export function VisitorProvider({ children }: { children: React.ReactNode }) {
  const [visitorName, setVisitorName] = useSessionValue(VISITOR_NAME_KEY);

  const value = React.useMemo(
    () => ({ visitorName, setVisitorName }),
    [visitorName, setVisitorName]
  );

  return (
    <VisitorContext.Provider value={value}>
      {children}
    </VisitorContext.Provider>
  );
}

export function useVisitor() {
  const ctx = React.useContext(VisitorContext);
  if (!ctx) {
    throw new Error("useVisitor must be used within a VisitorProvider");
  }
  return ctx;
}
