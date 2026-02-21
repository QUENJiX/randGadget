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
    <section className="py-20 md:py-28 bg-[var(--color-accent)] text-[var(--color-bg)]">
      <div className="container-wide">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-xs font-medium opacity-60 uppercase tracking-[0.2em] mb-3">
              Limited Time
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Today&apos;s top deals
            </h2>
          </div>
          <Link
            href="/deals"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium opacity-80 hover:opacity-100 transition-opacity group"
          >
            All deals
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {deals.map((deal) => {
            const discount = deal.compare_price
              ? Math.round(((deal.compare_price - deal.price) / deal.compare_price) * 100)
              : 0
            const tag = deal.is_featured ? 'Featured' : 'Deal'
            return (
              <motion.div key={deal.id} variants={staggerItem}>
                <Link
                  href={`/product/${deal.slug}`}
                  className="group block p-6 rounded-2xl bg-white/[0.08] border border-white/[0.1] hover:bg-white/[0.12] hover:border-white/[0.2] transition-all"
                >
                  {/* Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
                      {tag}
                    </span>
                    <span className="px-2 py-0.5 bg-white/[0.15] rounded-md text-[11px] font-semibold">
                      -{discount}%
                    </span>
                  </div>

                  {/* Product image */}
                  <div className="w-full aspect-square bg-white/[0.06] rounded-xl mb-4 overflow-hidden relative">
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
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-30">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                            <line x1="12" y1="18" x2="12.01" y2="18" />
                          </svg>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Info */}
                  <p className="text-xs opacity-50 mb-1">{deal.brand?.name}</p>
                  <h3 className="text-sm font-semibold mb-3 line-clamp-1 group-hover:opacity-90 transition-opacity">
                    {deal.name}
                  </h3>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold">{formatPrice(deal.price)}</span>
                    <span className="text-sm opacity-50 line-through">
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
