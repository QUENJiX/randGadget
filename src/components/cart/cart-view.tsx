'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice, productImageUrl, BLUR_PLACEHOLDER } from '@/lib/utils'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'

export function CartView() {
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount, clearCart } =
    useCartStore()

  const subtotal = getSubtotal()
  const itemCount = getItemCount()

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20">
        <div className="container-wide">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--color-surface)] flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-[var(--color-text-tertiary)]" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-8">
              Looks like you haven&apos;t added anything yet. Start exploring
              our collection of premium tech gadgets.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-accent)] text-[var(--color-bg)] rounded-xl text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-20">
      <div className="container-wide">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold">
            Cart
            <span className="text-[var(--color-text-tertiary)] font-normal text-lg ml-2">
              ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-error)] transition-colors"
          >
            Clear all
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-4"
          >
            {items.map((item) => {
              const price = item.variant?.price ?? item.product.price
              return (
                <motion.div
                  key={`${item.product_id}-${item.variant_id}`}
                  variants={staggerItem}
                  layout
                  className="flex gap-5 p-5 rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-bg-card)]"
                >
                  {/* Image */}
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-[var(--color-bg-alt)] rounded-xl shrink-0 overflow-hidden relative">
                    {(() => {
                      const src = productImageUrl(item.product)
                      return src ? (
                        <Image
                          src={src}
                          alt={item.product.name}
                          fill
                          sizes="112px"
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={BLUR_PLACEHOLDER}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-tertiary)]">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                            <line x1="12" y1="18" x2="12.01" y2="18" />
                          </svg>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="text-sm font-semibold hover:text-[var(--color-accent)] transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                        {item.variant.name}
                      </p>
                    )}
                    <p className="text-base font-bold mt-2">{formatPrice(price)}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.quantity - 1,
                              item.variant_id
                            )
                          }
                          className="p-2 hover:bg-[var(--color-surface)] transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.quantity + 1,
                              item.variant_id
                            )
                          }
                          className="p-2 hover:bg-[var(--color-surface)] transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product_id, item.variant_id)}
                        className="p-2 text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Summary */}
          <div>
            <div className="sticky top-28 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
              <h3 className="text-base font-semibold mb-5">Order Summary</h3>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">
                    Subtotal ({itemCount} items)
                  </span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Delivery</span>
                  <span className="text-xs text-[var(--color-text-tertiary)]">
                    Calculated at checkout
                  </span>
                </div>
                <div className="pt-3 border-t border-[var(--color-border)] flex justify-between">
                  <span className="font-semibold">Estimated Total</span>
                  <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[var(--color-accent)] text-[var(--color-bg)] rounded-xl text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 py-3 mt-3 border border-[var(--color-border)] rounded-xl text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>

              <p className="text-[11px] text-[var(--color-text-tertiary)] text-center mt-4">
                Delivery charges: Inside Dhaka ৳60 (Free over ৳5,000) &middot; Outside Dhaka ৳120
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
