"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import AIChat from "@/components/AIChat";

const TABS = [
  { key: "rent", label: "भाडे / Rent", icon: "🏠" },
  { key: "buy", label: "खरेदी / Buy", icon: "🔑" },
  { key: "pg", label: "पीजी / PG & Co-living", icon: "🏨" },
];

const BUDGETS = [
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { label: "₹20,000 – ₹50,000", min: 20000, max: 50000 },
  { label: "₹50,000+", min: 50000, max: 100000 },
];

const POPULAR_AREAS = [
  { name: "Baner, Pune", avg: "₹22K", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400", count: 45 },
  { name: "Andheri West, Mumbai", avg: "₹35K", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", count: 32 },
  { name: "Vashi, Navi Mumbai", avg: "₹28K", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", count: 28 },
  { name: "Kothrud, Pune", avg: "₹18K", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400", count: 38 },
  { name: "Thane West", avg: "₹25K", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400", count: 22 },
  { name: "Hinjewadi, Pune", avg: "₹20K", img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400", count: 55 },
];

const GUIDES = [
  { title: "भाड्यासाठी फ्लॅट कशी शोधायची", en: "How to Find a Rental Flat", desc: "Step-by-step guide for first-time renters in Maharashtra", icon: "📋" },
  { title: "भाडे करार: आवश्यक बाबी", en: "Rent Agreement Essentials", desc: "What to check before signing a rental agreement", icon: "📝" },
  { title: "सुरक्षा भांडवल: कायदेशीर हक्क", en: "Security Deposit: Legal Rights", desc: "Maharashtra deposit rules and how to protect yourself", icon: "🔒" },
  { title: "पोलीस प्रमाणीकरण", en: "Police Verification Guide", desc: "Complete process for tenant verification in Maharashtra", icon: "👮" },
];

const NEWS = [
  { title: "Mumbai-Pune Missing Link opens — real estate re-rating expected", date: "May 2026", tag: "Market" },
  { title: "Maharashtra offers incentives for rental housing in MMR", date: "Nov 2025", tag: "Policy" },
  { title: "Model Tenancy Act: Deposit cap at 2 months rent", date: "2025", tag: "Legal" },
  { title: "New metro lines to boost Pune rental demand", date: "2026", tag: "Infrastructure" },
];

const TRUST_STATS = [
  { n: "1,200+", label: "Verified Owners" },
  { n: "30+", label: "Maharashtra Cities" },
  { n: "₹0", label: "Brokerage" },
  { n: "4.8★", label: "User Rating" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("rent");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <Navbar />

      {/* Hero with search tabs */}
      <section style={{ background: "linear-gradient(135deg, #0b1437 0%, #1a237e 50%, #0d47a1 100%)", padding: "50px 0 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(255,106,61,0.15) 0%, transparent 50%)" }} />
        <div className="container-app" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", borderRadius: 999, padding: "6px 16px", fontSize: 13, color: "rgba(255,255,255,0.9)", marginBottom: 16, backdropFilter: "blur(10px)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4caf50" }} />
              Maharashtra&apos;s most trusted rental platform
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, color: "white", lineHeight: 1.1, letterSpacing: -1 }}>
              घर शोधा, <span style={{ color: "#ff6a3d" }}>ब्रोकरशिवाय</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", marginTop: 12, maxWidth: 600, margin: "12px auto 0", lineHeight: 1.6 }}>
              Find your perfect home across <strong>30+ cities in Maharashtra</strong>. Zero brokerage. Direct owners. AI-powered search.
            </p>
          </div>

          {/* Search Box with Tabs */}
          <div style={{ background: "white", borderRadius: "20px 20px 0 0", maxWidth: 900, margin: "0 auto", boxShadow: "0 -10px 40px rgba(0,0,0,0.15)" }}>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #e3e7ef" }}>
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flex: 1, padding: "14px 16px", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
                    background: activeTab === tab.key ? "white" : "#f7f8fc",
                    color: activeTab === tab.key ? "#0d6efd" : "#4b5675",
                    borderBottom: activeTab === tab.key ? "3px solid #0d6efd" : "3px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Search form */}
            <div style={{ padding: 20 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "#9ca3af" }}>🔍</span>
                  <input
                    className="input"
                    placeholder="Search by locality, landmark, or society name…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: 44, height: 50, fontSize: 15, borderRadius: 12, border: "2px solid #e3e7ef" }}
                  />
                </div>
                <Link
                  href={searchQuery ? `/properties?city=${encodeURIComponent(searchQuery)}` : "/properties"}
                  style={{ padding: "0 28px", height: 50, borderRadius: 12, background: "linear-gradient(135deg, #0d6efd, #0a58ca)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, textDecoration: "none", whiteSpace: "nowrap" }}
                >
                  Search
                </Link>
              </div>

              {/* Quick filters */}
              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "#4b5675", fontWeight: 600, padding: "6px 0" }}>Budget:</span>
                {BUDGETS.map((b) => (
                  <Link key={b.label} href={`/properties?budget_min=${b.min}&budget_max=${b.max}`} style={{ padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "#f4f6fb", color: "#4b5675", border: "1px solid #e3e7ef", textDecoration: "none", whiteSpace: "nowrap" }}>
                    {b.label}
                  </Link>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "#4b5675", fontWeight: 600, padding: "6px 0" }}>BHK:</span>
                {["1 BHK", "2 BHK", "3 BHK", "4+ BHK", "Studio"].map((b) => (
                  <Link key={b} href={`/properties?bedrooms=${b.charAt(0) === "S" ? "0" : b.charAt(0)}`} style={{ padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "#f4f6fb", color: "#4b5675", border: "1px solid #e3e7ef", textDecoration: "none" }}>
                    {b}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Trust stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 50, padding: "30px 0 40px", flexWrap: "wrap" }}>
            {TRUST_STATS.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "white" }}>{s.n}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Areas */}
      <section style={{ padding: "50px 0" }}>
        <div className="container-app">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: "#ff6a3d", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, marginBottom: 4 }}>Popular Areas</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0b1437" }}>लोकप्रिय भाग / Trending Localities</h2>
            </div>
            <Link href="/properties" style={{ fontSize: 14, fontWeight: 700, color: "#0d6efd", textDecoration: "none" }}>View all →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {POPULAR_AREAS.map((area) => (
              <Link key={area.name} href={`/properties?city=${encodeURIComponent(area.name.split(",")[0])}`} style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: 200, display: "block", textDecoration: "none" }}>
                <img src={area.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, color: "white" }}>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{area.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                    <span style={{ fontSize: 13, opacity: 0.9 }}>Avg. rent {area.avg}/mo</span>
                    <span style={{ fontSize: 12, background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 999, backdropFilter: "blur(4px)" }}>{area.count} properties</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section style={{ padding: "50px 0", background: "#f7f8fc" }}>
        <div className="container-app">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: "#ff6a3d", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, marginBottom: 4 }}>Featured</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0b1437" }}>विशेष निवड / Hand-picked Homes</h2>
              <p style={{ fontSize: 14, color: "#4b5675", marginTop: 4 }}>Verified owner properties, curated for quality and value.</p>
            </div>
            <Link href="/properties" style={{ fontSize: 14, fontWeight: 700, color: "#0d6efd", textDecoration: "none" }}>View all →</Link>
          </div>
          <FeaturedGrid />
        </div>
      </section>

      {/* Guides */}
      <section style={{ padding: "50px 0" }}>
        <div className="container-app">
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ fontSize: 12, color: "#ff6a3d", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, marginBottom: 4 }}>Resources</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0b1437" }}>मार्गदर्शक / Renter&apos;s Guide</h2>
            <p style={{ fontSize: 14, color: "#4b5675", marginTop: 6 }}>Everything you need to know about renting in Maharashtra</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {GUIDES.map((g) => (
              <div key={g.en} style={{ background: "white", borderRadius: 16, padding: 22, border: "1px solid #e3e7ef", cursor: "pointer" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{g.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0b1437", marginBottom: 4 }}>{g.title}</h3>
                <p style={{ fontSize: 13, color: "#4b5675", lineHeight: 1.5 }}>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section style={{ padding: "50px 0", background: "#f7f8fc" }}>
        <div className="container-app">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: "#ff6a3d", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, marginBottom: 4 }}>News</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0b1437" }}>बातम्या / Latest Updates</h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {NEWS.map((n) => (
              <div key={n.title} style={{ background: "white", borderRadius: 14, padding: 18, border: "1px solid #e3e7ef" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: "#e8f5e9", color: "#2e7d32" }}>{n.tag}</span>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>{n.date}</span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0b1437", lineHeight: 1.4 }}>{n.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner CTA */}
      <section style={{ padding: "50px 0" }}>
        <div className="container-app">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }} className="values-grid">
            <div>
              <div style={{ fontSize: 12, color: "#ff6a3d", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, marginBottom: 6 }}>For Owners</div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0b1437", marginBottom: 10 }}>मालकांसाठी / List Your Property</h2>
              <p style={{ color: "#4b5675", fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>Reach thousands of verified tenants in Maharashtra. Pay just ₹49/week. Cancel anytime.</p>
              <div style={{ display: "grid", gap: 14, marginBottom: 24 }}>
                {[
                  { icon: "🪙", title: "Save 95% vs brokers", desc: "Skip 1-2 month brokerage fees. Pay just ₹49/week." },
                  { icon: "✅", title: "Verified tenants", desc: "Every tenant is phone-verified. Police verification supported." },
                  { icon: "📊", title: "Owner dashboard", desc: "Track views, inquiries, and manage listings from one place." },
                ].map((v) => (
                  <div key={v.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(13,110,253,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{v.icon}</div>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0b1437", marginBottom: 2 }}>{v.title}</h4>
                      <p style={{ fontSize: 13, color: "#4b5675", margin: 0, lineHeight: 1.5 }}>{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard" className="btn btn-primary" style={{ padding: "12px 24px", fontSize: 15 }}>Start listing for ₹49/week →</Link>
            </div>
            <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1px solid #e3e7ef", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
              <div style={{ background: "#f4f6fb", borderRadius: 14, padding: 18, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#4b5675" }}>Monthly Rent</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#0b1437" }}>₹25,000</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#4b5675" }}>Security Deposit</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#0b1437" }}>₹50,000</span>
                </div>
                <div style={{ borderTop: "1px solid #d3d8e1", paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#4b5675" }}>True Monthly Cost</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#ff6a3d" }}>₹28,500</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#10b981" }}>✓</div>
                  <div style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>Verified</div>
                </div>
                <div style={{ flex: 1, background: "#f0f7ff", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0d6efd" }}>👤</div>
                  <div style={{ fontSize: 11, color: "#0d6efd", fontWeight: 600 }}>Direct Owner</div>
                </div>
                <div style={{ flex: 1, background: "#fff7ed", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#ff6a3d" }}>₹0</div>
                  <div style={{ fontSize: 11, color: "#ff6a3d", fontWeight: 600 }}>Brokerage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 900px) { .values-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "50px 0", background: "linear-gradient(135deg, #0b1437, #1a237e)" }}>
        <div className="container-app" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 10 }}>Ready to find your next home?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 24 }}>Join thousands of happy tenants and owners across Maharashtra.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/properties" className="btn" style={{ background: "white", color: "#0b1437", padding: "12px 24px", fontSize: 15 }}>Start searching</Link>
            <Link href="/auth/signup" className="btn" style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.4)", padding: "12px 24px", fontSize: 15 }}>Create free account</Link>
          </div>
        </div>
      </section>

      <Footer />
      <AIChat />
    </div>
  );
}

function FeaturedGrid() {
  const [properties, setProperties] = useState<Array<{id:string;title:string;type:string;price:number;area:string;city:string;bedrooms:number;bathrooms:number;furnishing:string;images:string;isVerified:boolean;isFeatured:boolean;createdAt:string;address:string}>>([]);
  const [loading, setLoading] = useState(true);

  if (typeof window !== "undefined" && loading) {
    fetch("/api/properties").then(r => r.json()).then(d => { setProperties(Array.isArray(d) ? d.slice(0, 6) : []); setLoading(false); }).catch(() => setLoading(false));
  }

  if (loading) {
    return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>{[1,2,3,4,5,6].map(n => <div key={n} className="skeleton" style={{ height: 280, borderRadius: 14 }} />)}</div>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
      {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
    </div>
  );
}
