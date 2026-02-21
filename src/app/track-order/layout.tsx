import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track Order',
  description: 'Track the status of your GadgetBD order using your order number.',
}

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children
}
