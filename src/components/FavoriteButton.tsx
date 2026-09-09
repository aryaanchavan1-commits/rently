"use client";
import { useState, useEffect } from "react";

export default function FavoriteButton({ propertyId }: { propertyId: string }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("rently_favorites") || "[]");
    setIsFav(favs.includes(propertyId));
  }, [propertyId]);

  function toggle() {
    const favs = JSON.parse(localStorage.getItem("rently_favorites") || "[]");
    const updated = isFav ? favs.filter((id: string) => id !== propertyId) : [...favs, propertyId];
    localStorage.setItem("rently_favorites", JSON.stringify(updated));
    setIsFav(!isFav);
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      style={{
        width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        background: isFav ? "#fef2f2" : "rgba(255,255,255,0.9)", border: "none", cursor: "pointer",
        transition: "all 0.15s", flexShrink: 0,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "#dc2626" : "none"} stroke={isFav ? "#dc2626" : "#6b7280"} strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
