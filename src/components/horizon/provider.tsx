"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";
import { clampYear, stageForYear, type Stage } from "@/lib/horizon";

const STORAGE_KEY = "long-game-horizon-year";
const DEFAULT_YEAR = 1;

/* A tiny external store over localStorage so the horizon survives reloads,
   stays in sync across tabs, and hydrates without effect-driven setState. */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): number {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored ? clampYear(Number(stored)) : DEFAULT_YEAR;
}

function getServerSnapshot(): number {
  return DEFAULT_YEAR;
}

function writeYear(year: number) {
  window.localStorage.setItem(STORAGE_KEY, String(clampYear(year)));
  listeners.forEach((l) => l());
}

type HorizonContextValue = {
  year: number;
  stage: Stage;
  setYear: (year: number) => void;
};

const HorizonContext = createContext<HorizonContextValue | null>(null);

/**
 * The reader's position on the twenty-year clock. Kept in this browser —
 * no account until they want the plan on their phone at a walkthrough.
 */
export function HorizonProvider({ children }: { children: React.ReactNode }) {
  const year = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setYear = useCallback((next: number) => writeYear(next), []);

  return (
    <HorizonContext.Provider value={{ year, stage: stageForYear(year), setYear }}>
      {children}
    </HorizonContext.Provider>
  );
}

export function useHorizon(): HorizonContextValue {
  const ctx = useContext(HorizonContext);
  if (!ctx) throw new Error("useHorizon must be used within a HorizonProvider");
  return ctx;
}
