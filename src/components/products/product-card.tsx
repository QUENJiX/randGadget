'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag } from 'lucide-react'
import { staggerItem } from '@/lib/animations'
import { formatPrice, calcDiscount, productImageUrl, BLUR_PLACEHOLDER } from '@/lib/utils'
import { useWishlistStore, useCartStore } from '@/lib/store'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const isWishlisted = useWishlistStore((s) => s.ids.includes(product.id))
  const addItem = useCartStore((s) => s.addItem)
  const removeCartItem = useCartStore((s) => s.removeItem)
  const isInCart = useCartStore((s) => s.items.some((i) => i.product_id === product.id))
  const discount = product.compare_price
    ? calcDiscount(product.price, product.compare_price)
    : 0

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      <div className="group relative bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden transition-shadow duration-200 hover:shadow-[var(--shadow-md)]">
        {/* Image */}
        <Link href={`/product/${product.slug}`} className="block">
          <div className="relative aspect-square bg-[var(--color-bg-alt)] overflow-hidden">
            {(() => {
              const src = productImageUrl(product)
              return src ? (
                <Image
                  src={src}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-[var(--color-surface)] flex items-center justify-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-tertiary)]">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                        <line x1="12" y1="18" x2="12.01" y2="18" />
                      </svg>
                    </div>
                    <span className="text-xs text-[var(--color-text-tertiary)]">{product.brand?.name || 'Product'}</span>
                  </div>
                </div>
              )
            })()}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discount > 0 && (
                <span className="px-1.5 py-0.5 bg-[var(--color-error)] text-white text-[10px] font-semibold rounded">
                  -{discount}%
                </span>
              )}
              {product.is_featured && (
                <span className="px-1.5 py-0.5 bg-[var(--color-accent)] text-[var(--color-accent-text)] text-[10px] font-semibold rounded">
                  Featured
                </span>
              )}
            </div>

            {/* Quick actions — appear on hover */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id) }}
                className={`w-8 h-8 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-md flex items-center justify-center shadow-[var(--shadow-sm)] transition-colors ${
                  isWishlisted
                    ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                    : 'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-text)] hover:border-transparent'
                }`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className="w-3.5 h-3.5" fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (isInCart) {
                    removeCartItem(product.id)
                  } else if (product.stock > 0) {
                    addItem({ id: product.id, product_id: product.id, variant_id: null, quantity: 1, product })
                  }
                }}
                className={`w-8 h-8 rounded-md flex items-center justify-center shadow-[var(--shadow-sm)] transition-colors ${
                  isInCart
                    ? 'bg-green-600 text-white border border-green-600'
                    : 'bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-text)] hover:border-transparent'
                }`}
                aria-label={isInCart ? 'Remove from cart' : 'Quick add to cart'}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="p-3">
          <Link href={`/product/${product.slug}`}>
            {product.category?.name && (
              <p className="text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-0.5">
                {product.category.name}
              </p>
            )}
            <h3 className="text-sm font-medium leading-snug mb-1.5 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && (
              <span className="text-sm text-[var(--color-text-tertiary)] line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="mt-1.5 text-[11px] text-[var(--color-warning)] font-medium">
              Only {product.stock} left
            </p>
          )}
          {product.stock === 0 && (
            <p className="mt-1.5 text-[11px] text-[var(--color-error)] font-medium">
              Out of stock
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
