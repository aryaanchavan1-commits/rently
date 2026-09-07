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
    <header className="navbar">
      <div className="container-app navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">R</div>
          <div className="navbar-logo-text">
            <span className="navbar-brand">Rent<span className="navbar-brand-accent">ly</span></span>
            <span className="navbar-byline">by Arynoxtech</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="navbar-nav">
          <Link href="/properties?type=rent" className="navbar-link">Rent</Link>
          <Link href="/properties?type=buy" className="navbar-link">Buy</Link>
          <Link href="/commute" className="navbar-link">Commute</Link>
          <Link href="/map" className="navbar-link">Map</Link>
          <Link href="/inbox" className="navbar-link">Inbox</Link>
          <Link href="/owner" className="navbar-link">For Owners</Link>
          <Link href="/pricing" className="navbar-link">Pricing</Link>
          <Link href="/contracts" className="navbar-link">Contracts</Link>
        </nav>

        {/* Right side */}
        <div className="navbar-right">
          <LanguageSelector inline />
          {user ? (
            <div className="navbar-user">
              <Link href="/dashboard" className="navbar-user-link">
                <div className="navbar-avatar">{user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}</div>
                <div className="navbar-user-info">
                  <span className="navbar-user-name">{user.name || user.email.split("@")[0]}</span>
                  <span className="navbar-user-role">{user.role}</span>
                </div>
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link href="/auth/login" className="btn btn-ghost btn-sm">{t.nav.login}</Link>
              <Link href="/auth/signup" className="btn btn-primary btn-sm">{t.nav.signup}</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className="hamburger-line" style={open ? { transform: "rotate(45deg) translate(5px, 5px)" } : {}} />
          <span className="hamburger-line" style={open ? { opacity: 0 } : {}} />
          <span className="hamburger-line" style={open ? { transform: "rotate(-45deg) translate(5px, -5px)" } : {}} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-menu">
          <Link href="/properties?type=rent" onClick={() => setOpen(false)} className="mobile-menu-link">Rent</Link>
          <Link href="/properties?type=buy" onClick={() => setOpen(false)} className="mobile-menu-link">Buy</Link>
          <Link href="/commute" onClick={() => setOpen(false)} className="mobile-menu-link">Commute</Link>
          <Link href="/map" onClick={() => setOpen(false)} className="mobile-menu-link">Map</Link>
          <Link href="/inbox" onClick={() => setOpen(false)} className="mobile-menu-link">Inbox</Link>
          <Link href="/owner" onClick={() => setOpen(false)} className="mobile-menu-link">For Owners</Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="mobile-menu-link">Pricing</Link>
          <Link href="/contracts" onClick={() => setOpen(false)} className="mobile-menu-link">Contracts</Link>
          <div className="mobile-menu-divider" />
          <div className="mobile-menu-lang">
            <LanguageSelector inline />
          </div>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="mobile-menu-link">Dashboard</Link>
              <button onClick={handleLogout} className="mobile-menu-link mobile-menu-danger">Logout</button>
            </>
          ) : (
            <div className="mobile-menu-auth">
              <Link href="/auth/login" onClick={() => setOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>{t.nav.login}</Link>
              <Link href="/auth/signup" onClick={() => setOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>{t.nav.signup}</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
