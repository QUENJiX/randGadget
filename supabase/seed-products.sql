-- ============================================================================
-- GADGETBD: Seed product catalog
-- Run AFTER schema.sql (brands, categories, products tables must exist)
-- ============================================================================

-- =========================================================================
-- BRANDS
-- =========================================================================
INSERT INTO brands (name, slug, logo_url) VALUES
  ('Apple',      'apple',      NULL),
  ('Samsung',    'samsung',    NULL),
  ('Sony',       'sony',       NULL),
  ('Google',     'google',     NULL),
  ('Nothing',    'nothing',    NULL),
  ('Anker',      'anker',      NULL),
  ('OnePlus',    'oneplus',    NULL),
  ('Xiaomi',     'xiaomi',     NULL),
  ('JBL',        'jbl',        NULL),
  ('Baseus',     'baseus',     NULL),
  ('Lenovo',     'lenovo',     NULL),
  ('ASUS',       'asus',       NULL);

-- =========================================================================
-- CATEGORIES
-- =========================================================================
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Smartphones',   'smartphones',   1),
  ('Laptops',       'laptops',       2),
  ('Audio',         'audio',         3),
  ('Wearables',     'wearables',     4),
  ('Accessories',   'accessories',   5),
  ('Tablets',       'tablets',       6),
  ('Gaming',        'gaming',        7),
  ('Power & Cables','power-cables',  8);

-- =========================================================================
-- PRODUCTS
-- =========================================================================

-- 1. iPhone 16 Pro Max
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'AAPL-IP16PM-256',
  'iPhone 16 Pro Max — 256GB',
  'iphone-16-pro-max-256gb',
  (SELECT id FROM brands WHERE slug = 'apple'),
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'A18 Pro chip, 48MP Fusion camera, titanium design. The most advanced iPhone ever.',
  'iPhone 16 Pro Max features a Grade 5 titanium design with a new Desert Titanium finish. The 6.9-inch Super Retina XDR display with ProMotion technology delivers an incredible visual experience. Powered by the A18 Pro chip, it handles the most demanding tasks with ease while maintaining exceptional battery life.',
  189999, 199999, 170000, 15, 0.227, true,
  ARRAY['5G', 'A18 Pro', '48MP Fusion', 'Titanium', 'USB-C'],
  '{"Display": "6.9\" Super Retina XDR OLED", "Chip": "A18 Pro", "Camera": "48MP Fusion + 48MP Ultra Wide + 12MP Telephoto", "Battery": "Up to 33 hours video playback", "Storage": "256GB", "RAM": "8GB", "OS": "iOS 18", "Connectivity": "5G, Wi-Fi 7, Bluetooth 5.3", "Port": "USB-C (USB 3)", "Water Resistance": "IP68"}'::jsonb
);

-- Variants for iPhone 16 Pro Max
INSERT INTO product_variants (product_id, name, sku, price, stock, attributes)
SELECT p.id, 'Natural Titanium', 'AAPL-IP16PM-256-NT', 189999, 8,
  '{"color": "Natural Titanium", "storage": "256GB"}'::jsonb
FROM products p WHERE p.sku = 'AAPL-IP16PM-256';

INSERT INTO product_variants (product_id, name, sku, price, stock, attributes)
SELECT p.id, 'Desert Titanium', 'AAPL-IP16PM-256-DT', 189999, 5,
  '{"color": "Desert Titanium", "storage": "256GB"}'::jsonb
FROM products p WHERE p.sku = 'AAPL-IP16PM-256';

INSERT INTO product_variants (product_id, name, sku, price, stock, attributes)
SELECT p.id, 'Black Titanium', 'AAPL-IP16PM-256-BT', 189999, 2,
  '{"color": "Black Titanium", "storage": "256GB"}'::jsonb
FROM products p WHERE p.sku = 'AAPL-IP16PM-256';

-- Placeholder image
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'iPhone 16 Pro Max', 0, true
FROM products p WHERE p.sku = 'AAPL-IP16PM-256';


