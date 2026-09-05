"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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
  showUserLocation?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  draggable?: boolean;
}

function MapInner({
  properties,
  center = [19.7515, 75.7139],
  zoom = 7,
  height = "500px",
  onPropertyClick,
  showUserLocation = false,
  onLocationSelect,
  draggable = false,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState("");

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }
    setLocationError("Getting your location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(loc);
        setLocationError("");
        const map = mapInstanceRef.current;
        if (map) {
          map.setView(loc, 14);
          addUserMarker(loc);
        }
      },
      () => {
        setLocationError("Location access denied. Using default.");
        const fallback: [number, number] = [18.5204, 73.8567];
        setUserLocation(fallback);
        mapInstanceRef.current?.setView(fallback, 13);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const addUserMarker = useCallback((loc: [number, number]) => {
    const L = window.L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }

    const userIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="width:20px;height:20px;background:#0d6efd;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(13,110,253,0.3),0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const marker = L.marker(loc, { icon: userIcon }).addTo(map);
    marker.bindPopup("<div style='font-weight:700;font-size:13px;'>📍 Your Location</div>");
    userMarkerRef.current = marker;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsClient(true);
    // Load leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }
    // Load leaflet JS
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isClient || !leafletLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;
    if (!L) return;

    delete L.Icon.Default.prototype._getIconUrl;
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

    if (draggable && onLocationSelect) {
      const pickIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background:linear-gradient(135deg,#ff6a3d,#ff9a6c);color:white;padding:6px 10px;border-radius:10px;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;cursor:grab;">📍</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      const marker = L.marker(center, { icon: pickIcon, draggable: true }).addTo(map);
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onLocationSelect(pos.lat, pos.lng);
      });
      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        marker.setLatLng(e.latlng);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });
    }

    mapInstanceRef.current = map;

    if (showUserLocation) {
      requestLocation();
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      userMarkerRef.current = null;
    };
  }, [isClient, leafletLoaded, properties, center, zoom, showUserLocation, draggable, onPropertyClick, onLocationSelect, requestLocation]);

  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid #e3e7ef" }}>
      {!isClient || !leafletLoaded ? (
        <div style={{ width: "100%", height, background: "#f0f2f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🗺️</div>
            <div style={{ fontSize: 14, color: "#4b5675" }}>Loading map…</div>
          </div>
        </div>
      ) : (
        <div ref={mapRef} style={{ width: "100%", height, background: "#f0f2f7" }} />
      )}
      {isClient && leafletLoaded && showUserLocation && (
        <button
          onClick={requestLocation}
          style={{
            position: "absolute", top: 12, right: 12, zIndex: 1000,
            background: "white", border: "1px solid #e3e7ef", borderRadius: 10,
            padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          📍 {userLocation ? "Center on Me" : "Use My Location"}
        </button>
      )}
      {locationError && (
        <div style={{
          position: "absolute", top: 56, right: 12, zIndex: 1000,
          background: "rgba(11,20,55,0.9)", color: "white", padding: "6px 12px",
          borderRadius: 8, fontSize: 11, backdropFilter: "blur(8px)",
        }}>
          {locationError}
        </div>
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
