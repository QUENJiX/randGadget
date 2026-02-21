import '@testing-library/jest-dom/vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    const { fill, blurDataURL, placeholder, ...rest } = props
    return <img {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)} />
  },
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>
  ),
}))

// Mock framer-motion to render children directly
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    motion: new Proxy(
      {},
      {
        get: (_target, prop: string) => {
          // Return a forwardRef component that renders the HTML element
          const Component = React.forwardRef<HTMLElement, Record<string, unknown>>(
            (
              {
                initial,
                animate,
                exit,
                variants,
                whileHover,
                whileInView,
                whileTap,
                viewport,
                transition,
                layout,
                layoutId,
                ...rest
              },
              ref
            ) => {
              return React.createElement(prop, { ...rest, ref })
            }
          )
          Component.displayName = `motion.${prop}`
          return Component
        },
      }
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useScroll: () => ({ scrollY: { on: vi.fn(() => vi.fn()) } }),
    useTransform: () => 0,
  }
})

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => null,
}))

import React from 'react'
