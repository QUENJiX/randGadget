'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { fadeUp } from '@/lib/animations'

interface FaqItem {
  question: string
  answer: string
  category: string
}

const faqs: FaqItem[] = [
  {
    category: 'Orders',
    question: 'How do I place an order?',
    answer: 'Browse our catalog, add items to your cart, and proceed to checkout. You can order as a guest or create an account for order tracking.',
  },
  {
    category: 'Orders',
    question: 'Can I cancel or modify my order?',
    answer: 'You can cancel an order before it is shipped by contacting our support team. Once shipped, the order cannot be cancelled but you may return it under our return policy.',
  },
  {
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept Cash on Delivery (COD), bKash, Nagad, Rocket, and card payments (Visa/Mastercard) via SSLCommerz. A ৳20 COD fee applies for Cash on Delivery orders.',
  },
  {
    category: 'Payment',
    question: 'Is online payment secure?',
    answer: 'Yes. All online payments are processed through SSLCommerz, a PCI-DSS certified payment gateway. We never store your card details.',
  },
  {
    category: 'Delivery',
    question: 'How long does delivery take?',
    answer: 'Inside Dhaka: same day to 1 day. Dhaka suburbs: 1–2 days. Outside Dhaka: 2–5 days. Remote areas (hill tracts): 3–7 days.',
  },
  {
    category: 'Delivery',
    question: 'Do you deliver outside Dhaka?',
    answer: 'Yes! We deliver to all 64 districts across Bangladesh. Delivery charges vary by zone: ৳60 Inside Dhaka, ৳80 Dhaka Suburb, ৳120 Outside Dhaka, ৳180 Remote Areas.',
  },
  {
    category: 'Delivery',
    question: 'Is there free delivery?',
    answer: 'Orders over ৳5,000 qualify for free delivery Inside Dhaka. For other zones, standard delivery charges apply.',
  },
  {
    category: 'Returns',
    question: 'What is your return policy?',
    answer: '7-day return for unopened items in original packaging. Defective products can be returned within 48 hours for free replacement or full refund.',
  },
  {
    category: 'Products',
    question: 'Are all products genuine?',
    answer: 'Yes. Every product sold on GadgetBD is 100% authentic with official manufacturer warranty. We never sell grey-market or refurbished items.',
  },
  {
    category: 'Products',
    question: 'Do products come with warranty?',
    answer: 'Yes, all products include official manufacturer warranty. Warranty duration varies by brand and product — see individual product pages for details.',
  },
]

const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))]

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filtered = activeCategory === 'All' ? faqs : faqs.filter((f) => f.category === activeCategory)

  return (
    <div className="pt-28 pb-20">
      <div className="container-wide max-w-3xl">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Find answers to common questions about orders, payments, delivery, and more.
          </p>
        </motion.div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setActiveCategory(c); setOpenIndex(null) }}
              className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                activeCategory === c
                  ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                  : 'border-[var(--color-border)] hover:bg-[var(--color-bg-alt)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {filtered.map((faq, i) => (
            <div
              key={i}
              className="border border-[var(--color-border)]/50 rounded-xl overflow-hidden bg-[var(--color-bg-card)]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[var(--color-bg-alt)]/50 transition-colors"
              >
                <span className="text-sm font-medium">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 p-6 bg-[var(--color-bg-alt)] rounded-2xl">
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">
            Still have questions?
          </p>
          <a
            href="/support"
            className="inline-flex px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
