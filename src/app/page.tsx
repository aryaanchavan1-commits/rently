"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import { useLang } from "@/lib/lang-context";

const MAHARASHTRA_CITIES = [
  { name: "Mumbai", nameMr: "मुंबई", nameHi: "मुंबई", count: 12500 },
  { name: "Pune", nameMr: "पुणे", nameHi: "पुणे", count: 8200 },
  { name: "Thane", nameMr: "ठाणे", nameHi: "ठाणे", count: 4100 },
  { name: "Nagpur", nameMr: "नागपूर", nameHi: "नागपुर", count: 3200 },
  { name: "Nashik", nameMr: "नाशिक", nameHi: "नासिक", count: 2100 },
  { name: "Aurangabad", nameMr: "औरंगाबाद", nameHi: "औरंगाबाद", count: 1800 },
  { name: "Kolhapur", nameMr: "कोल्हापूर", nameHi: "कोल्हापुर", count: 1500 },
  { name: "Solapur", nameMr: "सोलापूर", nameHi: "सोलापुर", count: 1200 },
  { name: "Satara", nameMr: "सातारा", nameHi: "सातारा", count: 800 },
  { name: "Nanded", nameMr: "नांदेड", nameHi: "नांदेड", count: 700 },
  { name: "Amravati", nameMr: "अमरावती", nameHi: "अमरावती", count: 600 },
  { name: "Ratnagiri", nameMr: "रत्नागिरी", nameHi: "रत्नागिरि", count: 400 },
];

const FEATURES = [
  {
    icon: "🔍",
    title: { en: "Smart Search", mr: "स्मार्ट शोध", hi: "स्मार्ट खोज" },
    desc: {
      en: "Find properties by location, budget, BHK, commute time. AI-powered recommendations.",
      mr: "स्थान, बजेट, BHK, प्रवास वेळेनुसार शोधा. AI-शक्तीच्या शिफारसी.",
      hi: "स्थान, बजट, BHK, यात्रा के समय से खोजें। AI-संचालित सुझाव।",
    },
  },
  {
    icon: "🤖",
    title: { en: "Ria AI Assistant", mr: "रिआ AI सहाय्यक", hi: "रिआ AI सहायक" },
    desc: {
      en: "Chat with Ria in Marathi, Hindi or English. She finds properties, answers questions.",
      mr: "रिआशी मराठी, हिंदी किंवा इंग्रजीत चॅट करा. ती मालमत्ता शोधते, प्रश्नांचे उत्तर देते.",
      hi: "रिआ से मराठी, हिंदी या अंग्रेजी में चैट करें। वह प्रॉपर्टी खोजती है, सवालों के जवाब देती है।",
    },
  },
  {
    icon: "📝",
    title: { en: "E-Contracts", mr: "ई-करार", hi: "ई-करार" },
    desc: {
      en: "Generate AI-powered rental agreements. eSign with Aadhaar. Download PDF. Just ₹50.",
      mr: "AI-शक्तीचे भाडे करार तयार करा. Aadhaar ने eSign करा. PDF डाउनलोड करा. फक्त ₹50.",
      hi: "AI-संचालित किराया समझौता बनाएं। Aadhaar से eSign करें। PDF डाउनलोड करें। केवल ₹50।",
    },
  },
  {
    icon: "🗺️",
    title: { en: "Live Map", mr: "लाइव्ह नकाशा", hi: "लाइव मानचित्र" },
    desc: {
      en: "Explore properties on interactive map. See nearby schools, hospitals, metro.",
      mr: "इंटरॅक्टिव्ह नकाशावर मालमत्ता शोधा. जवळचे शाळा, रुग्णालये, मेट्रो पहा.",
      hi: "इंटरैक्टिव मानचित्र पर प्रॉपर्टी खोजें। पास के स्कूल, अस्पताल, मेट्रो देखें।",
    },
  },
  {
    icon: "🚌",
    title: { en: "Commute Search", mr: "प्रवास शोध", hi: "यात्रा खोज" },
    desc: {
      en: "Find properties near your workplace. 35+ destinations. Real travel time.",
      mr: "तुमच्या कार्यालयाजवळील मालमत्ता शोधा. 35+ गंतव्ये. खरी प्रवास वेळ.",
      hi: "अपने कार्यालय के पास प्रॉपर्टी खोजें। 35+ गंतव्य। वास्तविक यात्रा का समय।",
    },
  },
  {
    icon: "💰",
    title: { en: "True Cost", mr: "खरी किंमत", hi: "सही कीमत" },
    desc: {
      en: "See actual monthly cost including deposit, maintenance, utilities.",
      mr: "भांडवल, देखभाल, उपयोगिता सहित वास्तविक मासिक खर्च पहा.",
      hi: "जमा, रखरखाव, उपयोगिताओं सहित वास्तविक मासिक लागत देखें।",
    },
  },
  {
    icon: "📱",
    title: { en: "Trilingual Support", mr: "त्रिभाषिक समर्थन", hi: "त्रिभाषी समर्थन" },
    desc: {
      en: "Full app in Marathi, Hindi and English. Choose your language.",
      mr: "मराठी, हिंदी आणि इंग्रजीत संपूर्ण ॲप. तुमची भाषा निवडा.",
      hi: "मराठी, हिंदी और अंग्रेजी में पूरा ऐप। अपनी भाषा चुनें।",
    },
  },
  {
    icon: "🔐",
    title: { en: "Verified Listings", mr: "सत्यापित यादी", hi: "सत्यापित लिस्टिंग" },
    desc: {
      en: "Every property verified. Trust scores. Social proof.",
      mr: "प्रत्येक मालमत्ता सत्यापित. विश्वास स्कोअर. सामाजिक प्रमाण.",
      hi: "हर प्रॉपर्टी सत्यापित। ट्रस्ट स्कोर। सामाजिक प्रमाण।",
    },
  },
];