-- 2. Samsung Galaxy S25 Ultra
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'SAM-S25U-256',
  'Samsung Galaxy S25 Ultra',
  'samsung-galaxy-s25-ultra',
  (SELECT id FROM brands WHERE slug = 'samsung'),
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'Galaxy AI built in. Snapdragon 8 Elite, 200MP camera, S Pen included.',
  'Samsung Galaxy S25 Ultra redefines smartphone photography with a 200MP main sensor and AI-powered image processing. The Snapdragon 8 Elite chipset delivers unmatched performance. Integrated S Pen with Air Actions for effortless productivity.',
  164999, 174999, 140000, 20, 0.218, true,
  ARRAY['Galaxy AI', 'Snapdragon 8 Elite', '200MP', 'S Pen', '5G'],
  '{"Display": "6.8\" Dynamic AMOLED 2X", "Chip": "Snapdragon 8 Elite", "Camera": "200MP + 50MP + 10MP + 12MP", "Battery": "5000mAh", "Storage": "256GB", "RAM": "12GB", "OS": "One UI 7 / Android 15", "Connectivity": "5G, Wi-Fi 7", "S Pen": "Included", "Water Resistance": "IP68"}'::jsonb
);

INSERT INTO product_variants (product_id, name, sku, price, stock, attributes)
SELECT p.id, 'Titanium Black', 'SAM-S25U-256-TB', 164999, 10,
  '{"color": "Titanium Black", "storage": "256GB"}'::jsonb
FROM products p WHERE p.sku = 'SAM-S25U-256';

INSERT INTO product_variants (product_id, name, sku, price, stock, attributes)
SELECT p.id, 'Titanium Gray', 'SAM-S25U-256-TG', 164999, 10,
  '{"color": "Titanium Gray", "storage": "256GB"}'::jsonb
FROM products p WHERE p.sku = 'SAM-S25U-256';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Samsung Galaxy S25 Ultra', 0, true
FROM products p WHERE p.sku = 'SAM-S25U-256';


-- 3. MacBook Air 15" M3
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'AAPL-MBA15-M3',
  'MacBook Air 15" M3',
  'macbook-air-15-m3',
  (SELECT id FROM brands WHERE slug = 'apple'),
  (SELECT id FROM categories WHERE slug = 'laptops'),
  'Strikingly thin. Impressively big. M3 chip with 18-hour battery.',
  'The 15-inch MacBook Air with M3 chip delivers incredible performance in an impossibly thin design. With Liquid Retina display, 18 hours of battery life, and a silent fanless design, it''s the perfect balance of power and portability.',
  179999, NULL, 155000, 8, 1.51, true,
  ARRAY['M3 Chip', '18hr Battery', 'Liquid Retina', 'Fanless'],
  '{"Display": "15.3\" Liquid Retina", "Chip": "Apple M3", "GPU": "10-core", "Memory": "8GB Unified", "Storage": "256GB SSD", "Battery": "Up to 18 hours", "Weight": "1.51 kg", "Ports": "2x Thunderbolt, MagSafe, headphone jack", "Camera": "1080p FaceTime HD"}'::jsonb
);

INSERT INTO product_variants (product_id, name, sku, price, stock, attributes)
SELECT p.id, 'Midnight', 'AAPL-MBA15-M3-MN', 179999, 4,
  '{"color": "Midnight", "memory": "8GB", "storage": "256GB"}'::jsonb
FROM products p WHERE p.sku = 'AAPL-MBA15-M3';

INSERT INTO product_variants (product_id, name, sku, price, stock, attributes)
SELECT p.id, 'Starlight', 'AAPL-MBA15-M3-SL', 179999, 4,
  '{"color": "Starlight", "memory": "8GB", "storage": "256GB"}'::jsonb
FROM products p WHERE p.sku = 'AAPL-MBA15-M3';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'MacBook Air 15 M3', 0, true
FROM products p WHERE p.sku = 'AAPL-MBA15-M3';


