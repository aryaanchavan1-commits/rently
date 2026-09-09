"use client";

import { ReactNode } from "react";
import AuthGuard from "@/components/AuthGuard";
import SubscriptionBanner from "@/components/SubscriptionBanner";
import AIChat from "@/components/AIChat";
import MobileBottomNav from "@/components/MobileBottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthGuard>
        <SubscriptionBanner />
        {children}
        <AIChat />
        <ScrollToTop />
        <MobileBottomNav />
      </AuthGuard>
    </ErrorBoundary>
  );
}
