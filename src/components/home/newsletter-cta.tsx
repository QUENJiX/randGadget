'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { fadeUp } from '@/lib/animations'

export function NewsletterCTA() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-wide">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-lg bg-[var(--color-bg-alt)] border border-[var(--color-border)] p-8 md:p-12"
        >
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
              Stay ahead of the curve
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
              Get notified about new arrivals, exclusive deals, and product
              launches. No spam — just tech that matters.
            </p>

            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[var(--color-accent)] text-[var(--color-accent-text)] rounded-lg text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors shrink-0 shadow-[var(--shadow-sm)]"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="mt-3 text-[11px] text-[var(--color-text-tertiary)]">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
