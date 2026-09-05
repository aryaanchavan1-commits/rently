"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";

type Step = "type" | "details" | "location" | "amenities" | "photos" | "review";

const PROPERTY_TYPES = [
  { value: "apartment", icon: "🏢", label: "Apartment / Flat" },
  { value: "house", icon: "🏠", label: "Independent House" },
  { value: "room", icon: "🛏️", label: "Room" },
  { value: "pg", icon: "🏨", label: "PG / Hostel" },
  { value: "office", icon: "💼", label: "Office Space" },
];

const CITIES = ["Mumbai", "Pune", "Thane", "Navi Mumbai", "Nagpur", "Nashik"];

const CITY_COORDS: Record<string, [number, number]> = {
  "Mumbai": [19.0760, 72.8777],
  "Pune": [18.5204, 73.8567],
  "Thane": [19.2183, 72.9781],
  "Navi Mumbai": [19.0330, 73.0297],
  "Nagpur": [21.1458, 79.0882],
  "Nashik": [19.9975, 73.7898],
};

const AMENITY_OPTIONS = [
  "WiFi", "AC", "Parking", "Gym", "Pool", "Security", "Lift", "Power Backup",
  "Garden", "Furnished", "Meals", "CCTV", "Water Supply", "Gas Pipeline",
  "Modular Kitchen", "Wardrobe", "Washing Machine", "TV", "Intercom",
];

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
];

interface Props {
  onDone: () => void;
  editProperty?: Record<string, unknown> | { id: string; type: string; title: string; description: string; price: number; deposit: number; bedrooms: number; bathrooms: number; furnishing: string; city: string; area: string; address: string; lat: number; lng: number; availableFrom: string; contactPhone: string; amenities: string[]; rules: string; images: string[] };
}

