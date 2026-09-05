"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/lib/lang-context";

const benefits = [
  { icon: "🪙", en: "Save ₹20K–40K vs brokers", mr: "ब्रोकरांपेक्षा ₹20K–40K बचत", hi: "ब्रोकरों से ₹20K–40K बचाएं" },
  { icon: "🤖", en: "AI-powered tenant matching", mr: "AI-शक्तीवर आधारित भाडेदार जुळवणी", hi: "AI-संचालित किरायेदार मैचिंग" },
  { icon: "✅", en: "Verified tenant profiles", mr: "पडताळलेले भाडेदार प्रोफाइल्स", hi: "सत्यापित किरायेदार प्रोफ़ाइल" },
  { icon: "💬", en: "Direct chat with tenants", mr: "भाडेदारांशी थेट चॅट", hi: "किरायेदारों से सीधी चैट" },
  { icon: "📊", en: "Real-time analytics", mr: "रीयल-टाइम विश्लेषण", hi: "रीयल-टाइम एनालिटिक्स" },
  { icon: "🔒", en: "Secure payments via Razorpay", mr: "Razorpay द्वारे सुरक्षित पेमेंट्स", hi: "Razorpay के माध्यम से सुरक्षित भुगतान" },
];

const steps = [
  { num: "1", en: "Sign up in 60 seconds", mr: "६० सेकंदात साइन अप करा", hi: "60 सेकंड में साइन अप करें" },
  { num: "2", en: "Pay just ₹49/week", mr: "फक्त ₹४९/आठवडा भरा", hi: "सिर्फ ₹49/सप्ताह भरें" },
  { num: "3", en: "List unlimited properties", mr: "अमर्यादित मालमत्ता सूचीबद्ध करा", hi: "असीमित संपत्ति सूचीबद्ध करें" },
  { num: "4", en: "Get leads directly", mr: "थेट लीड्स मिळवा", hi: "सीधे लीड पाएं" },
];

const stats = [
  { n: "10,000+", en: "Active listings", mr: "सक्रिय यादी", hi: "सक्रिय लिस्टिंग" },
  { n: "5,000+", en: "Happy owners", mr: "सुखी मालक", hi: "खुश मालिक" },
  { n: "50,000+", en: "Tenants searched", mr: "भाडेदारांनी शोधले", hi: "किरायेदारों ने खोजा" },
  { n: "6", en: "Maharashtra cities", mr: "महाराष्ट्र शहरे", hi: "महाराष्ट्र शहर" },
];

export default function OwnerPage() {
  const { t, lang } = useLang();
  const l = lang === "mr" ? "mr" : lang === "hi" ? "hi" : "en";

  return (
    <div>
      <Navbar />
      <div className="hero-gradient" style={{ padding: "60px 0 50px", position: "relative", overflow: "hidden" }}>
        <div className="container-app">
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 50, alignItems: "center" }} className="hero-grid">
            <div className="fade-in">
              <div className="badge badge-warn" style={{ marginBottom: 16 }}>🏠 {l === "mr" ? "मालकांसाठी" : l === "hi" ? "मालिकों के लिए" : "For Property Owners"}</div>
              <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: -1, color: "#0b1437" }}>
                {t.owner.title}
              </h1>
              <p style={{ fontSize: 17, color: "#4b5675", marginTop: 16, lineHeight: 1.6, maxWidth: 540 }}>
                {t.owner.subtitle}
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                <Link href="/auth/signup" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: 16 }}>
                  {t.owner.cta}
                </Link>
                <Link href="/pricing" className="btn btn-outline" style={{ padding: "14px 28px", fontSize: 16 }}>
                  {l === "mr" ? "किंमत पहा" : l === "hi" ? "कीमत देखें" : "View Pricing"} →
                </Link>
              </div>
              <div style={{ display: "flex", gap: 28, marginTop: 30, flexWrap: "wrap" }}>
                {stats.map((s) => (
                  <div key={s.en}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#0b1437" }}>{s.n}</div>
                    <div style={{ fontSize: 13, color: "#4b5675", marginTop: 4 }}>{s[l as keyof typeof s]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-art" style={{ position: "relative", height: 400 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "linear-gradient(135deg,#ff6a3d 0%,#f94234 50%,#0d6efd 100%)", boxShadow: "0 30px 70px rgba(255,106,61,0.3)", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.25) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: 30, left: 30, right: 30, background: "rgba(255,255,255,0.95)", borderRadius: 16, padding: 18, backdropFilter: "blur(10px)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#10b981,#059669)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20 }}>💰</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>{l === "mr" ? "थेट पेमेंट" : l === "hi" ? "सीधा भुगतान" : "Payment Received"}</div>
                      <div style={{ fontSize: 12, color: "#4b5675" }}>{l === "mr" ? "अभिषेक यांनी ₹22,000 पाठवले" : l === "hi" ? "अभिषेक ने ₹22,000 भेजे" : "Abhishek sent ₹22,000"}</div>
                    </div>
                  </div>
                  <div style={{ background: "#f0fdf4", padding: "8px 12px", borderRadius: 10, fontSize: 13, color: "#047857" }}>
                    ✅ {l === "mr" ? "₹२२,००० मिळाले – 2BHK अंधेरी" : l === "hi" ? "₹22,000 प्राप्त – 2BHK अंधेरी" : "₹22,000 received — 2BHK Andheri"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media (max-width:900px){.hero-grid{grid-template-columns:1fr!important}.hero-art{display:none!important}}`}</style>
      </div>

      {/* Steps */}
      <section style={{ padding: "50px 0" }}>
        <div className="container-app">
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "#0b1437" }}>
              {l === "mr" ? "३ सोप्या पायऱ्यांत सुरू करा" : l === "hi" ? "3 आसान चरणों में शुरू करें" : "Get started in 3 easy steps"}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {steps.map((s) => (
              <div key={s.num} style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e3e7ef", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#0d6efd,#0a58ca)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, margin: "0 auto 14px" }}>{s.num}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0b1437" }}>{s[l as keyof typeof s]}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: "10px 0 50px" }}>
        <div className="container-app">
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "#0b1437" }}>
              {l === "mr" ? "रेंटली का वापर का?" : l === "hi" ? "रेंटली ही क्यों?" : "Why Rently for owners?"}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {benefits.map((b) => (
              <div key={b.en} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "white", borderRadius: 16, padding: 20, border: "1px solid #e3e7ef" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(13,110,253,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{b.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0b1437", lineHeight: 1.4 }}>{b[l as keyof typeof b]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 0 60px" }}>
        <div className="container-app">
          <div style={{ borderRadius: 24, padding: "50px 40px", background: "linear-gradient(135deg,#0b1437 0%,#1c2a5e 60%,#ff6a3d 130%)", color: "white", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 800, marginBottom: 12 }}>
              {l === "mr" ? "तयार आहात? आजच सुरू करा!" : l === "hi" ? "तैयार हैं? आज ही शुरू करें!" : "Ready? Start listing today!"}
            </h2>
            <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 500, margin: "0 auto 24px", lineHeight: 1.6 }}>
              {l === "mr" ? "₹४९/आठवडाला मालमत्ता सूचीबद्ध करा. कधीही रद्द करा." : l === "hi" ? "₹49/सप्ताह में संपत्ति सूचीबद्ध करें। कभी भी रद्द करें।" : "List your property for just ₹49/week. Cancel anytime."}
            </p>
            <Link href="/auth/signup" className="btn" style={{ background: "white", color: "#0b1437", padding: "14px 28px", fontSize: 16 }}>
              {t.owner.cta} →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
