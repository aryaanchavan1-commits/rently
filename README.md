# Rently — Maharashtra's Rental Property Platform

> Zero-brokerage, AI-powered rental platform covering 30+ cities across Maharashtra. Built with Next.js, Supabase, Groq AI, and OpenStreetMap.

**Live:** https://rently-green.vercel.app
**GitHub:** https://github.com/aryaanchavan1-commits/rently.git

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│  Next.js App Router + React + Tailwind CSS v4       │
│  Leaflet (CDN) · OpenStreetMap · OSRM Routing       │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP
┌──────────────────────▼──────────────────────────────┐
│                  NEXT.JS SERVER                      │
│  App Router (Server Components + API Routes)         │
│  ┌──────────────────────────────────────────────┐   │
│  │              API ROUTES (Edge/Node)           │   │
│  │  /api/properties    — CRUD + search           │   │
│  │  /api/commute       — OSRM commute search     │   │
│  │  /api/ai            — Groq AI (Ria assistant)  │   │
│  │  /api/auth/*        — Supabase auth            │   │
│  │  /api/messages      — In-memory messaging      │   │
│  │  /api/inquiries     — Property inquiries       │   │
│  └──────────────────────────────────────────────┘   │
└────┬──────────────────┬─────────────────────────────┘
     │                  │
     ▼                  ▼
┌─────────┐    ┌────────────────┐
│ Supabase │    │   Groq API     │
│ Auth +   │    │ (llama-3.1-    │
│ Database │    │  8b-instant)   │
└─────────┘    └────────────────┘
```

### Frontend

| Layer | Tech |
|-------|------|
| Framework | Next.js 16.3.4 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS variables (inline styles) |
| Maps | Leaflet via CDN (`window.L`) + OpenStreetMap tiles |
| Routing | OSRM public API for commute calculations |
| State | React hooks + in-memory property store |
| i18n | Custom context (Marathi / Hindi / English) |

### Backend (API Routes)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/properties` | GET | List all properties |
| `/api/properties` | POST | Create new listing (owner) |
| `/api/properties/[id]` | GET/PUT/DELETE | Single property CRUD |
| `/api/properties/search` | POST | Advanced search with filters |
| `/api/commute` | POST | Commute time from point A → B |
| `/api/ai` | POST | Groq AI chat (Ria assistant) |
| `/api/auth/login` | POST | Supabase email login |
| `/api/auth/signup` | POST | Supabase email signup |
| `/api/messages` | GET/POST | In-memory messaging |
| `/api/inquiries` | POST | Property inquiry form |

### External Services

| Service | Purpose | Config |
|---------|---------|--------|
| **Supabase** | Auth (email/password), future DB | `SUPABASE_URL`, `SUPABASE_ANON_KEY` |
| **Groq** | AI assistant (Ria) — Marathi/Hindi/English | `GROQ_API_KEY` |
| **OpenStreetMap** | Free map tiles (no API key needed) | None |
| **OSRM** | Public routing engine for commute | None |
| **Razorpay** | Payments (placeholder) | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |

### Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, search tabs, trending areas, guides |
| `/properties` | Browse listings — advanced filters, map/grid |
| `/properties/[id]` | Property detail — true cost, trust signals, inquiry |
| `/map` | Full map view with geolocation |
| `/commute` | Commute time calculator |
| `/dashboard` | Owner dashboard — stats, listings CRUD |
| `/inbox` | Messaging inbox |
| `/chat/[id]` | Chat conversation |
| `/owner` | Owner landing/marketing page |
| `/pricing` | Subscription plans |
| `/auth/login` | Login |
| `/auth/signup` | Sign up |

---

## Environment Variables (.env)

Create a `.env` file in the project root:

```bash
# ── Supabase (Auth) ──────────────────────────────────
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWKS_URL=https://your-project.supabase.co/auth/v1/.well-known/jwks.json

# ── Public Supabase (used by client-side code) ───────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# ── Groq AI (Ria assistant) ──────────────────────────
GROQ_API_KEY=gsk_your_groq_api_key

# ── Razorpay (payments — placeholder for now) ────────
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### How to get each key:

| Service | Steps |
|---------|-------|
| **Supabase** | Go to [supabase.com](https://supabase.com) → Create project → Settings → API → Copy URL, anon key, service role key |
| **Groq** | Go to [console.groq.com](https://console.groq.com) → Create API key |
| **Razorpay** | Go to [razorpay.com](https://razorpay.com) → Dashboard → API Keys (test mode for dev) |

> **Note:** `.env` is in `.gitignore` and will NOT be pushed to GitHub. Each team member must create their own `.env` file locally.

---

## Getting Started (Team Setup)

### Prerequisites
- Node.js v18+ (recommended: v24)
- npm or yarn
- Git

### 1. Clone the repository

```bash
git clone https://github.com/aryaanchavan1-commits/rently.git
cd rently
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Copy the `.env` template above and fill in your keys. Ask the project lead for the actual values.

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for production

```bash
npm run build
```

---

## Git Workflow — How Team Changes Sync

**Yes, changes made by team members on their laptops WILL sync to your software** — but you need to follow the standard Git workflow:

### Team member makes a change:

```bash
# 1. Pull latest changes from GitHub first
git pull origin main

# 2. Make your changes (edit files)

# 3. Stage and commit
git add -A
git commit -m "Description of what you changed"

# 4. Push to GitHub
git push origin main
```

### You receive their changes:

```bash
# Pull their changes into your local copy
git pull origin main

# Your local files update automatically
# Run dev server again if needed
npm run dev
```

### Key rules:

1. **Always `git pull` before starting work** — prevents merge conflicts
2. **Never commit directly to `main`** without pulling first
3. **`.env` is NOT synced** — each person must create their own locally
4. **`node_modules/` is NOT synced** — run `npm install` after pulling
5. **If there's a merge conflict**, Git will ask you to resolve it before committing

### Deployment (automatic):

When code is pushed to `main`, Vercel auto-deploys to:
https://rently-green.vercel.app

No manual deployment needed — just push and it goes live.

---

## Project Structure

```
rently/
├── .env                          # Environment variables (NOT in git)
├── .gitignore                    # Files excluded from git
├── package.json                  # Dependencies and scripts
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS config
├── README.md                     # This file
│
└── src/
    ├── app/                      # Pages (App Router)
    │   ├── page.tsx              # Homepage
    │   ├── layout.tsx            # Root layout (providers)
    │   ├── globals.css           # Design system + Tailwind
    │   ├── properties/           # Property listing + detail
    │   ├── map/                  # Full map view
    │   ├── commute/              # Commute calculator
    │   ├── dashboard/            # Owner dashboard
    │   ├── inbox/                # Messaging
    │   ├── chat/[id]/            # Chat conversation
    │   ├── owner/                # Owner landing page
    │   ├── pricing/              # Pricing plans
    │   ├── auth/                 # Login / Signup
    │   └── api/                  # Backend API routes
    │       ├── properties/       # Property CRUD + search
    │       ├── commute/          # Commute routing
    │       ├── ai/               # Groq AI chat
    │       ├── auth/             # Supabase auth
    │       ├── messages/         # Messaging
    │       └── inquiries/        # Property inquiries
    │
    ├── components/               # Reusable UI components
    │   ├── Navbar.tsx            # Navigation bar
    │   ├── Footer.tsx            # Footer
    │   ├── PropertyCard.tsx      # Property listing card
    │   ├── PropertyMap.tsx       # Leaflet map (CDN-based)
    │   ├── AIChat.tsx            # Ria AI assistant
    │   ├── AIOnboarding.tsx      # AI onboarding wizard
    │   ├── ListingWizard.tsx     # 5-step property listing
    │   ├── SearchBar.tsx         # Location search autocomplete
    │   ├── LanguageSelector.tsx  # EN/MR/HI language toggle
    │   ├── AuthProviderWrap.tsx   # Supabase auth provider
    │   └── LangProviderWrap.tsx   # Language provider
    │
    ├── lib/                      # Core logic & state
    │   ├── properties-store.ts   # Property data, CRUD, search
    │   ├── auth-context.tsx      # Authentication context
    │   ├── lang-context.tsx      # Language context (default: MR)
    │   ├── translations.ts       # Trilingual translations
    │   ├── supabase.ts           # Supabase client
    │   ├── validations.ts        # Zod validation schemas
    │   └── store.ts              # General store utilities
    │
    └── types/
        └── leaflet.d.ts          # TypeScript type for Leaflet
```

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Tenant | `demo@rently.in` | `demo1234` |
| Owner | `owner@rently.in` | `demo1234` |

---

## Features

- **Trilingual** — Marathi (default), Hindi, English
- **AI Assistant (Ria)** — Natural language search in any language
- **30 seed properties** — Across 13 Maharashtra cities
- **True cost breakdown** — Rent + deposit + maintenance + parking
- **Freshness scoring** — Property listing quality indicator
- **Commute calculator** — OSRM-based routing to 35+ destinations
- **Geolocation** — "Use My Location" on map and listing wizard
- **Social proof** — Viewer counts, urgency badges, verified owners
- **Anchoring** — % below/above average area price
- **Trust signals** — Zero brokerage guarantee, response time, verification
- **Owner dashboard** — Stats, listings CRUD, status toggle
- **Messaging** — In-memory chat between tenants and owners

---

## Tech Stack Summary

```
Next.js 16.3.4 · TypeScript · Tailwind CSS v4
Supabase · Groq (llama-3.1-8b-instant)
Leaflet (CDN) · OpenStreetMap · OSRM
Vercel (deployment) · GitHub (source control)
```
