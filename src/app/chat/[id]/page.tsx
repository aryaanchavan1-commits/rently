"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/lang-context";

interface Message {
  id: string;
  conversationId: string;
  sender: "tenant" | "owner";
  senderName: string;
  content: string;
  createdAt: string;
  read: boolean;
}

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

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLang();
  const [conv, setConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [viewAs, setViewAs] = useState<"owner" | "tenant">("owner");
  const listRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    fetch(`/api/inquiries`)
      .then((r) => r.json())
      .then((data: Conversation[]) => {
        const found = data.find((c) => c.id === id);
        if (found) setConv(found);
      })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!id) return;
    function fetchMessages() {
      fetch(`/api/messages?conversationId=${id}`)
        .then((r) => r.json())
        .then((data: Message[]) => setMessages(data))
        .catch(() => {});
    }
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [id]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const msg = input.trim();
    setInput("");
    setSending(true);

    const senderName = viewAs === "owner" ? (conv?.ownerName || "Owner") : (conv?.tenantName || "Tenant");

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: id,
          sender: viewAs,
          senderName,
          content: msg,
        }),
      });
      const res = await fetch(`/api/messages?conversationId=${id}`);
      const data = await res.json();
      setMessages(data);
    } catch {
    } finally {
      setSending(false);
    }
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  }

  return (
    <div style={{ background: "#f7f8fc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="container-app" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 0 20px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
        {/* Chat Header */}
        {conv && (
          <div style={{ background: "white", borderRadius: "0 0 18px 18px", padding: "16px 20px", border: "1px solid #e3e7ef", borderTop: "none", marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Link href="/inbox" className="btn btn-ghost" style={{ padding: "6px 10px" }}>← {t.chat.back}</Link>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#0d6efd,#0a58ca)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>
                  {(viewAs === "owner" ? conv.tenantName : conv.ownerName).charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0b1437" }}>
                    {viewAs === "owner" ? conv.tenantName : conv.ownerName}
                  </div>
                  <div style={{ fontSize: 12, color: "#4b5675" }}>
                    {t.chat.propertyRef} {conv.propertyTitle}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 12, color: "#4b5675", background: "#f4f6fb", padding: "4px 10px", borderRadius: 8 }}>
                  {viewAs === "owner" ? "👤 Viewing as Owner" : "🏠 Viewing as Tenant"}
                </div>
                <button
                  onClick={() => setViewAs(viewAs === "owner" ? "tenant" : "owner")}
                  className="btn btn-outline"
                  style={{ padding: "6px 10px", fontSize: 12 }}
                >
                  Switch View
                </button>
              </div>
            </div>

            {/* Tenant info card (owner view) */}
            {viewAs === "owner" && (
              <div style={{ marginTop: 12, padding: 12, background: "#f4f6fb", borderRadius: 10, display: "flex", gap: 12, flexWrap: "wrap", fontSize: 13 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#4b5675" }}>📧</span>
                  <span style={{ fontWeight: 600 }}>{conv.tenantEmail}</span>
                </div>
                {conv.tenantPhone && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#4b5675" }}>📞</span>
                    <span style={{ fontWeight: 600 }}>{conv.tenantPhone}</span>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#4b5675" }}>💬</span>
                  <span style={{ fontWeight: 600, color: conv.status === "new" ? "#b45309" : "#047857" }}>{conv.status === "new" ? "New" : "Replied"}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "20px 0", display: "flex", flexDirection: "column", gap: 10, minHeight: 300 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#4b5675" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>💬</div>
              <p style={{ fontSize: 14 }}>No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: m.sender === viewAs ? "flex-end" : "flex-start", padding: "0 16px" }}>
              <div style={{ fontSize: 11, color: "#4b5675", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <span>{m.senderName}</span>
                <span>·</span>
                <span>{timeAgo(m.createdAt)}</span>
              </div>
              <div
                className={`chat-bubble ${m.sender === viewAs ? "user" : "bot"}`}
                style={{ maxWidth: "75%" }}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ background: "white", borderRadius: 18, padding: 14, border: "1px solid #e3e7ef", boxShadow: "0 -4px 20px rgba(11,20,55,0.06)" }}>
          <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
            <input
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chat.placeholder}
              style={{ flex: 1 }}
              disabled={sending}
            />
            <button type="submit" className="btn btn-primary" disabled={sending || !input.trim()} style={{ padding: "10px 18px" }}>
              {sending ? "…" : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
