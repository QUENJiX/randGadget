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
  pending: 'text-amber-600 bg-amber-50',
  confirmed: 'text-blue-600 bg-blue-50',
  processing: 'text-indigo-600 bg-indigo-50',
  shipped: 'text-cyan-600 bg-cyan-50',
  out_for_delivery: 'text-teal-600 bg-teal-50',
  delivered: 'text-green-600 bg-green-50',
  cancelled: 'text-red-600 bg-red-50',
  returned: 'text-stone-600 bg-stone-50',
}
