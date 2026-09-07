# Rently — Maharashtra's Rental Property Platform

> A trusted, zero-brokerage, AI-powered rental platform covering 30+ cities across Maharashtra. Built by **Arynoxtech**.

**Live:** https://rently-green.vercel.app
**GitHub:** https://github.com/aryaanchavan1-commits/rently.git

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                       CLIENT (Browser)                           │
│  Next.js 16 (App Router) + React 19 + TypeScript                │
│  MapLibre GL JS · CARTO Vector Tiles · Overpass API              │
│  Tailwind CSS v4 · CSS Custom Properties                        │
└───────────────────────────┬──────────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼──────────────────────────────────────┐
│                    NEXT.JS SERVER                                 │
│  App Router (Server Components + API Routes)                     │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    API ROUTES                               │ │
│  │  /api/properties         CRUD + search + filtering          │ │
│  │  /api/properties/[id]    Single property get/update/delete  │ │
│  │  /api/commute            OSRM commute time calculation     │ │
│  │  /api/ai                 Groq AI chat (Ria assistant)       │ │
│  │  /api/auth/login         Supabase email login               │ │
│  │  /api/auth/signup        Supabase email signup              │ │
│  │  /api/messages           In-memory messaging                │ │
│  │  /api/inquiries          Property inquiry form              │ │
│  │  /api/subscription       Subscription management            │ │
│  │  /api/stats              Real-time listing stats            │ │
│  │  /api/contracts          E-contract CRUD                    │ │
│  │  /api/payment/razorpay   Razorpay payment verification      │ │
│  └─────────────────────────────────────────────────────────────┘ │
└────────┬─────────────────┬────────────────────┬─────────────────┘
         │                 │                    │
         ▼                 ▼                    ▼
┌─────────────┐   ┌──────────────┐   ┌──────────────────┐
│  Supabase   │   │   Groq API   │   │   Overpass API   │
│  Auth +     │   │  (llama-3.1- │   │  (OpenStreetMap  │
│  Database   │   │   8b-instant)│   │   POI queries)   │
└─────────────┘   └──────────────┘   └──────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│         External Services                 │
│  Leegality (eSign)  ·  Razorpay (Pay)   │
│  OSRM (Routing)     ·  Nominatim (Geo)   │
│  CARTO (Tiles)      ·  MapLibre GL JS    │
└──────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend

| Layer | Tech | Purpose |
|-------|------|---------|
| Framework | Next.js 16.3.4 (App Router, Turbopack) | SSR, routing, API routes |
| Language | TypeScript | Type safety |
| UI | React 19 | Component architecture |
| Styling | Tailwind CSS v4 + CSS custom properties | Design system |
| Fonts | Inter via `next/font/google` | Typography |
| Maps | **MapLibre GL JS** | Interactive GL-powered maps |
| Map Tiles | CARTO vector tiles (voyager, light, dark) | Base map rendering |
| POI Data | Overpass API (OpenStreetMap) | Nearby places, landmarks |
| Geocoding | Nominatim (OSM) — rate-limited, prototype only | Location search |
| Routing | OSRM public API | Commute time calculations |
| State | React hooks + in-memory stores | Client-side state |
| i18n | Custom context (Marathi / Hindi / English) | Trilingual UI |

### Backend (API Routes)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/properties` | GET | List all properties with filters |
| `/api/properties` | POST | Create new listing (owner) |
| `/api/properties/[id]` | GET/PUT/DELETE | Single property CRUD |
| `/api/properties/search` | POST | Advanced search with filters |
| `/api/commute` | POST | Commute time from point A → B via OSRM |
| `/api/ai` | POST | Groq AI chat (Ria assistant) |
| `/api/auth/login` | POST | Supabase email login |
| `/api/auth/signup` | POST | Supabase email signup |
| `/api/messages` | GET/POST | In-memory messaging between users |
| `/api/inquiries` | POST | Property inquiry form submission |
| `/api/subscription` | GET/POST | Subscription management (owner plans) |
| `/api/stats` | GET | Real-time listing/city/view counts |
| `/api/contracts` | GET/POST | E-contract CRUD |
| `/api/payment/razorpay` | POST | Razorpay payment verification |

### External Services

