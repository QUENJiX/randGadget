-- ============================================================================
-- GADGETBD: Tech & Gadget E-Commerce — Supabase PostgreSQL Schema
-- ============================================================================
-- Designed for the Bangladeshi market with localized geography, payment
-- gateways (bKash, Nagad, Rocket, SSLCommerz, COD), and a guest-friendly
-- checkout flow.
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- trigram fuzzy search
CREATE EXTENSION IF NOT EXISTS "unaccent";  -- accent-insensitive search

-- ============================================================================
-- 1. GEOGRAPHY (Bangladesh-specific)
-- ============================================================================

CREATE TABLE divisions (
  id    SERIAL PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE,           -- e.g. "Dhaka", "Chattogram"
  bn_name TEXT                            -- Bengali name
);

CREATE TABLE districts (
  id          SERIAL PRIMARY KEY,
  division_id INT NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  bn_name     TEXT,
  UNIQUE (division_id, name)
);

CREATE TABLE upazilas (
  id          SERIAL PRIMARY KEY,
  district_id INT NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  bn_name     TEXT,
  UNIQUE (district_id, name)
);

CREATE TABLE delivery_zones (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,       -- "Inside Dhaka", "Outside Dhaka", "Dhaka Suburb"
  base_charge NUMERIC(10,2) NOT NULL DEFAULT 0,
  per_kg      NUMERIC(10,2) NOT NULL DEFAULT 0,
  est_days    INT NOT NULL DEFAULT 3
);

CREATE TABLE upazila_zone_map (
  upazila_id      INT NOT NULL REFERENCES upazilas(id) ON DELETE CASCADE,
  delivery_zone_id INT NOT NULL REFERENCES delivery_zones(id) ON DELETE CASCADE,
  PRIMARY KEY (upazila_id)
);


-- ============================================================================
-- 2. USER PROFILES (extends Supabase Auth)
-- ============================================================================

CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  phone      TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE addresses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,  -- nullable for guest
  label           TEXT DEFAULT 'Home',                              -- Home / Office / Other
  full_name       TEXT NOT NULL,
  phone           TEXT NOT NULL,
  division_id     INT REFERENCES divisions(id),
  district_id     INT REFERENCES districts(id),
  upazila_id      INT REFERENCES upazilas(id),
  street_address  TEXT NOT NULL,
  postal_code     TEXT,
  is_default      BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================================
-- 3. PRODUCT CATALOG
-- ============================================================================

CREATE TABLE brands (
  id    SERIAL PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE,
  slug  TEXT NOT NULL UNIQUE,
  logo_url TEXT
);

CREATE TABLE categories (
  id        SERIAL PRIMARY KEY,
  parent_id INT REFERENCES categories(id) ON DELETE SET NULL,
  name      TEXT NOT NULL,
  slug      TEXT NOT NULL UNIQUE,
  icon_svg  TEXT,                        -- inline SVG string for category icon
  sort_order INT DEFAULT 0
);

CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku             TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  brand_id        INT REFERENCES brands(id) ON DELETE SET NULL,
  category_id     INT REFERENCES categories(id) ON DELETE SET NULL,
  short_desc      TEXT,
  description     TEXT,                   -- rich markdown/HTML
  price           NUMERIC(12,2) NOT NULL,
  compare_price   NUMERIC(12,2),          -- strike-through price
  cost_price      NUMERIC(12,2),
  stock           INT NOT NULL DEFAULT 0,
  weight_kg       NUMERIC(6,3) DEFAULT 0,
  is_featured     BOOLEAN DEFAULT false,
  is_active       BOOLEAN DEFAULT true,
  meta_title      TEXT,
  meta_description TEXT,
  tags            TEXT[] DEFAULT '{}',
  specs           JSONB DEFAULT '{}',     -- {"RAM": "8GB", "Storage": "256GB"}
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_images (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt_text   TEXT,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT false
);

CREATE TABLE product_variants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,              -- e.g. "Midnight Black / 256GB"
  sku         TEXT UNIQUE NOT NULL,
  price       NUMERIC(12,2) NOT NULL,
  stock       INT NOT NULL DEFAULT 0,
  attributes  JSONB DEFAULT '{}',         -- {"color":"black","storage":"256GB"}
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================================
-- 4. SEARCH (trigram indexes for fuzzy search + full-text)
-- ============================================================================

-- GIN trigram index on product name for fuzzy matching
CREATE INDEX idx_products_name_trgm ON products USING gin (name gin_trgm_ops);
CREATE INDEX idx_products_tags ON products USING gin (tags);

-- Full-text search vector
ALTER TABLE products ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(short_desc, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C')
  ) STORED;

CREATE INDEX idx_products_search ON products USING gin (search_vector);


-- ============================================================================
-- 5. CART (supports guest + authenticated)
-- ============================================================================

CREATE TABLE carts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,    -- null = guest
  session_id  TEXT,                                                 -- for guest identification
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id     UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id  UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity    INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cart_id, product_id, variant_id)
);


-- ============================================================================
-- 6. ORDERS & CHECKOUT (Bangladeshi payment methods)
-- ============================================================================

CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'returned'
);

CREATE TYPE payment_method AS ENUM (
  'cod',           -- Cash on Delivery
  'bkash',         -- bKash MFS
  'nagad',         -- Nagad MFS
  'rocket',        -- Rocket MFS
  'sslcommerz',    -- SSLCommerz gateway (cards, net banking)
  'amarpay'        -- AmarPay gateway
);

CREATE TYPE payment_status AS ENUM (
  'unpaid',
  'pending',
  'paid',
  'failed',
  'refunded'
);

CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT UNIQUE NOT NULL,   -- human-readable: GBD-20260221-XXXX
  user_id         UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_email     TEXT,
  guest_phone     TEXT,

  -- Shipping address (snapshot at order time)
  shipping_name        TEXT NOT NULL,
  shipping_phone       TEXT NOT NULL,
  shipping_division    TEXT NOT NULL,
  shipping_district    TEXT NOT NULL,
  shipping_upazila     TEXT NOT NULL,
  shipping_street      TEXT NOT NULL,
  shipping_postal_code TEXT,
  delivery_zone_id     INT REFERENCES delivery_zones(id),

  -- Financials
  subtotal            NUMERIC(12,2) NOT NULL,
  delivery_charge     NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount            NUMERIC(10,2) NOT NULL DEFAULT 0,
  total               NUMERIC(12,2) NOT NULL,

  -- Payment
  payment_method      payment_method NOT NULL DEFAULT 'cod',
  payment_status      payment_status NOT NULL DEFAULT 'unpaid',
  payment_tx_id       TEXT,               -- transaction ID from gateway

  -- Status
  status              order_status NOT NULL DEFAULT 'pending',
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id  UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,              -- snapshot
  price       NUMERIC(12,2) NOT NULL,     -- snapshot
  quantity    INT NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================================
-- 7. COUPONS
-- ============================================================================

CREATE TABLE coupons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  discount_type   TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value  NUMERIC(10,2) NOT NULL,
  min_order       NUMERIC(12,2) DEFAULT 0,
  max_discount    NUMERIC(10,2),
  usage_limit     INT,
  used_count      INT DEFAULT 0,
  starts_at       TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================================
-- 8. REVIEWS
-- ============================================================================

CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  body        TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================================
-- 9. WISHLIST
-- ============================================================================

CREATE TABLE wishlists (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);


-- ============================================================================
-- 10. ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "Users can view own profile"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Addresses: users can CRUD their own
CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);

-- Orders: users can view their own
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- Wishlists: users can manage their own
CREATE POLICY "Users can manage wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);

-- Reviews: anyone can read, users can create/update own
CREATE POLICY "Anyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Products & categories are public read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read images" ON product_images FOR SELECT USING (true);


-- ============================================================================
-- 11. SEED DATA: Bangladesh Geography  
-- ============================================================================

INSERT INTO divisions (name, bn_name) VALUES
  ('Dhaka', 'ঢাকা'),
  ('Chattogram', 'চট্টগ্রাম'),
  ('Rajshahi', 'রাজশাহী'),
  ('Khulna', 'খুলনা'),
  ('Barishal', 'বরিশাল'),
  ('Sylhet', 'সিলেট'),
  ('Rangpur', 'রংপুর'),
  ('Mymensingh', 'ময়মনসিংহ');

INSERT INTO delivery_zones (name, base_charge, per_kg, est_days) VALUES
  ('Inside Dhaka',   60.00,  10.00, 1),
  ('Dhaka Suburb',   80.00,  15.00, 2),
  ('Outside Dhaka', 120.00,  20.00, 3),
  ('Remote Area',   180.00,  30.00, 5);


-- ============================================================================
-- 12. HELPER FUNCTIONS
-- ============================================================================

-- Generate human-readable order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'GBD-' || to_char(now(), 'YYYYMMDD') || '-' || 
    upper(substr(encode(gen_random_bytes(3), 'hex'), 1, 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- Fuzzy product search function
CREATE OR REPLACE FUNCTION search_products(
  search_query TEXT,
  category_slug TEXT DEFAULT NULL,
  brand_slug TEXT DEFAULT NULL,
  min_price NUMERIC DEFAULT NULL,
  max_price NUMERIC DEFAULT NULL,
  sort_by TEXT DEFAULT 'relevance',
  page_size INT DEFAULT 20,
  page_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  price NUMERIC,
  compare_price NUMERIC,
  short_desc TEXT,
  brand_name TEXT,
  category_name TEXT,
  primary_image TEXT,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id, p.name, p.slug, p.price, p.compare_price, p.short_desc,
    b.name AS brand_name,
    c.name AS category_name,
    (SELECT pi.url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1) AS primary_image,
    GREATEST(
      ts_rank(p.search_vector, websearch_to_tsquery('english', search_query)),
      similarity(p.name, search_query)
    ) AS relevance
  FROM products p
  LEFT JOIN brands b ON p.brand_id = b.id
  LEFT JOIN categories c ON p.category_id = c.id
  WHERE p.is_active = true
    AND (
      search_query IS NULL
      OR search_query = ''
      OR p.search_vector @@ websearch_to_tsquery('english', search_query)
      OR similarity(p.name, search_query) > 0.15
    )
    AND (category_slug IS NULL OR c.slug = category_slug)
    AND (brand_slug IS NULL OR b.slug = brand_slug)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
  ORDER BY
    CASE WHEN sort_by = 'relevance' THEN
      GREATEST(
        ts_rank(p.search_vector, websearch_to_tsquery('english', COALESCE(NULLIF(search_query, ''), 'a'))),
        similarity(p.name, COALESCE(search_query, ''))
      )
    END DESC NULLS LAST,
    CASE WHEN sort_by = 'price_asc' THEN p.price END ASC,
    CASE WHEN sort_by = 'price_desc' THEN p.price END DESC,
    CASE WHEN sort_by = 'newest' THEN p.created_at END DESC,
    p.created_at DESC
  LIMIT page_size OFFSET page_offset;
END;
$$ LANGUAGE plpgsql;
