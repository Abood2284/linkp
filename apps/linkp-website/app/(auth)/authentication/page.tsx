// apps/linkp-website/app/(auth)/authentication/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { GoogleAuthButton } from './components/google-auth-button'

export const metadata: Metadata = {
  title: 'Authentication | Linkp',
  description: 'Sign in to your Linkp account to continue.',
}

/**
 * Renders the brand logo SVG.
 */
function BrandLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
    </svg>
  )
}

/**
 * The main authentication page, designed to be simple, on-brand, and responsive.
 */
export default function AuthenticationPage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-linkp-honeydew p-4 sm:p-6 md:p-8">
      {/* Subtle background dot pattern for visual texture */}
      <div className="absolute inset-0 h-full w-full bg-white bg-dot-thick/[0.2] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <BrandLogo className="h-10 w-10 text-[#382F2B]" />
          <h1 className="font-nohemi text-4xl font-black tracking-tight text-[#382F2B] sm:text-5xl">
            Welcome to Linkp
          </h1>
          <p className="max-w-xs font-absans text-lg text-[#A77AB4]">
            Sign in with your Google account to continue where you left off.
          </p>
        </div>

        {/* The dedicated client component for the Google Auth button */}
        <div className="w-full">
          <GoogleAuthButton />
        </div>

        <p className="max-w-sm px-8 text-center font-absans text-xs text-[#382F2B]/60">
          By clicking continue, you agree to our{' '}
          <Link
            href="/terms"
            className="font-medium underline underline-offset-4 hover:text-[#382F2B]"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="font-medium underline underline-offset-4 hover:text-[#382F2B]"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  )
}