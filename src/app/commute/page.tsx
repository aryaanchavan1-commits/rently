"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import { useLang } from "@/lib/lang-context";

interface CommuteResult {
  id: string; title: string; price: number; type: string; area: string; city: string;
  bedrooms: number; bathrooms: number; furnishing: string; images: string[];
  amenities: string[]; isVerified: boolean; maintenance: number; parking: number;
  commute: { duration: number; distance: number; mode: string; destination: string };
}

const QUICK_DESTINATIONS = [
  { label: "🏫 Pune University", value: "pune university" },
  { label: "🏫 Shivaji University", value: "shivaji university" },
  { label: "💼 Hinjewadi IT Park", value: "hinjewadi" },
  { label: "🏫 IIT Bombay", value: "iit bombay" },
  { label: "🏫 COEP", value: "coep" },
  { label: "🏫 VIT Pune", value: "vit pune" },
  { label: "🚇 Thane Station", value: "thane station" },
  { label: "🚇 Vashi", value: "vashi" },
  { label: "🏙️ Nagpur City", value: "nagpur" },
  { label: "🏙️ Nashik City", value: "nashik" },
  { label: "🏙️ Kolhapur", value: "kolhapur" },
  { label: "🏙️ Aurangabad", value: "aurangabad" },
  { label: "🏙️ Solapur", value: "solapur" },
  { label: "🏙️ Nanded", value: "nanded" },
  { label: "🏢 Dadar", value: "dadar" },
  { label: "🏢 Bandra", value: "bandra" },
];

