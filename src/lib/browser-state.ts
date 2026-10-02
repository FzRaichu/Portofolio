"use client";

import { useCallback, useSyncExternalStore } from "react";

const SESSION_EVENT = "portfolio:session-change";
const emptySubscribe = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function subscribeSession(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SESSION_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SESSION_EVENT, onChange);
  };
}

// Storage is optional: private browsing and embedded previews can deny access.
const memory = new Map<string, string | null>();
export function readSessionValue(key: string) {
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return sessionStorage.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}

export function writeSessionValue(key: string, value: string | null) {
  memory.set(key, value);
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    // Keep the current session usable even without browser storage.
  }
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function useSessionValue(key: string) {
  const value = useSyncExternalStore(
    subscribeSession,
    () => readSessionValue(key),
    () => null
  );
  const setValue = useCallback(
    (next: string | null) => writeSessionValue(key, next),
    [key]
  );
  return [value, setValue] as const;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => true
  );
}
