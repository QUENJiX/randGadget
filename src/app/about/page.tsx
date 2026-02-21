import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'GadgetBD is Bangladesh\'s premium destination for authentic smartphones, laptops, audio gear, and tech accessories.',
}

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container-wide max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">About GadgetBD</h1>

        <div className="prose prose-stone max-w-none space-y-6 text-[var(--color-text-secondary)] leading-relaxed">
          <p>
            GadgetBD is Bangladesh&apos;s premium destination for authentic tech gadgets. We bring the world&apos;s best
            technology to your doorstep — with genuine warranty, transparent pricing, and exceptional after-sales
            support.
          </p>

          <h2 className="text-lg font-semibold text-[var(--color-text)] mt-8">Our Mission</h2>
          <p>
            To make premium technology accessible to every Bangladeshi through trusted sourcing, fair pricing,
            and a shopping experience built for how Bangladesh actually shops — with Cash on Delivery, bKash,
            Nagad, and nationwide delivery to all 64 districts.
          </p>

          <h2 className="text-lg font-semibold text-[var(--color-text)] mt-8">What Sets Us Apart</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>100% Genuine Products</strong> — No grey-market or refurbished items. Every product comes with official manufacturer warranty.</li>
            <li><strong>Nationwide Coverage</strong> — We deliver to all 64 districts. Inside Dhaka delivery within 24 hours.</li>
            <li><strong>Local Payment Methods</strong> — Pay the way you prefer: bKash, Nagad, Rocket, COD, or card via SSLCommerz.</li>
            <li><strong>Expert Support</strong> — Our dedicated team is available via phone, WhatsApp, and live chat.</li>
            <li><strong>Easy Returns</strong> — 7-day return policy for unopened items with hassle-free replacement for defective products.</li>
          </ul>

          <h2 className="text-lg font-semibold text-[var(--color-text)] mt-8">Contact</h2>
          <p>
            <strong>Address:</strong> Gulshan-2, Dhaka 1212, Bangladesh<br />
            <strong>Phone:</strong> +880 1700-000000<br />
            <strong>Email:</strong> hello@gadgetbd.com
          </p>
        </div>
      </div>
    </div>
  )
}
