// components/StreakCard.tsx
import { formatDate } from "@/lib/streakLogic";

interface StreakCardProps {
  currentStreak: number;
  totalDays: number;
  lastStudied: string | null;
}

function StatBox({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  return (
    <div className={`rounded-2xl p-5 ${color} flex flex-col gap-1`}>
      <span className="text-2xl">{icon}</span>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
}

export default function StreakCard({
  currentStreak,
  totalDays,
  lastStudied,
}: StreakCardProps) {
  const streakEmoji =
    currentStreak >= 7
      ? "🔥🔥🔥"
      : currentStreak >= 3
      ? "🔥🔥"
      : currentStreak >= 1
      ? "🔥"
      : "💤";

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Your Progress</h2>
          <p className="text-sm text-gray-400 mt-0.5">Keep the streak alive!</p>
        </div>
        <span className="text-4xl">{streakEmoji}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatBox
          label="Current Streak"
          value={`${currentStreak} day${currentStreak !== 1 ? "s" : ""}`}
          icon="🔥"
          color="bg-orange-50"
        />
        <StatBox
          label="Total Study Days"
          value={totalDays}
          icon="📚"
          color="bg-blue-50"
        />
      </div>

      {/* Last Studied */}
      <div className="rounded-2xl bg-gray-50 p-4 flex items-center gap-3">
        <span className="text-xl">📅</span>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Last Studied
          </p>
          <p className="text-sm font-semibold text-gray-700">
            {lastStudied ? formatDate(lastStudied) : "No study sessions yet"}
          </p>
        </div>
      </div>
    </div>
  );
}
