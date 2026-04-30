# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **RULE: Always update this file when features are added, changed, or removed.** Keep architecture, routing, i18n, and file structure sections accurate so future sessions start with correct context. If you modify routing pages, add translation keys, create/delete components, or change conventions — reflect it here before finishing the task.

## Design System

**Before touching any UI/frontend code, read `.impeccable.md` at the project root.** It is the source of truth for tokens, component inventory, patterns, and do/don'ts — and it is picked up automatically by the `impeccable` skill (invoke with `/impeccable craft <feature>` to shape-then-build a new feature in-style, or `/impeccable extract` to refresh the inventory when new patterns solidify). Keep `.impeccable.md` updated when the aesthetic direction or tokens change.

## Project Overview

**ThaiFruit** — a multilingual online Thai fruit marketplace. Buyers browse/search fruit products from farmer stores, view product details, add to cart, and place orders. Sellers manage their store and products. Supports Thai, English, and Chinese.

**Monorepo with two deployable apps:**
- **Frontend** (`/`) — React SPA. Talks **only** to the Express API (no Supabase SDK in the browser).
- **Backend** (`/thaifruit-api/`) — Node.js + Express REST API. Single egress to Supabase (PostgreSQL + Auth + Storage).

## Commands

### Frontend
- `npm run dev` — Start Vite dev server (default port 5173; pass `-- --port <n>` to override)
- `npm run build` — Production build (output in `dist/`)
- `npm run lint` — ESLint (flat config, JS/JSX only)
- `npm run preview` — Preview production build
- Requires `.env` at repo root — copy from `.env.example`. Only `VITE_API_URL` is required.

### Backend (`cd thaifruit-api`)
- `npm run dev` — Start API with `--watch` (port 3001)
- `npm start` — Start API for production
- `npm test` — Run Vitest contract tests (one-shot)
- `npm run test:watch` — Vitest in watch mode
- Requires `.env` file — copy from `.env.example`
- API docs (Swagger UI) served at `http://localhost:3001/api/v1/docs` while the API is running. Raw spec at `/api/v1/openapi.json`.

## Architecture

### Frontend

**Stack:** React 19 + Vite 7, plain CSS (single `src/index.css`), lucide-react for icons. `react-router-dom` is installed but not used — routing is state-based.

**State management:** Single React Context (`AppContext`) wraps the entire app. Access via `useApp()` hook. Manages: user auth, cart, products, stores, orders, toast notifications.

**i18n:** `LangContext` provides `t(key, params)` for UI strings and `locField(obj, field)` for data field localization. Three languages: `th`, `en`, `cn`. Language stored in `localStorage` key `thaifruit-lang`. Translation keys live in `src/context/LangContext.jsx`. Data objects use suffix fields (`nameEn`, `descriptionEn`, `labelEn`; CN fields fall back to EN then TH).

**Routing:** Navigation via `page` state in `App.jsx`. Current page values:
- `home` — Home page with hero, store list, product grid, category filter
- `cart` — Shopping cart and checkout
- `seller` — Seller dashboard (products, orders, store settings)
- `store_detail` — Single store page with its products
- `product_detail` — Full product detail page with unit selection, related products

Back navigation uses `previousPage` ref. Product detail remounts via `key={product.id}`.

**Data:** All data comes from the Express API. `src/lib/api.js` is a small fetch wrapper that reads `VITE_API_URL`, attaches `Authorization: Bearer <token>` from `localStorage['thaifruit-token']`, and exposes resource-grouped methods (`api.auth.*`, `api.categories.list`, `api.stores.*`, `api.products.*`, `api.orders.*`, `api.upload.image`). The browser bundle no longer imports `@supabase/supabase-js`. `AppContext` calls `api.categories.list()`, `api.stores.list()`, `api.products.list({limit:100})` on mount; mutations (`addProduct`, `updateStore`, `placeOrder`) call the matching `api.*.create / update`. Backend services already return camelCase, so there are no frontend mappers. `src/data/mockData.js` still exists on disk but is **unreferenced** — safe to delete.

**Auth flow:** Signup and login go through `api.auth.signup` / `api.auth.login` (which hit `POST {VITE_API_URL}/auth/{signup,login}`). The server creates a Supabase Auth user under the hood, then returns `{ user, session: { accessToken, refreshToken, ... } }`. The frontend stores `accessToken` in `localStorage['thaifruit-token']` (via `tokenStore` in `api.js`); from then on every API call carries it as a Bearer header. On mount, if a token exists, `api.auth.me()` is called to rehydrate the user — failure clears the token. Logout = `tokenStore.clear() + setUser(null)` (no server endpoint yet).

