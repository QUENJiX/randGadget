'use client'

import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container-wide max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Contact Us</h1>
        <p className="text-[var(--color-text-secondary)] mb-10">
          Our support team is here to help. Reach out through any of the channels below.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {[
            { icon: Phone, label: 'Phone', value: '+880 1700-000000', sub: 'Sat–Thu, 10 AM – 8 PM' },
            { icon: Mail, label: 'Email', value: 'hello@gadgetbd.com', sub: 'We respond within 24 hours' },
            { icon: MessageCircle, label: 'WhatsApp', value: '+880 1700-000000', sub: 'Quick replies during business hours' },
            { icon: MapPin, label: 'Visit Us', value: 'Gulshan-2, Dhaka 1212', sub: 'Bangladesh' },
          ].map((c) => (
            <div
              key={c.label}
              className="p-5 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)]/50"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center mb-3">
                <c.icon className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">{c.label}</p>
              <p className="font-medium text-sm">{c.value}</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="p-6 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)]/50">
          <h2 className="text-lg font-semibold mb-4">Send us a message</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Subject</label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Message</label>
              <textarea
                rows={5}
                placeholder="Describe your issue or question…"
                className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
