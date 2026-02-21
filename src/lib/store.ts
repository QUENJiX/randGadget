import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'
import type { CartItem, PaymentMethod, CheckoutAddress } from '@/lib/types'

/* ============================================================================
   Cart Store — persisted to localStorage, synced to Supabase for logged-in users
   ============================================================================ */

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId?: string | null) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void
  clearCart: () => void
  getSubtotal: () => number
  getItemCount: () => number
  syncToServer: () => Promise<void>
  loadFromServer: () => Promise<void>
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

      syncToServer: async () => {
        const supabase = createClient()
        if (!supabase) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get or create cart
        let { data: cart } = await supabase
          .from('carts')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (!cart) {
          const { data: newCart } = await supabase
            .from('carts')
            .insert({ user_id: user.id })
            .select('id')
            .single()
          cart = newCart
        }

        if (!cart) return

        // Clear server cart items and re-insert from local
        await supabase.from('cart_items').delete().eq('cart_id', cart.id)

        const items = get().items
        if (items.length > 0) {
          await supabase.from('cart_items').insert(
            items.map((item) => ({
              cart_id: cart.id,
              product_id: item.product_id,
              variant_id: item.variant_id,
              quantity: item.quantity,
            }))
          )
        }
      },

      loadFromServer: async () => {
        const supabase = createClient()
        if (!supabase) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: cart } = await supabase
          .from('carts')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (!cart) return

        const { data: serverItems } = await supabase
          .from('cart_items')
          .select(`
            id,
            product_id,
            variant_id,
            quantity,
            product:products(*, brand:brands(*), category:categories(*), images:product_images(*)),
            variant:product_variants(*)
          `)
          .eq('cart_id', cart.id)

        if (!serverItems || serverItems.length === 0) return

        const localItems = get().items
        // Merge: local items take precedence, add server-only items
        const merged = [...localItems]
        for (const si of serverItems) {
          const exists = merged.find(
            (li) => li.product_id === si.product_id && li.variant_id === si.variant_id
          )
          if (!exists && si.product) {
            merged.push({
              id: si.id,
              product_id: si.product_id,
              variant_id: si.variant_id,
              quantity: si.quantity,
              product: si.product as any,
              variant: si.variant as any || undefined,
            })
          }
        }

        if (merged.length !== localItems.length) {
          set({ items: merged })
        }
      },
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
