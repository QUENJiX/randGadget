'use client'

import { useState, useEffect, useCallback, useRef, useMemo, Fragment } from 'react'
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  X,
  Layers,
  ChevronDown,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'

const PAGE_SIZE = 20

type SortField = 'name' | 'sku' | 'price' | 'stock' | 'created_at'
type SortDir = 'asc' | 'desc'
type StockFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock'
type StatusFilter = 'all' | 'active' | 'inactive'
type FeaturedFilter = 'all' | 'featured' | 'not-featured'
type GroupBy = 'none' | 'category' | 'brand' | 'stock-status'

interface CategoryOption { id: number; name: string }
interface BrandOption { id: number; name: string }

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [actionMenuId, setActionMenuId] = useState<string | null>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; above: boolean }>({ top: 0, left: 0, above: false })
  const menuRef = useRef<HTMLDivElement>(null)

  // Sorting
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // Filtering
  const [showFilters, setShowFilters] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all')
  const [brandFilter, setBrandFilter] = useState<number | 'all'>('all')
  const [stockFilter, setStockFilter] = useState<StockFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>('all')

  // Grouping
  const [groupBy, setGroupBy] = useState<GroupBy>('none')

  // Reference data for filter dropdowns
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [brands, setBrands] = useState<BrandOption[]>([])

  // Fetch categories and brands for filter dropdowns
  useEffect(() => {
    const loadRefData = async () => {
      const supabase = createClient()
      if (!supabase) return
      const [catRes, brandRes] = await Promise.all([
        supabase.from('categories').select('id, name').order('name'),
        supabase.from('brands').select('id, name').order('name'),
      ])
      setCategories((catRes.data as CategoryOption[]) ?? [])
      setBrands((brandRes.data as BrandOption[]) ?? [])
    }
    loadRefData()
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }

    let q = supabase
      .from('products')
      .select('*, brand:brands(name), category:categories(name)', { count: 'exact' })
      .order(sortField, { ascending: sortDir === 'asc' })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (search.trim()) {
      q = q.or(`name.ilike.%${search.trim()}%,sku.ilike.%${search.trim()}%`)
    }

    // Apply filters
    if (categoryFilter !== 'all') {
      q = q.eq('category_id', categoryFilter)
    }
    if (brandFilter !== 'all') {
      q = q.eq('brand_id', brandFilter)
    }
    if (stockFilter === 'out-of-stock') {
      q = q.lte('stock', 0)
    } else if (stockFilter === 'low-stock') {
      q = q.gt('stock', 0).lte('stock', 5)
    } else if (stockFilter === 'in-stock') {
      q = q.gt('stock', 5)
    }
    if (statusFilter === 'active') {
      q = q.eq('is_active', true)
    } else if (statusFilter === 'inactive') {
      q = q.eq('is_active', false)
    }
    if (featuredFilter === 'featured') {
      q = q.eq('is_featured', true)
    } else if (featuredFilter === 'not-featured') {
      q = q.eq('is_featured', false)
    }

    const { data, count } = await q
    setProducts((data as Product[]) ?? [])
    setTotalCount(count ?? 0)
    setLoading(false)
  }, [page, search, sortField, sortDir, categoryFilter, brandFilter, stockFilter, statusFilter, featuredFilter])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Close action menu on outside click or scroll
  useEffect(() => {
    if (!actionMenuId) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActionMenuId(null)
      }
    }
    const handleScroll = () => setActionMenuId(null)
    document.addEventListener('mousedown', handleClick)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [actionMenuId])

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
    setPage(0)
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-40" />
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
  }

  const activeFilterCount = [
    categoryFilter !== 'all',
    brandFilter !== 'all',
    stockFilter !== 'all',
    statusFilter !== 'all',
    featuredFilter !== 'all',
  ].filter(Boolean).length

  const clearFilters = () => {
    setCategoryFilter('all')
    setBrandFilter('all')
    setStockFilter('all')
    setStatusFilter('all')
    setFeaturedFilter('all')
    setPage(0)
  }

  // Grouped products
  const groupedProducts = useMemo(() => {
    if (groupBy === 'none') return null

    const groups: Record<string, Product[]> = {}

    for (const p of products) {
      let key: string
      if (groupBy === 'category') {
        key = (p.category as any)?.name ?? 'Uncategorized'
      } else if (groupBy === 'brand') {
        key = (p.brand as any)?.name ?? 'No Brand'
      } else {
        key = p.stock <= 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'In Stock'
      }
      if (!groups[key]) groups[key] = []
      groups[key].push(p)
    }

    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (groupBy === 'stock-status') {
        const order = ['Out of Stock', 'Low Stock', 'In Stock']
        return order.indexOf(a) - order.indexOf(b)
      }
      return a.localeCompare(b)
    })

    return sortedKeys.map((key) => ({ label: key, products: groups[key] }))
  }, [products, groupBy])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const renderProductRow = (product: Product) => (
    <tr key={product.id} className="hover:bg-[var(--color-bg-alt)]/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div>
            <p className="font-medium truncate max-w-[250px]">{product.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {product.brand && (
                <span className="text-xs text-[var(--color-text-tertiary)]">{(product.brand as any).name ?? ''}</span>
              )}
              {!product.is_active && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-medium">
                  Inactive
                </span>
              )}
            </div>
          </div>
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
        <span className={`font-medium ${product.stock <= 0 ? 'text-red-600 dark:text-red-400' : product.stock <= 5 ? 'text-amber-600 dark:text-amber-400' : 'text-[var(--color-text)]'}`}>
          {product.stock}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => toggleFeatured(product.id, product.is_featured)}
          className={`p-1 rounded transition-colors ${product.is_featured ? 'text-amber-500 dark:text-amber-400' : 'text-[var(--color-text-tertiary)] hover:text-amber-400'}`}
          title={product.is_featured ? 'Remove from featured' : 'Mark as featured'}
        >
          <Star className="w-4 h-4" fill={product.is_featured ? 'currentColor' : 'none'} />
        </button>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={(e) => {
            if (actionMenuId === product.id) {
              setActionMenuId(null)
              return
            }
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
            const above = window.innerHeight - rect.bottom < 160
            setMenuPos({
              top: above ? rect.top : rect.bottom,
              left: rect.right,
              above,
            })
            setActionMenuId(product.id)
          }}
          className="p-1 rounded hover:bg-[var(--color-bg-alt)] transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </td>
    </tr>
  )

  const renderGroupHeader = (label: string, count: number) => (
    <tr key={`group-${label}`} className="bg-[var(--color-bg-alt)]/60">
      <td colSpan={7} className="px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{label}</span>
          <span className="text-xs text-[var(--color-text-tertiary)] bg-[var(--color-surface)] px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        </div>
      </td>
    </tr>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{totalCount} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-[var(--color-accent-text)] rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Toolbar: Search + Filter/Group toggles */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            placeholder="Search by name or SKU…"
            className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-bg-card)] border border-[var(--color-border)]/50 rounded-lg text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
            showFilters || activeFilterCount > 0
              ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/30 text-[var(--color-accent)]'
              : 'bg-[var(--color-bg-card)] border-[var(--color-border)]/50 text-[var(--color-text-secondary)] hover:border-[var(--color-border)]'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[var(--color-accent)] text-[var(--color-accent-text)]">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Group by dropdown */}
        <div className="relative">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupBy)}
            className="appearance-none inline-flex items-center gap-2 pl-9 pr-8 py-2.5 rounded-lg text-sm font-medium border transition-colors bg-[var(--color-bg-card)] border-[var(--color-border)]/50 text-[var(--color-text-secondary)] hover:border-[var(--color-border)] cursor-pointer"
          >
            <option value="none">No Grouping</option>
            <option value="category">Group by Category</option>
            <option value="brand">Group by Brand</option>
            <option value="stock-status">Group by Stock Status</option>
          </select>
          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)] pointer-events-none" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-tertiary)] pointer-events-none" />
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="mb-4 p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)]/50 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">Filters</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1">Category</label>
              <select
                value={categoryFilter === 'all' ? 'all' : String(categoryFilter)}
                onChange={(e) => { setCategoryFilter(e.target.value === 'all' ? 'all' : Number(e.target.value)); setPage(0) }}
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)]/50 rounded-lg text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1">Brand</label>
              <select
                value={brandFilter === 'all' ? 'all' : String(brandFilter)}
                onChange={(e) => { setBrandFilter(e.target.value === 'all' ? 'all' : Number(e.target.value)); setPage(0) }}
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)]/50 rounded-lg text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Stock Status */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1">Stock</label>
              <select
                value={stockFilter}
                onChange={(e) => { setStockFilter(e.target.value as StockFilter); setPage(0) }}
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)]/50 rounded-lg text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
              >
                <option value="all">All</option>
                <option value="in-stock">In Stock (&gt;5)</option>
                <option value="low-stock">Low Stock (1–5)</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(0) }}
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)]/50 rounded-lg text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Featured */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1">Featured</label>
              <select
                value={featuredFilter}
                onChange={(e) => { setFeaturedFilter(e.target.value as FeaturedFilter); setPage(0) }}
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)]/50 rounded-lg text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
              >
                <option value="all">All</option>
                <option value="featured">Featured</option>
                <option value="not-featured">Not Featured</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[var(--color-border)]/30">
              {categoryFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  Category: {categories.find((c) => c.id === categoryFilter)?.name}
                  <button onClick={() => { setCategoryFilter('all'); setPage(0) }} className="hover:text-[var(--color-accent-hover)]"><X className="w-3 h-3" /></button>
                </span>
              )}
              {brandFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  Brand: {brands.find((b) => b.id === brandFilter)?.name}
                  <button onClick={() => { setBrandFilter('all'); setPage(0) }} className="hover:text-[var(--color-accent-hover)]"><X className="w-3 h-3" /></button>
                </span>
              )}
              {stockFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  Stock: {stockFilter}
                  <button onClick={() => { setStockFilter('all'); setPage(0) }} className="hover:text-[var(--color-accent-hover)]"><X className="w-3 h-3" /></button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  Status: {statusFilter}
                  <button onClick={() => { setStatusFilter('all'); setPage(0) }} className="hover:text-[var(--color-accent-hover)]"><X className="w-3 h-3" /></button>
                </span>
              )}
              {featuredFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  {featuredFilter}
                  <button onClick={() => { setFeaturedFilter('all'); setPage(0) }} className="hover:text-[var(--color-accent-hover)]"><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]/50 bg-[var(--color-bg-alt)]/50">
                <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)]">
                  <button onClick={() => handleSort('name')} className="inline-flex items-center gap-1 hover:text-[var(--color-text)] transition-colors">
                    Product <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)] hidden md:table-cell">
                  <button onClick={() => handleSort('sku')} className="inline-flex items-center gap-1 hover:text-[var(--color-text)] transition-colors">
                    SKU <SortIcon field="sku" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)] hidden lg:table-cell">Category</th>
                <th className="text-right px-4 py-3 font-medium text-[var(--color-text-secondary)]">
                  <button onClick={() => handleSort('price')} className="inline-flex items-center gap-1 ml-auto hover:text-[var(--color-text)] transition-colors">
                    Price <SortIcon field="price" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-medium text-[var(--color-text-secondary)]">
                  <button onClick={() => handleSort('stock')} className="inline-flex items-center gap-1 ml-auto hover:text-[var(--color-text)] transition-colors">
                    Stock <SortIcon field="stock" />
                  </button>
                </th>
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
                    {activeFilterCount > 0 ? (
                      <div>
                        <p>No products match your filters</p>
                        <button onClick={clearFilters} className="text-[var(--color-accent)] hover:underline text-sm mt-1">
                          Clear all filters
                        </button>
                      </div>
                    ) : (
                      'No products found'
                    )}
                  </td>
                </tr>
              ) : groupedProducts ? (
                groupedProducts.map((group) => (
                  <Fragment key={group.label}>
                    {renderGroupHeader(group.label, group.products.length)}
                    {group.products.map(renderProductRow)}
                  </Fragment>
                ))
              ) : (
                products.map(renderProductRow)
              )}
            </tbody>
          </table>
        </div>

        {/* Action Menu Portal */}
        {actionMenuId && (
          <div
            ref={menuRef}
            className="fixed z-50 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg py-1 w-36"
            style={{
              left: menuPos.left - 144,
              ...(menuPos.above
                ? { bottom: window.innerHeight - menuPos.top + 4 }
                : { top: menuPos.top + 4 }),
            }}
          >
            {(() => {
              const p = products.find((pr) => pr.id === actionMenuId)
              if (!p) return null
              return (
                <>
                  <Link
                    href={`/product/${p.slug}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--color-bg-alt)] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </Link>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--color-bg-alt)] transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 w-full transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </>
              )
            })()}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]/50">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Page {page + 1} of {totalPages} · {totalCount} results
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
