'use client'

import { motion } from 'framer-motion'
import { Truck, Shield, CreditCard, Headphones, RotateCcw, MapPin } from 'lucide-react'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'

const features = [
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    description: 'We deliver to all 64 districts across Bangladesh. Inside Dhaka delivery within 24 hours.',
  },
  {
    icon: CreditCard,
    title: 'Pay Your Way',
    description: 'Cash on Delivery, bKash, Nagad, Rocket, or card payment via SSLCommerz.',
  },
  {
    icon: Shield,
    title: 'Genuine Products',
    description: 'Every product comes with official warranty. No grey-market or refurbished items.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '7-day return policy for unopened items. Hassle-free replacement for defective products.',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    description: 'Dedicated tech support team available via phone, WhatsApp, and live chat.',
  },
  {
    icon: MapPin,
    title: 'Delivery Zones',
    description: 'Transparent pricing — ৳60 inside Dhaka, ৳120 outside Dhaka. Free delivery over ৳5,000.',
  },
]

export function WhyGadgetBD() {
  return (
    <section className="py-16 md:py-20 bg-[var(--color-bg-alt)]">
      <div className="container-wide">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-[0.15em] mb-2">
            Why GadgetBD
          </p>
          <h2 className="mb-3">Built for Bangladesh</h2>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto">
            We understand how Bangladeshis shop. Local payment methods,
            transparent delivery, and genuine products — always.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              className="p-5 md:p-6 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)]"
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--color-surface)] flex items-center justify-center mb-4">
                <feature.icon className="w-4 h-4 text-[var(--color-text-secondary)]" />
              </div>
              <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
