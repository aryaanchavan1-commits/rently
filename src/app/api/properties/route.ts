import { NextResponse } from "next/server";

const allProperties = [
  { id: "1", title: "Spacious 2BHK with Modern Amenities", type: "apartment", price: 22000, address: "15 Andheri West, Mumbai", area: "Andheri West", city: "Mumbai", bedrooms: 2, bathrooms: 2, furnishing: "semi", images: JSON.stringify(["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]), isVerified: true, isFeatured: true, viewCount: 245, ownerId: "1" },
  { id: "2", title: "Cozy 1BHK Near Metro Station", type: "apartment", price: 12000, address: "22 Kothrud, Pune", area: "Kothrud", city: "Pune", bedrooms: 1, bathrooms: 1, furnishing: "furnished", images: JSON.stringify(["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]), isVerified: true, isFeatured: false, viewCount: 189, ownerId: "2" },
  { id: "3", title: "Premium 3BHK with Garden View", type: "house", price: 35000, address: "8 Baner, Pune", area: "Baner", city: "Pune", bedrooms: 3, bathrooms: 3, furnishing: "furnished", images: JSON.stringify(["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]), isVerified: true, isFeatured: true, viewCount: 312, ownerId: "3" },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const type = searchParams.get("type");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const q = searchParams.get("q");

  let results = [...allProperties];

  if (city) results = results.filter((p) => p.city.toLowerCase() === city.toLowerCase());
  if (type) results = results.filter((p) => p.type === type);
  if (minPrice) results = results.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) results = results.filter((p) => p.price <= Number(maxPrice));
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.area.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({ properties: results, total: results.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newProperty = {
    id: String(Date.now()),
    ...body,
    images: JSON.stringify(body.images || []),
    isVerified: false,
    isFeatured: false,
    viewCount: 0,
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json({ property: newProperty, message: "Property created successfully" });
}
