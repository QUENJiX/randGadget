'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  MapPin,
  CreditCard,
  ClipboardCheck,
  ChevronRight,
  Check,
  Truck,
  ArrowLeft,
} from 'lucide-react'
import { useCartStore, useCheckoutStore } from '@/lib/store'
import { formatPrice, paymentMethodLabels, productImageUrl, BLUR_PLACEHOLDER } from '@/lib/utils'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { createClient } from '@/lib/supabase/client'
import type { Division, District, Upazila, DeliveryZone, PaymentMethod } from '@/lib/types'

const steps = [
  { id: 'address' as const, label: 'Address', icon: MapPin },
  { id: 'payment' as const, label: 'Payment', icon: CreditCard },
  { id: 'review' as const, label: 'Review', icon: ClipboardCheck },
]

const paymentOptions: { method: PaymentMethod; label: string; description: string }[] = [
  { method: 'cod', label: 'Cash on Delivery', description: 'Pay when your order arrives · ৳20 COD fee' },
  { method: 'bkash', label: 'bKash', description: 'Pay securely with bKash mobile wallet' },
  { method: 'nagad', label: 'Nagad', description: 'Pay with your Nagad account' },
  { method: 'rocket', label: 'Rocket', description: 'Pay via DBBL Rocket' },
  { method: 'sslcommerz', label: 'Card / Net Banking', description: 'Visa, Mastercard, or internet banking via SSLCommerz' },
]

const COD_FEE = 20

