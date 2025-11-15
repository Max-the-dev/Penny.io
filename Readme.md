<div align="center">

# Penny.io – Wallet‑Native Micropayments for Web Publishing

Pay‑per‑article access, instant author payouts, and dual‑network wallet support powered by the x402 payment protocol.

</div>

---

## Table of Contents

1. [About Penny.io](#about-pennyio)  
2. [Key Features](#key-features)  
3. [Architecture](#architecture)  
4. [x402 Payment Flow](#x402-payment-flow)  
5. [Getting Started](#getting-started)  
6. [Configuration](#configuration)  
7. [Wallet & Payment Experience](#wallet--payment-experience)  
8. [Testing & Developer Commands](#testing--developer-commands)  
9. [Roadmap](#roadmap)  
10. [Additional Resources](#additional-resources)  
11. [License](#license)

---

## About Penny.io

Penny.io is a fully wallet‑native publishing platform aimed at technical and crypto writers who want precise control over pricing and payouts. Instead of subscriptions, readers unlock individual articles for $0.01–$1.00 using the **x402 HTTP payment protocol**. Writers get paid in seconds (not weeks) and can manage payouts across **Base** and **Solana** with a dual‑wallet workflow.

Why it matters:

- Traditional platforms force monthly paywalls or keep large revenue shares.
- Micropayments were impractical before x402 due to gas costs and latency.
- Penny.io combines a modern reader UX, a professional editor, analytics, and instant settlement over USDC.

---

## Key Features

### Payments & Wallets
- 🔐 **x402 Micropayments** – Per‑article pricing with instant signature verification and optional Coinbase CDP settlement.  
- 🌉 **Multichain Support** – Base + Solana USDC payouts, including automatic ATA detection for Solana authors.  
- 🔁 **Dual‑Wallet Management** – Authors can add a complementary network payout wallet, replace/remove it via a guarded modal, and stay in sync with canonical author records.  
- 🎁 **Tipping & Donations** – Dedicated modals let readers send extra USDC on either supported network.  
- 🧾 **Payment Status Caching** – Unlocks persist across refreshes using local storage plus backend verification.

### Author Experience
- ✍️ **TinyMCE Editor** with autosave drafts, image uploads (Supabase Storage), and preview/paywall controls.  
- 📊 **Real‑time Dashboard** showing lifetime earnings, conversion rate, weekly purchase stats, and wallet health.  
- 🧮 **Popularity & Analytics** – Views, purchases, likes, and time‑decayed popularity scoring for discovery.  
- 👛 **Wallet Insights** – Hero section highlights primary/secondary wallets with network badges and copy buttons.

### Reader Experience
- 📚 **Preview + Paywall** – First paragraphs free; unlock the rest via x402 in one wallet popup.  
- 🔎 **Explore Page** – Faceted search, category filters, grid/list views, and infinite scroll.  
- ❤️ **Likes System** – Wallet‑based dedupe to surface trending content.  
- 🧭 **X402 Test Harness** – `/x402-test` page walks through fetching requirements, building headers, and verifying access.

### Operations & Security
- 🗄️ **Supabase PostgreSQL** with `author_wallets`, payment tables, pg_cron jobs, and CDN storage.  
- 🧼 **DOMPurify Sanitization** for all user generated content.  
- 🧪 **Scripts** for Solana ATA creation, wallet backfills, and Supabase maintenance.  
- 🔁 **Author Lifetime Metrics** – Totals never decrement; reconciliation helper fixes historical data if needed.

---

## Architecture

```
Penny_dev/
├── frontend/    # React + TypeScript + Vite SPA
│   ├── src/pages (Dashboard, Article, Explore, X402Test, etc.)
│   ├── src/services (api, x402PaymentService, wallet helpers)
│   └── src/contexts (WalletContext wraps AppKit/RainbowKit)
├── backend/     # Express + TypeScript API
│   ├── src/routes.ts        # articles, payments, author wallets
│   ├── src/database.ts      # Supabase/Postgres access layer
│   ├── src/spamPrevention.ts# rate limiting + content safety
│   └── scripts/             # backfills, Solana helpers, etc.
├── Dev_Notes/   # working session notes & wallet commands
├── CLAUDE.md    # coding guidelines & architecture summary
└── x402_*       # protocol whitepaper + diagrams (PDF / markdown)
```

- **Frontend**: React 18 + TypeScript, React Router, AppKit (WalletConnect), Wagmi/Viem, Tailored modals.  
- **Backend**: Node.js/Express, Supabase client for CRUD, Coinbase CDP facilitator hooks, settlement service, and spam/rate-limiting middleware.  
- **Database**: Supabase PostgreSQL with JSONB categories, `author_wallets`, payment logs, and scheduled pg_cron jobs.  
- **Storage**: Supabase Storage for media, served via CDN.  
- **Payments**: x402 HTTP protocol, Base & Solana USDC mints, optional auto-settlement via Coinbase CDP.

---

## x402 Payment Flow

```
┌──────────┐         ┌─────────────┐         ┌──────────────┐
│  Reader  │         │  Frontend   │         │   Backend    │
│ (Wallet) │         │             │         │              │
└────┬─────┘         └──────┬──────┘         └──────┬───────┘
     │ 1. Click Purchase    │                       │
     ├─────────────────────>│                       │
     │                      │ 2. POST /purchase     │
     │                      │    (no X-PAYMENT)     │
     │                      ├──────────────────────>│
     │                      │ 3. 402 Requirements   │
     │                      │<──────────────────────┤
     │ 4. Sign Authorization│                       │
     │    (single popup)    │                       │
     │<─────────────────────┤                       │
     │                      │ 5. Return signature   │
     ├─────────────────────>│                       │
     │                      │ 6. POST /purchase     │
     │                      │    + X-PAYMENT header │
     │                      ├──────────────────────>│
     │                      │ 7. Verify signature   │
     │                      │ 8. Record payment     │
     │                      │ 9. Grant access       │
     │                      │<──────────────────────┤
     │10. Content unlocked  │                       │
```

**Why it’s fast:** authorization happens off-chain via signed payloads, so readers unlock content immediately and settlement can batch later. The facilitator (public endpoint or Coinbase CDP) validates headers and enforces price, asset, and timeout requirements per article.

For a deeper dive (authorization vs settlement, gas math, code samples), see [`x402-technical-documentation.pdf`](./x402-technical-documentation.pdf).

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+  
- Supabase project (or Postgres) with the schema from `/backend/supabase/migrations`  
- WalletConnect/AppKit project ID for the frontend  
- Coinbase CDP API keys (optional, only if you want automated settlement)  
- Solana devnet fee payer + ATA for USDC testing (see `Dev_Notes/My_Notes.md`)

### Installation

```bash
git clone https://github.com/<your-org>/Penny_dev.git
cd Penny_dev
npm install          # installs root, backend, and frontend deps via workspaces
```

Install sub-project dependencies individually if needed:

```bash
cd backend  && npm install
cd ../frontend && npm install
```

### Local Development

```bash
# Terminal 1 – Backend API (http://localhost:3001)
cd backend
npm run dev

# Terminal 2 – Frontend SPA (http://localhost:3000)
cd frontend
npm run dev
```

Visit `http://localhost:3000` for the app and `http://localhost:3001/api/health` to confirm the API is up.

---

## Configuration

Create `.env` files in both `backend/` and `frontend/` (the repo intentionally keeps secrets out of source). Key variables include:

| Scope      | Variable | Description |
|------------|----------|-------------|
| Backend    | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_POOLER_URL` | Database access & pooling. |
| Backend    | `X402_NETWORK` | `base`, `base-sepolia`, `solana`, or `solana-devnet`. Determines pricing + facilitator metadata. |
| Backend    | `X402_MAINNET_USDC_ADDRESS`, `X402_TESTNET_USDC_ADDRESS` | Optional overrides for EVM USDC contracts. |
| Backend    | `X402_SOLANA_MAINNET_USDC_ADDRESS`, `X402_SOLANA_DEVNET_USDC_ADDRESS` | Solana mint addresses. |
| Backend    | `X402_PLATFORM_EVM_ADDRESS`, `X402_PLATFORM_SOL_ADDRESS` | Platform fee wallets. |
| Backend    | `CDP_API_KEY_ID`, `CDP_API_KEY_SECRET`, `X402_FACILITATOR_URL` | Coinbase CDP + facilitator settings. |
| Backend    | `SOLANA_DEVNET_RPC_URL`, `SOLANA_MAINNET_RPC_URL` | RPC endpoints for ATA lookups and rate limiting. |
| Frontend   | `VITE_API_URL` / `VITE_API_BASE_URL` | API base (defaults to `http://localhost:3001/api`). |
| Frontend   | `VITE_WALLETCONNECT_PROJECT_ID` | Required for AppKit/RainbowKit connections. |
| Frontend   | `VITE_X402_NETWORK`, `VITE_X402_FACILITATOR_URL` | Mirrors backend network + facilitator for UI hints. |
| Frontend   | `VITE_SOLANA_DEVNET_RPC_URL`, `VITE_SOLANA_MAINNET_RPC_URL` | Wallet balance & ATA checks. |
| Frontend   | `VITE_COINBASE_CDP_APP_ID` | Enables Coinbase-specific purchase UX. |

See `CLAUDE.md` and `Dev_Notes/My_Notes.md` for additional scripts (Solana fee payer, ATA creation, Supabase backfills, etc.).

---

## Wallet & Payment Experience

- **Primary vs Secondary wallets**  
  - Authors onboard with one wallet (Base or Solana).  
  - They can add exactly one complementary network wallet via the dashboard modal.  
  - Removal/replacement is gated by a confirmation modal that warns users they’ll be signed out if they’re connected with the wallet being removed.  
  - After API success, the frontend compares the currently connected wallet (normalized EVM checksum or Solana base58) with the author’s canonical addresses and disconnects if it’s no longer valid.

- **Tipping & Donations**  
  - Donation modal adapts button text + wallet prompts per network.  
  - Tip modal introduces a network selector, automatically routing to Phantom vs MetaMask/AppKit depending on the author’s accepted networks.

- **Spam & Abuse Protections**  
  - Backend `spamPrevention.ts` enforces wallet rate limits, duplicate content detection, and rapid-submission throttles.  
  - Addresses are normalized via `normalizeFlexibleAddress` before checks to prevent checksum mismatches.

---

## Testing & Developer Commands

Common scripts (run from project root unless noted):

```bash
# Frontend
cd frontend
npm run dev          # start Vite dev server
npm run build        # production build
npm run lint         # ESLint

# Backend
cd backend
npm run dev          # nodemon + ts-node
npm run build        # tsc compile
npm run lint         # (if enabled in package.json)

# Supabase / utility scripts
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... DATABASE_POOLER_URL=... \
  npx ts-node backend/scripts/backfillAuthorWallets.ts

# Solana devnet helpers (see Dev_Notes/My_Notes.md)
solana config set --url https://api.devnet.solana.com --keypair ~/.config/solana/devnet-fee-payer.json
spl-token create-account 4zMMC9sr... --owner <SOL_ADDR> --fee-payer ~/.config/solana/devnet-fee-payer.json
```

For x402 end-to-end verification, use the `/x402-test` page to simulate:
1. Fetching payment requirements.  
2. Generating the `X-PAYMENT` header.  
3. Executing purchase + verifying article access.  
4. Testing tip/donation flows on Base vs Solana.

---

## Roadmap

Tracked in `Dev_Notes/My_Notes.md` and the dashboard UI:

- 🔜 **Dark Mode & Theming** – system-based toggles for all pages.  
- 🔜 **Author Insights** – category analytics, per-article funnels, weekly cohort stats.  
- 🔜 **Profile Pages & Bundles** – follow authors, buy 24hr access bundles, show proof-of-read.  
- 🔜 **Merge Tooling** – Admin CLI to merge two author UUIDs when users publish from multiple wallets before linking.  
- 🔜 **AI Agent Integrations** – x402-protected API endpoints so agents can fetch and pay for content autonomously.  
- 🧭 **Launch Prep** – see `Dev_Notes` for marketing + documentation tasks (whitepaper, writer toolkit, dev.fun incubator application).

---

## Additional Resources

- [`CLAUDE.md`](./CLAUDE.md) – architecture deep dive, coding conventions, x402 notes.  
- [`Dev_Notes/My_Notes.md`](./Dev_Notes/My_Notes.md) – wallet management flows, Solana/Supabase commands, roadmap.  
- [`x402-technical-documentation.pdf`](./x402-technical-documentation.pdf) – protocol whitepaper with diagrams.  
- [`SECURITY_IMPLEMENTATION_PLAN.md`](./SECURITY_IMPLEMENTATION_PLAN.md) – XSS mitigation, spam prevention, wallet safety.  
- [`WALLET_AUTO_CONNECT.md`](./WALLET_AUTO_CONNECT.md) – UX decisions around AppKit/RainbowKit behavior.

If you add new docs, link them here so contributors can find the latest references quickly.

---

## License

Released under the [MIT License](./LICENSE). Contributions are welcome—open an issue or pull request once you’ve followed the coding guidelines in `CLAUDE.md`.
