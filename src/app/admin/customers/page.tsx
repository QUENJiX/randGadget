'use client'

import { useState, useEffect } from 'react'
import { Users, Search, ChevronLeft, ChevronRight, Mail, Phone, ShoppingBag, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'

const PAGE_SIZE = 20

interface CustomerRow {
  id: string
  full_name: string | null
  phone: string | null
  email: string | null
  role: string
  created_at: string
  order_count: number
  total_spent: number
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const supabase = createClient()
      if (!supabase) { setLoading(false); return }

      // Get profiles with email from auth.users via RPC isn't available,
      // so we query profiles and orders separately

      let query = supabase
        .from('profiles')
        .select('id, full_name, phone, role, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      if (search.trim()) {
        query = query.or(`full_name.ilike.%${search.trim()}%,phone.ilike.%${search.trim()}%`)
      }

      const { data: profiles, count } = await query
      if (count !== null) setTotal(count)

      if (!profiles || profiles.length === 0) {
        setCustomers([])
        setLoading(false)
        return
      }

      // Fetch order aggregates per user
      const userIds = profiles.map((p: { id: string }) => p.id)
      const { data: orderAggs } = await supabase
        .from('orders')
        .select('user_id, total')
        .in('user_id', userIds)

      const aggMap: Record<string, { count: number; spent: number }> = {}
      if (orderAggs) {
        for (const o of orderAggs as { user_id: string; total: number }[]) {
          if (!aggMap[o.user_id]) aggMap[o.user_id] = { count: 0, spent: 0 }
          aggMap[o.user_id].count++
          aggMap[o.user_id].spent += o.total
        }
      }

      const rows: CustomerRow[] = profiles.map((p: { id: string; full_name: string | null; phone: string | null; role: string; created_at: string }) => ({
        id: p.id,
        full_name: p.full_name,
        phone: p.phone,
        email: null, // Not accessible from client without admin API
        role: p.role,
        created_at: p.created_at,
        order_count: aggMap[p.id]?.count ?? 0,
        total_spent: aggMap[p.id]?.spent ?? 0,
      }))

      setCustomers(rows)
      setLoading(false)
    }

    load()
  }, [page, search])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{total} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-sm outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]/50 text-left text-xs uppercase tracking-wider text-[var(--color-text-tertiary)]">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium text-center">Orders</th>
                <th className="px-5 py-3 font-medium text-right">Spent</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-3"><div className="h-4 w-32 bg-[var(--color-surface)] rounded" /></td>
                    <td className="px-5 py-3"><div className="h-4 w-28 bg-[var(--color-surface)] rounded" /></td>
                    <td className="px-5 py-3 text-center"><div className="h-4 w-8 mx-auto bg-[var(--color-surface)] rounded" /></td>
                    <td className="px-5 py-3 text-right"><div className="h-4 w-20 ml-auto bg-[var(--color-surface)] rounded" /></td>
                    <td className="px-5 py-3"><div className="h-4 w-24 bg-[var(--color-surface)] rounded" /></td>
                    <td className="px-5 py-3"><div className="h-4 w-16 bg-[var(--color-surface)] rounded" /></td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[var(--color-text-tertiary)]">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[var(--color-bg-alt)] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center text-xs font-bold shrink-0">
                          {(c.full_name?.[0] ?? '?').toUpperCase()}
                        </div>
                        <span className="font-medium">{c.full_name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="space-y-0.5">
                        {c.phone && (
                          <p className="inline-flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                            <Phone className="w-3 h-3" /> {c.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
                        {c.order_count}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium">
                      {c.total_spent > 0 ? formatPrice(c.total_spent) : '—'}
                    </td>
                    <td className="px-5 py-3 text-[var(--color-text-secondary)]">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Calendar className="w-3 h-3" />
                        {new Date(c.created_at).toLocaleDateString('en-BD')}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        c.role === 'admin'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-stone-50 text-stone-600'
                      }`}>
                        {c.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border)]/50 text-sm text-[var(--color-text-secondary)]">
            <span>Page {page + 1} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="p-1.5 rounded-lg border border-[var(--color-border)] disabled:opacity-30 hover:bg-[var(--color-bg-alt)] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded-lg border border-[var(--color-border)] disabled:opacity-30 hover:bg-[var(--color-bg-alt)] transition-colors"
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
