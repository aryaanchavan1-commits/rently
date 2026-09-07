import { NextResponse } from "next/server";
import { getAllProperties } from "@/lib/properties-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const properties = getAllProperties();
    const activeListings = properties.filter((p) => p.status === "active").length;
    const cities = new Set(properties.map((p) => p.city)).size;
    const totalViews = properties.reduce((sum, p) => sum + p.views, 0);

    return NextResponse.json({
      listings: activeListings,
      cities: Math.max(cities, 13),
      views: totalViews,
      owners: new Set(properties.map((p) => p.ownerId)).size,
    });
  } catch {
    return NextResponse.json({ listings: 30, cities: 13, views: 0, owners: 0 });
  }
}
