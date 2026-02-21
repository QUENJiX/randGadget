'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Ticket, Plus, Pencil, Trash2, Check, X, Search, ToggleLeft, ToggleRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'

interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order: number
  max_discount: number | null
  usage_limit: number | null
  used_count: number
  starts_at: string | null
  expires_at: string | null
  is_active: boolean
  created_at: string
}

const empty: Omit<Coupon, 'id' | 'created_at' | 'used_count'> = {
  code: '',
  discount_type: 'percentage',
  discount_value: 0,
  min_order: 0,
  max_discount: null,
  usage_limit: null,
  starts_at: null,
  expires_at: null,
  is_active: true,
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) return
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setCoupons(data as Coupon[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!form.code.trim() || form.discount_value <= 0) return
    const supabase = createClient()
    if (!supabase) return

    const payload = {
      code: form.code.trim().toUpperCase(),
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      min_order: form.min_order,
      max_discount: form.max_discount,
      usage_limit: form.usage_limit,
      starts_at: form.starts_at || null,
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    }

    let error
    if (editId) {
      ({ error } = await supabase.from('coupons').update(payload).eq('id', editId))
    } else {
      ({ error } = await supabase.from('coupons').insert(payload))
    }

    if (error) {
      alert(error.message)
      return
    }

    setShowForm(false)
    setEditId(null)
    setForm(empty)
    load()
  }

  const startEdit = (c: Coupon) => {
    setEditId(c.id)
    setForm({
      code: c.code,
      discount_type: c.discount_type,
      discount_value: c.discount_value,
      min_order: c.min_order,
      max_discount: c.max_discount,
      usage_limit: c.usage_limit,
      starts_at: c.starts_at ? c.starts_at.slice(0, 16) : null,
      expires_at: c.expires_at ? c.expires_at.slice(0, 16) : null,
      is_active: c.is_active,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('coupons').delete().eq('id', id)
    load()
  }

  const toggleActive = async (c: Coupon) => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('coupons').update({ is_active: !c.is_active }).eq('id', c.id)
    load()
  }

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  const inputClass =
    'w-full px-3 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm outline-none'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Coupons</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{coupons.length} coupons</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(empty) }}
          className="px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Coupon
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)] w-full max-w-lg mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold">{editId ? 'Edit Coupon' : 'New Coupon'}</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Code</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="WELCOME20"
                  className={inputClass + ' uppercase font-mono tracking-wider'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={form.discount_type}
                  onChange={(e) => setForm({ ...form, discount_type: e.target.value as 'percentage' | 'fixed' })}
                  className={inputClass}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (৳)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <input
                  type="number"
                  min={0}
                  value={form.discount_value}
                  onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min Order</label>
                <input
                  type="number"
                  min={0}
                  value={form.min_order}
                  onChange={(e) => setForm({ ...form, min_order: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Discount</label>
                <input
                  type="number"
                  min={0}
                  value={form.max_discount ?? ''}
                  onChange={(e) => setForm({ ...form, max_discount: e.target.value ? Number(e.target.value) : null })}
                  placeholder="No limit"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Usage Limit</label>
                <input
                  type="number"
                  min={0}
                  value={form.usage_limit ?? ''}
                  onChange={(e) => setForm({ ...form, usage_limit: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Unlimited"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Active</label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                  className={`mt-1 inline-flex items-center gap-2 text-sm font-medium ${form.is_active ? 'text-green-600' : 'text-[var(--color-text-tertiary)]'}`}
                >
                  {form.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  {form.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Starts At</label>
                <input
                  type="datetime-local"
                  value={form.starts_at ?? ''}
                  onChange={(e) => setForm({ ...form, starts_at: e.target.value || null })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expires At</label>
                <input
                  type="datetime-local"
                  value={form.expires_at ?? ''}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value || null })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] flex items-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" /> Save
              </button>
              <button
                onClick={() => { setShowForm(false); setEditId(null); setForm(empty) }}
                className="px-5 py-2.5 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-bg-alt)] flex items-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by coupon code…"
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-sm outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]/50 text-left text-xs uppercase tracking-wider text-[var(--color-text-tertiary)]">
                <th className="px-5 py-3 font-medium">Code</th>
                <th className="px-5 py-3 font-medium">Discount</th>
                <th className="px-5 py-3 font-medium">Min Order</th>
                <th className="px-5 py-3 font-medium text-center">Usage</th>
                <th className="px-5 py-3 font-medium">Validity</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-5 py-3"><div className="h-4 w-20 bg-[var(--color-surface)] rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[var(--color-text-tertiary)]">
                    <Ticket className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No coupons found
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const isExpired = c.expires_at && new Date(c.expires_at) < new Date()
                  return (
                    <tr key={c.id} className="hover:bg-[var(--color-bg-alt)] transition-colors">
                      <td className="px-5 py-3 font-mono font-semibold tracking-wider">{c.code}</td>
                      <td className="px-5 py-3">
                        {c.discount_type === 'percentage'
                          ? `${c.discount_value}%`
                          : formatPrice(c.discount_value)}
                        {c.max_discount && (
                          <span className="text-xs text-[var(--color-text-tertiary)] ml-1">
                            (max {formatPrice(c.max_discount)})
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">{c.min_order > 0 ? formatPrice(c.min_order) : '—'}</td>
                      <td className="px-5 py-3 text-center">
                        {c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ''}
                      </td>
                      <td className="px-5 py-3 text-xs text-[var(--color-text-secondary)]">
                        {c.starts_at ? new Date(c.starts_at).toLocaleDateString('en-BD') : '—'}
                        {' → '}
                        {c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-BD') : '∞'}
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => toggleActive(c)} className="group">
                          {c.is_active && !isExpired ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full group-hover:bg-green-100 transition-colors">
                              <ToggleRight className="w-3.5 h-3.5" /> Active
                            </span>
                          ) : isExpired ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                              Expired
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 bg-stone-50 px-2.5 py-1 rounded-full group-hover:bg-stone-100 transition-colors">
                              <ToggleLeft className="w-3.5 h-3.5" /> Inactive
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(c)}
                            className="p-1.5 rounded-lg hover:bg-[var(--color-bg-alt)] transition-colors text-[var(--color-text-secondary)]"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
