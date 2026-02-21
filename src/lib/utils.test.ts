import { describe, it, expect, vi } from 'vitest'
import {
  formatPrice,
  formatPriceExact,
  calcDiscount,
  truncate,
  slugify,
  debounce,
  cn,
  paymentMethodLabels,
  orderStatusLabels,
  orderStatusColors,
  imageUrl,
  productImageUrl,
} from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/*  cn()                                                                       */
/* -------------------------------------------------------------------------- */
describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('filters falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })

  it('handles conditional objects', () => {
    expect(cn({ active: true, disabled: false })).toBe('active')
  })
})

/* -------------------------------------------------------------------------- */
/*  formatPrice()                                                              */
/* -------------------------------------------------------------------------- */
describe('formatPrice', () => {
  it('formats an integer amount with ৳ prefix', () => {
    expect(formatPrice(1000)).toMatch(/৳.*1.*000/)
  })

  it('returns no decimal places', () => {
    const result = formatPrice(1234)
    expect(result).not.toContain('.')
  })

  it('handles zero', () => {
    expect(formatPrice(0)).toMatch(/৳.*0/)
  })
})

/* -------------------------------------------------------------------------- */
/*  formatPriceExact()                                                         */
/* -------------------------------------------------------------------------- */
describe('formatPriceExact', () => {
  it('includes two decimal places', () => {
    const result = formatPriceExact(1500)
    expect(result).toContain('.')
  })

  it('has ৳ prefix', () => {
    expect(formatPriceExact(99.5)).toMatch(/^৳/)
  })
})

/* -------------------------------------------------------------------------- */
/*  calcDiscount()                                                             */
/* -------------------------------------------------------------------------- */
describe('calcDiscount', () => {
  it('returns correct percentage', () => {
    expect(calcDiscount(80, 100)).toBe(20)
  })

  it('rounds to nearest integer', () => {
    expect(calcDiscount(33, 100)).toBe(67)
  })

  it('returns 0 when compare price is 0', () => {
    expect(calcDiscount(100, 0)).toBe(0)
  })

  it('returns 0 when compare price equals price', () => {
    expect(calcDiscount(100, 100)).toBe(0)
  })

  it('returns 0 when compare price is less than price', () => {
    expect(calcDiscount(100, 50)).toBe(0)
  })
})

/* -------------------------------------------------------------------------- */
/*  truncate()                                                                 */
/* -------------------------------------------------------------------------- */
describe('truncate', () => {
  it('truncates strings longer than the limit', () => {
    const long = 'a'.repeat(200)
    const result = truncate(long, 50)
    expect(result.length).toBeLessThanOrEqual(53) // 50 + "..."
    expect(result).toMatch(/\.{3}$/)
  })

  it('returns original string when shorter than limit', () => {
    expect(truncate('short', 100)).toBe('short')
  })

  it('uses default length of 100', () => {
    const exactly100 = 'a'.repeat(100)
    expect(truncate(exactly100)).toBe(exactly100)
  })
})

/* -------------------------------------------------------------------------- */
/*  slugify()                                                                  */
/* -------------------------------------------------------------------------- */
describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(slugify('iPhone 16 Pro — Best!')).toBe('iphone-16-pro-best')
  })

  it('trims leading/trailing hyphens', () => {
    expect(slugify('  -hello-  ')).toBe('hello')
  })

  it('collapses multiple spaces/underscores', () => {
    expect(slugify('a   b___c')).toBe('a-b-c')
  })
})

/* -------------------------------------------------------------------------- */
/*  debounce()                                                                 */
/* -------------------------------------------------------------------------- */
describe('debounce', () => {
  it('delays function execution', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 200)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('resets timer on repeated calls', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 200)

    debounced()
    vi.advanceTimersByTime(100)
    debounced()
    vi.advanceTimersByTime(100)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })
})

/* -------------------------------------------------------------------------- */
/*  Label / color maps                                                         */
/* -------------------------------------------------------------------------- */
describe('paymentMethodLabels', () => {
  it('has entries for all payment methods', () => {
    expect(paymentMethodLabels.cod).toBe('Cash on Delivery')
    expect(paymentMethodLabels.bkash).toBe('bKash')
    expect(paymentMethodLabels.nagad).toBe('Nagad')
    expect(paymentMethodLabels.sslcommerz).toBe('Card / Net Banking')
  })
})

describe('orderStatusLabels', () => {
  it('has human-readable labels for all statuses', () => {
    expect(orderStatusLabels.pending).toBe('Pending')
    expect(orderStatusLabels.delivered).toBe('Delivered')
    expect(orderStatusLabels.cancelled).toBe('Cancelled')
  })
})

describe('orderStatusColors', () => {
  it('maps each status to Tailwind classes', () => {
    expect(orderStatusColors.pending).toContain('amber')
    expect(orderStatusColors.delivered).toContain('green')
  })
})

/* -------------------------------------------------------------------------- */
/*  imageUrl()                                                                 */
/* -------------------------------------------------------------------------- */
describe('imageUrl', () => {
  it('returns empty string for empty path', () => {
    expect(imageUrl('')).toBe('')
  })

  it('returns absolute URLs unchanged', () => {
    const url = 'https://example.com/img.png'
    expect(imageUrl(url)).toBe(url)
  })

  it('prepends storage base for relative paths', () => {
    const result = imageUrl('products/img.jpg')
    expect(result).toContain('products/img.jpg')
    expect(result).toContain('/storage/v1/object/public/product-images/')
  })
})

/* -------------------------------------------------------------------------- */
/*  productImageUrl()                                                          */
/* -------------------------------------------------------------------------- */
describe('productImageUrl', () => {
  it('returns null for product with no images', () => {
    expect(productImageUrl({})).toBeNull()
  })

  it('uses primary_image field if present', () => {
    const result = productImageUrl({ primary_image: 'https://cdn.test/img.jpg' })
    expect(result).toBe('https://cdn.test/img.jpg')
  })

  it('finds image flagged as primary', () => {
    const result = productImageUrl({
      images: [
        { id: '1', product_id: 'p1', url: 'a.jpg', alt_text: null, sort_order: 0, is_primary: false },
        { id: '2', product_id: 'p1', url: 'b.jpg', alt_text: null, sort_order: 1, is_primary: true },
      ],
    })
    expect(result).toContain('b.jpg')
  })

  it('falls back to first image', () => {
    const result = productImageUrl({
      images: [
        { id: '1', product_id: 'p1', url: 'first.jpg', alt_text: null, sort_order: 0, is_primary: false },
      ],
    })
    expect(result).toContain('first.jpg')
  })
})
