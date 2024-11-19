// components/auth-check.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface AuthCheckProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean // if true, redirects to login if not authenticated
  redirectTo?: string // custom redirect path
}

export function AuthCheck({
  children,
  fallback,
  requireAuth = false,
  redirectTo,
}: AuthCheckProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (requireAuth && !session) {
      router.push(redirectTo || "/authentication")
    } else if (session && redirectTo) {
      router.push(redirectTo)
    }
  }, [session, status, requireAuth, redirectTo, router])

  if (status === "loading") {
    return <div>Loading...</div> // You can replace this with a proper loading component
  }

  if (requireAuth && !session) {
    return fallback || null
  }

  return <>{children}</>
}