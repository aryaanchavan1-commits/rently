"use client";

import { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { apiUrl } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import AIChat from "@/components/AIChat";

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "independent-house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "pg", label: "PG / Hostel" },
  { value: "room", label: "Room" },
  { value: "office", label: "Office" },
];
const BHK_OPTIONS = [
  { value: "", label: "Any" },
  { value: "0", label: "Studio" },
  { value: "1", label: "1 BHK" },
  { value: "2", label: "2 BHK" },
  { value: "3", label: "3 BHK" },
  { value: "4", label: "4+ BHK" },
];
const FURNISHING_OPTIONS = [
  { value: "", label: "Any" },
  { value: "fully", label: "Fully Furnished" },
  { value: "semi", label: "Semi Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];
const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "views", label: "Most Viewed" },
  { value: "area_desc", label: "Largest Area" },
];
const PRICE_PRESETS = [
  { min: 0, max: 5000, label: "Under 5K" },
  { min: 5000, max: 10000, label: "5K-10K" },
  { min: 10000, max: 20000, label: "10K-20K" },
  { min: 20000, max: 35000, label: "20K-35K" },
  { min: 35000, max: 50000, label: "35K-50K" },
  { min: 50000, max: 999999, label: "50K+" },
];
const AMENITY_OPTIONS = ["WiFi", "AC", "Parking", "Gym", "Pool", "Security", "Lift", "Garden", "Meals", "CCTV"];

interface PropType {
  id: string; title: string; type: string; price: number; deposit: number;
  area: string; city: string; bedrooms: number; bathrooms: number;
  furnishing: string; images: string; isVerified: boolean; isFeatured: boolean;
  createdAt: string; address: string; lat: number; lng: number;
  amenities: string[]; views: number; status: string;
}

