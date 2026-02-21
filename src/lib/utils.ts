/* ============================================================================
   GADGETBD — Utility Helpers
   ============================================================================ */

import { clsx, type ClassValue } from 'clsx'

// Tailwind class merger without twMerge dependency — simple concat
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

// Format BDT price
export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

// Format price with decimals
export function formatPriceExact(amount: number): string {
  return `৳${amount.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// Calculate discount percentage
export function calcDiscount(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}

// Truncate text
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + '...'
}

// Generate slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Debounce
export function debounce<T extends (...args: never[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Payment method display names
export const paymentMethodLabels: Record<string, string> = {
  cod: 'Cash on Delivery',
  bkash: 'bKash',
  nagad: 'Nagad',
  rocket: 'Rocket',
  sslcommerz: 'Card / Net Banking',
  amarpay: 'AmarPay',
}

// Order status display
export const orderStatusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
}

export const orderStatusColors: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30',
  confirmed: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30',
  processing: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/30',
  shipped: 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-950/30',
  out_for_delivery: 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/30',
  delivered: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/30',
  cancelled: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30',
  returned: 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-800/30',
}

// --- Image helpers ---

/** Supabase Storage public base URL for product images */
const STORAGE_BASE =
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '') +
  '/storage/v1/object/public/product-images/'

import type { ProductImage, Product } from '@/lib/types'

/**
 * Get the full public URL for a product image.
 * The `url` column stores a path relative to the bucket root.
 */
export function imageUrl(path: string): string {
  if (!path) return ''
  // Already a full URL (external or absolute)
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return STORAGE_BASE + path
}

/**
 * Resolve the primary image URL for a product.
 * Falls back to the first image in the array, then returns null.
 */
export function productImageUrl(product: {
  images?: ProductImage[]
  primary_image?: string | null
}): string | null {
  // Use explicit primary_image field (from views / search RPCs)
  if (product.primary_image) return imageUrl(product.primary_image)
  // Find the image flagged as primary
  const primary = product.images?.find((i) => i.is_primary)
  if (primary) return imageUrl(primary.url)
  // Fallback to first image
  if (product.images && product.images.length > 0) return imageUrl(product.images[0].url)
  return null
}

/** Tiny transparent 1×1 PNG used as the blur placeholder when no real blur hash exists */
export const BLUR_PLACEHOLDER =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPk3KFb2AAAAABJRU5ErkJggg=='
