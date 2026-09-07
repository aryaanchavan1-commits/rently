"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/properties",
  "/owner",
  "/pricing",
  "/map",
];

const OWNER_ONLY_PATHS = [
  "/dashboard",
];

const FREE_PATHS = [
  "/inbox",
  "/contracts",
  "/commute",
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading) return;

    const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith("/properties/"));
    const isOwnerPath = OWNER_ONLY_PATHS.some((p) => pathname.startsWith(p));
    const isFreePath = FREE_PATHS.some((p) => pathname.startsWith(p));
    const isChatPath = pathname.startsWith("/chat/");

    if (!user && !isPublicPath && !isFreePath && !isChatPath) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user && user.role === "tenant" && isOwnerPath) {
      router.replace("/");
      return;
    }

    setChecked(true);
  }, [user, loading, pathname, router]);

  if (loading || !checked) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg, #f8fafc)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "3px solid var(--border, #e2e8f0)",
            borderTopColor: "var(--primary, #1a56db)",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px",
          }} />
          <div style={{ fontSize: 14, color: "var(--text-muted, #94a3b8)" }}>Loading…</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
