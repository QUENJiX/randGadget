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
    <section className="py-20 md:py-28">
      <div className="container-wide">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] mb-3">
            Why GadgetBD
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Built for Bangladesh
          </h2>
          <p className="text-base text-[var(--color-text-secondary)] max-w-lg mx-auto">
            We understand how Bangladeshis shop. Local payment methods,
            transparent delivery, and genuine products — always.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              className="group p-6 md:p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]/40 hover:border-[var(--color-border)] hover:shadow-[var(--shadow-md)] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-border)]/50 flex items-center justify-center mb-5 group-hover:bg-[var(--color-accent)] group-hover:border-transparent transition-colors">
                <feature.icon className="w-5 h-5 group-hover:text-[var(--color-bg)] transition-colors" />
              </div>
              <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
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
