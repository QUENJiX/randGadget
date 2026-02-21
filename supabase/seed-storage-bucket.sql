-- ============================================================================
-- Supabase Storage: Product Images Bucket
-- Run once in the Supabase SQL editor
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5 MB max per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read images (bucket is public)
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Only authenticated users (admins wil be further filtered by app logic) can upload
CREATE POLICY "Auth users can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Only authenticated users can update their uploads
CREATE POLICY "Auth users can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images');

-- Only authenticated users can delete images
CREATE POLICY "Auth users can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');
