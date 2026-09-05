"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import AIChat from "@/components/AIChat";
import { useLang } from "@/lib/lang-context";

type P = {
  id: string; title: string; type: string; price: number;
  address: string; area: string; city: string; lat: number; lng: number;
  bedrooms: number; bathrooms: number; furnishing: string; images: string[];
  isVerified: boolean; isFeatured: boolean; amenities?: string[];
};

const typeList = ["apartment", "house", "room", "pg", "office"];
const sortList = ["recommended", "price_asc", "price_desc", "newest"];

function Content() {
  const searchParams = useSearchParams();
  const { lang } = useLang();
  const [allProperties, setAllProperties] = useState<P[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState<P[]>([]);
  const [locationQuery, setLocationQuery] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sort, setSort] = useState("recommended");
  const [view, setView] = useState<"grid" | "map">("grid");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      setAllProperties(Array.isArray(data) ? data : []);
    } catch { setAllProperties([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  useEffect(() => {
    let r = [...allProperties];
    if (locationQuery.trim()) {
      const q = locationQuery.toLowerCase();
      r = r.filter((p) => p.city.toLowerCase().includes(q) || p.area.toLowerCase().includes(q) || p.address.toLowerCase().includes(q));
    }
    if (type) r = r.filter((p) => p.type === type);
    r = r.filter((p) => p.price >= 500 && p.price <= maxPrice);
    if (sort === "price_asc") r.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") r.sort((a, b) => b.price - a.price);
    else if (sort === "newest") r.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    setFiltered(r);
  }, [locationQuery, type, maxPrice, sort, allProperties]);

  const t = (en: string, mr: string, hi: string) => lang === "mr" ? mr : lang === "hi" ? hi : en;

  const uniqueCities = [...new Set(allProperties.map((p) => p.city))].sort();

  return (
    <div style={{ padding: "24px 0 60px", background: "#f7f8fc", minHeight: "calc(100vh - 66px)" }}>
      <div className="container-app">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0b1437" }}>
              {locationQuery
                ? t("Rentals in " + locationQuery, locationQuery + " मध्ये भाडे", locationQuery + " में किराया")
                : t("Browse Maharashtra rentals", "महाराष्ट्र भाडे शोधा", "महाराष्ट्र किराया खोजें")}
            </h1>
            <p style={{ color: "#4b5675", fontSize: 14, marginTop: 4 }}>
              {filtered.length} {t("properties found", "मालमत्ता सापडल्या", "प्रॉपर्टी मिलीं")}
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setView("grid")} className={`btn ${view === "grid" ? "btn-secondary" : "btn-outline"}`} style={{ padding: "8px 14px", fontSize: 13 }}>
              🏠 {t("Grid", "ग्रिड", "ग्रिड")}
            </button>
            <Link href="/map" className="btn btn-outline" style={{ padding: "8px 14px", fontSize: 13, textDecoration: "none" }}>
              🗺️ {t("Full Map", "संपूर्ण नकाशा", "पूरा नक्शा")}
            </Link>
          </div>
        </div>

        {/* Inline Map */}
        {view === "map" && (
          <div style={{ marginBottom: 20 }}>
            <PropertyMap
              properties={filtered.map((p) => ({ ...p, images: p.images }))}
              height="400px"
              onPropertyClick={(id) => window.location.href = `/properties/${id}`}
            />
          </div>
        )}

        {/* Location Search + Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 250px" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none", zIndex: 1 }}>📍</span>
            <input
              className="input"
              placeholder={t("Search any city or area in Maharashtra…", "महाराष्ट्रातील कोणत्याही शहरात शोधा…", "महाराष्ट्र में कोई भी शहर खोजें…")}
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <button onClick={() => setLocationQuery("")} className={`btn ${!locationQuery ? "btn-secondary" : "btn-outline"}`} style={{ padding: "8px 14px" }}>
            {t("All Maharashtra", "संपूर्ण महाराष्ट्र", "पूरा महाराष्ट्र")}
          </button>
        </div>

        {/* Quick city chips from actual data */}
        {!locationQuery && uniqueCities.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {uniqueCities.map((c) => (
              <button key={c} onClick={() => setLocationQuery(c)} className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 12 }}>
                {c}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18, alignItems: "center" }}>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)} style={{ width: 160 }}>
            <option value="">{t("Any type", "कोणताही प्रकार", "कोई भी प्रकार")}</option>
            {typeList.map((tp) => <option key={tp} value={tp}>{tp.charAt(0).toUpperCase() + tp.slice(1)}</option>)}
          </select>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 180 }}>
            {sortList.map((s) => (
              <option key={s} value={s}>
                {s === "recommended" ? t("Recommended", "शिफारस", "अनुशंसित")
                  : s === "price_asc" ? t("Price: Low → High", "किंमत: कमी → जास्त", "कीमत: कम → ज्यादा")
                  : s === "price_desc" ? t("Price: High → Low", "किंमत: जास्त → कमी", "कीमत: ज्यादा → कम")
                  : t("Newest", "नवीन", "नवीनतम")}
              </option>
            ))}
          </select>
          <div style={{ flex: 1, minWidth: 180 }}>
            <input type="range" min="500" max="100000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: "100%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4b5675" }}>
              <span>₹500</span>
              <span>₹{maxPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {[1, 2, 3, 4, 5, 6].map((n) => <div key={n} className="skeleton" style={{ height: 280, borderRadius: 14 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "white", borderRadius: 16, padding: 50, textAlign: "center", border: "1px solid #e3e7ef" }}>
            <div style={{ fontSize: 50, marginBottom: 12 }}>🏚️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              {t("No properties found", "मालमत्ता सापडली नाही", "कोई प्रॉपर्टी नहीं मिली")}
            </h3>
            <p style={{ color: "#4b5675", marginBottom: 18 }}>
              {t("Try widening filters, or chat with Ria.", "फिल्टर विस्तारा, किंवा Ria शी चॅट करा.", "फ़िल्टर बढ़ाएं, या Ria से बात करें।")}
            </p>
            <button onClick={() => { setLocationQuery(""); setType(""); setMaxPrice(100000); }} className="btn btn-secondary">
              {t("Clear filters", "फिल्टर साफ करा", "फ़िल्टर साफ़ करें")}
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
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
