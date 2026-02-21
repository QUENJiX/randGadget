'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useSearchStore } from '@/lib/store'
import { searchModalVariants, fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { debounce, formatPrice } from '@/lib/utils'
import type { SearchResult } from '@/lib/types'

// Mock trending searches — replace with Supabase query
const trendingSearches = [
  'iPhone 16 Pro',
  'Samsung Galaxy S25',
  'AirPods Pro',
  'MacBook Air M3',
  'Nothing Phone',
  'Pixel Watch',
]

// Mock results — replace with actual Supabase RPC call
const mockResults: SearchResult[] = [
  {
    id: '1',
    name: 'iPhone 16 Pro Max — 256GB',
    slug: 'iphone-16-pro-max-256gb',
    price: 189999,
    compare_price: 199999,
    short_desc: 'A18 Pro chip, 48MP camera system, titanium design',
    brand_name: 'Apple',
    category_name: 'Smartphones',
    primary_image: '/products/iphone-16-pro.jpg',
    relevance: 1,
  },
  {
    id: '2',
    name: 'Samsung Galaxy S25 Ultra',
    slug: 'samsung-galaxy-s25-ultra',
    price: 164999,
    compare_price: 174999,
    short_desc: 'Snapdragon 8 Elite, 200MP camera, S Pen included',
    brand_name: 'Samsung',
    category_name: 'Smartphones',
    primary_image: '/products/galaxy-s25.jpg',
    relevance: 0.9,
  },
  {
    id: '3',
    name: 'MacBook Air 15" M3',
    slug: 'macbook-air-15-m3',
    price: 179999,
    compare_price: null,
    short_desc: '15.3" Liquid Retina, 18hr battery, 8-core GPU',
    brand_name: 'Apple',
    category_name: 'Laptops',
    primary_image: '/products/macbook-air.jpg',
    relevance: 0.85,
  },
]

export function SearchModal() {
  const { isOpen, query, close, setQuery } = useSearchStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches] = useState<string[]>([
    'wireless earbuds',
    'laptop stand',
    'usb-c hub',
  ])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        isOpen ? close() : useSearchStore.getState().open()
      }
      if (e.key === 'Escape' && isOpen) {
        close()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, close])

  // Debounced search
  const performSearch = useCallback(
    debounce((q: string) => {
      if (q.length < 2) {
        setResults([])
        setLoading(false)
        return
      }
      // TODO: Replace with actual Supabase RPC call:
      // const { data } = await supabase.rpc('search_products', { search_query: q })
      setResults(
        mockResults.filter((r) =>
          r.name.toLowerCase().includes(q.toLowerCase())
        )
      )
      setLoading(false)
    }, 300),
    []
  )

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setLoading(true)
    performSearch(value)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[10vh] px-4">
            <motion.div
              variants={searchModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-2xl bg-[var(--color-bg-card)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 border-b border-[var(--color-border)]">
                <Search className="w-5 h-5 text-[var(--color-text-tertiary)] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Search for products, brands, categories..."
                  className="flex-1 py-4 bg-transparent text-base outline-none placeholder:text-[var(--color-text-tertiary)]"
                />
                <div className="flex items-center gap-2">
                  {query && (
                    <button
                      onClick={() => handleQueryChange('')}
                      className="p-1 rounded-md hover:bg-[var(--color-surface)] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium text-[var(--color-text-tertiary)] bg-[var(--color-surface)] rounded border border-[var(--color-border)]">
                    ESC
                  </kbd>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto">
                {query.length < 2 ? (
                  <div className="p-5 space-y-6">
                    {/* Recent searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">
                          Recent
                        </p>
                        <div className="space-y-1">
                          {recentSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => handleQueryChange(term)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-accent-subtle)] transition-colors text-left"
                            >
                              <Clock className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                              <span className="text-sm">{term}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending */}
                    <div>
                      <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">
                        Trending
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleQueryChange(term)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-surface)] hover:bg-[var(--color-border)] rounded-full text-sm transition-colors"
                          >
                            <TrendingUp className="w-3 h-3 text-[var(--color-text-tertiary)]" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : loading ? (
                  <div className="p-5 space-y-3">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="flex items-center gap-4">
                        <div className="w-16 h-16 skeleton rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 skeleton w-3/4 rounded" />
                          <div className="h-3 skeleton w-1/2 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="p-3"
                  >
                    {results.map((product) => (
                      <motion.div key={product.id} variants={staggerItem}>
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={close}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-accent-subtle)] transition-colors group"
                        >
                          <div className="w-16 h-16 bg-[var(--color-surface)] rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                            <span className="text-xs text-[var(--color-text-tertiary)]">
                              {product.brand_name}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                              {product.category_name}
                              {product.brand_name && ` · ${product.brand_name}`}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-semibold">
                                {formatPrice(product.price)}
                              </span>
                              {product.compare_price && (
                                <span className="text-xs text-[var(--color-text-tertiary)] line-through">
                                  {formatPrice(product.compare_price)}
                                </span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </motion.div>
                    ))}

                    {/* View all */}
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      onClick={close}
                      className="flex items-center justify-center gap-2 mt-2 py-3 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] rounded-xl transition-colors"
                    >
                      View all results
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      No results found for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                      Try a different search term or browse categories
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]">
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-tertiary)]">
                  <span className="hidden sm:inline-flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded text-[10px] font-mono">
                      &uarr;&darr;
                    </kbd>
                    Navigate
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded text-[10px] font-mono">
                      &crarr;
                    </kbd>
                    Select
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  Powered by fuzzy search
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