-- 4. Sony WH-1000XM5
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'SONY-WH1000XM5',
  'Sony WH-1000XM5',
  'sony-wh-1000xm5',
  (SELECT id FROM brands WHERE slug = 'sony'),
  (SELECT id FROM categories WHERE slug = 'audio'),
  'Industry-leading noise cancellation with exceptional sound quality.',
  'The Sony WH-1000XM5 headphones feature the best noise cancellation in the industry with Auto NC Optimizer. 30 hours of battery life, multipoint connection, and speak-to-chat functionality for seamless day-to-day use.',
  32999, 41999, 25000, 25, 0.250, false,
  ARRAY['ANC', 'LDAC', '30hr Battery', 'Multipoint'],
  '{"Type": "Over-ear Wireless", "Driver": "30mm", "ANC": "Auto NC Optimizer", "Battery": "30 hours", "Bluetooth": "5.2", "Codec": "LDAC, AAC, SBC", "Weight": "250g", "Mic": "8 microphones", "Quick Charge": "3 min = 3 hours"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Sony WH-1000XM5', 0, true
FROM products p WHERE p.sku = 'SONY-WH1000XM5';


-- 5. Google Pixel Watch 3
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'GOOG-PW3',
  'Google Pixel Watch 3',
  'google-pixel-watch-3',
  (SELECT id FROM brands WHERE slug = 'google'),
  (SELECT id FROM categories WHERE slug = 'wearables'),
  'Fitbit health tracking meets Google AI in a premium smartwatch.',
  'Google Pixel Watch 3 combines the best of Google and Fitbit. Track your workouts, monitor heart rate and sleep, get help from Google Assistant, and use Google Maps — all from your wrist.',
  44999, 52999, 35000, 12, 0.031, false,
  ARRAY['Wear OS', 'Fitbit', 'Google AI', 'AMOLED'],
  '{"Display": "1.2\" AMOLED", "Chip": "Qualcomm SW5100", "OS": "Wear OS 5", "Battery": "Up to 24 hours", "Water Resistance": "5 ATM", "Sensors": "Heart rate, SpO2, Skin temperature", "Connectivity": "Bluetooth 5.3, Wi-Fi, NFC"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Google Pixel Watch 3', 0, true
FROM products p WHERE p.sku = 'GOOG-PW3';


-- 6. Nothing Ear (a)
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'NTNG-EARA',
  'Nothing Ear (a)',
  'nothing-ear-a',
  (SELECT id FROM brands WHERE slug = 'nothing'),
  (SELECT id FROM categories WHERE slug = 'audio'),
  'Powerful ANC earbuds with a transparent design at an incredible price.',
  'Nothing Ear (a) brings powerful active noise cancellation and hi-res audio to an accessible price point. The iconic transparent design, customizable EQ, and up to 42.5 hours of total battery life make these a standout choice.',
  6999, 8999, 4500, 40, 0.005, false,
  ARRAY['ANC', 'Hi-Res', 'Transparent Design', '42.5hr Battery'],
  '{"Type": "In-ear TWS", "Driver": "11mm", "ANC": "Up to 45dB", "Battery": "9.5 hours (42.5 with case)", "Bluetooth": "5.3", "Codec": "LDAC, AAC, SBC", "Water Resistance": "IP54", "Weight": "4.8g per earbud"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Nothing Ear (a)', 0, true
FROM products p WHERE p.sku = 'NTNG-EARA';


-- 7. Anker 737 Power Bank
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'ANKR-737PB',
  'Anker 737 Power Bank 24,000mAh',
  'anker-737-power-bank',
  (SELECT id FROM brands WHERE slug = 'anker'),
  (SELECT id FROM categories WHERE slug = 'power-cables'),
  '140W output, 24,000mAh — charge laptops and phones simultaneously.',
  'The Anker 737 PowerCore 24K is a beast of a power bank. With 140W USB-C output, it can charge MacBook Pros and flagship phones at full speed. Smart digital display shows remaining capacity, input/output wattage, and estimated charge time.',
  8499, 11999, 6000, 30, 0.640, false,
  ARRAY['140W', '24000mAh', 'USB-C PD', 'Laptop Charging'],
  '{"Capacity": "24,000mAh / 86.4Wh", "Max Output": "140W USB-C", "Ports": "2x USB-C, 1x USB-A", "Display": "Smart digital display", "Weight": "640g", "Input": "140W USB-C", "Recharge Time": "58 min (0-80%)"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Anker 737 Power Bank', 0, true
