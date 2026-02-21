'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { cardHover, staggerItem } from '@/lib/animations'
import { formatPrice, calcDiscount } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const discount = product.compare_price
    ? calcDiscount(product.price, product.compare_price)
    : 0

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      <motion.div
        initial="rest"
        whileHover="hover"
        className="group relative bg-[var(--color-bg-card)] border border-[var(--color-border)]/50 rounded-2xl overflow-hidden transition-shadow hover:shadow-[var(--shadow-lg)]"
      >
        {/* Image */}
        <Link href={`/product/${product.slug}`} className="block">
          <div className="relative aspect-square bg-[var(--color-bg-alt)] overflow-hidden">
            {/* Placeholder — replace with Next.js Image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-2 rounded-2xl bg-[var(--color-surface)] flex items-center justify-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-[var(--color-text-tertiary)]"
                  >
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </div>
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  {product.brand?.name || 'Product'}
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="px-2 py-0.5 bg-[var(--color-error)] text-white text-[10px] font-semibold rounded-md">
                  -{discount}%
                </span>
              )}
              {product.is_featured && (
                <span className="px-2 py-0.5 bg-[var(--color-accent)] text-[var(--color-bg)] text-[10px] font-semibold rounded-md">
                  Featured
                </span>
              )}
            </div>

            {/* Quick actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <button
                className="w-9 h-9 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl flex items-center justify-center shadow-sm hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] hover:border-transparent transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart className="w-4 h-4" />
              </button>
              <button
                className="w-9 h-9 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl flex items-center justify-center shadow-sm hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] hover:border-transparent transition-colors"
                aria-label="Quick add to cart"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>

            {/* Hover overlay */}
            <motion.div
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1 },
              }}
              className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"
            />
          </div>
        </Link>

        {/* Info */}
        <div className="p-4">
          <Link href={`/product/${product.slug}`}>
            {product.category?.name && (
              <p className="text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">
                {product.category.name}
              </p>
            )}
            <h3 className="text-sm font-medium leading-snug mb-2 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
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
            <p className="mt-2 text-[11px] text-[var(--color-warning)] font-medium">
              Only {product.stock} left in stock
            </p>
          )}
          {product.stock === 0 && (
            <p className="mt-2 text-[11px] text-[var(--color-error)] font-medium">
              Out of stock
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
