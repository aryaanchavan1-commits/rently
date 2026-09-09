"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";
import { haptics } from "@/lib/haptics";

export default function MobileMoreSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLang();

  const links = [
    { href: "/compare", icon: "⚖️", label: "Compare" },
    { href: "/commute", icon: "🚗", label: "Commute" },
    { href: "/map", icon: "🗺️", label: "Map" },
    { href: "/contracts", icon: "📄", label: "Contracts" },
    { href: "/rent-agreement", icon: "📋", label: "Rent Agreement" },
    { href: "/pricing", icon: "💎", label: "Pricing" },
    ...(user ? [{ href: "/dashboard", icon: "📊", label: "Dashboard" }] : []),
  ];

  return (
    <>
      <button
        className="mobile-bottom-tab"
        onClick={() => { haptics.light(); setIsOpen(true); }}
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <span className="mobile-bottom-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </span>
        <span className="mobile-bottom-label">More</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            zIndex: 300, display: "flex", alignItems: "flex-end",
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white", width: "100%", borderRadius: "20px 20px 0 0",
              padding: "20px 20px calc(20px + env(safe-area-inset-bottom, 0))",
              maxHeight: "70vh", overflowY: "auto",
              animation: "slideUp 0.25s ease-out",
            }}
          >
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e3e7ef", margin: "0 auto 16px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => { haptics.light(); setIsOpen(false); }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 6, padding: "12px 4px", borderRadius: 12,
                    textDecoration: "none", color: "#1a365d", fontSize: 11, fontWeight: 600,
                    transition: "background 0.15s",
                  }}
                  className="touch-feedback"
                >
                  <span style={{ fontSize: 24 }}>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
            {user && (
              <>
                <div style={{ height: 1, background: "#f0f2f7", margin: "16px 0" }} />
                <button
                  onClick={() => { haptics.medium(); logout(); setIsOpen(false); }}
                  className="touch-feedback"
                  style={{
                    width: "100%", padding: "12px", borderRadius: 12, border: "1px solid #fee2e2",
                    background: "#fff5f5", color: "#dc2626", fontWeight: 600, fontSize: 14,
                    cursor: "pointer", WebkitTapHighlightColor: "transparent",
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
