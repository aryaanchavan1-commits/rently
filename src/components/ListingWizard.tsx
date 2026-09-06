"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";
import type { Property } from "@/lib/properties-store";

type Step = "type" | "details" | "location" | "amenities" | "photos" | "review";

const PROPERTY_TYPES = [
  { value: "apartment", icon: "🏢", mr: "अपार्टमेंट / फ्लॅट", hi: "अपार्टमेंट / फ्लैट", en: "Apartment / Flat" },
  { value: "house", icon: "🏠", mr: "स्वतंत्र घर", hi: "स्वतंत्र घर", en: "Independent House" },
  { value: "room", icon: "🛏️", mr: "खोली", hi: "कमरा", en: "Room" },
  { value: "pg", icon: "🏨", mr: "पीजी / हॉस्टल", hi: "पीजी / हॉस्टल", en: "PG / Hostel" },
  { value: "office", icon: "💼", mr: "कार्यालय", hi: "कार्यालय", en: "Office Space" },
];

const CITY_COORDS: Record<string, [number, number]> = {
  "Mumbai": [19.0760, 72.8777], "Pune": [18.5204, 73.8567], "Thane": [19.2183, 72.9781],
  "Navi Mumbai": [19.0330, 73.0297], "Nagpur": [21.1458, 79.0882], "Nashik": [19.9975, 73.7898],
  "Kolhapur": [16.7050, 74.2433], "Aurangabad": [19.8762, 75.3433], "Solapur": [17.6599, 75.9064],
  "Satara": [17.6868, 74.2433], "Nanded": [19.1573, 77.3260], "Amravati": [20.9374, 77.7796],
  "Ratnagiri": [16.9902, 73.3120],
};

const AMENITY_OPTIONS = [
  { en: "WiFi", mr: "वायफाय", hi: "वाईफाई" },
  { en: "AC", mr: "एसी", hi: "एसी" },
  { en: "Parking", mr: "पार्किंग", hi: "पार्किंग" },
  { en: "Gym", mr: "जिम", hi: "जिम" },
  { en: "Pool", mr: "पूल", hi: "पूल" },
  { en: "Security", mr: "सुरक्षा", hi: "सुरक्षा" },
  { en: "Lift", mr: "लिफ्ट", hi: "लिफ्ट" },
  { en: "Power Backup", mr: "पावर बॅकअप", hi: "पावर बैकअप" },
  { en: "Garden", mr: "बाग", hi: "बगीचा" },
  { en: "Furnished", mr: "फर्निश्ड", hi: "फर्निश्ड" },
  { en: "Meals", mr: "जेवण", hi: "भोजन" },
  { en: "CCTV", mr: "सीसीटीव्ही", hi: "सीसीटीव्ही" },
  { en: "Water Supply", mr: "पाणी", hi: "पानी" },
  { en: "Gas Pipeline", mr: "गॅस पाइपलाइन", hi: "गैस पाइपलाइन" },
  { en: "Modular Kitchen", mr: "मॉड्युलर स्वयंपाकघर", hi: "मॉड्युलर किचन" },
];

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600",
];

interface Props {
  editProperty?: Property;
  onDone: () => void;
}

