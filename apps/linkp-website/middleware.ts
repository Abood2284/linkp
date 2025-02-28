import { businesses, creators, users } from "@repo/db/schema";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./app/auth";
import { db } from "./server/db";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Define all route patterns
  const publicRoutes = [
    "/authentication",
    "/business/dashboard",
    "/business/discover",
    "/business/campaigns",
    "/business/analytics",
    "/business/payments",
    "/business/messages",
    "/business/settings",
  ];
  const onboardingRoutes = {
    creator: ["/creator/workspace", "/creator/select-template"],
    business: [
      "/business/welcome",
      "/business/profile",
      "/business/preferences",
    ],
  };
  const protectedRoutes = {
    creator: ["/dashboard"],
    business: ["/business/dashboard", "/campaigns"],
  };

  // Handle unauthenticated users
  if (!session?.user?.id) {
    // Allow public routes without any checks for unauthenticated users
    if (publicRoutes.includes(pathname) || pathname === "/") {
      return NextResponse.next();
    }
    return handleUnauthenticatedAccess(request);
  }

  // Get user data
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .then((res) => res[0]);

  if (!user) {
    return handleUnauthenticatedAccess(request);
  }

  // Get extended profile
  const profile = await getExtendedProfile(user);

  // Redirect from landing page if user is authenticated
  if (pathname === "/") {
    if (!user.userType) {
      return NextResponse.redirect(new URL("/select-type", request.url));
    }
    // If user has completed onboarding, redirect to thexir dashboard
    if (user.onboardingCompleted) {
      if (user.userType === "creator" && profile) {
        return NextResponse.redirect(
          new URL(
            `/dashboard/${(profile as typeof creators.$inferSelect).defaultWorkspace}/links`,
            request.url
          )
        );
      }
      if (user.userType === "business") {
        return NextResponse.redirect(
          new URL("/business/dashboard", request.url)
        );
      }
    }
    // If user has type but hasn't completed onboarding, redirect to welcome page
    const welcomePath =
      user.userType === "creator" ? "/select-type" : "/business/welcome";
    return NextResponse.redirect(new URL(welcomePath, request.url));
  }

  // Function to check if path starts with any of the routes
  const pathStartsWith = (routes: string[]) =>
    routes.some((route) => pathname.startsWith(route));

  // Check if current path is in onboarding or protected routes
  const isInCreatorOnboarding = pathStartsWith(onboardingRoutes.creator);
  const isInBusinessOnboarding = pathStartsWith(onboardingRoutes.business);
  const isInCreatorProtected = pathStartsWith(protectedRoutes.creator);
  const isInBusinessProtected = pathStartsWith(protectedRoutes.business);

  // Handle wrong user type access
  if (
    user.userType === "creator" &&
    (isInBusinessOnboarding || isInBusinessProtected)
  ) {
    return NextResponse.redirect(new URL("/select-type", request.url));
  }
  if (
    user.userType === "business" &&
    (isInCreatorOnboarding || isInCreatorProtected)
  ) {
    return NextResponse.redirect(new URL("/business/welcome", request.url));
  }

  // Handle onboarding flow
  if (!user.onboardingCompleted) {
    // If trying to access protected routes, redirect to welcome
    if (isInCreatorProtected || isInBusinessProtected) {
      const welcomePath =
        user.userType === "creator"
          ? `/creator/workspace`
          : "/business/welcome";
      return NextResponse.redirect(new URL(welcomePath, request.url));
    }

    // Allow access to appropriate onboarding routes
    if (
      (user.userType === "creator" && isInCreatorOnboarding) ||
      (user.userType === "business" && isInBusinessOnboarding)
    ) {
      return NextResponse.next();
    }
  }

  // Handle completed onboarding users
  if (user.onboardingCompleted) {
    // Prevent accessing onboarding routes and redirect to dashboard
    if (
      isInCreatorOnboarding ||
      isInBusinessOnboarding ||
      pathname === "/select-type"
    ) {
      // Allow access to template selection if it's for a new workspace
      if (
        pathname === "/creator/select-template" &&
        request.nextUrl.searchParams.get("isNewWorkspace") === "true"
      ) {
        return NextResponse.next();
      }

      if (user.userType === "creator" && profile) {
        console.log("➡️ Redirecting to dashboard with workspace", profile);
        return NextResponse.redirect(
          new URL(
            `/dashboard/${(profile as typeof creators.$inferSelect).defaultWorkspace}/links`,
            request.url
          )
        );
      }
      if (user.userType === "business") {
        return NextResponse.redirect(
          new URL("/business/dashboard", request.url)
        );
      }
    }
  }

  // Allow access to appropriate protected routes
  if (
    (user.userType === "creator" && isInCreatorProtected) ||
    (user.userType === "business" && isInBusinessProtected)
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Helper function to get extended profile based on user type
async function getExtendedProfile(user: typeof users.$inferSelect) {
  if (user.userType === "creator") {
    return db
      .select()
      .from(creators)
      .where(eq(creators.userId, user.id))
      .then((res) => res[0]);
  }
  if (user.userType === "business") {
    return db
      .select()
      .from(businesses)
      .where(eq(businesses.userId, user.id))
      .then((res) => res[0]);
  }
  return null;
}

// Helper function to handle unauthenticated access
function handleUnauthenticatedAccess(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = !["/", "/authentication"].includes(pathname);

  if (isProtectedRoute) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/authentication?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