FROM products p WHERE p.sku = 'ANKR-737PB';


-- 8. Apple AirPods Pro 2
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'AAPL-APP2-USBC',
  'Apple AirPods Pro 2 (USB-C)',
  'apple-airpods-pro-2',
  (SELECT id FROM brands WHERE slug = 'apple'),
  (SELECT id FROM categories WHERE slug = 'audio'),
  'Adaptive Audio, USB-C, hearing health features, and the H2 chip.',
  'AirPods Pro 2 with H2 chip deliver up to 2x more Active Noise Cancellation. Adaptive Audio dynamically blends Transparency mode and ANC. USB-C MagSafe case with speaker and lanyard loop.',
  34999, 39999, 28000, 18, 0.006, false,
  ARRAY['ANC', 'H2 Chip', 'Adaptive Audio', 'USB-C'],
  '{"Type": "In-ear TWS", "Chip": "Apple H2", "ANC": "2x more active noise cancellation", "Battery": "6 hours (30 with case)", "Connector": "USB-C", "Audio": "Adaptive Audio, Spatial Audio", "Water Resistance": "IP54", "Weight": "5.3g per earbud"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Apple AirPods Pro 2', 0, true
FROM products p WHERE p.sku = 'AAPL-APP2-USBC';


-- 9. OnePlus 13
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'OP-13-256',
  'OnePlus 13 — 256GB',
  'oneplus-13-256gb',
  (SELECT id FROM brands WHERE slug = 'oneplus'),
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'Snapdragon 8 Elite, Hasselblad cameras, 100W SUPERVOOC charging.',
  'OnePlus 13 pushes boundaries with its Snapdragon 8 Elite chipset and Hasselblad-tuned triple camera system. 100W wired and 50W wireless charging ensure you''re never running low.',
  109999, 119999, 85000, 15, 0.213, false,
  ARRAY['Snapdragon 8 Elite', 'Hasselblad', '100W Charging', '5G'],
  '{"Display": "6.82\" LTPO AMOLED, 120Hz", "Chip": "Snapdragon 8 Elite", "Camera": "50MP + 50MP + 50MP Hasselblad", "Battery": "6000mAh", "Charging": "100W wired, 50W wireless", "Storage": "256GB", "RAM": "12GB", "OS": "OxygenOS 15 / Android 15"}'::jsonb
);

INSERT INTO product_variants (product_id, name, sku, price, stock, attributes)
SELECT p.id, 'Midnight Ocean', 'OP-13-256-MO', 109999, 8,
  '{"color": "Midnight Ocean", "storage": "256GB"}'::jsonb
FROM products p WHERE p.sku = 'OP-13-256';

INSERT INTO product_variants (product_id, name, sku, price, stock, attributes)
SELECT p.id, 'Arctic Dawn', 'OP-13-256-AD', 109999, 7,
  '{"color": "Arctic Dawn", "storage": "256GB"}'::jsonb
FROM products p WHERE p.sku = 'OP-13-256';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'OnePlus 13', 0, true
FROM products p WHERE p.sku = 'OP-13-256';


-- 10. Xiaomi 14 Ultra
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'XM-14U-512',
  'Xiaomi 14 Ultra',
  'xiaomi-14-ultra',
  (SELECT id FROM brands WHERE slug = 'xiaomi'),
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'Leica Summilux quad camera, Snapdragon 8 Gen 3, 90W HyperCharge.',
  'Xiaomi 14 Ultra is the ultimate camera phone with a Leica Summilux quad lens system. Professional-grade 1-inch sensor, Snapdragon 8 Gen 3, and a stunning 6.73-inch 2K LTPO display.',
  129999, 149999, 100000, 10, 0.225, false,
  ARRAY['Leica', 'Snapdragon 8 Gen 3', '1-inch Sensor', '90W'],
  '{"Display": "6.73\" 2K LTPO AMOLED", "Chip": "Snapdragon 8 Gen 3", "Camera": "50MP 1-inch Leica + 50MP + 50MP + 50MP", "Battery": "5300mAh", "Charging": "90W wired, 50W wireless", "Storage": "512GB", "RAM": "16GB"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Xiaomi 14 Ultra', 0, true
