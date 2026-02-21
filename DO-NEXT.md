# GadgetBD — What To Do Next & Deployment Guide

> Actionable roadmap from mock-data prototype to production-ready e-commerce platform.

---

## Current State (as of Feb 2026)

| Area | Status | Notes |
|---|---|---|
| UI Shell (Header, Footer, Layout) | Done | Scroll-aware header, mobile menu, footer |
| Landing Page (6 sections) | Done | Hero, Bento, Featured, Deals, Why, Newsletter |
| Search (Modal + Results Page) | Done (UI only) | Uses mock data, fuzzy RPC commented out |
| Product Card + Detail | Done (UI only) | Mock product data hardcoded |
| Cart Page | Done | Zustand store with localStorage persist |
| Checkout (3-step) | Done (UI only) | Mock geography, no real order submission |
| Auth Form | Done (UI only) | Supabase auth calls commented out |
| Database Schema | Done (SQL file) | Not yet applied to a live Supabase project |
| Supabase Client Config | Done | Browser + Server + Middleware clients ready |
| Animation System | Done | 15+ Framer Motion presets |
| Design System / CSS Tokens | Done | Light + dark mode, fluid typography |
| Build | Passing | 0 errors, 8 routes compiled |

**Key gap**: Everything renders with mock data. No live Supabase project is connected yet.

---

## Phase 1: Supabase Setup & Data Layer

**Goal**: Connect a real Supabase project and replace every mock data array with live queries.

### 1.1 Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project
2. Name it `gadgetbd` and choose a region closest to Bangladesh (e.g., `ap-southeast-1` Singapore)
3. Save the generated database password somewhere secure
4. Once the project is ready, copy these values:
   - **Project URL** (e.g., `https://xxxx.supabase.co`)
   - **Anon public key** (safe for the browser)
   - **Service role key** (server-only, never expose to the client)

### 1.2 Apply the Database Schema

```bash
# Option A — Supabase CLI (recommended)
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push          # pushes supabase/schema.sql

# Option B — SQL Editor in Dashboard
# Open Supabase Dashboard → SQL Editor → paste the full contents of supabase/schema.sql → Run
```

### 1.3 Seed Bangladesh Geography

The schema already seeds the 8 divisions and 4 delivery zones. You also need:

- **64 districts** — Create `supabase/seed-districts.sql` with INSERT statements for all districts mapped to their division IDs
- **495 upazilas** — Create `supabase/seed-upazilas.sql` mapping each upazila to its district
- **Upazila-to-zone mapping** — Map each upazila to a delivery zone in `upazila_zone_map`

