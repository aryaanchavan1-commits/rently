"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/lang-context";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLang();
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div>
      <Navbar />
      <div className="hero-gradient" style={{ minHeight: "calc(100vh - 66px)", display: "flex", alignItems: "center", padding: "40px 0" }}>
        <div className="container-app" style={{ display: "flex", justifyContent: "center" }}>
          <div className="fade-in" style={{ background: "white", borderRadius: 18, padding: 36, width: "100%", maxWidth: 440, boxShadow: "0 14px 40px rgba(11,20,55,0.10)" }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{t.auth.welcomeBack} <span className="mark">Rently</span></h1>
            <p style={{ color: "#4b5675", fontSize: 14, marginBottom: 24 }}>{t.auth.loginSubtitle}</p>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", color: "#b91c1c", padding: "10px 14px", borderRadius: 10, fontSize: 14, marginBottom: 14 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
              <div>
                <label className="form-label">{t.auth.emailLabel}</label>
                <input
                  className="input"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">{t.auth.passwordLabel}</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="input"
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    style={{ paddingRight: 44 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#4b5675", fontSize: 13 }}>
                    {show ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: "100%", padding: "12px", fontSize: 15 }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span className="typing-dot" style={{ width: 6, height: 6, background: "white" }} />
                    <span className="typing-dot" style={{ width: 6, height: 6, background: "white" }} />
                    <span className="typing-dot" style={{ width: 6, height: 6, background: "white" }} />
                  </span>
                ) : t.auth.loginBtn}
              </button>
            </form>

            <div style={{ marginTop: 18, padding: 14, background: "#f4f6fb", borderRadius: 10, fontSize: 13 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{t.auth.demoLabel}</div>
              <div style={{ marginBottom: 4 }}>👤 {t.auth.tenant}: <code style={{ background: "#e3e7ef", padding: "2px 6px", borderRadius: 4 }}>demo@rently.in</code> / <code style={{ background: "#e3e7ef", padding: "2px 6px", borderRadius: 4 }}>demo1234</code></div>
              <div>🏠 {t.auth.owner}: <code style={{ background: "#e3e7ef", padding: "2px 6px", borderRadius: 4 }}>owner@rently.in</code> / <code style={{ background: "#e3e7ef", padding: "2px 6px", borderRadius: 4 }}>demo1234</code></div>
            </div>

            <p style={{ marginTop: 20, fontSize: 14, color: "#4b5675", textAlign: "center" }}>
              {t.auth.newTo} <Link href="/auth/signup" style={{ color: "#0d6efd", fontWeight: 700 }}>{t.auth.createAccount}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
