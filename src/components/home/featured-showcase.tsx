'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/types'

// Mock featured products — replace with Supabase query
const featuredProducts: Partial<Product>[] = [
  {
    id: '1',
    name: 'iPhone 16 Pro Max',
    slug: 'iphone-16-pro-max',
    price: 189999,
    compare_price: 199999,
    short_desc: 'Titanium. A18 Pro. 48MP Fusion camera. The most advanced iPhone.',
    tags: ['5G', 'A18 Pro', '48MP'],
    brand: { id: 1, name: 'Apple', slug: 'apple', logo_url: null },
  },
  {
    id: '2',
    name: 'Samsung Galaxy S25 Ultra',
    slug: 'samsung-galaxy-s25-ultra',
    price: 164999,
    compare_price: 174999,
    short_desc: 'Galaxy AI built in. 200MP camera. S Pen included.',
    tags: ['Galaxy AI', 'Snapdragon 8 Elite', '200MP'],
    brand: { id: 2, name: 'Samsung', slug: 'samsung', logo_url: null },
  },
  {
    id: '3',
    name: 'MacBook Air 15" M3',
    slug: 'macbook-air-15-m3',
    price: 179999,
    compare_price: null,
    short_desc: 'Strikingly thin. Impressively big. M3 chip with 18-hour battery.',
    tags: ['M3 Chip', '18hr Battery', 'Liquid Retina'],
    brand: { id: 1, name: 'Apple', slug: 'apple', logo_url: null },
  },
]

export function FeaturedShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-[var(--color-bg-alt)]">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] mb-3">
              Handpicked
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Featured this week
            </h2>
          </div>
          <Link
            href="/featured"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Product showcase — editorial layout */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {featuredProducts.map((product, index) => (
            <FeaturedProductRow
              key={product.id}
              product={product as Product}
              index={index}
              reversed={index % 2 === 1}
            />
          ))}
        </motion.div>

        {/* Mobile view all */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 md:hidden"
        >
          <Link
            href="/featured"
            className="inline-flex items-center gap-2 text-sm font-medium"
          >
            View all featured
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function FeaturedProductRow({
  product,
  index,
  reversed,
}: {
  product: Product
  index: number
  reversed: boolean
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <motion.div
      ref={rowRef}
      variants={staggerItem}
    >
      <Link
        href={`/product/${product.slug}`}
        className={`group flex flex-col ${
          reversed ? 'md:flex-row-reverse' : 'md:flex-row'
        } bg-[var(--color-bg-card)] border border-[var(--color-border)]/40 rounded-2xl overflow-hidden hover:shadow-[var(--shadow-lg)] hover:border-[var(--color-border)] transition-all`}
      >
        {/* Image area */}
        <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto bg-[var(--color-surface)]/50 overflow-hidden">
          <motion.div
            style={{ y: imageY }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-3xl bg-[var(--color-surface)] flex items-center justify-center shadow-inner">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-[var(--color-text-tertiary)]/50"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <p className="mt-4 text-xs text-[var(--color-text-tertiary)]">
                {product.brand?.name}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-[0.15em] mb-3">
            {product.brand?.name}
          </p>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 group-hover:text-[var(--color-accent)] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6 max-w-md">
            {product.short_desc}
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[var(--color-accent-subtle)] border border-[var(--color-border)]/50 rounded-lg text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className="text-base text-[var(--color-text-tertiary)] line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)] group-hover:gap-3 transition-all">
            View details
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
