// components/StudyButton.tsx
"use client";

interface StudyButtonProps {
  onClick: () => void;
  loading: boolean;
  studiedToday: boolean;
}

export default function StudyButton({
  onClick,
  loading,
  studiedToday,
}: StudyButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || studiedToday}
      className={`
        w-full py-5 rounded-2xl text-lg font-bold transition-all duration-200
        flex items-center justify-center gap-3 shadow-md
        ${
          studiedToday
            ? "bg-green-100 text-green-700 cursor-not-allowed border-2 border-green-200"
            : loading
            ? "bg-indigo-300 text-white cursor-wait"
            : "bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white hover:shadow-lg"
        }
      `}
    >
      {loading ? (
        <>
          <span className="animate-spin text-xl">⏳</span>
          Logging...
        </>
      ) : studiedToday ? (
        <>
          <span className="text-xl">✅</span>
          Studied Today!
        </>
      ) : (
        <>
          <span className="text-xl">📖</span>
          I Studied Today
        </>
      )}
    </button>
  );
}