### Backend (`thaifruit-api/`)

**Stack:** Node.js + Express 5, Supabase (PostgreSQL + Auth + Storage), Zod validation, ESM modules.

**Pattern:** Routes → Controllers → Services → Supabase client. Clean separation of concerns.

**Auth:** Supabase Auth (email/password + LINE OAuth). JWT verified via middleware. Roles: `buyer`, `seller`.

**Database schema** (6 tables):
- `profiles` — User profiles (extends `auth.users`), has role field
- `categories` — Fruit categories with i18n names (seeded data)
- `stores` — Seller stores, 1:1 with profile (owner_id unique)
- `products` — Fruit products with i18n fields, belongs to store
- `product_units` — Pricing tiers per product (kg, crate, basket, etc.)
- `orders` / `order_items` — Orders grouped by store, items snapshot prices at purchase time

**i18n in DB:** Column-per-language (`name`, `name_en`, `name_cn`) matching frontend `locField()` pattern.

**Category IDs:** ASCII slugs (`all`, `orange`, `durian`, `mango`, `pomelo`, `mangosteen`, `rambutan`, `longan`). Frontend now consumes these directly (categories loaded from DB into `AppContext`), so frontend and backend IDs already match.

**API endpoints** (`/api/v1/`):
| Resource | Endpoints |
|----------|-----------|
| Auth | `POST /auth/signup`, `POST /auth/login`, `GET /auth/me` |
| Categories | `GET /categories` |
| Stores | `GET /stores`, `GET /stores/:id`, `POST /stores`, `PUT /stores/:id` |
| Products | `GET /products?q=&category=&featured=`, `GET /products/:id`, `POST`, `PUT`, `DELETE` |
| Orders | `POST /orders`, `GET /orders`, `GET /orders/:id`, `PATCH /orders/:id/status` |
| Upload | `POST /upload/image` (multipart, max 5MB) |

**Environment variables** (all in `.env`, never committed):
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_ANON_KEY`
- `PORT`, `CORS_ORIGIN`, `STORAGE_BUCKET`

**Migrations** in `supabase/migrations/` (001-006), run in order via Supabase Dashboard SQL editor or CLI.

## File Structure

### Frontend (`src/`)
```
src/
├── App.jsx                    — Main app shell, routing, footer
├── main.jsx                   — Entry point (LangProvider > AppProvider > App)
├── index.css                  — All styles (design system, components, responsive)
├── context/
│   ├── AppContext.jsx          — Global state (auth, cart, products, stores, orders, toast) — talks to Express API only
│   └── LangContext.jsx         — i18n provider, all translation keys (~100 keys)
├── lib/
│   └── api.js                  — Fetch wrapper for the Express API; manages bearer token in localStorage
├── data/
│   └── mockData.js             — (ORPHAN — no longer imported; safe to delete)
├── pages/
│   ├── Home.jsx                — Hero banner, store cards, product grid, category tabs, search
│   ├── ProductDetail.jsx       — Full product page (two-column, unit/qty picker, related products)
│   ├── Cart.jsx                — Cart items grouped by store, checkout summary
│   ├── Seller.jsx              — Seller dashboard (stats, orders, add product, store settings)
│   └── StoreDetail.jsx         — Store info header + store's product grid
├── components/
│   ├── Header.jsx              — Sticky header with search, nav, language switcher, cart badge
│   ├── LoginModal.jsx          — Email/password login + signup (with buyer/seller role toggle), test-login shortcut, LINE button
│   ├── ProductModal.jsx        — (DEPRECATED — replaced by ProductDetail page, not imported)
│   └── Toast.jsx               — Toast notification (auto-dismiss 3s)
```

### Backend (`thaifruit-api/src/`)
```
thaifruit-api/
├── .env.example               — Template for required env vars
├── package.json               — Express 5, Supabase JS, Zod, Helmet, CORS, swagger-ui-express, vitest
├── vitest.config.js           — single-fork pool; tests in test/**/*.test.js
├── src/
│   ├── server.js              — Entry point: createApp() + listen
│   ├── app.js                 — Builds the Express app (middleware + routes); exported for tests
│   ├── config/
│   │   ├── env.js             — Validate and export env vars
│   │   └── supabase.js        — Supabase admin + user-scoped clients
│   ├── middleware/
│   │   ├── auth.js            — requireAuth, optionalAuth, requireRole
│   │   ├── validate.js        — Zod body/query validation
│   │   └── errorHandler.js    — Global error handler
│   ├── routes/                — Express routers (one per resource)
│   ├── controllers/           — Request handlers (thin, delegate to services)
│   ├── services/              — Business logic + Supabase queries (return mapped camelCase)
│   ├── validators/            — Zod schemas for request validation
│   ├── openapi/
│   │   ├── schemas.js         — Response Zod schemas + registry, mirrors utils/mappers.js
│   │   ├── registry.js        — Wires every Express route into the OpenAPI registry
│   │   └── index.js           — Builds the spec + mountDocs(app) → /api/v1/docs
│   └── utils/
│       ├── orderNumber.js     — order-number generator
│       ├── pagination.js      — page/limit → from/to range
│       └── mappers.js         — snake_case row → camelCase API response (mapStore/mapProduct/mapOrder/...)
├── test/                      — Vitest contract tests (auth, categories, stores, products, orders, openapi, health)
└── supabase/
    └── migrations/            — SQL migrations (001-006), run in Supabase
