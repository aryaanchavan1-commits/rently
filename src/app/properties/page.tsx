"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import AIChat from "@/components/AIChat";

const allProperties = [
  { id: "1", title: "Spacious 2BHK with Modern Amenities", type: "apartment", price: 22000, address: "Andheri West, Mumbai", area: "Andheri West", city: "Mumbai", bedrooms: 2, bathrooms: 2, furnishing: "semi", images: JSON.stringify(["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]), isVerified: true, isFeatured: true },
  { id: "2", title: "Cozy 1BHK Near Metro Station", type: "apartment", price: 12000, address: "Kothrud, Pune", area: "Kothrud", city: "Pune", bedrooms: 1, bathrooms: 1, furnishing: "furnished", images: JSON.stringify(["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]), isVerified: true, isFeatured: false },
  { id: "3", title: "Premium 3BHK with Garden View", type: "house", price: 35000, address: "Baner, Pune", area: "Baner", city: "Pune", bedrooms: 3, bathrooms: 3, furnishing: "furnished", images: JSON.stringify(["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]), isVerified: true, isFeatured: true },
  { id: "4", title: "Furnished Room in Shared Flat", type: "room", price: 6500, address: "Hinjewadi, Pune", area: "Hinjewadi", city: "Pune", bedrooms: 1, bathrooms: 1, furnishing: "furnished", images: JSON.stringify(["https://images.unsplash.com/photo-1598928506311-c55ez637a513?w=800"]), isVerified: false, isFeatured: false },
  { id: "5", title: "Independent House with Parking", type: "house", price: 18000, address: "Thane West", area: "Thane West", city: "Thane", bedrooms: 2, bathrooms: 2, furnishing: "unfurnished", images: JSON.stringify(["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"]), isVerified: true, isFeatured: false },
  { id: "6", title: "Luxury 2BHK with Pool Access", type: "apartment", price: 28000, address: "Powai, Mumbai", area: "Powai", city: "Mumbai", bedrooms: 2, bathrooms: 2, furnishing: "fully", images: JSON.stringify(["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"]), isVerified: true, isFeatured: true },
  { id: "7", title: "Budget Friendly PG with Meals", type: "pg", price: 8000, address: "Wakad, Pune", area: "Wakad", city: "Pune", bedrooms: 1, bathrooms: 1, furnishing: "furnished", images: JSON.stringify(["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"]), isVerified: true, isFeatured: false },
  { id: "8", title: "Office Space in IT Park", type: "office", price: 35000, address: "Hinjewadi, Pune", area: "Hinjewadi", city: "Pune", bedrooms: 0, bathrooms: 2, furnishing: "fully", images: JSON.stringify(["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"]), isVerified: true, isFeatured: false },
  { id: "9", title: "Semi-Furnished 2BHK Near Station", type: "apartment", price: 16000, address: "Dadar West, Mumbai", area: "Dadar", city: "Mumbai", bedrooms: 2, bathrooms: 1, furnishing: "semi", images: JSON.stringify(["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"]), isVerified: true, isFeatured: false },
  { id: "10", title: "Single Room for Students", type: "room", price: 5000, address: "Near Pune University", area: "Kothrud", city: "Pune", bedrooms: 1, bathrooms: 1, furnishing: "unfurnished", images: JSON.stringify(["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"]), isVerified: false, isFeatured: false },
  { id: "11", title: "Premium 3BHK in Gated Society", type: "apartment", price: 32000, address: "Vashi, Navi Mumbai", area: "Vashi", city: "Navi Mumbai", bedrooms: 3, bathrooms: 2, furnishing: "semi", images: JSON.stringify(["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"]), isVerified: true, isFeatured: true },
  { id: "12", title: "Modern Studio Apartment", type: "apartment", price: 14000, address: "Bandra East, Mumbai", area: "Bandra East", city: "Mumbai", bedrooms: 1, bathrooms: 1, furnishing: "fully", images: JSON.stringify(["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"]), isVerified: true, isFeatured: false },
];

const cityList = ["Mumbai", "Pune", "Thane", "Navi Mumbai", "Nagpur", "Nashik"];
const typeList = ["1BHK", "2BHK", "3BHK", "PG", "Office"];
const sortList = ["recommended", "price_asc", "price_desc", "newest"];

function Content() {
  const searchParams = useSearchParams();
  const [filtered, setFiltered] = useState(allProperties);
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sort, setSort] = useState("recommended");

  useEffect(() => {
    let r = [...allProperties];
    if (city) r = r.filter((p) => p.city === city);
    if (type) r = r.filter((p) => p.type === type.toLowerCase().replace("bhk", "bhk"));
    r = r.filter((p) => p.price <= maxPrice);
    if (sort === "price_asc") r.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") r.sort((a, b) => b.price - a.price);
    else if (sort === "newest") r.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    setFiltered(r);
  }, [city, type, maxPrice, sort]);

  return (
    <div style={{ padding: "30px 0 60px", background: "#f7f8fc", minHeight: "calc(100vh - 66px)" }}>
      <div className="container-app">
        <div style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0b1437" }}>
            {city ? `Rentals in ${city}` : "Browse Maharashtra rentals"}
          </h1>
          <p style={{ color: "#4b5675", fontSize: 14, marginTop: 4 }}>{filtered.length} properties found</p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          <button onClick={() => setCity("")} className={`btn ${!city ? "btn-secondary" : "btn-outline"}`} style={{ padding: "8px 14px" }}>All Maharashtra</button>
          {cityList.map((c) => (
            <button key={c} onClick={() => setCity(c)} className={`btn ${city === c ? "btn-secondary" : "btn-outline"}`} style={{ padding: "8px 14px" }}>{c}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18, alignItems: "center" }}>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)} style={{ width: 160 }}>
            <option value="">Any type</option>
            {typeList.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 180 }}>
            {sortList.map((s) => <option key={s} value={s}>{s.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>)}
          </select>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input type="range" min="5000" max="100000" step="1000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: "100%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4b5675" }}>
              <span>₹5,000</span>
              <span>Max: ₹{maxPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ background: "white", borderRadius: 16, padding: 50, textAlign: "center", border: "1px solid #e3e7ef", marginTop: 20 }}>
            <div style={{ fontSize: 50, marginBottom: 12 }}>🏚️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No properties found</h3>
            <p style={{ color: "#4b5675", marginBottom: 18 }}>Try widening your filters, or chat with Ria for suggestions.</p>
            <button onClick={() => { setCity(""); setType(""); setMaxPrice(100000); }} className="btn btn-secondary">Clear all filters</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginTop: 22 }}>
            {filtered.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="hero-gradient" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="skeleton" style={{ width: 200, height: 20, borderRadius: 10 }} /></div>}>
      <Navbar />
      <Content />
      <Footer />
      <AIChat />
    </Suspense>
  );
}
