import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Geist, Geist_Mono } from 'next/font/google'
import { Header, Footer } from '@/components/layout'
import { AuthProvider } from '@/components/auth'
import './globals.css'

const SearchModal = dynamic(
  () => import('@/components/search/search-modal').then((m) => m.SearchModal)
)

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'GadgetBD — Premium Tech & Gadgets in Bangladesh',
    template: '%s | GadgetBD',
  },
  description:
    'Bangladesh\'s premium destination for authentic smartphones, laptops, audio gear, wearables, and tech accessories. Genuine warranty, fast delivery across all 64 districts.',
  keywords: [
    'gadgets bangladesh',
    'tech store dhaka',
    'smartphones bd',
    'laptops bangladesh',
    'buy gadgets online bangladesh',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'GadgetBD',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-white focus:rounded-lg focus:outline-none"
          >
            Skip to content
          </a>
          <Header />
          <SearchModal />
          <main id="main-content" className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
