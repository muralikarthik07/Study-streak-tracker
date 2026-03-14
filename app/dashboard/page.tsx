// app/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import StreakCard from "@/components/StreakCard";
import StudyButton from "@/components/StudyButton";
import { getTodayString } from "@/lib/streakLogic";

const STORAGE_KEY = "study_dates";

interface StreakData {
  currentStreak: number;
  totalDays: number;
  lastStudied: string | null;
}

function getStoredDates(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDates(dates: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dates));
}

export default function DashboardPage() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    totalDays: 0,
    lastStudied: null,
  });
  const [studiedToday, setStudiedToday] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  const fetchStreak = useCallback(async (dates: string[]) => {
    const query = dates.join(",");
    const res = await fetch(`/api/streak?dates=${encodeURIComponent(query)}`);
    const data: StreakData = await res.json();
    setStreakData(data);
  }, []);

  useEffect(() => {
    setMounted(true);
    const dates = getStoredDates();
    const today = getTodayString();
    setStudiedToday(dates.includes(today));
    fetchStreak(dates);
  }, [fetchStreak]);

  const handleStudy = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const dates = getStoredDates();
      const res = await fetch("/api/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates }),
      });
      const data = await res.json();

      if (data.success) {
        saveDates(data.updatedDates);
        setStudiedToday(true);
        await fetchStreak(data.updatedDates);
      }

      setMessage({
        text: data.message,
        type: data.success ? "success" : "error",
      });
    } catch {
      setMessage({ text: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Top Nav */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="font-bold text-gray-800">StreakTracker</span>
          </div>
          <Link
            href="/history"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View History →
          </Link>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-8 space-y-5">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Stay consistent. Every day counts.
          </p>
        </div>

        {/* Streak Card */}
        <StreakCard
          currentStreak={streakData.currentStreak}
          totalDays={streakData.totalDays}
          lastStudied={streakData.lastStudied}
        />

        {/* Study Button */}
        <StudyButton
          onClick={handleStudy}
          loading={loading}
          studiedToday={studiedToday}
        />

        {/* Message */}
        {message && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-medium text-center animate-pulse
              ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
          >
            {message.text}
          </div>
        )}

        {/* Motivational tip */}
        {streakData.currentStreak === 0 && !studiedToday && (
          <div className="text-center py-2">
            <p className="text-gray-400 text-sm">
              Start your streak today — click the button above! 💪
            </p>
          </div>
        )}
        {streakData.currentStreak >= 7 && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100 rounded-2xl p-4 text-center">
            <p className="text-orange-600 font-semibold">
              🏆 {streakData.currentStreak} day streak! You&apos;re on fire!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