FROM products p WHERE p.sku = 'XM-14U-512';


-- 11. JBL Tune 770NC
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'JBL-T770NC',
  'JBL Tune 770NC',
  'jbl-tune-770nc',
  (SELECT id FROM brands WHERE slug = 'jbl'),
  (SELECT id FROM categories WHERE slug = 'audio'),
  'Adaptive ANC headphones with JBL Pure Bass and 70-hour battery life.',
  'JBL Tune 770NC delivers powerful JBL Pure Bass Sound with Adaptive Noise Cancelling. With up to 70 hours of battery life and a lightweight, foldable design, they''re perfect for commutes and travel.',
  9999, 12999, 7000, 35, 0.225, false,
  ARRAY['ANC', 'JBL Pure Bass', '70hr Battery', 'Foldable'],
  '{"Type": "Over-ear Wireless", "Driver": "40mm", "ANC": "Adaptive Noise Cancelling", "Battery": "70 hours (44 with ANC)", "Bluetooth": "5.3", "Codec": "AAC, SBC", "Weight": "225g", "Foldable": "Yes"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'JBL Tune 770NC', 0, true
FROM products p WHERE p.sku = 'JBL-T770NC';


-- 12. Samsung Galaxy Tab S9 FE
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'SAM-TABS9FE',
  'Samsung Galaxy Tab S9 FE',
  'samsung-galaxy-tab-s9-fe',
  (SELECT id FROM brands WHERE slug = 'samsung'),
  (SELECT id FROM categories WHERE slug = 'tablets'),
  'S Pen included, 10.9" display, IP68 water resistance at an affordable price.',
  'Galaxy Tab S9 FE brings the premium tablet experience to everyone. With an included S Pen, IP68 water and dust resistance, and a vivid 10.9-inch display, it''s perfect for creativity and entertainment.',
  44999, 49999, 35000, 14, 0.523, false,
  ARRAY['S Pen', 'IP68', 'One UI', 'DeX'],
  '{"Display": "10.9\" TFT LCD", "Chip": "Exynos 1380", "RAM": "6GB", "Storage": "128GB + microSD", "Battery": "8000mAh", "S Pen": "Included", "Water Resistance": "IP68", "OS": "One UI 6 / Android 14"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Samsung Galaxy Tab S9 FE', 0, true
FROM products p WHERE p.sku = 'SAM-TABS9FE';


-- 13. Baseus 65W GaN Charger
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'BASE-65WGAN',
  'Baseus 65W GaN5 Pro Charger',
  'baseus-65w-gan-charger',
  (SELECT id FROM brands WHERE slug = 'baseus'),
  (SELECT id FROM categories WHERE slug = 'power-cables'),
  'Ultra-compact 65W GaN charger — charge laptop, phone & tablet simultaneously.',
  'The Baseus 65W GaN5 Pro is smaller than a credit card stack yet powerful enough to charge a MacBook Air at full speed. 3 ports (2x USB-C + 1x USB-A) with intelligent power distribution.',
  3499, 4999, 2200, 50, 0.120, false,
  ARRAY['65W', 'GaN', 'USB-C PD', 'Compact'],
  '{"Max Output": "65W", "Ports": "2x USB-C + 1x USB-A", "Technology": "GaN5 Pro", "Weight": "120g", "Input": "100-240V AC", "PD Compatibility": "PD 3.0, QC 5.0, PPS"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Baseus 65W GaN Charger', 0, true
FROM products p WHERE p.sku = 'BASE-65WGAN';


