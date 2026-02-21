'use client'

import { usePathname } from 'next/navigation'
import { Header } from './header'
import { Footer } from './footer'
import dynamic from 'next/dynamic'

const SearchModal = dynamic(
  () => import('@/components/search/search-modal').then((m) => m.SearchModal)
)

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-[var(--color-accent-text)] focus:rounded-lg focus:outline-none"
      >
        Skip to content
      </a>
      <Header />
      <SearchModal />
      <main id="main-content" className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
