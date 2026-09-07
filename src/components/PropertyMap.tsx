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

interface NearbyPlace {
  lat: number;
  lon: number;
  name: string;
  type: string;
  icon: string;
}

interface Props {
  properties?: MapProperty[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onPropertyClick?: (id: string) => void;
  showUserLocation?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedPropertyId?: string;
}

const MAHARASHTRA_CENTER: [number, number] = [19.7515, 75.7139];
const INDIA_ZOOM = 7;
const CITY_ZOOM = 12;
const PROPERTY_ZOOM = 15;

const TILE_PROVIDERS = {
  standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  cartoLight: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  cartoDark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  cartoVoyager: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  topo: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
};

const PROPERTY_TYPE_ICONS: Record<string, string> = {
  apartment: "🏢",
  house: "🏠",
  room: "🛏️",
  pg: "🏨",
  office: "💼",
};

const NEARBY_CATEGORIES = [
  { key: "education", label: "Schools & Colleges", icon: "🏫", query: "['amenity'~'school|college|university']" },
  { key: "healthcare", label: "Hospitals & Clinics", icon: "🏥", query: "['amenity'~'hospital|clinic|pharmacy']" },
  { key: "shopping", label: "Shopping & Markets", icon: "🛒", query: "['shop'~'supermarket|mall|market']" },
  { key: "food", label: "Restaurants & Cafes", icon: "🍽️", query: "['amenity'~'restaurant|cafe|fast_food']" },
  { key: "transport", label: "Metro & Bus Stops", icon: "🚇", query: "['public_transport'~'station|stop_position|railway']" },
  { key: "parks", label: "Parks & Gardens", icon: "🌳", query: "['leisure'~'park|garden']" },
];

export default function PropertyMap({
  properties = [],
  center,
  zoom,
  height = "500px",
  onPropertyClick,
  showUserLocation = true,
  onLocationSelect,
  selectedPropertyId,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const nearbyLayerRef = useRef<any[]>([]);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [mapStyle, setMapStyle] = useState<keyof typeof TILE_PROVIDERS>("cartoVoyager");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ lat: number; lon: number; name: string }>>([]);
  const [showNearby, setShowNearby] = useState(false);

  const getMapCenter = useCallback((): [number, number] => {
    if (center) return center;
    if (userLocation) return userLocation;
    if (properties.length > 0) {
      const withCoords = properties.filter((p) => p.lat && p.lng);
      if (withCoords.length > 0) {
        const avgLat = withCoords.reduce((s, p) => s + p.lat, 0) / withCoords.length;
        const avgLng = withCoords.reduce((s, p) => s + p.lng, 0) / withCoords.length;
        return [avgLat, avgLng];
      }
    }
    return MAHARASHTRA_CENTER;
  }, [center, userLocation, properties]);

  const getMapZoom = useCallback((): number => {
    if (zoom) return zoom;
    if (properties.length > 0) return CITY_ZOOM;
    return INDIA_ZOOM;
  }, [zoom, properties]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = require("leaflet");

    const map = L.map(mapRef.current, {
      center: getMapCenter(),
      zoom: getMapZoom(),
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    tileLayerRef.current = L.tileLayer(TILE_PROVIDERS[mapStyle], {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(loc);
          map.setView(loc, CITY_ZOOM);

          const userIcon = L.divIcon({
            className: "user-location-marker",
            html: `<div style="width:20px;height:20px;background:linear-gradient(135deg,#4285f4,#34a853);border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);position:relative;">
              <div style="position:absolute;top:-4px;left:-4px;width:28px;height:28px;background:rgba(66,133,244,0.2);border-radius:50%;animation:pulse 2s infinite;"></div>
            </div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          userMarkerRef.current = L.marker(loc, { icon: userIcon, zIndexOffset: 1000 })
            .bindPopup(`<div style="font-family:system-ui;"><b>Your Location</b><br/>Lat: ${loc[0].toFixed(4)}, Lng: ${loc[1].toFixed(4)}</div>`)
            .addTo(map);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const L = require("leaflet");

    tileLayerRef.current?.remove();
    tileLayerRef.current = L.tileLayer(TILE_PROVIDERS[mapStyle], {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);
  }, [mapStyle]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const L = require("leaflet");

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    properties.forEach((p) => {
      if (!p.lat || !p.lng) return;

      const icon = L.divIcon({
        className: "property-marker",
        html: `<div style="
          background:${p.id === selectedPropertyId ? "var(--rently-primary)" : "white"};
          color:${p.id === selectedPropertyId ? "white" : "var(--rently-primary)"};
          padding:4px 8px;border-radius:8px;font-size:12px;font-weight:700;
          box-shadow:0 2px 8px rgba(0,0,0,0.2);white-space:nowrap;
          border:2px solid ${p.id === selectedPropertyId ? "var(--rently-primary)" : "var(--rently-accent)"};
          cursor:pointer;display:flex;align-items:center;gap:4px;
        ">
          ${PROPERTY_TYPE_ICONS[p.type] || "🏠"}
          ₹${(p.price / 1000).toFixed(1)}K
          ${p.isFeatured ? "⭐" : ""}
        </div>`,
        iconSize: [0, 0],
        iconAnchor: [40, 20],
      });

      const marker = L.marker([p.lat, p.lng], { icon })
        .bindPopup(`
          <div style="font-family:system-ui;min-width:200px;">
            ${p.images[0] ? `<img src="${p.images[0]}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />` : ""}
            <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${p.title}</div>
            <div style="color:#666;font-size:12px;margin-bottom:4px;">📍 ${p.area}, ${p.city}</div>
            <div style="display:flex;gap:8px;margin-bottom:6px;">
              <span style="font-size:11px;color:#666;">🛏️ ${p.bedrooms}BHK</span>
              <span style="font-size:11px;color:#666;">·</span>
              <span style="font-size:11px;color:#666;text-transform:capitalize;">${p.type}</span>
            </div>
            <div style="font-size:18px;font-weight:800;color:var(--rently-primary);">₹${p.price.toLocaleString("en-IN")}<span style="font-size:11px;font-weight:500;color:#666;">/mo</span></div>
            <a href="/properties/${p.id}" style="display:block;text-align:center;margin-top:8px;padding:6px 12px;background:var(--rently-primary);color:white;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600;">View Details →</a>
          </div>
        `)
        .addTo(map);

      marker.on("click", () => onPropertyClick?.(p.id));
      markersRef.current.push(marker);
    });

    if (markersRef.current.length > 0 && !center && !userLocation) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [properties, selectedPropertyId, onPropertyClick]);

  useEffect(() => {
    if (!selectedPropertyId) return;
    const map = mapInstanceRef.current;
    if (!map) return;

    const prop = properties.find((p) => p.id === selectedPropertyId);
    if (prop && prop.lat && prop.lng) {
      map.setView([prop.lat, prop.lng], PROPERTY_ZOOM, { animate: true });
    }
  }, [selectedPropertyId, properties]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (onLocationSelect) {
      const handler = (e: any) => onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.on("click", handler);
      return () => map.off("click", handler);
    }
  }, [onLocationSelect]);

  async function searchLocation(query: string) {
    setSearchQuery(query);
    if (query.length < 3) { setSearchResults([]); return; }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + " Maharashtra India")}&format=json&limit=6&countrycodes=in`,
        { headers: { "User-Agent": "Rently-Arynoxtech/1.0" } }
      );
      const data = await res.json();
      setSearchResults(data.map((r: any) => ({
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
        name: r.display_name.split(",").slice(0, 3).join(","),
      })));
    } catch { setSearchResults([]); }
  }

  function flyToLocation(lat: number, lng: number) {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([lat, lng], CITY_ZOOM, { animate: true, duration: 1.5 });
    }
    setSearchResults([]);
    setSearchQuery("");
  }

  async function fetchNearbyPlaces(lat: number, lng: number, categories: string[]) {
    const L = require("leaflet");
    const map = mapInstanceRef.current;
    if (!map) return;

    nearbyLayerRef.current.forEach((l) => l.remove());
    nearbyLayerRef.current = [];

    const allPlaces: NearbyPlace[] = [];

    for (const catKey of categories) {
      const cat = NEARBY_CATEGORIES.find((c) => c.key === catKey);
      if (!cat) continue;

      const radius = 1500;
      const query = `
        [out:json][timeout:10];
        (
          node${cat.query}(${lat - 0.015},${lng - 0.015},${lat + 0.015},${lng + 0.015});
          way${cat.query}(${lat - 0.015},${lng - 0.015},${lat + 0.015},${lng + 0.015});
        );
        out center 20;
      `;

      try {
        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: `data=${encodeURIComponent(query)}`,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const data = await res.json();

        (data.elements || []).forEach((el: any) => {
          const placeLat = el.lat || el.center?.lat;
          const placeLng = el.lon || el.center?.lon;
          if (!placeLat || !placeLng) return;

          const place: NearbyPlace = {
            lat: placeLat,
            lon: placeLng,
            name: el.tags?.name || el.tags?.["name:en"] || cat.label,
            type: catKey,
            icon: cat.icon,
          };
          allPlaces.push(place);

          const icon = L.divIcon({
            className: "nearby-marker",
            html: `<div style="font-size:18px;text-shadow:0 1px 3px rgba(0,0,0,0.3);">${cat.icon}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const marker = L.marker([placeLat, placeLng], { icon })
            .bindPopup(`<div style="font-family:system-ui;"><b>${cat.icon} ${place.name}</b><br/><span style="color:#666;font-size:12px;">${cat.label}</span></div>`)
            .addTo(map);
          nearbyLayerRef.current.push(marker);
        });
      } catch { /* ignore */ }
    }

    setNearbyPlaces(allPlaces);
  }

  useEffect(() => {
    if (showNearby && userLocation && activeCategories.length > 0) {
      fetchNearbyPlaces(userLocation[0], userLocation[1], activeCategories);
    } else {
      nearbyLayerRef.current.forEach((l) => l.remove());
      nearbyLayerRef.current = [];
      setNearbyPlaces([]);
    }
  }, [showNearby, activeCategories, userLocation]);

  function toggleCategory(key: string) {
    setActiveCategories((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  }

  return (
    <div style={{ position: "relative" }}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        .property-marker, .user-location-marker, .nearby-marker { background: transparent !important; border: none !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px !important; box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
        .leaflet-popup-content { margin: 12px !important; }
      `}</style>

      {/* Search bar */}
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 1000, width: "calc(100% - 24px)", maxWidth: 400 }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="🔍 Search location in Maharashtra…"
            value={searchQuery}
            onChange={(e) => searchLocation(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px 10px 36px", borderRadius: 10, border: "1px solid #e0e0e0",
              background: "white", fontSize: 13, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", outline: "none",
            }}
          />
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none" }}>📍</span>
          {searchResults.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, background: "white",
              borderRadius: 10, marginTop: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              zIndex: 1001, maxHeight: 200, overflow: "auto", border: "1px solid #e0e0e0",
            }}>
              {searchResults.map((r, i) => (
                <button key={i} onClick={() => flyToLocation(r.lat, r.lon)} style={{
                  display: "block", width: "100%", padding: "10px 14px", border: "none",
                  background: "none", cursor: "pointer", textAlign: "left", fontSize: 13,
                  borderBottom: "1px solid #f0f0f0", color: "#333",
                }}>
                  📍 {r.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map style selector */}
      <div style={{ position: "absolute", top: 12, right: 60, zIndex: 1000, display: "flex", gap: 4 }}>
        {Object.keys(TILE_PROVIDERS).map((key) => (
          <button key={key} onClick={() => setMapStyle(key as keyof typeof TILE_PROVIDERS)} style={{
            padding: "4px 8px", borderRadius: 6, border: "1px solid #e0e0e0",
            background: mapStyle === key ? "var(--rently-primary)" : "white",
            color: mapStyle === key ? "white" : "#333",
            fontSize: 10, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
          }}>
            {key.replace("carto", "")}
          </button>
        ))}
      </div>

      {/* Nearby toggle */}
      <div style={{ position: "absolute", top: 50, right: 12, zIndex: 1000 }}>
        <button
          onClick={() => {
            if (!showNearby && userLocation) {
              setShowNearby(true);
              if (activeCategories.length === 0) setActiveCategories(["education", "healthcare", "transport"]);
            } else {
              setShowNearby(false);
              setActiveCategories([]);
            }
          }}
          style={{
            padding: "6px 12px", borderRadius: 8, border: "1px solid #e0e0e0",
            background: showNearby ? "var(--rently-success)" : "white",
            color: showNearby ? "white" : "#333",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          🏘️ Nearby
        </button>
      </div>

      {/* Nearby categories */}
      {showNearby && (
        <div style={{
          position: "absolute", top: 86, right: 12, zIndex: 1000, background: "white",
          borderRadius: 10, padding: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", width: 180,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#666", marginBottom: 6 }}>SHOW NEARBY:</div>
          {NEARBY_CATEGORIES.map((cat) => (
            <button key={cat.key} onClick={() => toggleCategory(cat.key)} style={{
              display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "5px 8px",
              borderRadius: 6, border: "none", background: activeCategories.includes(cat.key) ? "#e8f5e9" : "transparent",
              cursor: "pointer", fontSize: 12, textAlign: "left",
            }}>
              <span>{cat.icon}</span>
              <span style={{ color: activeCategories.includes(cat.key) ? "var(--rently-success)" : "#666" }}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Map container */}
      <div ref={mapRef} style={{ height, borderRadius: 16, overflow: "hidden", border: "1px solid #e0e0e0" }} />

      {/* Nearby places list */}
      {showNearby && nearbyPlaces.length > 0 && (
        <div style={{
          position: "absolute", bottom: 12, left: 12, right: 12, zIndex: 1000,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
          borderRadius: 10, padding: 10, maxHeight: 120, overflow: "auto",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#666", marginBottom: 6 }}>
            🏘️ {nearbyPlaces.length} nearby places found
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {nearbyPlaces.slice(0, 10).map((p, i) => (
              <span key={i} style={{
                padding: "3px 8px", borderRadius: 6, fontSize: 11, background: "#f5f5f5",
                color: "#333", display: "flex", alignItems: "center", gap: 3,
              }}>
                {p.icon} {p.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
