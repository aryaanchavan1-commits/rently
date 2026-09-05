import { NextRequest, NextResponse } from "next/server";
import { getAllProperties, addProperty, getPropertiesByOwner } from "@/lib/properties-store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ownerId = searchParams.get("ownerId");
  if (ownerId) return NextResponse.json(getPropertiesByOwner(ownerId));
  return NextResponse.json(getAllProperties());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, type, price, deposit, maintenance, parking, address, area, city, state, lat, lng, bedrooms, bathrooms, furnishing, availableFrom, images, amenities, rules, description, contactPhone, ownerId, ownerName } = body;

    if (!title || !type || !price || !city || !ownerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prop = addProperty({
      ownerId, ownerName: ownerName || "Owner", title, type,
      price: Number(price), deposit: Number(deposit) || Number(price) * 2,
      maintenance: Number(maintenance) || 0, parking: Number(parking) || 0,
      address: address || "", area: area || "", city,
      state: state || "Maharashtra", lat: Number(lat) || 18.5204, lng: Number(lng) || 73.8567,
      bedrooms: Number(bedrooms) || 0, bathrooms: Number(bathrooms) || 1,
      furnishing: furnishing || "unfurnished",
      availableFrom: availableFrom || new Date().toISOString().split("T")[0],
      images: images || [], amenities: amenities || [],
      rules: rules || "", description: description || "",
      contactPhone: contactPhone || "",
    });

    return NextResponse.json({ success: true, property: prop });
  } catch {
    return NextResponse.json({ error: "Failed to add property" }, { status: 500 });
  }
}
