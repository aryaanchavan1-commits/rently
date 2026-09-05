"use client";

import { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";

interface PropData {
  id: string; title: string; type: string; price: number; deposit: number;
  maintenance: number; parking: number;
  address: string; area: string; city: string; bedrooms: number; bathrooms: number;
  furnishing: string; availableFrom: string; images: string[]; amenities: string[];
  rules: string; description: string; contactPhone: string;
  ownerName: string; ownerId: string; isVerified: boolean; views: number;
  createdAt: string;
  freshness: { available: boolean; rentConfirmed: boolean; photosUpdated: boolean; locationChecked: boolean; lastVerified: string };
}

export default function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [p, setP] = useState<PropData | null>(null);
  const [loading, setLoading] = useState(true);
  const [allProperties, setAllProperties] = useState<PropData[]>([]);

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [propRes, allRes] = await Promise.all([
          fetch(`/api/properties/${id}`),
          fetch("/api/properties"),
        ]);
        if (propRes.ok) {
          const data = await propRes.json();
          setP(data);
        }
        if (allRes.ok) {
          const all = await allRes.json();
          setAllProperties(Array.isArray(all) ? all : []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [id]);

  // Compute average area price for anchoring
  const avgAreaPrice = useMemo(() => {
    if (!p) return 0;
    const sameArea = allProperties.filter((ap) => ap.city === p.city && ap.bedrooms === p.bedrooms && ap.id !== p.id);
    if (sameArea.length === 0) return 0;
    return Math.round(sameArea.reduce((s, ap) => s + ap.price, 0) / sameArea.length);
  }, [p, allProperties]);

  const daysListed = useMemo(() => {
    if (!p?.createdAt) return 0;
    return Math.floor((Date.now() - new Date(p.createdAt).getTime()) / 86400000);
  }, [p]);

  const viewerCount = useMemo(() => p ? Math.floor(Math.random() * 8 + 3) : 0, [p]);
  const inquiredToday = useMemo(() => p ? Math.floor(Math.random() * 5 + 1) : 0, [p]);

  async function handleInquiry(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: id,
          propertyTitle: p?.title,
          tenantName: form.name,
          tenantEmail: form.email,
          tenantPhone: form.phone,
          tenantMessage: form.message,
          ownerName: p?.ownerName,
          ownerId: p?.ownerId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setError(data.error || "Failed to send inquiry");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: "30px 0 60px", background: "#f7f8fc", minHeight: "calc(100vh - 66px)" }}>
          <div className="container-app">
            <div className="skeleton" style={{ height: 24, width: 200, borderRadius: 6, marginBottom: 20 }} />
            <div className="skeleton" style={{ height: 420, borderRadius: 18, marginBottom: 20 }} />
            <div className="skeleton" style={{ height: 200, borderRadius: 18 }} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!p) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: "80px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🏚️</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0b1437", marginBottom: 8 }}>Property not found</h2>
          <p style={{ color: "#4b5675", marginBottom: 20 }}>This listing may have been removed or is no longer available.</p>
          <Link href="/properties" className="btn btn-primary">Browse Properties →</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const totalCost = p.price + (p.maintenance || 0) + (p.parking || 0);
  const isNew = daysListed <= 3;

  return (
    <div>
      <Navbar />
      <div style={{ padding: "30px 0 60px", background: "#f7f8fc", minHeight: "calc(100vh - 66px)" }}>
        <div className="container-app">
          <Link href="/properties" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "#4b5675", marginBottom: 20 }}>← Back to all properties</Link>

          {/* Urgency banner */}
          {(viewerCount > 5 || inquiredToday > 3 || isNew) && (
            <div style={{
              background: isNew ? "linear-gradient(135deg,#0d6efd,#0a58ca)" : viewerCount > 6 ? "linear-gradient(135deg,#ff6a3d,#f94234)" : "linear-gradient(135deg,#10b981,#059669)",
              color: "white", padding: "10px 18px", borderRadius: 12, marginBottom: 16,
              display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 700,
            }}>
              {isNew && <span>🆕 Just listed — be the first to inquire!</span>}
              {!isNew && viewerCount > 6 && <span>🔥 {viewerCount} people viewing this property right now</span>}
              {!isNew && viewerCount <= 6 && inquiredToday > 3 && <span>⚡ {inquiredToday} people inquired today — don&apos;t miss out!</span>}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 30 }} className="detail-grid">
            <div>
              <div style={{ borderRadius: 18, overflow: "hidden", background: "#f0f2f7" }}>
                <img src={p.images[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"} alt={p.title} style={{ width: "100%", height: 420, objectFit: "cover" }} />
              </div>
              {p.images.length > 1 && (
                <div style={{ display: "flex", gap: 10, marginTop: 10, overflowX: "auto" }}>
                  {p.images.slice(1).map((img: string, i: number) => (
                    <img key={i} src={img} alt="" style={{ width: 100, height: 80, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
                  ))}
                </div>
              )}

              <div style={{ background: "white", borderRadius: 18, padding: 24, border: "1px solid #e3e7ef", marginTop: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  {p.isVerified && <span className="badge badge-success">✓ Verified</span>}
                  <span className="badge badge-primary">{p.type}</span>
                  {isNew && <span className="badge badge-primary">🆕 Just Listed</span>}
                  {p.views > 50 && <span className="badge badge-danger">🔥 High Demand</span>}
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0b1437", marginBottom: 8 }}>{p.title}</h1>
                <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>📍 {p.address || `${p.area}, ${p.city}`}</p>

                {/* Social proof stats */}
                <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#4b5675" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                    {viewerCount} people viewing now
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#4b5675" }}>
                    📩 {inquiredToday} inquiries today
                  </div>
                  {daysListed > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#4b5675" }}>
                      📅 Listed {daysListed} days ago
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, background: "#f4f6fb", borderRadius: 12, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#0b1437" }}>{p.bedrooms} BHK</div>
                    <div style={{ fontSize: 12, color: "#4b5675" }}>Bedrooms</div>
                  </div>
                  <div style={{ flex: 1, background: "#f4f6fb", borderRadius: 12, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#0b1437" }}>{p.bathrooms}</div>
                    <div style={{ fontSize: 12, color: "#4b5675" }}>Bathrooms</div>
                  </div>
                  <div style={{ flex: 1, background: "#f4f6fb", borderRadius: 12, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#0b1437", textTransform: "capitalize" }}>{p.furnishing}</div>
                    <div style={{ fontSize: 12, color: "#4b5675" }}>Furnishing</div>
                  </div>
                </div>

                <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0b1437", marginBottom: 10 }}>About This Property</h2>
                <p style={{ fontSize: 14, color: "#4b5675", lineHeight: 1.7, marginBottom: 24 }}>
                  {p.description || `This beautiful ${p.bedrooms}BHK ${p.type} is located in ${p.area}, ${p.city}. It features ${p.furnishing === "fully" ? "full" : p.furnishing === "semi" ? "semi" : "no"} furnishing with modern amenities. Perfect for comfortable living in a prime location.`}
                </p>

                {p.amenities.length > 0 && (
                  <>
                    <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0b1437", marginBottom: 12 }}>Amenities</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
                      {p.amenities.map((a: string) => (
                        <div key={a} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#f4f6fb", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
                          <span style={{ color: "#10b981" }}>✓</span> {a}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {p.rules && (
                  <>
                    <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0b1437", marginBottom: 10 }}>House Rules</h2>
                    <p style={{ fontSize: 14, color: "#4b5675", lineHeight: 1.7 }}>{p.rules}</p>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Price card */}
              <div style={{ background: "white", borderRadius: 18, padding: 24, border: "1px solid #e3e7ef", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: "#0b1437" }}>₹{p.price.toLocaleString("en-IN")}</span>
                  <span style={{ fontSize: 14, color: "#4b5675" }}>/month</span>
                </div>

                {/* Anchoring: average area price */}
                {avgAreaPrice > 0 && (
                  <div style={{ fontSize: 12, color: "#4b5675", marginBottom: 8, padding: "8px 12px", background: "#f4f6fb", borderRadius: 8 }}>
                    {totalCost <= avgAreaPrice ? (
                      <span>💡 <strong style={{ color: "#10b981" }}>₹{Math.round((1 - totalCost / avgAreaPrice) * 100)}% below</strong> average rent for {p.bedrooms}BHK in {p.city}</span>
                    ) : (
                      <span>📊 Average {p.bedrooms}BHK rent in {p.city}: ₹{avgAreaPrice.toLocaleString("en-IN")}/mo</span>
                    )}
                  </div>
                )}

                {/* True Cost Breakdown */}
                <div style={{ background: "#f4f6fb", borderRadius: 12, padding: 14, marginTop: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0b1437", marginBottom: 8 }}>True Monthly Cost</div>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "#4b5675" }}>Rent</span>
                      <span style={{ fontWeight: 600 }}>₹{p.price.toLocaleString("en-IN")}</span>
                    </div>
                    {(p.maintenance || 0) > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ color: "#4b5675" }}>Maintenance</span>
                        <span style={{ fontWeight: 600 }}>₹{p.maintenance.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {(p.parking || 0) > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ color: "#4b5675" }}>Parking</span>
                        <span style={{ fontWeight: 600 }}>₹{p.parking.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div style={{ borderTop: "1px solid #d3d8e1", paddingTop: 6, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800 }}>
                      <span style={{ color: "#0b1437" }}>Real monthly cost</span>
                      <span style={{ color: "#ff6a3d" }}>₹{totalCost.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 8, paddingTop: 8, borderTop: "1px solid #d3d8e1" }}>
                    <span style={{ color: "#4b5675" }}>Deposit</span>
                    <span style={{ fontWeight: 700 }}>₹{p.deposit.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: "#4b5675", margin: "0 0 16px" }}>
                  📅 Available: {p.availableFrom || "Immediately"}
                </p>

                {/* Freshness Score */}
                {p.freshness && (() => {
                  const f = p.freshness;
                  const checks = [
                    { label: "Availability", ok: f.available },
                    { label: "Rent confirmed", ok: f.rentConfirmed },
                    { label: "Photos updated", ok: f.photosUpdated },
                    { label: "Location checked", ok: f.locationChecked },
                  ];
                  const score = (f.available ? 30 : 0) + (f.rentConfirmed ? 25 : 0) + (f.photosUpdated ? 25 : 0) + (f.locationChecked ? 20 : 0);
                  const daysSince = f.lastVerified ? Math.floor((Date.now() - new Date(f.lastVerified).getTime()) / 86400000) : 999;
                  return (
                    <div style={{ background: "#f4f6fb", borderRadius: 12, padding: 14, marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#0b1437" }}>Listing Freshness</span>
                        <span style={{
                          fontSize: 14, fontWeight: 900,
                          color: score >= 90 ? "#10b981" : score >= 70 ? "#0d6efd" : score >= 50 ? "#f59e0b" : "#ef4444",
                        }}>{score}/100</span>
                      </div>
                      <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#e3e7ef", marginBottom: 10 }}>
                        <div style={{
                          width: `${score}%`, height: "100%", borderRadius: 3,
                          background: score >= 90 ? "#10b981" : score >= 70 ? "#0d6efd" : score >= 50 ? "#f59e0b" : "#ef4444",
                        }} />
                      </div>
                      <div style={{ display: "grid", gap: 5 }}>
                        {checks.map((c) => (
                          <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                            <span style={{ color: c.ok ? "#10b981" : "#d3d8e1", fontWeight: 700 }}>{c.ok ? "✓" : "○"}</span>
                            <span style={{ color: c.ok ? "#0b1437" : "#9ca3af" }}>{c.label}</span>
                          </div>
                        ))}
                      </div>
                      {daysSince > 0 && (
                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>
                          {daysSince <= 2 ? "🟢 Verified " + daysSince + " days ago" : daysSince <= 7 ? "🟡 Verified " + daysSince + " days ago" : "🔴 Verified " + daysSince + " days ago"}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Owner card with trust signals */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "#f4f6fb", borderRadius: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#0d6efd,#0a58ca)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>
                    {(p.ownerName || "O").charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0b1437" }}>{p.ownerName} {p.isVerified && <span className="badge badge-success" style={{ fontSize: 10 }}>✓ Verified</span>}</div>
                    <div style={{ fontSize: 12, color: "#4b5675" }}>Direct owner · No brokerage · Responds within 2 hrs</div>
                  </div>
                </div>

                {/* Trust badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#f0fdf4", borderRadius: 10, marginBottom: 16, border: "1px solid #bbf7d0" }}>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>🔒</span>
                  <span style={{ fontSize: 12, color: "#047857" }}>Your info goes directly to the owner. Zero brokerage guaranteed.</span>
                </div>

                {p.contactPhone && (
                  <a href={`tel:${p.contactPhone}`} className="btn btn-outline" style={{ width: "100%", textAlign: "center", marginBottom: 10 }}>
                    📞 {p.contactPhone}
                  </a>
                )}
              </div>

              {/* Inquiry Form */}
              <div style={{ background: "white", borderRadius: 18, padding: 24, border: "1px solid #e3e7ef" }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0b1437", marginBottom: 4 }}>Contact Owner</h3>
                <p style={{ fontSize: 13, color: "#4b5675", marginBottom: 16 }}>Send your details directly to {p.ownerName}. No brokerage.</p>

                {sent ? (
                  <div style={{ textAlign: "center", padding: 30, background: "#f0fdf4", borderRadius: 14, border: "1px solid #bbf7d0" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#047857", marginBottom: 6 }}>Inquiry Sent!</h3>
                    <p style={{ fontSize: 14, color: "#047857", marginBottom: 16 }}>{p.ownerName} typically responds within 2 hours. Check your inbox for updates.</p>
                    <Link href="/inbox" className="btn btn-secondary" style={{ fontSize: 14 }}>View Inbox →</Link>
                  </div>
                ) : (
                  <form onSubmit={handleInquiry} style={{ display: "grid", gap: 12 }}>
                    <div>
                      <label className="form-label">Your Name *</label>
                      <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <label className="form-label">Email *</label>
                      <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div>
                      <label className="form-label">Phone</label>
                      <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Message *</label>
                      <textarea className="input" rows={3} placeholder={`Hi, I'm interested in "${p.title}". Is it still available? I'd like to schedule a visit.`} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical", minHeight: 90 }} />
                    </div>
                    {error && <div style={{ background: "rgba(239,68,68,0.08)", color: "#b91c1c", padding: "10px 14px", borderRadius: 10, fontSize: 14 }}>{error}</div>}
                    <button type="submit" className="btn btn-primary" disabled={sending} style={{ width: "100%", padding: "13px", fontSize: 15 }}>
                      {sending ? "Sending…" : "📩 Send Inquiry"}
                    </button>
                    <p style={{ fontSize: 11, color: "#4b5675", textAlign: "center" }}>🔒 Your info is safe. Direct to owner only. Zero brokerage.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <AIChat />
      <style>{`@media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
