"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyMap from "@/components/PropertyMap";
import PropertyCard from "@/components/PropertyCard";
import AIChat from "@/components/AIChat";
import { useLang } from "@/lib/lang-context";

interface Prop {
  id: string; title: string; type: string; price: number;
  address: string; area: string; city: string; lat: number; lng: number;
  bedrooms: number; images: string[]; isFeatured: boolean;
  bathrooms: number; furnishing: string; isVerified: boolean;
}

export default function MapPage() {
  const { lang } = useLang();
  const [properties, setProperties] = useState<Prop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [city, setCity] = useState("");

  const t = (en: string, mr: string, hi: string) => lang === "mr" ? mr : lang === "hi" ? hi : en;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();
        setProperties(Array.isArray(data) ? data : []);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = city ? properties.filter((p) => p.city === city) : properties;
  const selectedProperty = selectedId ? properties.find((p) => p.id === selectedId) : null;

  return (
    <div className="app">
      <Navbar />
      <main style={{ padding: "24px 0 60px", background: "#f7f8fc", minHeight: "calc(100vh - 66px)" }}>
        <div className="container-app">
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0b1437" }}>
              🗺️ {t("Explore on Map", "नकाशावर शोधा", "नक्शे पर खोजें")}
            </h1>
            <p style={{ fontSize: 14, color: "#4b5675", marginTop: 4 }}>
              {t("Click markers to see property details", "मालमत्तेचे तपशील पहण्यासाठी मार्कर दाबा", "प्रॉपर्टी विवरण देखने के लिए मार्कर पर क्लिक करें")}
            </p>
          </div>

          {/* City filter */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <button onClick={() => setCity("")} className={`btn ${!city ? "btn-secondary" : "btn-outline"}`} style={{ padding: "8px 14px", fontSize: 13 }}>
              {t("All", "सर्व", "सभी")}
            </button>
            {["Mumbai", "Pune", "Thane", "Navi Mumbai", "Nagpur", "Nashik"].map((c) => (
              <button key={c} onClick={() => setCity(c)} className={`btn ${city === c ? "btn-secondary" : "btn-outline"}`} style={{ padding: "8px 14px", fontSize: 13 }}>
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="skeleton" style={{ height: 500, borderRadius: 16 }} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: selectedId ? "1fr 340px" : "1fr", gap: 20, alignItems: "start" }} className="map-layout">
              <div>
                <PropertyMap
                  properties={filtered.map((p) => ({ ...p, images: p.images }))}
                  height="500px"
                  onPropertyClick={(id) => setSelectedId(id)}
                />
              </div>

              {selectedId && selectedProperty && (
                <div className="fade-in" style={{ position: "sticky", top: 80 }}>
                  <div style={{ background: "white", borderRadius: 16, border: "1px solid #e3e7ef", overflow: "hidden" }}>
                    {selectedProperty.images[0] && (
                      <img src={selectedProperty.images[0]} alt="" style={{ width: "100%", height: 180, objectFit: "cover" }} />
                    )}
                    <div style={{ padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0b1437", flex: 1 }}>{selectedProperty.title}</h3>
                        <button onClick={() => setSelectedId(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#4b5675" }}>✕</button>
                      </div>
                      <p style={{ fontSize: 13, color: "#4b5675", marginTop: 4 }}>📍 {selectedProperty.area}, {selectedProperty.city}</p>
                      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, color: "#4b5675" }}>{selectedProperty.bedrooms}BHK</span>
                        <span style={{ fontSize: 12, color: "#4b5675" }}>·</span>
                        <span style={{ fontSize: 12, color: "#4b5675", textTransform: "capitalize" }}>{selectedProperty.furnishing}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 14, borderTop: "1px solid #f0f2f7" }}>
                        <span style={{ fontSize: 20, fontWeight: 800, color: "#ff6a3d" }}>₹{selectedProperty.price.toLocaleString("en-IN")}<span style={{ fontSize: 12, fontWeight: 500, color: "#4b5675" }}>/mo</span></span>
                        <a href={`/properties/${selectedProperty.id}`} className="btn btn-primary" style={{ fontSize: 13, padding: "8px 16px" }}>
                          {t("View Details", "तपशील पहा", "विवरण देखें")} →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Property list below map */}
          {!loading && filtered.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0b1437", marginBottom: 14 }}>
                {t("All Properties", "सर्व मालमत्ता", "सभी प्रॉपर्टी")} ({filtered.length})
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {filtered.map((p) => (
                  <PropertyCard key={p.id} property={{ ...p, images: JSON.stringify(p.images) }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIChat />
      <style>{`
        @media (max-width: 900px) {
          .map-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
