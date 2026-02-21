-- ============================================================================
-- GADGETBD: Add admin role to profiles + admin RLS policies
-- Run in Supabase SQL Editor
-- ============================================================================

-- 1. Add role column to profiles (default 'customer')
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer'
  CHECK (role IN ('customer', 'admin'));

-- 2. RLS: admins can read all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 3. RLS: admins can read all orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 4. RLS: admins can update orders (status changes)
CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 5. RLS for coupons — admins full CRUD
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage coupons"
  ON coupons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Anyone can read active coupons"
  ON coupons FOR SELECT
  USING (is_active = true);

-- 6. RLS for products — admins can INSERT/UPDATE/DELETE
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 7. RLS for categories — admins can manage
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 8. To promote a user to admin, run:
-- UPDATE profiles SET role = 'admin' WHERE id = 'USER_UUID_HERE';