const STATS = [
  { value: "30,000+", label: { en: "Properties", mr: "मालमत्ता", hi: "प्रॉपर्टी" } },
  { value: "13+", label: { en: "Cities", mr: "शहरे", hi: "शहर" } },
  { value: "50,000+", label: { en: "Happy Users", mr: "समाधान वापरकर्ते", hi: "खुश उपयोगकर्ता" } },
  { value: "₹50", label: { en: "E-Contract", mr: "ई-करार", hi: "ई-करार" } },
];

export default function HomePage() {
  const { lang } = useLang();
  const [searchType, setSearchType] = useState<"rent" | "buy" | "pg">("rent");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);

  const t = (en: string, mr: string, hi: string) => lang === "mr" ? mr : lang === "hi" ? hi : en;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % MAHARASHTRA_CITIES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app">
      <Navbar />

      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, #0f1b2d 0%, #1a365d 30%, #2c5282 60%, #2b6cb0 100%)",
        padding: "100px 20px 120px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative orbs */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,148,74,0.15) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)" }} />
        <div className="container-app" style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div className="animate-slide-up" style={{
            display: "inline-block", padding: "8px 20px", borderRadius: 999,
            background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)", fontSize: 13,
            fontWeight: 600, marginBottom: 24, backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)",
          }}>
            🏠 {t("महाराष्ट्रातील #1 भाडे प्लॅटफॉर्म", "महाराष्ट्र का #1 किराया प्लेटफॉर्म", "Maharashtra's #1 Rental Platform")} — <span style={{ color: "#C9944A" }}>{t("आर्यनॉक्सटेक द्वारे", "Arynoxtech द्वारा", "by Arynoxtech")}</span>
          </div>

          <h1 className="animate-slide-up" style={{
            fontSize: "clamp(34px, 5.5vw, 60px)", fontWeight: 900, color: "white",
            lineHeight: 1.08, marginBottom: 20, letterSpacing: -1.5,
          }}>
            {t("तुमचे आदर्श घर", "आपका आदर्श घर", "Find Your")}{" "}
            <span style={{ color: "#C9944A" }}>{t("शोधा", "खोजें", "Dream Home")}</span>
            <br />
            {t("महाराष्ट्रात", "महाराष्ट्र में", "in Maharashtra")}
          </h1>

          <p className="animate-slide-up" style={{
            fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.75)",
            maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7,
          }}>
            {t(
              "AI-शक्तीचे शोध, करार, eSign आणि नकाशा — सर्व एका ठिकाणी",
              "AI-संचालित खोज, करार, eSign और मानचित्र — सब एक जगह",
              "AI-powered search, contracts, eSign & maps — all in one place"
            )}
          </p>

          {/* Search Box */}
          <div style={{
            background: "white", borderRadius: 20, padding: 8,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)", maxWidth: 700, margin: "0 auto",
          }}>
            <div style={{ display: "flex", gap: 4, padding: "4px 8px", borderBottom: "1px solid #f0f0f0" }}>
              {(["rent", "buy", "pg"] as const).map((type) => (
                <button key={type} onClick={() => setSearchType(type)} style={{
                  padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: searchType === type ? "var(--rently-primary)" : "transparent",
                  color: searchType === type ? "white" : "#666",
                  fontWeight: 700, fontSize: 14, transition: "all 0.2s",
                }}>
                  {type === "rent" ? t("भाडे", "किराया", "Rent") : type === "buy" ? t("खरेदी", "खरीददारी", "Buy") : "PG"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, padding: "8px 12px", alignItems: "center" }}>
              <span style={{ fontSize: 20, color: "#999" }}>📍</span>
              <input
                placeholder={t("शहर, ठिकाण किंवा पिन कोड शोधा…", "शहर, स्थान या पिन कोड खोजें…", "Search city, area or pincode…")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 16, padding: "12px 0", color: "#333" }}
              />
              <Link
                href={`/properties?type=${searchType}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                style={{
                  padding: "12px 28px", borderRadius: 14, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, #C9944A, #b8860b)", color: "white",
                  fontWeight: 700, fontSize: 15, textDecoration: "none", whiteSpace: "nowrap",
                }}
              >
                🔍 {t("शोधा", "खोजें", "Search")}
              </Link>
            </div>
          </div>

          {/* Quick city links */}
          <div style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["Mumbai", "Pune", "Thane", "Nagpur", "Nashik"].map((c) => (
              <Link key={c} href={`/properties?type=${searchType}&q=${c}`} style={{
                padding: "8px 18px", borderRadius: 999, background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.85)", fontSize: 13, textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)", transition: "all 0.2s",
              }}>
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "0 20px", marginTop: -44, position: "relative", zIndex: 2 }}>
        <div className="container-app" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="animate-scale-in" style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
            background: "white", borderRadius: 20, boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
            overflow: "hidden", border: "1px solid rgba(255,255,255,0.8)",
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: "28px 16px", textAlign: "center",
                borderRight: i < 3 ? "1px solid #f0f0f0" : "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--rently-cream)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ fontSize: 30, fontWeight: 900, background: "linear-gradient(135deg, var(--rently-primary), var(--rently-accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--rently-muted)", marginTop: 4, fontWeight: 500 }}>{s.label[lang as "mr" | "hi" | "en"] || s.label.en}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 20px" }}>
        <div className="container-app" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="gold-line" style={{ width: 60, margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, color: "#1a365d" }}>
              {t("का Rently (आर्यनॉक्सटेक) निवडाल?", "क्यों Rently (Arynoxtech) चुनें?", "Why Choose Rently by Arynoxtech?")}
            </h2>
            <p style={{ fontSize: 16, color: "var(--rently-muted)", marginTop: 8, maxWidth: 500, margin: "8px auto 0" }}>
              {t("महाराष्ट्रातील सर्वोत्तम भाडे अनुभव", "महाराष्ट्र में सर्वोत्तम किराया अनुभव", "The best rental experience in Maharashtra")}
            </p>
          </div>

          <div className="stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="animate-slide-up card-hover" style={{
                padding: 28, borderRadius: 18, border: "1px solid var(--rently-border-light)",
                background: "white", cursor: "default",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "linear-gradient(135deg, var(--rently-primary-light), var(--rently-cream))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, marginBottom: 16,
                }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a365d", marginBottom: 8 }}>
                  {f.title[lang as "mr" | "hi" | "en"] || f.title.en}
                </h3>
                <p style={{ fontSize: 14, color: "var(--rently-muted)", lineHeight: 1.7 }}>
                  {f.desc[lang as "mr" | "hi" | "en"] || f.desc.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E-Contract Feature */}
      <section style={{ padding: "80px 20px", background: "linear-gradient(135deg, #f8f9fa 0%, #eef1f5 100%)" }}>
        <div className="container-app" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 999, background: "var(--rently-accent-light)", color: "var(--rently-accent-dark)", fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
                📝 {t("नवीन वैशिष्ट्य", "नया फ़ीचर", "NEW FEATURE")}
              </div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 900, color: "#1a365d", marginBottom: 14 }}>
                {t("AI-शक्तीचे ई-कॉन्ट्रैक्ट", "AI-संचालित ई-करार", "AI-Powered E-Contracts")}
              </h2>
              <p style={{ fontSize: 15, color: "var(--rently-muted)", lineHeight: 1.8, marginBottom: 24 }}>
                {t(
                  "कायदेशीर करार तयार करा, Aadhaar ने eSign करा आणि PDF डाउनलोड करा. फक्त ₹50!",
                  "कानूनी समझौता बनाएं, Aadhaar से eSign करें और PDF डाउनलोड करें। केवल ₹50!",
                  "Generate legally valid contracts, eSign with Aadhaar & download PDF. Just ₹50!"
                )}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { en: "AI generates Maharashtra-format rental agreement", mr: "AI महाराष्ट्र स्वरूपात भाडे करार तयार करतो", hi: "AI महाराष्ट्र प्रारूप में किराया समझौता बनाता है" },
                  { en: "Both owner & tenant eSign via Aadhaar OTP", mr: "मालक आणि भाडेकर दोघेही Aadhaar OTP ने eSign करतात", hi: "मालिक और किरायेदार दोनों Aadhaar OTP से eSign करते हैं" },
                  { en: "Download signed PDF instantly", mr: "स्वाक्षरित PDF तुरंत डाउनलोड करा", hi: "तुरंत साइन किया हुआ PDF डाउनलोड करें" },
                  { en: "Legally valid under IT Act 2000", mr: "IT कायदा 2000 अंतर्गत कायदेशीर वैध", hi: "IT अधिनियम 2000 के तहत कानूनी रूप से मान्य" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--rently-text)", padding: "8px 12px", borderRadius: 10, background: "rgba(56,161,105,0.06)" }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--rently-success)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item[lang as "mr" | "hi" | "en"] || item.en}
                  </div>
                ))}
              </div>
              <Link href="/contracts" style={{
                display: "inline-block", marginTop: 28, padding: "16px 36px", borderRadius: 14,
                background: "linear-gradient(135deg, var(--rently-primary), var(--rently-primary-dark))", color: "white",
                fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: "0 8px 24px rgba(44,82,130,0.3)",
              }}>
                {t("आता वापरा", "अभी उपयोग करें", "Try Now")} →
              </Link>
            </div>
            <div style={{
              background: "white", borderRadius: 20, padding: 36, boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
              border: "1px solid var(--rently-border-light)",
            }}>
              <div style={{ fontSize: 48, textAlign: "center", marginBottom: 20 }}>📄✍️</div>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  { step: "1", label: t("माहिती भरा", "जानकारी भरें", "Fill Details") },
                  { step: "2", label: t("AI करार तयार करतो", "AI करार बनाता है", "AI Generates") },
                  { step: "3", label: t("₹50 भरा", "₹50 भरें", "Pay ₹50") },
                  { step: "4", label: t("Aadhaar OTP ने eSign", "Aadhaar OTP से eSign", "eSign with Aadhaar") },
                  { step: "5", label: t("PDF डाउनलोड करा", "PDF डाउनलोड करें", "Download PDF") },
                ].map((s) => (
                  <div key={s.step} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: "var(--rently-cream)", border: "1px solid var(--rently-border-light)" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, var(--rently-primary), var(--rently-primary-dark))", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--rently-text)" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section style={{ padding: "80px 20px" }}>
        <div className="container-app" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="gold-line" style={{ width: 60, margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 900, color: "#1a365d" }}>
              {t("लोकप्रिय शहरे", "लोकप्रिय शहर", "Popular Cities")}
            </h2>
            <p style={{ fontSize: 15, color: "var(--rently-muted)", marginTop: 8 }}>
              {t("महाराष्ट्रातील सर्व शहरांमध्ये मालमत्ता शोधा", "महाराष्ट्र के सभी शहरों में प्रॉपर्टी खोजें", "Find properties across all Maharashtra cities")}
            </p>
          </div>

          <div className="stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
            {MAHARASHTRA_CITIES.map((city) => (
              <Link key={city.name} href={`/properties?type=rent&q=${city.name}`} className="animate-slide-up card-hover" style={{
                padding: "22px 18px", borderRadius: 16, border: "1px solid var(--rently-border-light)",
                background: "white", textDecoration: "none",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: "linear-gradient(135deg, var(--rently-primary-light), var(--rently-cream))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, marginBottom: 12,
                }}>📍</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a365d" }}>{city.name}</div>
                <div style={{ fontSize: 12, color: "var(--rently-muted)", marginTop: 2 }}>
                  {lang === "mr" ? city.nameMr : lang === "hi" ? city.nameHi : city.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--rently-primary)", marginTop: 8, fontWeight: 700 }}>
                  {city.count.toLocaleString("en-IN")}+ {t("मालमत्ता", "प्रॉपर्टी", "listings")}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Owners */}
      <section style={{
        padding: "60px 20px",
        background: "linear-gradient(135deg, #1a365d 0%, #2c5282 100%)",
      }}>
        <div className="container-app" style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div className="animate-glow" style={{
            width: 72, height: 72, borderRadius: 24, background: "rgba(255,255,255,0.12)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, marginBottom: 24, backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)",
          }}>🏠</div>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 900, color: "white", marginBottom: 14 }}>
            {t("मालक आहात?", "मालिक हैं?", "Property Owner?")}
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.7 }}>
            {t(
              "तुमची मालमत्ता Rently (आर्यनॉक्सटेक) वर यादी करा. AI तुमचा करार तयार करेल. eSign करा. किराया मिळवा!",
              "अपनी प्रॉपर्टी Rently (Arynoxtech) पर लिस्ट करें। AI आपका करार बनाएगा। eSign करें। किराया कमाएं!",
              "List your property on Rently by Arynoxtech. AI generates contracts. eSign & earn rent!"
            )}
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/owner" style={{
              padding: "16px 36px", borderRadius: 14, background: "white", color: "#1a365d",
              fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              transition: "all 0.2s",
            }}>
              {t("मालक म्हणून सुरू करा", "मालिक के रूप में शुरू करें", "Start as Owner")} →
            </Link>
            <Link href="/pricing" style={{
              padding: "16px 36px", borderRadius: 14, border: "2px solid rgba(255,255,255,0.25)",
              color: "white", fontWeight: 700, fontSize: 15, textDecoration: "none",
              backdropFilter: "blur(4px)", transition: "all 0.2s",
            }}>
              {t("किंमत पहा", "कीमत देखें", "View Pricing")}
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: "80px 20px" }}>
        <div className="container-app" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div className="gold-line" style={{ width: 60, margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 900, color: "#1a365d" }}>
              {t("कसे काम करते?", "कैसे काम करता है?", "How it Works?")}
            </h2>
          </div>

          <div className="stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 24 }}>
            {[
              { icon: "🔍", step: "1", title: t("शोधा", "खोजें", "Search"), desc: t("तुमचे क्षेत्र, बजेट आणि गरजा निवडा", "अपना क्षेत्र, बजट और जरूरतें चुनें", "Choose your area, budget & needs") },
              { icon: "🏠", step: "2", title: t("तपासा", "जांचें", "Explore"), desc: t("मालमत्तांचे तपशील, फोटो आणि नकाशा पहा", "प्रॉपर्टी का विवरण, फ़ोटो और मानचित्र देखें", "See property details, photos & map") },
              { icon: "📝", step: "3", title: t("करार", "करार", "Contract"), desc: t("AI-शक्तीचा करार तयार करा, eSign करा", "AI-संचालित करार बनाएं, eSign करें", "Generate AI contract, eSign it") },
              { icon: "🔑", step: "4", title: t("स्थानांतर", "स्थानांतरण", "Move In"), desc: t("किराया भरा आणि नवीन घरात जा", "किराया भरें और नए घर में जाएं", "Pay rent & move to your new home") },
            ].map((s) => (
              <div key={s.step} className="animate-slide-up" style={{
                textAlign: "center", padding: "28px 20px",
                background: "white", borderRadius: 18,
                border: "1px solid var(--rently-border-light)",
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: "linear-gradient(135deg, var(--rently-primary-light), var(--rently-cream))",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30, marginBottom: 16,
                }}>{s.icon}</div>
                <div style={{
                  display: "inline-block", padding: "3px 10px", borderRadius: 999,
                  background: "var(--rently-accent-light)", color: "var(--rently-accent-dark)",
                  fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: 0.5,
                }}>STEP {s.step}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a365d", marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "var(--rently-muted)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <AIChat />
    </div>
  );
}
