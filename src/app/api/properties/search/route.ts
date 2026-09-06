import { NextRequest, NextResponse } from "next/server";
import { searchProperties } from "@/lib/properties-store";
import { globalRateLimit, sanitizeString } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  if (!globalRateLimit("search", 30)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const filters: Record<string, unknown> = {};
    if (body.city) filters.city = sanitizeString(body.city, 100);
    if (body.area) filters.area = sanitizeString(body.area, 100);
    if (body.type) filters.type = sanitizeString(body.type, 50);
    if (body.minPrice) filters.minPrice = Math.max(Number(body.minPrice) || 0, 0);
    if (body.maxPrice) filters.maxPrice = Math.min(Number(body.maxPrice) || 1000000, 1000000);
    if (body.bedrooms) filters.bedrooms = Math.min(Number(body.bedrooms) || 0, 10);
    if (body.furnishing) filters.furnishing = sanitizeString(body.furnishing, 50);
    if (Array.isArray(body.amenities)) filters.amenities = body.amenities.slice(0, 10).map((a: unknown) => sanitizeString(String(a), 50));

    const results = searchProperties(filters);
    return NextResponse.json({ success: true, results, count: results.length });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
