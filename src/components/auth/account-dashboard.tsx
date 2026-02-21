'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react'
import { useAuth } from '@/components/auth'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, orderStatusLabels } from '@/lib/utils'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import type { Order, UserProfile } from '@/lib/types'

export function AccountDashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setLoading(false)
      return
    }

    const supabase = createClient()
    if (!supabase) { setLoading(false); return }

    // Fetch profile and recent orders in parallel
    Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    ]).then(([profileRes, ordersRes]) => {
      if (profileRes.data) setProfile(profileRes.data as UserProfile)
      if (ordersRes.data) setOrders(ordersRes.data as Order[])
      setLoading(false)
    })
  }, [user, authLoading])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in — show nothing (the page component will show the AuthForm instead)
  if (!user) return null

  const displayName = profile?.full_name || user.user_metadata?.full_name || 'User'
  const displayEmail = user.email || ''
  const displayPhone = profile?.phone || user.user_metadata?.phone || ''

  const statusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30'
      case 'shipped':
      case 'out_for_delivery': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
      case 'cancelled':
      case 'returned': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
      default: return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30'
    }
  }

  return (
    <div className="pt-28 pb-20">
      <div className="container-wide max-w-4xl">
        {/* Profile header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-5 mb-10"
        >
          <div className="w-16 h-16 bg-[var(--color-accent)] rounded-2xl flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-[var(--color-accent-text)]">
              {displayName[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">{displayName}</h1>
            <p className="text-sm text-[var(--color-text-secondary)] truncate">{displayEmail}</p>
            {displayPhone && (
              <p className="text-sm text-[var(--color-text-tertiary)]">{displayPhone}</p>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-surface)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>

        {/* Quick links */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
        >
          {[
            { label: 'Orders', icon: Package, href: '#orders', count: orders.length },
            { label: 'Addresses', icon: MapPin, href: '#', count: 0 },
            { label: 'Wishlist', icon: Heart, href: '/wishlist', count: 0 },
            { label: 'Profile', icon: User, href: '#profile', count: 0 },
          ].map((item) => (
            <motion.a
              key={item.label}
              variants={staggerItem}
              href={item.href}
              className="flex flex-col items-center gap-2 p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-accent)] transition-colors"
            >
              <item.icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <span className="text-sm font-medium">{item.label}</span>
              {item.count > 0 && (
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  {item.count}
                </span>
              )}
            </motion.a>
          ))}
        </motion.div>

        {/* Recent orders */}
        <motion.div
          id="orders"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="p-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] text-center">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-tertiary)]" />
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                You haven&apos;t placed any orders yet.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] text-[var(--color-accent-text)] rounded-xl text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/order/${order.id}`}
                  className="flex items-center gap-4 p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-accent)] transition-colors group"
                >
                  <div className="w-10 h-10 bg-[var(--color-surface)] rounded-lg flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{order.order_number}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-BD', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(order.status)}`}>
                    {orderStatusLabels[order.status] || order.status}
                  </span>
                  <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                  <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text)] transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Mobile sign out */}
        <div className="sm:hidden mt-10">
          <button
            onClick={handleSignOut}
            className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-medium border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-surface)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
