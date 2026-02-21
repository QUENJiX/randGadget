'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { createClient } from '@/lib/supabase/client'

type AuthMode = 'login' | 'register'

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('full_name') as string
    const phone = formData.get('phone') as string

    const supabase = createClient()
    if (!supabase) {
      setError('Supabase is not configured. Please set up your environment variables.')
      setLoading(false)
      return
    }

    if (mode === 'login') {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) {
        setError(authError.message)
      } else {
        router.push('/account')
        router.refresh()
      }
    } else {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
        },
      })
      if (authError) {
        setError(authError.message)
      } else {
        setMessage('Check your email for a confirmation link to complete registration.')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[var(--color-accent)] rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-bg)]">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">
            {mode === 'login'
              ? 'Sign in to your GadgetBD account'
              : 'Join GadgetBD for exclusive deals and faster checkout'}
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
          {/* Mode toggle */}
          <div className="flex gap-1 p-1 bg-[var(--color-surface)] rounded-xl mb-6">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all capitalize ${
                  mode === m
                    ? 'bg-[var(--color-bg-card)] shadow-sm text-[var(--color-text)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-sm text-green-700 dark:text-green-400">
                {message}
              </div>
            )}

            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                    <input
                      type="text"
                      name="full_name"
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="01XXXXXXXXX"
                      className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter password"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--color-surface)] rounded-md transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                  ) : (
                    <Eye className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                  )}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[var(--color-accent)] text-[var(--color-bg)] rounded-xl text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-[var(--color-bg)]/30 border-t-[var(--color-bg)] rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Guest checkout option */}
          <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 py-3 border border-[var(--color-border)] rounded-xl text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
            >
              Continue as Guest
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[11px] text-[var(--color-text-tertiary)] text-center mt-3">
              You can create an account later to track your orders
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
