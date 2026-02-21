/* ============================================================================
   GADGETBD — Core TypeScript Types
   ============================================================================ */

// --- Geography ---
export interface Division {
  id: number
  name: string
  bn_name: string | null
}

export interface District {
  id: number
  division_id: number
  name: string
  bn_name: string | null
}

export interface Upazila {
  id: number
  district_id: number
  name: string
  bn_name: string | null
}

export interface DeliveryZone {
  id: number
  name: string
  base_charge: number
  per_kg: number
  est_days: number
}

// --- Products ---
export interface Brand {
  id: number
  name: string
  slug: string
  logo_url: string | null
}

export interface Category {
  id: number
  parent_id: number | null
  name: string
  slug: string
  icon_svg: string | null
  sort_order: number
  children?: Category[]
}

export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  brand_id: number | null
  category_id: number | null
  short_desc: string | null
  description: string | null
  price: number
  compare_price: number | null
  cost_price: number | null
  stock: number
  weight_kg: number
  is_featured: boolean
  is_active: boolean
  meta_title: string | null
  meta_description: string | null
  tags: string[]
  specs: Record<string, string>
  created_at: string
  updated_at: string
  // Joined
  brand?: Brand
  category?: Category
  images?: ProductImage[]
  variants?: ProductVariant[]
  primary_image?: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  sku: string
  price: number
  stock: number
  attributes: Record<string, string>
}

// --- Cart ---
export interface CartItem {
  id: string
  product_id: string
  variant_id: string | null
  quantity: number
  product: Product
  variant?: ProductVariant
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  item_count: number
}

// --- Orders ---
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'

export type PaymentMethod =
  | 'cod'
  | 'bkash'
  | 'nagad'
  | 'rocket'
  | 'sslcommerz'
  | 'amarpay'

export type PaymentStatus =
  | 'unpaid'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  guest_email: string | null
  guest_phone: string | null
  shipping_name: string
  shipping_phone: string
  shipping_division: string
  shipping_district: string
  shipping_upazila: string
  shipping_street: string
  shipping_postal_code: string | null
  delivery_zone_id: number | null
  subtotal: number
  delivery_charge: number
  discount: number
  total: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  payment_tx_id: string | null
  status: OrderStatus
  notes: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
  delivery_zone?: DeliveryZone
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string | null
  name: string
  price: number
  quantity: number
}

// --- Checkout ---
export interface CheckoutAddress {
  full_name: string
  phone: string
  division_id: number | null
  district_id: number | null
  upazila_id: number | null
  street_address: string
  postal_code: string
}

export interface CheckoutState {
  step: 'address' | 'payment' | 'review'
  address: CheckoutAddress
  payment_method: PaymentMethod
  delivery_charge: number
  delivery_zone: DeliveryZone | null
  coupon_code: string
  discount: number
  notes: string
}

// --- Search ---
export interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  compare_price: number | null
  short_desc: string | null
  brand_name: string | null
  category_name: string | null
  primary_image: string | null
  relevance: number
}

export interface SearchFilters {
  query: string
  category?: string
  brand?: string
  min_price?: number
  max_price?: number
  sort_by: 'relevance' | 'price_asc' | 'price_desc' | 'newest'
  page: number
  page_size: number
}

// --- Auth ---
export interface UserProfile {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: 'customer' | 'admin'
  created_at: string
}

export interface Address {
  id: string
  user_id: string | null
  label: string
  full_name: string
  phone: string
  division_id: number | null
  district_id: number | null
  upazila_id: number | null
  street_address: string
  postal_code: string | null
  is_default: boolean
  // Joined
  division?: Division
  district?: District
  upazila?: Upazila
}

// --- Review ---
export interface Review {
  id: string
  product_id: string
  user_id: string | null
  rating: number
  title: string | null
  body: string | null
  is_verified: boolean
  created_at: string
  user?: UserProfile
}
