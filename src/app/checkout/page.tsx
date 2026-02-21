import { CheckoutFlow } from '@/components/checkout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order — fast delivery across Bangladesh with COD, bKash, Nagad, and more.',
}

export default function CheckoutPage() {
  return (
    <div className="pt-24 md:pt-28">
      <CheckoutFlow />
    </div>
  )
}
