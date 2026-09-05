"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";

type Step = "type" | "city" | "budget" | "location" | "done";

const CITIES = ["Mumbai", "Pune", "Thane", "Navi Mumbai", "Nagpur", "Nashik"];

const TYPES = [
  { key: "room", icon: "🛏️", label: "room" as const },
  { key: "flat", icon: "🏢", label: "flat" as const },
  { key: "house", icon: "🏠", label: "house" as const },
  { key: "pg", icon: "🏨", label: "pg" as const },
  { key: "office", icon: "💼", label: "office" as const },
];

const BUDGETS = [
  { key: "b1", label: "budget1" as const },
  { key: "b2", label: "budget2" as const },
  { key: "b3", label: "budget3" as const },
  { key: "b4", label: "budget4" as const },
  { key: "b5", label: "budget5" as const },
];

interface Props {
  onComplete: (prefs: { type: string; city: string; budget: string; lat?: number; lng?: number }) => void;
  onClose: () => void;
}

export default function AIOnboarding({ onComplete, onClose }: Props) {
  const { t, lang } = useLang();
  const [step, setStep] = useState<Step>("type");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [step]);

  function handleLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        finish({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocating(false);
        setError("Location access denied. You can still search by city.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  function finish(loc?: { lat: number; lng: number }) {
    const prefs = {
      type: selectedType,
      city: selectedCity,
      budget: selectedBudget,
      ...(loc || location ? { lat: (loc || location)!.lat, lng: (loc || location)!.lng } : {}),
    };
    setStep("done");
    setTimeout(() => onComplete(prefs), 600);
  }

  function next() {
    if (step === "type" && selectedType) setStep("city");
    else if (step === "city" && selectedCity) setStep("budget");
    else if (step === "budget" && selectedBudget) setStep("location");
  }

  function back() {
    if (step === "city") setStep("type");
    else if (step === "budget") setStep("city");
    else if (step === "location") setStep("budget");
  }

  return (
    <div className="fade-in" style={{ maxWidth: 440, margin: "0 auto", padding: "20px 0" }}>
      <div style={{ background: "white", borderRadius: 18, boxShadow: "0 24px 60px rgba(11,20,55,0.15)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#0d6efd 0%,#0a58ca 50%,#ff6a3d 100%)", padding: "20px 24px", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Ria</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>AI Rental Assistant</div>
            </div>
          </div>
          <p style={{ fontSize: 14, opacity: 0.95, margin: 0 }}>{t.onboarding.title}</p>
        </div>

        {/* Progress */}
        <div style={{ padding: "0 24px", marginTop: 16 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["type", "city", "budget", "location"].map((s, i) => (
              <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background:
                (step === "type" && i === 0) || (step === "city" && i <= 1) || (step === "budget" && i <= 2) || (step === "location" && i <= 3) || step === "done"
                  ? "linear-gradient(90deg,#0d6efd,#ff6a3d)" : "#e3e7ef"
              }} />
            ))}
          </div>
        </div>

        {/* Steps */}
        <div ref={listRef} style={{ padding: 24, minHeight: 280 }}>
          {step === "done" && (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{ fontSize: 50, marginBottom: 12 }}>✨</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0b1437", marginBottom: 8 }}>
                {lang === "en" ? "Perfect! Finding matches…" : "Found it! Finding matches…"}
              </h3>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
                <span className="typing-dot" style={{ width: 8, height: 8, background: "#0d6efd" }} />
                <span className="typing-dot" style={{ width: 8, height: 8, background: "#0d6efd" }} />
                <span className="typing-dot" style={{ width: 8, height: 8, background: "#0d6efd" }} />
              </div>
            </div>
          )}

          {step === "type" && (
            <div className="fade-in">
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0b1437", marginBottom: 16 }}>
                {t.onboarding.step1}
              </h3>
              <div style={{ display: "grid", gap: 10 }}>
                {TYPES.map((tp) => (
                  <button
                    key={tp.key}
                    onClick={() => setSelectedType(tp.key)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                      borderRadius: 12, border: selectedType === tp.key ? "2px solid #0d6efd" : "1px solid #e3e7ef",
                      background: selectedType === tp.key ? "rgba(13,110,253,0.06)" : "white",
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{tp.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#0b1437" }}>{t.onboarding[tp.label]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "city" && (
            <div className="fade-in">
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0b1437", marginBottom: 16 }}>
                {t.onboarding.step2}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    style={{
                      padding: "14px 12px", borderRadius: 12,
                      border: selectedCity === city ? "2px solid #0d6efd" : "1px solid #e3e7ef",
                      background: selectedCity === city ? "rgba(13,110,253,0.06)" : "white",
                      cursor: "pointer", textAlign: "center", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 4 }}>📍</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0b1437" }}>{city}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "budget" && (
            <div className="fade-in">
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0b1437", marginBottom: 16 }}>
                {t.onboarding.step3}
              </h3>
              <div style={{ display: "grid", gap: 10 }}>
                {BUDGETS.map((b) => (
                  <button
                    key={b.key}
                    onClick={() => setSelectedBudget(b.key)}
                    style={{
                      padding: "14px 16px", borderRadius: 12, textAlign: "left",
                      border: selectedBudget === b.key ? "2px solid #0d6efd" : "1px solid #e3e7ef",
                      background: selectedBudget === b.key ? "rgba(13,110,253,0.06)" : "white",
                      cursor: "pointer", transition: "all 0.15s",
                      fontSize: 15, fontWeight: 600, color: "#0b1437",
                    }}
                  >
                    💰 {t.onboarding[b.label]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "location" && (
            <div className="fade-in">
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0b1437", marginBottom: 8 }}>
                {t.onboarding.step4}
              </h3>
              <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>
                {lang === "en" ? "We'll show properties closest to you. Your location is only used for this search." : "तुमच्या जवळच्या मालमत्ता दर्शवू. तुमचे स्थान या शोधासाठी वापरले जाते."}
              </p>
              {error && (
                <div style={{ background: "rgba(245,158,11,0.1)", padding: "10px 14px", borderRadius: 10, fontSize: 14, color: "#b45309", marginBottom: 16 }}>
                  ⚠️ {error}
                </div>
              )}
              <div style={{ display: "grid", gap: 10 }}>
                <button
                  onClick={handleLocation}
                  disabled={locating}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "14px", fontSize: 15 }}
                >
                  {locating ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <span className="typing-dot" style={{ width: 6, height: 6, background: "white" }} />
                      <span className="typing-dot" style={{ width: 6, height: 6, background: "white" }} />
                      <span className="typing-dot" style={{ width: 6, height: 6, background: "white" }} />
                      {lang === "en" ? "Getting location…" : "स्थान मिळवत आहे…"}
                    </span>
                  ) : (
                    <>📍 {t.onboarding.shareLocation}</>
                  )}
                </button>
                <button onClick={() => finish()} className="btn btn-outline" style={{ width: "100%", padding: "14px", fontSize: 15 }}>
                  {t.onboarding.skip}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        {step !== "location" && step !== "done" && (
          <div style={{ padding: "0 24px 20px", display: "flex", gap: 10 }}>
            {step !== "type" && (
              <button onClick={back} className="btn btn-outline" style={{ flex: 1 }}>
                ← {t.onboarding.back}
              </button>
            )}
            <button
              onClick={next}
              className="btn btn-primary"
              style={{ flex: step === "type" ? 1 : 1, padding: "12px" }}
              disabled={
                (step === "type" && !selectedType) ||
                (step === "city" && !selectedCity) ||
                (step === "budget" && !selectedBudget)
              }
            >
              {step === "budget" ? t.onboarding.done : "→"}
            </button>
          </div>
        )}

        {/* Close */}
        <div style={{ padding: "0 24px 16px", textAlign: "center" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4b5675", fontSize: 13, cursor: "pointer" }}>
            {lang === "en" ? "Skip onboarding, I'll browse manually" : "ऑनबोर्डिंग सोडा, मी स्वतंत्र ब्राउझ करेन"}
          </button>
        </div>
      </div>
    </div>
  );
}
