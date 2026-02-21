'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'

const PAGE_SIZE = 20

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [actionMenuId, setActionMenuId] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }

    let q = supabase
      .from('products')
      .select('*, brand:brands(name), category:categories(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (search.trim()) {
      q = q.or(`name.ilike.%${search.trim()}%,sku.ilike.%${search.trim()}%`)
    }

    const { data, count } = await q
    setProducts((data as Product[]) ?? [])
    setTotalCount(count ?? 0)
    setLoading(false)
  }, [page, search])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('products').delete().eq('id', id)
    setActionMenuId(null)
    fetchProducts()
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('products').update({ is_featured: !current }).eq('id', id)
    setActionMenuId(null)
    fetchProducts()
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{totalCount} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          placeholder="Search by name or SKU…"
          className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-bg-card)] border border-[var(--color-border)]/50 rounded-lg text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]/50 bg-[var(--color-bg-alt)]/50">
                <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)]">Product</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)] hidden md:table-cell">SKU</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)] hidden lg:table-cell">Category</th>
                <th className="text-right px-4 py-3 font-medium text-[var(--color-text-secondary)]">Price</th>
                <th className="text-right px-4 py-3 font-medium text-[var(--color-text-secondary)]">Stock</th>
                <th className="text-center px-4 py-3 font-medium text-[var(--color-text-secondary)] w-10">
                  <Star className="w-3.5 h-3.5 inline" />
                </th>
                <th className="text-right px-4 py-3 font-medium text-[var(--color-text-secondary)] w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="h-4 w-40 bg-[var(--color-surface)] rounded" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 w-20 bg-[var(--color-surface)] rounded" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 w-24 bg-[var(--color-surface)] rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 bg-[var(--color-surface)] rounded ml-auto" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-10 bg-[var(--color-surface)] rounded ml-auto" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-4 bg-[var(--color-surface)] rounded mx-auto" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-4 bg-[var(--color-surface)] rounded ml-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[var(--color-text-tertiary)]">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-[var(--color-bg-alt)]/30 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium truncate max-w-[250px]">{product.name}</p>
                        {product.brand && (
                          <p className="text-xs text-[var(--color-text-tertiary)]">{(product.brand as any).name ?? ''}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-[var(--color-text-secondary)] font-mono text-xs">
                      {product.sku}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-[var(--color-text-secondary)]">
                      {(product.category as any)?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${product.stock <= 0 ? 'text-red-600' : product.stock <= 5 ? 'text-amber-600' : 'text-[var(--color-text)]'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleFeatured(product.id, product.is_featured)}
                        className={`p-1 rounded transition-colors ${product.is_featured ? 'text-amber-500' : 'text-[var(--color-text-tertiary)] hover:text-amber-400'}`}
                        title={product.is_featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <Star className="w-4 h-4" fill={product.is_featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right relative">
                      <button
                        onClick={() => setActionMenuId(actionMenuId === product.id ? null : product.id)}
                        className="p-1 rounded hover:bg-[var(--color-bg-alt)] transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {actionMenuId === product.id && (
                        <div className="absolute right-4 top-full z-10 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg py-1 w-36">
                          <Link
                            href={`/product/${product.slug}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--color-bg-alt)] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--color-bg-alt)] transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 w-full transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
