import Link from 'next/link'
import {
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'

const footerLinks = {
  Shop: [
    { label: 'Smartphones', href: '/category/smartphones' },
    { label: 'Laptops', href: '/category/laptops' },
    { label: 'Audio', href: '/category/audio' },
    { label: 'Wearables', href: '/category/wearables' },
    { label: 'Accessories', href: '/category/accessories' },
  ],
  Support: [
    { label: 'Contact Us', href: '/support' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Return Policy', href: '/returns' },
    { label: 'FAQ', href: '/faq' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[var(--color-bg-alt)] border-t border-[var(--color-border)]">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[var(--color-accent)] rounded-md flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent-text)]">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-base font-semibold tracking-tight">
                Gadget<span className="font-light">BD</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mb-5 leading-relaxed">
              Bangladesh&apos;s premium destination for authentic tech gadgets.
              Genuine warranty and exceptional after-sales support.
            </p>
            <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0 text-[var(--color-text-tertiary)]" />
                <span>+880 1700-000000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0 text-[var(--color-text-tertiary)]" />
                <span>hello@gadgetbd.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--color-text-tertiary)]" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold mb-3 tracking-wide uppercase text-[var(--color-text-tertiary)]">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment methods + copyright */}
        <div className="mt-12 pt-6 border-t border-[var(--color-border)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-[var(--color-text-tertiary)] mb-2 font-medium uppercase tracking-wider">
                We Accept
              </p>
              <div className="flex items-center gap-2">
                {['bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard', 'COD'].map(
                  (method) => (
                    <div
                      key={method}
                      className="px-2.5 py-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded text-[11px] font-medium text-[var(--color-text-secondary)]"
                    >
                      {method}
                    </div>
                  )
                )}
              </div>
            </div>

            <p className="text-xs text-[var(--color-text-tertiary)]">
              &copy; {new Date().getFullYear()} GadgetBD. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
