"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const cities = ["Mumbai", "Pune", "Thane", "Navi Mumbai", "Nagpur", "Nashik"];

export default function SearchBar({ variant = "hero" }: { variant?: "hero" | "compact" }) {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [type, setType] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (locality) params.set("q", locality);
    if (type) params.set("type", type);
    router.push(`/properties?${params.toString()}`);
  }

  if (variant === "compact") {
    return (
      <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          className="input"
          placeholder="Locality, landmark or area"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select className="input" value={city} onChange={(e) => setCity(e.target.value)} style={{ width: 180 }}>
          <option value="">All Maharashtra</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
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
        gridTemplateColumns: "1.2fr 1.4fr 1fr auto",
        gap: 10,
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none", zIndex: 1 }}>📍</span>
        <select className="input" value={city} onChange={(e) => setCity(e.target.value)} style={{ paddingLeft: 36 }}>
          <option value="">All Maharashtra</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none", zIndex: 1 }}>🔍</span>
        <input className="input" placeholder="Locality, landmark or area" value={locality} onChange={(e) => setLocality(e.target.value)} style={{ paddingLeft: 36 }} />
      </div>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none", zIndex: 1 }}>🏠</span>
        <select className="input" value={type} onChange={(e) => setType(e.target.value)} style={{ paddingLeft: 36 }}>
          <option value="">Any type</option>
          <option value="1BHK">1 BHK</option>
          <option value="2BHK">2 BHK</option>
          <option value="3BHK">3 BHK</option>
          <option value="PG">PG / Hostel</option>
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
