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
  lng: number;
  name: string;
  category: string;
  icon: string;
  distance?: number;
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

const MAP_STYLES = {
  voyager: { name: "Voyager", url: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json" },
  light: { name: "Light", url: "https://basemaps.cartocdn.com/gl/light-gl-style/style.json" },
  dark: { name: "Dark", url: "https://basemaps.cartocdn.com/gl/dark-gl-style/style.json" },
  osm: { name: "OSM", url: "https://tiles.openstreetmap.org/gl/style.json" },
};

const NEARBY_CATEGORIES = [
  { key: "education", label: "Education", icon: "E", color: "#3b82f6", osmQuery: "['amenity'~'school|college|university']" },
  { key: "healthcare", label: "Healthcare", icon: "H", color: "#ef4444", osmQuery: "['amenity'~'hospital|clinic|pharmacy']" },
  { key: "shopping", label: "Shopping", icon: "S", color: "#8b5cf6", osmQuery: "['shop'~'supermarket|mall|market']" },
  { key: "food", label: "Food", icon: "F", color: "#f59e0b", osmQuery: "['amenity'~'restaurant|cafe|fast_food']" },
  { key: "transport", label: "Transport", icon: "T", color: "#10b981", osmQuery: "['public_transport'~'station|stop_position|railway']|['railway'='station']" },
  { key: "parks", label: "Parks", icon: "P", color: "#22c55e", osmQuery: "['leisure'~'park|garden']" },
];

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const nearbyMarkersRef = useRef<any[]>([]);
  const popupsRef = useRef<any[]>([]);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [mapStyle, setMapStyle] = useState<keyof typeof MAP_STYLES>("voyager");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ lat: number; lng: number; name: string }>>([]);
  const [showNearby, setShowNearby] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

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
    if (!mapContainerRef.current || mapRef.current) return;

    let cancelled = false;

    import("maplibre-gl").then((maplibregl) => {
      if (cancelled || !mapContainerRef.current) return;

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAP_STYLES[mapStyle].url,
        center: [getMapCenter()[1], getMapCenter()[0]],
        zoom: getMapZoom(),
        attributionControl: true,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true, visualizePitch: false }), "top-right");

      map.on("load", () => {
        if (!cancelled) setMapLoaded(true);
      });

      map.on("click", (e: any) => {
        if (onLocationSelect && e.lngLat) {
          onLocationSelect(e.lngLat.lat, e.lngLat.lng);
        }
      });

      mapRef.current = map;

      if (showUserLocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (cancelled) return;
            const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
            setUserLocation(loc);
            map.flyTo({ center: [loc[1], loc[0]], zoom: CITY_ZOOM, duration: 1500 });

            const el = document.createElement("div");
            el.style.cssText = "width:20px;height:20px;background:linear-gradient(135deg,#1a56db,#3b82f6);border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);position:relative;";
            const pulse = document.createElement("div");
            pulse.style.cssText = "position:absolute;top:-6px;left:-6px;width:32px;height:32px;background:rgba(26,86,219,0.25);border-radius:50%;animation:pulse 2s infinite;";
            el.appendChild(pulse);

            const marker = new maplibregl.Marker({ element: el })
              .setLngLat([loc[1], loc[0]])
              .setPopup(new maplibregl.Popup().setHTML(`<div style="font-family:Inter,system-ui;padding:4px 0;"><b>Your Location</b></div>`))
              .addTo(map);
            userMarkerRef.current = marker;
          },
          () => {},
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    import("maplibre-gl").then((maplibregl) => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      popupsRef.current.forEach((p) => p.remove());
      popupsRef.current = [];

      properties.forEach((p) => {
        if (!p.lat || !p.lng) return;

        const isSelected = p.id === selectedPropertyId;
        const el = document.createElement("div");
        el.style.cssText = `
          background:${isSelected ? "var(--primary, #1a56db)" : "white"};
          color:${isSelected ? "white" : "var(--primary, #1a56db)"};
          padding:5px 10px;border-radius:10px;font-size:12px;font-weight:700;
          box-shadow:0 2px 10px rgba(0,0,0,0.18);white-space:nowrap;cursor:pointer;
          border:2px solid ${isSelected ? "var(--primary, #1a56db)" : "var(--accent, #f59e0b)"};
          display:flex;align-items:center;gap:4px;transition:all 0.15s;
          font-family:Inter,system-ui;
        `;
        el.textContent = `₹${(p.price / 1000).toFixed(1)}K`;

        const marker = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat([p.lng, p.lat])
          .addTo(map);

        const popup = new maplibregl.Popup({ offset: 25, closeButton: true, maxWidth: "280px" })
          .setHTML(`
            <div style="font-family:Inter,system-ui;padding:2px 0;min-width:200px;">
              ${p.images[0] ? `<img src="${p.images[0]}" style="width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />` : ""}
              <div style="font-weight:700;font-size:14px;margin-bottom:3px;color:#0f172a;">${p.title}</div>
              <div style="color:#64748b;font-size:12px;margin-bottom:6px;">${p.area}, ${p.city}</div>
              <div style="font-size:18px;font-weight:800;color:#1a56db;margin-bottom:6px;">₹${p.price.toLocaleString("en-IN")}<span style="font-size:11px;font-weight:500;color:#94a3b8;">/mo</span></div>
              <a href="/properties/${p.id}" style="display:block;text-align:center;padding:8px 12px;background:#1a56db;color:white;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;">View Details</a>
            </div>
          `);

        marker.setPopup(popup);
        marker.on("click", () => onPropertyClick?.(p.id));
        markersRef.current.push(marker);
        popupsRef.current.push(popup);
      });

      if (markersRef.current.length > 0 && !center && !userLocation) {
        const bounds = new maplibregl.LngLatBounds();
        markersRef.current.forEach((m) => bounds.extend(m.getLngLat()));
        map.fitBounds(bounds, { padding: 50, maxZoom: CITY_ZOOM });
      }
    });
  }, [properties, selectedPropertyId, onPropertyClick, mapLoaded]);

  useEffect(() => {
    if (!selectedPropertyId || !mapRef.current) return;
    const prop = properties.find((p) => p.id === selectedPropertyId);
    if (prop && prop.lat && prop.lng) {
      mapRef.current.flyTo({ center: [prop.lng, prop.lat], zoom: PROPERTY_ZOOM, duration: 1000 });
    }
  }, [selectedPropertyId, properties]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    import("maplibre-gl").then(() => {
      nearbyMarkersRef.current.forEach((m) => m.remove());
      nearbyMarkersRef.current = [];

      if (!showNearby || !userLocation || activeCategories.length === 0) {
        setNearbyPlaces([]);
        return;
      }

      fetchNearbyPlaces(userLocation[0], userLocation[1], activeCategories);
    });
  }, [showNearby, activeCategories, userLocation, mapLoaded]);

  async function fetchNearbyPlaces(lat: number, lng: number, categories: string[]) {
    const allPlaces: NearbyPlace[] = [];

    for (const catKey of categories) {
      const cat = NEARBY_CATEGORIES.find((c) => c.key === catKey);
      if (!cat) continue;

      const query = `
        [out:json][timeout:8];
        (
          node${cat.osmQuery}(${lat - 0.012},${lng - 0.012},${lat + 0.012},${lng + 0.012});
          way${cat.osmQuery}(${lat - 0.012},${lng - 0.012},${lat + 0.012},${lng + 0.012});
        );
        out center 15;
      `;

      try {
        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: `data=${encodeURIComponent(query)}`,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const data = await res.json();

        for (const el of data.elements || []) {
          const placeLat = el.lat || el.center?.lat;
          const placeLng = el.lon || el.center?.lon;
          if (!placeLat || !placeLng) continue;

          const dist = haversineDistance(lat, lng, placeLat, placeLng);
          if (dist > 5) continue;

          allPlaces.push({
            lat: placeLat,
            lng: placeLng,
            name: el.tags?.name || el.tags?.["name:en"] || `${cat.label} nearby`,
            category: catKey,
            icon: cat.icon,
            distance: dist,
          });
        }
      } catch { /* ignore */ }
    }

    allPlaces.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    setNearbyPlaces(allPlaces);

    import("maplibre-gl").then((maplibregl) => {
      allPlaces.forEach((place) => {
        const cat = NEARBY_CATEGORIES.find((c) => c.key === place.category);
        const el = document.createElement("div");
        el.style.cssText = `
          width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          font-size:11px;font-weight:800;color:white;cursor:pointer;
          background:${cat?.color || "#6b7280"};box-shadow:0 2px 6px rgba(0,0,0,0.2);
          border:2px solid white;transition:transform 0.15s;
          font-family:Inter,system-ui;
        `;
        el.textContent = place.icon;
        el.onmouseenter = () => { el.style.transform = "scale(1.2)"; };
        el.onmouseleave = () => { el.style.transform = "scale(1)"; };

        const marker = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat([place.lng, place.lat])
          .setPopup(new maplibregl.Popup({ offset: 15 }).setHTML(`
            <div style="font-family:Inter,system-ui;padding:2px 0;">
              <div style="font-weight:700;font-size:13px;color:#0f172a;">${place.name}</div>
              <div style="font-size:12px;color:#64748b;margin-top:2px;">${cat?.label || place.category}</div>
              ${place.distance !== undefined ? `<div style="font-size:11px;color:#94a3b8;margin-top:4px;">${(place.distance * 1000).toFixed(0)}m away</div>` : ""}
            </div>
          `))
          .addTo(mapRef.current);

        nearbyMarkersRef.current.push(marker);
      });
    });
  }

  async function searchLocation(query: string) {
    setSearchQuery(query);
    if (query.length < 3) { setSearchResults([]); return; }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + " Maharashtra India")}&format=json&limit=5&countrycodes=in`,
        { headers: { "User-Agent": "Rently-Arynoxtech/1.0 (rently.arynoxtech.com)" } }
      );
      const data = await res.json();
      setSearchResults(data.map((r: any) => ({
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon),
        name: r.display_name.split(",").slice(0, 3).join(","),
      })));
    } catch { setSearchResults([]); }
  }

  function flyToLocation(lat: number, lng: number) {
    mapRef.current?.flyTo({ center: [lng, lat], zoom: CITY_ZOOM, duration: 1500 });
    setSearchResults([]);
    setSearchQuery("");
  }

  function toggleCategory(key: string) {
    setActiveCategories((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  }

  return (
    <div style={{ position: "relative" }}>
      <style>{`
        @keyframes pulse { 0%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.8);opacity:0} 100%{transform:scale(1);opacity:0} }
        .maplibregl-popup-content-wrapper { border-radius: 12px !important; box-shadow: 0 8px 28px rgba(0,0,0,0.15) !important; padding: 0 !important; }
        .maplibregl-popup-content { margin: 12px !important; font-family: inherit !important; }
        .maplibregl-popup-tip { box-shadow: none !important; }
      `}</style>

      {/* Search bar */}
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 1000, width: "calc(100% - 24px)", maxWidth: 400 }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search location in Maharashtra..."
            value={searchQuery}
            onChange={(e) => searchLocation(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px 10px 36px", borderRadius: 10, border: "1px solid var(--border, #e2e8f0)",
              background: "white", fontSize: 13, boxShadow: "0 2px 10px rgba(0,0,0,0.08)", outline: "none",
              fontFamily: "Inter, system-ui",
            }}
          />
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          {searchResults.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, background: "white",
              borderRadius: 10, marginTop: 4, boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
              zIndex: 1001, maxHeight: 200, overflow: "auto", border: "1px solid var(--border, #e2e8f0)",
            }}>
              {searchResults.map((r, i) => (
                <button key={i} onClick={() => flyToLocation(r.lat, r.lng)} style={{
                  display: "block", width: "100%", padding: "10px 14px", border: "none", borderBottom: i < searchResults.length - 1 ? "1px solid var(--border-light, #f1f5f9)" : "none",
                  background: "none", cursor: "pointer", textAlign: "left", fontSize: 13, color: "var(--text, #0f172a)",
                  fontFamily: "Inter, system-ui",
                }}>
                  {r.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map style selector */}
      <div style={{ position: "absolute", top: 12, right: 60, zIndex: 1000, display: "flex", gap: 4 }}>
        {Object.entries(MAP_STYLES).map(([key, style]) => (
          <button key={key} onClick={() => {
            setMapStyle(key as keyof typeof MAP_STYLES);
            mapRef.current?.setStyle(style.url);
          }} style={{
            padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border, #e2e8f0)",
            background: mapStyle === key ? "var(--primary, #1a56db)" : "white",
            color: mapStyle === key ? "white" : "var(--text-secondary, #475569)",
            fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, system-ui",
          }}>
            {style.name}
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
              nearbyMarkersRef.current.forEach((m) => m.remove());
              nearbyMarkersRef.current = [];
              setNearbyPlaces([]);
            }
          }}
          style={{
            padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border, #e2e8f0)",
            background: showNearby ? "var(--success, #059669)" : "white",
            color: showNearby ? "white" : "var(--text-secondary, #475569)",
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, system-ui",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          Nearby
        </button>
      </div>

      {/* Nearby categories */}
      {showNearby && (
        <div style={{
          position: "absolute", top: 86, right: 12, zIndex: 1000, background: "white",
          borderRadius: 10, padding: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", width: 170,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted, #94a3b8)", marginBottom: 6, fontFamily: "Inter, system-ui" }}>SHOW NEARBY</div>
          {NEARBY_CATEGORIES.map((cat) => (
            <button key={cat.key} onClick={() => toggleCategory(cat.key)} style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "5px 8px",
              borderRadius: 6, border: "none", background: activeCategories.includes(cat.key) ? `${cat.color}15` : "transparent",
              cursor: "pointer", fontSize: 12, textAlign: "left", fontFamily: "Inter, system-ui",
            }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: cat.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, flexShrink: 0 }}>{cat.icon}</span>
              <span style={{ color: activeCategories.includes(cat.key) ? cat.color : "var(--text-secondary, #475569)", fontWeight: 500 }}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Map */}
      <div ref={mapContainerRef} style={{ height, borderRadius: 16, overflow: "hidden", border: "1px solid var(--border, #e2e8f0)" }} />

      {/* Nearby places list */}
      {showNearby && nearbyPlaces.length > 0 && (
        <div style={{
          position: "absolute", bottom: 12, left: 12, right: 12, zIndex: 1000,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
          borderRadius: 12, padding: 12, maxHeight: 130, overflow: "auto",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)", border: "1px solid var(--border, #e2e8f0)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted, #94a3b8)", marginBottom: 8, fontFamily: "Inter, system-ui" }}>
            {nearbyPlaces.length} nearby places found
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {nearbyPlaces.slice(0, 12).map((p, i) => {
              const cat = NEARBY_CATEGORIES.find((c) => c.key === p.category);
              return (
                <span key={i} onClick={() => mapRef.current?.flyTo({ center: [p.lng, p.lat], zoom: 16, duration: 800 })} style={{
                  padding: "4px 10px", borderRadius: 8, fontSize: 11, background: `${cat?.color || "#6b7280"}12`,
                  color: cat?.color || "#6b7280", display: "flex", alignItems: "center", gap: 4, cursor: "pointer",
                  fontWeight: 500, border: `1px solid ${cat?.color || "#6b7280"}25`, fontFamily: "Inter, system-ui",
                }}>
                  {p.name}
                  {p.distance !== undefined && <span style={{ opacity: 0.6 }}>{(p.distance * 1000).toFixed(0)}m</span>}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
