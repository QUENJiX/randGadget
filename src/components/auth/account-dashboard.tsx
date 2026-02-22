'use client'

import { useState, useEffect, useCallback } from 'react'
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
  Save,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/components/auth'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, orderStatusLabels } from '@/lib/utils'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import type { Order, UserProfile, Address, Division, District, Upazila } from '@/lib/types'

type Tab = 'orders' | 'profile' | 'addresses'

export function AccountDashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('orders')

  // Profile editing
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Address management
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressLoading, setAddressLoading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressSaving, setAddressSaving] = useState(false)
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    full_name: '',
    phone: '',
    division_id: '',
    district_id: '',
    upazila_id: '',
    street_address: '',
    postal_code: '',
    is_default: false,
  })

  // Geography data for cascading selects
  const [divisions, setDivisions] = useState<Division[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [upazilas, setUpazilas] = useState<Upazila[]>([])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setLoading(false)
      return
    }

    const supabase = createClient()
    if (!supabase) { setLoading(false); return }

    Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('divisions').select('*').order('name'),
    ]).then(([profileRes, ordersRes, divRes]) => {
      if (profileRes.data) {
        setProfile(profileRes.data as UserProfile)
        setProfileForm({
          full_name: (profileRes.data as UserProfile).full_name || '',
          phone: (profileRes.data as UserProfile).phone || '',
        })
      }
      if (ordersRes.data) setOrders(ordersRes.data as Order[])
      if (divRes.data) setDivisions(divRes.data as Division[])
      setLoading(false)
    })
  }, [user, authLoading])

  // Fetch addresses when tab switches
  const fetchAddresses = useCallback(async () => {
    if (!user) return
    const supabase = createClient()
    if (!supabase) return
    setAddressLoading(true)
    const { data } = await supabase
      .from('addresses')
      .select('*, division:divisions(id,name), district:districts(id,name), upazila:upazilas(id,name)')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })
    setAddresses((data as Address[]) ?? [])
    setAddressLoading(false)
  }, [user])

  useEffect(() => {
    if (activeTab === 'addresses') fetchAddresses()
  }, [activeTab, fetchAddresses])

  // Cascading geography selects
  useEffect(() => {
    if (!addressForm.division_id) { setDistricts([]); setUpazilas([]); return }
    const supabase = createClient()
    if (!supabase) return
    supabase
      .from('districts')
      .select('*')
      .eq('division_id', Number(addressForm.division_id))
      .order('name')
      .then(({ data }: { data: any }) => {
        setDistricts((data as District[]) ?? [])
        setUpazilas([])
      })
  }, [addressForm.division_id])

  useEffect(() => {
    if (!addressForm.district_id) { setUpazilas([]); return }
    const supabase = createClient()
    if (!supabase) return
    supabase
      .from('upazilas')
      .select('*')
      .eq('district_id', Number(addressForm.district_id))
      .order('name')
      .then(({ data }: { data: any }) => setUpazilas((data as Upazila[]) ?? []))
  }, [addressForm.district_id])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  // Profile save
  const handleProfileSave = async () => {
    if (!user) return
    setProfileSaving(true)
    setProfileMsg(null)
    const supabase = createClient()
    if (!supabase) { setProfileSaving(false); return }
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profileForm.full_name.trim() || null,
        phone: profileForm.phone.trim() || null,
      })
      .eq('id', user.id)

    if (error) {
      setProfileMsg({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } else {
      setProfile((prev) => prev ? { ...prev, full_name: profileForm.full_name.trim() || null, phone: profileForm.phone.trim() || null } : prev)
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setProfileMsg(null), 3000)
    }
    setProfileSaving(false)
  }

  // Address form helpers
  const resetAddressForm = () => {
    setAddressForm({ label: 'Home', full_name: '', phone: '', division_id: '', district_id: '', upazila_id: '', street_address: '', postal_code: '', is_default: false })
    setShowAddressForm(false)
    setEditingAddressId(null)
  }

  const startEditAddress = (addr: Address) => {
    setAddressForm({
      label: addr.label,
      full_name: addr.full_name,
      phone: addr.phone,
      division_id: addr.division_id ? String(addr.division_id) : '',
      district_id: addr.district_id ? String(addr.district_id) : '',
      upazila_id: addr.upazila_id ? String(addr.upazila_id) : '',
      street_address: addr.street_address,
      postal_code: addr.postal_code || '',
      is_default: addr.is_default,
    })
    setEditingAddressId(addr.id)
    setShowAddressForm(true)
  }

  const handleAddressSave = async () => {
    if (!user) return
    if (!addressForm.full_name.trim() || !addressForm.phone.trim() || !addressForm.street_address.trim()) return
    setAddressSaving(true)
    const supabase = createClient()
    if (!supabase) { setAddressSaving(false); return }

    // If setting as default, unset existing default first
    if (addressForm.is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id).eq('is_default', true)
    }

    const payload = {
      user_id: user.id,
      label: addressForm.label,
      full_name: addressForm.full_name.trim(),
      phone: addressForm.phone.trim(),
      division_id: addressForm.division_id ? Number(addressForm.division_id) : null,
      district_id: addressForm.district_id ? Number(addressForm.district_id) : null,
      upazila_id: addressForm.upazila_id ? Number(addressForm.upazila_id) : null,
      street_address: addressForm.street_address.trim(),
      postal_code: addressForm.postal_code.trim() || null,
      is_default: addressForm.is_default,
    }

    if (editingAddressId) {
      await supabase.from('addresses').update(payload).eq('id', editingAddressId)
    } else {
      await supabase.from('addresses').insert(payload)
    }

    setAddressSaving(false)
    resetAddressForm()
    fetchAddresses()
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Delete this address?')) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('addresses').delete().eq('id', id)
    fetchAddresses()
  }

  const handleSetDefault = async (id: string) => {
    if (!user) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id).eq('is_default', true)
    await supabase.from('addresses').update({ is_default: true }).eq('id', id)
    fetchAddresses()
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
      </div>
    )
  }

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

  const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ]

  const inputClass = 'w-full px-3.5 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)]/50 rounded-lg text-sm outline-none focus:border-[var(--color-accent)] transition-colors'
  const labelClass = 'block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5'

  return (
    <div className="pt-28 pb-20">
      <div className="container-wide max-w-4xl">
        {/* Profile header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-5 mb-8"
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

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 border-b border-[var(--color-border)]/50 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-border)]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          <Link
            href="/wishlist"
            className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-border)] transition-colors whitespace-nowrap"
          >
            <Heart className="w-4 h-4" />
            Wishlist
          </Link>
        </div>

        {/* ── Orders Tab ── */}
        {activeTab === 'orders' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
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
        )}

        {/* ── Profile Tab ── */}
        {activeTab === 'profile' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
            <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm((f) => ({ ...f, full_name: e.target.value }))}
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="01XXXXXXXXX"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={displayEmail}
                  disabled
                  className={`${inputClass} opacity-60 cursor-not-allowed`}
                />
                <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Email cannot be changed here.</p>
              </div>

              {profileMsg && (
                <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  profileMsg.type === 'success'
                    ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                }`}>
                  {profileMsg.text}
                </div>
              )}

              <button
                onClick={handleProfileSave}
                disabled={profileSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] text-[var(--color-accent-text)] rounded-lg text-sm font-semibold hover:bg-[var(--color-accent-hover)] disabled:opacity-60 transition-colors"
              >
                {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {profileSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>

            {/* Account info */}
            <div className="mt-6 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
              <h3 className="text-sm font-semibold mb-3 text-[var(--color-text-secondary)]">Account Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-tertiary)]">Member since</span>
                  <span className="font-medium">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })
                      : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-tertiary)]">Account type</span>
                  <span className="font-medium capitalize">{profile?.role ?? 'customer'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Addresses Tab ── */}
        {activeTab === 'addresses' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Saved Addresses</h2>
              {!showAddressForm && (
                <button
                  onClick={() => { resetAddressForm(); setShowAddressForm(true) }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-[var(--color-accent-text)] rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Address
                </button>
              )}
            </div>

            {/* Address Form (add / edit) */}
            {showAddressForm && (
              <div className="mb-6 p-6 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-bg-card)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">
                    {editingAddressId ? 'Edit Address' : 'New Address'}
                  </h3>
                  <button onClick={resetAddressForm} className="p-1 rounded hover:bg-[var(--color-surface)] transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Label</label>
                    <select
                      value={addressForm.label}
                      onChange={(e) => setAddressForm((f) => ({ ...f, label: e.target.value }))}
                      className={inputClass}
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      type="text"
                      value={addressForm.full_name}
                      onChange={(e) => setAddressForm((f) => ({ ...f, full_name: e.target.value }))}
                      placeholder="Recipient name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="01XXXXXXXXX"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Division</label>
                    <select
                      value={addressForm.division_id}
                      onChange={(e) => setAddressForm((f) => ({ ...f, division_id: e.target.value, district_id: '', upazila_id: '' }))}
                      className={inputClass}
                    >
                      <option value="">Select Division</option>
                      {divisions.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>District</label>
                    <select
                      value={addressForm.district_id}
                      onChange={(e) => setAddressForm((f) => ({ ...f, district_id: e.target.value, upazila_id: '' }))}
                      disabled={!addressForm.division_id}
                      className={`${inputClass} ${!addressForm.division_id ? 'opacity-50' : ''}`}
                    >
                      <option value="">Select District</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Upazila</label>
                    <select
                      value={addressForm.upazila_id}
                      onChange={(e) => setAddressForm((f) => ({ ...f, upazila_id: e.target.value }))}
                      disabled={!addressForm.district_id}
                      className={`${inputClass} ${!addressForm.district_id ? 'opacity-50' : ''}`}
                    >
                      <option value="">Select Upazila</option>
                      {upazilas.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className={labelClass}>Street Address *</label>
                  <textarea
                    value={addressForm.street_address}
                    onChange={(e) => setAddressForm((f) => ({ ...f, street_address: e.target.value }))}
                    placeholder="House no, Road, Area"
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className={labelClass}>Postal Code</label>
                    <input
                      type="text"
                      value={addressForm.postal_code}
                      onChange={(e) => setAddressForm((f) => ({ ...f, postal_code: e.target.value }))}
                      placeholder="1234"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addressForm.is_default}
                        onChange={(e) => setAddressForm((f) => ({ ...f, is_default: e.target.checked }))}
                        className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                      />
                      <span className="text-sm">Set as default address</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddressSave}
                    disabled={addressSaving || !addressForm.full_name.trim() || !addressForm.phone.trim() || !addressForm.street_address.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] text-[var(--color-accent-text)] rounded-lg text-sm font-semibold hover:bg-[var(--color-accent-hover)] disabled:opacity-60 transition-colors"
                  >
                    {addressSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editingAddressId ? 'Update Address' : 'Save Address'}
                  </button>
                  <button
                    onClick={resetAddressForm}
                    className="px-4 py-2.5 text-sm font-medium border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Address List */}
            {addressLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="p-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] text-center">
                <MapPin className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-tertiary)]" />
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">No saved addresses yet.</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">Add an address to speed up checkout.</p>
              </div>
            ) : (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
                {addresses.map((addr) => (
                  <motion.div
                    key={addr.id}
                    variants={staggerItem}
                    className={`p-5 rounded-xl border bg-[var(--color-bg-card)] transition-colors ${
                      addr.is_default ? 'border-[var(--color-accent)]/40' : 'border-[var(--color-border)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
                            {addr.label}
                          </span>
                          {addr.is_default && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-sm">{addr.full_name}</p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{addr.phone}</p>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                          {addr.street_address}
                          {(addr.upazila as any)?.name && `, ${(addr.upazila as any).name}`}
                          {(addr.district as any)?.name && `, ${(addr.district as any).name}`}
                          {(addr.division as any)?.name && `, ${(addr.division as any).name}`}
                          {addr.postal_code && ` - ${addr.postal_code}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!addr.is_default && (
                          <button
                            onClick={() => handleSetDefault(addr.id)}
                            title="Set as default"
                            className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-surface)] transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => startEditAddress(addr)}
                          title="Edit"
                          className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          title="Delete"
                          className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

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