```

## Conventions

- UI text uses `t()` translations — do not hardcode user-facing strings
- Data field localization uses `locField(obj, 'fieldName')` — reads `fieldEn`/`fieldCn` suffix
- ESLint rule: `no-unused-vars` ignores variables starting with uppercase or underscore
- Fonts: Inter + Noto Sans Thai (Google Fonts in `index.html`)
- HTML lang is `th`
- CSS class naming: pages use `.pd-*` (product detail), `.cart-*`, `.store-detail-*` prefixes; shared components use `.modal-*`, `.unit-*`, `.qty-*`
- No external state library, no CSS modules, no Tailwind
- Backend uses ESM (`"type": "module"`)
- All credentials in `.env` files, never committed

## Deployment

Two deployable apps, two cloud providers. Both auto-deploy from GitHub.

| Tier | Service | URL pattern | Source |
|------|---------|-------------|--------|
| Frontend | Vercel | `https://thaifruit.vercel.app` | `main` (whole repo, Vite build) |
| Backend | Render | `https://thaifruit-api.onrender.com` | `main` (`thaifruit-api/` rootDir) |
| Database / Auth / Storage | Supabase Cloud | `https://qtrvjfkimwtvtlwsiadq.supabase.co` | managed |

**Render Blueprint** lives at `render.yaml` at the repo root. To re-create the service from scratch (e.g., on a fresh Render account): https://dashboard.render.com/blueprints → **New Blueprint Instance** → point at this repo. Render auto-fills every setting; you'll be prompted once for the three Supabase secrets (which `sync: false` keeps out of the file).

**Where each env var lives**:
- **Vercel project settings** → `VITE_API_URL` (the only one)
- **Render service env vars** → `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_ANON_KEY` (secrets), plus `STORAGE_BUCKET`, `CORS_ORIGIN`, `NODE_ENV` (declared in `render.yaml`)
- **Local `.env`** files → only for `npm run dev`. Never committed.

**Updating CORS allowlist**: edit `CORS_ORIGIN` in the Render dashboard; restart isn't needed (Express picks up the value on the next request? No — actually env vars are read at boot. Render auto-restarts when you save an env var change.).

**Free tier sleep**: the Render free plan sleeps after 15 minutes idle. First request after sleep takes ~30 s to wake. Upgrade to the Starter plan ($7/mo) for always-on.

**Trust-proxy**: `app.set('trust proxy', 1)` is set in `src/app.js` so `express-rate-limit` and `req.ip` see the real client IP from `X-Forwarded-For` (Render fronts the service with a load balancer).

## Known Lint Errors (pre-existing, not blocking)

- `fruit-marketplace_1.jsx` — unused `stores` variable (legacy reference file)
- `Header.jsx` — `set-state-in-effect` for syncing search input
- `AppContext.jsx` / `LangContext.jsx` — `react-refresh/only-export-components`
- `Seller.jsx` — `Date.now()` in render, unused `Icon` variable

## Pending / Known Gaps

- Toast messages in `AppContext.jsx` are hardcoded Thai strings
- `ProductModal.jsx` is deprecated but still in repo — safe to delete
- `src/data/mockData.js` is orphaned (no imports) — safe to delete
- No server-side `POST /auth/logout` (frontend only clears its local token)
- No profile-edit endpoint; no order cancellation; image upload endpoint exists (`POST /upload/image`) but is not yet wired to the seller add-product UI
