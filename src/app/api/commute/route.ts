import { NextRequest, NextResponse } from "next/server";
import { getAllProperties } from "@/lib/properties-store";

const DESTINATIONS: Record<string, { lat: number; lng: number; name: string }> = {
  "shivaji university": { lat: 16.8426, lng: 74.3071, name: "Shivaji University, Kolhapur" },
  "pune university": { lat: 18.5362, lng: 73.8344, name: "Savitribai Phule Pune University" },
  "mumbai university": { lat: 19.0544, lng: 72.8573, name: "University of Mumbai" },
  "iit bombay": { lat: 19.1334, lng: 72.9133, name: "IIT Bombay" },
  "vit pune": { lat: 18.4524, lng: 73.8470, name: "VIT Pune" },
  "coep": { lat: 18.5298, lng: 73.8623, name: "COEP Pune" },
  "sjce mysore": { lat: 12.3138, lng: 76.6544, name: "SJCE Mysore" },
  "powai": { lat: 19.1176, lng: 72.9060, name: "Powai, Mumbai" },
  "andheri": { lat: 19.1364, lng: 72.8296, name: "Andheri, Mumbai" },
  "baner": { lat: 18.5596, lng: 73.7868, name: "Baner, Pune" },
  "hinjewadi": { lat: 18.5913, lng: 73.7389, name: "Hinjewadi, Pune" },
  "deccan": { lat: 18.5195, lng: 73.8443, name: "Deccan, Pune" },
  "kothrud": { lat: 18.5074, lng: 73.8077, name: "Kothrud, Pune" },
  "thane station": { lat: 19.2183, lng: 72.9781, name: "Thane Station" },
  "vashi": { lat: 19.0715, lng: 72.9985, name: "Vashi, Navi Mumbai" },
  "bandra": { lat: 19.0596, lng: 72.8656, name: "Bandra, Mumbai" },
  "dad": { lat: 19.0753, lng: 72.8781, name: "DAD, Mumbai" },
};

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function getOSRMRouteTime(
  originLat: number, originLng: number,
  destLat: number, destLng: number
): Promise<{ duration: number; distance: number; mode: string } | null> {
  try {
    const url = `http://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=false`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    if (data.code === "Ok" && data.routes?.[0]) {
      return {
        duration: Math.round(data.routes[0].duration / 60),
        distance: Math.round(data.routes[0].distance / 1000 * 10) / 10,
        mode: "car",
      };
    }
  } catch { /* fallback */ }
  const distKm = haversineDistance(originLat, originLng, destLat, destLng);
  const driveMin = Math.round(distKm / 30 * 60);
  return { duration: driveMin, distance: Math.round(distKm * 10) / 10, mode: "est" };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, maxMinutes = 30, mode = "driving" } = body;

    if (!destination) {
      return NextResponse.json({ error: "Destination required" }, { status: 400 });
    }

    const destLower = destination.toLowerCase().trim();
    let destCoords = DESTINATIONS[destLower];

    if (!destCoords) {
      const match = Object.keys(DESTINATIONS).find((k) => destLower.includes(k) || k.includes(destLower));
      if (match) destCoords = DESTINATIONS[match];
    }

    if (!destCoords) {
      const allProps = getAllProperties().filter((p) => p.status === "active");
      const results = allProps.map((p) => {
        const distKm = haversineDistance(p.lat, p.lng, 18.5204, 73.8567);
        return {
          ...p,
          commute: {
            duration: Math.round(distKm / 30 * 60),
            distance: Math.round(distKm * 10) / 10,
            mode: "est",
            destination: destination,
          },
        };
      }).filter((p) => p.commute.duration <= maxMinutes)
        .sort((a, b) => a.commute.duration - b.commute.duration);

      return NextResponse.json({
        success: true,
        destination: { name: destination, lat: 18.5204, lng: 73.8567 },
        results,
        count: results.length,
      });
    }

    const allProps = getAllProperties().filter((p) => p.status === "active");
    const results: Array<typeof allProps[0] & { commute: { duration: number; distance: number; mode: string; destination: string } }> = [];

    for (const p of allProps) {
      const route = await getOSRMRouteTime(p.lat, p.lng, destCoords.lat, destCoords.lng);
      if (route && route.duration <= maxMinutes) {
        results.push({
          ...p,
          commute: { ...route, destination: destCoords.name },
        });
      }
    }

    results.sort((a, b) => a.commute.duration - b.commute.duration);

    return NextResponse.json({
      success: true,
      destination: destCoords,
      results,
      count: results.length,
    });
  } catch {
    return NextResponse.json({ error: "Commute search failed" }, { status: 500 });
  }
}
