'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Search, Truck, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import { fadeUp } from '@/lib/animations'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import type { Order } from '@/lib/types'

const statusSteps = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
]

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setOrder(null)

    if (!orderNumber.trim()) { setError('Please enter your order number.'); return }

    setLoading(true)
    const supabase = createClient()
    if (!supabase) { setError('Service unavailable. Please try again later.'); setLoading(false); return }

    let q = supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber.trim().toUpperCase())

    if (phone.trim()) {
      q = q.eq('shipping_phone', phone.trim())
    }

    const { data, error: dbError } = await q.maybeSingle()

    if (dbError || !data) {
      setError('Order not found. Please check your order number and try again.')
    } else {
      setOrder(data as Order)
    }
    setLoading(false)
  }

  const currentStepIndex = order
    ? statusSteps.findIndex((s) => s.key === order.status)
    : -1

  return (
    <div className="pt-28 pb-20">
      <div className="container-wide max-w-2xl">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--color-accent-subtle)] flex items-center justify-center">
            <Package className="w-7 h-7 text-[var(--color-accent)]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Track Your Order</h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Enter your order number to see the latest status.
          </p>
        </motion.div>

        {/* Search form */}
        <motion.form
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          onSubmit={handleTrack}
          className="p-6 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)]/50 mb-8"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Order Number</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. GBD-20260221-XXXX"
                className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Phone Number <span className="text-[var(--color-text-tertiary)] font-normal">(optional)</span></label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 01700000000"
                className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--color-accent)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Track Order
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Order result */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)]/50"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider">Order</p>
                <p className="font-semibold">{order.order_number}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider">Total</p>
                <p className="font-semibold">{formatPrice(order.total)}</p>
              </div>
            </div>

            {/* Progress steps */}
            <div className="flex items-center justify-between mb-6">
              {statusSteps.map((step, i) => {
                const isActive = i <= currentStepIndex
                const Icon = step.icon
                return (
                  <div key={step.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-[var(--color-success)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-tertiary)]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] mt-1.5 ${isActive ? 'text-[var(--color-success)] font-medium' : 'text-[var(--color-text-tertiary)]'}`}>
                        {step.label}
                      </span>
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mt-[-16px] ${
                        i < currentStepIndex ? 'bg-[var(--color-success)]' : 'bg-[var(--color-surface)]'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]/50 text-sm">
              <div>
                <p className="text-[var(--color-text-tertiary)] text-xs mb-0.5">Payment</p>
                <p className="font-medium uppercase">{order.payment_method}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-tertiary)] text-xs mb-0.5">Payment Status</p>
                <p className="font-medium capitalize">{order.payment_status}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-tertiary)] text-xs mb-0.5">Shipping To</p>
                <p className="font-medium">{order.shipping_district}, {order.shipping_division}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-tertiary)] text-xs mb-0.5">Placed</p>
                <p className="font-medium">{new Date(order.created_at).toLocaleDateString('en-BD')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
