# Padelicense Shop

E-commerce storefront for padel equipment. Server-rendered Next.js 16 with Apollo Client, i18n (en/fr/nl), and Stripe checkout.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS 4
- **API:** Apollo Client 4, GraphQL Codegen
- **i18n:** next-intl (en, fr, nl) with locale-aware routing
- **Payments:** Stripe Elements (PaymentElement)
- **Design System:** Storybook 10
- **Tests:** Vitest + React Testing Library (86 tests), Playwright E2E (3 flows)

## Architecture

```
src/
  app/[locale]/            # Pages (App Router, Server Components by default)
    products/              #   Catalogue + product detail
    cart/                  #   Shopping cart
    checkout/              #   Stripe checkout + confirmation
    account/               #   Profile, addresses, orders (3 tabs)
    login/ & signup/       #   Authentication
  components/ui/           # Design system (Button, Input, Select, Badge, etc.)
  lib/                     # Global contexts (auth, cart, apollo, stripe)
  gql/                     # Auto-generated GraphQL types (do not edit)
  i18n/                    # Routing & locale config
messages/                  # Translation files (en.json, fr.json, nl.json)
e2e/                       # Playwright E2E tests
```

**Conventions:**
- Named exports only, no default exports
- Props as `(props: Type) => { const { ... } = props; }`
- `type` over `interface`
- Queries in `_queries/` (Server Components), hooks in `_hooks/` (Client Components)
- Always request `id` on GraphQL Node types (Apollo cache normalization)

## Getting Started

### Prerequisites

- Node.js 20+
- [padelicense-api](https://github.com/your-user/padelicense-api) running on port 3000

### Setup

```bash
cp .env.example .env.local
npm install
npm run dev
# Shop available at http://localhost:3001
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server (port 3001) |
| `npm run build` | Production build |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E tests (Playwright, requires API) |
| `npm run lint` | ESLint |
| `npm run format:check` | Prettier check |
| `npm run typecheck` | TypeScript type checking |
| `npm run codegen` | GraphQL Codegen (requires API) |
| `npm run storybook` | Storybook dev server |

## E2E Test Coverage

| Flow | Steps |
|------|-------|
| **Signup + Account** | Signup, edit profile, add/edit addresses, change default, check orders |
| **Guest Checkout** | Add products, modify cart, checkout with email + address, Stripe payment, confirmation |
| **User Checkout** | Add to cart as guest, signup (cart claimed), save address, checkout, pay, verify order in account |

## Environment Variables

See `.env.example` for required configuration.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | GraphQL API endpoint |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
