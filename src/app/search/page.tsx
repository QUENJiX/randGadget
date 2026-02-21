import { SearchResults } from '@/components/search/search-results'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search for tech gadgets, smartphones, laptops, and accessories.',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  return <SearchResults query={params.q} />
}
