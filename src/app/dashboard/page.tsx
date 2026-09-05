"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Conversation {
  id: string;
  propertyTitle: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  tenantMessage: string;
  status: string;
  createdAt: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

const myProps = [
  { id: "1", title: "Spacious 2BHK in Andheri", city: "Mumbai", price: 22000, views: 245, status: "active", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400" },
  { id: "2", title: "Room in Hinjewadi", city: "Pune", price: 6500, views: 98, status: "active", image: "https://images.unsplash.com/photo-1598928506311-c55ez637a513?w=400" },
  { id: "3", title: "Office Space IT Park", city: "Pune", price: 35000, views: 67, status: "pending", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400" },
];

export default function DashboardPage() {
  const [tab, setTab] = useState<"listings" | "inquiries" | "subscription">("listings");
  const [inquiries, setInquiries] = useState<Conversation[]>([]);

  useEffect(() => {
    fetch("/api/inquiries?ownerId=owner-1")
      .then((r) => r.json())
      .then((data) => setInquiries(data))
      .catch(() => {});
  }, []);

  const newCount = inquiries.filter((c) => c.status === "new").length;

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  return (
    <div style={{ background: "#f7f8fc", minHeight: "100vh" }}>
      <Navbar />
      <div className="container-app" style={{ padding: "30px 20px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0b1437" }}>Owner Dashboard</h1>
            <p style={{ fontSize: 14, color: "#4b5675" }}>Manage your property listings</p>
          </div>
          <Link href="/inbox" className="btn btn-primary">
            📬 Inbox {newCount > 0 && <span style={{ background: "white", color: "#ff6a3d", borderRadius: 999, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>{newCount}</span>}
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Total Properties", value: "3", icon: "🏠" },
            { label: "Total Views", value: "410", icon: "👁️" },
            { label: "Inquiries", value: String(inquiries.length), icon: "💬" },
            { label: "New Messages", value: String(newCount), icon: "📬" },
          ].map((s) => (
            <div key={s.label} style={{ background: "white", borderRadius: 14, padding: 18, border: "1px solid #e3e7ef" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0b1437" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#4b5675" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["listings", "inquiries", "subscription"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`btn ${tab === t ? "btn-secondary" : "btn-outline"}`} style={{ textTransform: "capitalize" }}>
              {t} {t === "inquiries" && newCount > 0 && <span style={{ background: "#ff6a3d", color: "white", borderRadius: 999, padding: "2px 6px", fontSize: 10 }}>{newCount}</span>}
            </button>
          ))}
        </div>

        {tab === "listings" && (
          <div style={{ display: "grid", gap: 14 }}>
            {myProps.map((prop) => (
              <div key={prop.id} style={{ background: "white", borderRadius: 14, padding: 18, border: "1px solid #e3e7ef", display: "flex", gap: 16, alignItems: "center" }}>
                <img src={prop.image} alt="" style={{ width: 100, height: 80, objectFit: "cover", borderRadius: 10 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0b1437" }}>{prop.title}</h3>
                    <span className={`badge ${prop.status === "active" ? "badge-success" : "badge-warn"}`}>{prop.status}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#4b5675" }}>{prop.city} · ₹{prop.price.toLocaleString("en-IN")}/mo</p>
                  <div style={{ fontSize: 12, color: "#4b5675", marginTop: 6 }}>👁️ {prop.views} views</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-outline" style={{ padding: "8px 14px" }}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "inquiries" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0b1437" }}>All Inquiries</h3>
              <Link href="/inbox" className="btn btn-outline" style={{ fontSize: 13 }}>View Full Inbox →</Link>
            </div>
            {inquiries.length === 0 ? (
              <div style={{ background: "white", borderRadius: 18, padding: 50, textAlign: "center", border: "1px solid #e3e7ef" }}>
                <div style={{ fontSize: 50, marginBottom: 12 }}>📭</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No inquiries yet</h3>
                <p style={{ color: "#4b5675" }}>When tenants contact you, their inquiries will appear here.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {inquiries.map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/chat/${conv.id}`}
                    className="property-card"
                    style={{ display: "block", background: "white", borderRadius: 14, padding: 18, border: conv.unread > 0 ? "2px solid #0d6efd" : "1px solid #e3e7ef", textDecoration: "none", color: "inherit" }}
                  >
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: conv.unread > 0 ? "linear-gradient(135deg,#0d6efd,#0a58ca)" : "#f4f6fb", color: conv.unread > 0 ? "white" : "#0b1437", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                        {conv.tenantName.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 15, fontWeight: conv.unread > 0 ? 800 : 600, color: "#0b1437" }}>{conv.tenantName}</span>
                            {conv.status === "new" && <span className="badge badge-warn" style={{ fontSize: 10 }}>NEW</span>}
                          </div>
                          <span style={{ fontSize: 12, color: "#4b5675" }}>{timeAgo(conv.lastMessageAt)}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#4b5675", marginBottom: 4 }}>Re: {conv.propertyTitle}</div>
                        <p style={{ fontSize: 14, color: conv.unread > 0 ? "#0b1437" : "#4b5675", fontWeight: conv.unread > 0 ? 600 : 400, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conv.lastMessage}</p>
                        <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 12, color: "#4b5675" }}>
                          <span>📧 {conv.tenantEmail}</span>
                          {conv.tenantPhone && <span>📞 {conv.tenantPhone}</span>}
                        </div>
                      </div>
                      {conv.unread > 0 && (
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#0d6efd", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{conv.unread}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "subscription" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            <div style={{ background: "white", borderRadius: 18, padding: 24, border: "2px solid #10b981" }}>
              <span className="badge badge-success" style={{ marginBottom: 12 }}>Active Plan</span>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0b1437", marginBottom: 4 }}>Weekly</h3>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#0b1437", marginBottom: 8 }}>₹49<span style={{ fontSize: 14, color: "#4b5675", fontWeight: 400 }}>/week</span></div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Unlimited listings", "Verified badge", "Direct contact", "AI matching"].map((f) => (
                  <li key={f} style={{ padding: "6px 0", fontSize: 14, color: "#0b1437" }}>✓ {f}</li>
                ))}
              </ul>
            </div>
            <div style={{ background: "white", borderRadius: 18, padding: 24, border: "1px solid #e3e7ef" }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0b1437", marginBottom: 4 }}>Monthly</h3>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#0b1437", marginBottom: 8 }}>₹149<span style={{ fontSize: 14, color: "#4b5675", fontWeight: 400 }}>/month</span></div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
                {["Everything in Weekly", "Featured listings", "Advanced analytics"].map((f) => (
                  <li key={f} style={{ padding: "6px 0", fontSize: 14, color: "#0b1437" }}>✓ {f}</li>
                ))}
              </ul>
              <button className="btn btn-primary" style={{ width: "100%" }}>Upgrade</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
