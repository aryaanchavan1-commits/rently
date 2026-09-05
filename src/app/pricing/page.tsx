"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";

export default function PricingPage() {
  return (
    <div>
      <Navbar />
      <div style={{ background: "#f7f8fc", padding: "50px 0 60px" }}>
        <div className="container-app">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 12, color: "#ff6a3d", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, marginBottom: 6 }}>Owner plans</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: -0.8, color: "#0b1437" }}>Simple pricing. Zero brokerage.</h1>
            <p style={{ color: "#4b5675", fontSize: 16, maxWidth: 600, margin: "8px auto 0" }}>Pay only when you list. Tenants contact you directly — no middleman.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 880, margin: "0 auto" }}>
            {/* Weekly */}
            <div style={{ background: "white", borderRadius: 20, padding: 32, border: "1px solid #e3e7ef" }}>
              <div style={{ fontSize: 13, color: "#ff6a3d", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Starter</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 50, fontWeight: 800, color: "#0b1437", letterSpacing: -1 }}>₹49</span>
                <span style={{ color: "#4b5675", fontSize: 14 }}>/week</span>
              </div>
              <p style={{ color: "#4b5675", fontSize: 14, marginBottom: 22 }}>Perfect for single property owners. Cancel anytime.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                {["Up to 3 active listings", "Direct tenant enquiries", "Verified owner badge", "Listed across 6 MH cities", "Photo gallery up to 8 images", "Mobile-friendly dashboard"].map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: 14, color: "#0b1437" }}>
                    <span style={{ color: "#10b981", fontWeight: 800, fontSize: 16 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="btn btn-outline" style={{ width: "100%", padding: "12px" }}>Start with ₹49/week</Link>
            </div>

            {/* Monthly - Popular */}
            <div style={{ background: "linear-gradient(135deg,#0b1437 0%,#1c2a5e 50%,#ff6a3d 130%)", color: "white", borderRadius: 20, padding: 32, border: "1px solid #0b1437", position: "relative", transform: "scale(1.02)", boxShadow: "0 24px 50px rgba(11,20,55,0.25)" }}>
              <div style={{ position: "absolute", top: -12, right: 22, background: "#ff6a3d", color: "white", padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Most popular</div>
              <div style={{ fontSize: 13, color: "#ff6a3d", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Pro Owner</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 50, fontWeight: 800, letterSpacing: -1 }}>₹149</span>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>/month</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, marginBottom: 22 }}>Save 47% vs weekly. Best for active landlords.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                {["Unlimited active listings", "Featured placement in search", "Priority tenant leads", "Photo gallery up to 16 images", "Advanced analytics dashboard", "Premium 'Verified Pro' badge", "WhatsApp enquiry button", "Auto-rent reminders"].map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: 14 }}>
                    <span style={{ color: "#10b981", fontWeight: 800, fontSize: 16 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="btn" style={{ background: "white", color: "#0b1437", width: "100%", padding: "12px" }}>Go Pro — ₹149/month</Link>
            </div>
          </div>

          {/* Comparison */}
          <div style={{ marginTop: 60, background: "white", borderRadius: 20, padding: 32, border: "1px solid #e3e7ef" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0b1437", textAlign: "center", marginBottom: 24 }}>Rently vs Traditional Broker</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, fontSize: 14 }} className="compare-row">
              <div style={{ fontWeight: 700, color: "#0b1437" }}>Cost Item</div>
              <div style={{ fontWeight: 700, color: "#10b981", textAlign: "center" }}>Rently</div>
              <div style={{ fontWeight: 700, color: "#b91c1c", textAlign: "center" }}>Local Broker</div>
              {[["Upfront cost", "₹49/week", "1–2 months rent"], ["For ₹25K rent", "₹196/month", "₹25,000–50,000"], ["Tenant reach", "All Maharashtra", "Local area only"], ["Phone shown to tenants", "✓ Direct", "✓ Via broker"], ["Verification", "✓ Phone & ID", "✗ Often none"], ["Renewals & visits", "0 fees", "Extra charges"]].map((row, i) => (
                <div key={i} style={{ display: "contents" }}>
                  <div style={{ padding: "12px 0", borderTop: "1px solid #f0f2f7", color: "#0b1437", fontWeight: 500 }}>{row[0]}</div>
                  <div style={{ padding: "12px 0", borderTop: "1px solid #f0f2f7", textAlign: "center", color: "#047857", fontWeight: 600 }}>{row[1]}</div>
                  <div style={{ padding: "12px 0", borderTop: "1px solid #f0f2f7", textAlign: "center", color: "#4b5675" }}>{row[2]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginTop: 50 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0b1437", textAlign: "center", marginBottom: 26 }}>Frequently asked questions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, maxWidth: 920, margin: "0 auto" }}>
              {[
                { q: "Do tenants pay anything?", a: "No. Tenants browse, contact owners, and finalize the deal directly. Zero brokerage, ever." },
                { q: "Can I cancel mid-week?", a: "Yes, your listing stays active until the end of the paid period. No auto-renew without your consent." },
                { q: "How do you verify owners?", a: "Every owner verifies via phone OTP and government ID before publishing listings." },
                { q: "Is there a free trial?", a: "Yes — your first listing is free for 7 days when you sign up. Then choose ₹49/week or ₹149/month." },
              ].map((f) => (
                <div key={f.q} style={{ background: "white", borderRadius: 14, padding: 22, border: "1px solid #e3e7ef" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 6, color: "#0b1437" }}>{f.q}</h3>
                  <p style={{ fontSize: 14, color: "#4b5675", margin: 0, lineHeight: 1.6 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <AIChat />
      <style>{`@media (max-width: 700px) { .compare-row { grid-template-columns: 1fr !important; gap: 4px !important; } .compare-row > div:nth-child(3n+1) { font-weight: 800 !important; padding-top: 14px !important; } }`}</style>
    </div>
  );
}
