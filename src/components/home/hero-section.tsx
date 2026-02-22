'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Cpu, Shield, Truck } from 'lucide-react'
import { fadeUp, staggerContainer, staggerItem, easing } from '@/lib/animations'
import { HeroIllustration } from './hero-illustration'

export function HeroSection() {
  return (
    <section className="relative flex items-center overflow-hidden bg-[var(--color-bg)]">
      <div className="container-wide pt-32 pb-16 md:pt-36 md:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {/* Eyebrow */}
          <motion.div variants={staggerItem} className="mb-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-accent-subtle)] rounded-full text-xs font-medium text-[var(--color-text-secondary)]">
              <span className="w-1.5 h-1.5 bg-[var(--color-success)] rounded-full" />
              New arrivals shipping across Bangladesh
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={staggerItem}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08]"
          >
            Tech that moves{' '}
            <span className="text-[var(--color-accent)]">Bangladesh</span>{' '}
            forward.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={staggerItem}
            className="mt-5 text-base md:text-lg text-[var(--color-text-secondary)] max-w-xl leading-relaxed"
          >
            Curated collection of premium gadgets. Genuine warranty,
            fast delivery inside Dhaka and all 64 districts.
            Pay your way — bKash, Nagad, or Cash on Delivery.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={staggerItem}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <Link
              href="/category/smartphones"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[var(--color-accent)] text-[var(--color-accent-text)] rounded-lg text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors shadow-[var(--shadow-sm)]"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/deals"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
            >
              Today&apos;s Deals
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            variants={staggerItem}
            className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-xl"
          >
            {[
              {
                icon: Shield,
                label: 'Genuine Products',
                desc: '100% authentic with official warranty',
              },
              {
                icon: Truck,
                label: 'Nationwide Delivery',
                desc: 'All 64 districts, 1-5 business days',
              },
              {
                icon: Cpu,
                label: 'Expert Support',
                desc: 'Dedicated tech support team',
              },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--color-surface)] flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side illustration */}
        <HeroIllustration />
      </div>
    </section>
  )
}
