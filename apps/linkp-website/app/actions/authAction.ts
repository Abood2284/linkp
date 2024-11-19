import { auth } from "@/app/auth"
import { db } from "@/server/db"
import { users } from "@repo/db/schema"
import { eq } from "drizzle-orm"

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.email) return null

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  })

  return user
}

export async function hasCompletedOnboarding() {
  const user = await getCurrentUser()
  return user?.onboardingCompleted ?? false
} 