export default function ListingWizard({ editProperty, onDone }: Props) {
  const { user } = useAuth();
  const { lang } = useLang();
  const t = (en: string, mr: string, hi: string) => lang === "mr" ? mr : lang === "hi" ? hi : en;
  const [step, setStep] = useState<Step>("type");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<Array<{ lat: number; lon: number; name: string; type: string }>>([]);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const [form, setForm] = useState({
    type: (editProperty?.type as string) || "",
    title: (editProperty?.title as string) || "",
    description: (editProperty?.description as string) || "",
    price: String(editProperty?.price || ""),
    deposit: String(editProperty?.deposit || ""),
    bedrooms: String(editProperty?.bedrooms ?? 2),
    bathrooms: String(editProperty?.bathrooms ?? 1),
    furnishing: (editProperty?.furnishing as string) || "unfurnished",
    availableFrom: (editProperty?.availableFrom as string) || new Date().toISOString().split("T")[0],
    city: (editProperty?.city as string) || "",
    area: (editProperty?.area as string) || "",
    address: (editProperty?.address as string) || "",
    contactPhone: (editProperty?.contactPhone as string) || "",
    lat: (editProperty?.lat as number) || 18.5204,
    lng: (editProperty?.lng as number) || 73.8567,
    amenities: (editProperty?.amenities as string[]) || [],
    rules: (editProperty?.rules as string) || "",
    images: (editProperty?.images as string[]) || [],
  });

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleAmenity(a: string) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a],
    }));
  }

  function addSampleImage(url: string) {
    if (!form.images.includes(url) && form.images.length < 10) {
      update("images", [...form.images, url]);
    }
  }

  function removeImage(idx: number) {
    update("images", form.images.filter((_, i) => i !== idx));
  }

  // Nominatim search for location
  function searchLocation(query: string) {
    setLocationQuery(query);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (query.length < 3) { setLocationResults([]); return; }
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + " Maharashtra")}&format=json&limit=6&countrycodes=in`,
          { headers: { "User-Agent": "Rently/1.0" } }
        );
        const data = await res.json();
        setLocationResults(data.map((r: { lat: string; lon: string; display_name: string; type: string }) => ({
          lat: parseFloat(r.lat), lon: parseFloat(r.lon),
          name: r.display_name.split(",").slice(0, 3).join(","),
          type: r.type,
        })));
      } catch { setLocationResults([]); }
    }, 400);
  }

  function selectLocationResult(r: { lat: number; lon: number; name: string }) {
    update("lat", r.lat);
    update("lng", r.lon);
    setLocationQuery(r.name);
    setLocationResults([]);
    // Try to extract city/area from the name
    const parts = r.name.split(",").map((p) => p.trim());
    if (parts.length >= 2 && !form.area) update("area", parts[0]);
  }

  function useMyLocation() {
    if (!navigator.geolocation) { setError("GPS not supported"); return; }
    setLocationLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        update("lat", lat);
        update("lng", lng);
        setLocationLoading(false);
        reverseGeocode(lat, lng);
      },
      () => { setLocationLoading(false); setError("Location access denied"); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function reverseGeocode(lat: number, lng: number) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=mr,hi,en`);
      const data = await res.json();
      if (data.address) {
        const area = data.address.suburb || data.address.neighbourhood || data.address.city_district || "";
        const city = data.address.city || data.address.town || data.address.village || "";
        if (area && !form.area) update("area", area);
        if (city && !form.city) update("city", city);
      }
    } catch { /* ignore */ }
  }

  const steps: { key: Step; label: string }[] = [
    { key: "type", label: t("प्रकार", "प्रकार", "Type") },
    { key: "details", label: t("तपशील", "विवरण", "Details") },
    { key: "location", label: t("ठिकाण", "स्थान", "Location") },
    { key: "amenities", label: t("सुविधा", "सुविधाएं", "Amenities") },
    { key: "photos", label: t("फोटो", "फ़ोटो", "Photos") },
    { key: "review", label: t("पुनरावलोकन", "समीक्षा", "Review") },
  ];

  const currentIdx = steps.findIndex((s) => s.key === step);

  function canNext() {
    if (step === "type") return !!form.type;
    if (step === "details") return !!form.title && !!form.price;
    if (step === "location") return !!form.city;
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const isEdit = !!editProperty?.id;
      const url = isEdit ? `/api/properties/${editProperty!.id}` : "/api/properties";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          deposit: Number(form.deposit) || Number(form.price) * 2,
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          ownerId: user?.id || "owner-1",
          ownerName: user?.name || "Owner",
          contactPhone: form.contactPhone || user?.phone || "",
          state: "Maharashtra",
        }),
      });
      const data = await res.json();
      if (data.success) { onDone(); }
      else { setError(data.error || "Failed to save"); }
    } catch { setError("Network error"); }
    finally { setSubmitting(false); }
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${form.lng - 0.01}%2C${form.lat - 0.008}%2C${form.lng + 0.01}%2C${form.lat + 0.008}&layer=mapnik&marker=${form.lat}%2C${form.lng}`;

  return (
    <div className="fade-in card-cream" style={{ overflow: "hidden" }}>
      {/* Progress */}
      <div style={{ padding: "16px 24px 0" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {steps.map((s, i) => (
            <div key={s.key} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= currentIdx ? "linear-gradient(90deg, var(--rently-primary), var(--rently-accent))" : "var(--rently-border-light)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          {steps.map((s, i) => (
            <div key={s.key} style={{
              fontSize: 11, fontWeight: i === currentIdx ? 700 : 500,
              color: i === currentIdx ? "var(--rently-primary)" : i < currentIdx ? "var(--rently-success)" : "var(--rently-muted)",
            }}>{s.label}</div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "12px 24px 20px", minHeight: 360 }}>
        {error && (
          <div style={{ background: "#FFF5F5", color: "var(--rently-danger)", padding: "10px 14px", borderRadius: 10, fontSize: 14, marginBottom: 14 }}>{error}</div>
        )}

        {/* STEP: Type */}
        {step === "type" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--rently-text)", marginBottom: 6 }}>{t("तुम्ही काय यादी करत आहात?", "आप क्या लिस्ट कर रहे हैं?", "What are you listing?")}</h3>
            <p style={{ fontSize: 14, color: "var(--rently-muted)", marginBottom: 20 }}>{t("मालमत्तेचा प्रकार निवडा.", "प्रॉपर्टी का प्रकार चुनें।", "Select the type of property.")}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
              {PROPERTY_TYPES.map((tp) => (
                <button key={tp.value} onClick={() => update("type", tp.value)} style={{
                  padding: "18px 12px", borderRadius: 14, textAlign: "center", cursor: "pointer", transition: "all 0.15s",
                  border: form.type === tp.value ? "2px solid var(--rently-primary)" : "1px solid var(--rently-border-light)",
                  background: form.type === tp.value ? "var(--rently-primary-light)" : "var(--rently-card)",
                }}>
                  <div style={{ fontSize: 30, marginBottom: 6 }}>{tp.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--rently-text)" }}>{tp[lang as "mr" | "hi" | "en"] || tp.mr}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP: Details */}
        {step === "details" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--rently-text)", marginBottom: 6 }}>{t("मालमत्तेचे तपशील", "प्रॉपर्टी विवरण", "Property details")}</h3>
            <p style={{ fontSize: 14, color: "var(--rently-muted)", marginBottom: 20 }}>{t("भाडेकरूंना महत्त्वाची माहिती द्या.", "किरायेदारों को मुख्य जानकारी दें।", "Give tenants the key info.")}</p>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label className="form-label">{t("मालमत्तेचे शीर्षक", "प्रॉपर्टी शीर्षक", "Property Title")} *</label>
                <input className="input" placeholder={t("उदा. अंधेरी वेस्टमधील मोठी 2BHK", "जैसे अंधेरी वेस्ट में 2BHK", "e.g. Spacious 2BHK in Andheri West")} value={form.title} onChange={(e) => update("title", e.target.value)} />
              </div>
              <div>
                <label className="form-label">{t("वर्णन", "विवरण", "Description")}</label>
                <textarea className="input" rows={3} placeholder={t("तुमची मालमत्ता, जवळचे लँडमार्क्स वर्णवा…", "अपनी प्रॉपर्टी का विवरण दें…", "Describe your property…")} value={form.description} onChange={(e) => update("description", e.target.value)} style={{ resize: "vertical", minHeight: 80 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">{t("मासिक भाडे (₹)", "मासिक किराया (₹)", "Monthly Rent (₹)")} *</label>
                  <input className="input" type="number" min="500" placeholder={t("उदा. 22000", "जैसे 22000", "e.g. 22000")} value={form.price} onChange={(e) => update("price", e.target.value)} />
                  <span style={{ fontSize: 11, color: "var(--rently-muted)" }}>{t("किमान ₹500", "न्यूनतम ₹500", "Min ₹500")}</span>
                </div>
                <div>
                  <label className="form-label">{t("सुरक्षा भांडवल (₹)", "सिक्योरिटी डिपॉजिट (₹)", "Security Deposit (₹)")}</label>
                  <input className="input" type="number" placeholder={t("आपोआप: 2x भाडे", "अपने आप: 2x किराया", "Auto: 2x rent")} value={form.deposit} onChange={(e) => update("deposit", e.target.value)} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">{t("बेडरूम", "बेडरूम", "Bedrooms")}</label>
                  <select className="input" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)}>
                    {[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n === 0 ? "Studio" : n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">{t("बाथरूम", "बाथरूम", "Bathrooms")}</label>
                  <select className="input" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)}>
                    {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">{t("फर्निशिंग", "फर्निशिंग", "Furnishing")}</label>
                  <select className="input" value={form.furnishing} onChange={(e) => update("furnishing", e.target.value)}>
                    <option value="unfurnished">{t("अनफर्निश्ड", "अनफर्निश्ड", "Unfurnished")}</option>
                    <option value="semi">{t("सेमी", "सेमी", "Semi")}</option>
                    <option value="fully">{t("पूर्ण", "पूर्ण", "Fully")}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">{t("उपलब्ध तारीख", "उपलब्ध तिथि", "Available From")}</label>
                <input className="input" type="date" value={form.availableFrom} onChange={(e) => update("availableFrom", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP: Location */}
        {step === "location" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--rently-text)", marginBottom: 6 }}>{t("हे कुठे आहे?", "यह कहाँ है?", "Where is it?")}</h3>
            <p style={{ fontSize: 14, color: "var(--rently-muted)", marginBottom: 20 }}>{t("शोध बॉक्समध्ये तुमचे ठिकाण टाइप करा.", "खोज बॉक्स में अपना स्थान टाइप करें।", "Type your location in the search box below.")}</p>
            <div style={{ display: "grid", gap: 14 }}>
              {/* Location search */}
              <div style={{ position: "relative" }}>
                <label className="form-label">{t("ठिकाण शोधा", "स्थान खोजें", "Search Location")}</label>
                <input className="input" placeholder={t("उदा. अंधेरी वेस्ट, मुंबई", "जैसे अंधेरी वेस्ट, मुंबई", "e.g. Andheri West, Mumbai")} value={locationQuery} onChange={(e) => searchLocation(e.target.value)} />
                {locationResults.length > 0 && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", borderRadius: 10, marginTop: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 20, maxHeight: 200, overflow: "auto", border: "1px solid var(--rently-border-light)" }}>
                    {locationResults.map((r, i) => (
                      <button key={i} onClick={() => selectLocationResult(r)} style={{ display: "block", width: "100%", padding: "10px 14px", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontSize: 13, borderBottom: "1px solid var(--rently-border-light)", color: "var(--rently-text)" }}>
                        📍 {r.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">{t("शहर", "शहर", "City")} *</label>
                  <input className="input" placeholder={t("महाराष्ट्रातील कोणतेही शहर", "महाराष्ट्र में कोई भी शहर", "Any city in Maharashtra")} value={form.city} onChange={(e) => update("city", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">{t("भाग / ठिकाण", "इलाका", "Area / Locality")}</label>
                  <input className="input" placeholder={t("उदा. अंधेरी वेस्ट", "जैसे अंधेरी वेस्ट", "e.g. Andheri West")} value={form.area} onChange={(e) => update("area", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="form-label">{t("पूर्ण पत्ता", "पूरा पता", "Full Address")}</label>
                <input className="input" placeholder={t("इमारतीचे नाव, रस्ता, लँडमार्क", "बिल्डिंग का नाम, सड़क", "Building name, street, landmark")} value={form.address} onChange={(e) => update("address", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">{t("संपर्क फोन", "संपर्क फ़ोन", "Contact Phone")}</label>
                  <input className="input" placeholder="+91 98765 43210" value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
                </div>
                <div style={{ fontSize: 12, color: "var(--rently-muted)", display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
                  📍 {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
                </div>
              </div>

              <button onClick={useMyLocation} disabled={locationLoading} className="btn btn-primary" style={{ width: "100%", padding: "12px", fontSize: 14 }}>
                {locationLoading ? `⏳ ${t("स्थान शोधत आहे…", "स्थान खोज रहा है…", "Getting location…")}` : `📍 ${t("माझे स्थान वापरा", "मेरा स्थान उपयोग करें", "Use My Location")}`}
              </button>

              {/* Map iframe */}
              {form.city && (
                <iframe title="Location Map" width="100%" height="280" style={{ border: 0, borderRadius: 12 }} loading="lazy" src={mapUrl} />
              )}

              {/* Quick city chips */}
              <div>
                <label className="form-label">{t("झटपट शहर निवडा", "जल्दी शहर चुनें", "Quick city select")}</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {Object.keys(CITY_COORDS).map((c) => (
                    <button key={c} onClick={() => { update("city", c); if (CITY_COORDS[c]) { update("lat", CITY_COORDS[c][0]); update("lng", CITY_COORDS[c][1]); } }} className={`btn ${form.city === c ? "btn-secondary" : "btn-outline"}`} style={{ padding: "6px 12px", fontSize: 12 }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP: Amenities */}
        {step === "amenities" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--rently-text)", marginBottom: 6 }}>{t("काय समाविष्ट आहे?", "क्या शामिल है?", "What's included?")}</h3>
            <p style={{ fontSize: 14, color: "var(--rently-muted)", marginBottom: 20 }}>{t("सर्व सुविधा निवडा.", "सभी सुविधाएं चुनें।", "Select all amenities.")}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {AMENITY_OPTIONS.map((a) => (
                <button key={a.en} onClick={() => toggleAmenity(a.en)} style={{
                  padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  border: form.amenities.includes(a.en) ? "2px solid var(--rently-primary)" : "1px solid var(--rently-border)",
                  background: form.amenities.includes(a.en) ? "var(--rently-primary-light)" : "var(--rently-card)",
                  color: form.amenities.includes(a.en) ? "var(--rently-primary)" : "var(--rently-text)",
                }}>
                  {form.amenities.includes(a.en) ? "✓ " : ""}{a[lang as "mr" | "hi" | "en"] || a.mr}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <label className="form-label">{t("घराचे नियम", "घर के नियम", "House Rules")}</label>
              <textarea className="input" rows={2} placeholder={t("उदा. धूम्रपान निषेध, कुटुंब प्राधान्य…", "जैसे धूम्रपान निषेध…", "e.g. No smoking…")} value={form.rules} onChange={(e) => update("rules", e.target.value)} style={{ resize: "vertical", minHeight: 60 }} />
            </div>
          </div>
        )}

        {/* STEP: Photos */}
        {step === "photos" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--rently-text)", marginBottom: 6 }}>{t("फोटो जोडा", "फ़ोटो जोड़ें", "Add photos")}</h3>
            <p style={{ fontSize: 14, color: "var(--rently-muted)", marginBottom: 20 }}>{t("फोटोने 5x अधिक दृश्य मिळतात.", "फ़ोटो से 5x अधिक व्यूज मिलते हैं।", "Photos get 5x more views.")}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8, marginBottom: 16 }}>
              {SAMPLE_IMAGES.map((url) => {
                const selected = form.images.includes(url);
                return (
                  <button key={url} onClick={() => selected ? removeImage(form.images.indexOf(url)) : addSampleImage(url)} style={{
                    position: "relative", padding: 0, border: selected ? "3px solid var(--rently-primary)" : "1px solid var(--rently-border-light)",
                    borderRadius: 10, overflow: "hidden", cursor: "pointer", aspectRatio: "4/3",
                  }}>
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {selected && (
                      <div style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: "var(--rently-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>✓</div>
                    )}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: "var(--rently-muted)" }}>{form.images.length}/10 {t("निवडलेले", "चयनित", "selected")}</p>
          </div>
        )}

        {/* STEP: Review */}
        {step === "review" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--rently-text)", marginBottom: 6 }}>{t("पुनरावलोकन आणि प्रकाशित करा", "समीक्षा और प्रकाशित करें", "Review & publish")}</h3>
            <p style={{ fontSize: 14, color: "var(--rently-muted)", marginBottom: 20 }}>{t("सर्व काय योग्य आहे तपासा.", "सब कुछ सही है जांचें।", "Check everything looks right.")}</p>
            <div style={{ display: "grid", gap: 12 }}>
              {form.images[0] && (
                <div style={{ borderRadius: 12, overflow: "hidden", maxHeight: 200 }}>
                  <img src={form.images[0]} alt="" style={{ width: "100%", height: 200, objectFit: "cover" }} />
                </div>
              )}
              <div style={{ background: "var(--rently-cream-dark)", borderRadius: 12, padding: 16, display: "grid", gap: 8 }}>
                <ReviewRow label={t("शीर्षक", "शीर्षक", "Title")} value={form.title || "—"} />
                <ReviewRow label={t("प्रकार", "प्रकार", "Type")} value={PROPERTY_TYPES.find((tp) => tp.value === form.type)?.[lang as "mr" | "hi" | "en"] || form.type} />
                <ReviewRow label={t("भाडे", "किराया", "Rent")} value={form.price ? `₹${Number(form.price).toLocaleString("en-IN")}/mo` : "—"} />
                <ReviewRow label={t("भांडवल", "डिपॉजिट", "Deposit")} value={form.deposit ? `₹${Number(form.deposit).toLocaleString("en-IN")}` : `₹${form.price ? (Number(form.price) * 2).toLocaleString("en-IN") : "—"}`} />
                <ReviewRow label={t("ठिकाण", "स्थान", "Location")} value={[form.area, form.city].filter(Boolean).join(", ") || "—"} />
                <ReviewRow label={t("बेड/बाथ", "बेड/बाथ", "Bed/Bath")} value={`${form.bedrooms} BHK / ${form.bathrooms} Bath`} />
                <ReviewRow label={t("फर्निशिंग", "फर्निशिंग", "Furnishing")} value={form.furnishing.charAt(0).toUpperCase() + form.furnishing.slice(1)} />
                <ReviewRow label={t("सुविधा", "सुविधाएं", "Amenities")} value={form.amenities.length > 0 ? form.amenities.join(", ") : "—"} />
                <ReviewRow label={t("फोटो", "फ़ोटो", "Photos")} value={`${form.images.length} ${t("निवडलेले", "चयनित", "selected")}`} />
                <ReviewRow label={t("कोऑर्डिनेट्स", "निर्देशांक", "Coordinates")} value={`${form.lat.toFixed(4)}, ${form.lng.toFixed(4)}`} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "14px 24px", borderTop: "1px solid var(--rently-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => { const idx = steps.findIndex((s) => s.key === step); if (idx > 0) setStep(steps[idx - 1].key); }} className="btn btn-outline" disabled={currentIdx === 0}>
          ← {t("मागे", "वापस", "Back")}
        </button>
        <span style={{ fontSize: 12, color: "var(--rently-muted)" }}>{currentIdx + 1} / {steps.length}</span>
        {currentIdx < steps.length - 1 ? (
          <button onClick={() => setStep(steps[currentIdx + 1].key)} className="btn btn-primary" disabled={!canNext()}>
            {t("पुढे", "अगला", "Next")} →
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn btn-primary" disabled={submitting}>
            {submitting ? "…" : editProperty ? `💾 ${t("बदल जतन करा", "बदलाव सहेजें", "Save Changes")}` : `🚀 ${t("प्रकाशित करा", "प्रकाशित करें", "Publish")}`}
          </button>
        )}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, gap: 12 }}>
      <span style={{ color: "var(--rently-muted)", flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 600, color: "var(--rently-text)", textAlign: "right" }}>{value}</span>
    </div>
  );
}
