'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
} from 'lucide-react'
import { useCartStore, useSearchStore } from '@/lib/store'
import { navbarSlide, mobileMenuOverlay, mobileMenuPanel, fadeDown } from '@/lib/animations'

const navLinks = [
  { label: 'Smartphones', href: '/category/smartphones' },
  { label: 'Laptops', href: '/category/laptops' },
  { label: 'Audio', href: '/category/audio' },
  { label: 'Wearables', href: '/category/wearables' },
  { label: 'Accessories', href: '/category/accessories' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const itemCount = useCartStore((s) => s.getItemCount())
  const openSearch = useSearchStore((s) => s.open)

  // Track scroll for header background
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (y) => {
      setScrolled(y > 32)
    })
    return unsubscribe
  }, [scrollY])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.header
        variants={navbarSlide}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--color-bg)]/95 backdrop-blur-xl border-b border-[var(--color-border)]'
            : 'bg-transparent'
        }`}
      >
        {/* Top bar */}
        <div className="hidden md:block border-b border-[var(--color-border)]/50">
          <div className="container-wide flex items-center justify-between py-1.5 text-xs text-[var(--color-text-tertiary)]">
            <span>Free delivery inside Dhaka on orders over ৳5,000</span>
            <div className="flex items-center gap-4">
              <Link href="/track-order" className="hover:text-[var(--color-text)] transition-colors">
                Track Order
              </Link>
              <Link href="/support" className="hover:text-[var(--color-text)] transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="container-wide">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-bg)]">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Gadget<span className="font-light">BD</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors rounded-lg hover:bg-[var(--color-accent-subtle)]"
                >
                  {link.label}
                </Link>
              ))}
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors rounded-lg hover:bg-[var(--color-accent-subtle)]">
                More
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={openSearch}
                className="p-2.5 rounded-xl hover:bg-[var(--color-accent-subtle)] transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/wishlist"
                className="hidden sm:flex p-2.5 rounded-xl hover:bg-[var(--color-accent-subtle)] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              <Link
                href="/account"
                className="hidden sm:flex p-2.5 rounded-xl hover:bg-[var(--color-accent-subtle)] transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/cart"
                className="relative p-2.5 rounded-xl hover:bg-[var(--color-accent-subtle)] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[var(--color-accent)] text-[var(--color-bg)] text-[10px] font-semibold rounded-full flex items-center justify-center"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-[var(--color-accent-subtle)] transition-colors ml-1"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              variants={mobileMenuOverlay}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40"
            />
            <motion.div
              variants={mobileMenuPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 z-[70] w-[85vw] max-w-sm bg-[var(--color-bg)] shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-[var(--color-border)]">
                <span className="font-semibold text-lg">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-[var(--color-accent-subtle)]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-6 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center py-3 px-4 text-base font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-accent-subtle)] rounded-xl transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-6 mt-6 border-t border-[var(--color-border)] space-y-1">
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 text-sm rounded-xl hover:bg-[var(--color-accent-subtle)] transition-colors"
                  >
                    <User className="w-4 h-4" /> Account
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 text-sm rounded-xl hover:bg-[var(--color-accent-subtle)] transition-colors"
                  >
                    <Heart className="w-4 h-4" /> Wishlist
                  </Link>
                  <Link
                    href="/track-order"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 text-sm rounded-xl hover:bg-[var(--color-accent-subtle)] transition-colors"
                  >
                    <Search className="w-4 h-4" /> Track Order
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