export default function ListingWizard({ onDone, editProperty }: Props) {
  const { user } = useAuth();
  const { lang } = useLang();
  const [step, setStep] = useState<Step>("type");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);

  const [form, setForm] = useState({
    type: (editProperty?.type as string) || "",
    title: (editProperty?.title as string) || "",
    description: (editProperty?.description as string) || "",
    price: (editProperty?.price as number)?.toString() || "",
    deposit: (editProperty?.deposit as number)?.toString() || "",
    bedrooms: (editProperty?.bedrooms as number)?.toString() || "1",
    bathrooms: (editProperty?.bathrooms as number)?.toString() || "1",
    furnishing: (editProperty?.furnishing as string) || "unfurnished",
    city: (editProperty?.city as string) || "",
    area: (editProperty?.area as string) || "",
    address: (editProperty?.address as string) || "",
    lat: (editProperty?.lat as number) || 18.5204,
    lng: (editProperty?.lng as number) || 73.8567,
    availableFrom: (editProperty?.availableFrom as string) || "",
    contactPhone: (editProperty?.contactPhone as string) || "",
    amenities: (editProperty?.amenities as string[]) || [],
    rules: (editProperty?.rules as string) || "",
    images: (editProperty?.images as string[]) || [],
  });

  const t = (en: string, mr: string, hi: string) => lang === "mr" ? mr : lang === "hi" ? hi : en;

  function update(field: string, value: string | string[] | number) {
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

  useEffect(() => {
    if (step === "location" && mapRef.current && !(mapInstanceRef.current as { _loaded?: boolean })?._loaded) {
      const L = require("leaflet");

      const center: [number, number] = CITY_COORDS[form.city] || [18.5204, 73.8567];
      const map = L.map(mapRef.current, { center, zoom: 13, scrollWheelZoom: true });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background:linear-gradient(135deg,#ff6a3d,#ff9a6c);color:white;padding:6px 10px;border-radius:10px;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;">📍</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      const marker = L.marker(center, { icon, draggable: true }).addTo(map);

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        update("lat", pos.lat);
        update("lng", pos.lng);
      });

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        marker.setLatLng(e.latlng);
        update("lat", e.latlng.lat);
        update("lng", e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      (mapInstanceRef.current as Record<string, unknown>)._loaded = true;

      return () => { map.remove(); mapInstanceRef.current = null; };
    }
  }, [step, form.city]);

  useEffect(() => {
    if (step === "location" && form.city && CITY_COORDS[form.city] && mapInstanceRef.current) {
      const map = mapInstanceRef.current as { setView: (c: [number, number], z: number) => void };
      const marker = markerRef.current as { setLatLng: (c: [number, number]) => void };
      const coords = CITY_COORDS[form.city];
      map.setView(coords, 13);
      marker.setLatLng(coords);
      update("lat", coords[0]);
      update("lng", coords[1]);
    }
  }, [form.city, step]);

  const steps: { key: Step; label: string }[] = [
    { key: "type", label: t("Type", "प्रकार", "प्रकार") },
    { key: "details", label: t("Details", "तपशील", "विवरण") },
    { key: "location", label: t("Location", "ठिकाण", "स्थान") },
    { key: "amenities", label: t("Amenities", "सुविधा", "सुविधाएं") },
    { key: "photos", label: t("Photos", "फोटो", "फ़ोटो") },
    { key: "review", label: t("Review", "पुनरावलोकन", "समीक्षा") },
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
      if (data.success) {
        onDone();
      } else {
        setError(data.error || "Failed to save property");
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fade-in" style={{ background: "white", borderRadius: 18, border: "1px solid #e3e7ef", overflow: "hidden" }}>
      {/* Progress */}
      <div style={{ padding: "16px 24px 0" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {steps.map((s, i) => (
            <div key={s.key} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= currentIdx ? "linear-gradient(90deg,#0d6efd,#ff6a3d)" : "#e3e7ef",
              transition: "background 0.3s",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          {steps.map((s, i) => (
            <div key={s.key} style={{
              fontSize: 11, fontWeight: i === currentIdx ? 700 : 500,
              color: i === currentIdx ? "#0d6efd" : i < currentIdx ? "#10b981" : "#4b5675",
            }}>{s.label}</div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "12px 24px 20px", minHeight: 360 }}>
        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", color: "#b91c1c", padding: "10px 14px", borderRadius: 10, fontSize: 14, marginBottom: 14 }}>
            {error}
          </div>
        )}

        {step === "type" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0b1437", marginBottom: 6 }}>{t("What are you listing?", "तुम्ही काय यादी करत आहात?", "आप क्या लिस्ट कर रहे हैं?")}</h3>
            <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>{t("Select the type of property.", "मालमत्तेचा प्रकार निवडा.", "प्रॉपर्टी का प्रकार चुनें।")}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
              {PROPERTY_TYPES.map((tp) => (
                <button key={tp.value} onClick={() => update("type", tp.value)} style={{
                  padding: "18px 12px", borderRadius: 14, textAlign: "center", cursor: "pointer", transition: "all 0.15s",
                  border: form.type === tp.value ? "2px solid #0d6efd" : "1px solid #e3e7ef",
                  background: form.type === tp.value ? "rgba(13,110,253,0.06)" : "white",
                }}>
                  <div style={{ fontSize: 30, marginBottom: 6 }}>{tp.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0b1437" }}>{tp.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0b1437", marginBottom: 6 }}>{t("Property details", "मालमत्तेचे तपशील", "प्रॉपर्टी विवरण")}</h3>
            <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>{t("Give tenants the key info.", "भाडेकरूंना महत्त्वाची माहिती द्या.", "किरायेदारों को मुख्य जानकारी दें।")}</p>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label className="form-label">{t("Property Title", "मालमत्तेचे शीर्षक", "प्रॉपर्टी शीर्षक")} *</label>
                <input className="input" placeholder="e.g. Spacious 2BHK in Andheri West" value={form.title} onChange={(e) => update("title", e.target.value)} />
              </div>
              <div>
                <label className="form-label">{t("Description", "वर्णन", "विवरण")}</label>
                <textarea className="input" rows={3} placeholder={t("Describe your property, nearby landmarks, USPs…", "तुमची मालमत्ता, जवळचे लँडमार्क्स वर्णवा…", "अपनी प्रॉपर्टी का विवरण दें…")} value={form.description} onChange={(e) => update("description", e.target.value)} style={{ resize: "vertical", minHeight: 80 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">{t("Monthly Rent (₹)", "मासिक भाडे (₹)", "मासिक किराया (₹)")} *</label>
                  <input className="input" type="number" min="500" placeholder="e.g. 22000" value={form.price} onChange={(e) => update("price", e.target.value)} />
                  <span style={{ fontSize: 11, color: "#4b5675" }}>{t("Min ₹500", "किमान ₹500", "न्यूनतम ₹500")}</span>
                </div>
                <div>
                  <label className="form-label">{t("Security Deposit (₹)", "सुरक्षा भांडवल (₹)", "सिक्योरिटी डिपॉजिट (₹)")}</label>
                  <input className="input" type="number" placeholder={t("Auto: 2x rent", "आपोआप: 2x भाडे", "अपने आप: 2x किराया")} value={form.deposit} onChange={(e) => update("deposit", e.target.value)} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">{t("Bedrooms", "बेडरूम", "बेडरूम")}</label>
                  <select className="input" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)}>
                    {[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n === 0 ? "Studio" : n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">{t("Bathrooms", "बाथरूम", "बाथरूम")}</label>
                  <select className="input" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)}>
                    {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">{t("Furnishing", "फर्निशिंग", "फर्निशिंग")}</label>
                  <select className="input" value={form.furnishing} onChange={(e) => update("furnishing", e.target.value)}>
                    <option value="unfurnished">{t("Unfurnished", "अनफर्निश्ड", "अनफर्निश्ड")}</option>
                    <option value="semi">{t("Semi", "सेमी", "सेमी")}</option>
                    <option value="fully">{t("Fully", "पूर्ण", "पूर्ण")}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">{t("Available From", "उपलब्ध तारीख", "उपलब्ध तिथि")}</label>
                <input className="input" type="date" value={form.availableFrom} onChange={(e) => update("availableFrom", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {step === "location" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0b1437", marginBottom: 6 }}>{t("Where is it?", "हे कुठे आहे?", "यह कहाँ है?")}</h3>
            <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>{t("Drag the pin on the map to set exact location.", "अचूक ठिकाण सेट करण्यासाठी नकाशावरील पिन ड्रॅग करा.", "सटीक स्थान सेट करने के लिए नक्शे पर पिन खींचें।")}</p>
            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">{t("City", "शहर", "शहर")} *</label>
                  <select className="input" value={form.city} onChange={(e) => update("city", e.target.value)}>
                    <option value="">{t("Select city", "शहर निवडा", "शहर चुनें")}</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">{t("Area / Locality", "भाग / ठिकाण", "इलाका")}</label>
                  <input className="input" placeholder={t("e.g. Andheri West", "उदा. अंधेरी वेस्ट", "जैसे अंधेरी वेस्ट")} value={form.area} onChange={(e) => update("area", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="form-label">{t("Full Address", "पूर्ण पत्ता", "पूरा पता")}</label>
                <input className="input" placeholder={t("Building name, street, landmark", "इमारतीचे नाव, रस्ता, लँडमार्क", "बिल्डिंग का नाम, सड़क")} value={form.address} onChange={(e) => update("address", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">{t("Contact Phone", "संपर्क फोन", "संपर्क फ़ोन")}</label>
                  <input className="input" placeholder="+91 98765 43210" value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
                </div>
                <div style={{ fontSize: 12, color: "#4b5675", display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
                  📍 {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
                </div>
              </div>
              {form.city && (
                <div ref={mapRef} style={{ height: 280, borderRadius: 12, overflow: "hidden", border: "1px solid #e3e7ef" }} />
              )}
            </div>
          </div>
        )}

        {step === "amenities" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0b1437", marginBottom: 6 }}>{t("What's included?", "काय समाविष्ट आहे?", "क्या शामिल है?")}</h3>
            <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>{t("Select all amenities.", "सर्व सुविधा निवडा.", "सभी सुविधाएं चुनें।")}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {AMENITY_OPTIONS.map((a) => (
                <button key={a} onClick={() => toggleAmenity(a)} style={{
                  padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  border: form.amenities.includes(a) ? "2px solid #0d6efd" : "1px solid #d3d8e1",
                  background: form.amenities.includes(a) ? "rgba(13,110,253,0.08)" : "white",
                  color: form.amenities.includes(a) ? "#0d6efd" : "#0b1437",
                }}>
                  {form.amenities.includes(a) ? "✓ " : ""}{a}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <label className="form-label">{t("House Rules", "घराचे नियम", "घर के नियम")}</label>
              <textarea className="input" rows={2} placeholder={t("e.g. No smoking, family preferred…", "उदा. धूम्रपान निषेध, कुटुंब प्राधान्य…", "जैसे धूम्रपान निषेध…")} value={form.rules} onChange={(e) => update("rules", e.target.value)} style={{ resize: "vertical", minHeight: 60 }} />
            </div>
          </div>
        )}

        {step === "photos" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0b1437", marginBottom: 6 }}>{t("Add photos", "फोटो जोडा", "फ़ोटो जोड़ें")}</h3>
            <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>{t("Photos get 5x more views.", "फोटोने 5x अधिक दृश्य मिळतात.", "फ़ोटो से 5x अधिक व्यूज मिलते हैं।")}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8, marginBottom: 16 }}>
              {SAMPLE_IMAGES.map((url) => {
                const selected = form.images.includes(url);
                return (
                  <button key={url} onClick={() => selected ? removeImage(form.images.indexOf(url)) : addSampleImage(url)} style={{
                    position: "relative", padding: 0, border: selected ? "3px solid #0d6efd" : "1px solid #e3e7ef",
                    borderRadius: 10, overflow: "hidden", cursor: "pointer", aspectRatio: "4/3",
                  }}>
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {selected && (
                      <div style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: "#0d6efd", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>✓</div>
                    )}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: "#4b5675" }}>{form.images.length}/10 {t("selected", "निवडलेले", "चयनित")}</p>
          </div>
        )}

        {step === "review" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0b1437", marginBottom: 6 }}>{t("Review & publish", "पुनरावलोकन आणि प्रकाशित करा", "समीक्षा और प्रकाशित करें")}</h3>
            <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>{t("Check everything looks right.", "सर्व काय योग्य आहे तपासा.", "सब कुछ सही है जांचें।")}</p>
            <div style={{ display: "grid", gap: 12 }}>
              {form.images[0] && (
                <div style={{ borderRadius: 12, overflow: "hidden", maxHeight: 200 }}>
                  <img src={form.images[0]} alt="" style={{ width: "100%", height: 200, objectFit: "cover" }} />
                </div>
              )}
              <div style={{ background: "#f4f6fb", borderRadius: 12, padding: 16, display: "grid", gap: 8 }}>
                <ReviewRow label={t("Title", "शीर्षक", "शीर्षक")} value={form.title || "—"} />
                <ReviewRow label={t("Type", "प्रकार", "प्रकार")} value={PROPERTY_TYPES.find((tp) => tp.value === form.type)?.label || form.type} />
                <ReviewRow label={t("Rent", "भाडे", "किराया")} value={form.price ? `₹${Number(form.price).toLocaleString("en-IN")}/mo` : "—"} />
                <ReviewRow label={t("Deposit", "भांडवल", "डिपॉजिट")} value={form.deposit ? `₹${Number(form.deposit).toLocaleString("en-IN")}` : `₹${form.price ? (Number(form.price) * 2).toLocaleString("en-IN") : "—"}`} />
                <ReviewRow label={t("Location", "ठिकाण", "स्थान")} value={[form.area, form.city].filter(Boolean).join(", ") || "—"} />
                <ReviewRow label={t("Bed/Bath", "बेड/बाथ", "बेड/बाथ")} value={`${form.bedrooms} BHK / ${form.bathrooms} Bath`} />
                <ReviewRow label={t("Furnishing", "फर्निशिंग", "फर्निशिंग")} value={form.furnishing.charAt(0).toUpperCase() + form.furnishing.slice(1)} />
                <ReviewRow label={t("Amenities", "सुविधा", "सुविधाएं")} value={form.amenities.length > 0 ? form.amenities.join(", ") : "—"} />
                <ReviewRow label={t("Photos", "फोटो", "फ़ोटो")} value={`${form.images.length} selected`} />
                <ReviewRow label={t("Coordinates", "कोऑर्डिनेट्स", "निर्देशांक")} value={`${form.lat.toFixed(4)}, ${form.lng.toFixed(4)}`} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "14px 24px", borderTop: "1px solid #e3e7ef", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => { const idx = steps.findIndex((s) => s.key === step); if (idx > 0) setStep(steps[idx - 1].key); }} className="btn btn-outline" disabled={currentIdx === 0}>
          ← {t("Back", "मागे", "वापस")}
        </button>
        <span style={{ fontSize: 12, color: "#4b5675" }}>{currentIdx + 1} / {steps.length}</span>
        {currentIdx < steps.length - 1 ? (
          <button onClick={() => setStep(steps[currentIdx + 1].key)} className="btn btn-primary" disabled={!canNext()}>
            {t("Next", "पुढे", "अगला")} →
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn btn-primary" disabled={submitting}>
            {submitting ? "…" : editProperty ? `💾 ${t("Save Changes", "बदल जतन करा", "बदलाव सहेजें")}` : `🚀 ${t("Publish", "प्रकाशित करा", "प्रकाशित करें")}`}
          </button>
        )}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, gap: 12 }}>
      <span style={{ color: "#4b5675", flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 600, color: "#0b1437", textAlign: "right" }}>{value}</span>
    </div>
  );
}
