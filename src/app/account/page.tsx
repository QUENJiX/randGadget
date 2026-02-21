import { AuthForm } from '@/components/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your GadgetBD account or create a new one.',
}

export default function AccountPage() {
  return <AuthForm />
}
