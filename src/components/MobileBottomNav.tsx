"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { haptics } from "@/lib/haptics";
import MobileMoreSheet from "@/components/MobileMoreSheet";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const profileHref = user?.role === "owner" ? "/dashboard" : "/auth/login";

  const tabs = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      href: "/properties",
      label: "Search",
      active: pathname.startsWith("/properties"),
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      ),
    },
    {
      href: "/favorites",
      label: "Saved",
      active: pathname === "/favorites",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={pathname === "/favorites" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      href: "/inbox",
      label: "Chat",
      active: pathname === "/inbox" || pathname.startsWith("/chat"),
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`mobile-bottom-tab ${tab.active ? "active" : ""}`}
          onClick={() => haptics.light()}
        >
          <span className="mobile-bottom-icon">{tab.svg}</span>
          <span className="mobile-bottom-label">{tab.label}</span>
        </Link>
      ))}
      <MobileMoreSheet />
    </nav>
  );
}
