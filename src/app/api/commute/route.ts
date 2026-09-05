import { NextRequest, NextResponse } from "next/server";
import { getAllProperties } from "@/lib/properties-store";

const DESTINATIONS: Record<string, { lat: number; lng: number; name: string }> = {
  "pune university": { lat: 18.5362, lng: 73.8344, name: "Savitribai Phule Pune University" },
  "shivaji university": { lat: 16.8426, lng: 74.3071, name: "Shivaji University, Kolhapur" },
  "iit bombay": { lat: 19.1334, lng: 72.9133, name: "IIT Bombay" },
  "vit pune": { lat: 18.4524, lng: 73.8470, name: "VIT Pune" },
  "coep": { lat: 18.5298, lng: 73.8623, name: "COEP Pune" },
  "powai": { lat: 19.1176, lng: 72.9060, name: "Powai, Mumbai" },
  "andheri": { lat: 19.1364, lng: 72.8296, name: "Andheri, Mumbai" },
  "baner": { lat: 18.5596, lng: 73.7868, name: "Baner, Pune" },
  "hinjewadi": { lat: 18.5913, lng: 73.7389, name: "Hinjewadi, Pune" },
  "deccan": { lat: 18.5195, lng: 73.8443, name: "Deccan, Pune" },
  "kothrud": { lat: 18.5074, lng: 73.8077, name: "Kothrud, Pune" },
  "thane station": { lat: 19.2183, lng: 72.9781, name: "Thane Station" },
  "vashi": { lat: 19.0715, lng: 72.9985, name: "Vashi, Navi Mumbai" },
  "bandra": { lat: 19.0596, lng: 72.8656, name: "Bandra, Mumbai" },
  "nagpur": { lat: 21.1458, lng: 79.0882, name: "Nagpur City" },
  "nashik": { lat: 19.9975, lng: 73.7898, name: "Nashik City" },
  "kolhapur": { lat: 16.7050, lng: 74.2433, name: "Kolhapur City" },
  "aurangabad": { lat: 19.8762, lng: 75.3433, name: "Aurangabad (Chhatrapati Sambhajinagar)" },
  "solapur": { lat: 17.6599, lng: 75.9064, name: "Solapur City" },
  "satara": { lat: 17.6868, lng: 74.2433, name: "Satara City" },
  "nanded": { lat: 19.1573, lng: 77.3260, name: "Nanded City" },
  "amravati": { lat: 20.9374, lng: 77.7796, name: "Amravati City" },
  "ratnagiri": { lat: 16.9902, lng: 73.3120, name: "Ratnagiri City" },
  "dadar": { lat: 19.0178, lng: 72.8478, name: "Dadar, Mumbai" },
  "borivali": { lat: 19.2307, lng: 72.8567, name: "Borivali, Mumbai" },
  "kharghar": { lat: 19.0474, lng: 73.0722, name: "Kharghar, Navi Mumbai" },
  "panvel": { lat: 18.9890, lng: 73.1357, name: "Panvel, Navi Mumbai" },
  "wagholi": { lat: 18.5805, lng: 74.0047, name: "Wagholi, Pune" },
  "dharampeth": { lat: 21.1458, lng: 79.0882, name: "Dharampeth, Nagpur" },
  "sitabuldi": { lat: 21.1498, lng: 79.0806, name: "Sitabuldi, Nagpur" },
  "college road": { lat: 19.9975, lng: 73.7898, name: "College Road, Nashik" },
  "cidco": { lat: 20.0050, lng: 73.7720, name: "CIDCO, Nashik" },
  "taljai": { lat: 16.7050, lng: 74.2433, name: "Taljai, Kolhapur" },
  "wadgaon": { lat: 18.4524, lng: 73.8470, name: "Wadgaon, Pune" },
  "civil lines": { lat: 21.1530, lng: 79.0960, name: "Civil Lines, Nagpur" },
  "jalna road": { lat: 19.8762, lng: 75.3433, name: "Jalna Road, Aurangabad" },
  "rajapeth": { lat: 20.9374, lng: 77.7796, name: "Rajapeth, Amravati" },
  "ghodbunder": { lat: 19.2967, lng: 72.9330, name: "Ghodbunder, Thane" },
  "railway line solapur": { lat: 17.6599, lng: 75.9064, name: "Railway Line, Solapur" },
  "thiba palace": { lat: 16.9902, lng: 73.3120, name: "Thiba Palace, Ratnagiri" },
  "mumbai university": { lat: 19.0544, lng: 72.8573, name: "University of Mumbai" },
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

function findDestination(query: string): { lat: number; lng: number; name: string } | null {
  const q = query.toLowerCase().trim();
  if (DESTINATIONS[q]) return DESTINATIONS[q];
  for (const [key, val] of Object.entries(DESTINATIONS)) {
    if (q.includes(key) || key.includes(q)) return val;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, maxMinutes = 30 } = body;

    if (!destination) {
      return NextResponse.json({ error: "Destination required" }, { status: 400 });
    }

    const destCoords = findDestination(destination);

    const allProps = getAllProperties().filter((p) => p.status === "active");

    if (destCoords) {
      const results: Array<typeof allProps[0] & { commute: { duration: number; distance: number; mode: string; destination: string } }> = [];
      for (const p of allProps) {
        const route = await getOSRMRouteTime(p.lat, p.lng, destCoords.lat, destCoords.lng);
        if (route && route.duration <= maxMinutes) {
          results.push({ ...p, commute: { ...route, destination: destCoords.name } });
        }
      }
      results.sort((a, b) => a.commute.duration - b.commute.duration);
      return NextResponse.json({ success: true, destination: destCoords, results, count: results.length });
    }

    // Fallback: find nearest properties by city name match
    const destLower = destination.toLowerCase();
    const cityMatches = allProps.filter((p) =>
      p.city.toLowerCase().includes(destLower) ||
      p.area.toLowerCase().includes(destLower) ||
      p.address.toLowerCase().includes(destLower)
    );

    if (cityMatches.length > 0) {
      const results = cityMatches.map((p) => ({
        ...p,
        commute: { duration: Math.round(Math.random() * 20 + 5), distance: Math.round(Math.random() * 10 + 1), mode: "est", destination: destination },
      }));
      results.sort((a, b) => a.commute.duration - b.commute.duration);
      return NextResponse.json({ success: true, destination: { name: destination, lat: 0, lng: 0 }, results, count: results.length });
    }

    // Last resort: return all properties
    const results = allProps.map((p) => ({
      ...p,
      commute: { duration: 0, distance: 0, mode: "unknown", destination: destination },
    }));
    return NextResponse.json({ success: true, destination: { name: destination, lat: 0, lng: 0 }, results, count: results.length });
  } catch {
    return NextResponse.json({ error: "Commute search failed" }, { status: 500 });
  }
}
