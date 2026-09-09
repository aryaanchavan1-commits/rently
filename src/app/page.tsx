"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/lib/lang-context";

interface Stats {
  listings: number;
  cities: number;
  views: number;
  owners: number;
}

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
  { icon: "0", title: { en: "Zero Brokerage", mr: "शून्य ब्रोकरेज", hi: "ज़ीरो ब्रोकरेज" }, desc: { en: "Connect directly with verified owners. No middlemen, no commission.", mr: "पडताळलेल्या मालकांशी थेट जोडा. कोणताही मध्यस्थ नाही, कमिशन नाही.", hi: "सत्यापित मालिकों से सीधे जुड़ें। कोई बिचौलिया, कोई कमीशन नहीं।" }, color: "#059669" },
  { icon: "AI", title: { en: "AI Property Match", mr: "AI मालमत्ता जुळवा", hi: "AI प्रॉपर्टी मैच" }, desc: { en: "Ria AI finds properties matching your budget, location & preferences.", mr: "रिआ AI तुमच्या बजेट, स्थान आणि प्राधान्यांनुसार मालमत्ता शोधते.", hi: "रिआ AI आपके बजट, स्थान और प्राथमिकताओं से मेल खाती प्रॉपर्टी खोजता है।" }, color: "#1a56db" },
  { icon: "E", title: { en: "E-Contracts & eSign", mr: "ई-करार आणि eSign", hi: "ई-कॉन्ट्रैक्ट और eSign" }, desc: { en: "Legally valid rental agreements. eSign via Aadhaar OTP. Download PDF.", mr: "कायदेशीर भाडे करार. Aadhaar OTP ने eSign. PDF डाउनलोड करा.", hi: "कानूनी रूप से मान्य किराया समझौते। Aadhaar OTP से eSign। PDF डाउनलोड करें।" }, color: "#7c3aed" },
  { icon: "M", title: { en: "Live Map Search", mr: "लाइव्ह नकाशा शोध", hi: "लाइव मैप खोज" }, desc: { en: "Search on interactive map. Find nearby schools, hospitals, transit.", mr: "इंटरॅक्टिव्ह नकाशावर शोधा. जवळचे शाळा, रुग्णालये, ट्रान्झिट शोधा.", hi: "इंटरैक्टिव मानचित्र पर खोजें। पास के स्कूल, अस्पताल, ट्रांज़िट खोजें।" }, color: "#0891b2" },
  { icon: "C", title: { en: "Commute Search", mr: "प्रवास शोध", hi: "यात्रा खोज" }, desc: { en: "Find properties by commute time to your office. 35+ destinations.", mr: "तुमच्या कार्यालयापर्यंतच्या प्रवास वेळेनुसार मालमत्ता शोधा.", hi: "अपने कार्यालय तक की यात्रा के समय के अनुसार प्रॉपर्टी खोजें।" }, color: "#ca8a04" },
  { icon: "S", title: { en: "Secure Payments", mr: "सुरक्षित पेमेंट्स", hi: "सुरक्षित भुगतान" }, desc: { en: "Razorpay-powered secure payments. Track all transactions.", mr: "Razorpay-शक्तीचे सुरक्षित पेमेंट्स. सर्व व्यवहार ट्रॅक करा.", hi: "Razorpay-संचालित सुरक्षित भुगतान। सभी लेनदेन ट्रैक करें।" }, color: "#dc2626" },
];

const STATS = [
  { value: () => `0`, label: { en: "Active Listings", mr: "सक्रिय यादी", hi: "सक्रिय लिस्टिंग" } },
  { value: () => `0`, label: { en: "Cities Covered", mr: "शहरे कव्हर", hi: "शहर कवर" } },
  { value: () => `0`, label: { en: "Happy Tenants", mr: "समाधान भाडेदार", hi: "खुश किरायेदार" } },
  { value: () => `0`, label: { en: "Brokerage", mr: "ब्रोकरेज", hi: "ब्रोकरेज" } },
];

