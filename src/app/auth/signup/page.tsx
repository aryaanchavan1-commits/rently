"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const [role, setRole] = useState<"tenant" | "owner">("tenant");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
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
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-container">
        <div className="login-card fade-in">
          <div className="login-logo">
            <div className="login-logo-icon">N</div>
            <div>
              <span className="login-logo-text">Ni<span style={{ color: "var(--primary)" }}>vasa</span></span>
              <span className="login-logo-byline">by Arynoxtech</span>
            </div>
          </div>

          <h1 className="login-title">{t.auth.createTitle} <span style={{ color: "var(--primary)", fontWeight: 800 }}>Nivasa</span></h1>
          <p className="login-subtitle">{t.auth.signupSubtitle}</p>

          {success && (
            <div className="login-success">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#059669" opacity="0.15"/><path d="M5 8l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {lang === "en" ? "Account created! Redirecting to login..." : lang === "mr" ? "खाते तयार झाले! लॉगिनवर जात आहे..." : "खाता बन गया! लॉगिन पर जा रहे हैं..."}
            </div>
          )}

          {error && (
            <div className="login-error">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#ef4444" opacity="0.15"/><path d="M8 4v5M8 11h.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/></svg>
              {error}
            </div>
          )}

          <div className="signup-role-toggle">
            <button type="button" onClick={() => setRole("tenant")} className={`signup-role-btn ${role === "tenant" ? "active" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              {t.auth.tenant}
            </button>
            <button type="button" onClick={() => setRole("owner")} className={`signup-role-btn ${role === "owner" ? "active" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              {t.auth.owner}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label className="login-label">{t.auth.nameLabel}</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                  className="login-input"
                  placeholder={lang === "en" ? "Your full name" : lang === "mr" ? "तुमचे पूर्ण नाव" : "आपका पूरा नाम"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">{t.auth.email}</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input
                  className="login-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">{t.auth.phone} ({lang === "en" ? "optional" : lang === "mr" ? "पर्यायी" : "वैकल्पिक"})</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <input
                  className="login-input"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">{t.auth.passwordMin}</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  className="login-input"
                  type={show ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShow(!show)} className="login-eye-btn" aria-label={show ? "Hide password" : "Show password"}>
                  {show ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading || success}>
              {loading ? (
                <span className="login-spinner" />
              ) : role === "owner" ? t.auth.createOwner : t.auth.createTenant}
            </button>
          </form>

          <p className="login-signup" style={{ marginTop: 20 }}>
            {t.auth.alreadyMember} <Link href="/auth/login" className="login-signup-link">{t.auth.loginHere}</Link>
          </p>
        </div>
      </div>

      <style>{`
        .signup-role-toggle {
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
          padding: 4px; background: var(--bg); border-radius: 12px; margin-bottom: 16px;
        }
        .signup-role-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 12px; border-radius: 9px; border: none;
          background: transparent; color: var(--text-secondary);
          font-weight: 600; font-size: 14px; cursor: pointer;
          transition: all 0.15s;
        }
        .signup-role-btn.active {
          background: white; color: var(--text);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .login-success {
          display: flex; align-items: center; gap: 8px;
          background: #ecfdf5; color: #047857; padding: 10px 14px;
          border-radius: 10px; font-size: 13px; margin-bottom: 16px;
        }
        .login-page {
          min-height: 100vh; display: flex; flex-direction: column;
          position: relative; overflow: hidden;
        }
        .login-bg {
          position: fixed; inset: 0; z-index: 0;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1a56db 100%);
        }
        .login-bg::before {
          content: ""; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 30% 20%, rgba(26,86,219,0.3) 0%, transparent 60%),
                      radial-gradient(ellipse at 70% 80%, rgba(245,158,11,0.15) 0%, transparent 60%);
        }
        .login-container {
          position: relative; z-index: 1; flex: 1; display: flex;
          align-items: center; justify-content: center;
          padding: 24px 16px;
        }
        .login-card {
          background: white; border-radius: 20px; padding: 32px 28px;
          width: 100%; max-width: 420px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .login-logo {
          display: flex; align-items: center; gap: 10px; margin-bottom: 24px;
        }
        .login-logo-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: var(--primary); color: white;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 18px;
        }
        .login-logo-text {
          font-size: 22px; font-weight: 800; color: var(--text);
          display: block; line-height: 1.1;
        }
        .login-logo-byline {
          font-size: 11px; color: var(--text-muted); display: block; margin-top: 1px;
        }
        .login-title {
          font-size: 24px; font-weight: 800; color: var(--text);
          margin-bottom: 4; line-height: 1.2;
        }
        .login-subtitle {
          font-size: 14px; color: var(--text-muted); margin-bottom: 24px; line-height: 1.5;
        }
        .login-error {
          display: flex; align-items: center; gap: 8px;
          background: #fef2f2; color: #b91c1c; padding: 10px 14px;
          border-radius: 10px; font-size: 13px; margin-bottom: 16px;
        }
        .login-form { display: grid; gap: 16px; }
        .login-field { display: flex; flex-direction: column; gap: 6px; }
        .login-label {
          font-size: 13px; font-weight: 600; color: var(--text);
        }
        .login-input-wrap {
          position: relative; display: flex; align-items: center;
        }
        .login-input-icon {
          position: absolute; left: 14px; color: var(--text-muted); pointer-events: none;
        }
        .login-input {
          width: 100%; height: 48px; padding: 0 14px 0 42px;
          border: 1.5px solid var(--border); border-radius: 10px;
          font-size: 15px; background: var(--bg); color: var(--text);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .login-input:focus {
          outline: none; border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
        }
        .login-input::placeholder { color: var(--text-muted); }
        .login-eye-btn {
          position: absolute; right: 12px; background: none; border: none;
          color: var(--text-muted); cursor: pointer; padding: 4px;
          display: flex; align-items: center; justify-content: center;
        }
        .login-eye-btn:hover { color: var(--text); }
        .login-submit {
          width: 100%; height: 48px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, var(--primary), #1e40af);
          color: white; font-weight: 700; font-size: 15px;
          cursor: pointer; transition: all 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .login-submit:hover {
          box-shadow: 0 4px 16px rgba(26,86,219,0.4);
          transform: translateY(-1px);
        }
        .login-submit:active { transform: translateY(0); }
        .login-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .login-spinner {
          width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: white; border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-signup {
          text-align: center; font-size: 14px; color: var(--text-muted);
          margin: 0;
        }
        .login-signup-link {
          color: var(--primary); font-weight: 700; text-decoration: none;
        }
        .login-signup-link:hover { text-decoration: underline; }
        @media (max-width: 480px) {
          .login-card { padding: 24px 20px; border-radius: 16px; }
          .login-title { font-size: 22px; }
        }
      `}</style>
    </div>
  );
}
