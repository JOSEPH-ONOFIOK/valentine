# replit.md

## Overview

This is a Valentine's Day proposal web application — a playful, animated single-page app where a user can ask someone to be their Valentine. The experience includes an envelope opening animation, a multi-step "journey" of romantic messages, and a final question with a "Yes" button and a "No" button that runs away when hovered. Accepting triggers confetti and records the response to a PostgreSQL database. The app is a full-stack TypeScript project with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
The project uses a three-folder monorepo pattern:
- **`client/`** — React frontend (Vite-based SPA)
- **`server/`** — Express backend API
- **`shared/`** — Code shared between client and server (database schema, API route contracts, types)

### Frontend
- **Framework:** React with TypeScript
- **Build tool:** Vite (config in `vite.config.ts`)
- **Routing:** Wouter (lightweight client-side router)
- **State/Data fetching:** TanStack React Query for server state management
- **Forms:** React Hook Form with Zod resolver for validation
- **UI Components:** shadcn/ui (new-york style) built on Radix UI primitives
- **Styling:** Tailwind CSS with CSS variables for theming. Custom romantic pink/red color palette defined in `client/src/index.css`
- **Animations:** Framer Motion for page transitions and interactive elements
- **Confetti:** canvas-confetti library for celebration effects
- **Fonts:** Pacifico (cursive headers) and Quicksand (body text), loaded via Google Fonts
- **Path aliases:** `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework:** Express.js running on Node.js
- **Language:** TypeScript, executed via `tsx` in development
- **API pattern:** RESTful JSON API under `/api/` prefix
- **Two endpoints:**
  - `POST /api/valentine/respond` — Records a valentine response (accepted/rejected with optional name and message)
  - `GET /api/valentine/status` — Retrieves all responses
- **Development server:** Vite dev server is integrated as middleware (see `server/vite.ts`) for HMR
- **Production:** Client is built to `dist/public/`, server is bundled with esbuild to `dist/index.cjs`

### Shared API Contract
- **`shared/routes.ts`** defines a typed API contract object (`api`) with paths, HTTP methods, input schemas, and response schemas
- **`shared/schema.ts`** defines the database schema and Zod validation schemas using drizzle-zod
- Both client and server import from `shared/` to ensure type safety across the stack

### Database
- **ORM:** Drizzle ORM with PostgreSQL dialect
- **Database:** PostgreSQL (requires `DATABASE_URL` environment variable)
- **Connection:** `pg` Pool in `server/db.ts`
- **Schema management:** `drizzle-kit push` command (no migration files needed for dev)
- **Single table:** `valentine_responses` with fields: `id` (serial), `responder_name` (text), `accepted` (boolean), `message` (text), `created_at` (timestamp)

### Build & Development
- `npm run dev` — Starts development server with Vite HMR
- `npm run build` — Builds client with Vite, bundles server with esbuild
- `npm run start` — Runs production build
- `npm run db:push` — Pushes schema changes to database

## External Dependencies

### Database
- **PostgreSQL** — Primary data store, connected via `DATABASE_URL` environment variable
- **`pg`** — Node.js PostgreSQL client library
- **`connect-pg-simple`** — Available for session storage (not actively used yet)

### Key NPM Packages
- **drizzle-orm / drizzle-kit / drizzle-zod** — ORM, schema management, and schema-to-Zod conversion
- **express** — HTTP server framework
- **zod** — Runtime schema validation (shared between client and server)
- **@tanstack/react-query** — Async state management on the client
- **framer-motion** — Animation library for React
- **canvas-confetti** — Confetti visual effects
- **react-hook-form / @hookform/resolvers** — Form handling with Zod validation
- **wouter** — Lightweight client-side routing
- **shadcn/ui components** — Full suite of Radix UI-based components (configured in `components.json`)

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal** — Error overlay in development
- **@replit/vite-plugin-cartographer** — Dev tooling (dev only)
- **@replit/vite-plugin-dev-banner** — Dev banner (dev only)

### External Services
- **Google Fonts** — Pacifico and Quicksand fonts loaded via CDN
- No other external APIs or third-party services are currently integrated