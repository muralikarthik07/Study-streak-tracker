// components/HistoryList.tsx
import { formatDate, getTodayString } from "@/lib/streakLogic";

interface HistoryListProps {
  dates: string[];
}

export default function HistoryList({ dates }: HistoryListProps) {
  const today = getTodayString();

  if (dates.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-5xl block mb-3">📭</span>
        <p className="text-gray-400 font-medium">No study sessions yet.</p>
        <p className="text-gray-400 text-sm">
          Go to the dashboard and start your streak!
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {dates.map((date, idx) => {
        const isToday = date === today;
        const isFirst = idx === 0;
        return (
          <li
            key={date}
            className={`flex items-center justify-between rounded-2xl px-4 py-3 border transition-all
              ${
                isToday
                  ? "bg-indigo-50 border-indigo-200"
                  : "bg-white border-gray-100 hover:border-gray-200"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{isToday ? "⭐" : "✅"}</span>
              <span
                className={`font-medium ${
                  isToday ? "text-indigo-700" : "text-gray-700"
                }`}
              >
                {formatDate(date)}
              </span>
            </div>
            <div className="flex gap-2">
              {isToday && (
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                  Today
                </span>
              )}
              {isFirst && !isToday && (
                <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
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
