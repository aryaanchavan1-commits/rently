"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/lang-context";
import { useAuth } from "@/lib/auth-context";
import LanguageSelector from "@/components/LanguageSelector";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    setOpen(false);
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(253, 251, 247, 0.92)",
        backdropFilter: "saturate(180%) blur(12px)",
        WebkitBackdropFilter: "saturate(180%) blur(12px)",
        borderBottom: "1px solid var(--rently-border-light)",
      }}
    >
      <div className="container-app" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: "linear-gradient(135deg, var(--rently-primary), var(--rently-primary-dark))",
            color: "white", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 18, boxShadow: "0 4px 12px rgba(44, 82, 130, 0.3)",
          }}>R</div>
          <span style={{ fontSize: 22, fontWeight: 800, color: "var(--rently-primary-dark)", letterSpacing: -0.5 }}>
            Rent<span style={{ color: "var(--rently-accent)" }}>ly</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="header-nav" style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 14, fontWeight: 500 }}>
          <Link href="/properties?type=rent" className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13.5 }}>Rent</Link>
          <Link href="/properties?type=buy" className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13.5 }}>Buy</Link>
          <Link href="/commute" className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13.5 }}>Commute</Link>
          <Link href="/map" className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13.5 }}>Map</Link>
          <Link href="/inbox" className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13.5 }}>Inbox</Link>
          <Link href="/owner" className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13.5 }}>Owners</Link>
          <Link href="/pricing" className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13.5 }}>Pricing</Link>
        </nav>

        {/* Right side */}
        <div className="header-nav" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LanguageSelector inline />
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 10, background: "var(--rently-cream-dark)", textDecoration: "none" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, var(--rently-primary), var(--rently-primary-dark))", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>
                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--rently-text)", lineHeight: 1.2 }}>{user.name || user.email.split("@")[0]}</div>
                  <div style={{ fontSize: 11, color: "var(--rently-muted)", textTransform: "capitalize" }}>{user.role}</div>
                </div>
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost" style={{ fontSize: 13, color: "var(--rently-muted)" }}>Logout</button>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-ghost">{t.nav.login}</Link>
              <Link href="/auth/signup" className="btn btn-primary" style={{ padding: "8px 18px" }}>{t.nav.signup}</Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="mobile-menu-lang"><LanguageSelector inline /></div>
          <button onClick={() => setOpen(!open)} className="mobile-menu-btn" aria-label="Menu" style={{ display: "none", background: "none", border: "none", padding: 8, fontSize: 22, color: "var(--rently-text)" }}>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="fade-in" style={{ background: "var(--rently-cream)", borderTop: "1px solid var(--rently-border-light)", padding: "14px 20px" }}>
          <Link href="/properties?type=rent" onClick={() => setOpen(false)} className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>Rent</Link>
          <Link href="/properties?type=buy" onClick={() => setOpen(false)} className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>Buy</Link>
          <Link href="/commute" onClick={() => setOpen(false)} className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>Commute</Link>
          <Link href="/map" onClick={() => setOpen(false)} className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>Map</Link>
          <Link href="/inbox" onClick={() => setOpen(false)} className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>Inbox</Link>
          <Link href="/owner" onClick={() => setOpen(false)} className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>Owners</Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>Pricing</Link>
          <div style={{ padding: "10px 0" }}><LanguageSelector inline /></div>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start", color: "var(--rently-danger)" }}>Logout</button>
            </>
          ) : (
            <div style={{ borderTop: "1px solid var(--rently-border-light)", marginTop: 8, paddingTop: 8, display: "flex", gap: 8 }}>
              <Link href="/auth/login" onClick={() => setOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>{t.nav.login}</Link>
              <Link href="/auth/signup" onClick={() => setOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>{t.nav.signup}</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 760px) {
          .header-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-menu-lang { display: none !important; }
        }
      `}</style>
    </header>
  );
}
