"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { authFetch } from "@/lib/auth-fetch";
import { useAuth } from "@/lib/auth-context";

interface Conversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  tenantMessage: string;
  ownerName: string;
  ownerId: string;
  status: string;
  createdAt: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

export default function InboxPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filter, setFilter] = useState<"all" | "new" | "replied">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const params = user.role === "owner"
      ? `ownerId=${user.id}`
      : `tenantEmail=${encodeURIComponent(user.email)}`;

    authFetch(`/api/inquiries?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => { setConversations(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError("Could not load conversations"); setLoading(false); });
  }, [user]);

  const filtered = filter === "all" ? conversations : conversations.filter((c) => c.status === filter);
  const newCount = conversations.filter((c) => c.status === "new").length;

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="page-cream">
      <Navbar />
      <div className="container-app" style={{ padding: "30px 20px 60px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 className="text-royal" style={{ fontSize: 26, fontWeight: 800 }}>Inbox</h1>
            <p style={{ fontSize: 14, color: "var(--rently-muted)", marginTop: 4 }}>
              {conversations.length} conversations · {newCount} new
            </p>
          </div>
          <Link href="/dashboard" className="btn btn-outline">← Dashboard</Link>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          {(["all", "new", "replied"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`btn ${filter === f ? "btn-primary" : "btn-outline"}`} style={{ textTransform: "capitalize" }}>
              {f === "all" ? "All" : f === "new" ? "New" : "Replied"}
              {f === "new" && newCount > 0 && (
                <span className="badge badge-accent" style={{ marginLeft: 4 }}>{newCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {!user ? (
          <div className="card-cream" style={{ padding: 50, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Sign in to view your inbox</h3>
            <p style={{ color: "var(--rently-muted)", marginBottom: 18 }}>You need to be logged in to access conversations.</p>
            <Link href="/auth/login" className="btn btn-primary">Sign in</Link>
          </div>
        ) : loading ? (
          <div style={{ display: "grid", gap: 12 }}>
            {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }} />)}
          </div>
        ) : error ? (
          <div className="card-cream" style={{ padding: 50, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{error}</h3>
            <p style={{ color: "var(--rently-muted)" }}>Please try refreshing the page.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card-cream" style={{ padding: 50, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No inquiries yet</h3>
            <p style={{ color: "var(--rently-muted)" }}>When tenants contact you, their inquiries will appear here.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map((conv) => (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className="card-cream"
                style={{
                  display: "block",
                  padding: "18px 20px",
                  borderLeft: conv.unread > 0 ? "4px solid var(--rently-accent)" : "4px solid transparent",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: conv.unread > 0 ? "linear-gradient(135deg, var(--rently-primary), var(--rently-primary-dark))" : "var(--rently-cream-dark)",
                    color: conv.unread > 0 ? "white" : "var(--rently-text)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 18, flexShrink: 0,
                  }}>
                    {conv.tenantName.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: conv.unread > 0 ? 800 : 600, color: "var(--rently-text)" }}>{conv.tenantName}</span>
                        {conv.status === "new" && <span className="badge badge-accent">NEW</span>}
                      </div>
                      <span style={{ fontSize: 12, color: "var(--rently-muted)" }}>{timeAgo(conv.lastMessageAt)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--rently-muted)", marginBottom: 4 }}>
                      Re: {conv.propertyTitle}
                    </div>
                    <p style={{ fontSize: 14, color: conv.unread > 0 ? "var(--rently-text)" : "var(--rently-muted)", fontWeight: conv.unread > 0 ? 600 : 400, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--rently-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{conv.unread}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
