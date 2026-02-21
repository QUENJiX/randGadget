import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore, useCheckoutStore, useSearchStore } from '@/lib/store'
import type { CartItem } from '@/lib/types'

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function makeCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: 'ci-1',
    product_id: 'p-1',
    variant_id: null,
    quantity: 1,
    product: {
      id: 'p-1',
      sku: 'SKU001',
      name: 'Test Product',
      slug: 'test-product',
      brand_id: null,
      category_id: null,
      short_desc: null,
      description: null,
      price: 1000,
      compare_price: null,
      cost_price: null,
      stock: 10,
      weight_kg: 0.5,
      is_featured: false,
      is_active: true,
      meta_title: null,
      meta_description: null,
      tags: [],
      specs: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    ...overrides,
  }
}

/* -------------------------------------------------------------------------- */
/*  Cart Store                                                                 */
/* -------------------------------------------------------------------------- */
describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] })
  })

  it('starts with empty cart', () => {
    expect(useCartStore.getState().items).toHaveLength(0)
    expect(useCartStore.getState().getItemCount()).toBe(0)
    expect(useCartStore.getState().getSubtotal()).toBe(0)
  })

  it('adds an item', () => {
    const item = makeCartItem()
    useCartStore.getState().addItem(item)
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].product_id).toBe('p-1')
  })

  it('increments quantity when adding same product again', () => {
    const item = makeCartItem({ quantity: 1 })
    useCartStore.getState().addItem(item)
    useCartStore.getState().addItem(item)
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(2)
  })

  it('tracks different variants as separate items', () => {
    const item1 = makeCartItem({ variant_id: 'v-1' })
    const item2 = makeCartItem({ variant_id: 'v-2' })
    useCartStore.getState().addItem(item1)
    useCartStore.getState().addItem(item2)
    expect(useCartStore.getState().items).toHaveLength(2)
  })

  it('removes an item', () => {
    const item = makeCartItem()
    useCartStore.getState().addItem(item)
    useCartStore.getState().removeItem('p-1', null)
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('updates quantity', () => {
    const item = makeCartItem()
    useCartStore.getState().addItem(item)
    useCartStore.getState().updateQuantity('p-1', 5, null)
    expect(useCartStore.getState().items[0].quantity).toBe(5)
  })

  it('removes item when quantity is set to 0', () => {
    const item = makeCartItem()
    useCartStore.getState().addItem(item)
    useCartStore.getState().updateQuantity('p-1', 0, null)
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('calculates subtotal correctly', () => {
    useCartStore.getState().addItem(makeCartItem({ quantity: 2 }))
    useCartStore.getState().addItem(
      makeCartItem({
        product_id: 'p-2',
        quantity: 1,
        product: {
          id: 'p-2',
          sku: 'SKU002',
          name: 'Product 2',
          slug: 'product-2',
          brand_id: null,
          category_id: null,
          short_desc: null,
          description: null,
          price: 500,
          compare_price: null,
          cost_price: null,
          stock: 5,
          weight_kg: 0.3,
          is_featured: false,
          is_active: true,
          meta_title: null,
          meta_description: null,
          tags: [],
          specs: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      })
    )
    // 2 * 1000 + 1 * 500 = 2500
    expect(useCartStore.getState().getSubtotal()).toBe(2500)
  })

  it('uses variant price for subtotal when variant exists', () => {
    useCartStore.getState().addItem(
      makeCartItem({
        quantity: 1,
        variant: {
          id: 'v-1',
          product_id: 'p-1',
          name: '256GB',
          sku: 'SKU001-256',
          price: 1500,
          stock: 5,
          attributes: { storage: '256GB' },
        },
      })
    )
    expect(useCartStore.getState().getSubtotal()).toBe(1500)
  })

  it('calculates item count across all items', () => {
    useCartStore.getState().addItem(makeCartItem({ quantity: 3 }))
    useCartStore.getState().addItem(
      makeCartItem({ product_id: 'p-2', quantity: 2 })
    )
    expect(useCartStore.getState().getItemCount()).toBe(5)
  })

  it('clears all items', () => {
    useCartStore.getState().addItem(makeCartItem())
    useCartStore.getState().addItem(
      makeCartItem({ product_id: 'p-2' })
    )
    useCartStore.getState().clearCart()
    expect(useCartStore.getState().items).toHaveLength(0)
  })
})

/* -------------------------------------------------------------------------- */
/*  Checkout Store                                                             */
/* -------------------------------------------------------------------------- */
describe('Checkout Store', () => {
  beforeEach(() => {
    useCheckoutStore.getState().reset()
  })

  it('initializes with default values', () => {
    const state = useCheckoutStore.getState()
    expect(state.step).toBe('address')
    expect(state.paymentMethod).toBe('cod')
    expect(state.deliveryCharge).toBe(0)
    expect(state.discount).toBe(0)
    expect(state.address.full_name).toBe('')
  })

  it('transitions steps', () => {
    useCheckoutStore.getState().setStep('payment')
    expect(useCheckoutStore.getState().step).toBe('payment')
    useCheckoutStore.getState().setStep('review')
    expect(useCheckoutStore.getState().step).toBe('review')
  })

  it('sets partial address', () => {
    useCheckoutStore.getState().setAddress({
      full_name: 'John',
      phone: '01700000000',
    })
    const addr = useCheckoutStore.getState().address
    expect(addr.full_name).toBe('John')
    expect(addr.phone).toBe('01700000000')
    // Other fields remain default
    expect(addr.street_address).toBe('')
  })

  it('sets payment method', () => {
    useCheckoutStore.getState().setPaymentMethod('bkash')
    expect(useCheckoutStore.getState().paymentMethod).toBe('bkash')
  })

  it('sets delivery charge', () => {
    useCheckoutStore.getState().setDeliveryCharge(120)
    expect(useCheckoutStore.getState().deliveryCharge).toBe(120)
  })

  it('sets coupon code and discount', () => {
    useCheckoutStore.getState().setCouponCode('SAVE10')
    useCheckoutStore.getState().setDiscount(500)
    expect(useCheckoutStore.getState().couponCode).toBe('SAVE10')
    expect(useCheckoutStore.getState().discount).toBe(500)
  })

  it('resets to initial state', () => {
    useCheckoutStore.getState().setStep('review')
    useCheckoutStore.getState().setPaymentMethod('nagad')
    useCheckoutStore.getState().setDeliveryCharge(150)
    useCheckoutStore.getState().reset()

    const state = useCheckoutStore.getState()
    expect(state.step).toBe('address')
    expect(state.paymentMethod).toBe('cod')
    expect(state.deliveryCharge).toBe(0)
  })
})

/* -------------------------------------------------------------------------- */
/*  Search Store                                                               */
/* -------------------------------------------------------------------------- */
describe('Search Store', () => {
  beforeEach(() => {
    useSearchStore.setState({ isOpen: false, query: '' })
  })

  it('initializes closed with empty query', () => {
    const state = useSearchStore.getState()
    expect(state.isOpen).toBe(false)
    expect(state.query).toBe('')
  })

  it('opens the search', () => {
    useSearchStore.getState().open()
    expect(useSearchStore.getState().isOpen).toBe(true)
  })

  it('closes and clears query', () => {
    useSearchStore.getState().open()
    useSearchStore.getState().setQuery('test')
    useSearchStore.getState().close()
    expect(useSearchStore.getState().isOpen).toBe(false)
    expect(useSearchStore.getState().query).toBe('')
  })

  it('updates query', () => {
    useSearchStore.getState().setQuery('iPhone')
    expect(useSearchStore.getState().query).toBe('iPhone')
  })
})
