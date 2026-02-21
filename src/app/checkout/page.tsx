import dynamic from 'next/dynamic'
import type { Metadata } from 'next'

const CheckoutFlow = dynamic(
  () => import('@/components/checkout/checkout-flow').then((m) => m.CheckoutFlow),
  { loading: () => <div className="skeleton h-96 mx-auto max-w-6xl mt-8 rounded-2xl" /> }
)

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
