"use client";

import { ReactNode } from "react";
import AuthGuard from "@/components/AuthGuard";
import SubscriptionBanner from "@/components/SubscriptionBanner";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <SubscriptionBanner />
      {children}
    </AuthGuard>
  );
}