| Service | Purpose | Key Required | Dashboard |
|---------|---------|-------------|-----------|
| **Supabase** | Auth (email/password), database, real-time | Yes | [supabase.com](https://supabase.com) |
| **Groq** | AI assistant "Ria" — trilingual, property search | Yes | [console.groq.com](https://console.groq.com) |
| **Razorpay** | Subscription + e-contract payments | Yes | [dashboard.razorpay.com](https://dashboard.razorpay.com) |
| **Leegality** | Digital document signing (eSign) | Yes | [sandbox.leegality.com](https://sandbox.leegality.com) |
| **MapLibre GL JS** | Interactive map rendering | No (open-source) | — |
| **CARTO** | Vector map tiles (voyager/light/dark) | No (free tier) | — |
| **OpenStreetMap** | Geographic data, POIs, landmarks | No (free) | — |
| **Overpass API** | OSM POI queries (colleges, hospitals, etc.) | No (free) | — |
| **Nominatim** | Geocoding (location search) | No (rate-limited) | — |
| **OSRM** | Route/commute calculation | No (free) | — |

### Mapping Stack (Prototype)

```
MapLibre GL JS          — GL-powered map rendering
       +
CARTO Vector Tiles      — Free base map (voyager, light, dark)
       +
Overpass API            — Queries OpenStreetMap for POIs
       +
Nominatim               — Geocoding (user-triggered, rate-limited)
```

**Production recommendation:** Self-host Nominatim instance or use a commercial OSM-based geocoding provider. Use MapLibre + commercial vector tile provider (e.g., MapTiler, Stadia Maps) instead of CARTO free tier.

---

## Data Model — OpenStreetMap POI Categories

The platform queries Overpass API for these OSM categories:

| Category | OSM Tags | Color |
|----------|----------|-------|
| Education | `amenity=school`, `amenity=college`, `amenity=university` | `#3b82f6` |
| Healthcare | `amenity=hospital`, `amenity=clinic`, `amenity=pharmacy` | `#ef4444` |
| Shopping | `shop=supermarket`, `shop=mall`, `shop=market` | `#8b5cf6` |
| Food & Dining | `amenity=restaurant`, `amenity=cafe`, `amenity=fast_food` | `#f59e0b` |
| Transport | `railway=station`, `public_transport=station` | `#10b981` |
| Parks | `leisure=park`, `leisure=garden` | `#22c55e` |

**Maharashtra Coverage:**
```
Maharashtra
├── Mumbai (Andheri, Bandra, Powai, Thane, Navi Mumbai)
├── Pune (Baner, Wakad, Kothrud, Hinjawadi, PCMC)
├── Nashik
├── Nagpur
├── Kolhapur
├── Sangli
├── Satara
├── Ratnagiri
└── 20+ more cities
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, search tabs, live stats, features, cities |
| `/properties` | Browse listings — advanced filters, grid/map view |
| `/properties/[id]` | Property detail — true cost, nearby places, chat, trust |
| `/map` | Full-screen map with MapLibre GL JS, POI overlays |
| `/commute` | Commute time calculator to colleges/workplaces |
| `/dashboard` | Owner dashboard — stats, listings CRUD, subscriptions |
| `/inbox` | Messaging inbox |
| `/chat/[id]` | Chat conversation |
| `/owner` | Owner landing/marketing page |
| `/pricing` | Subscription plans (₹49/week, ₹149/month, ₹999/year) |
| `/contracts` | E-contract generation and signing |
| `/auth/login` | Login (role-based redirect) |
| `/auth/signup` | Sign up |

---

## Environment Variables

See `.env` in the project root for all required variables with documentation.

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `SUPABASE_JWKS_URL` | Yes | Supabase JWKS endpoint |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Client-side Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client-side Supabase anon key |
| `GROQ_API_KEY` | Yes | Groq API key for AI assistant |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Yes | Razorpay key ID (test or live) |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay secret key (server-side only) |
| `LEEGALITY_AUTH_TOKEN` | Yes | Leegality eSign auth token |
| `LEEGALITY_PRIVATE_SALT` | Yes | Leegality private salt |
| `LEEGALITY_BASE_URL` | Yes | Leegality API base URL |
| `NEXT_PUBLIC_MAP_TILE_URL` | No | Map tile URL (has default) |
| `NEXT_PUBLIC_NOMINATIM_URL` | No | Nominatim URL (has default) |
| `NEXT_PUBLIC_OVERPASS_URL` | No | Overpass API URL (has default) |

---

## Getting Started

### Prerequisites
- Node.js v18+ (recommended: v24)
- npm
- Git

### Setup

```bash
# Clone
git clone https://github.com/aryaanchavan1-commits/rently.git
cd rently

# Install
npm install

# Create .env (copy from .env and fill in keys)
cp .env .env.local

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build & Deploy

```bash
npm run build    # Production build
npm run start    # Start production server
```

Auto-deploys to Vercel on push to `main`.

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Tenant | `demo@rently.in` | `demo1234` |
| Owner | `owner@rently.in` | `demo1234` |

---

## Features

### Core
- **30 seed properties** across 13 Maharashtra cities
- **Trilingual UI** — Marathi, Hindi, English
- **AI Assistant (Ria)** — Natural language search in any language
- **True cost breakdown** — Rent + maintenance + parking + deposit
- **Role-based auth** — Owner/Tenant with Supabase

### Maps & Discovery
- **MapLibre GL JS** — GL-powered interactive maps
- **3 map styles** — Voyager, Light, Dark (CARTO tiles)
- **Nearby places** — Overpass API queries for colleges, hospitals, transport, food, shops, parks
- **Commute calculator** — OSRM-based routing to 35+ destinations
- **Geolocation** — "Use My Location" on map and listing wizard

### Trust & Verification
- **Listing freshness scoring** — Availability, rent confirmation, photo updates
- **Verified owner badges** — Identity verification indicators
- **Zero brokerage guarantee** — Direct owner contact
- **Social proof** — Viewer counts, urgency badges

### Owner Tools
- **Dashboard** — Real-time stats, listings management
- **Property CRUD** — 5-step listing wizard with Nominatim geocoding
- **Subscription system** — ₹49/week, ₹149/month, ₹999/year
- **E-contracts** — AI-generated with Leegality eSign

### Payments
- **Razorpay** — Subscription + e-contract fee collection

---

## Project Structure

```
rently/
├── .env                          # Environment variables (NOT in git)
├── package.json                  # Dependencies
├── next.config.ts                # Next.js config (security headers)
├── README.md                     # This file
│
└── src/
    ├── app/                      # Pages (App Router)
    │   ├── page.tsx              # Homepage
    │   ├── layout.tsx            # Root layout (Inter font, providers)
    │   ├── globals.css           # Design system + MapLibre CSS
    │   ├── properties/           # Property listing + detail
    │   ├── map/                  # Full map view
    │   ├── commute/              # Commute calculator
    │   ├── dashboard/            # Owner dashboard
    │   ├── inbox/                # Messaging
    │   ├── chat/[id]/            # Chat conversation
    │   ├── owner/                # Owner landing page
    │   ├── pricing/              # Pricing plans
    │   ├── contracts/            # E-contract page
    │   ├── auth/                 # Login / Signup
    │   └── api/                  # Backend API routes
    │
    ├── components/               # Reusable UI
    │   ├── Navbar.tsx            # Navigation
    │   ├── Footer.tsx            # Footer
    │   ├── PropertyCard.tsx      # Property card
    │   ├── PropertyMap.tsx       # MapLibre GL JS map
    │   ├── AIChat.tsx            # Ria AI assistant
    │   ├── ListingWizard.tsx     # 5-step listing wizard
    │   ├── PaymentModal.tsx      # Razorpay checkout
    │   └── ...
    │
    ├── lib/                      # Core logic
    │   ├── properties-store.ts   # Property data + CRUD
    │   ├── auth-context.tsx      # Auth provider
    │   ├── lang-context.tsx      # Language provider
    │   ├── translations.ts       # Trilingual translations
    │   ├── contracts-store.ts    # Contract data
    │   ├── subscription-store.ts # Subscription data
    │   ├── leegality.ts          # Leegality eSign API
    │   ├── api-auth.ts           # Auth middleware + rate limiting
    │   └── auth-fetch.ts         # Client-side auth fetch
    │
    └── types/
        └── contract.ts           # Contract TypeScript types
```

---

## Git Workflow

```bash
# Pull latest
git pull origin main

# Make changes
# ...

# Commit & push
git add -A
git commit -m "Description"
git push origin main
# → Auto-deploys to Vercel
```

---

## License

Private — Built by [Arynoxtech](https://arynoxtech.com)
