import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OrderConfirmation } from './order-confirmation'
import type { Metadata } from 'next'

interface OrderPageProps {
  params: Promise<{ id: string }>
}

async function getOrder(id: string) {
  const supabase = await createClient()
  if (!supabase) return null

  const { data } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single()

  return data
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { id } = await params
  const order = await getOrder(id)
  return {
    title: order ? `Order ${order.order_number}` : 'Order Not Found',
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  return <OrderConfirmation order={order as any} />
}
