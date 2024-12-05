import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { eq } from 'drizzle-orm';
import { users } from '@repo/db/schema';
import { auth } from './app/auth';
import { db } from './server/db';
import { initializeTemplates } from './lib/templates/init';

// let templatesInitialized = false;

export async function middleware(request: NextRequest) {
//      if (!templatesInitialized) {
//     await initializeTemplates();
//     templatesInitialized = true;
//   }
  const session = await auth();
  const user = session?.user?.id ? await db.select().from(users).where(eq(users.id, session.user.id)) : null
  const { pathname } = request.nextUrl

  // Define route patterns more precisely
  const protectedRoutes = [
    '/dashboard',
    '/onboarding/welcome',
    '/onboarding/link',
    '/onboarding/select-template',
    '/onboarding/workspace',
    // Add other specific onboarding routes here
  ]

  const authRoutes = ['/', '/authentication']

  // Check if the current path matches any protected route exactly or starts with /dashboard
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith('/dashboard/')
  )

  // Handle dashboard access
  if (pathname.startsWith('/dashboard')) {
    if (!user?.[0]?.onboardingCompleted) {
      console.log(`User has not completed onboarding: ${user?.[0]?.onboardingCompleted}`);
      // Redirect specifically to the welcome page
      return NextResponse.redirect(
        new URL('/onboarding/welcome', request.url)
      )
    }
  }

  // Handle onboarding access - check for specific onboarding routes
  if (pathname.startsWith('/onboarding/')) {
    if (user?.[0]?.onboardingCompleted) {
      console.log(`User has completed onboarding: ${user?.[0]?.onboardingCompleted}`);
      return NextResponse.redirect(
        new URL('/dashboard', request.url)
      )
    }
  }

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route =>
    pathname === route
  )

  // If trying to access protected routes without auth
  if (isProtectedRoute && !session) {
    // Encode the full path they were trying to access
    const callbackUrl = encodeURIComponent(pathname)
    return NextResponse.redirect(
      new URL(`/authentication?callbackUrl=${callbackUrl}`, request.url)
    )
  }

  // If authenticated user tries to access auth routes
  if (session && isAuthRoute) {
    // If onboarding is not completed, redirect to onboarding/welcome
    if (!user?.[0]?.onboardingCompleted) {
      return NextResponse.redirect(
        new URL('/onboarding/welcome', request.url)
      )
    }
    // If onboarding is completed, redirect to dashboard
    return NextResponse.redirect(
      new URL('/dashboard', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}