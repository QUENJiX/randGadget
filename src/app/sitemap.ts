import { createClient } from '@/lib/supabase/server'
import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gadgetbd.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Products
  let productUrls: MetadataRoute.Sitemap = []
  if (supabase) {
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('is_active', true)
    productUrls =
      products?.map((p: { slug: string; updated_at: string }) => ({
        url: `${SITE_URL}/product/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })) ?? []
  }

  // Categories
  let categoryUrls: MetadataRoute.Sitemap = []
  if (supabase) {
    const { data: categories } = await supabase
      .from('categories')
      .select('slug')
    categoryUrls =
      categories?.map((c: { slug: string }) => ({
        url: `${SITE_URL}/category/${c.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })) ?? []
  }

  return [
    // Core pages
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/search`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/deals`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/featured`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/faq`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/shipping`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/returns`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/support`, changeFrequency: 'monthly', priority: 0.4 },
    // Dynamic
    ...categoryUrls,
    ...productUrls,
  ]
}
