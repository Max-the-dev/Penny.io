# Codex Memory – Penny.io

## Project Snapshot
- Micropayment publishing platform leveraging the x402 protocol so readers pay per article (pennies to dollars) and authors receive instant wallet payouts (Base Sepolia in dev, Base mainnet planned).
- Monorepo layout: `frontend/` (Vite + React + TS) for the dApp, `backend/` (Express + TS + SQLite) for API/storage, shared docs (`README.md`, `CLAUDE.md`, `DEV_NOTES.txt`).
- `CLAUDE.md` is the canonical delivery doc: current status is “feature complete” with remaining work around branding, tip persistence, and security hardening before production polish.

## Repository Layout
- Root: MIT `LICENSE`, marketing-focused `README.md`, detailed `CLAUDE.md`, lightweight scratch pad `DEV_NOTES.txt`, `CODEX_MEMORY.md`.
- `frontend/`: Vite project with React Router 7, RainbowKit/Wagmi wallet wiring, TinyMCE editor, custom styles in `App.css`/`index.css`.
- `backend/`: Express API, Multer upload storage in `backend/uploads/`, SQLite file `penny.db`, compiled output expected under `dist/` (not committed).

## Backend (Express + SQLite)
- **Entrypoint:** `src/server.ts` sets up Express 5, CORS, JSON body parsing, static serving for `/uploads`, and wires `/api` routes. x402 middleware is intentionally not applied globally to allow per-route logic.
- **Routing:** `src/routes.ts` centralizes API endpoints:
  - Articles: CRUD (`GET /articles`, `GET /articles/:id`, `POST /articles`, `PUT /articles/:id`, `DELETE /articles/:id`), view increment (`PUT /articles/:id/view`), purchases (`POST /articles/:id/purchase`).
  - Drafts: auto-save aware `POST /drafts`, listing `GET /drafts/:authorAddress`, deletion `DELETE /drafts/:id`.
  - Authors: `GET /authors/:address` for lifetime stats.
  - Likes: `POST /articles/:id/like`, `DELETE /articles/:id/like`, status check `GET /articles/:id/like-status/:userAddress` with user-address dedupe via DB constraint.
  - Payments: `POST /verify-payment` (signature + amount validation, then stats update), `GET /payment-status/:articleId/:userAddress` (in-memory tracker).
  - Uploads: `POST /upload` for TinyMCE image uploads, storing files under `/backend/uploads`.
  - Health: `GET /api/health` exposed from `server.ts`.
- **Payment Flow:** `POST /articles/:id/purchase`
  - Responds with x402 402 payload if missing `X-PAYMENT` header; describes Base Sepolia network, USDC asset, author wallet as recipient.
  - When header supplied, `verifyX402Payment` checks amount >= price, recipient matches author, and validity window before updating article/author stats and recording payer in memory.
  - `verifyPaymentSignature` is currently a stub validating shapes/regex; production notes to plug in EIP-712 validation (ethers.js).
- **Database (`src/database.ts`):**
  - Tables: `authors`, `articles`, `drafts`, `user_likes`; migrations add `categories` + `likes` columns if missing.
  - Article helpers: `createArticle`, `getAllArticles`, `getArticlesByAuthor`, `getArticleById`, `updateArticle` (JSON-encodes categories), `updateArticleStats`, `incrementArticleViews`, `deleteArticle`.
  - Author helpers: `createOrUpdateAuthor`, `getAuthor`, `recalculateAuthorTotals` (rebuild stats while preserving lifetime totals).
  - Draft helpers: new vs auto-save merge (updates if saved within last hour), expiry cleanup (`cleanupExpiredDrafts`), list, delete.
  - Likes: insert with UNIQUE guard, delete, check, recompute total likes on `articles`.
  - All dates stored as ISO strings; publishDate for new articles defaults to current YYYY-MM-DD.
- **Types:** Shared interfaces in `src/types.ts`; custom module definition for `x402-express` in `src/global.d.ts` and `types/x402-express.d.ts`.
- **Tooling:** `package.json` uses `tsc` build, `nodemon src/server.ts` for dev, `express@5`, `multer`, `sqlite3`. Env config via `dotenv`; expects `X402_FACILITATOR_URL`, `X402_NETWORK`, author wallet addresses, etc.

