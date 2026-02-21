import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || url === 'your-supabase-url' || key === 'your-supabase-anon-key') {
    // Return a no-op stub so the app can run in demo mode without Supabase
    return null as unknown as ReturnType<typeof createBrowserClient>
  }
  return createBrowserClient(url, key)
}