Data source: [Bangladesh Bureau of Statistics](http://www.bbs.gov.bd/) or the [Bangladesh geocode dataset on GitHub](https://github.com/nuhil/bangladesh-geocode).

### 1.4 Configure Environment Variables

```bash
# Copy the example and fill in real values
cp .env.local.example .env.local
```

Edit `.env.local`:
```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=GadgetBD
```

### 1.5 Replace Mock Data — File-by-File Checklist

| # | File | What To Do |
|---|---|---|
| 1 | `src/components/checkout/checkout-flow.tsx` | Replace `mockDivisions` with `supabase.from('divisions').select()`. Add cascading queries for districts and upazilas. Look up delivery zone via `upazila_zone_map`. |
| 2 | `src/components/search/search-modal.tsx` | Uncomment the `supabase.rpc('search_products', ...)` call. Remove `mockResults` array. Wire trending searches to a `popular_searches` table or analytics query. |
| 3 | `src/components/search/search-results.tsx` | Replace `mockProducts` array with a server-side or client-side query: `supabase.from('products').select('*, brand:brands(*), category:categories(*)').ilike(...)` with filter/sort params. |
| 4 | `src/components/home/featured-showcase.tsx` | Replace `featuredProducts` with `supabase.from('products').select().eq('is_featured', true).limit(3)` |
| 5 | `src/components/home/deals-strip.tsx` | Replace `mockDeals` with `supabase.from('products').select().not('compare_price', 'is', null).order('compare_price', { ascending: false }).limit(4)` |
| 6 | `src/app/product/[slug]/page.tsx` | Uncomment the Supabase query. Fetch product by slug with joins to `product_images`, `product_variants`, `brands`, `categories`. |
| 7 | `src/components/auth/auth-form.tsx` | Uncomment `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()`. Add error handling and redirect. |

### 1.6 Add Product Data

Insert at least 10-20 products via:
- Supabase Dashboard → Table Editor
- A `supabase/seed-products.sql` file
- A future admin dashboard (Phase 4)

Each product needs: `name`, `slug`, `description`, `price`, `category_id`, `brand_id`, at least 1 image in `product_images`, and optionally variants in `product_variants`.

---

## Phase 2: Auth, Cart Sync & Order Processing

### 2.1 Complete Authentication

**Files to modify**: `src/components/auth/auth-form.tsx`, `src/middleware.ts`

1. **Uncomment Supabase auth calls** in `auth-form.tsx`
2. **Add auth state listener** — wrap the app with a context or use Zustand to track user session
3. **Protect routes** — in middleware, redirect unauthenticated users away from `/checkout` and `/account`
4. **Add sign-out** — wire the Account nav button to `supabase.auth.signOut()`
5. **Profile creation trigger** — add a Supabase database trigger or Edge Function to auto-create a `profiles` row when a new user signs up

```sql
-- Example trigger (add to schema.sql)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 2.2 Server-Side Cart Sync

Currently the cart lives only in localStorage via Zustand. For logged-in users, sync it to the database:

1. On login → merge localStorage cart into `carts` / `cart_items` tables
2. On logout → optionally persist the cart for the user
3. On every add/remove → update both Zustand (for instant UI) and Supabase (for persistence)

```typescript
// Example: hybrid cart approach
async function addItemToCart(product: Product, variant: ProductVariant, qty: number) {
  // 1. Instant local update
  useCartStore.getState().addItem({ ... })

  // 2. Background sync to Supabase (if logged in)
  const user = await supabase.auth.getUser()
  if (user.data.user) {
    await supabase.from('cart_items').upsert({
      cart_id: userCartId,
      product_id: product.id,
      variant_id: variant.id,
      quantity: qty,
    })
  }
}
```

### 2.3 Order Submission

Create a Supabase Edge Function for secure, server-side order processing:

```bash
supabase functions new create-order
```

The function should:

1. Validate the request body (items, address, payment method)
2. Verify stock availability with `SELECT ... FOR UPDATE` row locks
3. Calculate prices server-side (never trust client-sent prices)
4. Create `orders` row + `order_items` rows in a transaction
5. Decrement `stock` on each `product_variants` row
6. If COD → mark `payment_status = 'pending'`, return order confirmation
7. If MFS/Card → initiate payment session, return redirect URL
8. Return the generated order number (`GBD-YYYYMMDD-XXXXX`)

### 2.4 Order Confirmation Page

Create `src/app/order/[id]/page.tsx`:
- Display order number, status, items, delivery estimate
- Show payment status and instructions (e.g., "Pay via bKash within 30 minutes")
- Link to order tracking

---

## Phase 3: Payment Gateway Integration

### 3.1 SSLCommerz (Cards & Bank)

SSLCommerz is the most common Bangladeshi payment aggregator.

1. **Sign up**: [sslcommerz.com](https://www.sslcommerz.com/) → get sandbox credentials
2. **Create API route**: `src/app/api/payment/sslcommerz/route.ts`
3. **Flow**:
   ```
   Client → API Route (init session) → SSLCommerz redirect → 
   Customer pays → SSLCommerz IPN callback → API Route (verify) → 
   Update order status → Redirect to confirmation
   ```
4. **IPN validation**: Always verify the transaction server-side using SSLCommerz's validation API
5. **Environment variables**:
   ```dotenv
   SSLCOMMERZ_STORE_ID=your_store_id
   SSLCOMMERZ_STORE_PASSWORD=your_store_pass
   SSLCOMMERZ_IS_SANDBOX=true
   ```

### 3.2 bKash Payment Gateway

1. **Apply for merchant account**: [bKash PGW](https://developer.bka.sh/)
2. **Create API routes**:
   - `src/app/api/payment/bkash/create/route.ts` — initiate payment
   - `src/app/api/payment/bkash/callback/route.ts` — handle redirect
3. **Flow**: Grant token → Create payment → Redirect → Execute payment → Query
4. **Sandbox first**: Use sandbox credentials from `.env.local`

### 3.3 Nagad Payment Gateway

1. **Apply**: [nagad.com.bd](https://nagad.com.bd/) merchant portal
2. **API routes**: Similar structure to bKash
3. **Flow**: Initialize → Redirect → Complete → Verify

### 3.4 Rocket (DBBL Mobile Banking)

1. **Merchant registration** through Dutch-Bangla Bank
2. Similar redirect-based flow as bKash/Nagad

### 3.5 Cash on Delivery

No gateway integration needed. On order submission:
- Set `payment_method = 'cod'`, `payment_status = 'pending'`
- COD fee can be added to the order total if desired
- Mark as `paid` when the delivery agent confirms collection

---

## Phase 4: Admin Dashboard

Build an admin panel at `/admin` (separate layout, auth-gated to admin role).

### Required Pages

| Route | Purpose |
|---|---|
| `/admin` | Dashboard — revenue, orders today, low stock alerts |
| `/admin/products` | Product CRUD — table view, filters, bulk actions |
| `/admin/products/new` | Add product form with image upload |
| `/admin/orders` | Order list — filter by status, search by order number |
| `/admin/orders/[id]` | Order detail — update status, print invoice |
| `/admin/customers` | Customer list with order history |
| `/admin/categories` | Category tree management |
| `/admin/coupons` | Coupon CRUD with expiry and limit rules |
| `/admin/analytics` | Sales charts, top products, conversion funnel |

### Implementation Approach

1. **Auth guard**: Check `profiles.role = 'admin'` in middleware
2. **Image upload**: Use Supabase Storage with a `product-images` bucket
3. **Data tables**: Use a headless table library like TanStack Table
4. **Charts**: Recharts or Chart.js for analytics visualizations

---

## Phase 5: Image & Media Pipeline

### 5.1 Set Up Supabase Storage

```sql
-- Create a public bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);
```

### 5.2 Replace Placeholder Images

Every product card and detail page currently renders placeholder divs. Replace with:

```tsx
import Image from 'next/image'

