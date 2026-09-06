"use client";

import { useState, useRef, useCallback, useEffect } from "react";

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

interface PlaceResult {
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
  draggable?: boolean;
}

export default function PropertyMap({
  properties = [],
  center = [18.5204, 73.8567],
  zoom = 12,
  height = "500px",
  onPropertyClick,
  showUserLocation = false,
  onLocationSelect,
  draggable = false,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [isSearching, setIsSearching] = useState(false);
  const [showPlaces, setShowPlaces] = useState(true);
  const [nearbyPlaces, setNearbyPlaces] = useState<PlaceResult[]>([]);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  // Nominatim search
  const searchPlaces = useCallback(async (query: string) => {
    if (!query || query.length < 3) { setSearchResults([]); return; }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&countrycodes=in`,
        { headers: { "User-Agent": "Rently/1.0" } }
      );
      const data = await res.json();
      setSearchResults(data.map((r: { lat: string; lon: string; display_name: string; type: string }) => ({
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
        name: r.display_name.split(",").slice(0, 2).join(","),
        type: r.type,
        icon: getPlaceIcon(r.type),
      })));
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Overpass API - find nearby places
  const fetchNearbyPlaces = useCallback(async (lat: number, lng: number) => {
    try {
      const radius = 3000;
      const query = `
        [out:json][timeout:10];
        (
          node["amenity"="college"](around:${radius},${lat},${lng});
          node["amenity"="university"](around:${radius},${lat},${lng});
          node["amenity"="school"](around:${radius},${lat},${lng});
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          node["amenity"="clinic"](around:${radius},${lat},${lng});
          node["amenity"="bank"](around:${radius},${lat},${lng});
          node["amenity"="atm"](around:${radius},${lat},${lng});
          node["amenity"="pharmacy"](around:${radius},${lat},${lng});
          node["shop"="supermarket"](around:${radius},${lat},${lng});
          node["shop"="mall"](around:${radius},${lat},${lng});
          node["tourism"="hotel"](around:${radius},${lat},${lng});
          node["railway"="station"](around:${radius},${lat},${lng});
          node["railway"="halt"](around:${radius},${lat},${lng});
          node["highway"="bus_stop"](around:${radius},${lat},${lng});
          node["amenity"="restaurant"](around:${radius},${lat},${lng});
          node["amenity"="cafe"](around:${radius},${lat},${lng});
          node["leisure"="park"](around:${radius},${lat},${lng});
        );
        out body 30;
      `;
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const data = await res.json();
      const places: PlaceResult[] = (data.elements || []).map((el: { lat: number; lon: number; tags: { name?: string; [key: string]: unknown } }) => ({
        lat: el.lat,
        lon: el.lon,
        name: el.tags?.name || el.tags?.["name:en"] || "Unnamed",
        type: String(el.tags?.amenity || el.tags?.shop || el.tags?.tourism || el.tags?.railway || el.tags?.highway || el.tags?.leisure || "place"),
        icon: getPlaceIcon(String(el.tags?.amenity || el.tags?.shop || el.tags?.tourism || el.tags?.railway || el.tags?.highway || el.tags?.leisure || "place")),
      }));
      setNearbyPlaces(places);
    } catch {
      setNearbyPlaces([]);
    }
  }, []);

  // Get user location
  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLoc(loc);
          setMapCenter(loc);
          fetchNearbyPlaces(loc[0], loc[1]);
        },
        () => { /* fallback to default center */ }
      );
    }
  }, [showUserLocation, fetchNearbyPlaces]);

  // Fetch places when center changes
  useEffect(() => {
    if (showPlaces) {
      fetchNearbyPlaces(mapCenter[0], mapCenter[1]);
    }
  }, [mapCenter, showPlaces, fetchNearbyPlaces]);

  function selectSearchResult(r: PlaceResult) {
    setMapCenter([r.lat, r.lon]);
    setMapZoom(15);
    setSelectedPlace(r);
    setSearchResults([]);
    setSearchQuery(r.name);
    if (onLocationSelect) onLocationSelect(r.lat, r.lon);
  }

  function handleSearchInput(val: string) {
    setSearchQuery(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchPlaces(val), 400);
  }

  function getPlaceIcon(type: string): string {
    const icons: Record<string, string> = {
      college: "🎓", university: "🎓", school: "🏫",
      hospital: "🏥", clinic: "🏥",
      bank: "🏦", atm: "🏧", pharmacy: "💊",
      supermarket: "🛒", mall: "🏬",
      hotel: "🏨", restaurant: "🍽️", cafe: "☕",
      railway: "🚂", station: "🚂", halt: "🚂", bus_stop: "🚌",
      park: "🌳", leisure: "🌳",
      place: "📍",
    };
    return icons[type] || "📍";
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter[1] - 0.02}%2C${mapCenter[0] - 0.015}%2C${mapCenter[1] + 0.02}%2C${mapCenter[0] + 0.015}&layer=mapnik&marker=${mapCenter[0]}%2C${mapCenter[1]}`;

  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid var(--rently-border-light)", background: "white" }}>
      {/* Search bar */}
      <div style={{ position: "absolute", top: 12, left: 12, right: 12, zIndex: 20 }}>
        <div style={{ position: "relative" }}>
          <input
            className="input"
            placeholder="Search colleges, hospitals, places..."
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.12)", border: "2px solid white", paddingRight: 40 }}
          />
          {isSearching && (
            <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>⏳</div>
          )}
          {searchResults.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", borderRadius: 12, marginTop: 4, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", zIndex: 30, maxHeight: 280, overflow: "auto" }}>
              {searchResults.map((r, i) => (
                <button key={i} onClick={() => selectSearchResult(r)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 14px", border: "none", background: "none", cursor: "pointer", textAlign: "left", borderBottom: "1px solid var(--rently-border-light)", fontSize: 13 }}>
                  <span style={{ fontSize: 18 }}>{r.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--rently-text)" }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "var(--rently-muted)", textTransform: "capitalize" }}>{r.type}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toggle places */}
      <div style={{ position: "absolute", top: 68, left: 12, zIndex: 20 }}>
        <button
          onClick={() => setShowPlaces(!showPlaces)}
          style={{ padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: showPlaces ? "var(--rently-primary)" : "white", color: showPlaces ? "white" : "var(--rently-text)", border: "1px solid var(--rently-border)", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          {showPlaces ? "Hide" : "Show"} Places
        </button>
      </div>

      {/* Map iframe */}
      <iframe
        title="Property Map"
        width="100%"
        height={height}
        style={{ border: 0 }}
        loading="lazy"
        src={mapUrl}
      />

      {/* Property markers overlay */}
      {properties.length > 0 && (
        <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, zIndex: 20, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {properties.slice(0, 5).map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setMapCenter([p.lat, p.lng]);
                setMapZoom(16);
                if (onPropertyClick) onPropertyClick(p.id);
              }}
              style={{ padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: "white", color: "var(--rently-text)", border: "1px solid var(--rently-border)", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", whiteSpace: "nowrap" }}
            >
              {p.title.slice(0, 25)}... ₹{(p.price / 1000).toFixed(0)}K
            </button>
          ))}
        </div>
      )}

      {/* Nearby places panel */}
      {showPlaces && nearbyPlaces.length > 0 && (
        <div style={{ position: "absolute", bottom: 60, right: 12, zIndex: 20, background: "white", borderRadius: 12, padding: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", maxHeight: 200, width: 220, overflow: "auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--rently-muted)", marginBottom: 6, textTransform: "uppercase" }}>Nearby Places</div>
          {nearbyPlaces.slice(0, 12).map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 12, color: "var(--rently-text)", borderBottom: "1px solid var(--rently-border-light)" }}>
              <span>{p.icon}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