-- 14. Lenovo IdeaPad Slim 5
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'LNV-IPS5-14',
  'Lenovo IdeaPad Slim 5 14"',
  'lenovo-ideapad-slim-5-14',
  (SELECT id FROM brands WHERE slug = 'lenovo'),
  (SELECT id FROM categories WHERE slug = 'laptops'),
  'AMD Ryzen 7, 16GB RAM, 512GB SSD — perfect for productivity.',
  'The Lenovo IdeaPad Slim 5 delivers premium performance at a mainstream price. With AMD Ryzen 7 processor, 16GB RAM, and a bright 14-inch 2.8K OLED display, it handles everything from coding to content creation.',
  79999, 89999, 65000, 6, 1.46, false,
  ARRAY['Ryzen 7', '16GB RAM', 'OLED', '512GB SSD'],
  '{"Display": "14\" 2.8K OLED", "Processor": "AMD Ryzen 7 7730U", "RAM": "16GB DDR5", "Storage": "512GB NVMe SSD", "Battery": "Up to 14 hours", "Weight": "1.46 kg", "OS": "Windows 11 Home", "Ports": "USB-C, USB-A, HDMI, SD card"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Lenovo IdeaPad Slim 5', 0, true
FROM products p WHERE p.sku = 'LNV-IPS5-14';


-- 15. ASUS ROG Ally X
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'ASUS-ROGAX',
  'ASUS ROG Ally X',
  'asus-rog-ally-x',
  (SELECT id FROM brands WHERE slug = 'asus'),
  (SELECT id FROM categories WHERE slug = 'gaming'),
  'AMD Z1 Extreme handheld gaming console with 7" 120Hz display.',
  'ASUS ROG Ally X is the ultimate Windows handheld gaming device. Powered by the AMD Z1 Extreme chip with a 7-inch 120Hz FHD display, 24GB RAM, and 1TB SSD for your entire game library on the go.',
  89999, 99999, 72000, 5, 0.678, false,
  ARRAY['Z1 Extreme', '120Hz', '24GB RAM', 'Handheld'],
  '{"Display": "7\" FHD 120Hz IPS", "Chip": "AMD Z1 Extreme", "RAM": "24GB LPDDR5X", "Storage": "1TB NVMe SSD", "Battery": "80Wh", "OS": "Windows 11", "Weight": "678g", "Controls": "Full gamepad + gyroscope"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'ASUS ROG Ally X', 0, true
FROM products p WHERE p.sku = 'ASUS-ROGAX';


-- 16. Samsung Galaxy Buds3 Pro
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'SAM-GB3PRO',
  'Samsung Galaxy Buds3 Pro',
  'samsung-galaxy-buds3-pro',
  (SELECT id FROM brands WHERE slug = 'samsung'),
  (SELECT id FROM categories WHERE slug = 'audio'),
  'Blade-shaped design, 2-way speakers, Galaxy AI-powered ANC.',
  'Galaxy Buds3 Pro feature a revolutionary blade-shaped design with 2-way speakers for crystal-clear audio. Galaxy AI powers adaptive ANC and real-time translation features.',
  24999, 29999, 18000, 22, 0.005, false,
  ARRAY['ANC', 'Galaxy AI', '2-Way Speaker', 'Hi-Res'],
  '{"Type": "In-ear TWS", "Driver": "10.5mm + 6.1mm planar", "ANC": "Galaxy AI Adaptive ANC", "Battery": "7 hours (30 with case)", "Bluetooth": "5.4", "Codec": "SSC HiFi, AAC, SBC", "Water Resistance": "IP57", "Weight": "5.4g per earbud"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Samsung Galaxy Buds3 Pro', 0, true
FROM products p WHERE p.sku = 'SAM-GB3PRO';


-- 17. Google Pixel 9 Pro
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'GOOG-P9PRO',
  'Google Pixel 9 Pro',
  'google-pixel-9-pro',
  (SELECT id FROM brands WHERE slug = 'google'),
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'Tensor G4, 50MP triple camera, 7 years of updates.',
  'Google Pixel 9 Pro brings the best of Google AI to your pocket. With Tensor G4 chip, pro-level triple camera system, and 7 years of OS and security updates, it''s the smartest Android phone.',
  124999, 134999, 95000, 10, 0.199, false,
  ARRAY['Tensor G4', 'Google AI', '7yr Updates', '50MP'],
  '{"Display": "6.3\" LTPO OLED, 120Hz", "Chip": "Google Tensor G4", "Camera": "50MP + 48MP ultrawide + 48MP telephoto", "Battery": "4700mAh", "Storage": "128GB", "RAM": "16GB", "OS": "Android 15", "Updates": "7 years guaranteed"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Google Pixel 9 Pro', 0, true
