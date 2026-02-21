-- ============================================================================
-- GADGETBD: Add admin role to profiles + admin RLS policies
-- Run in Supabase SQL Editor
-- ============================================================================

-- 1. Add role column to profiles (default 'customer')
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer'
  CHECK (role IN ('customer', 'admin'));

-- 2. Helper function: check if the current user is an admin.
--    SECURITY DEFINER bypasses RLS, avoiding infinite recursion when admin
--    policies on other tables query the profiles table.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 3. RLS: admins can read all profiles (uses is_admin() to avoid recursion)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- 4. RLS: admins can read all orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (is_admin());

-- 5. RLS: admins can update orders (status changes)
CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (is_admin());

-- 6. RLS for coupons — admins full CRUD
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage coupons"
  ON coupons FOR ALL
  USING (is_admin());

CREATE POLICY "Anyone can read active coupons"
  ON coupons FOR SELECT
  USING (is_active = true);

-- 7. RLS for products — admins can INSERT/UPDATE/DELETE
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (is_admin());

-- 8. RLS for categories — admins can manage
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (is_admin());

-- 9. RLS for product_images — admins can manage
CREATE POLICY "Admins can manage product images"
  ON product_images FOR ALL
  USING (is_admin());

-- 10. RLS for brands — admins can manage
CREATE POLICY "Admins can manage brands"
  ON brands FOR ALL
  USING (is_admin());

-- 11. To promote a user to admin, run:
-- UPDATE profiles SET role = 'admin' WHERE id = 'USER_UUID_HERE';
-- UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb WHERE id = 'USER_UUID_HERE';
