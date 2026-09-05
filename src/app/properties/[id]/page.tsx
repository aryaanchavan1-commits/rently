"use client";

import { use, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";

const data: Record<string, any> = {
  "1": { title: "Spacious 2BHK with Modern Amenities", type: "apartment", price: 22000, deposit: 44000, address: "15, Sunshine Apartments, Andheri West, Mumbai - 400053", area: "Andheri West", city: "Mumbai", bedrooms: 2, bathrooms: 2, furnishing: "semi", availableFrom: "2026-09-15", images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "Parking", "AC", "Gym", "Pool", "Security", "Power Backup", "Lift"], rules: "No smoking. Rent payable by 5th of each month.", isVerified: true, owner: { name: "Rajesh Sharma", phone: "+91 98765 43210", verified: true, listings: 12, id: "owner-1" } },
  "2": { title: "Cozy 1BHK Near Metro Station", type: "apartment", price: 12000, deposit: 24000, address: "22, Green Valley Society, Kothrud, Pune - 411038", area: "Kothrud", city: "Pune", bedrooms: 1, bathrooms: 1, furnishing: "furnished", availableFrom: "2026-09-10", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "AC", "Security", "Lift"], rules: "Rent due by 5th. No smoking.", isVerified: true, owner: { name: "Priya Patil", phone: "+91 98765 43211", verified: true, listings: 8, id: "owner-2" } },
  "3": { title: "Premium 3BHK with Garden View", type: "house", price: 35000, deposit: 70000, address: "8, Rose Garden Lane, Baner, Pune - 411045", area: "Baner", city: "Pune", bedrooms: 3, bathrooms: 3, furnishing: "furnished", availableFrom: "2026-10-01", images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"], amenities: ["WiFi", "Parking", "AC", "Gym", "Pool", "Security", "Garden"], rules: "Family preferred. 1 month notice.", isVerified: true, owner: { name: "Suresh Deshmukh", phone: "+91 98765 43212", verified: true, listings: 15, id: "owner-3" } },
};

export default function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const p = data[id] || data["1"];

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

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
          propertyTitle: p.title,
          tenantName: form.name,
          tenantEmail: form.email,
          tenantPhone: form.phone,
          tenantMessage: form.message,
          ownerName: p.owner.name,
          ownerPhone: p.owner.phone,
          ownerId: p.owner.id,
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

  return (
    <div>
      <Navbar />
      <div style={{ padding: "30px 0 60px", background: "#f7f8fc", minHeight: "calc(100vh - 66px)" }}>
        <div className="container-app">
          <Link href="/properties" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "#4b5675", marginBottom: 20 }}>← Back to all properties</Link>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 30 }} className="detail-grid">
            <div>
              <div style={{ borderRadius: 18, overflow: "hidden", background: "#f0f2f7" }}>
                <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: 420, objectFit: "cover" }} />
              </div>
              {p.images.length > 1 && (
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  {p.images.slice(1).map((img: string, i: number) => (
                    <img key={i} src={img} alt="" style={{ width: 100, height: 80, objectFit: "cover", borderRadius: 10 }} />
                  ))}
                </div>
              )}

              <div style={{ background: "white", borderRadius: 18, padding: 24, border: "1px solid #e3e7ef", marginTop: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  {p.isVerified && <span className="badge badge-success">✓ Verified</span>}
                  <span className="badge badge-primary">{p.type}</span>
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0b1437", marginBottom: 8 }}>{p.title}</h1>
                <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>📍 {p.address}</p>

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
                  This beautiful {p.bedrooms}BHK {p.type} is located in {p.area}, {p.city}. It features {p.furnishing === "fully" ? "full" : p.furnishing === "semi" ? "semi" : "no"} furnishing with modern amenities. Perfect for comfortable living in a prime location.
                </p>

                <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0b1437", marginBottom: 12 }}>Amenities</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
                  {p.amenities.map((a: string) => (
                    <div key={a} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#f4f6fb", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
                      <span style={{ color: "#10b981" }}>✓</span> {a}
                    </div>
                  ))}
                </div>

                <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0b1437", marginBottom: 10 }}>House Rules</h2>
                <p style={{ fontSize: 14, color: "#4b5675", lineHeight: 1.7 }}>{p.rules}</p>
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
                <p style={{ fontSize: 13, color: "#4b5675", margin: "4px 0 16px" }}>Deposit: ₹{p.deposit.toLocaleString("en-IN")} · Available: {p.availableFrom}</p>

                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "#f4f6fb", borderRadius: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#0d6efd,#0a58ca)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>{p.owner.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0b1437" }}>{p.owner.name} {p.owner.verified && <span className="badge badge-success" style={{ fontSize: 10 }}>✓</span>}</div>
                    <div style={{ fontSize: 12, color: "#4b5675" }}>{p.owner.listings} listings · Direct contact</div>
                  </div>
                </div>
              </div>

              {/* Inquiry Form */}
              <div style={{ background: "white", borderRadius: 18, padding: 24, border: "1px solid #e3e7ef" }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0b1437", marginBottom: 4 }}>Contact Owner</h3>
                <p style={{ fontSize: 13, color: "#4b5675", marginBottom: 16 }}>Send your details directly to {p.owner.name}. No brokerage.</p>

                {sent ? (
                  <div style={{ textAlign: "center", padding: 30, background: "#f0fdf4", borderRadius: 14, border: "1px solid #bbf7d0" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#047857", marginBottom: 6 }}>Inquiry Sent!</h3>
                    <p style={{ fontSize: 14, color: "#047857", marginBottom: 16 }}>{p.owner.name} will respond shortly. Check your inbox for updates.</p>
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
                    <p style={{ fontSize: 11, color: "#4b5675", textAlign: "center" }}>Your info goes directly to the owner. Zero brokerage.</p>
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
