import { NextResponse } from "next/server";
import { calculateTrustScore } from "@/lib/trust-score";

const g = globalThis as unknown as { __rentlyProperties?: any[] };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");

  if (!propertyId) {
    return NextResponse.json({ error: "propertyId required" }, { status: 400 });
  }

  const properties = g.__rentlyProperties || [];
  const property = properties.find((p: any) => p.id === propertyId);

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const result = calculateTrustScore(property, properties);
  return NextResponse.json(result);
}