export default function HomePage() {
  const { lang } = useLang();
  const [searchType, setSearchType] = useState<"rent" | "pg">("rent");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<Stats>({ listings: 30, cities: 13, views: 50000, owners: 0 });

  const t = (en: string, mr: string, hi: string) => lang === "mr" ? mr : lang === "hi" ? hi : en;

  useEffect(() => {
    fetch(apiUrl("/api/stats"))
      .then((r) => r.json())
      .then((data) => {
        setStats({
          listings: data.listings || 30,
          cities: data.cities || 13,
          views: data.views || 50000,
          owners: data.owners || 0,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="container-app hero-content">
          <div className="hero-badge">
            Maharashtra&apos;s #1 Rental Platform
          </div>
          <h1 className="hero-title">
            {t("Find Your Perfect Home", "तुमचे आदर्श घर शोधा", "अपना सही घर खोजें")}
            <br />
            <span className="hero-title-accent">{t("Without the Broker", "ब्रोकरशिवाय", "बिना ब्रोकर के")}</span>
          </h1>
          <p className="hero-subtitle">
            {t(
              "Connect directly with verified owners across Maharashtra. Zero brokerage, AI-powered search, e-contracts.",
              "महाराष्ट्रातील पडताळलेल्या मालकांशी थेट जोडा. शून्य ब्रोकरेज, AI-शोध, ई-करार.",
              "महाराष्ट्र भर के सत्यापित मालिकों से सीधे जुड़ें। ज़ीरो ब्रोकरेज, AI-संचालित खोज, ई-कॉन्ट्रैक्ट।"
            )}
          </p>

          {/* Search Box */}
          <div className="hero-search">
            <div className="hero-search-tabs">
              {(["rent", "pg"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchType(type)}
                  className={`hero-search-tab ${searchType === type ? "active" : ""}`}
                >
                  {type === "rent" ? "Rent" : "PG"}
                </button>
              ))}
            </div>
            <div className="hero-search-input-row">
              <svg className="hero-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                className="hero-search-input"
                placeholder={t("Search by city, area or pincode…", "शहर, भाग किंवा पिन कोड शोधा…", "शहर, इलाका या पिन कोड खोजें…")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Link
                href={`/properties?type=${searchType}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className="hero-search-btn"
              >
                {t("Search", "शोधा", "खोजें")}
              </Link>
            </div>
          </div>

          <div className="hero-cities">
            <span className="hero-cities-label">{t("Popular:", "लोकप्रिय:", "लोकप्रिय:")}</span>
            {["Mumbai", "Pune", "Thane", "Nagpur", "Nashik"].map((c) => (
              <Link key={c} href={`/properties?type=${searchType}&q=${c}`} className="hero-city-chip">{c}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container-app">
          <div className="stats-grid">
            {[
              { value: stats.listings.toLocaleString("en-IN") + "+", label: { en: "Active Listings", mr: "सक्रिय यादी", hi: "सक्रिय लिस्टिंग" } },
              { value: stats.cities + "+", label: { en: "Cities", mr: "शहरे", hi: "शहर" } },
              { value: stats.views.toLocaleString("en-IN") + "+", label: { en: "Views", mr: "दृश्य", hi: "व्यूज" } },
              { value: "0%", label: { en: "Brokerage", mr: "ब्रोकरेज", hi: "ब्रोकरेज" } },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label[lang as "mr" | "hi" | "en"] || s.label.en}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container-app">
          <div className="section-header">
            <h2 className="section-title">{t("Why Rently?", "रेंटली का?", "Rently क्यों?")}</h2>
            <p className="section-subtitle">{t("Built for Maharashtra, designed for you.", "महाराष्ट्रासाठी बनवले, तुमच्यासाठी डिझाइन केले.", "महाराष्ट्र के लिए बनाया, आपके लिए डिज़ाइन किया।")}</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card card card-hover">
                <div className="feature-icon" style={{ background: `${f.color}10`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title[lang as "mr" | "hi" | "en"] || f.title.en}</h3>
                <p className="feature-desc">{f.desc[lang as "mr" | "hi" | "en"] || f.desc.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section section-alt">
        <div className="container-app">
          <div className="section-header">
            <h2 className="section-title">{t("How it Works", "कसे काम करते", "कैसे काम करता है")}</h2>
          </div>
          <div className="steps-grid">
            {[
              { num: "01", title: t("Search Properties", "मालमत्ता शोधा", "प्रॉपर्टी खोजें"), desc: t("Enter your city, budget & preferences. AI finds the best matches.", "तुमचे शहर, बजेट आणि प्राधान्य टाका. AI सर्वोत्तम जोडपे शोधते.", "अपना शहर, बजट और प्राथमिकताएं दर्ज करें। AI सर्वोत्तम मैच खोजता है।") },
              { num: "02", title: t("Visit & Connect", "भेटा आणि जोडा", "मिलें और जुड़ें"), desc: t("Schedule visits. Chat directly with owners. No broker in between.", "भेटी शेड्यूल करा. मालकांशी थेट चॅट करा. कोणताही ब्रोकर नाही.", "भेट शेड्यूल करें। मालिकों से सीधे चैट करें। कोई ब्रोकर नहीं।") },
              { num: "03", title: t("Sign & Move In", "साइन करा आणि स्थानांतर", "साइन करें और शिफ्ट हों"), desc: t("AI generates the contract. eSign with Aadhaar. Move into your new home.", "AI करार तयार करतो. Aadhaar ने eSign. नवीन घरात स्थानांतर.", "AI समझौता बनाता है। Aadhaar से eSign। अपने नए घर में शिफ्ट हों।") },
            ].map((s) => (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E-Contract Feature */}
      <section className="section">
        <div className="container-app">
          <div className="econtract-grid">
            <div className="econtract-content">
              <div className="badge badge-accent">New Feature</div>
              <h2 className="econtract-title">{t("AI-Powered E-Contracts", "AI-शक्तीचे ई-करार", "AI-संचालित ई-कॉन्ट्रैक्ट")}</h2>
              <p className="econtract-desc">
                {t(
                  "Generate legally valid rental agreements in Maharashtra format. eSign via Aadhaar OTP. Download signed PDF instantly.",
                  "महाराष्ट्र स्वरूपात कायदेशीर भाडे करार तयार करा. Aadhaar OTP ने eSign. स्वाक्षरित PDF तुरंत डाउनलोड करा.",
                  "महाराष्ट्र प्रारूप में कानूनी किराया समझौते बनाएं। Aadhaar OTP से eSign। तुरंत साइन किया हुआ PDF डाउनलोड करें।"
                )}
              </p>
              <ul className="econtract-list">
                {[
                  t("Valid under IT Act 2000", "IT कायदा 2000 अंतर्गत वैध", "IT अधिनियम 2000 के तहत मान्य"),
                  t("Maharashtra rental format", "महाराष्ट्र भाडे स्वरूप", "महाराष्ट्र किराया प्रारूप"),
                  t("Aadhaar-based eSign", "Aadhaar-आधारित eSign", "Aadhaar-आधारित eSign"),
                  t("Instant PDF download", "तुरंत PDF डाउनलोड", "तुरंत PDF डाउनलोड"),
                ].map((item, i) => (
                  <li key={i} className="econtract-list-item">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#059669" opacity="0.1"/><path d="M5.5 9l2.5 2.5 4.5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contracts" className="btn btn-primary" style={{ marginTop: 24, padding: "12px 28px" }}>
                {t("Try E-Contracts", "ई-करार वापरा", "ई-कॉन्ट्रैक्ट आज़माएं")} →
              </Link>
            </div>
            <div className="econtract-steps">
              <div className="econtract-steps-card">
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>
                  {t("5-Step Process", "५-टप्प्यांची प्रक्रिया", "५-चरण प्रक्रिया")}
                </h3>
                {[
                  { num: "1", label: t("Fill Details", "तपशील भरा", "विवरण भरें") },
                  { num: "2", label: t("AI Generates Contract", "AI करार तयार करतो", "AI कॉन्ट्रैक्ट बनाता है") },
                  { num: "3", label: t("Pay ₹50", "₹50 भरा", "₹50 भरें") },
                  { num: "4", label: t("eSign via Aadhaar", "Aadhaar ने eSign", "Aadhaar से eSign") },
                  { num: "5", label: t("Download PDF", "PDF डाउनलोड करा", "PDF डाउनलोड करें") },
                ].map((s) => (
                  <div key={s.num} className="econtract-step">
                    <div className="econtract-step-num">{s.num}</div>
                    <span className="econtract-step-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="section section-alt">
        <div className="container-app">
          <div className="section-header">
            <h2 className="section-title">{t("Explore by City", "शहरानुसार शोधा", "शहर के अनुसार खोजें")}</h2>
            <p className="section-subtitle">{t("Find properties in all major Maharashtra cities", "सर्व प्रमुख महाराष्ट्र शहरांमध्ये मालमत्ता शोधा", "सभी प्रमुख महाराष्ट्र शहरों में प्रॉपर्टी खोजें")}</p>
          </div>
          <div className="cities-grid">
            {MAHARASHTRA_CITIES.map((city) => (
              <Link key={city.name} href={`/properties?type=rent&q=${city.name}`} className="city-card card card-hover">
                <div className="city-name">{city.name}</div>
                <div className="city-name-local">{lang === "mr" ? city.nameMr : lang === "hi" ? city.nameHi : city.name}</div>
                <div className="city-count">{city.count.toLocaleString("en-IN")}+ {t("listings", "यादी", "लिस्टिंग")}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Owner CTA */}
      <section className="owner-cta-section">
        <div className="container-app">
          <div className="owner-cta-content">
            <h2 className="owner-cta-title">{t("Own a Property?", "मालक आहात?", "प्रॉपर्टी के मालिक हैं?")}</h2>
            <p className="owner-cta-desc">
              {t(
                "List on Rently by Arynoxtech. Reach thousands of verified tenants. AI handles contracts. Zero brokerage.",
                "Rently (आर्यनॉक्सटेक) वर यादी करा. हजारो पडताळलेल्या भाडेदारांपर्यंत पोहोचा. AI करार हाताळतो. शून्य ब्रोकरेज.",
                "Rently (Arynoxtech) पर लिस्ट करें। हजारो सत्यापित किरायेदारों तक पहुंचें। AI समझौते संभालता है। ज़ीरो ब्रोकरेज।"
              )}
            </p>
            <div className="owner-cta-buttons">
              <Link href="/owner" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "14px 32px", borderRadius: "var(--radius)", fontWeight: 700, fontSize: 15, background: "white", color: "var(--primary)", textDecoration: "none", transition: "all 0.15s", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                {t("List Your Property", "तुमची मालमत्ता यादी करा", "अपनी प्रॉपर्टी लिस्ट करें")} →
              </Link>
              <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "14px 32px", borderRadius: "var(--radius)", fontWeight: 600, fontSize: 15, background: "transparent", color: "white", border: "2px solid rgba(255,255,255,0.3)", textDecoration: "none", transition: "all 0.15s" }}>
                {t("View Pricing", "किंमत पहा", "कीमत देखें")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1a56db 100%);
          padding: 80px 20px 100px;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 30% 20%, rgba(26,86,219,0.2) 0%, transparent 60%),
                      radial-gradient(ellipse at 70% 80%, rgba(245,158,11,0.1) 0%, transparent 60%);
        }
        .hero-content { position: relative; z-index: 1; max-width: 720px; margin: 0 auto; text-align: center; }
        .hero-badge {
          display: inline-block; padding: 6px 16px; border-radius: 999px;
          background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9);
          font-size: 13px; font-weight: 600; margin-bottom: 28px;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .hero-title {
          font-size: clamp(32px, 5vw, 52px); font-weight: 800; color: white;
          line-height: 1.1; margin-bottom: 18px; letter-spacing: -1px;
        }
        .hero-title-accent { color: var(--accent); }
        .hero-subtitle {
          font-size: 16px; color: rgba(255,255,255,0.7);
          max-width: 560px; margin: 0 auto 36px; line-height: 1.7;
        }

        .hero-search {
          background: white; border-radius: var(--radius-lg);
          box-shadow: 0 20px 50px rgba(0,0,0,0.25); overflow: hidden;
        }
        .hero-search-tabs {
          display: flex; gap: 0; padding: 4px 8px; border-bottom: 1px solid var(--border-light);
        }
        .hero-search-tab {
          padding: 10px 20px; border-radius: var(--radius); border: none;
          background: transparent; color: var(--text-muted);
          font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.15s;
        }
        .hero-search-tab.active {
          background: var(--primary); color: white;
        }
        .hero-search-tab:hover:not(.active) { background: var(--surface-hover); color: var(--text); }
        .hero-search-input-row {
          display: flex; align-items: center; gap: 8px; padding: 8px 12px;
        }
        .hero-search-icon { width: 20px; height: 20px; color: var(--text-muted); flex-shrink: 0; }
        .hero-search-input {
          flex: 1; border: none; outline: none; font-size: 15px; padding: 10px 0;
          color: var(--text); background: transparent;
        }
        .hero-search-input::placeholder { color: var(--text-muted); }
        .hero-search-btn {
          padding: 12px 28px; border-radius: var(--radius); border: none;
          background: var(--accent); color: white; font-weight: 700; font-size: 14px;
          cursor: pointer; text-decoration: none; white-space: nowrap; transition: all 0.15s;
        }
        .hero-search-btn:hover { background: var(--accent-hover); box-shadow: 0 4px 12px rgba(245,158,11,0.3); }

        .hero-cities {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 20px; flex-wrap: wrap;
        }
        .hero-cities-label { color: rgba(255,255,255,0.5); font-size: 13px; }
        .hero-city-chip {
          padding: 6px 14px; border-radius: 999px;
          background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8);
          font-size: 13px; font-weight: 500; text-decoration: none;
          border: 1px solid rgba(255,255,255,0.1); transition: all 0.15s;
        }
        .hero-city-chip:hover { background: rgba(255,255,255,0.15); color: white; }

        .stats-section {
          padding: 0 20px; margin-top: -40px; position: relative; z-index: 2;
        }
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          background: white; border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg); overflow: hidden; border: 1px solid var(--border-light);
          max-width: 800px; margin: 0 auto;
        }
        .stat-item {
          padding: 24px 16px; text-align: center;
          border-right: 1px solid var(--border-light);
          transition: background 0.15s;
        }
        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: var(--surface-hover); }
        .stat-value { font-size: 28px; font-weight: 800; color: var(--primary); }
        .stat-label { font-size: 13px; color: var(--text-muted); margin-top: 2px; font-weight: 500; }

        .section { padding: 72px 20px; }
        .section-alt { background: var(--surface-hover); }
        .section-header { text-align: center; margin-bottom: 40px; }
        .section-title { font-size: clamp(22px, 3vw, 30px); font-weight: 800; color: var(--text); }
        .section-subtitle { font-size: 15px; color: var(--text-muted); margin-top: 8px; }

        .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .feature-card { padding: 28px; }
        .feature-icon {
          width: 48px; height: 48px; border-radius: var(--radius);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 800; margin-bottom: 16px;
        }
        .feature-title { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
        .feature-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.65; }

        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .step-card {
          background: white; border-radius: var(--radius-lg);
          padding: 32px 28px; border: 1px solid var(--border);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .step-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .step-num {
          font-size: 14px; font-weight: 800; color: var(--primary);
          background: var(--primary-light); display: inline-block;
          padding: 4px 12px; border-radius: var(--radius-full); margin-bottom: 16px;
        }
        .step-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
        .step-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.65; }

        .econtract-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        .econtract-title { font-size: clamp(22px, 3vw, 30px); font-weight: 800; color: var(--text); margin: 16px 0 12px; }
        .econtract-desc { font-size: 15px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 20px; }
        .econtract-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; margin-bottom: 8px; }
        .econtract-list-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-secondary); }
        .econtract-steps-card {
          background: white; border-radius: var(--radius-lg);
          padding: 28px; border: 1px solid var(--border); box-shadow: var(--shadow-sm);
        }
        .econtract-step {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: var(--radius);
          background: var(--surface-hover); margin-bottom: 8px;
        }
        .econtract-step:last-child { margin-bottom: 0; }
        .econtract-step-num {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--primary); color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; flex-shrink: 0;
        }
        .econtract-step-label { font-size: 14px; font-weight: 500; color: var(--text-secondary); }

        .cities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 12px; }
        .city-card {
          padding: 20px 16px; text-align: left; text-decoration: none;
        }
        .city-name { font-size: 16px; font-weight: 700; color: var(--text); }
        .city-name-local { font-size: 13px; color: var(--text-muted); margin-top: 1px; }
        .city-count { font-size: 12px; color: var(--primary); font-weight: 600; margin-top: 8px; }

        .owner-cta-section {
          padding: 72px 20px;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1a56db 100%);
        }
        .owner-cta-content { text-align: center; max-width: 600px; margin: 0 auto; }
        .owner-cta-title { font-size: clamp(24px, 3.5vw, 34px); font-weight: 800; color: white; margin-bottom: 14px; }
        .owner-cta-desc { font-size: 16px; color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 28px; }
        .owner-cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        @media (max-width: 768px) {
          .hero-section { padding: 60px 16px 80px; }
          .hero-title { font-size: 28px; }
          .hero-subtitle { font-size: 15px; margin-bottom: 28px; }
          .hero-search-input-row { flex-direction: column; }
          .hero-search-btn { width: 100%; text-align: center; }
          .hero-cities { gap: 6px; }
          .hero-city-chip { padding: 5px 12px; font-size: 12px; }
          .steps-grid { grid-template-columns: 1fr; gap: 16px; }
          .econtract-grid { grid-template-columns: 1fr; gap: 28px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); margin: 0 16px; }
          .stat-item:nth-child(2) { border-right: none; }
          .stat-item { padding: 18px 12px; }
          .stat-value { font-size: 22px; }
          .stat-label { font-size: 11px; }
          .section { padding: 48px 16px; }
          .cities-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
          .city-card { padding: 14px 12px; }
          .owner-cta-section { padding: 48px 16px; }
          .owner-cta-buttons { flex-direction: column; }
          .owner-cta-buttons a { width: 100%; text-align: center; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: 1fr; }
          .feature-card { padding: 20px; }
          .cities-grid { grid-template-columns: 1fr 1fr; gap: 6px; }
          .city-card { padding: 12px 10px; }
        }
      `}</style>
    </div>
  );
}
