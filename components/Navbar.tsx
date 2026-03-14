"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  username: string;
  onLogout: () => void;
}

export default function Navbar({ username, onLogout }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ background: "rgba(10,10,15,0.85)", borderColor: "var(--border)" }}>
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base amber-glow"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
            🔥
          </div>
          <span className="font-bold text-base" style={{ fontFamily: "Sora, sans-serif" }}>
            Streak<span className="gradient-text">Tracker</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link href="/dashboard"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              pathname === "/dashboard"
                ? "text-amber-400"
                : "hover:opacity-80"
            }`}
            style={{ color: pathname === "/dashboard" ? "var(--amber)" : "var(--muted)" }}>
            Dashboard
          </Link>
          <Link href="/history"
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{ color: pathname === "/history" ? "var(--amber)" : "var(--muted)" }}>
            History
          </Link>

          {/* User menu */}
          <div className="flex items-center gap-2 ml-2 pl-3 border-l" style={{ borderColor: "var(--border)" }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #f59e0b40, #d97706 40)", color: "var(--amber)", border: "1px solid var(--amber)" }}>
              {username[0]?.toUpperCase()}
            </div>
            <button onClick={onLogout}
              className="text-sm px-2 py-1 rounded-lg transition-all hover:opacity-80"
              style={{ color: "var(--muted)" }}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
