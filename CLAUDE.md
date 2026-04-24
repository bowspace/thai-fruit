# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **RULE: Always update this file when features are added, changed, or removed.** Keep architecture, routing, i18n, and file structure sections accurate so future sessions start with correct context. If you modify routing pages, add translation keys, create/delete components, or change conventions — reflect it here before finishing the task.

## Design System

**Before touching any UI/frontend code, read `.impeccable.md` at the project root.** It is the source of truth for tokens, component inventory, patterns, and do/don'ts — and it is picked up automatically by the `impeccable` skill (invoke with `/impeccable craft <feature>` to shape-then-build a new feature in-style, or `/impeccable extract` to refresh the inventory when new patterns solidify). Keep `.impeccable.md` updated when the aesthetic direction or tokens change.

## Project Overview

**ThaiFruit** — a multilingual online Thai fruit marketplace. Buyers browse/search fruit products from farmer stores, view product details, add to cart, and place orders. Sellers manage their store and products. Supports Thai, English, and Chinese.

**Monorepo with two deployable apps:**
- **Frontend** (`/`) — React SPA, wired to Supabase directly for reads/mutations, auth routed through the backend API
- **Backend** (`/thaifruit-api/`) — Node.js + Express REST API with Supabase (PostgreSQL)

## Commands

### Frontend
- `npm run dev` — Start Vite dev server (default port 5173; pass `-- --port <n>` to override)
- `npm run build` — Production build (output in `dist/`)
- `npm run lint` — ESLint (flat config, JS/JSX only)
- `npm run preview` — Preview production build
- Requires `.env` at repo root — copy from `.env.example` (`VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)

### Backend (`cd thaifruit-api`)
- `npm run dev` — Start API with `--watch` (port 3001)
- `npm start` — Start API for production
- Requires `.env` file — copy from `.env.example`

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

**Data:** All data comes from Supabase. `src/lib/supabase.js` exports a client created with `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`. `AppContext` loads `categories`, `stores`, `products`, `product_units` on mount and exposes camelCase objects via `mapStore` / `mapProduct` / `mapCategory` helpers (DB is snake_case). Mutations (`addProduct`, `updateStore`, `placeOrder`) write directly to Supabase under the user's authenticated session for RLS. `src/data/mockData.js` still exists on disk but is **unreferenced** — safe to delete.

**Auth flow:** Signup and login go through the backend API (`POST {VITE_API_URL}/auth/{signup,login}`) so the server can auto-confirm emails and return a Supabase session; the frontend then calls `supabase.auth.setSession()` with the returned tokens so subsequent direct Supabase queries carry the JWT for RLS. `supabase.auth.getSession()` restores the session on mount; logout calls `supabase.auth.signOut()`.

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
│   ├── AppContext.jsx          — Global state (auth, cart, products, stores, orders, toast) — reads/writes Supabase
│   └── LangContext.jsx         — i18n provider, all translation keys (~100 keys)
├── lib/
│   └── supabase.js             — Supabase client (uses VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
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
├── package.json               — Express 5, Supabase JS, Zod, Helmet, CORS
├── src/
│   ├── index.js               — Express app setup, middleware, route mounting
│   ├── config/
│   │   ├── env.js             — Validate and export env vars
│   │   └── supabase.js        — Supabase admin + user-scoped clients
│   ├── middleware/
│   │   ├── auth.js            — requireAuth, optionalAuth, requireRole
│   │   ├── validate.js        — Zod body/query validation
│   │   └── errorHandler.js    — Global error handler
│   ├── routes/                — Express routers (one per resource)
│   ├── controllers/           — Request handlers (thin, delegate to services)
│   ├── services/              — Business logic + Supabase queries
│   ├── validators/            — Zod schemas for request validation
│   └── utils/                 — orderNumber generator, pagination helper
├── supabase/
│   └── migrations/            — SQL migrations (001-006), run in Supabase
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

## Known Lint Errors (pre-existing, not blocking)

- `fruit-marketplace_1.jsx` — unused `stores` variable (legacy reference file)
- `Header.jsx` — `set-state-in-effect` for syncing search input
- `AppContext.jsx` / `LangContext.jsx` — `react-refresh/only-export-components`
- `Seller.jsx` — `Date.now()` in render, unused `Icon` variable

## Pending / Known Gaps

- `StoreDetail.jsx` and `Seller.jsx` still have hardcoded Thai text (not yet routed through `t()`)
- Toast messages in `AppContext.jsx` are hardcoded Thai strings
- `ProductModal.jsx` is deprecated but still in repo — safe to delete
- `src/data/mockData.js` is orphaned (no imports) — safe to delete
- Search bar hidden on mobile with no alternative
- `Cart.removeFromCart` bug: `Cart.jsx:80` passes the index within the per-store grouped list to `removeFromCart`, but `AppContext.removeFromCart` treats it as an index into the full `cart` array — removes the wrong item when the cart contains multiple stores
