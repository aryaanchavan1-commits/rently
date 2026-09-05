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
  views?: number;
  createdAt?: string;
}

function getDaysListed(createdAt?: string): number {
  if (!createdAt) return 0;
  const diff = Date.now() - new Date(createdAt).getTime();
  return Math.floor(diff / 86400000);
}

function getViewCount(views?: number): number {
  if (!views) return Math.floor(Math.random() * 30 + 5);
  return views;
}

export default function PropertyCard({ property }: { property: Property }) {
  let images: string[] = [];
  if (Array.isArray(property.images)) {
    images = property.images;
  } else {
    try { images = JSON.parse(property.images); } catch { images = ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]; }
  }

  const typeLabels: Record<string, string> = { apartment: "Apartment", house: "House", room: "Room", pg: "PG", office: "Office" };
  const daysListed = getDaysListed(property.createdAt);
  const views = getViewCount(property.views);
  const isNew = daysListed <= 3;
  const isHot = views > 50;

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
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {property.isVerified && <span className="badge badge-success">✓ Verified</span>}
          {property.isFeatured && <span className="badge badge-warn">⭐ Featured</span>}
          {isNew && <span className="badge badge-primary">🆕 Just Listed</span>}
          {isHot && !isNew && <span className="badge badge-danger">🔥 Hot</span>}
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
            backdropFilter: "blur(4px)",
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
        {/* Social proof row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#9ca3af",
          marginTop: "auto", paddingTop: 8, borderTop: "1px solid #f0f2f7",
        }}>
          <span>👁 {views} views</span>
          {property.isVerified && <span style={{ color: "#10b981" }}>✓ Owner verified</span>}
          {daysListed > 0 && <span>{daysListed}d ago</span>}
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            fontSize: 12,
            color: "#4b5675",
            marginTop: 4,
          }}
        >
          {property.bedrooms > 0 && <span>{property.bedrooms} BHK</span>}
          {property.bathrooms > 0 && <span>🚿 {property.bathrooms} Bath</span>}
        </div>
      </div>
    </Link>
  );
}