<Image
  src={supabaseStorageUrl + product.images[0].url}
  alt={product.name}
  width={400}
  height={400}
  className="object-cover"
  placeholder="blur"
  blurDataURL={product.images[0].blur_hash}
/>
```

### 5.3 Configure next.config.ts for Remote Images

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}
```

### 5.4 Open Graph & Social Images

- Add `opengraph-image.tsx` to generate dynamic OG images per product
- Use `@vercel/og` or the built-in Next.js Image Response API

---

## Phase 6: SEO, Performance & Accessibility

### 6.1 SEO Essentials

- [ ] **Sitemap**: Create `src/app/sitemap.ts` that queries all product slugs + categories
- [ ] **robots.txt**: Create `src/app/robots.ts` allowing all crawlers, disallowing `/checkout`, `/cart`, `/account`
- [ ] **Structured Data**: Add JSON-LD `Product` schema to every product detail page
- [ ] **Dynamic Metadata**: Ensure every page exports `generateMetadata()` with proper title, description, OG tags
- [ ] **Canonical URLs**: Add `<link rel="canonical">` via metadata API

```typescript
// src/app/sitemap.ts
import { createClient } from '@/lib/supabase/server'

export default async function sitemap() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('slug, updated_at')

  const productUrls = products?.map((p) => ({
    url: `https://gadgetbd.com/product/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) ?? []

  return [
    { url: 'https://gadgetbd.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://gadgetbd.com/search', changeFrequency: 'daily', priority: 0.7 },
    ...productUrls,
  ]
}
```

### 6.2 Performance Checklist

- [ ] **Core Web Vitals**: Target LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] **Bundle analysis**: Run `npx @next/bundle-analyzer` to find large dependencies
- [ ] **Code splitting**: Ensure heavy components (checkout, search modal) are dynamically imported
- [ ] **Font optimization**: Geist fonts are already loaded via `next/font` — verify `swap` display
- [ ] **Image optimization**: Use Next.js `<Image>` with AVIF/WebP, proper `sizes` attribute
- [ ] **Prefetching**: Next.js `<Link>` prefetches by default — verify product links prefetch

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const SearchModal = dynamic(() => import('@/components/search/search-modal'), {
  ssr: false,
})

const CheckoutFlow = dynamic(() => import('@/components/checkout/checkout-flow'), {
  ssr: false,
  loading: () => <div className="skeleton h-96" />,
})
```

