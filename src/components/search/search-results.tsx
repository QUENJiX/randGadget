'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, Grid3X3, LayoutList, X } from 'lucide-react'
import { ProductCard } from '@/components/products'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { createClient } from '@/lib/supabase/client'
import type { Product, Brand, Category } from '@/lib/types'

const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
]

interface SearchResultsProps {
  query?: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const supabase = createClient()
      if (!supabase) { setLoading(false); return }

      let q = supabase
        .from('products')
        .select('*, brand:brands(*), category:categories(*), images:product_images(*)')
        .eq('is_active', true)

      if (query) {
        q = q.or(`name.ilike.%${query}%,short_desc.ilike.%${query}%,tags.cs.{${query}}`)
      }

      if (selectedCategory !== 'All') {
        q = q.eq('category.name', selectedCategory)
      }
      if (selectedBrand !== 'All') {
        q = q.eq('brand.name', selectedBrand)
      }

      if (sortBy === 'price_asc') q = q.order('price', { ascending: true })
      else if (sortBy === 'price_desc') q = q.order('price', { ascending: false })
      else if (sortBy === 'newest') q = q.order('created_at', { ascending: false })
      else q = q.order('is_featured', { ascending: false }).order('created_at', { ascending: false })

      const { data } = await q.limit(24)

      if (data) {
        setProducts(data as Product[])
      }
      setLoading(false)
    }

    fetchProducts()
  }, [query, selectedCategory, selectedBrand, sortBy])

  // Load filter options (categories & brands)
  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase.from('categories').select('name').order('name').then(({ data }: { data: any }) => {
      if (data) setCategories(['All', ...data.map((c: any) => c.name)])
    })
    supabase.from('brands').select('name').order('name').then(({ data }: { data: any }) => {
      if (data) setBrands(['All', ...data.map((b: any) => b.name)])
    })
  }, [])

  return (
    <div className="pt-28 pb-20">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          {query ? (
            <div>
              <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
                Search results for
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                &ldquo;{query}&rdquo;
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                {products.length} products found
              </p>
            </div>
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              All Products
            </h1>
          )}
        </motion.div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Active filters */}
            {(selectedCategory !== 'All' || selectedBrand !== 'All') && (
              <div className="flex items-center gap-2">
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-accent-subtle)] rounded-lg text-xs font-medium">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-accent-subtle)] rounded-lg text-xs font-medium">
                    {selectedBrand}
                    <button onClick={() => setSelectedBrand('All')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <div className="hidden md:flex gap-1 border border-[var(--color-border)] rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${
                  viewMode === 'grid' ? 'bg-[var(--color-surface)]' : ''
                } transition-colors`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${
                  viewMode === 'list' ? 'bg-[var(--color-surface)]' : ''
                } transition-colors`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:block w-56 shrink-0 space-y-8"
            >
              {/* Categories */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3">
                  Category
                </h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[var(--color-accent-subtle)] font-medium'
                          : 'hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3">
                  Brand
                </h4>
                <div className="space-y-1">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedBrand === brand
                          ? 'bg-[var(--color-accent-subtle)] font-medium'
                          : 'hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3">
                  Price Range
                </h4>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min ৳"
                    className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-accent)]"
                  />
                  <input
                    type="number"
                    placeholder="Max ৳"
                    className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
              </div>
            </motion.aside>
          )}

          {/* Product grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={`flex-1 grid gap-5 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
