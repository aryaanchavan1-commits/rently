"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/lang-context";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const [role, setRole] = useState<"tenant" | "owner">("tenant");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t, lang } = useLang();
  const { signup } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const result = await signup(email, password, name, phone, role);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2000);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="hero-gradient" style={{ minHeight: "calc(100vh - 66px)", display: "flex", alignItems: "center", padding: "40px 0" }}>
        <div className="container-app" style={{ display: "flex", justifyContent: "center" }}>
          <div className="fade-in" style={{ background: "white", borderRadius: 18, padding: 36, width: "100%", maxWidth: 500, boxShadow: "0 14px 40px rgba(11,20,55,0.10)" }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{t.auth.createTitle} <span className="mark">Rently</span> {lang === "en" ? "account" : ""}</h1>
            <p style={{ color: "#4b5675", fontSize: 14, marginBottom: 22 }}>{t.auth.signupSubtitle}</p>

            {success && (
              <div style={{ background: "rgba(16,185,129,0.08)", color: "#047857", padding: "14px", borderRadius: 10, fontSize: 14, marginBottom: 18, textAlign: "center" }}>
                ✅ Account created! Redirecting to login…
              </div>
            )}

            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", color: "#b91c1c", padding: "10px 14px", borderRadius: 10, fontSize: 14, marginBottom: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18, padding: 4, background: "#f4f6fb", borderRadius: 12 }}>
              <button type="button" onClick={() => setRole("tenant")} style={{ padding: 12, borderRadius: 9, border: "none", background: role === "tenant" ? "white" : "transparent", color: "#0b1437", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: role === "tenant" ? "0 2px 8px rgba(11,20,55,0.08)" : "none" }}>🏠 {t.auth.tenant}</button>
              <button type="button" onClick={() => setRole("owner")} style={{ padding: 12, borderRadius: 9, border: "none", background: role === "owner" ? "white" : "transparent", color: "#0b1437", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: role === "owner" ? "0 2px 8px rgba(11,20,55,0.08)" : "none" }}>🪙 {t.auth.owner}</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
              <div>
                <label className="form-label">{t.auth.nameLabel}</label>
                <input
                  className="input"
                  placeholder={lang === "en" ? "Your full name" : lang === "mr" ? "तुमचे पूर्ण नाव" : "आपका पूरा नाम"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">{t.auth.email}</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">{t.auth.phone}</label>
                  <input
                    className="input"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">{t.auth.passwordMin}</label>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || success}
                style={{ width: "100%", padding: "12px", fontSize: 15 }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span className="typing-dot" style={{ width: 6, height: 6, background: "white" }} />
                    <span className="typing-dot" style={{ width: 6, height: 6, background: "white" }} />
                    <span className="typing-dot" style={{ width: 6, height: 6, background: "white" }} />
                  </span>
                ) : role === "owner" ? t.auth.createOwner : t.auth.createTenant}
              </button>
            </form>

            <p style={{ marginTop: 20, fontSize: 14, color: "#4b5675", textAlign: "center" }}>
              {t.auth.alreadyMember} <Link href="/auth/login" style={{ color: "#0d6efd", fontWeight: 700 }}>{t.auth.loginHere}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
