"use client";

import Link from "next/link";

interface Property {
  id: string;
  title: string;
  type: string;
  price: number;
  address: string;
  area: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  furnishing: string;
  images: string | string[];
  isVerified: boolean;
  isFeatured: boolean;
}

export default function PropertyCard({ property }: { property: Property }) {
  let images: string[] = [];
  if (Array.isArray(property.images)) {
    images = property.images;
  } else {
    try { images = JSON.parse(property.images); } catch { images = ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]; }
  }

  const typeLabels: Record<string, string> = { apartment: "Apartment", house: "House", room: "Room", pg: "PG", office: "Office" };

  return (
    <Link
      href={`/properties/${property.id}`}
      className="property-card"
      style={{
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #e3e7ef",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div style={{ position: "relative", paddingTop: "65%", background: "#f0f2f7", overflow: "hidden" }}>
        <img
          src={images[0]}
          alt={property.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
          {property.isVerified && <span className="badge badge-success">✓ Verified</span>}
          {property.isFeatured && <span className="badge badge-warn">⭐ Featured</span>}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            background: "rgba(11,20,55,0.85)",
            color: "white",
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          ₹{property.price.toLocaleString("en-IN")}/mo
        </div>
      </div>
      <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 11,
            color: "#4b5675",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {typeLabels[property.type] || property.type} · {property.furnishing === "semi" ? "Semi" : property.furnishing === "fully" ? "Furnished" : "Unfurnished"}
        </div>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#0b1437",
            margin: "4px 0 6px",
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: 40,
          }}
        >
          {property.title}
        </h3>
        <div
          style={{
            fontSize: 13,
            color: "#4b5675",
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 10,
          }}
        >
          📍 {property.area}, {property.city}
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            fontSize: 12,
            color: "#4b5675",
            marginTop: "auto",
            paddingTop: 10,
            borderTop: "1px solid #f0f2f7",
          }}
        >
          {property.bedrooms > 0 && <span>{property.bedrooms} BHK</span>}
          {property.bathrooms > 0 && <span>🚿 {property.bathrooms} Bath</span>}
        </div>
      </div>
    </Link>
  );
}
