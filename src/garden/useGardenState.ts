// ============================================================
//  Garden State — bloom progress + day gating
//  ------------------------------------------------------------
//  Stores the visitor's progress in localStorage so the garden
//  persists across visits. One new flower blooms per calendar
//  day after the first visit.
//
//  Set ADMIN_UNLOCK_ALL = true to reveal every flower for
//  testing/demo. The default visitor experience stays gated.
// ============================================================

import { useCallback, useEffect, useState } from 'react';
import { FLOWERS, TOTAL_DAYS } from './flowers';

// ---- ADMIN TOGGLE ----
// Flip to true to view all flowers at once (testing/demo).
const ADMIN_UNLOCK_ALL = false;

const STORAGE_KEY = 'our-little-garden/v1';

interface StoredState {
  firstVisit: string; // ISO date (YYYY-MM-DD) of first ever visit
  lastVisit: string; // ISO date of last visit
  seenDays: number[]; // days that have bloomed
  celebrated: boolean; // full-garden celebration shown
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredState;
  } catch {
    /* ignore */
  }
  const today = todayISO();
  return {
    firstVisit: today,
    lastVisit: today,
    seenDays: [1],
    celebrated: false,
  };
}

function saveState(s: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export interface GardenState {
  /** Days that are allowed to bloom based on date (or admin mode). */
  unlockedDays: Set<number>;
  /** Days the visitor has actually seen bloom (for bloom animation). */
  seenDays: Set<number>;
  /** How many flowers are currently bloomable. */
  bloomCount: number;
  /** Whether the full-garden celebration has been seen. */
  celebrated: boolean;
  /** Mark the celebration as seen. */
  markCelebrated: () => void;
  /** Mark a day as seen (bloom animation has played). */
  markSeen: (day: number) => void;
  /** Total number of flowers in the garden. */
  total: number;
  /** Whether all flowers are unlocked (admin mode). */
  adminMode: boolean;
}

export function useGardenState(): GardenState {
  const [state, setState] = useState<StoredState>(loadState);
  const [adminMode] = useState(ADMIN_UNLOCK_ALL);

  // On mount + when day changes, bloom new flowers up to today.
  useEffect(() => {
    setState((prev) => {
      const today = todayISO();
      const elapsed = Math.max(0, daysBetween(prev.firstVisit, today));
      // day N is unlocked if elapsed days >= N-1
      const maxDay = Math.min(TOTAL_DAYS, elapsed + 1);
      const newSeen = new Set(prev.seenDays);
      // auto-add any days up to maxDay that were already "due"
      for (let d = 1; d <= maxDay; d++) {
        // only auto-bloom days the visitor has already seen on a prior visit;
        // brand-new days bloom on interaction (markSeen) to trigger animation.
        if (prev.seenDays.includes(d)) newSeen.add(d);
      }
      const next: StoredState = {
        ...prev,
        lastVisit: today,
        seenDays: Array.from(newSeen),
      };
      saveState(next);
      return next;
    });
  }, []);

  const unlockedDays = new Set<number>();
  if (adminMode) {
    FLOWERS.forEach((f) => unlockedDays.add(f.day));
  } else {
    const elapsed = Math.max(0, daysBetween(state.firstVisit, todayISO()));
    const maxDay = Math.min(TOTAL_DAYS, elapsed + 1);
    for (let d = 1; d <= maxDay; d++) unlockedDays.add(d);
  }

  const seenDays = new Set(state.seenDays);
  const bloomCount = adminMode
    ? FLOWERS.length
    : Array.from(unlockedDays).filter((d) => seenDays.has(d)).length;

  const markSeen = useCallback((day: number) => {
    setState((prev) => {
      if (prev.seenDays.includes(day)) return prev;
      const next = { ...prev, seenDays: [...prev.seenDays, day] };
      saveState(next);
      return next;
    });
  }, []);

  const markCelebrated = useCallback(() => {
    setState((prev) => {
      if (prev.celebrated) return prev;
      const next = { ...prev, celebrated: true };
      saveState(next);
      return next;
    });
  }, []);

  return {
    unlockedDays,
    seenDays,
    bloomCount,
    celebrated: state.celebrated,
    markCelebrated,
    markSeen,
    total: TOTAL_DAYS,
    adminMode,
  };
}
