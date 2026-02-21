'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CheckCircle,
  Package,
  Truck,
  Clock,
  CreditCard,
  MapPin,
  ArrowRight,
  Copy,
} from 'lucide-react'
import { useState } from 'react'
import { formatPrice, paymentMethodLabels, orderStatusLabels } from '@/lib/utils'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import type { Order } from '@/lib/types'

interface OrderConfirmationProps {
  order: Order
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const [copied, setCopied] = useState(false)

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.order_number)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const paymentInstructions: Record<string, string> = {
    cod: 'Pay in cash when your order is delivered.',
    bkash: 'Please complete payment via bKash within 30 minutes to confirm your order.',
    nagad: 'Please complete payment via Nagad within 30 minutes to confirm your order.',
    rocket: 'Please complete payment via Rocket within 30 minutes to confirm your order.',
    sslcommerz: 'You will be redirected to complete your card/bank payment.',
    amarpay: 'You will be redirected to complete your payment.',
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600'
      case 'shipped':
      case 'out_for_delivery': return 'text-blue-600'
      case 'cancelled':
      case 'returned': return 'text-red-600'
      default: return 'text-orange-600'
    }
  }

  return (
    <div className="pt-28 pb-20">
      <div className="container-wide max-w-3xl">
        {/* Success header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-5 bg-green-100 dark:bg-green-950/40 rounded-2xl flex items-center justify-center"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Thank you for your order. We&apos;ll notify you with updates.
          </p>
        </motion.div>

        {/* Order number */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">
                Order Number
              </p>
              <p className="text-xl font-bold tracking-tight">{order.order_number}</p>
            </div>
            <button
              onClick={copyOrderNumber}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </motion.div>

        {/* Status & payment info */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
        >
          <motion.div
            variants={staggerItem}
            className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[var(--color-text-tertiary)]" />
              <p className="text-sm font-medium">Order Status</p>
            </div>
            <p className={`text-sm font-semibold ${statusColor(order.status)}`}>
              {orderStatusLabels[order.status] || order.status}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
              Placed on{' '}
              {new Date(order.created_at).toLocaleDateString('en-BD', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-[var(--color-text-tertiary)]" />
              <p className="text-sm font-medium">Payment</p>
            </div>
            <p className="text-sm font-semibold">
              {paymentMethodLabels[order.payment_method] || order.payment_method}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
              {paymentInstructions[order.payment_method] || ''}
            </p>
          </motion.div>
        </motion.div>

        {/* Shipping address */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[var(--color-text-tertiary)]" />
            <p className="text-sm font-medium">Shipping Address</p>
          </div>
          <p className="text-sm font-semibold">{order.shipping_name}</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            {order.shipping_phone}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            {order.shipping_street}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {[order.shipping_upazila, order.shipping_district, order.shipping_division]
              .filter(Boolean)
              .join(', ')}
            {order.shipping_postal_code ? ` - ${order.shipping_postal_code}` : ''}
          </p>
        </motion.div>

        {/* Order items */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-[var(--color-text-tertiary)]" />
            <p className="text-sm font-medium">
              Items ({order.items?.length || 0})
            </p>
          </div>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-[var(--color-border)]/50 last:border-0"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <span className="text-sm font-semibold whitespace-nowrap">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order totals */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] mb-8"
        >
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Subtotal</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Delivery</span>
              <span className="font-medium">
                {order.delivery_charge === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  formatPrice(order.delivery_charge)
                )}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Discount</span>
                <span className="font-medium text-green-600">
                  −{formatPrice(order.discount)}
                </span>
              </div>
            )}
            <div className="pt-3 mt-3 border-t border-[var(--color-border)] flex justify-between">
              <span className="font-semibold text-base">Total</span>
              <span className="text-lg font-bold">{formatPrice(order.total)}</span>
            </div>
          </div>
        </motion.div>

        {/* Delivery info */}
        {order.delivery_zone && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-border)]/50 mb-8"
          >
            <Truck className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <div>
              <p className="text-sm font-medium">{order.delivery_zone.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Estimated delivery: {order.delivery_zone.est_days} business day
                {order.delivery_zone.est_days > 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-[var(--color-accent)] text-[var(--color-bg)] rounded-xl text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/account"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 border border-[var(--color-border)] rounded-xl text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
          >
            View All Orders
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
