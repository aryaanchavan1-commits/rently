import { NextRequest, NextResponse } from "next/server";
import { addConversation, getConversationsByOwner, getConversationsByTenant } from "@/lib/store";
import { requireAuth, globalRateLimit, sanitizeString } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  if (!globalRateLimit("inquiry-write", 10)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { propertyId, propertyTitle, tenantName, tenantEmail, tenantPhone, tenantMessage, ownerName, ownerPhone, ownerId } = body;

    if (!propertyId || !tenantName || !tenantEmail || !tenantMessage || !ownerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const conv = addConversation({
      propertyId: sanitizeString(propertyId, 100),
      propertyTitle: sanitizeString(propertyTitle || "Property", 200),
      tenantName: sanitizeString(tenantName, 100),
      tenantEmail: sanitizeString(tenantEmail, 254),
      tenantPhone: sanitizeString(tenantPhone || "", 20),
      tenantMessage: sanitizeString(tenantMessage, 2000),
      ownerName: sanitizeString(ownerName || "Owner", 100),
      ownerPhone: sanitizeString(ownerPhone || "", 20),
      ownerId: sanitizeString(ownerId, 100),
    });

    return NextResponse.json({ success: true, conversationId: conv.id });
  } catch {
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!globalRateLimit("inquiry-read", 20)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const ownerId = searchParams.get("ownerId");
  const tenantEmail = searchParams.get("tenantEmail");

  // Users can only see their own conversations
  if (ownerId && ownerId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  if (tenantEmail && tenantEmail !== user.email && user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  if (ownerId) {
    return NextResponse.json(getConversationsByOwner(sanitizeString(ownerId, 100)));
  }
  if (tenantEmail) {
    return NextResponse.json(getConversationsByTenant(sanitizeString(tenantEmail, 254)));
  }
  return NextResponse.json([]);
}