export function CheckoutFlow() {
  const { step, address, paymentMethod, deliveryCharge, setStep, setAddress, setPaymentMethod, setDeliveryCharge } = useCheckoutStore()
  const cartItems = useCartStore((s) => s.items)
  const getSubtotal = useCartStore((s) => s.getSubtotal)
  const clearCart = useCartStore((s) => s.clearCart)
  const resetCheckout = useCheckoutStore((s) => s.reset)
  const router = useRouter()

  const [divisions, setDivisions] = useState<Division[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [upazilas, setUpazilas] = useState<Upazila[]>([])
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone | null>(null)
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const subtotal = getSubtotal()
  const codFee = paymentMethod === 'cod' ? COD_FEE : 0
  const total = subtotal + deliveryCharge + codFee

  // Load divisions on mount
  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase.from('divisions').select('*').order('name').then(({ data }: { data: Division[] | null }) => {
      if (data) setDivisions(data)
    })
  }, [])

  // Load districts when division changes
  useEffect(() => {
    if (!address.division_id) { setDistricts([]); return }
    const supabase = createClient()
    if (!supabase) return
    supabase
      .from('districts')
      .select('*')
      .eq('division_id', address.division_id)
      .order('name')
      .then(({ data }: { data: District[] | null }) => {
        if (data) setDistricts(data)
      })
    setAddress({ district_id: null, upazila_id: null })
    setUpazilas([])
    setDeliveryZone(null)
  }, [address.division_id])

  // Load upazilas when district changes
  useEffect(() => {
    if (!address.district_id) { setUpazilas([]); return }
    const supabase = createClient()
    if (!supabase) return
    supabase
      .from('upazilas')
      .select('*')
      .eq('district_id', address.district_id)
      .order('name')
      .then(({ data }: { data: Upazila[] | null }) => {
        if (data) setUpazilas(data)
      })
    setAddress({ upazila_id: null })
    setDeliveryZone(null)
  }, [address.district_id])

  // Look up delivery zone when upazila changes
  useEffect(() => {
    if (!address.upazila_id) { setDeliveryZone(null); setDeliveryCharge(0); return }
    const supabase = createClient()
    if (!supabase) return
    supabase
      .from('upazila_zone_map')
      .select('delivery_zone_id, delivery_zones(*)')
      .eq('upazila_id', address.upazila_id)
      .single()
      .then(({ data }: { data: any }) => {
        if (data?.delivery_zones) {
          const zone = data.delivery_zones as unknown as DeliveryZone
          setDeliveryZone(zone)
          // Free delivery for Inside Dhaka on orders ≥ ৳5,000
          const charge = zone.name === 'Inside Dhaka' && subtotal >= 5000 ? 0 : zone.base_charge
          setDeliveryCharge(charge)
        }
      })
  }, [address.upazila_id, subtotal])

  const canAdvance = () => {
    if (step === 'address') {
      return address.full_name && address.phone && address.division_id && address.district_id && address.street_address
    }
    return true
  }

  const nextStep = () => {
    if (step === 'address') setStep('payment')
    else if (step === 'payment') setStep('review')
  }

  const prevStep = () => {
    if (step === 'payment') setStep('address')
    else if (step === 'review') setStep('payment')
  }

  const handlePlaceOrder = async () => {
    setOrderLoading(true)
    setOrderError(null)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
          })),
          address,
          payment_method: paymentMethod,
          delivery_charge: deliveryCharge,
          cod_fee: codFee,
          delivery_zone_id: deliveryZone?.id || null,
          notes: '',
          guest_phone: address.phone,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setOrderError(data.error || 'Something went wrong. Please try again.')
        setOrderLoading(false)
        return
      }

      // Success — clear cart and redirect to confirmation
      clearCart()
      resetCheckout()
      router.push(`/order/${data.order_id}`)
    } catch {
      setOrderError('Network error. Please check your connection and try again.')
    } finally {
      setOrderLoading(false)
    }
  }

  return (
    <div className="container-wide py-8 md:py-12">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-12">
        {steps.map((s, i) => {
          const stepIndex = steps.findIndex((x) => x.id === step)
          const isActive = s.id === step
          const isDone = i < stepIndex

          return (
            <div key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => isDone && setStep(s.id)}
                disabled={!isDone}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                    : isDone
                    ? 'bg-[var(--color-accent-subtle)] text-[var(--color-text)] cursor-pointer'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-tertiary)] cursor-default'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <s.icon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)]" />
              )}
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 'address' && (
              <motion.div
                key="address"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

                <div className="space-y-5">
                  {/* Name & phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={address.full_name}
                        onChange={(e) => setAddress({ full_name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({ phone: e.target.value })}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Division & District */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Division
                      </label>
                      <select
                        value={address.division_id || ''}
                        onChange={(e) =>
                          setAddress({ division_id: Number(e.target.value) || null })
                        }
                        className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
                      >
                        <option value="">Select Division</option>
                        {divisions.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.bn_name})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        District
                      </label>
                      <select
                        value={address.district_id || ''}
                        onChange={(e) =>
                          setAddress({ district_id: Number(e.target.value) || null })
                        }
                        disabled={!address.division_id}
                        className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-50"
                      >
                        <option value="">Select District</option>
                        {districts.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Upazila */}
                  <div className="max-w-sm">
                    <label className="block text-sm font-medium mb-1.5">
                      Upazila / Thana
                    </label>
                    <select
                      value={address.upazila_id || ''}
                      onChange={(e) =>
                        setAddress({ upazila_id: Number(e.target.value) || null })
                      }
                      disabled={!address.district_id}
                      className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-50"
                    >
                      <option value="">Select Upazila</option>
                      {upazilas.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Street address */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Street Address
                    </label>
                    <textarea
                      value={address.street_address}
                      onChange={(e) => setAddress({ street_address: e.target.value })}
                      placeholder="House no., Road, Area (e.g., House 12, Road 7, Block D, Bashundhara R/A)"
                      rows={3}
                      className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                    />
                  </div>

                  {/* Postal code */}
                  <div className="max-w-xs">
                    <label className="block text-sm font-medium mb-1.5">
                      Postal Code (optional)
                    </label>
                    <input
                      type="text"
                      value={address.postal_code}
                      onChange={(e) => setAddress({ postal_code: e.target.value })}
                      placeholder="1229"
                      className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
                    />
                  </div>

                  {/* Delivery zone indicator */}
                  {deliveryZone && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-border)]/50"
                    >
                      <Truck className="w-5 h-5 text-[var(--color-text-secondary)]" />
                      <div>
                        <p className="text-sm font-medium">
                          {deliveryZone.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          Delivery charge: {deliveryCharge === 0 ? 'Free' : formatPrice(deliveryCharge)}
                          {' · '}
                          Est. {deliveryZone.est_days} business day{deliveryZone.est_days > 1 ? 's' : ''}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                key="payment"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {paymentOptions.map((option) => (
                    <motion.label
                      key={option.method}
                      variants={staggerItem}
                      className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === option.method
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                          : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.method}
                        checked={paymentMethod === option.method}
                        onChange={() => setPaymentMethod(option.method)}
                        className="mt-0.5 w-4 h-4 accent-[var(--color-accent)]"
                      />
                      <div>
                        <p className="text-sm font-semibold">{option.label}</p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                          {option.description}
                        </p>
                      </div>
                    </motion.label>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {step === 'review' && (
              <motion.div
                key="review"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-xl font-semibold mb-6">Order Review</h2>

                {/* Address summary */}
                <div className="p-5 rounded-xl border border-[var(--color-border)] mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Shipping to</p>
                    <button
                      onClick={() => setStep('address')}
                      className="text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm">{address.full_name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {address.phone}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {address.street_address}
                  </p>
                </div>

                {/* Payment summary */}
                <div className="p-5 rounded-xl border border-[var(--color-border)] mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Payment</p>
                    <button
                      onClick={() => setStep('payment')}
                      className="text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm">
                    {paymentMethodLabels[paymentMethod]}
                  </p>
                </div>

                {/* Items */}
                <div className="p-5 rounded-xl border border-[var(--color-border)]">
                  <p className="text-sm font-semibold mb-4">
                    Items ({cartItems.length})
                  </p>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={`${item.product_id}-${item.variant_id}`}
                        className="flex items-center gap-4"
                      >
                        <div className="w-14 h-14 bg-[var(--color-surface)] rounded-lg shrink-0 overflow-hidden relative">
                          {(() => {
                            const src = productImageUrl(item.product)
                            return src ? (
                              <Image
                                src={src}
                                alt={item.product.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                                placeholder="blur"
                                blurDataURL={BLUR_PLACEHOLDER}
                              />
                            ) : (
                              <span className="text-[10px] text-[var(--color-text-tertiary)] flex items-center justify-center w-full h-full">IMG</span>
                            )
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatPrice(
                            (item.variant?.price ?? item.product.price) *
                              item.quantity
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8">
            {step !== 'address' ? (
              <button
                onClick={prevStep}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step !== 'review' ? (
              <button
                onClick={nextStep}
                disabled={!canAdvance()}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-semibold rounded-xl hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={orderLoading}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-semibold rounded-xl hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {orderLoading ? (
                  <span className="w-4 h-4 border-2 border-[var(--color-bg)]/30 border-t-[var(--color-bg)] rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {orderLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            )}
          </div>

          {orderError && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
              {orderError}
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <h3 className="text-base font-semibold mb-5">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Delivery</span>
                <span className="font-medium">
                  {deliveryCharge === 0 ? (
                    <span className="text-[var(--color-success)]">Free</span>
                  ) : (
                    formatPrice(deliveryCharge)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Discount</span>
                <span className="font-medium">৳0</span>
              </div>
              {codFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">COD Fee</span>
                  <span className="font-medium">{formatPrice(codFee)}</span>
                </div>
              )}
              <div className="pt-3 mt-3 border-t border-[var(--color-border)] flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-5">
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
                />
                <button className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm font-medium hover:bg-[var(--color-border)] transition-colors">
                  Apply
                </button>
              </div>
            </div>

            {/* Delivery info */}
            <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
              <div className="flex items-start gap-2.5 text-xs text-[var(--color-text-secondary)]">
                <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[var(--color-text)]">Delivery Info</p>
                  <p className="mt-0.5">Inside Dhaka: ৳60 (Free over ৳5,000)</p>
                  <p>Outside Dhaka: ৳120</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
