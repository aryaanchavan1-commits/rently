"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filter, setFilter] = useState<"all" | "new" | "replied">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inquiries?ownerId=owner-1")
      .then((r) => r.json())
      .then((data) => { setConversations(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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
    <div style={{ background: "#f7f8fc", minHeight: "100vh" }}>
      <Navbar />
      <div className="container-app" style={{ padding: "30px 20px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0b1437" }}>Inbox</h1>
            <p style={{ fontSize: 14, color: "#4b5675" }}>{conversations.length} conversations · {newCount} new</p>
          </div>
          <Link href="/dashboard" className="btn btn-outline">← Dashboard</Link>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["all", "new", "replied"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`btn ${filter === f ? "btn-secondary" : "btn-outline"}`} style={{ textTransform: "capitalize" }}>
              {f} {f === "new" && newCount > 0 && <span style={{ background: "#ff6a3d", color: "white", borderRadius: 999, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>{newCount}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "grid", gap: 12 }}>
            {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "white", borderRadius: 18, padding: 50, textAlign: "center", border: "1px solid #e3e7ef" }}>
            <div style={{ fontSize: 50, marginBottom: 12 }}>📭</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No inquiries yet</h3>
            <p style={{ color: "#4b5675" }}>When tenants contact you, their inquiries will appear here.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {filtered.map((conv) => (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                style={{
                  display: "block",
                  background: "white",
                  borderRadius: 14,
                  padding: 18,
                  border: conv.unread > 0 ? "2px solid #0d6efd" : "1px solid #e3e7ef",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "all 0.15s",
                }}
                className="property-card"
              >
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: conv.unread > 0 ? "linear-gradient(135deg,#0d6efd,#0a58ca)" : "#f4f6fb", color: conv.unread > 0 ? "white" : "#0b1437", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                    {conv.tenantName.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: conv.unread > 0 ? 800 : 600, color: "#0b1437" }}>{conv.tenantName}</span>
                        {conv.status === "new" && <span className="badge badge-warn" style={{ fontSize: 10 }}>NEW</span>}
                      </div>
                      <span style={{ fontSize: 12, color: "#4b5675" }}>{timeAgo(conv.lastMessageAt)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#4b5675", marginBottom: 4 }}>
                      Re: {conv.propertyTitle}
                    </div>
                    <p style={{ fontSize: 14, color: conv.unread > 0 ? "#0b1437" : "#4b5675", fontWeight: conv.unread > 0 ? 600 : 400, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {conv.lastMessage}
                    </p>
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
      <Footer />
    </div>
  );
}
