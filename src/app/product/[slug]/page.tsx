import { ProductDetail } from '@/components/products/product-detail'
import type { Metadata } from 'next'
import type { Product } from '@/lib/types'

// Mock product — replace with actual Supabase query
const mockProduct: Product = {
  id: '1',
  sku: 'AAPL-IP16PM-256',
  name: 'iPhone 16 Pro Max — 256GB Natural Titanium',
  slug: 'iphone-16-pro-max-256gb',
  brand_id: 1,
  category_id: 1,
  short_desc: 'A18 Pro chip, 48MP Fusion camera, titanium design. The most advanced iPhone ever with the longest battery life.',
  description: 'iPhone 16 Pro Max features a Grade 5 titanium design with a new Desert Titanium finish. The 6.9-inch Super Retina XDR display with ProMotion technology delivers an incredible visual experience. Powered by the A18 Pro chip, it handles the most demanding tasks with ease while maintaining exceptional battery life.',
  price: 189999,
  compare_price: 199999,
  cost_price: 170000,
  stock: 15,
  weight_kg: 0.227,
  is_featured: true,
  is_active: true,
  meta_title: 'iPhone 16 Pro Max 256GB',
  meta_description: 'Buy iPhone 16 Pro Max in Bangladesh',
  tags: ['5G', 'A18 Pro', '48MP Fusion', 'Titanium', 'USB-C'],
  specs: {
    'Display': '6.9" Super Retina XDR OLED',
    'Chip': 'A18 Pro',
    'Camera': '48MP Fusion + 48MP Ultra Wide + 12MP Telephoto',
    'Battery': 'Up to 33 hours video playback',
    'Storage': '256GB',
    'RAM': '8GB',
    'OS': 'iOS 18',
    'Connectivity': '5G, Wi-Fi 7, Bluetooth 5.3',
    'Port': 'USB-C (USB 3)',
    'Water Resistance': 'IP68',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  brand: { id: 1, name: 'Apple', slug: 'apple', logo_url: null },
  category: { id: 1, parent_id: null, name: 'Smartphones', slug: 'smartphones', icon_svg: null, sort_order: 0 },
  variants: [
    {
      id: 'v1',
      product_id: '1',
      name: 'Natural Titanium',
      sku: 'AAPL-IP16PM-256-NT',
      price: 189999,
      stock: 8,
      attributes: { color: 'Natural Titanium', storage: '256GB' },
    },
    {
      id: 'v2',
      product_id: '1',
      name: 'Desert Titanium',
      sku: 'AAPL-IP16PM-256-DT',
      price: 189999,
      stock: 5,
      attributes: { color: 'Desert Titanium', storage: '256GB' },
    },
    {
      id: 'v3',
      product_id: '1',
      name: 'Black Titanium',
      sku: 'AAPL-IP16PM-256-BT',
      price: 189999,
      stock: 2,
      attributes: { color: 'Black Titanium', storage: '256GB' },
    },
  ],
  images: [],
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: mockProduct.meta_title || mockProduct.name,
    description: mockProduct.meta_description || mockProduct.short_desc || '',
  }
}

export default function ProductPage() {
  // TODO: Fetch product by slug from Supabase
  // const supabase = await createClient()
  // const { data: product } = await supabase
  //   .from('products')
  //   .select('*, brand:brands(*), category:categories(*), images:product_images(*), variants:product_variants(*)')
  //   .eq('slug', params.slug)
  //   .single()

  return <ProductDetail product={mockProduct} />
}
