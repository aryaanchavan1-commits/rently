"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import AIChat from "@/components/AIChat";
import Link from "next/link";

const TYPE_LIST = ["apartment", "independent-house", "villa", "pg", "commercial"];
const SORT_LIST = ["recommended", "price_asc", "price_desc", "newest", "area_desc"];
const FURNISHING_LIST = ["fully-furnished", "semi-furnished", "unfurnished"];
const BHK_LIST = ["studio", "1", "2", "3", "4+"];
const LISTING_TYPE = ["rent", "buy", "pg"];

function Content() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get("city") || searchParams.get("location") || "";
  const initialType = searchParams.get("type") || "";
  const initialMin = searchParams.get("budget_min") || "";
  const initialMax = searchParams.get("budget_max") || "";
  const initialBhk = searchParams.get("bedrooms") || "";

  const [locationQuery, setLocationQuery] = useState(initialCity);
  const [type, setType] = useState(initialType);
  const [minPrice, setMinPrice] = useState(initialMin ? Number(initialMin) : 500);
  const [maxPrice, setMaxPrice] = useState(initialMax ? Number(initialMax) : 100000);
  const [sort, setSort] = useState("recommended");
  const [bhk, setBhk] = useState(initialBhk);
  const [furnishing, setFurnishing] = useState("");
  const [listingType, setListingType] = useState("rent");
  const [view, setView] = useState<"grid" | "map">("grid");
  const [allProperties, setAllProperties] = useState<Array<{id:string;title:string;type:string;price:number;area:string;city:string;bedrooms:number;bathrooms:number;furnishing:string;images:string;isVerified:boolean;isFeatured:boolean;createdAt:string;address:string;lat:number;lng:number}>>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("/api/properties")
      .then(r => r.json())
      .then(d => { setAllProperties(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let r = [...allProperties];
    if (locationQuery) {
      const q = locationQuery.toLowerCase();
      r = r.filter((p) => p.city.toLowerCase().includes(q) || p.area.toLowerCase().includes(q) || p.address.toLowerCase().includes(q));
    }
    if (type) r = r.filter((p) => p.type === type);
    if (bhk) {
      if (bhk === "4+") r = r.filter((p) => p.bedrooms >= 4);
      else if (bhk === "studio") r = r.filter((p) => p.bedrooms === 0);
      else r = r.filter((p) => p.bedrooms === Number(bhk));
    }
    if (furnishing) r = r.filter((p) => p.furnishing === furnishing);
    r = r.filter((p) => p.price >= minPrice && p.price <= maxPrice);
    if (sort === "price_asc") r.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") r.sort((a, b) => b.price - a.price);
    else if (sort === "newest") r.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    else if (sort === "area_desc") r.sort((a, b) => a.title.localeCompare(b.title));
    return r;
  }, [locationQuery, type, minPrice, maxPrice, sort, bhk, furnishing, allProperties]);

  const uniqueCities = [...new Set(allProperties.map((p) => p.city))].sort();

  const activeFilterCount = [type, bhk, furnishing, minPrice > 500, maxPrice < 100000].filter(Boolean).length;

  return (
    <div style={{ background: "#f7f8fc", minHeight: "calc(100vh - 64px)" }}>
      <div className="container-app" style={{ paddingTop: 20, paddingBottom: 60 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0b1437" }}>
              {locationQuery
                ? `Rentals in ${locationQuery}`
                : "Browse Maharashtra Rentals"}
            </h1>
            <p style={{ color: "#4b5675", fontSize: 14, marginTop: 4 }}>
              {filtered.length} properties found
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setShowFilters(!showFilters)} className="btn btn-outline" style={{ padding: "8px 14px", fontSize: 13 }}>
              🔽 Filters {activeFilterCount > 0 && <span style={{ background: "#0d6efd", color: "white", borderRadius: 999, padding: "1px 7px", fontSize: 11, marginLeft: 4 }}>{activeFilterCount}</span>}
            </button>
            <button onClick={() => setView("grid")} className={`btn ${view === "grid" ? "btn-secondary" : "btn-outline"}`} style={{ padding: "8px 14px", fontSize: 13 }}>
              🏠 Grid
            </button>
            <button onClick={() => setView("map")} className={`btn ${view === "map" ? "btn-secondary" : "btn-outline"}`} style={{ padding: "8px 14px", fontSize: 13 }}>
              🗺️ Map
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "stretch", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 300px" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#9ca3af" }}>📍</span>
            <input
              className="input"
              placeholder="Search any city or area in Maharashtra…"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              style={{ paddingLeft: 40, height: 44, fontSize: 14, borderRadius: 10, border: "2px solid #e3e7ef" }}
            />
          </div>
          <select className="input" value={listingType} onChange={(e) => setListingType(e.target.value)} style={{ width: 120, height: 44, borderRadius: 10, border: "2px solid #e3e7ef" }}>
            {LISTING_TYPE.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
          </select>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 180, height: 44, borderRadius: 10, border: "2px solid #e3e7ef" }}>
            {SORT_LIST.map((s) => (
              <option key={s} value={s}>
                {s === "recommended" ? "Recommended" : s === "price_asc" ? "Price: Low → High" : s === "price_desc" ? "Price: High → Low" : s === "newest" ? "Newest" : "Largest Area"}
              </option>
            ))}
          </select>
        </div>

        {/* Quick city chips */}
        {!locationQuery && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            <button onClick={() => setLocationQuery("")} className={`btn ${!locationQuery ? "btn-secondary" : "btn-outline"}`} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600 }}>
              All Maharashtra
            </button>
            {uniqueCities.slice(0, 10).map((c) => (
              <button key={c} onClick={() => setLocationQuery(c)} className="btn btn-outline" style={{ padding: "6px 14px", fontSize: 12 }}>
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Expandable advanced filters */}
        {showFilters && (
          <div style={{ background: "white", borderRadius: 14, padding: 18, border: "1px solid #e3e7ef", marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
              {/* BHK */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#4b5675", marginBottom: 6, display: "block" }}>BHK</label>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {BHK_LIST.map((b) => (
                    <button key={b} onClick={() => setBhk(bhk === b ? "" : b)} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: bhk === b ? "2px solid #0d6efd" : "1px solid #e3e7ef", background: bhk === b ? "#e8f0fe" : "#f7f8fc", color: bhk === b ? "#0d6efd" : "#4b5675", cursor: "pointer" }}>
                      {b === "studio" ? "Studio" : `${b} BHK`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#4b5675", marginBottom: 6, display: "block" }}>Property Type</label>
                <select className="input" value={type} onChange={(e) => setType(e.target.value)} style={{ width: "100%", height: 38, fontSize: 13 }}>
                  <option value="">Any type</option>
                  {TYPE_LIST.map((tp) => <option key={tp} value={tp}>{tp.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</option>)}
                </select>
              </div>

              {/* Furnishing */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#4b5675", marginBottom: 6, display: "block" }}>Furnishing</label>
                <select className="input" value={furnishing} onChange={(e) => setFurnishing(e.target.value)} style={{ width: "100%", height: 38, fontSize: 13 }}>
                  <option value="">Any</option>
                  {FURNISHING_LIST.map((f) => <option key={f} value={f}>{f.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</option>)}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#4b5675", marginBottom: 6, display: "block" }}>Budget</label>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input type="number" className="input" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} style={{ width: "50%", height: 38, fontSize: 13 }} placeholder="Min" />
                  <span style={{ color: "#9ca3af" }}>–</span>
                  <input type="number" className="input" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: "50%", height: 38, fontSize: 13 }} placeholder="Max" />
                </div>
              </div>
            </div>

            {/* Clear filters */}
            <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => { setType(""); setBhk(""); setFurnishing(""); setMinPrice(500); setMaxPrice(100000); }} className="btn btn-ghost" style={{ fontSize: 13, color: "#4b5675" }}>
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Map view */}
        {view === "map" && (
          <div style={{ marginBottom: 20 }}>
            <PropertyMap
              properties={filtered.map((p) => ({ ...p, images: typeof p.images === "string" ? JSON.parse(p.images || "[]") : p.images }))}
              height="400px"
              onPropertyClick={(id) => window.location.href = `/properties/${id}`}
            />
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {[1, 2, 3, 4, 5, 6].map((n) => <div key={n} className="skeleton" style={{ height: 280, borderRadius: 14 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "white", borderRadius: 16, padding: 50, textAlign: "center", border: "1px solid #e3e7ef" }}>
            <div style={{ fontSize: 50, marginBottom: 12 }}>🏚️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No properties found</h3>
            <p style={{ color: "#4b5675", marginBottom: 18 }}>Try widening filters, or chat with Ria.</p>
            <button onClick={() => { setLocationQuery(""); setType(""); setBhk(""); setFurnishing(""); setMinPrice(500); setMaxPrice(100000); }} className="btn btn-secondary">Clear all filters</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={{ ...p, images: JSON.stringify(p.images) }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="hero-gradient" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="skeleton" style={{ width: 200, height: 20, borderRadius: 10 }} /></div>}>
      <Navbar />
      <Content />
      <Footer />
      <AIChat />
    </Suspense>
  );
}
