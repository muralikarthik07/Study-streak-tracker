"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, logIn, getSession } from "@/lib/streakLogic";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (getSession()) router.replace("/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields."); return;
    }
    if (form.username.length < 3) { setError("Username must be at least 3 characters."); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setError("Please enter a valid email."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    const result = signUp(form.username.trim(), form.email.trim(), form.password);
    if (result.success) {
      logIn(form.username.trim(), form.password);
      router.replace("/dashboard");
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const fields = [
    { key: "username", label: "Username", type: "text", placeholder: "your_username" },
    { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { key: "password", label: "Password", type: "password", placeholder: "Min. 6 characters" },
    { key: "confirm", label: "Confirm Password", type: "password", placeholder: "Re-enter password" },
  ] as const;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #0891b2, transparent)" }} />

      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl amber-glow"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
              🔥
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>
              Streak<span className="gradient-text">Tracker</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Sora, sans-serif" }}>Start your journey</h1>
          <p style={{ color: "var(--muted)" }}>Create a free account and build your streak</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--muted)" }}>
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  className="input-amber w-full px-4 py-3 rounded-xl border text-sm transition-all"
                  style={{ background: "var(--surface2)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
            ))}

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm border"
                style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)", color: "#f87171" }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 mt-2"
              style={{
                background: loading ? "rgba(245,158,11,0.4)" : "linear-gradient(135deg, #f59e0b, #d97706)",
                color: loading ? "rgba(255,255,255,0.5)" : "#0a0a0f",
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: "var(--muted)" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: "var(--amber)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