function Content() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get("city") || searchParams.get("location") || "";

  const [query, setQuery] = useState(initialCity);
  const [type, setType] = useState("");
  const [bhk, setBhk] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(999999);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sort, setSort] = useState("recommended");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [view, setView] = useState<"grid" | "list" | "map">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [pricePreset, setPricePreset] = useState<string>("");
  const [allProperties, setAllProperties] = useState<PropType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/api/properties"))
      .then(r => r.json())
      .then(d => { setAllProperties(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const applyPricePreset = useCallback((preset: typeof PRICE_PRESETS[0], label: string) => {
    setMinPrice(preset.min);
    setMaxPrice(preset.max);
    setPricePreset(label);
  }, []);

  const toggleAmenity = useCallback((a: string) => {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }, []);

  const clearAll = useCallback(() => {
    setQuery(""); setType(""); setBhk(""); setFurnishing("");
    setMinPrice(0); setMaxPrice(999999); setAmenities([]);
    setSort("recommended"); setVerifiedOnly(false); setPricePreset("");
  }, []);

  const filtered = useMemo(() => {
    let r = allProperties.filter(p => p.status === "active");

    if (query) {
      const q = query.toLowerCase();
      r = r.filter(p =>
        p.city.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q)
      );
    }
    if (type) r = r.filter(p => p.type === type);
    if (bhk) {
      const b = Number(bhk);
      r = bhk === "4" ? r.filter(p => p.bedrooms >= 4) : r.filter(p => p.bedrooms === b);
    }
    if (furnishing) r = r.filter(p => p.furnishing === furnishing);
    if (verifiedOnly) r = r.filter(p => p.isVerified);
    if (amenities.length > 0) r = r.filter(p => amenities.every(a => p.amenities?.includes(a)));
    r = r.filter(p => p.price >= minPrice && p.price <= maxPrice);

    switch (sort) {
      case "price_asc": r.sort((a, b) => a.price - b.price); break;
      case "price_desc": r.sort((a, b) => b.price - a.price); break;
      case "newest": r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "views": r.sort((a, b) => (b.views || 0) - (a.views || 0)); break;
      case "area_desc": r.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: r.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || (b.views || 0) - (a.views || 0));
    }
    return r;
  }, [allProperties, query, type, bhk, furnishing, minPrice, maxPrice, amenities, sort, verifiedOnly]);

  const uniqueCities = useMemo(() => [...new Set(allProperties.map(p => p.city))].sort(), [allProperties]);
  const activeFilterCount = [type, bhk, furnishing, verifiedOnly, minPrice > 0, maxPrice < 999999, amenities.length > 0].filter(Boolean).length;

  return (
    <div className="page-cream">
      <div className="container-app" style={{ paddingTop: 20, paddingBottom: 60 }}>
        {/* Header */}
        <div className="search-header">
          <div>
            <h1 className="text-royal" style={{ fontSize: 22, fontWeight: 800 }}>
              {query ? `Rentals in ${query}` : "Browse Maharashtra Rentals"}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
              {filtered.length} properties found
            </p>
          </div>
          <div className="search-view-toggle">
            <button onClick={() => setView("grid")} className={`btn btn-sm ${view === "grid" ? "btn-primary" : "btn-outline"}`}>Grid</button>
            <button onClick={() => setView("list")} className={`btn btn-sm ${view === "list" ? "btn-primary" : "btn-outline"}`}>List</button>
            <button onClick={() => setView("map")} className={`btn btn-sm ${view === "map" ? "btn-primary" : "btn-outline"}`}>Map</button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar-row">
          <div className="search-input-wrap">
            <svg className="search-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
            <input
              className="input search-input"
              placeholder="Search city, area, or locality..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <select className="input search-sort" value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)} className="btn btn-outline search-filter-btn">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M3 4h18M6 9h12M9 14h6M11 19h2" /></svg>
            Filters
            {activeFilterCount > 0 && <span className="badge badge-primary" style={{ marginLeft: 4 }}>{activeFilterCount}</span>}
          </button>
        </div>

        {/* Price Preset Chips */}
        <div className="price-chips">
          {PRICE_PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => pricePreset === p.label ? (setMinPrice(0), setMaxPrice(999999), setPricePreset("")) : applyPricePreset(p, p.label)}
              className={`price-chip ${pricePreset === p.label ? "active" : ""}`}
            >{p.label}</button>
          ))}
        </div>

        {/* City Chips */}
        {!query && (
          <div className="city-chips">
            <button onClick={() => setQuery("")} className={`city-chip ${!query ? "active" : ""}`}>All Maharashtra</button>
            {uniqueCities.slice(0, 10).map(c => (
              <button key={c} onClick={() => setQuery(c)} className="city-chip">{c}</button>
            ))}
          </div>
        )}

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="filters-panel animate-scale-in">
            <div className="filters-grid">
              {/* BHK */}
              <div className="filter-group">
                <label className="form-label">BHK</label>
                <div className="filter-chips">
                  {BHK_OPTIONS.map(b => (
                    <button key={b.value} onClick={() => setBhk(bhk === b.value ? "" : b.value)}
                      className={`filter-chip ${bhk === b.value ? "active" : ""}`}>{b.label}</button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div className="filter-group">
                <label className="form-label">Property Type</label>
                <div className="filter-chips">
                  {TYPE_OPTIONS.map(t => (
                    <button key={t.value} onClick={() => setType(type === t.value ? "" : t.value)}
                      className={`filter-chip ${type === t.value ? "active" : ""}`}>{t.label}</button>
                  ))}
                </div>
              </div>

              {/* Furnishing */}
              <div className="filter-group">
                <label className="form-label">Furnishing</label>
                <div className="filter-chips">
                  {FURNISHING_OPTIONS.map(f => (
                    <button key={f.value} onClick={() => setFurnishing(furnishing === f.value ? "" : f.value)}
                      className={`filter-chip ${furnishing === f.value ? "active" : ""}`}>{f.label}</button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="filter-group">
                <label className="form-label">Budget Range</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="number" className="input" value={minPrice || ""} onChange={e => setMinPrice(Number(e.target.value) || 0)} placeholder="Min" style={{ flex: 1 }} />
                  <span style={{ color: "var(--text-muted)" }}>-</span>
                  <input type="number" className="input" value={maxPrice === 999999 ? "" : maxPrice} onChange={e => setMaxPrice(Number(e.target.value) || 999999)} placeholder="Max" style={{ flex: 1 }} />
                </div>
              </div>

              {/* Amenities */}
              <div className="filter-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Amenities</label>
                <div className="filter-chips">
                  {AMENITY_OPTIONS.map(a => (
                    <button key={a} onClick={() => toggleAmenity(a)}
                      className={`filter-chip ${amenities.includes(a) ? "active" : ""}`}>{a}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Verified Toggle + Clear */}
            <div className="filters-footer">
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: "var(--primary)" }} />
                Verified owners only
              </label>
              <button onClick={clearAll} className="btn btn-ghost btn-sm">Clear all filters</button>
            </div>
          </div>
        )}

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="active-tags">
            {type && <span className="active-tag">{TYPE_OPTIONS.find(t => t.value === type)?.label} <button onClick={() => setType("")}>x</button></span>}
            {bhk && <span className="active-tag">{bhk === "0" ? "Studio" : `${bhk} BHK`} <button onClick={() => setBhk("")}>x</button></span>}
            {furnishing && <span className="active-tag">{FURNISHING_OPTIONS.find(f => f.value === furnishing)?.label} <button onClick={() => setFurnishing("")}>x</button></span>}
            {verifiedOnly && <span className="active-tag">Verified <button onClick={() => setVerifiedOnly(false)}>x</button></span>}
            {amenities.map(a => <span key={a} className="active-tag">{a} <button onClick={() => toggleAmenity(a)}>x</button></span>)}
            {(minPrice > 0 || maxPrice < 999999) && <span className="active-tag">Budget: {minPrice > 0 ? `₹${minPrice.toLocaleString("en-IN")}` : "0"} - {maxPrice < 999999 ? `₹${maxPrice.toLocaleString("en-IN")}` : "Any"} <button onClick={() => { setMinPrice(0); setMaxPrice(999999); setPricePreset(""); }}>x</button></span>}
          </div>
        )}

        {/* Map View */}
        {view === "map" && (
          <div style={{ marginBottom: 20 }}>
            <PropertyMap
              properties={filtered.map(p => ({ ...p, images: typeof p.images === "string" ? JSON.parse(p.images || "[]") : p.images }))}
              height="400px"
              onPropertyClick={id => window.location.href = `/properties/${id}`}
            />
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="properties-grid">
            {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="skeleton" style={{ height: 280, borderRadius: 14 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            </div>
            <h3>No properties found</h3>
            <p>Try adjusting your filters or search a different area</p>
            <button onClick={clearAll} className="btn btn-primary">Clear all filters</button>
          </div>
        ) : view === "list" ? (
          <div className="properties-list">
            {filtered.map(p => (
              <a key={p.id} href={`/properties/${p.id}`} className="property-list-item">
                <div className="property-list-img">
                  {(() => { const imgs = typeof p.images === "string" ? JSON.parse(p.images || "[]") : p.images; return imgs[0] ? <img src={imgs[0]} alt="" /> : <div className="property-list-placeholder">R</div>; })()}
                </div>
                <div className="property-list-body">
                  <div className="property-list-top">
                    <div>
                      <div className="property-list-title">{p.title}</div>
                      <div className="property-list-location">{p.area}, {p.city}</div>
                    </div>
                    <div className="property-list-price">₹{p.price.toLocaleString("en-IN")}<span>/mo</span></div>
                  </div>
                  <div className="property-list-meta">
                    {p.bedrooms > 0 && <span>{p.bedrooms} BHK</span>}
                    <span>{p.bathrooms} Bath</span>
                    <span>{p.furnishing === "fully" ? "Fully Furnished" : p.furnishing === "semi" ? "Semi Furnished" : "Unfurnished"}</span>
                    {p.isVerified && <span className="badge badge-success" style={{ fontSize: 10 }}>Verified</span>}
                    <span>{p.views || 0} views</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="properties-grid">
            {filtered.map(p => (
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
