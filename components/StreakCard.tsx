import { formatDate } from "@/lib/streakLogic";

interface Props {
  currentStreak: number;
  totalDays: number;
  lastStudied: string | null;
}

function StatTile({ value, label, icon, delay }: { value: string | number; label: string; icon: string; delay: string }) {
  return (
    <div className="rounded-2xl p-5 border card-hover animate-fade-up" style={{
      background: "var(--surface2)",
      borderColor: "var(--border)",
      animationDelay: delay,
      animationFillMode: "both",
    }}>
      <div className="text-2xl mb-3">{icon}</div>
      <div className="text-3xl font-bold mb-1" style={{ fontFamily: "Sora, sans-serif", color: "var(--text)" }}>
        {value}
      </div>
      <div className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
        {label}
      </div>
    </div>
  );
}

export default function StreakCard({ currentStreak, totalDays, lastStudied }: Props) {
  const fireCount = currentStreak >= 14 ? 3 : currentStreak >= 7 ? 2 : currentStreak >= 1 ? 1 : 0;
  const fires = "🔥".repeat(fireCount) || "💤";

  return (
    <div className="space-y-4">
      {/* Hero streak banner */}
      <div className="rounded-2xl border p-6 relative overflow-hidden animate-fade-up"
        style={{ background: "var(--surface)", borderColor: "var(--border)", animationFillMode: "both" }}>
        {/* Ambient glow */}
        {currentStreak > 0 && (
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 10% 50%, rgba(245,158,11,0.08) 0%, transparent 60%)" }} />
        )}
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
              Current Streak
            </p>
            <div className="flex items-end gap-3">
              <span className="text-6xl font-bold" style={{ fontFamily: "Sora, sans-serif", color: "var(--amber)" }}>
                {currentStreak}
              </span>
              <span className="text-2xl font-medium mb-2" style={{ color: "var(--muted)" }}>
                {currentStreak === 1 ? "day" : "days"}
              </span>
            </div>
            {currentStreak === 0 && (
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Mark today to start your streak!</p>
            )}
            {currentStreak >= 7 && (
              <p className="text-sm mt-1 font-medium" style={{ color: "var(--amber)" }}>
                🏆 You&apos;re on a roll — keep it up!
              </p>
            )}
          </div>
          <span className="text-5xl">{fires}</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatTile value={totalDays} label="Total Days" icon="📚" delay="80ms" />
        <StatTile
          value={lastStudied ? formatDate(lastStudied) : "—"}
          label="Last Studied"
          icon="📅"
          delay="160ms"
        />
      </div>
    </div>
  );
}
