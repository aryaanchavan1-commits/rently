"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { apiUrl } from "@/lib/api";
import { useLang } from "@/lib/lang-context";

interface SubscriptionStatus {
  isActive: boolean;
  daysLeft: number;
  needsRenewal: boolean;
  isExpired: boolean;
  subscription?: {
    plan: string;
    endDate: string;
  };
}

export default function SubscriptionBanner() {
  const { user } = useAuth();
  const { lang } = useLang();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const t = (en: string, mr: string, hi: string) => lang === "mr" ? mr : lang === "hi" ? hi : en;

  useEffect(() => {
    if (!user || user.role !== "owner") return;

    async function checkSubscription() {
      try {
        const res = await fetch(apiUrl(`/api/subscription?ownerId=${user?.id}`));
        const data = await res.json();
        if (data.success) {
          setStatus(data);
        }
      } catch (err) {
        console.error("Subscription check error:", err);
      }
    }

    checkSubscription();
    const interval = setInterval(checkSubscription, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user || user.role !== "owner" || dismissed || !status) return null;

  if (status.isExpired) {
    return (
      <div style={{
        background: "linear-gradient(135deg, #e53e3e, #c53030)",
        color: "white", padding: "12px 20px", textAlign: "center",
        fontSize: 14, fontWeight: 600,
      }}>
        <span>⚠️ {t("तुमची सदस्यता कालबाह्य झाली आहे!", "आपकी सदस्यता समाप्त हो गई है!", "Your subscription has expired!")}</span>{" "}
        <Link href="/pricing" style={{ color: "white", textDecoration: "underline", fontWeight: 700 }}>
          {t("पुन्हा सदस्यता घ्या", "फिर से सदस्यता लें", "Renew Now")} →
        </Link>
        <button onClick={() => setDismissed(true)} style={{ marginLeft: 12, background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>
    );
  }

  if (status.needsRenewal) {
    return (
      <div style={{
        background: "linear-gradient(135deg, #f6ad55, #ed8936)",
        color: "white", padding: "12px 20px", textAlign: "center",
        fontSize: 14, fontWeight: 600,
      }}>
        <span>⏰ {t(`तुमची सदस्यता ${status.daysLeft} दिवसांत कालबाह्य होणार आहे`, `आपकी सदस्यता ${status.daysLeft} दिन में समाप्त होगी`, `Your subscription expires in ${status.daysLeft} days`)}</span>{" "}
        <Link href="/pricing" style={{ color: "white", textDecoration: "underline", fontWeight: 700 }}>
          {t("पुन्हा भरा", "फिर से भरें", "Renew")} →
        </Link>
        <button onClick={() => setDismissed(true)} style={{ marginLeft: 12, background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>
    );
  }

  return null;
}
