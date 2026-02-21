'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { orderStatusColors, orderStatusLabels } from '@/lib/utils'
import type { Order, Product } from '@/lib/types'

interface DashboardStats {
  revenue: number
  ordersToday: number
  totalProducts: number
  totalCustomers: number
  recentOrders: Order[]
  lowStockProducts: Product[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    revenue: 0,
    ordersToday: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    lowStockProducts: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      if (!supabase) { setLoading(false); return }

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const [
        ordersRes,
        ordersTodayRes,
        productsRes,
        customersRes,
        recentRes,
        lowStockRes,
      ] = await Promise.all([
        supabase.from('orders').select('total').eq('payment_status', 'paid'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('*, brand:brands(name), category:categories(name)').lte('stock', 5).eq('is_active', true).order('stock', { ascending: true }).limit(5),
      ])

      const revenue = (ordersRes.data as { total: number }[] | null)?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0

      setStats({
        revenue,
        ordersToday: ordersTodayRes.count ?? 0,
        totalProducts: productsRes.count ?? 0,
        totalCustomers: customersRes.count ?? 0,
        recentOrders: (recentRes.data as Order[]) ?? [],
        lowStockProducts: (lowStockRes.data as Product[]) ?? [],
      })
      setLoading(false)
    }

    load()
  }, [])

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatPrice(stats.revenue),
      icon: DollarSign,
      color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/30',
      href: '/admin/analytics',
    },
    {
      label: 'Orders Today',
      value: stats.ordersToday.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30',
      href: '/admin/orders',
    },
    {
      label: 'Active Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/30',
      href: '/admin/products',
    },
    {
      label: 'Customers',
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30',
      href: '/admin/customers',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="p-4 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon className="w-[18px] h-[18px]" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-[var(--color-text-tertiary)]" />
            </div>
            <p className="text-xs text-[var(--color-text-tertiary)] mb-0.5">{card.label}</p>
            <p className="text-lg font-bold tracking-tight">
              {loading ? <span className="inline-block w-16 h-5 bg-[var(--color-surface)] rounded animate-pulse" /> : card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]/50">
            <h2 className="font-semibold text-sm">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[var(--color-border)]/50">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-5 py-3 animate-pulse flex items-center justify-between">
                  <div className="space-y-1.5">
                    <div className="h-3 w-32 bg-[var(--color-surface)] rounded" />
                    <div className="h-2.5 w-20 bg-[var(--color-surface)] rounded" />
                  </div>
                  <div className="h-3 w-16 bg-[var(--color-surface)] rounded" />
                </div>
              ))
            ) : stats.recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[var(--color-text-tertiary)] text-center">No orders yet</p>
            ) : (
              stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-[var(--color-bg-alt)]/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{order.order_number}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {order.shipping_name} · {new Date(order.created_at).toLocaleDateString('en-BD')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                    <span
                      className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        orderStatusColors[order.status] || 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-800/30'
                      }`}
                    >
                      {orderStatusLabels[order.status] || order.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]/50">
            <h2 className="font-semibold text-sm inline-flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Low Stock
            </h2>
            <Link
              href="/admin/products"
              className="text-xs text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
            >
              All products <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[var(--color-border)]/50">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-5 py-3 animate-pulse">
                  <div className="h-3 w-40 bg-[var(--color-surface)] rounded mb-1.5" />
                  <div className="h-2.5 w-16 bg-[var(--color-surface)] rounded" />
                </div>
              ))
            ) : stats.lowStockProducts.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[var(--color-text-tertiary)] text-center">All stocked up!</p>
            ) : (
              stats.lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products`}
                  className="block px-5 py-3 hover:bg-[var(--color-bg-alt)]/50 transition-colors"
                >
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs mt-0.5">
                    <span className={`font-medium ${product.stock <= 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {product.stock <= 0 ? 'Out of stock' : `${product.stock} left`}
                    </span>
                    <span className="text-[var(--color-text-tertiary)]"> · {formatPrice(product.price)}</span>
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
