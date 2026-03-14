import { NextRequest, NextResponse } from "next/server";
import { getSortedHistory } from "@/lib/streakLogic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get("dates") ?? "";
    const dates = raw ? raw.split(",").filter(Boolean) : [];
    return NextResponse.json({ dates: getSortedHistory(dates) });
  } catch {
    return NextResponse.json({ dates: [] }, { status: 400 });
  }
}
