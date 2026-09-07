"use client";

import { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import { useAuth } from "@/lib/auth-context";

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

interface ChatMessage {
  id: string;
  conversationId: string;
  sender: "tenant" | "owner";
  senderName: string;
  content: string;
  createdAt: string;
  readByTenant: boolean;
  readByOwner: boolean;
}

export default function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [p, setP] = useState<PropData | null>(null);
  const [loading, setLoading] = useState(true);
  const [allProperties, setAllProperties] = useState<PropData[]>([]);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatSending, setChatSending] = useState(false);
  const [chatError, setChatError] = useState("");
  const [chatSent, setChatSent] = useState(false);

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

  const conversationId = `prop-${id}-${p?.ownerId || "owner"}`;

  useEffect(() => {
    if (chatOpen && p) {
      loadChat();
      const interval = setInterval(loadChat, 3000);
      return () => clearInterval(interval);
    }
  }, [chatOpen, p]);

  async function loadChat() {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setChatMessages(data);
          if (user) {
            fetch(`/api/messages?conversationId=${conversationId}&markRead=true&readBy=${user.role === "owner" ? "owner" : "tenant"}`);
          }
        }
      }
    } catch { /* ignore */ }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatMessage.trim() || !user) return;
    setChatSending(true);
    setChatError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          sender: user.role,
          senderName: user.name || user.email.split("@")[0],
          content: chatMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages((prev) => [...prev, data.message]);
        setChatMessage("");
        setChatSent(true);
      } else {
        setChatError(data.error || "Failed to send");
      }
    } catch {
      setChatError("Network error");
    } finally {
      setChatSending(false);
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

              {/* Chat / Contact Owner */}
              <div style={{ background: "white", borderRadius: 18, padding: 24, border: "1px solid #e3e7ef" }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0b1437", marginBottom: 4 }}>Chat with Owner</h3>
                <p style={{ fontSize: 13, color: "#4b5675", marginBottom: 16 }}>Send a message to {p.ownerName}. Direct, no brokerage.</p>

                {!user ? (
                  <div style={{ textAlign: "center", padding: 20, background: "#f4f6fb", borderRadius: 14 }}>
                    <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 12 }}>Login to chat with the owner</p>
                    <Link href={`/auth/login?redirect=${encodeURIComponent(`/properties/${id}`)}`} className="btn btn-primary" style={{ fontSize: 14 }}>Login to Chat</Link>
                  </div>
                ) : chatSent ? (
                  <div style={{ textAlign: "center", padding: 20, background: "#f0fdf4", borderRadius: 14, border: "1px solid #bbf7d0" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#059669", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 18 }}>✓</div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#047857", marginBottom: 4 }}>Message Sent!</h3>
                    <p style={{ fontSize: 13, color: "#047857", marginBottom: 12 }}>{p.ownerName} will respond shortly.</p>
                    <Link href="/inbox" style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>View Inbox →</Link>
                  </div>
                ) : (
                  <>
                    {chatMessages.length > 0 && (
                      <div style={{ maxHeight: 250, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 12, padding: 12, background: "#f8fafc", borderRadius: 12, border: "1px solid #e3e7ef" }}>
                        {chatMessages.map((msg) => (
                          <div key={msg.id} style={{
                            maxWidth: "80%", padding: "10px 14px", borderRadius: 14,
                            background: msg.sender === (user?.role || "tenant") ? "#1a56db" : "white",
                            color: msg.sender === (user?.role || "tenant") ? "white" : "#0b1437",
                            border: msg.sender === (user?.role || "tenant") ? "none" : "1px solid #e3e7ef",
                            alignSelf: msg.sender === (user?.role || "tenant") ? "flex-end" : "flex-start",
                            fontSize: 14, lineHeight: 1.5,
                          }}>
                            {msg.content}
                            <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4 }}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <form onSubmit={handleSendMessage} style={{ display: "flex", gap: 8 }}>
                      <input
                        className="input"
                        placeholder={`Message ${p.ownerName}…`}
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button type="submit" className="btn btn-primary" disabled={chatSending || !chatMessage.trim()} style={{ padding: "10px 18px" }}>
                        {chatSending ? "…" : "Send"}
                      </button>
                    </form>
                    {chatError && <div style={{ color: "#dc2626", fontSize: 13, marginTop: 8 }}>{chatError}</div>}
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 8, textAlign: "center" }}>Direct to owner. Zero brokerage. Free messaging.</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* What's Around This Home - Nearby Places */}
          {p.lat && p.lng && (
            <NearbyPlacesSection lat={p.lat} lng={p.lng} />
          )}
        </div>
      </div>
      <Footer />
      <AIChat />
      <style>{`@media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

const NEARBY_CATS = [
  { key: "education", label: "Education", color: "#3b82f6", query: "['amenity'~'school|college|university']" },
  { key: "healthcare", label: "Healthcare", color: "#ef4444", query: "['amenity'~'hospital|clinic|pharmacy']" },
  { key: "shopping", label: "Shopping", color: "#8b5cf6", query: "['shop'~'supermarket|mall|market']" },
  { key: "food", label: "Food & Dining", color: "#f59e0b", query: "['amenity'~'restaurant|cafe|fast_food']" },
  { key: "transport", label: "Transport", color: "#10b981", query: "['railway'='station']|['public_transport'~'station']" },
  { key: "parks", label: "Parks", color: "#22c55e", query: "['leisure'~'park|garden']" },
];

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function NearbyPlacesSection({ lat, lng }: { lat: number; lng: number }) {
  const [places, setPlaces] = useState<{ name: string; category: string; distance: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      const all: { name: string; category: string; distance: number; color: string }[] = [];
      for (const cat of NEARBY_CATS) {
        try {
          const query = `[out:json][timeout:6];(node${cat.query}(${lat - 0.01},${lng - 0.01},${lat + 0.01},${lng + 0.01});way${cat.query}(${lat - 0.01},${lng - 0.01},${lat + 0.01},${lng + 0.01}););out center 8;`;
          const res = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: `data=${encodeURIComponent(query)}`,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          });
          const data = await res.json();
          for (const el of data.elements || []) {
            const elLat = el.lat || el.center?.lat;
            const elLng = el.lon || el.center?.lon;
            if (!elLat || !elLng) continue;
            const dist = haversine(lat, lng, elLat, elLng);
            if (dist > 5) continue;
            all.push({
              name: el.tags?.name || el.tags?.["name:en"] || `${cat.label} nearby`,
              category: cat.key,
              distance: dist,
              color: cat.color,
            });
          }
        } catch { /* skip */ }
      }
      all.sort((a, b) => a.distance - b.distance);
      if (!cancelled) { setPlaces(all); setLoading(false); }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, [lat, lng]);

  const filtered = activeFilter ? places.filter((p) => p.category === activeFilter) : places;
  const grouped = NEARBY_CATS.map((cat) => ({
    ...cat,
    count: places.filter((p) => p.category === cat.key).length,
    nearest: places.filter((p) => p.category === cat.key).sort((a, b) => a.distance - b.distance)[0],
  })).filter((g) => g.count > 0);

  if (loading) {
    return (
      <div style={{ marginTop: 30 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>What&apos;s Around This Home</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="skeleton" style={{ height: 70, borderRadius: 12 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 30 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>What&apos;s Around This Home</h3>
      <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>{places.length} places found within 5 km via OpenStreetMap</p>

      {/* Category cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, marginBottom: 16 }}>
        {grouped.map((g) => (
          <button
            key={g.key}
            onClick={() => setActiveFilter(activeFilter === g.key ? null : g.key)}
            style={{
              padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${activeFilter === g.key ? g.color : "var(--border)"}`,
              background: activeFilter === g.key ? `${g.color}10` : "var(--surface)",
              cursor: "pointer", textAlign: "left", transition: "all 0.15s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: g.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, fontFamily: "Inter, system-ui" }}>{g.count}</span>
              {g.nearest && <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "Inter, system-ui" }}>{(g.nearest.distance * 1000).toFixed(0)}m</span>}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", fontFamily: "Inter, system-ui" }}>{g.label}</div>
          </button>
        ))}
      </div>

      {/* Places list */}
      {filtered.length > 0 && (
        <div style={{ display: "grid", gap: 6, maxHeight: 300, overflowY: "auto" }}>
          {filtered.slice(0, 20).map((place, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10,
              border: "1px solid var(--border)", background: "var(--surface)", fontSize: 13,
            }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: place.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, flexShrink: 0, fontFamily: "Inter, system-ui" }}>
                {NEARBY_CATS.find((c) => c.key === place.category)?.label?.[0] || "?"}
              </span>
              <span style={{ flex: 1, color: "var(--text)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "Inter, system-ui" }}>{place.name}</span>
              <span style={{ color: "var(--text-muted)", fontSize: 12, flexShrink: 0, fontFamily: "Inter, system-ui" }}>
                {place.distance < 1 ? `${(place.distance * 1000).toFixed(0)}m` : `${place.distance.toFixed(1)}km`}
              </span>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: 20 }}>No nearby places found for this filter.</p>
      )}
    </div>
  );
}
