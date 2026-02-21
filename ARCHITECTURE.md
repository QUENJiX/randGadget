# GadgetBD — System Architecture & Technical Blueprint

> Next-generation Tech & Gadget E-Commerce Platform for the Bangladeshi Market

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Database Schema](#2-database-schema)
3. [UI/UX Layout Blueprint](#3-uiux-layout-blueprint)
4. [Animation & Asset Strategy](#4-animation--asset-strategy)
5. [Checkout Flow Logic](#5-checkout-flow-logic)
6. [Design System](#6-design-system)
7. [Technical Stack & Rationale](#7-technical-stack--rationale)
8. [File Structure](#8-file-structure)

---

## 1. System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  Next.js App Router  ·  React 19  ·  Framer Motion  ·  Zustand │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌───────────────────┐ │
│  │ SSR/SSG  │ │ CSR Pages │ │ Stores   │ │ Service Workers   │ │
│  │ Pages    │ │ (dynamic) │ │ (client) │ │ (offline/cache)   │ │
│  └──────────┘ └───────────┘ └──────────┘ └───────────────────┘ │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS / WebSocket
┌──────────────────────▼──────────────────────────────────────────┐
│                     EDGE / MIDDLEWARE LAYER                      │
│  Next.js Middleware (Auth session refresh, geo-detection)        │
│  Supabase SSR cookie-based auth (no localStorage tokens)        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                      BACKEND SERVICES                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Supabase Platform                      │   │
│  │  ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │ PostgreSQL │ │ Auth     │ │ Storage  │ │ Realtime │  │   │
│  │  │ + pg_trgm  │ │ (GoTrue)│ │ (S3)     │ │ (WS)     │  │   │
│  │  │ + FTS      │ │         │ │          │ │          │  │   │
│  │  └────────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  │  ┌────────────┐ ┌──────────────────────────────────────┐ │   │
│  │  │ Edge Fns   │ │ Row Level Security (RLS)             │ │   │
│  │  │ (Deno)     │ │ Policy-based access control          │ │   │
│  │  └────────────┘ └──────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                   PAYMENT GATEWAYS (BD)                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────────┐  │
│  │  bKash  │  │  Nagad  │  │ Rocket  │  │   SSLCommerz     │  │
│  │  API    │  │  API    │  │ API     │  │ (Card gateway)   │  │
│  └─────────┘  └─────────┘  └─────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Rendering Strategy

| Route             | Strategy    | Rationale                                    |
| ----------------- | ----------- | -------------------------------------------- |
| `/`               | SSG + ISR   | Landing page — static with 60s revalidation  |
| `/search`         | CSR         | Dynamic filters, user-driven queries         |
| `/product/[slug]` | SSG + ISR   | SEO-critical, revalidated on stock changes   |
| `/cart`           | CSR         | Purely client-side (Zustand persisted store) |
| `/checkout`       | CSR + SSR   | Auth-gated, server-validated                 |
| `/account`        | CSR + SSR   | Auth-gated, session-dependent                |

### State Management Architecture

```
┌────────────────────────────────────────────┐
│              Zustand Stores                │
│                                            │
│  useCartStore ──── localStorage persist    │
│  ├─ items: CartItem[]                      │
│  ├─ addItem() / removeItem()               │
│  ├─ updateQuantity()                       │
│  ├─ getSubtotal() / getItemCount()         │
│  └─ clearCart()                            │
│                                            │
│  useCheckoutStore ──── session-only        │
│  ├─ step: 1 | 2 | 3                       │
│  ├─ address / paymentMethod / deliveryZone │
│  └─ setStep() / setAddress() / reset()     │
│                                            │
│  useSearchStore ──── session-only          │
│  ├─ isOpen: boolean                        │
│  ├─ query: string                          │
│  └─ open() / close() / setQuery()          │
└────────────────────────────────────────────┘
```

### Authentication Flow

```
Browser ──POST credentials──▶ Supabase Auth (GoTrue)
                                    │
                              ◀── Set httpOnly cookie
                                    │
Middleware intercepts ──▶ Refresh session cookie on every request
                                    │
Server Components ──▶ Read cookie via createServerClient()
                                    │
Client Components ──▶ Read cookie via createBrowserClient()
```

---

## 2. Database Schema

### Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  divisions   │────▶│  districts   │────▶│   upazilas   │
│  (8 divs)    │ 1:N │              │ 1:N │              │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │ M:N
                                          ┌───────▼───────┐
┌──────────────┐                          │upazila_zone_map│
│delivery_zones│◀─────────────────────────│               │
│  (4 zones)   │                          └───────────────┘
└──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   profiles   │────▶│  addresses   │     │   wishlists  │
│ (auth.users) │ 1:N │  (BD geo)    │     │              │
└──────┬───────┘     └──────────────┘     └──────────────┘
       │ 1:N
┌──────▼───────┐     ┌──────────────┐     ┌──────────────┐
│    orders    │────▶│ order_items  │     │   reviews    │
│              │ 1:N │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  categories  │     │   products   │────▶│product_images│
│  (tree)      │     │  + FTS vec   │ 1:N │              │
└──────────────┘     │  + trgm idx  │     └──────────────┘
                     └──────┬───────┘     ┌──────────────┐
                            │────────────▶│product_       │
                            │         1:N │ variants     │
                            │             └──────────────┘
                     ┌──────▼───────┐
                     │    carts     │────▶ cart_items
                     └──────────────┘
```

### Key Design Decisions

1. **Bangladesh Geography**: 3-tier system (Division → District → Upazila) seeded with all 8 divisions. Delivery zones map upazilas to pricing tiers.

2. **Search Architecture**: Dual-layer search combining PostgreSQL full-text search (tsvector) with trigram similarity (pg_trgm). The `search_products()` RPC function returns results ranked by combined relevance score.

3. **Row Level Security**: Every table uses RLS. Customers can only read their own orders/cart/addresses. Products/categories are publicly readable. Write operations are restricted to authenticated users with matching `auth.uid()`.

4. **Order Number Generation**: Trigger-based sequential order numbers formatted as `GBD-YYYYMMDD-XXXXX` for customer-friendly references.

5. **Delivery Zone Pricing**:
   - Inside Dhaka: ৳60 (free over ৳5,000), 1-2 days
   - Dhaka Suburb: ৳80, 2-3 days
   - Outside Dhaka: ৳120, 3-5 days
   - Remote Areas: ৳150, 5-7 days

---

## 3. UI/UX Layout Blueprint

### Page Architecture

#### Landing Page (/)

```
┌──────────────────────────────────────────────────────────┐
│ HEADER: Announcement bar + Nav + Search/Cart actions     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  HERO SECTION                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Full-viewport parallax hero                        │  │
│  │ Animated eyebrow badge → Headline → Subtitle       │  │
│  │ Dual CTAs: [Browse Collection] [Today's Deals]     │  │
│  │ 3 Trust signal cards at bottom                     │  │
│  │ Scroll indicator with bounce animation             │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  CATEGORY BENTO GRID                                     │
│  ┌──────────┬──────────┬──────────┐                      │
│  │          │ Laptops  │  Audio   │                      │
│  │ Smart-   │          │          │                      │
│  │ phones   ├──────────┼──────────┤                      │
│  │ (2x2)    │Wearables │Accesso- │                      │
│  │          │          │ries     │                      │
│  └──────────┴──────────┴──────────┘                      │
│                                                          │
│  FEATURED SHOWCASE                                       │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Editorial alternating rows (image left/right)      │  │
│  │ Product 1: Image LEFT  ←→  Details RIGHT           │  │
│  │ Product 2: Details LEFT ←→  Image RIGHT            │  │
│  │ Product 3: Image LEFT  ←→  Details RIGHT           │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  DEALS STRIP (dark accent background)                    │
│  ┌──────┬──────┬──────┬──────┐                           │
│  │ 40%  │ 25%  │ 30%  │ 50%  │  4 deal cards            │
│  └──────┴──────┴──────┴──────┘                           │
│                                                          │
│  WHY GADGETBD (6-card grid)                              │
│  ┌────┬────┬────┐                                        │
│  │Fast│Pay │War-│  6 Bangladesh-specific value props     │
│  │Del │Mthd│rnty│                                        │
│  ├────┼────┼────┤                                        │
│  │Ret │Sup │Zon │                                        │
│  │urn │port│es  │                                        │
│  └────┴────┴────┘                                        │
│                                                          │
│  NEWSLETTER CTA                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Grid pattern BG + Email input + Subscribe button   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ FOOTER: Links + Payment badges + Contact                 │
└──────────────────────────────────────────────────────────┘
```

#### Search Modal (Cmd+K)

```
┌──────────────────────────────────────────┐
│  ┌─ Search Input ─────────────────────┐  │
│  │ 🔍 Search tech, gadgets...    ESC  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌─ No Query State ──────────────────┐  │
│  │ Recent Searches (Clock icons)     │  │
│  │ Trending Searches (Trend icons)   │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌─ Results State ───────────────────┐  │
│  │ Product cards with image, price,  │  │
│  │ category, discount badge          │  │
│  │ ← / → keyboard nav hints         │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌─ Loading State ───────────────────┐  │
│  │ 3x skeleton shimmer cards         │  │
│  └───────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

#### Product Detail Page (/product/[slug])

```
┌──────────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Category > Product Name               │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────┐  ┌──────────────────────────────┐  │
│  │                  │  │ Product Title                 │  │
│  │  Main Image      │  │ ★★★★☆ (128 reviews)         │  │
│  │  (large)         │  │                              │  │
│  │                  │  │ ৳129,999  ̶৳̶1̶4̶9̶,̶9̶9̶9̶  -13%  │  │
│  │                  │  │                              │  │
│  ├──┬──┬──┬────────┤  │ Variant: [128GB][256GB][1TB]  │  │
│  │T1│T2│T3│T4      │  │                              │  │
│  │  │  │  │(thumbs)│  │ Qty: [-] 1 [+]               │  │
│  └──┴──┴──┴────────┘  │                              │  │
│                        │ [Add to Cart]  [Buy Now]      │  │
│                        │                              │  │
│                        │ ✓ Auth warranty  ✓ Free ship  │  │
│                        │ ✓ 7-day return               │  │
│                        └──────────────────────────────┘  │
│                                                          │
│  ┌─ Tabs ────────────────────────────────────────────┐  │
│  │ [Specifications] [Description] [Reviews]           │  │
│  │                                                    │  │
│  │  Specifications: Key-value table                   │  │
│  │  Description: Rich text content                    │  │
│  │  Reviews: Star breakdown + user reviews            │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

#### Checkout Flow (/checkout)

```
Step Indicator:  ①─────②─────③
                 Address  Payment  Review

┌──────────────────────────────────────────────────────────┐
│  ┌─ Main Content (8 cols) ────────────────────────────┐  │
│  │                                                    │  │
│  │  Step 1: Shipping Address                          │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │ Full Name           Phone (+880)             │  │  │
│  │  │ Division [dropdown] District [cascading]     │  │  │
│  │  │ Upazila [cascading]                          │  │  │
│  │  │ Street Address (textarea)                    │  │  │
│  │  │ 🚚 Delivery Zone: Inside Dhaka - ৳60        │  │  │
│  │  │    Estimated: 1-2 business days              │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  Step 2: Payment Method                            │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │ ◉ Cash on Delivery                           │  │  │
│  │  │ ○ bKash                                      │  │  │
│  │  │ ○ Nagad                                      │  │  │
│  │  │ ○ Rocket                                     │  │  │
│  │  │ ○ Card (SSLCommerz)                          │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  Step 3: Order Review                              │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │ Address summary + Payment summary            │  │  │
│  │  │ Order items list                             │  │  │
│  │  │ [Place Order] button                         │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Sidebar (4 cols) ────────────────────────────────┐  │
│  │ Order Summary (sticky)                            │  │
│  │ Subtotal: ৳XX,XXX                                 │  │
│  │ Delivery: ৳XX                                     │  │
│  │ Coupon: [________] [Apply]                        │  │
│  │ ────────────────────                              │  │
│  │ Total: ৳XX,XXX                                    │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Header Behavior

- **Scroll-aware**: Transparent at top (hero visible through), transitions to frosted-glass blur after 50px scroll
- **Desktop**: Full nav with 5 category links + expandable "More" dropdown
- **Mobile**: Hamburger triggers full-height slide-in panel with AnimatePresence
- **Action Cluster**: Search (opens modal), Wishlist, Account, Cart (live badge count from Zustand)

### Responsive Breakpoints

| Breakpoint | Width    | Layout Changes                           |
| ---------- | -------- | ---------------------------------------- |
| Mobile     | < 640px  | Single column, hamburger nav, stacked    |
| Tablet     | 640-1024 | 2-column grids, condensed nav            |
| Desktop    | > 1024   | Full layout, sidebar checkout, bento grid|

---

## 4. Animation & Asset Strategy

### Animation Philosophy

All animations are GPU-accelerated (transform/opacity only), respect `prefers-reduced-motion`, and use Framer Motion's variant system for consistency.

### Easing Curves

| Name   | Value                    | Use Case                |
| ------ | ------------------------ | ----------------------- |
| smooth | [0.25, 0.46, 0.45, 0.94] | General transitions    |
| snappy | [0.6, 0.05, 0.01, 0.9]   | Interactive feedback   |
| bounce | [0.68, -0.55, 0.265, 1.55] | Playful elements     |
| gentle | [0.4, 0, 0.2, 1]         | Page transitions       |

### Animation Inventory

| Animation       | Trigger          | Duration | Properties             |
| --------------- | ---------------- | -------- | ---------------------- |
| fadeIn           | Scroll reveal    | 0.5s     | opacity 0→1            |
| fadeUp           | Scroll reveal    | 0.5s     | opacity + y: 30→0      |
| fadeDown         | Scroll reveal    | 0.5s     | opacity + y: -30→0     |
| scaleIn          | Mount            | 0.5s     | scale 0.8→1 + opacity  |
| slideInLeft      | Mount            | 0.5s     | x: -60→0 + opacity     |
| slideInRight     | Mount            | 0.5s     | x: 60→0 + opacity      |
| staggerContainer | Parent group     | varies   | staggerChildren: 0.08s |
| cardHover        | Hover            | 0.3s     | y: -8, scale: 1.02     |
| buttonPress      | Tap              | 0.1s     | scale: 0.97            |
| textReveal       | Scroll reveal    | 0.7s     | clipPath wipe + y      |
| bentoItem        | Scroll reveal    | 0.5s     | scale 0.95→1 + opacity |
| searchModal      | Toggle           | 0.3s     | opacity + scale 0.96→1 |
| mobileMenu       | Toggle           | 0.3s     | x: 100%→0             |
| pageTransition   | Route change     | 0.4s     | opacity + y: 10→0      |
| navbarSlide      | Mount            | 0.5s     | y: -20→0 + opacity     |

### Parallax Effects

- **Hero Section**: `useScroll` + `useTransform` — background parallax (y offset), opacity fade on scroll, subtle scale zoom
- **Featured Showcase**: Image panels parallax at 0.5x scroll speed relative to text

### Performance Constraints

1. All animations use `transform` and `opacity` only (composite-only properties)
2. `will-change: transform` applied sparingly via Framer Motion's `layout` prop
3. Intersection Observer via `whileInView` — animations only trigger when element enters viewport
4. `viewport={{ once: true }}` — animations fire once, not on every scroll
5. Spring physics used for interactive elements (snappier feel than duration-based)

### Asset Strategy

- **Icons**: Lucide React — tree-shakeable SVG icons, no icon fonts
- **Fonts**: Geist (sans) + Geist Mono — loaded via `next/font/google` with `swap` display
- **Images**: Next.js `<Image>` component with:
  - Automatic WebP/AVIF conversion
  - Responsive `srcSet` generation
  - Lazy loading by default
  - Blur placeholder for LCP images
- **No 3D, no emojis, no purple gradients** — per design constraints

---

## 5. Checkout Flow Logic

### State Machine

```
┌──────────┐   validate    ┌──────────┐   validate    ┌──────────┐
│  Step 1  │──────────────▶│  Step 2  │──────────────▶│  Step 3  │
│ Address  │◀──────────────│ Payment  │◀──────────────│  Review  │
│          │     back      │          │     back      │          │
└──────────┘               └──────────┘               └────┬─────┘
                                                           │
                                                      Place Order
                                                           │
                                                     ┌─────▼─────┐
                                                     │  Process   │
                                                     │  Payment   │
                                                     └─────┬─────┘
                                                           │
                                              ┌────────────┼────────────┐
                                              │            │            │
                                         ┌────▼────┐  ┌───▼────┐  ┌───▼────┐
                                         │  COD    │  │ MFS    │  │ Card   │
                                         │ Direct  │  │ Redirect│  │ SSL    │
                                         │ confirm │  │ to app │  │ Commrz │
                                         └────┬────┘  └───┬────┘  └───┬────┘
                                              │           │            │
                                              └───────────┼────────────┘
                                                          │
                                                    ┌─────▼─────┐
                                                    │  Order    │
                                                    │ Confirmed │
                                                    └───────────┘
```

### Step 1: Address Validation Rules

```typescript
{
  fullName:    required, minLength(2)
  phone:       required, matches /^(\+880|0)1[3-9]\d{8}$/  // BD mobile format
  division:    required, from divisions table
  district:    required, cascading from selected division
  upazila:     required, cascading from selected district
  street:      required, minLength(5)
}
```

### Step 2: Payment Methods

| Method     | Type               | Flow                                 |
| ---------- | ------------------ | ------------------------------------ |
| COD        | Cash on Delivery   | No redirect, direct order creation   |
| bKash      | Mobile Financial   | Redirect to bKash payment page       |
| Nagad      | Mobile Financial   | Redirect to Nagad payment page       |
| Rocket     | Mobile Financial   | Redirect to Rocket payment page      |
| SSLCommerz | Card/Bank          | Redirect to SSLCommerz gateway       |

### Delivery Charge Calculation

```typescript
function calculateDelivery(zone: DeliveryZone, subtotal: number) {
  const ZONES = {
    'inside_dhaka':  { charge: 60,  freeAbove: 5000, days: '1-2' },
    'dhaka_suburb':  { charge: 80,  freeAbove: null,  days: '2-3' },
    'outside_dhaka': { charge: 120, freeAbove: null,  days: '3-5' },
    'remote':        { charge: 150, freeAbove: null,  days: '5-7' },
  };

  const config = ZONES[zone];
  const isFree = config.freeAbove && subtotal >= config.freeAbove;

  return {
    charge: isFree ? 0 : config.charge,
    estimatedDays: config.days,
    freeDeliveryNote: isFree
      ? 'Free delivery on orders over ৳5,000'
      : config.freeAbove
        ? `Free delivery on orders over ৳${config.freeAbove}`
        : null
  };
}
```

### Order Processing Sequence

```
1. Client validates all 3 steps are complete
2. Client calls Supabase Edge Function: create_order()
3. Edge Function:
   a. Verify cart items still in stock
   b. Lock inventory (SELECT FOR UPDATE)
   c. Calculate final pricing server-side
   d. Create order + order_items records
   e. Decrement product stock
   f. Generate order number (trigger: GBD-YYYYMMDD-XXXXX)
   g. If COD → return order confirmation
   h. If MFS/Card → initiate payment gateway session → return redirect URL
4. Client redirects to payment gateway (if applicable)
5. Payment gateway callback → Edge Function verifies → updates order status
6. Client redirected to order confirmation page
```

---

## 6. Design System

### Color Palette

```css
/* Light Mode */
--color-bg:       #FAFAF9    /* Warm off-white */
--color-surface:  #FFFFFF
--color-border:   #E7E5E4
--color-text:     #1C1917    /* Near-black warm */
--color-muted:    #78716C
--color-accent:   #1C1917    /* Obsidian */
--color-accent-fg:#FAFAF9    /* Contrast text on accent */

/* Dark Mode */
--color-bg:       #0C0A09
--color-surface:  #1C1917
--color-border:   #292524
--color-text:     #FAFAF9
--color-muted:    #A8A29E
--color-accent:   #F5F5F4
--color-accent-fg:#0C0A09
```

### Typography Scale (Fluid)

```css
h1: clamp(2rem, 5vw, 3.5rem)     /* Hero headlines */
h2: clamp(1.5rem, 3vw, 2.25rem)  /* Section titles */
h3: clamp(1.25rem, 2vw, 1.5rem)  /* Card titles */
h4: clamp(1rem, 1.5vw, 1.25rem)  /* Subsections */
body: 1rem (16px)                  /* Base */
small: 0.875rem (14px)            /* Captions */
```

### Spacing System

8px base grid: `--space-1` (0.25rem) through `--space-16` (4rem)

### Component Tokens

```css
--radius-sm:   0.375rem
--radius-md:   0.5rem
--radius-lg:   0.75rem
--radius-xl:   1rem
--radius-2xl:  1.5rem
--radius-full: 9999px

--shadow-sm:   0 1px 2px rgba(0,0,0,0.05)
--shadow-md:   0 4px 6px -1px rgba(0,0,0,0.07)
--shadow-lg:   0 10px 15px -3px rgba(0,0,0,0.08)
--shadow-xl:   0 20px 25px -5px rgba(0,0,0,0.1)
```

### Glass Morphism Utility

```css
.glass {
  backdrop-filter: blur(12px) saturate(180%);
  background: rgba(255, 255, 255, 0.7);       /* light */
  background: rgba(28, 25, 23, 0.7);           /* dark */
}
```

---

## 7. Technical Stack & Rationale

| Technology      | Version  | Purpose                           | Why Chosen                                    |
| --------------- | -------- | --------------------------------- | --------------------------------------------- |
| Next.js         | 16.1.6   | Framework                         | App Router, SSR/SSG, API routes, edge runtime |
| React           | 19.x     | UI Library                        | Server Components, Suspense, transitions      |
| TypeScript      | 5.x      | Type Safety                       | End-to-end type safety with Supabase          |
| Supabase        | 2.97.0   | BaaS                              | PostgreSQL + Auth + Storage + Realtime + Edge |
| Tailwind CSS    | 4.x      | Styling                           | Utility-first, tree-shaking, design tokens    |
| Framer Motion   | 12.34.3  | Animation                         | Declarative, spring physics, layout anim      |
| Zustand         | 5.0.11   | Client State                      | Minimal, no boilerplate, persist middleware   |
| Lucide React    | 0.575.0  | Icons                             | Tree-shakeable, consistent, no icon fonts     |
| Geist Font      | —        | Typography                        | Vercel's system font, clean and modern        |

---

## 8. File Structure

```
d:\website\
├── supabase/
│   └── schema.sql                    # Complete PostgreSQL schema + seeds
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout (fonts, header, footer)
│   │   ├── page.tsx                  # Landing page (6 sections)
│   │   ├── globals.css               # Design tokens + utilities
│   │   ├── search/page.tsx           # Search results with filters
│   │   ├── product/[slug]/page.tsx   # Product detail page
│   │   ├── cart/page.tsx             # Shopping cart
│   │   ├── checkout/page.tsx         # 3-step checkout
│   │   └── account/page.tsx          # Auth (login/register)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx            # Scroll-aware navbar
│   │   │   ├── footer.tsx            # Links + payment badges
│   │   │   └── page-transition.tsx   # Route transition wrapper
│   │   ├── home/
│   │   │   ├── hero-section.tsx      # Full-viewport parallax hero
│   │   │   ├── category-bento.tsx    # Bento grid categories
│   │   │   ├── featured-showcase.tsx # Editorial product rows
│   │   │   ├── deals-strip.tsx       # Dark deals section
│   │   │   ├── why-gadgetbd.tsx      # Value proposition cards
│   │   │   └── newsletter-cta.tsx    # Email capture CTA
│   │   ├── search/
│   │   │   ├── search-modal.tsx      # Cmd+K search overlay
│   │   │   └── search-results.tsx    # Filter sidebar + grid
│   │   ├── products/
│   │   │   ├── product-card.tsx      # Card with hover actions
│   │   │   └── product-detail.tsx    # Full PDP component
│   │   ├── checkout/
│   │   │   └── checkout-flow.tsx     # 3-step checkout process
│   │   ├── cart/
│   │   │   └── cart-view.tsx         # Cart items + summary
│   │   └── auth/
│   │       └── auth-form.tsx         # Login/register/guest
│   ├── lib/
│   │   ├── types.ts                  # All TypeScript interfaces
│   │   ├── store.ts                  # Zustand stores (cart/checkout/search)
│   │   ├── animations.ts            # Framer Motion presets
│   │   ├── utils.ts                  # Helpers (price format, debounce, etc.)
│   │   └── supabase/
│   │       ├── client.ts             # Browser Supabase client
│   │       ├── server.ts             # Server Supabase client
│   │       └── middleware.ts         # Session refresh logic
│   └── middleware.ts                 # Next.js request middleware
├── .env.local.example                # Environment variables template
├── package.json
├── tsconfig.json
├── next.config.ts
└── ARCHITECTURE.md                   # This document
```

---

## Next Steps (Post-Foundation)

1. **Supabase Integration**: Replace all mock data with live Supabase queries
2. **Payment Gateway APIs**: Implement server-side routes for bKash, Nagad, SSLCommerz
3. **Image Pipeline**: Set up Supabase Storage for product images with CDN
4. **Admin Dashboard**: Product management, order processing, analytics
5. **PWA Support**: Service worker for offline browsing, push notifications
6. **Performance Monitoring**: Core Web Vitals tracking, error boundaries
7. **Testing**: Playwright E2E tests for checkout flow, Jest unit tests for utilities
8. **Deployment**: Vercel (frontend) + Supabase (backend) with CI/CD pipeline
