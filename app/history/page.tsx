// app/history/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HistoryList from "@/components/HistoryList";

const STORAGE_KEY = "study_dates";

function getStoredDates(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function HistoryPage() {
  const [dates, setDates] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchHistory = async () => {
      const storedDates = getStoredDates();
      const query = storedDates.join(",");
      const res = await fetch(
        `/api/history?dates=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setDates(data.dates);
    };
    fetchHistory();
  }, []);

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
            href="/dashboard"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-8 space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Study History 📅</h1>
          <p className="text-gray-500 mt-1">
            {mounted && dates.length > 0
              ? `${dates.length} study session${dates.length !== 1 ? "s" : ""} recorded.`
              : "Your complete study record."}
          </p>
        </div>

        {/* History List */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5">
          {mounted ? (
            <HistoryList dates={dates} />
          ) : (
            <div className="text-center py-10">
              <div className="animate-pulse text-gray-300 text-lg">
                Loading history...
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
