'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { formatPrice, paymentMethodLabels } from '@/lib/utils'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import type { Division, District, Upazila, PaymentMethod } from '@/lib/types'

// Mock data for geography — replace with Supabase queries
const mockDivisions: Division[] = [
  { id: 1, name: 'Dhaka', bn_name: 'ঢাকা' },
  { id: 2, name: 'Chattogram', bn_name: 'চট্টগ্রাম' },
  { id: 3, name: 'Rajshahi', bn_name: 'রাজশাহী' },
  { id: 4, name: 'Khulna', bn_name: 'খুলনা' },
  { id: 5, name: 'Barishal', bn_name: 'বরিশাল' },
  { id: 6, name: 'Sylhet', bn_name: 'সিলেট' },
  { id: 7, name: 'Rangpur', bn_name: 'রংপুর' },
  { id: 8, name: 'Mymensingh', bn_name: 'ময়মনসিংহ' },
]

const mockDistricts: Record<number, District[]> = {
  1: [
    { id: 1, division_id: 1, name: 'Dhaka', bn_name: 'ঢাকা' },
    { id: 2, division_id: 1, name: 'Gazipur', bn_name: 'গাজীপুর' },
    { id: 3, division_id: 1, name: 'Narayanganj', bn_name: 'নারায়ণগঞ্জ' },
  ],
  2: [
    { id: 4, division_id: 2, name: 'Chattogram', bn_name: 'চট্টগ্রাম' },
    { id: 5, division_id: 2, name: "Cox's Bazar", bn_name: "কক্সবাজার" },
  ],
}

const steps = [
  { id: 'address' as const, label: 'Address', icon: MapPin },
  { id: 'payment' as const, label: 'Payment', icon: CreditCard },
  { id: 'review' as const, label: 'Review', icon: ClipboardCheck },
]

const paymentOptions: { method: PaymentMethod; label: string; description: string }[] = [
  { method: 'cod', label: 'Cash on Delivery', description: 'Pay when your order arrives' },
  { method: 'bkash', label: 'bKash', description: 'Pay securely with bKash mobile wallet' },
  { method: 'nagad', label: 'Nagad', description: 'Pay with your Nagad account' },
  { method: 'rocket', label: 'Rocket', description: 'Pay via DBBL Rocket' },
  { method: 'sslcommerz', label: 'Card / Net Banking', description: 'Visa, Mastercard, or internet banking via SSLCommerz' },
]

export function CheckoutFlow() {
  const { step, address, paymentMethod, deliveryCharge, setStep, setAddress, setPaymentMethod, setDeliveryCharge } = useCheckoutStore()
  const cartItems = useCartStore((s) => s.items)
  const getSubtotal = useCartStore((s) => s.getSubtotal)

  const [districts, setDistricts] = useState<District[]>([])
  const subtotal = getSubtotal()
  const total = subtotal + deliveryCharge

  // Load districts when division changes
  useEffect(() => {
    if (address.division_id) {
      setDistricts(mockDistricts[address.division_id] || [])
      setAddress({ district_id: null, upazila_id: null })
    }
  }, [address.division_id])

  // Calculate delivery charge based on division
  useEffect(() => {
    if (address.division_id === 1) {
      // Dhaka division
      if (address.district_id === 1) {
        setDeliveryCharge(subtotal >= 5000 ? 0 : 60) // Inside Dhaka
      } else {
        setDeliveryCharge(80) // Dhaka suburb
      }
    } else if (address.division_id) {
      setDeliveryCharge(120) // Outside Dhaka
    }
  }, [address.division_id, address.district_id, subtotal])

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
                        {mockDivisions.map((d) => (
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
                  {address.division_id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-border)]/50"
                    >
                      <Truck className="w-5 h-5 text-[var(--color-text-secondary)]" />
                      <div>
                        <p className="text-sm font-medium">
                          {address.division_id === 1 && address.district_id === 1
                            ? 'Inside Dhaka'
                            : address.division_id === 1
                            ? 'Dhaka Suburb'
                            : 'Outside Dhaka'}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          Delivery charge: {deliveryCharge === 0 ? 'Free' : formatPrice(deliveryCharge)}
                          {' · '}
                          {address.division_id === 1 && address.district_id === 1
                            ? 'Est. 1 business day'
                            : address.division_id === 1
                            ? 'Est. 2 business days'
                            : 'Est. 3-5 business days'}
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
                        <div className="w-14 h-14 bg-[var(--color-surface)] rounded-lg shrink-0 flex items-center justify-center">
                          <span className="text-[10px] text-[var(--color-text-tertiary)]">
                            IMG
                          </span>
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
              <button className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-semibold rounded-xl hover:bg-[var(--color-accent-hover)] transition-colors">
                <Check className="w-4 h-4" />
                Place Order
              </button>
            )}
          </div>
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
