'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'

type AuthMode = 'login' | 'register'

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Integrate with Supabase Auth
    // const supabase = createClient()
    // if (mode === 'login') {
    //   const { error } = await supabase.auth.signInWithPassword({ email, password })
    // } else {
    //   const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name, phone } } })
    // }

    setTimeout(() => setLoading(false), 1500)
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
