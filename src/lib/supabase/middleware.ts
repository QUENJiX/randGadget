import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require authentication
const protectedPaths = ['/checkout', '/account']
// Routes restricted to admin role
const adminPaths = ['/admin']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Skip Supabase session refresh when credentials are not configured
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || url === 'your-supabase-url' || key === 'your-supabase-anon-key') {
    return supabaseResponse
  }

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — important for Server Components
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect unauthenticated users away from protected routes
  const { pathname } = request.nextUrl
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/account'
    redirectUrl.searchParams.set('redirect', pathname)
    // Don't redirect /account to itself — just let it render the auth form
    if (pathname !== '/account') {
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Admin route guard — check role via app_metadata (embedded in JWT, no DB query needed)
  const isAdmin = adminPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )
  if (isAdmin) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/account'
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Primary check: app_metadata.role (set via Supabase Dashboard or SQL)
    const role = user.app_metadata?.role

    // Fallback: query profiles table if app_metadata doesn't have role yet
    if (role !== 'admin') {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error || !profile || profile.role !== 'admin') {
        console.warn('[admin-guard] Access denied for user', user.id, '– role:', profile?.role, 'error:', error?.message)
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/'
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  return supabaseResponse
}
