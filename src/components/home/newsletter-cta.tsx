'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { fadeUp } from '@/lib/animations'

export function NewsletterCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-wide">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-[var(--color-bg-alt)] border border-[var(--color-border)]/40 p-10 md:p-16"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 400 400">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Stay ahead of the curve
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-8 leading-relaxed">
              Get notified about new arrivals, exclusive deals, and product
              launches. No spam — just tech that matters.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 px-5 py-3.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-accent)] text-[var(--color-accent-text)] rounded-xl text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors shrink-0 group"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            <p className="mt-4 text-xs text-[var(--color-text-tertiary)]">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
