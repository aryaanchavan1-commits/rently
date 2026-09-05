"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";

const L = typeof window !== "undefined" ? require("leaflet") : null;

interface MapProperty {
  id: string;
  title: string;
  price: number;
  type: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
  bedrooms: number;
  images: string[];
  isFeatured: boolean;
}

interface Props {
  properties: MapProperty[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onPropertyClick?: (id: string) => void;
}

function MapInner({ properties, center = [19.7515, 75.7139], zoom = 7, height = "500px", onPropertyClick }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const [loaded, setLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || loaded || !L) return;

    delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    const map = L.map(mapRef.current, {
      center,
      zoom,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const primaryIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="background:linear-gradient(135deg,#0d6efd,#0a58ca);color:white;padding:4px 8px;border-radius:8px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;cursor:pointer;">🏠</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    const featuredIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="background:linear-gradient(135deg,#ff6a3d,#ff9a6c);color:white;padding:4px 8px;border-radius:8px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;cursor:pointer;">⭐</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    properties.forEach((p) => {
      if (!p.lat || !p.lng) return;
      const icon = p.isFeatured ? featuredIcon : primaryIcon;
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
      const img = p.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400";
      const popupContent = `
        <div style="min-width:220px;font-family:system-ui,sans-serif;">
          <img src="${img}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px;" loading="lazy" />
          <div style="font-weight:700;font-size:14px;color:#0b1437;margin-bottom:4px;">${p.title}</div>
          <div style="font-size:12px;color:#4b5675;margin-bottom:4px;">${p.area}, ${p.city} · ${p.bedrooms > 0 ? p.bedrooms + "BHK" : p.type}</div>
          <div style="font-size:16px;font-weight:800;color:#ff6a3d;">₹${p.price.toLocaleString("en-IN")}/mo</div>
          <a href="/properties/${p.id}" style="display:inline-block;margin-top:8px;padding:6px 14px;background:#0d6efd;color:white;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;">View Details →</a>
        </div>
      `;
      marker.bindPopup(popupContent, { maxWidth: 260, className: "rently-popup" });
      marker.on("click", () => {
        if (onPropertyClick) onPropertyClick(p.id);
      });
    });

    if (properties.length > 0) {
      const validProps = properties.filter((p) => p.lat && p.lng);
      if (validProps.length > 0) {
        const bounds = L.latLngBounds(validProps.map((p) => [p.lat, p.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      }
    }

    mapInstanceRef.current = map;
    setLoaded(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isClient, properties, center, zoom, loaded, onPropertyClick]);

  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid #e3e7ef" }}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      {!isClient ? (
        <div style={{ width: "100%", height, background: "#f0f2f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🗺️</div>
            <div style={{ fontSize: 14, color: "#4b5675" }}>Loading map…</div>
          </div>
        </div>
      ) : (
        <div ref={mapRef} style={{ width: "100%", height, background: "#f0f2f7" }} />
      )}
      {properties.length > 0 && (
        <div style={{
          position: "absolute", bottom: 12, left: 12, background: "rgba(11,20,55,0.9)",
          color: "white", padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, zIndex: 1000,
          backdropFilter: "blur(8px)",
        }}>
          📍 {properties.length} {properties.length === 1 ? "property" : "properties"} on map
        </div>
      )}
    </div>
  );
}

export default function PropertyMap(props: Props) {
  return <MapInner {...props} />;
}
