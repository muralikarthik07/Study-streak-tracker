import { formatDate, getTodayString } from "@/lib/streakLogic";

export default function HistoryList({ dates }: { dates: string[] }) {
  const today = getTodayString();

  if (!dates.length) {
    return (
      <div className="text-center py-14">
        <span className="text-5xl block mb-4">📭</span>
        <p className="font-medium mb-1" style={{ color: "var(--text)" }}>No study sessions yet</p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>Head to the dashboard and log your first one!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {dates.map((date, i) => {
        const isToday = date === today;
        const isLatest = i === 0;
        return (
          <li
            key={date}
            className="flex items-center justify-between rounded-xl px-4 py-3.5 border transition-all card-hover animate-fade-up"
            style={{
              background: isToday ? "rgba(245,158,11,0.06)" : "var(--surface2)",
              borderColor: isToday ? "rgba(245,158,11,0.25)" : "var(--border)",
              animationDelay: `${Math.min(i * 40, 400)}ms`,
              animationFillMode: "both",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{isToday ? "⭐" : "✅"}</span>
              <span className="font-medium text-sm" style={{ color: "var(--text)" }}>
                {formatDate(date)}
              </span>
            </div>
            <div className="flex gap-2">
              {isToday && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(245,158,11,0.15)", color: "var(--amber)" }}>
                  Today
                </span>
              )}
              {isLatest && !isToday && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)", color: "var(--muted)" }}>
                  Latest
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
