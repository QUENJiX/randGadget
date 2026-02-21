import { notFound } from 'next/navigation'
import { ProductDetail } from '@/components/products/product-detail'
import { createClient } from '@/lib/supabase/server'
import { productImageUrl, formatPriceExact } from '@/lib/utils'
import type { Metadata } from 'next'
import type { Product } from '@/lib/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gadgetbd.com'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const { data } = await supabase
    .from('products')
    .select('*, brand:brands(*), category:categories(*), images:product_images(*), variants:product_variants(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  return data as Product | null
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  const title = product.meta_title || product.name
  const description = product.meta_description || product.short_desc || `Buy ${product.name} at GadgetBD`
  const imgSrc = productImageUrl(product)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/product/${product.slug}`,
      siteName: 'GadgetBD',
      type: 'website',
      ...(imgSrc
        ? { images: [{ url: imgSrc, width: 800, height: 800, alt: product.name }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(imgSrc ? { images: [imgSrc] } : {}),
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const imgSrc = productImageUrl(product)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_desc || product.description || '',
    ...(imgSrc ? { image: imgSrc } : {}),
    sku: product.sku,
    ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand.name } } : {}),
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: 'BDT',
      price: product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  )
}
