import { NextRequest, NextResponse } from "next/server";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, description } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return NextResponse.json({
      success: true,
      orderId,
      amount: amount * 100,
      currency: "INR",
      key: RAZORPAY_KEY_ID,
      description: description || "Nivasa by Arynoxtech Payment",
    });
  } catch (error) {
    console.error("Payment order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
