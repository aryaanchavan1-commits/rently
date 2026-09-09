"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favIds = JSON.parse(localStorage.getItem("rently_favorites") || "[]");
    if (favIds.length === 0) { setLoading(false); return; }
    fetch("/api/properties")
      .then(r => r.json())
      .then(data => {
        const all = Array.isArray(data) ? data : [];
        setFavorites(all.filter((p: any) => favIds.includes(p.id)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function removeFav(id: string) {
    const favIds = JSON.parse(localStorage.getItem("rently_favorites") || "[]");
    localStorage.setItem("rently_favorites", JSON.stringify(favIds.filter((i: string) => i !== id)));
    setFavorites(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="page-cream">
      <Navbar />
      <div className="container-app" style={{ padding: "30px 20px 60px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 20 }}>My Favorites</h1>
        {loading ? (
          <div style={{ display: "grid", gap: 12 }}>{[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 14 }} />)}</div>
        ) : favorites.length === 0 ? (
          <div style={{ textAlign: "center", padding: 50, background: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>&#9825;</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No favorites yet</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: 18 }}>Browse properties and tap the heart icon to save your favorites.</p>
            <Link href="/properties" className="btn btn-primary">Browse Properties</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {favorites.map(p => (
              <Link key={p.id} href={`/properties/${p.id}`} style={{ display: "flex", gap: 14, padding: 16, borderRadius: 14, border: "1px solid var(--border)", background: "var(--surface)", textDecoration: "none", color: "inherit" }}>
                <div style={{ width: 100, height: 80, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "var(--border-light)" }}>
                  {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 700 }}>R</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{p.area}, {p.city}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>₹{p.price.toLocaleString("en-IN")}/mo</div>
                </div>
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFav(p.id); }} style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", cursor: "pointer", alignSelf: "flex-start", color: "var(--danger)", fontSize: 12, fontWeight: 600 }}>Remove</button>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
