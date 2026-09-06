import { NextRequest, NextResponse } from "next/server";
import { getAllProperties, addProperty, getPropertiesByOwner } from "@/lib/properties-store";
import { requireAuth, globalRateLimit, sanitizeString, sanitizeUrl, validatePrice, validateCoords } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  if (!globalRateLimit("props-read", 60)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const { searchParams } = new URL(req.url);
  const ownerId = searchParams.get("ownerId");
  if (ownerId) {
    const props = getPropertiesByOwner(sanitizeString(ownerId, 100));
    return NextResponse.json(props.map((p) => ({
      id: p.id, title: p.title, type: p.type, price: p.price, area: p.area, city: p.city,
      bedrooms: p.bedrooms, bathrooms: p.bathrooms, furnishing: p.furnishing,
      images: p.images, isVerified: p.isVerified, isFeatured: p.isFeatured,
      createdAt: p.createdAt, address: p.address,
    })));
  }
  const all = getAllProperties();
  return NextResponse.json(all.map((p) => ({
    id: p.id, title: p.title, type: p.type, price: p.price, area: p.area, city: p.city,
    bedrooms: p.bedrooms, bathrooms: p.bathrooms, furnishing: p.furnishing,
    images: p.images, isVerified: p.isVerified, isFeatured: p.isFeatured,
    createdAt: p.createdAt, address: p.address,
  })));
}

export async function POST(req: NextRequest) {
  if (!globalRateLimit("props-write", 10)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, type, price, deposit, maintenance, parking, address, area, city, state, lat, lng, bedrooms, bathrooms, furnishing, availableFrom, images, amenities, rules, description, contactPhone } = body;

    if (!title || !type || !price || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const numPrice = Number(price);
    if (!validatePrice(numPrice)) {
      return NextResponse.json({ error: "Price must be between ₹500 and ₹10,00,000" }, { status: 400 });
    }

    const numLat = Number(lat) || 18.5204;
    const numLng = Number(lng) || 73.8567;
    if (!validateCoords(numLat, numLng)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    const safeImages = Array.isArray(images)
      ? images.filter((img: unknown) => typeof img === "string").slice(0, 10).map((img: string) => sanitizeUrl(img))
      : [];

    const prop = addProperty({
      ownerId: user.id,
      ownerName: sanitizeString(user.email.split("@")[0], 100),
      title: sanitizeString(title, 200),
      type: sanitizeString(type, 50),
      price: numPrice,
      deposit: Number(deposit) || numPrice * 2,
      maintenance: Number(maintenance) || 0,
      parking: Number(parking) || 0,
      address: sanitizeString(address || "", 300),
      area: sanitizeString(area || "", 100),
      city: sanitizeString(city, 100),
      state: sanitizeString(state || "Maharashtra", 100),
      lat: numLat,
      lng: numLng,
      bedrooms: Math.min(Number(bedrooms) || 0, 10),
      bathrooms: Math.min(Number(bathrooms) || 1, 10),
      furnishing: sanitizeString(furnishing || "unfurnished", 50),
      availableFrom: availableFrom || new Date().toISOString().split("T")[0],
      images: safeImages,
      amenities: Array.isArray(amenities) ? amenities.slice(0, 20).map((a: unknown) => sanitizeString(String(a), 50)) : [],
      rules: sanitizeString(rules || "", 500),
      description: sanitizeString(description || "", 2000),
      contactPhone: sanitizeString(contactPhone || "", 20),
    });

    return NextResponse.json({ success: true, property: prop });
  } catch {
    return NextResponse.json({ error: "Failed to add property" }, { status: 500 });
  }
}
