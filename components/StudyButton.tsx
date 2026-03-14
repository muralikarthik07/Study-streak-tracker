"use client";

interface Props {
  onClick: () => void;
  loading: boolean;
  studiedToday: boolean;
}

export default function StudyButton({ onClick, loading, studiedToday }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading || studiedToday}
      className="w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
      style={{
        background: studiedToday
          ? "rgba(34,197,94,0.1)"
          : loading
          ? "rgba(245,158,11,0.3)"
          : "linear-gradient(135deg, #f59e0b, #d97706)",
        border: studiedToday ? "1.5px solid rgba(34,197,94,0.3)" : "none",
        color: studiedToday ? "#4ade80" : loading ? "rgba(255,255,255,0.5)" : "#0a0a0f",
        cursor: studiedToday || loading ? "default" : "pointer",
        fontFamily: "Sora, sans-serif",
        transform: studiedToday || loading ? "none" : undefined,
        boxShadow: studiedToday || loading ? "none" : "0 4px 24px rgba(245,158,11,0.3)",
      }}
      onMouseEnter={e => {
        if (!studiedToday && !loading) {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(245,158,11,0.4)";
        }
      }}
      onMouseLeave={e => {
        if (!studiedToday && !loading) {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 24px rgba(245,158,11,0.3)";
        }
      }}
    >
      {loading ? (
        <><span className="animate-spin">⏳</span> Logging study session...</>
      ) : studiedToday ? (
        <><span>✅</span> Studied Today — Come back tomorrow!</>
      ) : (
        <><span>📖</span> I Studied Today</>
      )}
    </button>
  );
}
