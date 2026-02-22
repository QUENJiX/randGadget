'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { formatPrice, productImageUrl, BLUR_PLACEHOLDER } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/types'

export function FeaturedShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase
      .from('products')
      .select('*, brand:brands(*), category:categories(*), images:product_images(*)')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }: { data: any }) => {
        if (data) setFeaturedProducts(data as Product[])
      })
  }, [])

  return (
    <section ref={sectionRef} className="py-16 md:py-20">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-[0.15em] mb-2">
              Handpicked
            </p>
            <h2>Featured this week</h2>
          </div>
          <Link
            href="/featured"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Product showcase */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {featuredProducts.map((product, index) => (
            <FeaturedProductRow
              key={product.id}
              product={product}
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
          className="mt-8 md:hidden"
        >
          <Link
            href="/featured"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)]"
          >
            View all featured
            <ArrowRight className="w-3.5 h-3.5" />
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
  return (
    <motion.div variants={staggerItem}>
      <Link
        href={`/product/${product.slug}`}
        className={`group flex flex-col ${
          reversed ? 'md:flex-row-reverse' : 'md:flex-row'
        } bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden hover:shadow-[var(--shadow-md)] transition-shadow duration-200`}
      >
        {/* Image area */}
        <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto bg-[var(--color-bg-alt)] overflow-hidden">
          {(() => {
            const src = productImageUrl(product)
            return src ? (
              <Image
                src={src}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-28 h-28 md:w-36 md:h-36 mx-auto rounded-xl bg-[var(--color-surface)] flex items-center justify-center">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[var(--color-text-tertiary)]">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  </div>
                  <p className="mt-3 text-xs text-[var(--color-text-tertiary)]">{product.brand?.name}</p>
                </div>
              </div>
            )
          })()}
        </div>

        {/* Content */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
            {product.brand?.name}
          </p>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 group-hover:text-[var(--color-accent)] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-5 max-w-md">
            {product.short_desc}
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-[var(--color-surface)] rounded text-xs font-medium text-[var(--color-text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className="text-base text-[var(--color-text-tertiary)] line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)]">
            View details
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
