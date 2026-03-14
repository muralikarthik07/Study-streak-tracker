import { NextRequest, NextResponse } from "next/server";
import { markStudied } from "@/lib/streakLogic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dates: string[] = Array.isArray(body.dates) ? body.dates : [];
    const result = markStudied(dates);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request.", updatedDates: [] }, { status: 400 });
  }
}
