"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";
import { apiUrl } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingWizard from "@/components/ListingWizard";
import OwnerAnalytics from "@/components/OwnerAnalytics";
import type { Property } from "@/lib/properties-store";

type Tab = "overview" | "listings" | "add" | "edit" | "inquiries" | "analytics";

interface SubscriptionStatus {
  isActive: boolean;
  daysLeft: number;
  needsRenewal: boolean;
  isExpired: boolean;
}

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { lang } = useLang();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    if (!user) { router.push("/auth/login"); return; }
    loadListings();
    checkSubscription();
  }, [user, router]);

  async function checkSubscription() {
    if (!user) return;
    try {
      const res = await fetch(apiUrl(`/api/subscription?ownerId=${user.id}`));
      const data = await res.json();
      if (data.success) setSubscription(data);
    } catch { /* ignore */ }
  }

  const loadListings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/properties?ownerId=${user.id}`));
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [user]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this listing?")) return;
    setDeleting(id);
    try {
      await fetch(apiUrl(`/api/properties/${id}`), { method: "DELETE" });
      setListings((prev) => prev.filter((p) => p.id !== id));
    } finally { setDeleting(null); }
  }

  async function handleStatusToggle(id: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "rented" : "active";
    try {
      const res = await fetch(apiUrl(`/api/properties/${id}`), {
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

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: t("Overview", "सारांश", "अवलोकन") },
    { key: "listings", label: t("My Listings", "माझ्या यादी", "मेरी लिस्टिंग") },
    { key: "analytics", label: t("Analytics", "विश्लेषण", "Analytics") },
    { key: "add", label: t("Add Property", "मालमत्ता जोडा", "प्रॉपर्टी जोड़ें") },
    { key: "inquiries", label: t("Inquiries", "चौकशी", "पूछताछ") },
  ];

  return (
    <div className="app">
      <Navbar />
      <main style={{ padding: "32px 0 80px" }}>
        <div className="container-app">
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text)" }}>
              {t("Owner Dashboard", "मालक डॅशबोर्ड", "मालिक डैशबोर्ड")}
            </h1>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 4 }}>
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
                  padding: "10px 18px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                  border: tab === t.key ? "2px solid var(--primary)" : "1px solid var(--border)",
                  background: tab === t.key ? "var(--primary-light)" : "var(--surface)",
                  color: tab === t.key ? "var(--primary)" : "var(--text-muted)",
                  transition: "all 0.15s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {tab === "overview" && (
            <div className="fade-in" style={{ display: "grid", gap: 20 }}>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                <StatCard
                  icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" /></svg>}
                  label={t("Total Listings", "एकूण यादी", "कुल लिस्टिंग")}
                  value={listings.length.toString()}
                  color="var(--primary)"
                />
                <StatCard
                  icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  label={t("Active", "सक्रिय", "सक्रिय")}
                  value={activeListings.toString()}
                  color="var(--success)"
                />
                <StatCard
                  icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
                  label={t("Potential Revenue", "संभावित उत्पन्न", "संभावित आय")}
                  value={`₹${totalRent.toLocaleString("en-IN")}`}
                  accent
                />
                <StatCard
                  icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                  label={t("Total Views", "एकूण दृश्य", "कुल व्यूज")}
                  value={listings.reduce((s, p) => s + p.views, 0).toString()}
                  color="var(--accent)"
                />
              </div>

              {/* Quick Actions */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                <button onClick={() => setTab("add")} className="owner-quick-action">
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)", letterSpacing: "0.3px" }}>
                    {t("List New Property", "नवीन मालमत्ता यादी", "नई प्रॉपर्टी लिस्ट करें")}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {t("Add rooms, flats, or houses", "खोल्या, फ्लॅट किंवा घर जोडा", "कमरे, फ्लैट या घर जोड़ें")}
                  </div>
                </button>
                <Link href="/inbox" className="owner-quick-action" style={{ textDecoration: "none" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)", letterSpacing: "0.3px" }}>
                    {t("View Inquiries", "चौकशी पहा", "पूछताछ देखें")}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {t("Respond to tenant messages", "भाडेकरू संदेशांना उत्तर द्या", "किरायेदार संदेशों का जवाब दें")}
                  </div>
                </Link>
                <Link href="/pricing" className="owner-quick-action" style={{ textDecoration: "none" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)", letterSpacing: "0.3px" }}>
                    {t("Upgrade Plan", "प्लान अपग्रेड करा", "प्लान अपग्रेड करें")}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {t("Get more views & leads", "अधिक दृश्य आणि लीड मिळवा", "अधिक व्यूज और लीड पाएं")}
                  </div>
                </Link>
              </div>

              {/* Recent Listings */}
              {listings.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>
                    {t("Recent Listings", "अलीकडील यादी", "हाल की लिस्टिंग")}
                  </h3>
                  <div style={{ display: "grid", gap: 10 }}>
                    {listings.slice(0, 3).map((p) => (
                      <div key={p.id} style={{
                        display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                        borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)",
                      }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "var(--border-light)",
                        }}>
                          {p.images[0] ? (
                            <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 700, fontSize: 14 }}>R</div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.area && `${p.area}, `}{p.city}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>₹{p.price.toLocaleString("en-IN")}/mo</div>
                          <div style={{ fontSize: 11, color: p.status === "active" ? "var(--success)" : "var(--accent)", fontWeight: 500 }}>{p.status}</div>
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
                <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--surface)", borderRadius: 18, border: "1px solid var(--border)" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
                    {t("No listings yet", "अजून यादी नाही", "अभी तक कोई लिस्टिंग नहीं")}
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 18 }}>
                    {t("Add your first property to start receiving inquiries", "पहिली मालमत्ता जोडा", "पूछताछ प्राप्त करने के लिए अपनी पहली प्रॉपर्टी जोड़ें")}
                  </p>
                  <button onClick={() => setTab("add")} className="btn btn-primary">
                    {t("Add Property", "मालमत्ता जोडा", "प्रॉपर्टी जोड़ें")}
                  </button>
                </div>
              ) : (
                listings.map((p) => (
                  <div key={p.id} style={{
                    display: "flex", gap: 14, padding: 16, borderRadius: 14,
                    border: "1px solid var(--border)", background: "var(--surface)",
                  }}>
                    <div style={{
                      width: 140, height: 100, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "var(--border-light)",
                    }}>
                      {p.images[0] ? (
                        <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 700, fontSize: 24 }}>R</div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{p.title}</div>
                          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                            {p.area && `${p.area}, `}{p.city} · {p.bedrooms}BHK · {p.bathrooms}Bath
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>₹{p.price.toLocaleString("en-IN")}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t("/month", "/महिना", "/महीना")}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                          background: p.status === "active" ? "var(--success-light)" : p.status === "pending" ? "var(--warning-light)" : "var(--danger-light)",
                          color: p.status === "active" ? "var(--success)" : p.status === "pending" ? "var(--warning)" : "var(--danger)",
                        }}>{p.status}</span>
                        {p.isVerified && (
                          <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--primary-light)", color: "var(--primary)" }}>
                            Verified
                          </span>
                        )}
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.views} views</span>
                        <div style={{ flex: 1 }} />
                        <button onClick={() => handleStatusToggle(p.id, p.status)} style={{
                          padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer",
                          border: `1px solid ${p.status === "active" ? "var(--success)" : "var(--accent)"}`,
                          background: p.status === "active" ? "var(--success-light)" : "var(--accent-light)",
                          color: p.status === "active" ? "var(--success)" : "var(--accent)",
                        }}>
                          {p.status === "active" ? t("Active", "सक्रिय", "सक्रिय") : t("Mark Active", "सक्रिय करा", "सक्रिय करें")}
                        </button>
                        <button onClick={() => handleEdit(p)} style={{
                          padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                          border: "1px solid var(--border)", background: "var(--surface)", color: "var(--primary)",
                        }}>
                          {t("Edit", "बदला", "बदलें")}
                        </button>
                        <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{
                          padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                          border: "1px solid var(--border)", background: deleting === p.id ? "var(--border-light)" : "var(--surface)",
                          color: deleting === p.id ? "var(--text-muted)" : "var(--danger)",
                        }}>
                          {deleting === p.id ? "..." : t("Delete", "हटवा", "हटाएं")}
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
            subscription?.isActive ? (
              <ListingWizard onDone={() => { setTab("listings"); loadListings(); }} />
            ) : (
              <div className="fade-in" style={{ textAlign: "center", padding: "60px 20px", background: "var(--surface)", borderRadius: 18, border: "1px solid var(--border)" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
                  {t("Subscription Required", "सदस्यता आवश्यक", "Subscription Required")}
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 18 }}>
                  {t("You need an active subscription to list properties. Start at just ₹49/week.", "मालमत्ता यादी करण्यासाठी सक्रिय सदस्यता आवश्यक आहे. फक्त ₹49/आठवडा.", "You need an active subscription to list properties. Start at just ₹49/week.")}
                </p>
                <Link href="/pricing" className="btn btn-primary">
                  {t("Get Subscription", "सदस्यता घ्या", "Get Subscription")}
                </Link>
              </div>
            )
          )}

          {/* Edit Property Tab */}
          {tab === "edit" && editingProperty && (
            <ListingWizard
              editProperty={editingProperty}
              onDone={() => { setEditingProperty(null); setTab("listings"); loadListings(); }}
            />
          )}

          {/* Analytics Tab */}
          {tab === "analytics" && (
            <OwnerAnalytics properties={listings} />
          )}

          {/* Inquiries Tab */}
          {tab === "inquiries" && (
            <div className="fade-in" style={{ textAlign: "center", padding: "60px 20px", background: "var(--surface)", borderRadius: 18, border: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
                {t("Inquiries Hub", "चौकशी केंद्र", "पूछताछ केंद्र")}
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 18 }}>
                {t("Messages from potential tenants appear here", "संभाव्य भाडेकरूंचे संदेस येथे दिसतील", "संभावित किरायेदारों के संदेश यहाँ दिखाई देंगे")}
              </p>
              <Link href="/inbox" className="btn btn-primary">
                {t("Go to Inbox", "इनबॉक्सवर जा", "इनबॉक्स पर जाएं")}
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatCard({ icon, label, value, color, accent }: { icon: React.ReactNode; label: string; value: string; color?: string; accent?: boolean }) {
  return (
    <div style={{
      padding: 20, borderRadius: 14, border: accent ? "none" : "1px solid var(--border)",
      background: accent ? "linear-gradient(135deg, var(--primary), #1e40af)" : "var(--surface)",
    }}>
      <div style={{ color: accent ? "rgba(255,255,255,0.9)" : color || "var(--text-muted)", marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: accent ? "white" : "var(--text)" }}>{value}</div>
      <div style={{ fontSize: 12, color: accent ? "rgba(255,255,255,0.8)" : "var(--text-muted)", marginTop: 2, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

<style>{`
  @media (max-width: 768px) {
    .dashboard-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px; }
  }
`}</style>
