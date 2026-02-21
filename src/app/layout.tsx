import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AuthProvider } from '@/components/auth'
import { StorefrontShell } from '@/components/layout/storefront-shell'
import './globals.css'

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
          <StorefrontShell>{children}</StorefrontShell>
        </AuthProvider>
      </body>
    </html>
  )
}
