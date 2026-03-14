// lib/streakLogic.ts
// Core business logic for computing study streaks

export interface StreakData {
  currentStreak: number;
  totalDays: number;
  lastStudied: string | null;
}

/**
 * Get today's date as a YYYY-MM-DD string (local time)
 */
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Format a YYYY-MM-DD date string to a human-readable format
 * e.g. "2026-03-14" -> "14 March 2026"
 */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Compute the number of calendar days between two YYYY-MM-DD strings.
 * Returns positive if dateA is after dateB.
 */
function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA + "T00:00:00");
  const b = new Date(dateB + "T00:00:00");
  return Math.round((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Given an array of study date strings (YYYY-MM-DD), compute streak stats.
 *
 * Rules:
 *  - Streak counts consecutive days ending on today or yesterday.
 *  - If the most recent study date is more than 1 day ago, streak = 0
 *    (it was broken and the user hasn't started a new one yet).
 *  - If user studied today OR yesterday, count consecutive backwards.
 */
export function computeStreak(dates: string[]): StreakData {
  if (dates.length === 0) {
    return { currentStreak: 0, totalDays: 0, lastStudied: null };
  }

  // Deduplicate and sort descending
  const unique = [...new Set(dates)].sort((a, b) => (a > b ? -1 : 1));
  const totalDays = unique.length;
  const lastStudied = unique[0];
  const today = getTodayString();

  const diffFromToday = daysBetween(today, lastStudied);

  // Streak is broken if last study was 2+ days ago
  if (diffFromToday > 1) {
    return { currentStreak: 0, totalDays, lastStudied };
  }

  // Count consecutive days working backwards from the most recent
  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const diff = daysBetween(unique[i - 1], unique[i]);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return { currentStreak: streak, totalDays, lastStudied };
}

/**
 * Validate and add today's date to the study dates array.
 * Returns { success, message, updatedDates }
 */
export function markStudied(dates: string[]): {
  success: boolean;
  message: string;
  updatedDates: string[];
} {
  const today = getTodayString();
  const unique = [...new Set(dates)];

  if (unique.includes(today)) {
    return {
      success: false,
      message: "You have already marked today.",
      updatedDates: unique,
    };
  }

  const updatedDates = [...unique, today];
  return {
    success: true,
    message: "Great job! Study logged for today. 🎉",
    updatedDates,
  };
}

/**
 * Return study dates sorted newest first.
 */
export function getSortedHistory(dates: string[]): string[] {
  return [...new Set(dates)].sort((a, b) => (a > b ? -1 : 1));
}
