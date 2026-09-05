"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const popularCities = ["Mumbai", "Pune", "Thane", "Navi Mumbai", "Nagpur", "Nashik", "Kolhapur", "Aurangabad", "Solapur", "Satara", "Nanded", "Amravati", "Ratnagiri"];

export default function SearchBar({ variant = "hero" }: { variant?: "hero" | "compact" }) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [type, setType] = useState("");

  const filtered = location.trim()
    ? popularCities.filter((c) => c.toLowerCase().includes(location.toLowerCase()))
    : popularCities;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (location.trim()) params.set("city", location.trim());
    if (type) params.set("type", type);
    router.push(`/properties?${params.toString()}`);
  }

  function pickCity(city: string) {
    setLocation(city);
    setShowSuggestions(false);
    const params = new URLSearchParams();
    params.set("city", city);
    if (type) params.set("type", type);
    router.push(`/properties?${params.toString()}`);
  }

  if (variant === "compact") {
    return (
      <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <input
            className="input"
            placeholder="Search any city or area in Maharashtra"
            value={location}
            onChange={(e) => { setLocation(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && filtered.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid #e3e7ef", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50, maxHeight: 200, overflowY: "auto", marginTop: 4 }}>
              {filtered.slice(0, 8).map((c) => (
                <button key={c} type="button" onClick={() => pickCity(c)} style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", fontSize: 14, background: "white", border: "none", cursor: "pointer", color: "#0b1437", borderBottom: "1px solid #f0f2f7" }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "#f4f6fb"; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "white"; }}
                >
                  📍 {c}
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary" style={{ padding: "11px 20px" }}>Search</button>
      </form>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="search-bar"
      style={{
        background: "white",
        borderRadius: 16,
        padding: 14,
        boxShadow: "0 14px 40px rgba(11,20,55,0.10)",
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr auto",
        gap: 10,
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none", zIndex: 1 }}>📍</span>
        <input
          className="input"
          placeholder="Search any city or area in Maharashtra…"
          value={location}
          onChange={(e) => { setLocation(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          style={{ paddingLeft: 36 }}
        />
        {showSuggestions && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid #e3e7ef", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50, maxHeight: 240, overflowY: "auto", marginTop: 4 }}>
            <div style={{ padding: "8px 14px", fontSize: 11, color: "#4b5675", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {location.trim() ? "Matching cities" : "Popular cities"}
            </div>
            {filtered.length === 0 && (
              <div style={{ padding: "12px 14px", fontSize: 13, color: "#4b5675" }}>
                No match — press Enter to search &quot;{location}&quot;
              </div>
            )}
            {filtered.slice(0, 10).map((c) => (
              <button key={c} type="button" onClick={() => pickCity(c)} style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", fontSize: 14, background: "white", border: "none", cursor: "pointer", color: "#0b1437", borderBottom: "1px solid #f0f2f7" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "#f4f6fb"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "white"; }}
              >
                📍 {c}
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none", zIndex: 1 }}>🏠</span>
        <select className="input" value={type} onChange={(e) => setType(e.target.value)} style={{ paddingLeft: 36 }}>
          <option value="">Any type</option>
          <option value="apartment">Apartment / Flat</option>
          <option value="house">House</option>
          <option value="room">Room</option>
          <option value="pg">PG / Hostel</option>
          <option value="office">Office</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary" style={{ padding: "12px 20px" }}>Search</button>
      <style>{`
        @media (max-width: 800px) {
          .search-bar { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}
