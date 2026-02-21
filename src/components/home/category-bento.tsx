'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Smartphone, Laptop, Headphones, Watch, Cable } from 'lucide-react'
import { bentoItem, staggerContainer, staggerItem, fadeUp } from '@/lib/animations'

interface BentoCard {
  title: string
  description: string
  href: string
  icon: React.ElementType
  className: string
  accent: string
}

const bentoCards: BentoCard[] = [
  {
    title: 'Smartphones',
    description: 'Flagship phones from Apple, Samsung, Google, and more. Latest models with official warranty.',
    href: '/category/smartphones',
    icon: Smartphone,
    className: 'md:col-span-2 md:row-span-2',
    accent: 'from-stone-100 to-stone-50 dark:from-stone-900 dark:to-stone-950',
  },
  {
    title: 'Laptops',
    description: 'MacBooks, ThinkPads, and gaming powerhouses.',
    href: '/category/laptops',
    icon: Laptop,
    className: 'md:col-span-1 md:row-span-1',
    accent: 'from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950',
  },
  {
    title: 'Audio',
    description: 'Premium earbuds, headphones, and speakers.',
    href: '/category/audio',
    icon: Headphones,
    className: 'md:col-span-1 md:row-span-1',
    accent: 'from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950',
  },
  {
    title: 'Wearables',
    description: 'Smartwatches and fitness trackers for every lifestyle.',
    href: '/category/wearables',
    icon: Watch,
    className: 'md:col-span-1 md:row-span-1',
    accent: 'from-stone-100 to-stone-50 dark:from-stone-900 dark:to-stone-950',
  },
  {
    title: 'Accessories',
    description: 'Chargers, cases, cables, and essential tech gear.',
    href: '/category/accessories',
    icon: Cable,
    className: 'md:col-span-1 md:row-span-1',
    accent: 'from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950',
  },
]

export function CategoryBento() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-wide">
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] mb-3">
            Browse by Category
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Find your next device
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {bentoCards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={bentoItem(index)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className={card.className}
            >
              <Link
                href={card.href}
                className={`group relative block h-full min-h-[200px] md:min-h-[240px] p-8 rounded-2xl bg-gradient-to-br ${card.accent} border border-[var(--color-border)]/40 overflow-hidden transition-all hover:shadow-[var(--shadow-lg)] hover:border-[var(--color-border)]`}
              >
                {/* Icon background */}
                <div className="absolute bottom-0 right-0 opacity-[0.06] transform translate-x-4 translate-y-4">
                  <card.icon className="w-40 h-40 md:w-56 md:h-56" strokeWidth={0.8} />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]/50 flex items-center justify-center mb-4 shadow-sm">
                      <card.icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] max-w-xs leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                    <span>Explore</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
