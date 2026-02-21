'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, Grid3X3, LayoutList, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ProductCard } from '@/components/products'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/types'

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
]

const categoryMeta: Record<string, { title: string; description: string }> = {
  smartphones: {
    title: 'Smartphones',
    description: 'Flagship phones from Apple, Samsung, Google, Xiaomi, and more — all with official Bangladesh warranty.',
  },
  laptops: {
    title: 'Laptops',
    description: 'MacBooks, ThinkPads, gaming powerhouses, and ultrabooks for every budget.',
  },
  audio: {
    title: 'Audio',
    description: 'Premium earbuds, headphones, and speakers from Sony, Samsung, Apple, and Anker.',
  },
  wearables: {
    title: 'Wearables',
    description: 'Smartwatches and fitness trackers for every lifestyle.',
  },
  accessories: {
    title: 'Accessories',
    description: 'Chargers, cases, cables, and essential tech gear.',
  },
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const meta = categoryMeta[slug] || { title: slug, description: '' }

  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<string[]>(['All'])
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const supabase = createClient()
      if (!supabase) { setLoading(false); return }

      let q = supabase
        .from('products')
        .select('*, brand:brands(*), category:categories(*), images:product_images(*)')
        .eq('is_active', true)
        .eq('category.slug', slug)

      if (selectedBrand !== 'All') {
        q = q.eq('brand.name', selectedBrand)
      }

      if (sortBy === 'price_asc') q = q.order('price', { ascending: true })
      else if (sortBy === 'price_desc') q = q.order('price', { ascending: false })
      else if (sortBy === 'newest') q = q.order('created_at', { ascending: false })
      else q = q.order('is_featured', { ascending: false }).order('created_at', { ascending: false })

      const { data } = await q.limit(40)

      if (data) {
        // Filter client-side for joined category match (PostgREST returns nulls for non-matching joins)
        const filtered = (data as Product[]).filter((p) => p.category?.slug === slug)
        setProducts(filtered)

        const brandSet = new Set<string>()
        filtered.forEach((p) => { if (p.brand?.name) brandSet.add(p.brand.name) })
        setBrands(['All', ...Array.from(brandSet).sort()])
      }
      setLoading(false)
    }

    fetchProducts()
  }, [slug, selectedBrand, sortBy])

  return (
    <div className="pt-28 pb-20">
      <div className="container-wide">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>
        </nav>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
            Category
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight capitalize">
            {meta.title}
          </h1>
          {meta.description && (
            <p className="mt-2 text-[var(--color-text-secondary)] max-w-xl">{meta.description}</p>
          )}
        </motion.div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--color-border)]/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-alt)] transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <span className="text-sm text-[var(--color-text-tertiary)]">
              {loading ? '...' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
            </span>
          </div>

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
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-accent)] text-white' : 'hover:bg-[var(--color-bg-alt)]'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[var(--color-accent)] text-white' : 'hover:bg-[var(--color-bg-alt)]'}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 p-4 bg-[var(--color-bg-alt)] rounded-xl border border-[var(--color-border)]/50"
          >
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">Brand</p>
              <div className="flex flex-wrap gap-2">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      selectedBrand === b
                        ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                        : 'border-[var(--color-border)] hover:bg-[var(--color-bg-card)]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

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
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-[var(--color-text-secondary)]">
              Try adjusting your filters or check back later for new arrivals.
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
