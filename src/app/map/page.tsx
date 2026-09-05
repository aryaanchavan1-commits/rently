"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import AIChat from "@/components/AIChat";
import { useLang } from "@/lib/lang-context";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: 500, background: "#f0f2f7", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e3e7ef" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🗺️</div>
        <div style={{ fontSize: 14, color: "#4b5675" }}>Loading map…</div>
      </div>
    </div>
  ),
});

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
  const [locationQuery, setLocationQuery] = useState("");
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [mapKey, setMapKey] = useState(0);

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

  const uniqueCities = useMemo(() => [...new Set(properties.map((p) => p.city))].sort(), [properties]);

  const filtered = useMemo(() => {
    if (!locationQuery.trim()) return properties;
    const q = locationQuery.toLowerCase();
    return properties.filter((p) => p.city.toLowerCase().includes(q) || p.area.toLowerCase().includes(q));
  }, [properties, locationQuery]);

  const selectedProperty = selectedId ? properties.find((p) => p.id === selectedId) : null;

  // Compute map center based on filtered properties or user location
  const mapCenter = useMemo((): [number, number] => {
    if (userCoords) return userCoords;
    if (filtered.length > 0) {
      const withCoords = filtered.filter((p) => p.lat && p.lng);
      if (withCoords.length > 0) {
        const avgLat = withCoords.reduce((s, p) => s + p.lat, 0) / withCoords.length;
        const avgLng = withCoords.reduce((s, p) => s + p.lng, 0) / withCoords.length;
        return [avgLat, avgLng];
      }
    }
    return [18.5204, 73.8567]; // Pune default
  }, [filtered, userCoords]);

  const handleLocationFound = useCallback((lat: number, lng: number) => {
    setUserCoords([lat, lng]);
  }, []);

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
              {t("Click markers to see property details, or use your live location", "मालमत्तेचे तपशील पहण्यासाठी मार्कर दाबा, किंवा तुमचे लाइव्ह स्थान वापरा", "प्रॉपर्टी विवरण देखने के लिए मार्कर पर क्लिक करें, या अपना लाइव लोकेशन उपयोग करें")}
            </p>
          </div>

          {/* Location search + city chips + live location */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: "1 1 200px" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none", zIndex: 1 }}>📍</span>
                <input
                  className="input"
                  placeholder={t("Search any city or area…", "कोणतेही शहर शोधा…", "कोई भी शहर खोजें…")}
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  style={{ paddingLeft: 36 }}
                />
              </div>
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setUserCoords([pos.coords.latitude, pos.coords.longitude]);
                        setLocationQuery("");
                        setMapKey((k) => k + 1);
                      },
                      () => {},
                      { enableHighAccuracy: true, timeout: 10000 }
                    );
                  }
                }}
                className="btn btn-primary"
                style={{ padding: "10px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
              >
                📍 {t("My Location", "माझे स्थान", "मेरा स्थान")}
              </button>
              <button onClick={() => { setLocationQuery(""); setUserCoords(null); setMapKey((k) => k + 1); }} className={`btn ${!locationQuery && !userCoords ? "btn-secondary" : "btn-outline"}`} style={{ padding: "8px 14px" }}>
                {t("All", "सर्व", "सभी")}
              </button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {uniqueCities.map((c) => (
                <button key={c} onClick={() => { setLocationQuery(c); setUserCoords(null); setMapKey((k) => k + 1); }} className={`btn ${locationQuery === c ? "btn-secondary" : "btn-outline"}`} style={{ padding: "6px 12px", fontSize: 12 }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="skeleton" style={{ height: 500, borderRadius: 16 }} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: selectedId ? "1fr 340px" : "1fr", gap: 20, alignItems: "start" }} className="map-layout">
              <div>
                <PropertyMap
                  key={mapKey}
                  properties={filtered.map((p) => ({ ...p, images: p.images }))}
                  center={mapCenter}
                  zoom={userCoords ? 13 : 7}
                  height="500px"
                  onPropertyClick={(id) => setSelectedId(id)}
                  showUserLocation={!userCoords}
                  onLocationSelect={handleLocationFound}
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