FROM products p WHERE p.sku = 'GOOG-P9PRO';


-- 18. Anker Soundcore Space A40
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'ANKR-SCA40',
  'Anker Soundcore Space A40',
  'anker-soundcore-space-a40',
  (SELECT id FROM brands WHERE slug = 'anker'),
  (SELECT id FROM categories WHERE slug = 'audio'),
  'Hi-Res wireless earbuds with adaptive ANC and 50-hour playtime.',
  'Anker Soundcore Space A40 punches way above its price. With LDAC Hi-Res codec support, adaptive ANC, 10mm drivers, and an incredible 50 hours of total playtime, these are unbeatable value.',
  5999, 7999, 3800, 45, 0.005, false,
  ARRAY['ANC', 'Hi-Res', 'LDAC', '50hr Battery'],
  '{"Type": "In-ear TWS", "Driver": "10mm", "ANC": "Adaptive ANC", "Battery": "10 hours (50 with case)", "Bluetooth": "5.2", "Codec": "LDAC, AAC, SBC", "Water Resistance": "IPX4", "Weight": "4.9g per earbud"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Anker Soundcore Space A40', 0, true
FROM products p WHERE p.sku = 'ANKR-SCA40';


-- 19. Xiaomi Smart Band 9
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'XM-BAND9',
  'Xiaomi Smart Band 9',
  'xiaomi-smart-band-9',
  (SELECT id FROM brands WHERE slug = 'xiaomi'),
  (SELECT id FROM categories WHERE slug = 'wearables'),
  '1.62" AMOLED, 21-day battery, 150+ sports modes — the king of budget fitness.',
  'Xiaomi Smart Band 9 packs an incredible feature set into a tiny package. Metal unibody design, always-on AMOLED display, continuous heart rate and SpO2 monitoring, and up to 21 days of battery life.',
  3499, 4499, 2200, 60, 0.016, false,
  ARRAY['AMOLED', '21-day Battery', '150+ Sports', 'Heart Rate'],
  '{"Display": "1.62\" AMOLED", "Battery": "Up to 21 days", "Sensors": "Heart rate, SpO2, accelerometer", "Sports": "150+ modes", "Water Resistance": "5 ATM", "Weight": "15.8g (without band)", "Connectivity": "Bluetooth 5.4"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Xiaomi Smart Band 9', 0, true
FROM products p WHERE p.sku = 'XM-BAND9';


-- 20. Baseus USB-C to USB-C Cable 100W
INSERT INTO products (sku, name, slug, brand_id, category_id, short_desc, description, price, compare_price, cost_price, stock, weight_kg, is_featured, tags, specs)
VALUES (
  'BASE-C2C100W',
  'Baseus 100W USB-C Cable (2m)',
  'baseus-100w-usb-c-cable',
  (SELECT id FROM brands WHERE slug = 'baseus'),
  (SELECT id FROM categories WHERE slug = 'power-cables'),
  '100W PD fast charging, 480Mbps data transfer, braided nylon.',
  'Baseus 100W USB-C to USB-C cable is built to last. Premium braided nylon, zinc alloy connectors, and support for 100W Power Delivery. Perfect for charging laptops, tablets, and phones at maximum speed.',
  799, 1299, 400, 80, 0.065, false,
  ARRAY['100W', 'USB-C', 'Braided Nylon', '2m'],
  '{"Length": "2 meters", "Max Power": "100W (20V/5A)", "Data Transfer": "480Mbps", "Material": "Braided nylon, zinc alloy", "Compatibility": "USB-C PD devices", "Warranty": "18 months"}'::jsonb
);

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/placeholder-product.svg', 'Baseus 100W USB-C Cable', 0, true
FROM products p WHERE p.sku = 'BASE-C2C100W';
