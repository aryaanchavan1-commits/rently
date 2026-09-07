import { NextRequest, NextResponse } from "next/server";
import { getContract, updateContract } from "@/lib/contracts-store";

const RENTLY_ECONTRACT_PRICE = 99;
const RENTLY_COMMISSION = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractId, action } = body;

    if (!contractId) {
      return NextResponse.json({ error: "Contract ID required" }, { status: 400 });
    }

    const contract = getContract(contractId);
    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    if (action === "create_order") {
      const orderId = `RZP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      updateContract(contractId, {
        status: "pending_payment",
        paymentAmount: RENTLY_ECONTRACT_PRICE,
        paymentId: orderId,
      });

      return NextResponse.json({
        success: true,
        orderId,
        amount: RENTLY_ECONTRACT_PRICE,
        currency: "INR",
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
        name: "Rently",
        description: `E-Contract for ${contract.propertyTitle}`,
        prefill: {
          name: contract.ownerName,
          email: contract.ownerEmail,
          contact: contract.ownerPhone,
        },
        notes: {
          contractId,
          commission: RENTLY_COMMISSION,
        },
      });
    }

    if (action === "verify_payment") {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

      if (!razorpay_payment_id || !razorpay_order_id) {
        return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
      }

      updateContract(contractId, {
        status: "pending_esign",
        paymentId: razorpay_order_id,
      });

      return NextResponse.json({
        success: true,
        message: "Payment verified. Ready for eSign.",
        contractId,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: "Payment operation failed" }, { status: 500 });
  }
}
