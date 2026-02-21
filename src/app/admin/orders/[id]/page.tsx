'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Truck,
  CreditCard,
  MapPin,
  Package,
  Printer,
  Save,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import {
  orderStatusColors,
  orderStatusLabels,
  paymentMethodLabels,
} from '@/lib/utils'
import type { Order, OrderItem } from '@/lib/types'

const statusOptions = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'returned',
]

const paymentStatusOptions = ['unpaid', 'pending', 'paid', 'failed', 'refunded']

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [newPaymentStatus, setNewPaymentStatus] = useState('')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      if (!supabase) { setLoading(false); return }

      const [orderRes, itemsRes] = await Promise.all([
        supabase.from('orders').select('*').eq('id', id).single(),
        supabase.from('order_items').select('*').eq('order_id', id),
      ])

      if (orderRes.data) {
        const o = orderRes.data as Order
        setOrder(o)
        setNewStatus(o.status)
        setNewPaymentStatus(o.payment_status)
      }
      if (itemsRes.data) setItems(itemsRes.data as OrderItem[])
      setLoading(false)
    }

    load()
  }, [id])

  const handleSave = async () => {
    if (!order) return
    setSaving(true)
    const supabase = createClient()
    if (!supabase) { setSaving(false); return }

    await supabase
      .from('orders')
      .update({
        status: newStatus,
        payment_status: newPaymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    setOrder({ ...order, status: newStatus as Order['status'], payment_status: newPaymentStatus as Order['payment_status'] })
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-[var(--color-surface)] rounded" />
        <div className="h-64 bg-[var(--color-surface)] rounded-xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium mb-2">Order not found</p>
        <Link href="/admin/orders" className="text-sm text-[var(--color-accent)] hover:underline">
          Back to orders
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to orders
          </Link>
          <h1 className="text-xl font-bold tracking-tight">{order.order_number}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Placed {new Date(order.created_at).toLocaleString('en-BD')}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-bg-alt)] transition-colors"
        >
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50">
            <div className="px-5 py-4 border-b border-[var(--color-border)]/50">
              <h2 className="font-semibold text-sm inline-flex items-center gap-2">
                <Package className="w-4 h-4" /> Items ({items.length})
              </h2>
            </div>
            <div className="divide-y divide-[var(--color-border)]/50">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-[var(--color-border)]/50 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Delivery</span>
                <span>{formatPrice(order.delivery_charge)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Discount</span>
                  <span className="text-green-600">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-[var(--color-border)]/50">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 p-5">
            <h2 className="font-semibold text-sm inline-flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4" /> Shipping Address
            </h2>
            <div className="text-sm space-y-1 text-[var(--color-text-secondary)]">
              <p className="font-medium text-[var(--color-text)]">{order.shipping_name}</p>
              <p>{order.shipping_phone}</p>
              <p>{order.shipping_street}</p>
              <p>{order.shipping_upazila}, {order.shipping_district}</p>
              <p>{order.shipping_division}{order.shipping_postal_code ? ` — ${order.shipping_postal_code}` : ''}</p>
            </div>
            {order.notes && (
              <div className="mt-4 p-3 bg-[var(--color-bg-alt)] rounded-lg text-sm text-[var(--color-text-secondary)]">
                <strong>Notes:</strong> {order.notes}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status update */}
          <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 p-5 space-y-4">
            <h2 className="font-semibold text-sm inline-flex items-center gap-2">
              <Truck className="w-4 h-4" /> Update Status
            </h2>
            <div>
              <label className="block text-sm font-medium mb-1.5">Order Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm outline-none"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{orderStatusLabels[s] || s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Payment Status</label>
              <select
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm outline-none"
              >
                {paymentStatusOptions.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || (newStatus === order.status && newPaymentStatus === order.payment_status)}
              className="w-full py-2.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>

          {/* Payment info */}
          <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 p-5 space-y-3">
            <h2 className="font-semibold text-sm inline-flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Payment
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Method</span>
                <span className="font-medium">{paymentMethodLabels[order.payment_method] || order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Status</span>
                <span className={`font-medium capitalize ${
                  order.payment_status === 'paid' ? 'text-green-600' :
                  order.payment_status === 'failed' ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {order.payment_status}
                </span>
              </div>
              {order.payment_tx_id && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">TX ID</span>
                  <span className="font-mono text-xs">{order.payment_tx_id}</span>
                </div>
              )}
            </div>
          </div>

          {/* Current status badge */}
          <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 p-5 text-center">
            <span className={`inline-block text-sm font-medium px-4 py-2 rounded-full ${orderStatusColors[order.status] || 'text-stone-600 bg-stone-50'}`}>
              {orderStatusLabels[order.status] || order.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
