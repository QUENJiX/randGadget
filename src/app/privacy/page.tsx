import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how GadgetBD collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container-wide max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-8">Last updated: February 2026</p>

        <div className="space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">1. Information We Collect</h2>
            <p>When you use GadgetBD we may collect:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Name, email, phone number, and shipping address when you place an order or create an account.</li>
              <li>Payment information processed securely through our payment partners (SSLCommerz, bKash, Nagad, Rocket). We do not store card details.</li>
              <li>Device and browsing data (IP address, browser type, pages visited) for analytics and security.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">2. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To process and deliver your orders.</li>
              <li>To communicate order updates via SMS or email.</li>
              <li>To improve our website, products, and services.</li>
              <li>To prevent fraud and ensure platform security.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">3. Data Sharing</h2>
            <p>
              We share your information only with delivery partners and payment processors necessary to fulfill your order.
              We never sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">4. Data Security</h2>
            <p>
              We use industry-standard encryption (TLS/SSL) for all data transmission. Your account is protected with
              secure authentication powered by Supabase Auth.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">5. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal data at any time by contacting us
              at <strong>hello@gadgetbd.com</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">6. Contact</h2>
            <p>
              For privacy concerns, email us at <strong>hello@gadgetbd.com</strong> or call <strong>+880 1700-000000</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