### 6.3 Accessibility

- [ ] All images have descriptive `alt` text
- [ ] Keyboard navigation works for search modal (`Escape` to close, arrow keys)
- [ ] Focus trapping in modals (search, mobile menu)
- [ ] Color contrast meets WCAG AA for all text
- [ ] `aria-label` on icon-only buttons (cart, wishlist, search)
- [ ] Skip-to-content link in the header
- [ ] Form inputs have associated `<label>` elements

---

## Phase 7: Testing

### 7.1 Unit Tests (Vitest)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

```json
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

**Priority test targets**:
| File | What To Test |
|---|---|
| `src/lib/utils.ts` | `formatPrice`, `calcDiscount`, `slugify`, `debounce` |
| `src/lib/store.ts` | Cart operations — add, remove, update, subtotal, count |
| `src/components/products/product-card.tsx` | Renders product name, price, discount badge |
| `src/components/checkout/checkout-flow.tsx` | Step navigation, validation, delivery calc |

### 7.2 E2E Tests (Playwright)

```bash
npm install -D @playwright/test
npx playwright install
```

**Critical user flows to test**:
1. **Search flow**: Open modal (Cmd+K) → type query → see results → click product → land on PDP
2. **Add to cart flow**: PDP → select variant → set quantity → add to cart → verify cart badge
3. **Checkout flow**: Cart → checkout → fill address → select payment → review → place order
4. **Auth flow**: Register → verify email → login → access account page
5. **Responsive**: Run all flows at 375px (mobile) and 1440px (desktop)

---

## Phase 8: Deployment

### 8.1 Pre-Deployment Checklist

- [ ] All mock data replaced with Supabase queries
- [ ] Environment variables set for production
- [ ] Supabase RLS policies tested (no data leaks)
- [ ] Payment gateway sandbox tested end-to-end
- [ ] Payment gateway switched from sandbox to production credentials
- [ ] `next build` passes with 0 errors and 0 warnings
- [ ] Domain purchased and DNS configured
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Analytics script added (Vercel Analytics, Google Analytics, or Plausible)
- [ ] Error tracking configured (Sentry)

### 8.2 Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Framework: Next.js (auto-detected)
# - Build: npm run build
# - Output: .next
```

**Environment variables in Vercel Dashboard:**

| Variable | Value | Visibility |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Public |
| `NEXT_PUBLIC_SITE_URL` | `https://gadgetbd.com` | Public |
| `NEXT_PUBLIC_SITE_NAME` | `GadgetBD` | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Secret (server only) |
| `SSLCOMMERZ_STORE_ID` | `...` | Secret |
| `SSLCOMMERZ_STORE_PASSWORD` | `...` | Secret |
| `BKASH_APP_KEY` | `...` | Secret |
| `BKASH_APP_SECRET` | `...` | Secret |
| `BKASH_USERNAME` | `...` | Secret |
| `BKASH_PASSWORD` | `...` | Secret |

### 8.3 Supabase Production Configuration

1. **Enable email confirmations**: Auth → Providers → Email → Confirm email ON
2. **Set redirect URLs**: Auth → URL Configuration → Add `https://gadgetbd.com/**`
3. **Custom SMTP** (recommended): Auth → SMTP Settings → Connect SendGrid, Resend, or Mailgun for reliable transactional email
4. **Database backups**: Supabase Pro plan includes daily backups. Verify they're enabled.
5. **Connection pooling**: Enable PgBouncer in Supabase dashboard under Database → Connection Pooling
6. **RLS audit**: Verify every table has RLS enabled. Check that no table is accidentally public-writable.

### 8.4 Custom Domain Setup

**On Vercel:**
1. Go to Project Settings → Domains
2. Add `gadgetbd.com` and `www.gadgetbd.com`
3. Vercel provides DNS records (A / CNAME)

**On your DNS provider:**
```
Type    Name    Value                   TTL
A       @       76.76.21.21             300
CNAME   www     cname.vercel-dns.com    300
```

### 8.5 CI/CD Pipeline

Vercel auto-deploys on every push to `main`. For additional safety:

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  e2e:
    needs: lint-and-build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

