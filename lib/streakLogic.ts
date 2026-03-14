// lib/streakLogic.ts

export interface StreakData {
  currentStreak: number;
  totalDays: number;
  lastStudied: string | null;
}

export interface UserAccount {
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface UserData {
  studyDates: string[];
}

// ── Date helpers ──────────────────────────────────────────────

export function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(a + "T00:00:00").getTime() - new Date(b + "T00:00:00").getTime()) /
      86400000
  );
}

// ── Streak logic ──────────────────────────────────────────────

export function computeStreak(dates: string[]): StreakData {
  if (!dates.length) return { currentStreak: 0, totalDays: 0, lastStudied: null };
  const unique = [...new Set(dates)].sort((a, b) => (a > b ? -1 : 1));
  const totalDays = unique.length;
  const lastStudied = unique[0];
  if (daysBetween(getTodayString(), lastStudied) > 1)
    return { currentStreak: 0, totalDays, lastStudied };
  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    if (daysBetween(unique[i - 1], unique[i]) === 1) streak++;
    else break;
  }
  return { currentStreak: streak, totalDays, lastStudied };
}

export function markStudied(dates: string[]): {
  success: boolean;
  message: string;
  updatedDates: string[];
} {
  const today = getTodayString();
  const unique = [...new Set(dates)];
  if (unique.includes(today))
    return { success: false, message: "You have already marked today.", updatedDates: unique };
  return {
    success: true,
    message: "Great job! Study logged for today. 🎉",
    updatedDates: [...unique, today],
  };
}

export function getSortedHistory(dates: string[]): string[] {
  return [...new Set(dates)].sort((a, b) => (a > b ? -1 : 1));
}

// ── Auth helpers (localStorage) ───────────────────────────────

const USERS_KEY = "st_users";
const SESSION_KEY = "st_session";

function hashPassword(password: string): string {
  // Simple deterministic hash for demo purposes
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36) + password.length.toString(36);
}

function getUsers(): Record<string, UserAccount> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, UserAccount>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUserDataKey(username: string) {
  return `st_data_${username}`;
}

export function getUserStudyDates(username: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getUserDataKey(username));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUserStudyDates(username: string, dates: string[]) {
  localStorage.setItem(getUserDataKey(username), JSON.stringify(dates));
}

export function signUp(
  username: string,
  email: string,
  password: string
): { success: boolean; message: string } {
  const users = getUsers();
  const key = username.toLowerCase();
  if (users[key]) return { success: false, message: "Username already taken." };
  const emailTaken = Object.values(users).some((u) => u.email === email.toLowerCase());
  if (emailTaken) return { success: false, message: "Email already registered." };
  users[key] = {
    username,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  saveUsers(users);
  return { success: true, message: "Account created!" };
}

export function logIn(
  username: string,
  password: string
): { success: boolean; message: string } {
  const users = getUsers();
  const key = username.toLowerCase();
  const user = users[key];
  if (!user) return { success: false, message: "Username not found." };
  if (user.passwordHash !== hashPassword(password))
    return { success: false, message: "Incorrect password." };
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username: user.username, email: user.email }));
  return { success: true, message: "Welcome back!" };
}

export function logOut() {
  if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
}

export function getSession(): { username: string; email: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
