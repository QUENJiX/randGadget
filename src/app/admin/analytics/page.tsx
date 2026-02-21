'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3, TrendingUp, ShoppingBag, DollarSign, Package, Users,
  ArrowUp, ArrowDown,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'

interface DailySales {
  date: string
  revenue: number
  orders: number
}

interface TopProduct {
  name: string
  quantity: number
  revenue: number
}

interface StatusBreakdown {
  status: string
  count: number
}

export default function AdminAnalytics() {
  const [period, setPeriod] = useState<7 | 30 | 90>(30)
  const [dailySales, setDailySales] = useState<DailySales[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdown[]>([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    newCustomers: 0,
    prevRevenue: 0,
    prevOrders: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const supabase = createClient()
      if (!supabase) { setLoading(false); return }

      const now = new Date()
      const start = new Date(now)
      start.setDate(start.getDate() - period)
      const prevStart = new Date(start)
      prevStart.setDate(prevStart.getDate() - period)

      const startISO = start.toISOString()
      const prevStartISO = prevStart.toISOString()

      // Current-period orders
      const { data: currentOrders } = await supabase
        .from('orders')
        .select('id, total, created_at, status')
        .gte('created_at', startISO)

      // Previous-period orders (for comparison)
      const { data: prevOrders } = await supabase
        .from('orders')
        .select('id, total')
        .gte('created_at', prevStartISO)
        .lt('created_at', startISO)

      // Order items for top products
      const currentIds = (currentOrders || []).map((o: { id: string }) => o.id)
      let orderItems: { name: string; quantity: number; price: number }[] = []
      if (currentIds.length > 0) {
        const { data } = await supabase
          .from('order_items')
          .select('name, quantity, price')
          .in('order_id', currentIds)
        if (data) orderItems = data as typeof orderItems
      }

      // New customers in period
      const { count: newCustomerCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startISO)

      // Current period stats
      const currRev = (currentOrders || []).reduce((s: number, o: { total: number }) => s + o.total, 0)
      const currCount = (currentOrders || []).length
      const prevRev = (prevOrders || []).reduce((s: number, o: { total: number }) => s + o.total, 0)
      const prevCount = (prevOrders || []).length

      setStats({
        totalRevenue: currRev,
        totalOrders: currCount,
        avgOrderValue: currCount > 0 ? currRev / currCount : 0,
        newCustomers: newCustomerCount ?? 0,
        prevRevenue: prevRev,
        prevOrders: prevCount,
      })

      // Daily sales aggregation
      const dailyMap: Record<string, { revenue: number; orders: number }> = {}
      for (const o of (currentOrders || []) as { total: number; created_at: string }[]) {
        const day = o.created_at.slice(0, 10)
        if (!dailyMap[day]) dailyMap[day] = { revenue: 0, orders: 0 }
        dailyMap[day].revenue += o.total
        dailyMap[day].orders++
      }
      // Fill all days
      const days: DailySales[] = []
      const d = new Date(start)
      while (d <= now) {
        const key = d.toISOString().slice(0, 10)
        days.push({ date: key, revenue: dailyMap[key]?.revenue ?? 0, orders: dailyMap[key]?.orders ?? 0 })
        d.setDate(d.getDate() + 1)
      }
      setDailySales(days)

      // Top products
      const prodMap: Record<string, { quantity: number; revenue: number }> = {}
      for (const item of orderItems) {
        if (!prodMap[item.name]) prodMap[item.name] = { quantity: 0, revenue: 0 }
        prodMap[item.name].quantity += item.quantity
        prodMap[item.name].revenue += item.price * item.quantity
      }
      const top = Object.entries(prodMap)
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)
      setTopProducts(top)

      // Status breakdown
      const statusMap: Record<string, number> = {}
      for (const o of (currentOrders || []) as { status: string }[]) {
        statusMap[o.status] = (statusMap[o.status] || 0) + 1
      }
      setStatusBreakdown(
        Object.entries(statusMap)
          .map(([status, count]) => ({ status, count }))
          .sort((a, b) => b.count - a.count)
      )

      setLoading(false)
    }

    load()
  }, [period])

  const pctChange = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0
    return ((curr - prev) / prev) * 100
  }

  const revChange = pctChange(stats.totalRevenue, stats.prevRevenue)
  const orderChange = pctChange(stats.totalOrders, stats.prevOrders)

  const maxRevenue = Math.max(...dailySales.map((d) => d.revenue), 1)

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500',
    confirmed: 'bg-blue-500',
    processing: 'bg-indigo-500',
    shipped: 'bg-purple-500',
    out_for_delivery: 'bg-cyan-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
    returned: 'bg-stone-500',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Sales performance overview</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg">
          {([7, 30, 90] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                period === p
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {p}D
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-[var(--color-surface)] rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: 'Revenue',
                value: formatPrice(stats.totalRevenue),
                icon: DollarSign,
                change: revChange,
                color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/30',
              },
              {
                label: 'Orders',
                value: stats.totalOrders.toString(),
                icon: ShoppingBag,
                change: orderChange,
                color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30',
              },
              {
                label: 'Avg Order Value',
                value: formatPrice(stats.avgOrderValue),
                icon: TrendingUp,
                change: null,
                color: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/30',
              },
              {
                label: 'New Customers',
                value: stats.newCustomers.toString(),
                icon: Users,
                change: null,
                color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30',
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    {s.label}
                  </span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
                {s.change !== null && (
                  <p className={`text-xs mt-1 inline-flex items-center gap-0.5 font-medium ${
                    s.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {s.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(s.change).toFixed(1)}% vs prev {period}d
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Revenue chart (CSS bar chart) */}
          <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 p-5 mb-6">
            <h2 className="font-semibold text-sm inline-flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4" /> Daily Revenue
            </h2>
            <div className="flex items-end gap-[2px] h-40">
              {dailySales.map((d) => {
                const h = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0
                return (
                  <div
                    key={d.date}
                    className="group relative flex-1 min-w-0"
                    title={`${d.date}: ${formatPrice(d.revenue)} (${d.orders} orders)`}
                  >
                    <div
                      className="w-full bg-[var(--color-accent)]/70 hover:bg-[var(--color-accent)] rounded-t transition-colors"
                      style={{ height: `${Math.max(h, 1)}%` }}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 dark:bg-slate-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10 pointer-events-none">
                      <p className="font-semibold">{formatPrice(d.revenue)}</p>
                      <p className="opacity-70">{d.orders} orders · {d.date}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-[var(--color-text-tertiary)]">
              <span>{dailySales[0]?.date}</span>
              <span>{dailySales[dailySales.length - 1]?.date}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top products */}
            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50">
              <div className="px-5 py-4 border-b border-[var(--color-border)]/50">
                <h2 className="font-semibold text-sm inline-flex items-center gap-2">
                  <Package className="w-4 h-4" /> Top Products
                </h2>
              </div>
              {topProducts.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-[var(--color-text-tertiary)]">
                  No sales data yet
                </p>
              ) : (
                <div className="divide-y divide-[var(--color-border)]/50">
                  {topProducts.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-3 px-5 py-3">
                      <span className="text-xs font-bold text-[var(--color-text-tertiary)] w-5">
                        #{i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">{p.quantity} units sold</p>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(p.revenue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order status breakdown */}
            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50">
              <div className="px-5 py-4 border-b border-[var(--color-border)]/50">
                <h2 className="font-semibold text-sm inline-flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Order Status Breakdown
                </h2>
              </div>
              {statusBreakdown.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-[var(--color-text-tertiary)]">
                  No orders in this period
                </p>
              ) : (
                <div className="p-5 space-y-3">
                  {statusBreakdown.map((s) => {
                    const pct = stats.totalOrders > 0 ? (s.count / stats.totalOrders) * 100 : 0
                    return (
                      <div key={s.status}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="capitalize font-medium">{s.status.replace(/_/g, ' ')}</span>
                          <span className="text-[var(--color-text-secondary)]">
                            {s.count} ({pct.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-[var(--color-bg-alt)] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${statusColors[s.status] || 'bg-stone-400'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
