import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your GadgetBD account, view order history, and update your profile.',
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children
}
