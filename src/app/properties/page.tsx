"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import AIChat from "@/components/AIChat";
import { useLang } from "@/lib/lang-context";

type P = {
  id: string; title: string; type: string; price: number;
  address: string; area: string; city: string; bedrooms: number;
  bathrooms: number; furnishing: string; images: string[];
  isVerified: boolean; isFeatured: boolean; amenities?: string[];
};

const cityList = ["Mumbai", "Pune", "Thane", "Navi Mumbai", "Nagpur", "Nashik"];
const typeList = ["apartment", "house", "room", "pg", "office"];
const sortList = ["recommended", "price_asc", "price_desc", "newest"];

function Content() {
  const searchParams = useSearchParams();
  const { lang } = useLang();
  const [allProperties, setAllProperties] = useState<P[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState<P[]>([]);
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sort, setSort] = useState("recommended");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      setAllProperties(Array.isArray(data) ? data : []);
    } catch {
      setAllProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  useEffect(() => {
    let r = [...allProperties];
    if (city) r = r.filter((p) => p.city === city);
    if (type) r = r.filter((p) => p.type === type);
    r = r.filter((p) => p.price <= maxPrice);
    if (sort === "price_asc") r.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") r.sort((a, b) => b.price - a.price);
    else if (sort === "newest") r.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    setFiltered(r);
  }, [city, type, maxPrice, sort, allProperties]);

  const t = (en: string, mr: string, hi: string) => {
    if (lang === "mr") return mr;
    if (lang === "hi") return hi;
    return en;
  };

  return (
    <div style={{ padding: "30px 0 60px", background: "#f7f8fc", minHeight: "calc(100vh - 66px)" }}>
      <div className="container-app">
        <div style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0b1437" }}>
            {city
              ? t("Rentals in " + city, city + " मध्ये भाडे", city + " में किराया")
              : t("Browse Maharashtra rentals", "महाराष्ट्र भाडे शोधा", "महाराष्ट्र किराया खोजें")}
          </h1>
          <p style={{ color: "#4b5675", fontSize: 14, marginTop: 4 }}>
            {filtered.length} {t("properties found", "मालमत्ता सापडल्या", "प्रॉपर्टी मिलीं")}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          <button onClick={() => setCity("")} className={`btn ${!city ? "btn-secondary" : "btn-outline"}`} style={{ padding: "8px 14px" }}>
            {t("All Maharashtra", "संपूर्ण महाराष्ट्र", "पूरा महाराष्ट्र")}
          </button>
          {cityList.map((c) => (
            <button key={c} onClick={() => setCity(c)} className={`btn ${city === c ? "btn-secondary" : "btn-outline"}`} style={{ padding: "8px 14px" }}>{c}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18, alignItems: "center" }}>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)} style={{ width: 160 }}>
            <option value="">{t("Any type", "कोणताही प्रकार", "कोई भी प्रकार")}</option>
            {typeList.map((tp) => (
              <option key={tp} value={tp}>{tp.charAt(0).toUpperCase() + tp.slice(1)}</option>
            ))}
          </select>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 180 }}>
            {sortList.map((s) => (
              <option key={s} value={s}>
                {s === "recommended" ? t("Recommended", "शिफारस केलेले", "अनुशंसित")
                  : s === "price_asc" ? t("Price: Low → High", "किंमत: कमी → जास्त", "कीमत: कम → ज्यादा")
                  : s === "price_desc" ? t("Price: High → Low", "किंमत: जास्त → कमी", "कीमत: ज्यादा → कम")
                  : t("Newest First", "नवीन प्रथम", "नवीनतम पहले")}
              </option>
            ))}
          </select>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input type="range" min="5000" max="100000" step="1000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: "100%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4b5675" }}>
              <span>₹5,000</span>
              <span>{t("Max", "जास्तीत जास्त", "अधिकतम")}: ₹{maxPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginTop: 22 }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="skeleton" style={{ height: 280, borderRadius: 14 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "white", borderRadius: 16, padding: 50, textAlign: "center", border: "1px solid #e3e7ef", marginTop: 20 }}>
            <div style={{ fontSize: 50, marginBottom: 12 }}>🏚️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              {t("No properties found", "मालमत्ता सापडली नाही", "कोई प्रॉपर्टी नहीं मिली")}
            </h3>
            <p style={{ color: "#4b5675", marginBottom: 18 }}>
              {t("Try widening your filters, or chat with Ria for suggestions.", "फिल्टर विस्तारा, किंवा Ria शी चॅट करा.", "अपने फ़िल्टर बढ़ाएं, या Ria से बात करें।")}
            </p>
            <button onClick={() => { setCity(""); setType(""); setMaxPrice(100000); }} className="btn btn-secondary">
              {t("Clear all filters", "सर्व फिल्टर साफ करा", "सभी फ़िल्टर साफ़ करें")}
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginTop: 22 }}>
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
