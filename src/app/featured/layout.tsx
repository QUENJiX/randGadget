import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Featured Products',
  description: 'Hand-picked featured gadgets and tech products curated by the GadgetBD team.',
}

export default function FeaturedLayout({ children }: { children: React.ReactNode }) {
  return children
}
