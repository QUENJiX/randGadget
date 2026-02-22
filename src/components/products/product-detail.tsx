'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Minus, Plus, Truck, Shield, RotateCcw, Star, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { formatPrice, calcDiscount, cn, productImageUrl, imageUrl, BLUR_PLACEHOLDER } from '@/lib/utils'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import type { Product, ProductVariant } from '@/lib/types'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  )
  const [quantity, setQuantity] = useState(1)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const isWishlisted = useWishlistStore((s) => s.ids.includes(product.id))
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'reviews'>('specs')
  const [activeImage, setActiveImage] = useState(0)
  const addItem = useCartStore((s) => s.addItem)

  const currentPrice = selectedVariant?.price ?? product.price
  const discount = product.compare_price
    ? calcDiscount(currentPrice, product.compare_price)
    : 0

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedVariant?.id || 'default'}`,
      product_id: product.id,
      variant_id: selectedVariant?.id || null,
      quantity,
      product,
      variant: selectedVariant || undefined,
    })
  }

  return (
    <div className="pt-24 md:pt-28">
      <div className="container-wide py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image gallery */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {/* Main image */}
            <div className="aspect-square bg-[var(--color-bg-alt)] rounded-lg border border-[var(--color-border)] overflow-hidden relative mb-3">
              {(() => {
                const images = product.images ?? []
                const src = images[activeImage]
                  ? imageUrl(images[activeImage].url)
                  : productImageUrl(product)
                return src ? (
                  <Image
                    src={src}
                    alt={images[activeImage]?.alt_text ?? product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_PLACEHOLDER}
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-40 h-40 mx-auto rounded-3xl bg-[var(--color-surface)] flex items-center justify-center">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[var(--color-text-tertiary)]">
                          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                          <line x1="12" y1="18" x2="12.01" y2="18" />
                        </svg>
                      </div>
                      <p className="mt-4 text-sm text-[var(--color-text-tertiary)]">{product.brand?.name} {product.name}</p>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {(product.images && product.images.length > 0
                ? product.images
                : [null, null, null, null]
              ).map((img, i) => (
                <button
                  key={img?.id ?? i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'w-16 h-16 rounded-md bg-[var(--color-bg-alt)] border overflow-hidden relative transition-all',
                    activeImage === i
                      ? 'border-[var(--color-accent)]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
                  )}
                >
                  {img ? (
                    <Image
                      src={imageUrl(img.url)}
                      alt={img.alt_text ?? `${product.name} ${i + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-[var(--color-text-tertiary)] flex items-center justify-center h-full">{i + 1}</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Breadcrumb */}
            <motion.div variants={staggerItem} className="mb-4">
              <p className="text-xs text-[var(--color-text-tertiary)]">
                {product.category?.name} / {product.brand?.name}
              </p>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={staggerItem}
              className="text-2xl md:text-3xl font-bold tracking-tight mb-3"
            >
              {product.name}
            </motion.h1>

            {/* Rating — only shown when real reviews exist */}
            {product.review_count != null && product.review_count > 0 && (
            <motion.div variants={staggerItem} className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i <= Math.round(product.avg_rating ?? 0)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-[var(--color-border)]'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-[var(--color-text-secondary)]">
                {(product.avg_rating ?? 0).toFixed(1)} ({product.review_count} {product.review_count === 1 ? 'review' : 'reviews'})
              </span>
            </motion.div>
            )}

            {/* Price */}
            <motion.div variants={staggerItem} className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold">{formatPrice(currentPrice)}</span>
              {product.compare_price && (
                <>
                  <span className="text-lg text-[var(--color-text-tertiary)] line-through">
                    {formatPrice(product.compare_price)}
                  </span>
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-semibold rounded-md dark:bg-red-950 dark:text-red-400">
                    Save {discount}%
                  </span>
                </>
              )}
            </motion.div>

            {/* Short description */}
            <motion.p
              variants={staggerItem}
              className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6"
            >
              {product.short_desc}
            </motion.p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <motion.div variants={staggerItem} className="mb-6">
                <p className="text-sm font-medium mb-3">Variant</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-sm font-medium border transition-all',
                        selectedVariant?.id === variant.id
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                          : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
                      )}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quantity + Add to cart */}
            <motion.div variants={staggerItem} className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-[var(--color-border)] rounded-md overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-[var(--color-surface)] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-[var(--color-surface)] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-[var(--color-accent-text)] rounded-lg text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors shadow-[var(--shadow-sm)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 border rounded-lg transition-colors ${
                  isWishlisted
                    ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-500'
                    : 'border-[var(--color-border)] hover:bg-[var(--color-surface)]'
                }`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={staggerItem}
              className="space-y-3 py-5 border-t border-[var(--color-border)]"
            >
              {[
                { icon: Truck, text: 'Free delivery inside Dhaka over ৳5,000' },
                { icon: Shield, text: 'Official warranty included' },
                { icon: RotateCcw, text: '7-day return policy' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.text}
                </div>
              ))}
            </motion.div>

            {/* Tabs: Specs, Description, Reviews */}
            <motion.div variants={staggerItem} className="mt-6">
              <div className="flex gap-1 border-b border-[var(--color-border)]">
                {(['specs', 'description', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize',
                      activeTab === tab
                        ? 'border-[var(--color-accent)] text-[var(--color-text)]'
                        : 'border-transparent text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
                    )}
                  >
                    {tab === 'specs' ? 'Specifications' : tab}
                  </button>
                ))}
              </div>

              <div className="py-6">
                {activeTab === 'specs' && product.specs && (
                  <div className="space-y-0">
                    {Object.entries(product.specs).map(([key, value], i) => (
                      <div
                        key={key}
                        className={cn(
                          'flex items-center py-3 text-sm',
                          i !== Object.keys(product.specs).length - 1 &&
                            'border-b border-[var(--color-border)]/50'
                        )}
                      >
                        <span className="w-40 text-[var(--color-text-secondary)] shrink-0">
                          {key}
                        </span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'description' && (
                  <div className="prose prose-sm max-w-none text-[var(--color-text-secondary)]">
                    <p>{product.description || product.short_desc}</p>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    <p>No reviews yet. Be the first to review this product.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
