"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import AIChat from "@/components/AIChat";
import PropertyCard from "@/components/PropertyCard";

const featured = [
  { id: "1", title: "Spacious 2BHK with Modern Amenities", type: "apartment", price: 22000, address: "Andheri West, Mumbai", area: "Andheri West", city: "Mumbai", bedrooms: 2, bathrooms: 2, furnishing: "semi", images: JSON.stringify(["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]), isVerified: true, isFeatured: true },
  { id: "2", title: "Cozy 1BHK Near Metro Station", type: "apartment", price: 12000, address: "Kothrud, Pune", area: "Kothrud", city: "Pune", bedrooms: 1, bathrooms: 1, furnishing: "furnished", images: JSON.stringify(["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]), isVerified: true, isFeatured: false },
  { id: "3", title: "Premium 3BHK with Garden View", type: "house", price: 35000, address: "Baner, Pune", area: "Baner", city: "Pune", bedrooms: 3, bathrooms: 3, furnishing: "furnished", images: JSON.stringify(["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]), isVerified: true, isFeatured: true },
  { id: "4", title: "Furnished Room in Shared Flat", type: "room", price: 6500, address: "Hinjewadi, Pune", area: "Hinjewadi", city: "Pune", bedrooms: 1, bathrooms: 1, furnishing: "furnished", images: JSON.stringify(["https://images.unsplash.com/photo-1598928506311-c55ez637a513?w=800"]), isVerified: false, isFeatured: false },
  { id: "5", title: "Independent House with Parking", type: "house", price: 18000, address: "Thane West", area: "Thane West", city: "Thane", bedrooms: 2, bathrooms: 2, furnishing: "unfurnished", images: JSON.stringify(["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"]), isVerified: true, isFeatured: false },
  { id: "6", title: "Luxury 2BHK with Pool Access", type: "apartment", price: 28000, address: "Powai, Mumbai", area: "Powai", city: "Mumbai", bedrooms: 2, bathrooms: 2, furnishing: "fully", images: JSON.stringify(["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"]), isVerified: true, isFeatured: true },
];

const cities = [
  { name: "Mumbai", desc: "The city of dreams. Find apartments, flats & PGs across Andheri, Bandra, Powai & more.", rent1: "₹15,000", rent2: "₹25,000" },
  { name: "Pune", desc: "IT hub of Maharashtra. 1BHK, 2BHK & PGs in Hinjewadi, Baner, Kothrud & Wakad.", rent1: "₹10,000", rent2: "₹18,000" },
  { name: "Thane", desc: "Affordable living near Mumbai. Family apartments in Ghodbunder, Manpada & Vashi.", rent1: "₹12,000", rent2: "₹20,000" },
  { name: "Navi Mumbai", desc: "Planned city with modern amenities. Flats in Vashi, Kharghar & Panvel.", rent1: "₹11,000", rent2: "₹19,000" },
  { name: "Nagpur", desc: "Orange city of Maharashtra. Budget-friendly rentals in Dharampeth & Sitabuldi.", rent1: "₹7,000", rent2: "₹14,000" },
  { name: "Nashik", desc: "Wine capital with pleasant climate. 1BHK & 2BHK in College Road & CIDCO.", rent1: "₹8,000", rent2: "₹15,000" },
];

export default function HomePage() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient" style={{ padding: "60px 0 40px", position: "relative", overflow: "hidden" }}>
        <div className="container-app" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 50, alignItems: "center" }} className="hero-grid">
            <div className="fade-in">
              <div className="badge badge-warn" style={{ marginBottom: 16, display: "inline-flex" }}>
                🇮🇳 Built for Maharashtra
              </div>
              <h1 style={{ fontSize: "clamp(2.1rem, 5vw, 3.4rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: -1, color: "#0b1437" }}>
                Find your next home, <span className="mark">without the broker</span>
              </h1>
              <p style={{ fontSize: 17, color: "#4b5675", marginTop: 16, lineHeight: 1.6, maxWidth: 540 }}>
                Rently connects you directly with verified owners across <strong>Pune, Mumbai, Thane, Navi Mumbai, Nagpur & Nashik</strong>. Zero brokerage. AI-powered search. List your property for just ₹49/week.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
                <Link href="/properties" className="btn btn-primary" style={{ padding: "12px 22px", fontSize: 15 }}>🔍 Search Rentals</Link>
                <Link href="/dashboard" className="btn btn-outline" style={{ padding: "12px 22px", fontSize: 15 }}>List your property →</Link>
              </div>
              <div style={{ display: "flex", gap: 26, marginTop: 30, flexWrap: "wrap" }}>
                <Stat n="10,000+" label="Active listings" />
                <Stat n="₹49" label="Weekly owner plan" />
                <Stat n="0%" label="Brokerage" />
                <Stat n="6" label="Maharashtra cities" />
              </div>
            </div>

            <div className="hero-art" style={{ position: "relative", height: 420 }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: "100%", height: "100%", borderRadius: 24, background: "linear-gradient(135deg,#0d6efd 0%,#0a58ca 60%,#ff6a3d 100%)", boxShadow: "0 30px 70px rgba(11,20,55,0.25)", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.25) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: 30, left: 30, right: 30, background: "rgba(255,255,255,0.95)", borderRadius: 16, padding: 18, backdropFilter: "blur(10px)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#ff6a3d,#f94234)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 }}>🤖</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>Ria — AI Assistant</div>
                      <div style={{ fontSize: 12, color: "#4b5675" }}>Ask me for any property</div>
                    </div>
                  </div>
                  <div style={{ background: "#0d6efd", color: "white", padding: "8px 12px", borderRadius: 10, fontSize: 13, marginBottom: 8 }}>2BHK in Kharadi under 25k</div>
                  <div style={{ background: "#f4f6fb", color: "#0b1437", padding: "8px 12px", borderRadius: 10, fontSize: 12, lineHeight: 1.5 }}>Found <strong>3 great matches</strong> in Kharadi. Top pick: 2BHK with pool & gym, ₹24,000/mo.</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 40 }}><SearchBar variant="hero" /></div>
        </div>
      </section>

      {/* Cities */}
      <section style={{ padding: "50px 0 10px" }}>
        <div className="container-app">
          <SectionHeader eyebrow="Explore Maharashtra" title="Pick your city" subtitle="Handpicked rentals across the most loved cities in the state." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 22 }}>
            {cities.map((c) => (
              <Link key={c.name} href={`/properties?city=${c.name}`} className="property-card" style={{ background: "white", borderRadius: 16, padding: 22, border: "1px solid #e3e7ef", display: "block" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#0d6efd,#0a58ca)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>{c.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#4b5675" }}>Maharashtra</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#4b5675", lineHeight: 1.5, margin: 0, minHeight: 60 }}>{c.desc}</p>
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                  <span className="badge badge-primary">1BHK {c.rent1}</span>
                  <span className="badge badge-success">2BHK {c.rent2}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section style={{ padding: "50px 0 10px" }}>
        <div className="container-app">
          <SectionHeader eyebrow="Featured listings" title="Top picks this week" subtitle="Verified owner properties, hand-curated for quality and value." action={<Link href="/properties" className="btn btn-outline">View all →</Link>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginTop: 22 }}>
            {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "50px 0 10px" }}>
        <div className="container-app">
          <SectionHeader eyebrow="For owners" title="List your property in 3 easy steps" subtitle="Reach thousands of verified tenants in Maharashtra. Cancel anytime." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 22 }}>
            <OwnerStep step="1" title="Sign up free" desc="Create your owner account in under 60 seconds. No credit card required." />
            <OwnerStep step="2" title="Activate ₹49/week" desc="Pay just ₹49 per week — cheaper than a single broker visit. 100% digital." />
            <OwnerStep step="3" title="Add & manage listings" desc="Post unlimited photos, rent, amenities, and chat directly with interested tenants." />
            <OwnerStep step="4" title="Zero brokerage" desc="Tenants contact you directly. Save ₹20K–40K in typical broker fees." />
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/pricing" className="btn btn-primary" style={{ padding: "12px 26px", fontSize: 15 }}>Start listing for ₹49/week →</Link>
          </div>
        </div>
      </section>

      {/* Why Rently */}
      <section style={{ padding: "50px 0 10px" }}>
        <div className="container-app">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }} className="values-grid">
            <div>
              <div style={{ fontSize: 12, color: "#ff6a3d", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, marginBottom: 6 }}>Why Rently</div>
              <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "#0b1437", letterSpacing: -0.5, marginBottom: 14 }}>The smarter way to rent in Maharashtra</h2>
              <p style={{ color: "#4b5675", fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>We built Rently to give tenants and owners a faster, fairer alternative to traditional brokers.</p>
              <div style={{ display: "grid", gap: 14 }}>
                <Value icon="🪙" title="Save 95% vs brokers" desc="Skip the 1–2 month brokerage. Owners pay just ₹49/week." />
                <Value icon="🤖" title="AI assistant Ria" desc="Talk in plain English — '2BHK in Hinjewadi under 25k' — and Ria finds matching homes." />
                <Value icon="✅" title="Verified owners" desc="Every listing owner is phone-verified. Police-verified tenant reports supported." />
                <Value icon="📍" title="Hyperlocal across 6 cities" desc="From Powai to Kharghar, Wakad to Dharampeth — we cover what others don't." />
              </div>
            </div>
            <div style={{ position: "relative", padding: 18, background: "white", borderRadius: 24, border: "1px solid #e3e7ef", boxShadow: "0 14px 40px rgba(11,20,55,0.08)" }}>
              <div style={{ position: "absolute", top: -22, right: 22, background: "linear-gradient(135deg,#ff6a3d,#f94234)", color: "white", padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: 800, boxShadow: "0 8px 20px rgba(255,106,61,0.4)" }}>Ria is live 24/7</div>
              <div style={{ background: "#f4f6fb", borderRadius: 14, padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: "#4b5675", marginBottom: 8 }}>You · just now</div>
                <div style={{ background: "#0d6efd", color: "white", padding: "10px 14px", borderRadius: 12, fontSize: 14, maxWidth: "80%", marginLeft: "auto", borderBottomRightRadius: 4 }}>Find me a 2BHK in Baner with parking, under ₹35,000</div>
              </div>
              <div style={{ background: "#f4f6fb", borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 12, color: "#4b5675", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0d6efd" }} />Ria · AI assistant
                </div>
                <div style={{ background: "white", padding: "12px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.6, border: "1px solid #e3e7ef", borderBottomLeftRadius: 4 }}>
                  Found <strong style={{ color: "#0d6efd" }}>3 great matches</strong> in Pune for 2BHK family rentals under ₹35,000 with parking:<br /><br />
                  • <strong>Baner</strong> — 2BHK, 1,050 sqft, semi-furnished, ₹32K<br />
                  • <strong>Wakad</strong> — 2BHK with garden, ₹26K<br />
                  <br />Tap a listing or refine: <em>"only ready-to-move"</em>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 900px) { .values-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 0" }}>
        <div className="container-app">
          <div style={{ borderRadius: 24, padding: "50px 40px", background: "linear-gradient(135deg,#0b1437 0%,#1c2a5e 60%,#ff6a3d 130%)", color: "white", textAlign: "center" }} className="cta-block">
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, marginBottom: 12 }}>Ready to find your next home in Maharashtra?</h2>
            <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 600, margin: "0 auto 24px", lineHeight: 1.6 }}>Join thousands of happy tenants and owners using Rently. No broker. No spam. Just real homes.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/properties" className="btn" style={{ background: "white", color: "#0b1437", padding: "12px 24px", fontSize: 15 }}>Start searching</Link>
              <Link href="/auth/signup" className="btn" style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.4)", padding: "12px 24px", fontSize: 15 }}>Create free account</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AIChat />

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-art { display: none !important; }
        }
        @media (max-width: 600px) {
          .cta-block { padding: 32px 22px !important; }
        }
      `}</style>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#0b1437", lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 13, color: "#4b5675", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
      <div>
        <div style={{ fontSize: 12, color: "#ff6a3d", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, marginBottom: 6 }}>{eyebrow}</div>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#0b1437", letterSpacing: -0.5 }}>{title}</h2>
        {subtitle && <p style={{ color: "#4b5675", fontSize: 15, marginTop: 6, maxWidth: 600 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function OwnerStep({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 22, border: "1px solid #e3e7ef", position: "relative" }}>
      <div style={{ position: "absolute", top: 18, right: 18, width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#0d6efd,#0a58ca)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>{step}</div>
      <div style={{ fontSize: 12, color: "#ff6a3d", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Step</div>
      <h3 style={{ fontSize: 17, fontWeight: 800, margin: "4px 0 8px" }}>{title}</h3>
      <p style={{ fontSize: 14, color: "#4b5675", lineHeight: 1.5, margin: 0 }}>{desc}</p>
    </div>
  );
}

function Value({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(13,110,253,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div>
        <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0b1437", marginBottom: 4 }}>{title}</h4>
        <p style={{ fontSize: 14, color: "#4b5675", margin: 0, lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  );
}
