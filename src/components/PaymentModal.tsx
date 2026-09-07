"use client";

import { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
  amount: number;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentModal({ isOpen, onClose, onSuccess, amount, description, prefill }: PaymentModalProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handlePayment() {
    setProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Payment initialization failed");
        setProcessing(false);
        return;
      }

      const options = {
        key: data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Rently",
        description,
        order_id: data.orderId,
        handler: function (response: any) {
          verifyPayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
        },
        prefill: {
          name: prefill?.name || "",
          email: prefill?.email || "",
          contact: prefill?.contact || "",
        },
        theme: {
          color: "#2c5282",
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(response.error?.description || "Payment failed");
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      setError("Payment initialization failed");
      setProcessing(false);
    }
  }

  async function verifyPayment(paymentId: string, orderId: string, signature: string) {
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, orderId, signature }),
      });
      const data = await res.json();

      if (data.success) {
        onSuccess(paymentId);
      } else {
        setError("Payment verification failed");
      }
    } catch (err) {
      setError("Payment verification failed");
    }
    setProcessing(false);
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 10000, padding: 20,
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "white", borderRadius: 20, padding: 32, maxWidth: 420, width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1a365d" }}>Payment</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#999" }}>✕</button>
        </div>

        <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>{description}</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#1a365d" }}>₹{amount}</div>
        </div>

        {error && (
          <div style={{ background: "#fff5f5", color: "#e53e3e", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={processing}
          style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: processing ? "#999" : "linear-gradient(135deg, #2c5282, #1a365d)",
            color: "white", fontWeight: 700, fontSize: 16, cursor: processing ? "not-allowed" : "pointer",
          }}
        >
          {processing ? "Processing…" : `Pay ₹${amount}`}
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16, fontSize: 12, color: "#999" }}>
          <span>🔒</span>
          <span>Secured by Razorpay</span>
        </div>
      </div>
    </div>
  );
}
