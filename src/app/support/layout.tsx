import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact & Support',
  description: 'Get help from the GadgetBD support team — reach us by phone, email, or the contact form.',
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children
}