export default function CommutePage() {
  const { lang } = useLang();
  const [destination, setDestination] = useState("");
  const [maxMinutes, setMaxMinutes] = useState(30);
  const [results, setResults] = useState<CommuteResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchedDest, setSearchedDest] = useState("");

  const t = (en: string, mr: string, hi: string) => lang === "mr" ? mr : lang === "hi" ? hi : en;

  async function handleSearch(dest?: string) {
    const d = dest || destination;
    if (!d.trim()) return;
    setLoading(true);
    setSearched(true);
    setSearchedDest(d);
    try {
      const res = await fetch("/api/commute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: d, maxMinutes }),
      });
      const data = await res.json();
      setResults(data.success ? data.results : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Navbar />
      <main style={{ padding: "24px 0 60px", background: "#f7f8fc", minHeight: "calc(100vh - 66px)" }}>
        <div className="container-app">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0b1437" }}>
              🚗 {t("Commute Search", "प्रवास शोध", "यात्रा खोज")}
            </h1>
            <p style={{ fontSize: 15, color: "#4b5675", marginTop: 6, maxWidth: 500, margin: "6px auto 0" }}>
              {t(
                "Type any destination across Maharashtra. We'll find properties within your commute time.",
                "महाराष्ट्रातील कोणतेही गंतव्य टाइप करा. आम्ही तुमच्या प्रवास वेळेत मालमत्ता शोधू.",
                "महाराष्ट्र में कोई भी गंतव्य टाइप करें। हम आपके कम्यूट समय में प्रॉपर्टी खोजेंगे।"
              )}
            </p>
          </div>

          <div style={{ background: "white", borderRadius: 18, padding: 28, border: "1px solid #e3e7ef", maxWidth: 600, margin: "0 auto 28px" }}>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">{t("Where do you need to go?", "तुम्हाला कुठे जावे लागते?", "आपको कहाँ जाना है?")}</label>
              <input
                className="input"
                placeholder={t("Type any location — city, office, university…", "कोणतेही ठिकाण टाइप करा — शहर, कार्यालय, विद्यापीठ…", "कोई भी स्थान टाइप करें — शहर, कार्यालय, विश्वविद्यालय…")}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">
                {t("Max commute time", "जास्तीत जास्त प्रवास वेळ", "अधिकतम यात्रा समय")}: {maxMinutes} {t("min", "मिनिटे", "मिनट")}
              </label>
              <input
                type="range" min="10" max="90" step="5" value={maxMinutes}
                onChange={(e) => setMaxMinutes(Number(e.target.value))}
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4b5675" }}>
                <span>10 {t("min", "मिनिटे", "मिनट")}</span>
                <span>90 {t("min", "मिनिटे", "मिनट")}</span>
              </div>
            </div>
            <button onClick={() => handleSearch()} className="btn btn-primary" style={{ width: "100%", padding: "13px" }} disabled={loading || !destination.trim()}>
              {loading ? t("Searching…", "शोधत आहे…", "खोज रहे हैं…") : `🚗 ${t("Find Properties", "मालमत्ता शोधा", "प्रॉपर्टी खोजें")}`}
            </button>
          </div>

          {!searched && (
            <div style={{ maxWidth: 600, margin: "0 auto 28px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#4b5675", marginBottom: 10 }}>
                {t("Popular destinations across Maharashtra", "महाराष्ट्रातील लोकप्रिय गंतव्ये", "महाराष्ट्र में लोकप्रिय गंतव्य")}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {QUICK_DESTINATIONS.map((d) => (
                  <button key={d.value} onClick={() => { setDestination(d.label.replace(/[^\w\s]/g, "").trim()); handleSearch(d.value); }}
                    style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid #e3e7ef", background: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {searched && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0b1437" }}>
                  {loading ? t("Searching…", "शोधत आहे…", "खोज रहे हैं…") :
                    results.length === 0
                      ? t("No properties found", "मालमत्ता सापडली नाही", "कोई प्रॉपर्टी नहीं मिली")
                      : `${results.length} ${t("properties within", "मालमत्या", "प्रॉपर्टी")} ${maxMinutes} ${t("min of", "मिनिटांमध्ये", "मिनट में")} ${searchedDest}`}
                </h2>
                <button onClick={() => { setSearched(false); setResults([]); }} className="btn btn-outline" style={{ fontSize: 13 }}>
                  {t("New Search", "नवीन शोध", "नई खोज")}
                </button>
              </div>

              {loading ? (
                <div style={{ display: "grid", gap: 14 }}>
                  {[1, 2, 3].map((n) => <div key={n} className="skeleton" style={{ height: 120, borderRadius: 14 }} />)}
                </div>
              ) : results.length === 0 ? (
                <div style={{ background: "white", borderRadius: 16, padding: 50, textAlign: "center", border: "1px solid #e3e7ef" }}>
                  <div style={{ fontSize: 50, marginBottom: 12 }}>🚗</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                    {t("No properties in this commute range", "या प्रवास वेळेत मालमत्ता नाही", "इस यात्रा सीमा में कोई प्रॉपर्टी नहीं")}
                  </h3>
                  <p style={{ color: "#4b5675", marginBottom: 16 }}>
                    {t("Try increasing the time or choosing a different destination.", "वेळ वाढवा किंवा भिन्न गंतव्य निवडा.", "समय बढ़ाएं या अलग गंतव्य चुनें।")}
                  </p>
                  <button onClick={() => setMaxMinutes(60)} className="btn btn-secondary">{t("Try 60 min", "60 मिनिट वापरा", "60 मिनट आज़माएं")}</button>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {results.map((p) => (
                    <Link key={p.id} href={`/properties/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div className="fade-in" style={{
                        display: "flex", gap: 16, padding: 16, borderRadius: 14,
                        background: "white", border: "1px solid #e3e7ef",
                        transition: "all 0.15s", cursor: "pointer",
                      }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
                      >
                        <div style={{ width: 120, height: 90, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#f0f2f7" }}>
                          <img src={p.images[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#0b1437" }}>{p.title}</div>
                          <div style={{ fontSize: 13, color: "#4b5675", marginTop: 2 }}>{p.area}, {p.city} · {p.bedrooms > 0 ? `${p.bedrooms}BHK` : p.type}</div>
                          <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                            <span style={{ fontSize: 16, fontWeight: 800, color: "#ff6a3d" }}>₹{p.price.toLocaleString("en-IN")}</span>
                            <span style={{ fontSize: 12, color: "#4b5675" }}>/mo</span>
                          </div>
                        </div>
                        {p.commute.duration > 0 && (
                          <div style={{
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            padding: "8px 14px", borderRadius: 12,
                            background: p.commute.duration <= 15 ? "rgba(16,185,129,0.1)" : p.commute.duration <= 30 ? "rgba(13,110,253,0.1)" : "rgba(245,158,11,0.1)",
                            flexShrink: 0, minWidth: 80,
                          }}>
                            <div style={{
                              fontSize: 22, fontWeight: 900,
                              color: p.commute.duration <= 15 ? "#10b981" : p.commute.duration <= 30 ? "#0d6efd" : "#f59e0b",
                            }}>
                              {p.commute.duration}
                            </div>
                            <div style={{ fontSize: 11, color: "#4b5675", fontWeight: 600 }}>
                              {t("min", "मिनिटे", "मिनट")} 🚗
                            </div>
                            <div style={{ fontSize: 10, color: "#9ca3af" }}>{p.commute.distance} km</div>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIChat />
    </div>
  );
}
