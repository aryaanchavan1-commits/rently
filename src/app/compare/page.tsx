"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Prop { id: string; title: string; price: number; deposit: number; type: string; area: string; city: string; bedrooms: number; bathrooms: number; furnishing: string; amenities: string[]; images: string[]; isVerified: boolean; views: number; description: string; status: string; }

export default function ComparePage() {
  const [allProps, setAllProps] = useState<Prop[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [compared, setCompared] = useState<Prop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/properties").then(r => r.json()).then(d => { setAllProps(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCompared(allProps.filter(p => selected.includes(p.id)));
  }, [selected, allProps]);

  function toggle(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  }

  const fields: { label: string; key: keyof Prop; format?: (v: any) => string }[] = [
    { label: "Rent", key: "price", format: v => `₹${v.toLocaleString("en-IN")}/mo` },
    { label: "Deposit", key: "deposit", format: v => `₹${v.toLocaleString("en-IN")}` },
    { label: "Type", key: "type", format: v => v.charAt(0).toUpperCase() + v.slice(1) },
    { label: "BHK", key: "bedrooms", format: v => v === 0 ? "Studio" : `${v} BHK` },
    { label: "Bathrooms", key: "bathrooms" },
    { label: "Furnishing", key: "furnishing", format: v => v === "fully" ? "Fully Furnished" : v === "semi" ? "Semi Furnished" : "Unfurnished" },
    { label: "Area", key: "area" },
    { label: "City", key: "city" },
    { label: "Verified", key: "isVerified", format: v => v ? "Yes" : "No" },
    { label: "Views", key: "views" },
  ];

  return (
    <div className="page-cream">
      <Navbar />
      <div className="container-app" style={{ padding: "30px 20px 60px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Compare Properties</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>Select up to 3 properties to compare side by side</p>

        {selected.length < 3 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 10 }}>
              {allProps.filter(p => p.status === "active").slice(0, 20).map(p => (
                <button key={p.id} onClick={() => toggle(p.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: 12,
                  border: selected.includes(p.id) ? "2px solid var(--primary)" : "1px solid var(--border)",
                  background: selected.includes(p.id) ? "var(--primary-light)" : "var(--surface)", cursor: "pointer", textAlign: "left",
                }}>
                  <input type="checkbox" checked={selected.includes(p.id)} readOnly style={{ accentColor: "var(--primary)" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.area}, {p.city} - ₹{p.price.toLocaleString("en-IN")}/mo</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {compared.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 12, fontWeight: 700, color: "var(--text-muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "2px solid var(--border)", width: 140 }}></th>
                  {compared.map(p => (
                    <th key={p.id} style={{ padding: 12, borderBottom: "2px solid var(--border)", textAlign: "center" }}>
                      <div style={{ width: 80, height: 60, borderRadius: 8, overflow: "hidden", margin: "0 auto 8px", background: "var(--border-light)" }}>
                        {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{p.title}</div>
                      <button onClick={() => toggle(p.id)} style={{ fontSize: 11, color: "var(--danger)", background: "none", border: "none", cursor: "pointer", marginTop: 4 }}>Remove</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.map(f => (
                  <tr key={f.key}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--text-muted)", fontSize: 13, borderBottom: "1px solid var(--border-light)" }}>{f.label}</td>
                    {compared.map(p => (
                      <td key={p.id} style={{ padding: "10px 12px", textAlign: "center", fontSize: 14, borderBottom: "1px solid var(--border-light)", color: "var(--text)" }}>
                        {f.format ? f.format(p[f.key]) : String(p[f.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--text-muted)", fontSize: 13, borderBottom: "1px solid var(--border-light)" }}>Amenities</td>
                  {compared.map(p => (
                    <td key={p.id} style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, borderBottom: "1px solid var(--border-light)" }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
                        {p.amenities?.slice(0, 5).map(a => <span key={a} style={{ padding: "2px 8px", borderRadius: 999, background: "var(--primary-light)", color: "var(--primary)", fontSize: 10, fontWeight: 600 }}>{a}</span>)}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {compared.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
            Select properties above to start comparing
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
