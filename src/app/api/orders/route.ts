import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    // Get authenticated user (optional — guest checkout allowed)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const body = await request.json()
    const {
      items,
      address,
      payment_method,
      delivery_charge,
      delivery_zone_id,
      notes,
      guest_email,
      guest_phone,
    } = body

    // --- Validation ---
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!address?.full_name || !address?.phone || !address?.street_address) {
      return NextResponse.json(
        { error: 'Shipping address is incomplete' },
        { status: 400 }
      )
    }

    if (!payment_method) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      )
    }

    // --- Verify stock & compute server-side prices ---
    const productIds = items.map((i: any) => i.product_id)
    const variantIds = items
      .filter((i: any) => i.variant_id)
      .map((i: any) => i.variant_id)

    const { data: products } = await supabase
      .from('products')
      .select('id, name, price, stock, is_active')
      .in('id', productIds)

    if (!products) {
      return NextResponse.json(
        { error: 'Failed to verify products' },
        { status: 500 }
      )
    }

    let variants: any[] = []
    if (variantIds.length > 0) {
      const { data: v } = await supabase
        .from('product_variants')
        .select('id, product_id, name, price, stock')
        .in('id', variantIds)
      variants = v || []
    }

    // Build order items with server-verified prices
    let subtotal = 0
    const orderItems: {
      product_id: string
      variant_id: string | null
      name: string
      price: number
      quantity: number
    }[] = []

    for (const item of items) {
      const product = products.find((p: any) => p.id === item.product_id)
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.product_id}` },
          { status: 400 }
        )
      }

      if (!product.is_active) {
        return NextResponse.json(
          { error: `Product is no longer available: ${product.name}` },
          { status: 400 }
        )
      }

      let price = product.price
      let itemName = product.name
      let stockAvailable = product.stock

      if (item.variant_id) {
        const variant = variants.find((v: any) => v.id === item.variant_id)
        if (!variant) {
          return NextResponse.json(
            { error: `Product variant not found` },
            { status: 400 }
          )
        }
        price = variant.price
        itemName = `${product.name} — ${variant.name}`
        stockAvailable = variant.stock
      }

      if (item.quantity > stockAvailable) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${itemName}. Available: ${stockAvailable}`,
          },
          { status: 400 }
        )
      }

      subtotal += price * item.quantity
      orderItems.push({
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        name: itemName,
        price,
        quantity: item.quantity,
      })
    }

    const deliveryChargeNum = Number(delivery_charge) || 0
    // Apply COD fee server-side (never trust client)
    const COD_FEE = 20
    const codFeeNum = payment_method === 'cod' ? COD_FEE : 0
    const total = subtotal + deliveryChargeNum + codFeeNum

    // --- Resolve geography names for order snapshot ---
    let divisionName = ''
    let districtName = ''
    let upazilaName = ''

    if (address.division_id) {
      const { data: div } = await supabase
        .from('divisions')
        .select('name')
        .eq('id', address.division_id)
        .single()
      divisionName = div?.name || ''
    }
    if (address.district_id) {
      const { data: dist } = await supabase
        .from('districts')
        .select('name')
        .eq('id', address.district_id)
        .single()
      districtName = dist?.name || ''
    }
    if (address.upazila_id) {
      const { data: upa } = await supabase
        .from('upazilas')
        .select('name')
        .eq('id', address.upazila_id)
        .single()
      upazilaName = upa?.name || ''
    }

    // --- Create the order ---
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        guest_email: user ? null : guest_email || null,
        guest_phone: user ? null : guest_phone || address.phone,
        shipping_name: address.full_name,
        shipping_phone: address.phone,
        shipping_division: divisionName,
        shipping_district: districtName,
        shipping_upazila: upazilaName,
        shipping_street: address.street_address,
        shipping_postal_code: address.postal_code || null,
        delivery_zone_id: delivery_zone_id || null,
        subtotal,
        delivery_charge: deliveryChargeNum,
        discount: 0,
        total,
        payment_method,
        payment_status: payment_method === 'cod' ? 'pending' : 'unpaid',
        status: 'pending',
        notes: payment_method === 'cod'
          ? [notes, `COD fee: ৳${codFeeNum}`].filter(Boolean).join(' | ')
          : notes || null,
      })
      .select('id, order_number')
      .single()

    if (orderError || !order) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order. Please try again.' },
        { status: 500 }
      )
    }

    // --- Create order items ---
    const { error: itemsError } = await supabase.from('order_items').insert(
      orderItems.map((oi) => ({
        order_id: order.id,
        ...oi,
      }))
    )

    if (itemsError) {
      console.error('Order items error:', itemsError)
      // Order was created, items failed — still return order so user can contact support
    }

    // --- Decrement stock ---
    for (const item of items) {
      if (item.variant_id) {
        await supabase.rpc('decrement_variant_stock' as any, {
          p_variant_id: item.variant_id,
          p_qty: item.quantity,
        }).then(() => {
          // Also decrement product-level stock
          return supabase.rpc('decrement_product_stock' as any, {
            p_product_id: item.product_id,
            p_qty: item.quantity,
          })
        })
      } else {
        await supabase.rpc('decrement_product_stock' as any, {
          p_product_id: item.product_id,
          p_qty: item.quantity,
        })
      }
    }

    // --- Clear server cart if logged in ---
    if (user) {
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (cart) {
        await supabase.from('cart_items').delete().eq('cart_id', cart.id)
      }
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: order.order_number,
    })
  } catch (err: any) {
    console.error('Order API error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
