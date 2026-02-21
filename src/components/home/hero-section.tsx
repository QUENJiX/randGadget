'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Cpu, Shield, Truck } from 'lucide-react'
import { fadeUp, staggerContainer, staggerItem, easing } from '@/lib/animations'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center overflow-hidden"
    >
      {/* Background — subtle gradient mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[var(--color-bg)]" />
        <div className="absolute top-0 right-0 w-[60%] h-[80%] opacity-[0.03]">
          <svg viewBox="0 0 800 600" fill="none" className="w-full h-full">
            <circle cx="400" cy="200" r="300" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="400" cy="200" r="200" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="400" cy="200" r="100" stroke="currentColor" strokeWidth="0.5" />
            <line x1="100" y1="200" x2="700" y2="200" stroke="currentColor" strokeWidth="0.3" />
            <line x1="400" y1="0" x2="400" y2="500" stroke="currentColor" strokeWidth="0.3" />
          </svg>
        </div>
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        className="container-wide pt-32 pb-20 md:pt-40 md:pb-32"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.div variants={staggerItem} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--color-accent-subtle)] border border-[var(--color-border)]/50 rounded-full text-xs font-medium text-[var(--color-text-secondary)]">
              <span className="w-1.5 h-1.5 bg-[var(--color-success)] rounded-full animate-pulse" />
              New arrivals shipping across Bangladesh
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={staggerItem}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Tech that moves{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Bangladesh</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: easing.smooth }}
                className="absolute bottom-1 md:bottom-2 left-0 right-0 h-3 md:h-4 bg-[var(--color-accent)]/10 origin-left -z-0"
              />
            </span>{' '}
            forward.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={staggerItem}
            className="mt-6 text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed"
          >
            Curated collection of premium gadgets. Genuine warranty,
            fast delivery inside Dhaka and all 64 districts.
            Pay your way — bKash, Nagad, or Cash on Delivery.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={staggerItem}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/category/smartphones"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-accent)] text-[var(--color-bg)] rounded-xl text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors group"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/deals"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl text-sm font-semibold hover:bg-[var(--color-surface)] transition-colors"
            >
              Today&apos;s Deals
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            variants={staggerItem}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl"
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
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-border)]/50 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[var(--color-text)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-[var(--color-border)] rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-[var(--color-text-tertiary)] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
