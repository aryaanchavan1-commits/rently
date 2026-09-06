import { NextRequest, NextResponse } from "next/server";
import { getPropertyById, updateProperty, deleteProperty } from "@/lib/properties-store";
import { requireAuth, globalRateLimit } from "@/lib/api-auth";

const ALLOWED_UPDATE_FIELDS = [
  "title", "type", "price", "deposit", "maintenance", "parking",
  "address", "area", "city", "state", "lat", "lng",
  "bedrooms", "bathrooms", "furnishing", "availableFrom",
  "images", "amenities", "rules", "description", "contactPhone",
];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!globalRateLimit("prop-detail", 60)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const { id } = await params;
  const prop = getPropertyById(id);
  if (!prop) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Only increment views if caller is not the owner
  const user = await requireAuth(_req);
  if (!user || user.id !== prop.ownerId) {
    prop.views += 1;
  }

  return NextResponse.json(prop);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!globalRateLimit("prop-update", 10)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await params;
  const prop = getPropertyById(id);
  if (!prop) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (prop.ownerId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const safeBody: Record<string, unknown> = {};
  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (key in body) safeBody[key] = body[key];
  }

  const updated = updateProperty(id, safeBody);
  return NextResponse.json({ success: true, property: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!globalRateLimit("prop-delete", 5)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const user = await requireAuth(_req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await params;
  const prop = getPropertyById(id);
  if (!prop) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (prop.ownerId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const deleted = deleteProperty(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
