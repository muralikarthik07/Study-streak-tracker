// hooks/useAuth.ts
"use client";
import { useState, useEffect } from "react";
import { getSession, logOut } from "@/lib/streakLogic";
import { useRouter } from "next/navigation";

export function useAuth(requireAuth = true) {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    setUser(session);
    setLoading(false);
    if (requireAuth && !session) router.replace("/login");
  }, [requireAuth, router]);

  const logout = () => {
    logOut();
    setUser(null);
    router.replace("/login");
  };

  return { user, loading, logout };
}
