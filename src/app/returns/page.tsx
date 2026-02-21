import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Return Policy',
  description: 'GadgetBD\'s return and refund policy — hassle-free returns within 7 days of delivery.',
}

export default function ReturnsPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container-wide max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Return &amp; Refund Policy</h1>

        <div className="space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">Return Window</h2>
            <p>
              You may return eligible products within <strong>7 days</strong> of delivery. The product must be unopened,
              unused, and in its original packaging with all accessories, manuals, and tags intact.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">Non-Returnable Items</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Products that have been opened, used, or show signs of wear.</li>
              <li>Items without original packaging or missing accessories.</li>
              <li>Software licenses and digital products.</li>
              <li>Clearance or final-sale items (marked as such at purchase).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">Defective Products</h2>
            <p>
              If you receive a defective product, contact us within 48 hours. We will arrange a free pickup and provide
              a replacement or full refund at your choice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">How to Initiate a Return</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Contact our support team at <strong>hello@gadgetbd.com</strong> or <strong>+880 1700-000000</strong>.</li>
              <li>Provide your order number and reason for return.</li>
              <li>We&apos;ll arrange a pickup or provide a return shipping label.</li>
              <li>Once received and inspected, your refund is processed within 7 business days.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">Refund Method</h2>
            <p>
              Refunds are issued to the original payment method. COD orders are refunded via bKash or bank transfer.
              Please allow 3–7 business days for the refund to appear in your account.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
