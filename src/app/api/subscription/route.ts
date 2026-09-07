import { NextRequest, NextResponse } from "next/server";
import { createSubscription, getSubscription, isSubscriptionActive, getDaysUntilExpiry, cancelSubscription, SUBSCRIPTION_PLANS } from "@/lib/subscription-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ownerId, plan } = body;

    if (!ownerId) {
      return NextResponse.json({ error: "Owner ID required" }, { status: 400 });
    }

    if (action === "subscribe") {
      if (!plan || !SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }

      const existing = getSubscription(ownerId);
      if (existing && isSubscriptionActive(ownerId)) {
        return NextResponse.json({ error: "Active subscription already exists" }, { status: 400 });
      }

      const sub = createSubscription(ownerId, plan as keyof typeof SUBSCRIPTION_PLANS);
      return NextResponse.json({
        success: true,
        subscription: sub,
        message: "Subscription activated",
      });
    }

    if (action === "check") {
      const active = isSubscriptionActive(ownerId);
      const sub = getSubscription(ownerId);
      const daysLeft = getDaysUntilExpiry(ownerId);

      return NextResponse.json({
        success: true,
        isActive: active,
        subscription: sub,
        daysLeft,
        needsRenewal: daysLeft <= 3 && daysLeft > 0,
        isExpired: !active && !!sub,
      });
    }

    if (action === "cancel") {
      const success = cancelSubscription(ownerId);
      return NextResponse.json({
        success,
        message: success ? "Subscription cancelled" : "No active subscription found",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Subscription operation failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId");

    if (!ownerId) {
      return NextResponse.json({ error: "Owner ID required" }, { status: 400 });
    }

    const active = isSubscriptionActive(ownerId);
    const sub = getSubscription(ownerId);
    const daysLeft = getDaysUntilExpiry(ownerId);

    return NextResponse.json({
      success: true,
      isActive: active,
      subscription: sub,
      daysLeft,
      plans: SUBSCRIPTION_PLANS,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get subscription" }, { status: 500 });
  }
}
