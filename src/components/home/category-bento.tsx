'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Smartphone, Laptop, Headphones, Watch, Cable } from 'lucide-react'
import { bentoItem, fadeUp } from '@/lib/animations'
import { CategoryIllustration } from './category-illustrations'

interface BentoCard {
  id: string
  title: string
  description: string
  href: string
  icon: React.ElementType
  className: string
}

const bentoCards: BentoCard[] = [
  {
    id: 'smartphones',
    title: 'Smartphones',
    description: 'Flagship phones from Apple, Samsung, Google, and more. Latest models with official warranty.',
    href: '/category/smartphones',
    icon: Smartphone,
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    id: 'laptops',
    title: 'Laptops',
    description: 'MacBooks, ThinkPads, and gaming powerhouses.',
    href: '/category/laptops',
    icon: Laptop,
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    id: 'audio',
    title: 'Audio',
    description: 'Premium earbuds, headphones, and speakers.',
    href: '/category/audio',
    icon: Headphones,
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    id: 'wearables',
    title: 'Wearables',
    description: 'Smartwatches and fitness trackers for every lifestyle.',
    href: '/category/wearables',
    icon: Watch,
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    id: 'accessories',
    title: 'Accessories',
    description: 'Chargers, cases, cables, and essential tech gear.',
    href: '/category/accessories',
    icon: Cable,
    className: 'md:col-span-1 md:row-span-1',
  },
]

export function CategoryBento() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-wide">
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-[0.15em] mb-2">
            Browse by Category
          </p>
          <h2>Find your next device</h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {bentoCards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={bentoItem(index)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className={card.className}
            >
              <Link
                href={card.href}
                className="group relative block h-full min-h-[180px] md:min-h-[220px] p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg-alt)] border border-[var(--color-border)]/50 overflow-hidden transition-all duration-500 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
              >
                <CategoryIllustration type={card.id} />

                <div className="relative z-10 w-full md:w-2/3 h-full flex flex-col justify-between pointer-events-none">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center mb-3 group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)] transition-colors duration-300">
                      <card.icon className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-bg)] transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] max-w-xs leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] translate-y-0 group-hover:translate-x-1 transition-transform duration-300">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:ml-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
