import { NextRequest, NextResponse } from "next/server";
import { searchProperties } from "@/lib/properties-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const results = searchProperties(body);
    return NextResponse.json({ success: true, results, count: results.length });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
