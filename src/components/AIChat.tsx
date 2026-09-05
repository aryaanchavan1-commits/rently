"use client";

import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "assistant"; content: string; id: number };

const SUGGESTIONS = [
  "2BHK in Pune under 25,000",
  "1BHK in Andheri for family",
  "PG in Hinjewadi",
  "Top localities in Nagpur",
  "How much is the ₹49 plan?",
];

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 0,
      role: "assistant",
      content:
        "Namaste! I'm Ria 👋, your Rently rental assistant. Ask me about flats, PGs, areas, or owner plans in Maharashtra.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function send(text?: string) {
    const message = (text ?? input).trim();
    if (!message || loading) return;
    setInput("");
    const userMsg: Msg = { id: Date.now(), role: "user", content: message };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, role: "assistant", content: data.response || "I couldn't process that. Please try again." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        aria-label="Open Ria — AI rental assistant"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          right: 22,
          bottom: 22,
          zIndex: 60,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: open
            ? "#0b1437"
            : "linear-gradient(135deg,#ff6a3d 0%,#f94234 100%)",
          color: "white",
          border: "none",
          boxShadow: "0 14px 30px rgba(255, 106, 61, 0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M21 12c0 4.418-4.03 8-9 8-1.16 0-2.27-.18-3.27-.51L3 21l1.51-4.77C3.6 15.07 3 13.59 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" fill="white" />
            <circle cx="9" cy="12" r="1.3" fill="#ff6a3d" />
            <circle cx="12" cy="12" r="1.3" fill="#ff6a3d" />
            <circle cx="15" cy="12" r="1.3" fill="#ff6a3d" />
          </svg>
        )}
        {!open && (
          <span
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#10b981",
              border: "2px solid white",
            }}
          />
        )}
      </button>

      {open && (
        <div
          className="fade-in"
          style={{
            position: "fixed",
            right: 22,
            bottom: 96,
            width: 380,
            maxWidth: "calc(100vw - 28px)",
            height: 560,
            maxHeight: "calc(100vh - 120px)",
            background: "white",
            borderRadius: 18,
            boxShadow: "0 24px 60px rgba(11,20,55,0.25)",
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #e3e7ef",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg,#0d6efd 0%,#0a58ca 50%,#ff6a3d 100%)",
              color: "white",
              padding: "16px 18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Ria</div>
                <div style={{ fontSize: 12, opacity: 0.9, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                  AI Rental Agent · Maharashtra
                </div>
              </div>
            </div>
          </div>

          <div
            ref={listRef}
            style={{
              flex: 1,
              padding: 16,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              background: "#f4f6fb",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-bubble ${m.role === "user" ? "user" : "bot"} fade-in`}
                style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start" }}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble bot" style={{ alignSelf: "flex-start" }}>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            )}
            {messages.length <= 1 && !loading && (
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: 11, color: "#4b5675", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700, marginBottom: 8 }}>
                  Try asking
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      style={{
                        fontSize: 12,
                        padding: "7px 11px",
                        borderRadius: 999,
                        background: "white",
                        border: "1px solid #d3d8e1",
                        color: "#0b1437",
                        cursor: "pointer",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            style={{
              padding: 12,
              background: "white",
              borderTop: "1px solid #e3e7ef",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              className="input"
              placeholder="Ask Ria anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !input.trim()}
              style={{ padding: "10px 14px" }}
              aria-label="Send"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
