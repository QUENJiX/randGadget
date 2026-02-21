-- ============================================================================
-- GADGETBD: Cart RLS policies & orders insert policy
-- Run AFTER schema.sql
-- ============================================================================

-- Enable RLS on cart tables
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Carts: users can manage their own carts  
CREATE POLICY "Users can manage own carts"
  ON carts FOR ALL
  USING (auth.uid() = user_id);

-- Cart items: users can manage items in their own cart
CREATE POLICY "Users can manage own cart items"
  ON cart_items FOR ALL
  USING (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
  );

-- Product variants need public read for cart operations
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read variants"
  ON product_variants FOR SELECT USING (true);

-- Orders: users can insert their own orders
CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Order items: users can insert items for their own orders
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );
