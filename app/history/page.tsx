"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import HistoryList from "@/components/HistoryList";
import { getUserStudyDates } from "@/lib/streakLogic";

export default function HistoryPage() {
  const { user, loading: authLoading, logout } = useAuth(true);
  const [dates, setDates] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!user) return;
    setMounted(true);
    const fetchHistory = async () => {
      const storedDates = getUserStudyDates(user.username);
      const res = await fetch(`/api/history?dates=${encodeURIComponent(storedDates.join(","))}`);
      const data = await res.json();
      setDates(data.dates);
    };
    fetchHistory();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-pulse-slow">🔥</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar username={user.username} onLogout={logout} />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="animate-fade-up" style={{ animationFillMode: "both" }}>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>
            Study History 📅
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {mounted && dates.length > 0
              ? `${dates.length} session${dates.length !== 1 ? "s" : ""} recorded — every day counts.`
              : "Your complete study record lives here."}
          </p>
        </div>

        {/* Stats bar */}
        {mounted && dates.length > 0 && (
          <div className="rounded-2xl border p-4 flex items-center gap-6 animate-fade-up"
            style={{ background: "var(--surface)", borderColor: "var(--border)", animationDelay: "80ms", animationFillMode: "both" }}>
            <div className="text-center flex-1">
              <p className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif", color: "var(--amber)" }}>
                {dates.length}
              </p>
              <p className="text-xs uppercase tracking-widest mt-0.5" style={{ color: "var(--muted)" }}>Total Days</p>
            </div>
            <div className="w-px h-10" style={{ background: "var(--border)" }} />
            <div className="text-center flex-1">
              <p className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif", color: "var(--amber)" }}>
                {dates[0]?.split("-")[1]
                  ? new Date(Number(dates[0].split("-")[0]), Number(dates[0].split("-")[1]) - 1).toLocaleString("en", { month: "short", year: "numeric" })
                  : "—"}
              </p>
              <p className="text-xs uppercase tracking-widest mt-0.5" style={{ color: "var(--muted)" }}>Most Recent</p>
            </div>
            <div className="w-px h-10" style={{ background: "var(--border)" }} />
            <div className="text-center flex-1">
              <p className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif", color: "var(--amber)" }}>
                {dates.length > 0
                  ? `${Math.round((dates.length / Math.max(1, Math.ceil((new Date(dates[0]).getTime() - new Date(dates[dates.length - 1]).getTime()) / 86400000) + 1)) * 100)}%`
                  : "—"}
              </p>
              <p className="text-xs uppercase tracking-widest mt-0.5" style={{ color: "var(--muted)" }}>Consistency</p>
            </div>
          </div>
        )}

        {/* History list */}
        <div className="rounded-2xl border p-5 animate-fade-up"
          style={{ background: "var(--surface)", borderColor: "var(--border)", animationDelay: "160ms", animationFillMode: "both" }}>
          {mounted ? (
            <HistoryList dates={dates} />
          ) : (
            <div className="py-10 text-center" style={{ color: "var(--muted)" }}>
              <div className="animate-pulse">Loading history...</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
