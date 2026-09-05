"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import ListingWizard from "@/components/ListingWizard";
import type { Property } from "@/lib/properties-store";

type Tab = "overview" | "listings" | "add" | "edit" | "inquiries";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { lang } = useLang();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!user) { router.push("/auth/login"); return; }
    loadListings();
  }, [user, router]);

  const loadListings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/properties?ownerId=${user.id}`);
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [user]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this listing?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/properties/${id}`, { method: "DELETE" });
      setListings((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  async function handleStatusToggle(id: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "rented" : "active";
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setListings((prev) => prev.map((p) => p.id === id ? { ...p, status: newStatus } : p));
      }
    } catch { /* ignore */ }
  }

  function handleEdit(property: Property) {
    setEditingProperty(property);
    setTab("edit" as Tab);
  }

  const t = (en: string, mr: string, hi: string) => {
    if (lang === "mr") return mr;
    if (lang === "hi") return hi;
    return en;
  };

  const totalRent = listings.reduce((sum, p) => sum + p.price, 0);
  const activeListings = listings.filter((p) => p.status === "active").length;

  const tabs: { key: Tab; icon: string; label: string }[] = [
    { key: "overview", icon: "📊", label: t("Overview", "सारांश", "अवलोकन") },
    { key: "listings", icon: "🏠", label: t("My Listings", "माझ्या यादी", "मेरी लिस्टिंग") },
    { key: "add", icon: "➕", label: t("Add Property", "मालमत्ता जोडा", "प्रॉपर्टी जोड़ें") },
    { key: "inquiries", icon: "📩", label: t("Inquiries", "चौकशी", "पूछताछ") },
  ];

  return (
    <div className="app">
      <Navbar />
      <main style={{ padding: "32px 0 80px" }}>
        <div className="container-app">
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0b1437" }}>
              {t("Owner Dashboard", "मालक डॅशबोर्ड", "मालिक डैशबोर्ड")}
            </h1>
            <p style={{ fontSize: 15, color: "#4b5675", marginTop: 4 }}>
              {t("Manage your properties and track performance", "तुमच्या मालमत्ता व्यवस्थापित करा", "अपनी प्रॉपर्टी प्रबंधित करें")}
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: "10px 18px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                  border: tab === t.key ? "2px solid #0d6efd" : "1px solid #e3e7ef",
                  background: tab === t.key ? "rgba(13,110,253,0.06)" : "white",
                  color: tab === t.key ? "#0d6efd" : "#4b5675",
                  transition: "all 0.15s",
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {tab === "overview" && (
            <div className="fade-in" style={{ display: "grid", gap: 20 }}>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                <StatCard
                  icon="🏠"
                  label={t("Total Listings", "एकूण यादी", "कुल लिस्टिंग")}
                  value={listings.length.toString()}
                  color="#0d6efd"
                />
                <StatCard
                  icon="✅"
                  label={t("Active", "सक्रिय", "सक्रिय")}
                  value={activeListings.toString()}
                  color="#10b981"
                />
                <StatCard
                  icon="💰"
                  label={t("Potential Revenue", "संभावित उत्पन्न", "संभावित आय")}
                  value={`₹${totalRent.toLocaleString("en-IN")}`}
                  accent
                />
                <StatCard
                  icon="👁️"
                  label={t("Total Views", "एकूण दृश्य", "कुल व्यूज")}
                  value={listings.reduce((s, p) => s + p.views, 0).toString()}
                  color="#f59e0b"
                />
              </div>

              {/* Quick Actions */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                <button onClick={() => setTab("add")} className="owner-quick-action">
                  <div style={{ fontSize: 28 }}>➕</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{t("List New Property", "नवीन मालमत्ता यादी", "नई प्रॉपर्टी लिस्ट करें")}</div>
                  <div style={{ fontSize: 12, color: "#4b5675" }}>{t("Add rooms, flats, or houses", "खोल्या, फ्लॅट किंवा घर जोडा", "कमरे, फ्लैट या घर जोड़ें")}</div>
                </button>
                <Link href="/inbox" className="owner-quick-action" style={{ textDecoration: "none" }}>
                  <div style={{ fontSize: 28 }}>📩</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{t("View Inquiries", "चौकशी पहा", "पूछताछ देखें")}</div>
                  <div style={{ fontSize: 12, color: "#4b5675" }}>{t("Respond to tenant messages", "भाडेकरू संदेशांना उत्तर द्या", "किरायेदार संदेशों का जवाब दें")}</div>
                </Link>
                <Link href="/pricing" className="owner-quick-action" style={{ textDecoration: "none" }}>
                  <div style={{ fontSize: 28 }}>⭐</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{t("Upgrade Plan", "प्लान अपग्रेड करा", "प्लान अपग्रेड करें")}</div>
                  <div style={{ fontSize: 12, color: "#4b5675" }}>{t("Get more views & leads", "अधिक दृश्य आणि लीड मिळवा", "अधिक व्यूज और लीड पाएं")}</div>
                </Link>
              </div>

              {/* Recent Listings */}
              {listings.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0b1437", marginBottom: 14 }}>
                    {t("Recent Listings", "अलीकडील यादी", "हाल की लिस्टिंग")}
                  </h3>
                  <div style={{ display: "grid", gap: 10 }}>
                    {listings.slice(0, 3).map((p) => (
                      <div key={p.id} style={{
                        display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                        borderRadius: 12, border: "1px solid #e3e7ef", background: "white",
                      }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#f4f6fb",
                        }}>
                          {p.images[0] ? (
                            <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏠</div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#0b1437", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                          <div style={{ fontSize: 12, color: "#4b5675" }}>{p.area && `${p.area}, `}{p.city}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#ff6a3d" }}>₹{p.price.toLocaleString("en-IN")}/mo</div>
                          <div style={{ fontSize: 11, color: p.status === "active" ? "#10b981" : "#f59e0b" }}>{p.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Listings Tab */}
          {tab === "listings" && (
            <div className="fade-in" style={{ display: "grid", gap: 14 }}>
              {loading ? (
                <div style={{ display: "grid", gap: 14 }}>
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="skeleton" style={{ height: 100, borderRadius: 14 }} />
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 18, border: "1px solid #e3e7ef" }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>🏠</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0b1437", marginBottom: 8 }}>
                    {t("No listings yet", "अजून यादी नाही", "अभी तक कोई लिस्टिंग नहीं")}
                  </h3>
                  <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 18 }}>
                    {t("Add your first property to start receiving inquiries", "पहिली मालमत्ता जोडा", "पूछताछ प्राप्त करने के लिए अपनी पहली प्रॉपर्टी जोड़ें")}
                  </p>
                  <button onClick={() => setTab("add")} className="btn btn-primary">
                    {t("➕ Add Property", "मालमत्ता जोडा", "प्रॉपर्टी जोड़ें")}
                  </button>
                </div>
              ) : (
                listings.map((p) => (
                  <div key={p.id} style={{
                    display: "flex", gap: 14, padding: 16, borderRadius: 14,
                    border: "1px solid #e3e7ef", background: "white",
                  }}>
                    <div style={{
                      width: 140, height: 100, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#f4f6fb",
                    }}>
                      {p.images[0] ? (
                        <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🏠</div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#0b1437" }}>{p.title}</div>
                          <div style={{ fontSize: 13, color: "#4b5675", marginTop: 2 }}>
                            {p.area && `${p.area}, `}{p.city} · {p.bedrooms}BHK · {p.bathrooms}Bath
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 16, fontWeight: 800, color: "#ff6a3d" }}>₹{p.price.toLocaleString("en-IN")}</div>
                          <div style={{ fontSize: 11, color: "#4b5675" }}/>{t("/month", "/महिना", "/महीना")}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                          background: p.status === "active" ? "rgba(16,185,129,0.1)" : p.status === "pending" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
                          color: p.status === "active" ? "#10b981" : p.status === "pending" ? "#f59e0b" : "#ef4444",
                        }}>{p.status}</span>
                        {p.isVerified && (
                          <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: "rgba(13,110,253,0.1)", color: "#0d6efd" }}>
                            ✓ {t("Verified", "पडताळलेले", "सत्यापित")}
                          </span>
                        )}
                        <span style={{ fontSize: 12, color: "#4b5675" }}>👁 {p.views}</span>
                        <div style={{ flex: 1 }} />
                        <button onClick={() => handleStatusToggle(p.id, p.status)} style={{
                          padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
                          border: `1px solid ${p.status === "active" ? "#10b981" : "#f59e0b"}`,
                          background: p.status === "active" ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)",
                          color: p.status === "active" ? "#10b981" : "#f59e0b",
                        }}>
                          {p.status === "active" ? `✅ ${t("Active", "सक्रिय", "सक्रिय")}` : `🟢 ${t("Mark Active", "सक्रिय करा", "सक्रिय करें")}`}
                        </button>
                        <button onClick={() => handleEdit(p)} style={{
                          padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                          border: "1px solid #e3e7ef", background: "white", color: "#0d6efd",
                        }}>
                          ✏️ {t("Edit", "बदला", "बदलें")}
                        </button>
                        <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{
                          padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                          border: "1px solid #e3e7ef", background: deleting === p.id ? "#f4f6fb" : "white",
                          color: deleting === p.id ? "#9ca3af" : "#ef4444",
                        }}>
                          {deleting === p.id ? "…" : `🗑️ ${t("Delete", "हटवा", "हटाएं")}`}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Add Property Tab */}
          {tab === "add" && (
            <ListingWizard onDone={() => { setTab("listings"); loadListings(); }} />
          )}

          {/* Edit Property Tab */}
          {tab === "edit" && editingProperty && (
            <ListingWizard
              editProperty={editingProperty}
              onDone={() => { setEditingProperty(null); setTab("listings"); loadListings(); }}
            />
          )}

          {/* Inquiries Tab */}
          {tab === "inquiries" && (
            <div className="fade-in" style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 18, border: "1px solid #e3e7ef" }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>📩</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0b1437", marginBottom: 8 }}>
                {t("Inquiries Hub", "चौकशी केंद्र", "पूछताछ केंद्र")}
              </h3>
              <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 18 }}>
                {t("Messages from potential tenants appear here", "संभाव्य भाडेकरूंचे संदेस येथे दिसतील", "संभावित किरायेदारों के संदेश यहाँ दिखाई देंगे")}
              </p>
              <Link href="/inbox" className="btn btn-primary">
                {t("📬 Go to Inbox", "इनबॉक्सवर जा", "इनबॉक्स पर जाएं")}
              </Link>
            </div>
          )}
        </div>
      </main>
      <AIChat />
      <Footer />
    </div>
  );
}

function StatCard({ icon, label, value, color, accent }: { icon: string; label: string; value: string; color?: string; accent?: boolean }) {
  return (
    <div style={{
      padding: 20, borderRadius: 14, border: accent ? "none" : "1px solid #e3e7ef",
      background: accent ? "linear-gradient(135deg,#ff6a3d,#ff9a6c)" : "white",
    }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: accent ? "white" : color || "#0b1437" }}>{value}</div>
      <div style={{ fontSize: 12, color: accent ? "rgba(255,255,255,0.9)" : "#4b5675", marginTop: 2 }}>{label}</div>
    </div>
  );
}
