import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Your saved products — add items to your wishlist and purchase them later.',
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children
}
