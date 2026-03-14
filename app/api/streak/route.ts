import { NextRequest, NextResponse } from "next/server";
import { computeStreak } from "@/lib/streakLogic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get("dates") ?? "";
    const dates = raw ? raw.split(",").filter(Boolean) : [];
    return NextResponse.json(computeStreak(dates));
  } catch {
    return NextResponse.json({ currentStreak: 0, totalDays: 0, lastStudied: null }, { status: 400 });
  }
}
