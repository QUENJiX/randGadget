'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { formatPrice, productImageUrl, BLUR_PLACEHOLDER } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { ProductImage } from '@/lib/types'

interface DealProduct {
  id: string
  name: string
  slug: string
  price: number
  compare_price: number
  brand: { name: string } | null
  category: { name: string } | null
  is_featured: boolean
  images: ProductImage[]
}

export function DealsStrip() {
  const [deals, setDeals] = useState<DealProduct[]>([])

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase
      .from('products')
      .select('id, name, slug, price, compare_price, is_featured, brand:brands(name), category:categories(name), images:product_images(*)')
      .eq('is_active', true)
      .not('compare_price', 'is', null)
      .order('compare_price', { ascending: false })
      .limit(4)
      .then(({ data }: { data: any }) => {
        if (data) setDeals(data as DealProduct[])
      })
  }, [])

  return (
    <section className="py-16 md:py-20 bg-[var(--color-bg-alt)]">
      <div className="container-wide">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-[0.15em] mb-2">
              Limited Time
            </p>
            <h2>Today&apos;s top deals</h2>
          </div>
          <Link
            href="/deals"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            All deals
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {deals.map((deal) => {
            const discount = deal.compare_price
              ? Math.round(((deal.compare_price - deal.price) / deal.compare_price) * 100)
              : 0
            return (
              <motion.div key={deal.id} variants={staggerItem}>
                <Link
                  href={`/product/${deal.slug}`}
                  className="group block p-4 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200"
                >
                  {/* Tag row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      {deal.is_featured ? 'Featured' : 'Deal'}
                    </span>
                    <span className="px-1.5 py-0.5 bg-[var(--color-error)] text-white rounded text-[10px] font-semibold">
                      -{discount}%
                    </span>
                  </div>

                  {/* Product image */}
                  <div className="w-full aspect-square bg-[var(--color-bg-alt)] rounded-md mb-3 overflow-hidden relative">
                    {(() => {
                      const src = productImageUrl(deal)
                      return src ? (
                        <Image
                          src={src}
                          alt={deal.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={BLUR_PLACEHOLDER}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[var(--color-text-tertiary)]">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                            <line x1="12" y1="18" x2="12.01" y2="18" />
                          </svg>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Info */}
                  <p className="text-[11px] text-[var(--color-text-tertiary)] mb-0.5">{deal.brand?.name}</p>
                  <h3 className="text-sm font-medium mb-2 line-clamp-1 group-hover:text-[var(--color-accent)] transition-colors">
                    {deal.name}
                  </h3>

                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold">{formatPrice(deal.price)}</span>
                    <span className="text-sm text-[var(--color-text-tertiary)] line-through">
                      {formatPrice(deal.compare_price)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
