'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Ticket,
  BarChart3,
  ChevronLeft,
  Menu,
  LogOut,
  Store,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    if (supabase) await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <div className="min-h-screen bg-[var(--color-bg-alt)]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-[var(--color-bg-card)] border-r border-[var(--color-border)]/50 transition-all duration-300 flex flex-col
          ${collapsed ? 'w-[68px]' : 'w-60'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-16 border-b border-[var(--color-border)]/50 shrink-0">
          <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm tracking-tight">GadgetBD Admin</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-2 border-t border-[var(--color-border)]/50 space-y-1 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)] transition-colors"
            title={collapsed ? 'View Store' : undefined}
          >
            <Store className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>View Store</span>}
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-red-50 hover:text-red-600 transition-colors w-full"
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)] transition-colors w-full"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <ChevronLeft
              className={`w-[18px] h-[18px] shrink-0 transition-transform duration-300 ${
                collapsed ? 'rotate-180' : ''
              }`}
            />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? 'lg:ml-[68px]' : 'lg:ml-60'
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-[var(--color-bg-card)]/80 backdrop-blur-md border-b border-[var(--color-border)]/50 flex items-center px-4 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--color-bg-alt)] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xs font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
