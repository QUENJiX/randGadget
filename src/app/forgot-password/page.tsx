'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { fadeUp } from '@/lib/animations'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) { setError('Please enter your email address.'); return }

    setLoading(true)
    const supabase = createClient()
    if (!supabase) {
      setError('Service unavailable. Please try again later.')
      setLoading(false)
      return
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/account`,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="pt-28 pb-20">
        <div className="container-wide max-w-md">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center p-8 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)]/50"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-[var(--color-success)]" />
            </div>
            <h1 className="text-xl font-bold mb-2">Check your email</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              We&apos;ve sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset
              your password.
            </p>
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-20">
      <div className="container-wide max-w-md">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="p-8 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)]/50"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--color-accent-subtle)] flex items-center justify-center">
              <Mail className="w-7 h-7 text-[var(--color-accent)]" />
            </div>
            <h1 className="text-xl font-bold">Forgot your password?</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--color-accent)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
