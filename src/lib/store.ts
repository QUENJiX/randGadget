import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, PaymentMethod, CheckoutAddress } from '@/lib/types'

/* ============================================================================
   Cart Store — persisted to localStorage
   ============================================================================ */

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId?: string | null) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void
  clearCart: () => void
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const existingIndex = items.findIndex(
          (i) => i.product_id === item.product_id && i.variant_id === item.variant_id
        )

        if (existingIndex > -1) {
          const updated = [...items]
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + item.quantity,
          }
          set({ items: updated })
        } else {
          set({ items: [...items, item] })
        }
      },

      removeItem: (productId, variantId = null) => {
        set({
          items: get().items.filter(
            (i) => !(i.product_id === productId && i.variant_id === variantId)
          ),
        })
      },

      updateQuantity: (productId, quantity, variantId = null) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.product_id === productId && i.variant_id === variantId
              ? { ...i, quantity }
              : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () =>
        get().items.reduce((sum, item) => {
          const price = item.variant?.price ?? item.product.price
          return sum + price * item.quantity
        }, 0),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'gadgetbd-cart' }
  )
)

/* ============================================================================
   Checkout Store
   ============================================================================ */

interface CheckoutStore {
  step: 'address' | 'payment' | 'review'
  address: CheckoutAddress
  paymentMethod: PaymentMethod
  deliveryCharge: number
  couponCode: string
  discount: number
  notes: string
  setStep: (step: CheckoutStore['step']) => void
  setAddress: (address: Partial<CheckoutAddress>) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setDeliveryCharge: (charge: number) => void
  setCouponCode: (code: string) => void
  setDiscount: (discount: number) => void
  setNotes: (notes: string) => void
  reset: () => void
}

const initialAddress: CheckoutAddress = {
  full_name: '',
  phone: '',
  division_id: null,
  district_id: null,
  upazila_id: null,
  street_address: '',
  postal_code: '',
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  step: 'address',
  address: initialAddress,
  paymentMethod: 'cod',
  deliveryCharge: 0,
  couponCode: '',
  discount: 0,
  notes: '',
  setStep: (step) => set({ step }),
  setAddress: (address) =>
    set((s) => ({ address: { ...s.address, ...address } })),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setDeliveryCharge: (deliveryCharge) => set({ deliveryCharge }),
  setCouponCode: (couponCode) => set({ couponCode }),
  setDiscount: (discount) => set({ discount }),
  setNotes: (notes) => set({ notes }),
  reset: () =>
    set({
      step: 'address',
      address: initialAddress,
      paymentMethod: 'cod',
      deliveryCharge: 0,
      couponCode: '',
      discount: 0,
      notes: '',
    }),
}))

/* ============================================================================
   Search Store
   ============================================================================ */

interface SearchStore {
  isOpen: boolean
  query: string
  open: () => void
  close: () => void
  setQuery: (query: string) => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  isOpen: false,
  query: '',
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, query: '' }),
  setQuery: (query) => set({ query }),
}))
