"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

type Step = "type" | "details" | "location" | "amenities" | "photos" | "review";

const PROPERTY_TYPES = [
  { value: "apartment", icon: "🏢", label: "Apartment / Flat" },
  { value: "house", icon: "🏠", label: "Independent House" },
  { value: "room", icon: "🛏️", label: "Room" },
  { value: "pg", icon: "🏨", label: "PG / Hostel" },
  { value: "office", icon: "💼", label: "Office Space" },
];

const CITIES = ["Mumbai", "Pune", "Thane", "Navi Mumbai", "Nagpur", "Nashik"];

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
];

interface Props {
  onDone: () => void;
}

export default function ListingWizard({ onDone }: Props) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("type");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    type: "",
    title: "",
    description: "",
    price: "",
    deposit: "",
    bedrooms: "1",
    bathrooms: "1",
    furnishing: "unfurnished",
    city: "",
    area: "",
    address: "",
    availableFrom: "",
    contactPhone: "",
    amenities: [] as string[],
    rules: "",
    images: [] as string[],
  });

  function update(field: string, value: string | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleAmenity(a: string) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  }

  function addSampleImage(url: string) {
    if (!form.images.includes(url) && form.images.length < 8) {
      update("images", [...form.images, url]);
    }
  }

  function removeImage(idx: number) {
    update("images", form.images.filter((_, i) => i !== idx));
  }

  const steps: { key: Step; label: string }[] = [
    { key: "type", label: "Type" },
    { key: "details", label: "Details" },
    { key: "location", label: "Location" },
    { key: "amenities", label: "Amenities" },
    { key: "photos", label: "Photos" },
    { key: "review", label: "Review" },
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
      const res = await fetch("/api/properties", {
        method: "POST",
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
        }),
      });
      const data = await res.json();
      if (data.success) {
        onDone();
      } else {
        setError(data.error || "Failed to list property");
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
      <div style={{ padding: "12px 24px 20px", minHeight: 320 }}>
        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", color: "#b91c1c", padding: "10px 14px", borderRadius: 10, fontSize: 14, marginBottom: 14 }}>
            {error}
          </div>
        )}

        {/* Step: Type */}
        {step === "type" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0b1437", marginBottom: 6 }}>What are you listing?</h3>
            <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>Select the type of property you want to rent out.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
              {PROPERTY_TYPES.map((t) => (
                <button key={t.value} onClick={() => update("type", t.value)} style={{
                  padding: "18px 12px", borderRadius: 14, textAlign: "center", cursor: "pointer", transition: "all 0.15s",
                  border: form.type === t.value ? "2px solid #0d6efd" : "1px solid #e3e7ef",
                  background: form.type === t.value ? "rgba(13,110,253,0.06)" : "white",
                }}>
                  <div style={{ fontSize: 30, marginBottom: 6 }}>{t.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0b1437" }}>{t.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Details */}
        {step === "details" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0b1437", marginBottom: 6 }}>Property details</h3>
            <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>Give tenants the key information.</p>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label className="form-label">Property Title *</label>
                <input className="input" placeholder="e.g. Spacious 2BHK in Andheri West" value={form.title} onChange={(e) => update("title", e.target.value)} />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="input" rows={3} placeholder="Describe your property, nearby landmarks, USPs…" value={form.description} onChange={(e) => update("description", e.target.value)} style={{ resize: "vertical", minHeight: 80 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Monthly Rent (₹) *</label>
                  <input className="input" type="number" placeholder="e.g. 22000" value={form.price} onChange={(e) => update("price", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Security Deposit (₹)</label>
                  <input className="input" type="number" placeholder="Auto: 2x rent" value={form.deposit} onChange={(e) => update("deposit", e.target.value)} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Bedrooms</label>
                  <select className="input" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)}>
                    {[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n === 0 ? "Studio" : n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Bathrooms</label>
                  <select className="input" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)}>
                    {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Furnishing</label>
                  <select className="input" value={form.furnishing} onChange={(e) => update("furnishing", e.target.value)}>
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi">Semi-furnished</option>
                    <option value="fully">Fully furnished</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Available From</label>
                <input className="input" type="date" value={form.availableFrom} onChange={(e) => update("availableFrom", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step: Location */}
        {step === "location" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0b1437", marginBottom: 6 }}>Where is it?</h3>
            <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>Help tenants find your property easily.</p>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label className="form-label">City *</label>
                <select className="input" value={form.city} onChange={(e) => update("city", e.target.value)}>
                  <option value="">Select city</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Area / Locality</label>
                <input className="input" placeholder="e.g. Andheri West, Kothrud, Baner" value={form.area} onChange={(e) => update("area", e.target.value)} />
              </div>
              <div>
                <label className="form-label">Full Address</label>
                <input className="input" placeholder="Building name, street, landmark" value={form.address} onChange={(e) => update("address", e.target.value)} />
              </div>
              <div>
                <label className="form-label">Contact Phone</label>
                <input className="input" placeholder="+91 98765 43210" value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step: Amenities */}
        {step === "amenities" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0b1437", marginBottom: 6 }}>What's included?</h3>
            <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>Select all amenities available.</p>
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
              <label className="form-label">House Rules</label>
              <textarea className="input" rows={2} placeholder="e.g. No smoking, family preferred, no pets…" value={form.rules} onChange={(e) => update("rules", e.target.value)} style={{ resize: "vertical", minHeight: 60 }} />
            </div>
          </div>
        )}

        {/* Step: Photos */}
        {step === "photos" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0b1437", marginBottom: 6 }}>Add photos</h3>
            <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>Properties with photos get 5x more views. Select sample images below.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10, marginBottom: 16 }}>
              {SAMPLE_IMAGES.map((url) => {
                const selected = form.images.includes(url);
                return (
                  <button key={url} onClick={() => selected ? removeImage(form.images.indexOf(url)) : addSampleImage(url)} style={{
                    position: "relative", padding: 0, border: selected ? "3px solid #0d6efd" : "1px solid #e3e7ef",
                    borderRadius: 10, overflow: "hidden", cursor: "pointer", aspectRatio: "4/3",
                  }}>
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {selected && (
                      <div style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", background: "#0d6efd", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>✓</div>
                    )}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: "#4b5675" }}>{form.images.length}/8 photos selected</p>
          </div>
        )}

        {/* Step: Review */}
        {step === "review" && (
          <div className="fade-in">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0b1437", marginBottom: 6 }}>Review & publish</h3>
            <p style={{ fontSize: 14, color: "#4b5675", marginBottom: 20 }}>Make sure everything looks right.</p>
            <div style={{ display: "grid", gap: 12 }}>
              {form.images[0] && (
                <div style={{ borderRadius: 12, overflow: "hidden", maxHeight: 200 }}>
                  <img src={form.images[0]} alt="" style={{ width: "100%", height: 200, objectFit: "cover" }} />
                </div>
              )}
              <div style={{ background: "#f4f6fb", borderRadius: 12, padding: 16, display: "grid", gap: 8 }}>
                <ReviewRow label="Title" value={form.title || "—"} />
                <ReviewRow label="Type" value={PROPERTY_TYPES.find((t) => t.value === form.type)?.label || form.type} />
                <ReviewRow label="Rent" value={form.price ? `₹${Number(form.price).toLocaleString("en-IN")}/mo` : "—"} />
                <ReviewRow label="Deposit" value={form.deposit ? `₹${Number(form.deposit).toLocaleString("en-IN")}` : `₹${form.price ? (Number(form.price) * 2).toLocaleString("en-IN") : "—"}`} />
                <ReviewRow label="Location" value={[form.area, form.city].filter(Boolean).join(", ") || "—"} />
                <ReviewRow label="Bed/Bath" value={`${form.bedrooms} BHK / ${form.bathrooms} Bath`} />
                <ReviewRow label="Furnishing" value={form.furnishing.charAt(0).toUpperCase() + form.furnishing.slice(1)} />
                <ReviewRow label="Amenities" value={form.amenities.length > 0 ? form.amenities.join(", ") : "—"} />
                <ReviewRow label="Photos" value={`${form.images.length} selected`} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "14px 24px", borderTop: "1px solid #e3e7ef", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => {
            const idx = steps.findIndex((s) => s.key === step);
            if (idx > 0) setStep(steps[idx - 1].key);
          }}
          className="btn btn-outline"
          disabled={currentIdx === 0}
        >
          ← Back
        </button>
        <span style={{ fontSize: 12, color: "#4b5675" }}>Step {currentIdx + 1} of {steps.length}</span>
        {currentIdx < steps.length - 1 ? (
          <button onClick={() => setStep(steps[currentIdx + 1].key)} className="btn btn-primary" disabled={!canNext()}>
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn btn-primary" disabled={submitting}>
            {submitting ? "Publishing…" : "🚀 Publish Listing"}
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
