import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions governing your use of GadgetBD.',
}

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container-wide max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-8">Last updated: February 2026</p>

        <div className="space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">1. General</h2>
            <p>
              By using GadgetBD you agree to these terms. GadgetBD is operated from Dhaka, Bangladesh and serves
              customers throughout the country.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">2. Products &amp; Pricing</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>All prices are listed in Bangladeshi Taka (৳) and include VAT where applicable.</li>
              <li>Prices are subject to change without notice. The price at the time of order placement is final.</li>
              <li>All products are 100% genuine with official manufacturer warranty.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">3. Orders &amp; Payment</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Orders are confirmed once payment is received or COD is selected.</li>
              <li>We accept Cash on Delivery (৳20 COD fee), bKash, Nagad, Rocket, and SSLCommerz (Visa/Mastercard).</li>
              <li>We reserve the right to cancel orders due to stock unavailability or suspected fraud.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">4. Delivery</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Inside Dhaka: 1 business day. Dhaka suburbs: 1–2 days. Outside Dhaka: 2–5 days. Remote areas: 3–7 days.</li>
              <li>Delivery charges: ৳60 Inside Dhaka, ৳80 Dhaka Suburb, ৳120 Outside Dhaka, ৳180 Remote Areas.</li>
              <li>Free delivery on orders over ৳5,000 (Inside Dhaka only).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">5. Returns &amp; Refunds</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>7-day return policy for unopened items in original packaging.</li>
              <li>Defective products will be replaced or refunded within 7 business days of return receipt.</li>
              <li>Refunds are processed to the original payment method.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">6. Contact</h2>
            <p>
              For questions about these terms, contact us at <strong>hello@gadgetbd.com</strong> or <strong>+880 1700-000000</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
