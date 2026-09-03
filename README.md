# Granary

**Connecting harvests to storage.**

Granary is a real-time digital agricultural storage network built for the Nashik & Niphad harvest belt. It connects grape, onion, and other perishable-crop growers with verified cold rooms, dry yards, and packhouse facilities — letting farmers find and book storage space, and letting warehouse operators manage capacity, requests, and lots from a single dashboard.

## Features

- **Interactive storage map** — browse cold storage, dry yard, and packhouse facilities by location, crop type, and availability (empty / full / mine).
- **Two dedicated desks**
  - **Farmer Desk** — search facilities, view details, submit storage requests, and track approved/pending/denied bookings.
  - **Warehouse (Operator) Desk** — review and approve/deny incoming farmer requests, track occupancy, and manage lots.
- **Booking & lot tracking** — each stored lot records crop, variety, tonnage, and storage duration against facility capacity.
- **Secure document handling** — warehouse/WDRA documents are encrypted at rest with AES‑256‑GCM.
- **Authentication** — email/password and session auth via [Better Auth](https://www.better-auth.com/), with rate limiting and hardened auth migrations.
- **Multi-language UI** — English, Hindi, Marathi, Bengali, Tamil, Telugu, and Kannada.
- **Cross-platform** — a responsive web app (TanStack Start) with an Android build via Capacitor.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, TanStack Router/Query/Table) |
| Styling / UI | Tailwind CSS v4, Radix UI primitives, shadcn-style components |
| State | Zustand |
| Database | PostgreSQL (via [Kysely](https://kysely.dev/), designed for [Neon](https://neon.tech/)) with local dev support via `@electric-sql/pglite` |
| Auth | Better Auth |
| Maps | Leaflet / React-Leaflet |
| Mobile | Capacitor (Android) |
| Build tool | Vite |
| Testing | Node's built-in test runner, Playwright |

## Project structure

```
src/
├── components/
│   ├── farmer/      # Farmer-facing UI (booking, requests, facility cards)
│   ├── operator/     # Operator-facing UI (request review, approvals)
│   ├── map/           # Storage facility map
│   ├── layout/       # Header, footer
│   ├── effects/      # Visual/motion effects
│   └── ui/             # Shared Radix-based UI primitives
├── lib/
│   ├── app-data/    # App data helpers
│   ├── auth/          # Auth wiring
│   ├── server/        # Server-side utilities
│   ├── store.ts       # Zustand app state
│   ├── seed.ts         # Demo/seed data
│   ├── types.ts        # Shared domain types
│   ├── i18n.ts          # Localization
│   └── db.ts            # Database client
└── routes/
    ├── index.tsx     # Landing page
    ├── farmer.tsx     # Farmer Desk
    ├── operator.tsx   # Warehouse Desk
    └── login.tsx        # Login

migrations/            # SQL migrations (auth, schema, hardening, rate limits)
android/                 # Capacitor Android project
```

## Getting started

### Prerequisites

- Node.js 22+
- A PostgreSQL database (e.g. a [Neon](https://neon.tech/) project) — or use the bundled `pglite` for local development

### Setup

```bash
git clone https://github.com/Specimen115/Granary.git
cd Granary
npm install
cp .env.example .env
```

Fill in `.env` with your database connection string and any auth/encryption secrets:

```bash
# Postgres connection (Neon pooled URL or local)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE

# Enable Better Auth in the client
VITE_AUTH_ENABLED=true

# Better Auth (production)
# BETTER_AUTH_SECRET=generate-a-long-random-string
# BETTER_AUTH_URL=https://your-app.example.com

# AES-256-GCM key for warehouse/WDRA documents (64 hex chars preferred)
# DOCUMENT_ENCRYPTION_KEY=
```

### Development

```bash
npm run dev
```

The app runs at `http://localhost:8080`.

### Database

```bash
npm run db:migrate   # apply migrations
npm run db:seed      # seed demo data
```

### Build & preview

```bash
npm run build       # production build (also runs db:migrate)
npm run preview     # preview the production build
```

### Other scripts

```bash
npm run typecheck   # TypeScript type checking
npm run lint         # ESLint
npm run format       # Prettier
npm run test          # Run test suite
```

### Android

The `android/` directory contains a [Capacitor](https://capacitorjs.com/) project for building a native Android app (`com.granary.app`). See `capacitor.config.ts` for configuration.

## License

No license has been specified for this repository. All rights reserved by the author unless stated otherwise.
