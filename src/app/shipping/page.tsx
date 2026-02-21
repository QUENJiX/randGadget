import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Delivery zones, estimated times, and shipping charges for orders across Bangladesh.',
}

export default function ShippingPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container-wide max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Shipping Policy</h1>

        <div className="space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">Delivery Zones &amp; Charges</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-3 pr-4 font-semibold text-[var(--color-text)]">Zone</th>
                    <th className="text-left py-3 pr-4 font-semibold text-[var(--color-text)]">Areas</th>
                    <th className="text-left py-3 pr-4 font-semibold text-[var(--color-text)]">Charge</th>
                    <th className="text-left py-3 font-semibold text-[var(--color-text)]">Est. Delivery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]/50">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--color-dhaka)]">Inside Dhaka</td>
                    <td className="py-3 pr-4">Dhaka city thanas</td>
                    <td className="py-3 pr-4">৳60</td>
                    <td className="py-3">Same day — 1 day</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium">Dhaka Suburb</td>
                    <td className="py-3 pr-4">Gazipur, Narayanganj, Savar, Keraniganj, etc.</td>
                    <td className="py-3 pr-4">৳80</td>
                    <td className="py-3">1–2 days</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--color-outside)]">Outside Dhaka</td>
                    <td className="py-3 pr-4">All other mainland districts</td>
                    <td className="py-3 pr-4">৳120</td>
                    <td className="py-3">2–5 days</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium">Remote Areas</td>
                    <td className="py-3 pr-4">Hill tracts, island upazilas</td>
                    <td className="py-3 pr-4">৳180</td>
                    <td className="py-3">3–7 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">Free Delivery</h2>
            <p>
              Orders over <strong>৳5,000</strong> qualify for free delivery Inside Dhaka. For other zones, standard charges apply.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">Packaging</h2>
            <p>
              All products are carefully packed with protective materials. Electronics are shipped in original manufacturer packaging
              plus an outer shipping box for double protection.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">Order Tracking</h2>
            <p>
              Once your order is shipped, you&apos;ll receive an SMS with your tracking details. You can also track your order
              on our <a href="/track-order" className="text-[var(--color-accent)] underline underline-offset-2 hover:no-underline">Track Order</a> page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
