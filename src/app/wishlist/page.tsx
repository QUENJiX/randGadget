'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Heart, Trash2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { formatPrice, calcDiscount, productImageUrl, BLUR_PLACEHOLDER } from '@/lib/utils'
import { useCartStore } from '@/lib/store'
import type { Product } from '@/lib/types'

const WISHLIST_KEY = 'gadgetbd_wishlist'

function getWishlistIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]')
  } catch { return [] }
}

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((s) => s.addItem)

  const loadWishlist = useCallback(async () => {
    setLoading(true)
    const ids = getWishlistIds()
    if (ids.length === 0) { setProducts([]); setLoading(false); return }

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }

    const { data } = await supabase
      .from('products')
      .select('*, brand:brands(*), category:categories(*), images:product_images(*)')
      .in('id', ids)
      .eq('is_active', true)

    if (data) setProducts(data as Product[])
    setLoading(false)
  }, [])

  useEffect(() => { loadWishlist() }, [loadWishlist])

  const removeFromWishlist = (productId: string) => {
    const ids = getWishlistIds().filter((id) => id !== productId)
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids))
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  const addToCart = (product: Product) => {
    addItem({
      id: product.id,
      product_id: product.id,
      variant_id: null,
      quantity: 1,
      product,
    })
  }

  return (
    <div className="pt-28 pb-20">
      <div className="container-wide max-w-4xl">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Wishlist</h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Products you&apos;ve saved for later.
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse flex gap-4 p-4 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)]/50">
                <div className="w-24 h-24 bg-[var(--color-surface)] rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[var(--color-surface)] rounded w-2/3" />
                  <div className="h-3 bg-[var(--color-surface)] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
            <p className="text-lg font-medium mb-2">Your wishlist is empty</p>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Browse our collection and tap the heart icon to save products here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-[var(--color-accent-text)] rounded-xl text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
            {products.map((product) => {
              const discount = product.compare_price ? calcDiscount(product.price, product.compare_price) : 0
              return (
                <motion.div
                  key={product.id}
                  variants={staggerItem}
                  className="flex items-center gap-4 p-4 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)]/50 hover:shadow-sm transition-shadow"
                >
                  {/* Thumbnail */}
                  <Link href={`/product/${product.slug}`} className="shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[var(--color-bg-alt)] overflow-hidden relative">
                      {(() => {
                        const src = productImageUrl(product)
                        return src ? (
                          <Image
                            src={src}
                            alt={product.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL={BLUR_PLACEHOLDER}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-tertiary)]">
                              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                              <line x1="12" y1="18" x2="12.01" y2="18" />
                            </svg>
                          </div>
                        )
                      })()}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-medium text-sm sm:text-base truncate hover:text-[var(--color-accent)] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    {product.brand && (
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{product.brand.name}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
                      {product.compare_price && product.compare_price > product.price && (
                        <>
                          <span className="text-xs text-[var(--color-text-tertiary)] line-through">
                            {formatPrice(product.compare_price)}
                          </span>
                          <span className="text-xs text-red-600 dark:text-red-400 font-medium">-{discount}%</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => addToCart(product)}
                      className="p-2 rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-text)] hover:bg-[var(--color-accent-hover)] transition-colors"
                      title="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="p-2 rounded-xl border border-[var(--color-border)] hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
