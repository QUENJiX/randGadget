'use client'

import { useAuth, AuthForm, AccountDashboard } from '@/components/auth'

export default function AccountPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
      </div>
    )
  }

  if (user) {
    return <AccountDashboard />
  }

  return <AuthForm />
}
