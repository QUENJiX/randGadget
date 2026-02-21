import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Today\'s Deals',
  description: 'Save big on smartphones, laptops, and gadgets with the best deals at GadgetBD.',
}

export default function DealsLayout({ children }: { children: React.ReactNode }) {
  return children
}
