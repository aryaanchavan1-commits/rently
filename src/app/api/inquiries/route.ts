import { NextRequest, NextResponse } from "next/server";
import { addConversation, getConversationsByOwner, getConversationsByTenant } from "@/lib/store";

// POST - Submit inquiry (tenant -> owner)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { propertyId, propertyTitle, tenantName, tenantEmail, tenantPhone, tenantMessage, ownerName, ownerPhone, ownerId } = body;

    if (!propertyId || !tenantName || !tenantEmail || !tenantMessage || !ownerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const conv = addConversation({
      propertyId,
      propertyTitle: propertyTitle || "Property",
      tenantName,
      tenantEmail,
      tenantPhone: tenantPhone || "",
      tenantMessage,
      ownerName: ownerName || "Owner",
      ownerPhone: ownerPhone || "",
      ownerId,
    });

    return NextResponse.json({ success: true, conversationId: conv.id });
  } catch {
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}

// GET - Get conversations
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ownerId = searchParams.get("ownerId");
  const tenantEmail = searchParams.get("tenantEmail");

  if (ownerId) {
    return NextResponse.json(getConversationsByOwner(ownerId));
  }
  if (tenantEmail) {
    return NextResponse.json(getConversationsByTenant(tenantEmail));
  }
  return NextResponse.json([]);
}