---

## Phase 9: Post-Launch

### 9.1 Monitoring & Observability

| Tool | Purpose | Setup |
|---|---|---|
| Vercel Analytics | Core Web Vitals, page views | `npm i @vercel/analytics` → add `<Analytics />` to layout |
| Vercel Speed Insights | Real user performance metrics | `npm i @vercel/speed-insights` → add `<SpeedInsights />` |
| Sentry | Error tracking, session replay | `npx @sentry/wizard@latest -i nextjs` |
| Supabase Dashboard | DB metrics, auth stats, API logs | Built-in, no setup needed |
| UptimeRobot / BetterStack | Uptime monitoring, alerts | Free tier available, ping every 5 min |

### 9.2 Email Notifications

Set up transactional emails for:
- Order confirmation (with order details, delivery estimate)
- Shipping update (when order status changes to `shipped`)
- Delivery confirmation
- Password reset
- Welcome email on registration

**Recommended service**: [Resend](https://resend.com/) (generous free tier, React email templates)

```bash
npm install resend @react-email/components
```

### 9.3 PWA Support (Optional)

Make the site installable on mobile:

```bash
npm install next-pwa
```

Add to `next.config.ts`:
```typescript
import withPWA from 'next-pwa'

const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})({
  // ... existing config
})
```

Create `public/manifest.json`:
```json
{
  "name": "GadgetBD",
  "short_name": "GadgetBD",
  "description": "Tech & Gadgets for Bangladesh",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAFAF9",
  "theme_color": "#1C1917",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### 9.4 Feature Roadmap (Future)

| Priority | Feature | Description |
|---|---|---|
| High | Wishlist sync | Persist wishlists to DB for logged-in users |
| High | Order tracking | Real-time order status page with timeline |
| High | Product reviews | Submit, moderate, display reviews with ratings |
| Medium | Category pages | Dedicated `/category/[slug]` with filtered browsing |
| Medium | Brand pages | Dedicated `/brand/[slug]` showcasing brand products |
| Medium | Related products | "You may also like" section on PDP |
| Medium | Recently viewed | Track and display recently viewed products |
| Medium | Inventory alerts | Email/SMS when out-of-stock items are restocked |
| Low | Compare products | Side-by-side spec comparison for 2-4 products |
| Low | Multi-language | Bengali (bn) language support with next-intl |
| Low | Affiliate system | Referral links with commission tracking |
| Low | Blog/Content | Tech reviews, buying guides for SEO |

---

## Quick Reference: Commands

```bash
# Development
npm run dev               # Start dev server (http://localhost:3000)
npm run build             # Production build
npm run start             # Start production server
npm run lint              # Run ESLint

# Supabase CLI
supabase start            # Start local Supabase (Docker)
supabase db push          # Push schema to remote
supabase db reset         # Reset local DB and re-apply migrations
supabase functions serve  # Serve Edge Functions locally
supabase functions deploy # Deploy Edge Functions

# Deployment
vercel                    # Deploy to Vercel
vercel --prod             # Deploy to production
vercel env pull           # Pull env vars to .env.local

# Testing (after setup)
npx vitest                # Run unit tests
npx vitest --watch        # Watch mode
npx playwright test       # Run E2E tests
npx playwright test --ui  # E2E tests with UI
```

---

## Priority Order (Suggested Sprint Plan)

| Sprint | Duration | Focus |
|---|---|---|
| **Sprint 1** | 1 week | Phase 1 (Supabase setup, seed data, replace mock data) |
| **Sprint 2** | 1 week | Phase 2 (Auth, cart sync, order submission) |
| **Sprint 3** | 1 week | Phase 3 (Payment gateways — start with COD + bKash) |
| **Sprint 4** | 1 week | Phase 5 (Images) + Phase 6 (SEO, performance, a11y) |
| **Sprint 5** | 1 week | Phase 7 (Testing) + Phase 8 (Deployment) |
| **Sprint 6** | 1 week | Phase 4 (Admin dashboard — MVP) |
| **Ongoing** | — | Phase 9 (Monitoring, email, PWA, feature roadmap) |

---

*This guide was generated based on the actual codebase state. Every file reference, mock data location, and integration gap was verified against the source code.*
