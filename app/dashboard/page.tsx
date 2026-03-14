"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import StreakCard from "@/components/StreakCard";
import StudyButton from "@/components/StudyButton";
import { getTodayString, getUserStudyDates, saveUserStudyDates } from "@/lib/streakLogic";

interface StreakData {
  currentStreak: number;
  totalDays: number;
  lastStudied: string | null;
}

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth(true);
  const [streakData, setStreakData] = useState<StreakData>({ currentStreak: 0, totalDays: 0, lastStudied: null });
  const [studiedToday, setStudiedToday] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [mounted, setMounted] = useState(false);

  const fetchStreak = useCallback(async (dates: string[]) => {
    const query = encodeURIComponent(dates.join(","));
    const res = await fetch(`/api/streak?dates=${query}`);
    const data: StreakData = await res.json();
    setStreakData(data);
  }, []);

  useEffect(() => {
    if (!user) return;
    setMounted(true);
    const dates = getUserStudyDates(user.username);
    setStudiedToday(dates.includes(getTodayString()));
    fetchStreak(dates);
  }, [user, fetchStreak]);

  const handleStudy = async () => {
    if (!user) return;
    setLoading(true);
    setMessage(null);
    try {
      const dates = getUserStudyDates(user.username);
      const res = await fetch("/api/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates }),
      });
      const data = await res.json();
      if (data.success) {
        saveUserStudyDates(user.username, data.updatedDates);
        setStudiedToday(true);
        await fetchStreak(data.updatedDates);
      }
      setMessage({ text: data.message, type: data.success ? "success" : "error" });
    } catch {
      setMessage({ text: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse-slow">🔥</div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar username={user.username} onLogout={logout} />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome header */}
        <div className="animate-fade-up" style={{ animationFillMode: "both" }}>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>
            Hey, {user.username} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {studiedToday
              ? "You've already studied today. Amazing work! 🎉"
              : "Ready to keep your streak alive? Mark today's study session."}
          </p>
        </div>

        {/* Streak stats */}
        {mounted && (
          <StreakCard
            currentStreak={streakData.currentStreak}
            totalDays={streakData.totalDays}
            lastStudied={streakData.lastStudied}
          />
        )}

        {/* Study button */}
        <div className="animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
          <StudyButton onClick={handleStudy} loading={loading} studiedToday={studiedToday} />
        </div>

        {/* Feedback message */}
        {message && (
          <div
            className="rounded-xl px-5 py-3.5 text-sm font-medium text-center border animate-fade-in"
            style={{
              background: message.type === "success" ? "rgba(34,197,94,0.08)" : "rgba(245,158,11,0.08)",
              borderColor: message.type === "success" ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.2)",
              color: message.type === "success" ? "#4ade80" : "var(--amber)",
            }}
          >
            {message.text}
          </div>
        )}

        {/* Milestone cards */}
        {mounted && streakData.currentStreak > 0 && (
          <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: "280ms", animationFillMode: "both" }}>
            {[
              { days: 3, label: "3-day streak", icon: "🌱" },
              { days: 7, label: "7-day streak", icon: "⚡" },
              { days: 30, label: "30-day streak", icon: "🏆" },
            ].map(({ days, label, icon }) => {
              const reached = streakData.currentStreak >= days;
              return (
                <div key={days}
                  className="rounded-xl p-3 text-center border"
                  style={{
                    background: reached ? "rgba(245,158,11,0.08)" : "var(--surface)",
                    borderColor: reached ? "rgba(245,158,11,0.3)" : "var(--border)",
                  }}>
                  <div className="text-xl mb-1" style={{ filter: reached ? "none" : "grayscale(1) opacity(0.3)" }}>
                    {icon}
                  </div>
                  <p className="text-xs font-medium" style={{ color: reached ? "var(--amber)" : "var(--muted)" }}>
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
