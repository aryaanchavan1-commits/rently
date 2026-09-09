"use client";

import { ReactNode } from "react";
import AuthGuard from "@/components/AuthGuard";
import SubscriptionBanner from "@/components/SubscriptionBanner";
import AIChat from "@/components/AIChat";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthGuard>
        <SubscriptionBanner />
        {children}
        <AIChat />
      </AuthGuard>
    </ErrorBoundary>
  );
}
