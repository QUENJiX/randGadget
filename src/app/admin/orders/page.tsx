'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { orderStatusColors, orderStatusLabels, paymentMethodLabels } from '@/lib/utils'
import type { Order } from '@/lib/types'

const PAGE_SIZE = 20

const statusFilters = [
  'all',
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'returned',
]

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }

    let q = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (statusFilter !== 'all') {
      q = q.eq('status', statusFilter)
    }
    if (search.trim()) {
      q = q.or(`order_number.ilike.%${search.trim()}%,shipping_name.ilike.%${search.trim()}%,shipping_phone.ilike.%${search.trim()}%`)
    }

    const { data, count } = await q
    setOrders((data as Order[]) ?? [])
    setTotalCount(count ?? 0)
    setLoading(false)
  }, [page, statusFilter, search])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">{totalCount} total orders</p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            placeholder="Search order number, name, phone…"
            className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-bg-card)] border border-[var(--color-border)]/50 rounded-lg text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--color-text-tertiary)]" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}
            className="px-3 py-2.5 bg-[var(--color-bg-card)] border border-[var(--color-border)]/50 rounded-lg text-sm outline-none"
          >
            {statusFilters.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Statuses' : orderStatusLabels[s] || s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]/50 bg-[var(--color-bg-alt)]/50">
                <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)]">Order</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)] hidden md:table-cell">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)] hidden lg:table-cell">Payment</th>
                <th className="text-center px-4 py-3 font-medium text-[var(--color-text-secondary)]">Status</th>
                <th className="text-right px-4 py-3 font-medium text-[var(--color-text-secondary)]">Total</th>
                <th className="text-right px-4 py-3 font-medium text-[var(--color-text-secondary)] hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="h-4 w-36 bg-[var(--color-surface)] rounded" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 w-28 bg-[var(--color-surface)] rounded" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 w-16 bg-[var(--color-surface)] rounded" /></td>
                    <td className="px-4 py-3"><div className="h-5 w-20 bg-[var(--color-surface)] rounded-full mx-auto" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 bg-[var(--color-surface)] rounded ml-auto" /></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><div className="h-4 w-20 bg-[var(--color-surface)] rounded ml-auto" /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[var(--color-text-tertiary)]">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--color-bg-alt)]/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-[var(--color-accent)] hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm">{order.shipping_name}</p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">{order.shipping_phone}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-sm">{paymentMethodLabels[order.payment_method] || order.payment_method}</p>
                      <p className={`text-xs capitalize ${order.payment_status === 'paid' ? 'text-green-600 dark:text-green-400' : order.payment_status === 'failed' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {order.payment_status}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${orderStatusColors[order.status] || 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-800/30'}`}>
                        {orderStatusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3 text-right text-[var(--color-text-secondary)] hidden sm:table-cell">
                      {new Date(order.created_at).toLocaleDateString('en-BD')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]/50">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-1.5 rounded hover:bg-[var(--color-bg-alt)] disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded hover:bg-[var(--color-bg-alt)] disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
