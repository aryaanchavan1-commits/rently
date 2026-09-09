"use client";

import { ReactNode } from "react";
import AuthGuard from "@/components/AuthGuard";
import SubscriptionBanner from "@/components/SubscriptionBanner";
import AIChat from "@/components/AIChat";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <SubscriptionBanner />
      {children}
      <AIChat />
    </AuthGuard>
  );
}
