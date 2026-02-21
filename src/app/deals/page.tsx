'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Flame, Grid3X3, LayoutList } from 'lucide-react'
import { ProductCard } from '@/components/products'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/types'

const sortOptions = [
  { label: 'Biggest Discount', value: 'discount' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
]

export default function DealsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('discount')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true)
      const supabase = createClient()
      if (!supabase) { setLoading(false); return }

      let q = supabase
        .from('products')
        .select('*, brand:brands(*), category:categories(*), images:product_images(*)')
        .eq('is_active', true)
        .not('compare_price', 'is', null)
        .gt('compare_price', 0)

      if (sortBy === 'price_asc') q = q.order('price', { ascending: true })
      else if (sortBy === 'price_desc') q = q.order('price', { ascending: false })
      else if (sortBy === 'newest') q = q.order('created_at', { ascending: false })
      else q = q.order('compare_price', { ascending: false })

      const { data } = await q.limit(40)

      if (data) {
        let items = (data as Product[]).filter((p) => p.compare_price && p.compare_price > p.price)
        if (sortBy === 'discount') {
          items.sort((a, b) => {
            const da = ((a.compare_price! - a.price) / a.compare_price!) * 100
            const db = ((b.compare_price! - b.price) / b.compare_price!) * 100
            return db - da
          })
        }
        setProducts(items)
      }
      setLoading(false)
    }

    fetchDeals()
  }, [sortBy])

  return (
    <div className="pt-28 pb-20">
      <div className="container-wide">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5" /> Limited Time
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Today&apos;s Deals</h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Save big on premium tech — genuine warranty included on every product.
          </p>
        </motion.div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--color-border)]/50">
          <span className="text-sm text-[var(--color-text-tertiary)]">
            {loading ? '...' : `${products.length} deal${products.length !== 1 ? 's' : ''}`}
          </span>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div className="hidden sm:flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)]' : 'hover:bg-[var(--color-bg-alt)]'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)]' : 'hover:bg-[var(--color-bg-alt)]'}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-[var(--color-surface)] rounded-2xl mb-3" />
                <div className="h-3 bg-[var(--color-surface)] rounded w-2/3 mb-2" />
                <div className="h-4 bg-[var(--color-surface)] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Flame className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-tertiary)]" />
            <p className="text-lg font-medium mb-2">No deals right now</p>
            <p className="text-[var(--color-text-secondary)]">
              Check back soon — new deals drop regularly.
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'
                : 'grid grid-cols-1 md:grid-cols-2 gap-4'
            }
          >
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
