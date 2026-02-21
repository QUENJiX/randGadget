'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, Grid3X3, LayoutList, X } from 'lucide-react'
import { ProductCard } from '@/components/products'
import { fadeUp, staggerContainer } from '@/lib/animations'
import type { Product, Brand, Category } from '@/lib/types'

// Mock data for demo
const mockProducts: Product[] = Array.from({ length: 8 }, (_, i) => ({
  id: `search-${i + 1}`,
  sku: `SKU-${i + 1}`,
  name: [
    'iPhone 16 Pro Max 256GB',
    'Samsung Galaxy S25 Ultra',
    'MacBook Air M3 15"',
    'Sony WH-1000XM5',
    'Google Pixel Watch 3',
    'Nothing Ear (a)',
    'Anker 737 Power Bank',
    'Apple AirPods Pro 2',
  ][i],
  slug: `product-${i + 1}`,
  brand_id: null,
  category_id: null,
  short_desc: 'Premium tech product with warranty',
  description: null,
  price: [189999, 164999, 179999, 32999, 44999, 6999, 8499, 34999][i],
  compare_price: [199999, 174999, null, 41999, 52999, 8999, 11999, 39999][i] as number | null,
  cost_price: null,
  stock: 10,
  weight_kg: 0.5,
  is_featured: i < 3,
  is_active: true,
  meta_title: null,
  meta_description: null,
  tags: [],
  specs: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  brand: {
    id: i + 1,
    name: ['Apple', 'Samsung', 'Apple', 'Sony', 'Google', 'Nothing', 'Anker', 'Apple'][i],
    slug: ['apple', 'samsung', 'apple', 'sony', 'google', 'nothing', 'anker', 'apple'][i],
    logo_url: null,
  },
  category: {
    id: 1,
    parent_id: null,
    name: ['Smartphones', 'Smartphones', 'Laptops', 'Audio', 'Wearables', 'Audio', 'Accessories', 'Audio'][i],
    slug: 'cat',
    icon_svg: null,
    sort_order: 0,
  },
}))

const categories = ['All', 'Smartphones', 'Laptops', 'Audio', 'Wearables', 'Accessories']
const brands = ['All', 'Apple', 'Samsung', 'Sony', 'Google', 'Nothing', 'Anker']
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
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter mock products
  const filtered = mockProducts.filter((p) => {
    if (selectedCategory !== 'All' && p.category?.name !== selectedCategory) return false
    if (selectedBrand !== 'All' && p.brand?.name !== selectedBrand) return false
    return true
  })

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
                {filtered.length} products found
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
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
