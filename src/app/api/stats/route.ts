import { NextResponse } from "next/server";
import { getAllProperties } from "@/lib/properties-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const properties = getAllProperties();
    const activeListings = properties.filter((p) => p.status === "active");
    const cities = new Set(activeListings.map((p) => p.city));
    const totalViews = activeListings.reduce((sum, p) => sum + p.views, 0);

    // Count listings per city
    const cityCounts: Record<string, number> = {};
    for (const p of activeListings) {
      cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
    }

    return NextResponse.json({
      listings: activeListings.length,
      cities: Math.max(cities.size, 1),
      views: totalViews,
      owners: new Set(activeListings.map((p) => p.ownerId)).size,
      cityCounts,
    });
  } catch {
    return NextResponse.json({ listings: 0, cities: 0, views: 0, owners: 0, cityCounts: {} });
  }
}
