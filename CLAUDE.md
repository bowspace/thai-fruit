# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **RULE: Always update this file when features are added, changed, or removed.** Keep architecture, routing, i18n, and file structure sections accurate so future sessions start with correct context. If you modify routing pages, add translation keys, create/delete components, or change conventions — reflect it here before finishing the task.

## Project Overview

**ThaiFruit** — a multilingual online Thai fruit marketplace. Buyers browse/search fruit products from farmer stores, view product details, add to cart, and place orders. Sellers manage their store and products. Supports Thai, English, and Chinese.

**Monorepo with two deployable apps:**
- **Frontend** (`/`) — React SPA (currently uses mock data, will migrate to API)
- **Backend** (`/thaifruit-api/`) — Node.js + Express REST API with Supabase (PostgreSQL)

## Commands

### Frontend
- `npm run dev` — Start Vite dev server (port 5176)
- `npm run build` — Production build (output in `dist/`)
- `npm run lint` — ESLint (flat config, JS/JSX only)
- `npm run preview` — Preview production build

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

**Data:** Currently all mock data from `src/data/mockData.js`. Backend API is ready but frontend not yet wired to it.

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

**Category IDs:** ASCII slugs (`orange`, `durian`, `mango`) — not Thai text. Frontend CATEGORIES will need migration.

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
│   ├── AppContext.jsx          — Global state (auth, cart, products, stores, orders, toast)
│   └── LangContext.jsx         — i18n provider, all translation keys (~100 keys)
├── data/
│   └── mockData.js             — Mock data with EN localized fields
├── pages/
│   ├── Home.jsx                — Hero banner, store cards, product grid, category tabs, search
│   ├── ProductDetail.jsx       — Full product page (two-column, unit/qty picker, related products)
│   ├── Cart.jsx                — Cart items grouped by store, checkout summary
│   ├── Seller.jsx              — Seller dashboard (stats, orders, add product, store settings)
│   └── StoreDetail.jsx         — Store info header + store's product grid
├── components/
│   ├── Header.jsx              — Sticky header with search, nav, language switcher, cart badge
│   ├── LoginModal.jsx          — LINE login modal overlay
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

- **Frontend ↔ Backend not wired yet** — frontend still uses mockData.js
- Chinese (`cn`) product data fields not in mockData — CN users see English fallback
- `StoreDetail.jsx` and `Seller.jsx` have hardcoded Thai text (not yet i18n)
- Toast messages in `AppContext.jsx` are hardcoded Thai
- `ProductModal.jsx` is deprecated but still in repo — safe to delete
- Frontend category IDs use Thai text (`'ส้ม'`), backend uses ASCII slugs (`'orange'`) — needs migration when wiring
- Search bar hidden on mobile with no alternative
- Cart `removeFromCart` uses array index (bug with multi-store carts)