## Frontend (Vite + React + RainbowKit)
- **Bootstrapping:** `src/main.tsx` attaches React to DOM with RainbowKit provider, `wagmi.ts` created via `getDefaultConfig` (requires WalletConnect project ID). `App.tsx` sets up router + layout (Header/Footer + `ScrollToTop` helper).
- **Context & Wallet:** `contexts/WalletContext.tsx` wraps Wagmi `useAccount`, `useBalance`, `useDisconnect` to expose `address`, connection state, trimmed balance string. All payment/author features read this context.
- **Services:**
  - `services/api.ts` wraps fetch to backend with typed responses; handles articles, authors, drafts, likes, purchases, views, etc. `GetArticlesQuery` supports filters (author, search, sort, categories).
  - `services/x402PaymentService.ts` orchestrates full payment loop: attempts request, parses 402 response, constructs payment payload (converts USD to micro USDC), requests wallet signature, verifies via backend, checks status, and offers fallback to REST purchase. Also handles micro-payments for view tracking and detection of x402 support.
  - `services/simpleX402.ts` is a stripped-down helper demonstrating bare x402 flow (logs requirements and defers to client implementation).
- **Key Pages:**
  - `Home.tsx`: Rotating marketing headline, fetches articles (first six), shows article cards with preview text (stripped HTML), CTA to Explore.
  - `Explore.tsx`: Full discovery page with category sidebar, search, author/date/sort filters, dynamic results count, like button integration updating local state.
  - `Article.tsx`: Fetches article + checks payment status; non-authors see preview + paywall overlay. Payment button triggers x402 flow with fallback; successful purchase unlocks `article.content`, shows tip modal (UI stub). Auto-increments view counts (attempts x402 micro-pay for view, falls back to API). Exposes categories, like button, tip modal.
  - `Write.tsx` / `EditArticle.tsx`: TinyMCE editor integration, supports autosave drafts, category selection, price validation, image uploads via `/api/upload`. `Edit` ensures wallet matches author before saving.
  - `Dashboard.tsx`: Wallet-gated view summarizing lifetime stats (earnings, views, purchases) from `GET /authors/:address`, lists articles with search/sort/filter (category + date range), edit/delete controls with confirmation modal, uses `getRelativeTimeString` util. Deletion keeps lifetime counters per business rule.
  - Other static marketing/support pages (`About`, `HowItWorks`, `Pricing`, `Resources`, `Help`, `Privacy`, `Terms`, `Contact`) share consistent styling. `X402Test.tsx` provides a testbed for validating protocol behaviour (requests to `/x402` endpoints).
- **Components:** `Header` with navigation + Connect wallet button; `Footer` with quick links + placeholder donate block; `LikeButton` handles optimistic toggles with API sync + disabled state for disconnected wallets; `ScrollToTop` resets scroll on route change; `XLogo` placeholder for branding.
- **Styling:** `App.css`, `index.css`, and page-specific class names maintain layout; no CSS-in-JS. Icons provided by `lucide-react`.
- **Utilities:** `utils/dateUtils.ts` centralizes date formatting, range filtering, and relative strings for Dashboard/Explore tooling.
- **Tooling:** Frontend `package.json` scripts (`dev`, `build`, `preview`, `lint`), dependencies include RainbowKit/Wagmi/Viem, TinyMCE, React Router v7, Lucide icons, React Query (integration TBD).

## Operational Notes
- **Running Locally:** `cd backend && npm run dev` (port 3001) plus `cd frontend && npm run dev` (port 3000). Backend auto-creates SQLite file and tables on startup.
- **Environment:** Payment routes expect `X402_FACILITATOR_URL`, `X402_NETWORK`, and article author wallet addresses in `.env`; defaults to x402.org facilitator + Base Sepolia.
- **Persistence:** Payments stored in-memory map on backend—restart clears unlock status; CLAUDE.md flags persistence as follow-up task.
- **Security To-Dos:** CLAUDE.md highlights need for content sanitization (current frontend renders HTML via `dangerouslySetInnerHTML` after basic markdown replacements), rate limiting, stronger input validation, and production infra (HTTPS, logging).
- **Housekeeping:** `DEV_NOTES.txt` currently blank; safe to use for adhoc planning. `CODEX_MEMORY.md` (this file) is Codex-specific context for future sessions.
