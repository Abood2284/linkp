import { businesses, creators, users } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./app/auth";
import { db } from "./server/db";

export async function middleware(request: NextRequest) {
  try {
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
      "/privacy-policy",
      "/public/templates",
    ];

    // Define dynamic route patterns that should be public
    const publicRoutePatterns = [
      /^\/public\/templates\/[^\/]+\/preview$/, // Matches /public/templates/{templateID}/preview
      /^\/public\/templates\/[^\/]+$/, // Matches /public/templates/{templateID}

      // Template-related patterns (add more as needed):
      // /^\/public\/templates\/[^\/]+\/edit$/, // For template editing if needed
      // /^\/public\/templates\/[^\/]+\/share$/, // For template sharing if needed

      // Workspace patterns (uncomment when needed):
      // /^\/[a-zA-Z0-9_-]+$/, // Matches /{workspace} - for public workspace pages
    ];
    const onboardingRoutes = {
      creator: ["/creator/workspace", "/creator/select-template"],
      business: [
        "/business/welcome",
        "/business/profile",
        "/business/preferences",
        "/business/onboarding/company-profile",
        "/business/onboarding/goals",
        "/business/onboarding/creator-preferences",
        "/business/onboarding/subscription",
      ],
    };
    const protectedRoutes = {
      creator: ["/dashboard"],
      business: ["/business/dashboard", "/campaigns"],
    };

    // Helper function to check if path is public
    const isPublicPath = (path: string) => {
      // Check exact matches
      if (publicRoutes.includes(path) || path === "/") {
        return true;
      }
      // Check dynamic patterns
      return publicRoutePatterns.some((pattern) => pattern.test(path));
    };

    // Handle unauthenticated users
    if (!session?.user?.id) {
      // Allow public routes without any checks for unauthenticated users
      if (isPublicPath(pathname)) {
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
        console.log(
          `✈️ [middleware] Navigating to /select-type reason: User type not set`
        );
        return NextResponse.redirect(new URL("/select-type", request.url));
      }
      // If user has completed onboarding, redirect to their dashboard
      if (user.onboardingCompleted) {
        if (user.userType === "creator" && profile) {
          console.log(
            `✈️ [middleware] Navigating to /dashboard/${(profile as typeof creators.$inferSelect).defaultWorkspace}/links reason: Creator with completed onboarding`
          );
          return NextResponse.redirect(
            new URL(
              `/dashboard/${(profile as typeof creators.$inferSelect).defaultWorkspace}/links`,
              request.url
            )
          );
        }
        if (user.userType === "business") {
          console.log(
            `✈️ [middleware] Navigating to /business/dashboard reason: Business with completed onboarding`
          );
          return NextResponse.redirect(
            new URL("/business/dashboard", request.url)
          );
        }
      }
      // If user has type but hasn't completed onboarding, redirect to welcome page
      const welcomePath =
        user.userType === "creator" ? "/select-type" : "/business/welcome";
      console.log(
        `✈️ [middleware] Navigating to ${welcomePath} reason: User has type but incomplete onboarding`
      );
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

    // Note: This section has a known issue with the userType default value
    // Keeping original comment for documentation purposes
    /*
    ! !!! Commented cause of bug !!!
    ! user.userType default value is always set to "creator" in the database
    ! so the following code will always redirect to /select-type
    ! Even if the user is trying to select a business type
    ? FIX: Update your schema, where userType default is set to "" EMPTY STRING
    ? To do that you will also have to update the ENUM of UserTYPE in Schema.ts
    */

    // Handle wrong user type access
    // if (
    //   user.userType === "creator" &&
    //   (isInBusinessOnboarding || isInBusinessProtected)
    // ) {
    //   console.log(
    //     `✈️ [middleware] Navigating to /select-type reason: Creator attempting to access business routes`
    //   );
    //   return NextResponse.redirect(new URL("/select-type", request.url));
    // }

    if (
      user.userType === "business" &&
      (isInCreatorOnboarding || isInCreatorProtected)
    ) {
      console.log(
        `✈️ [middleware] Navigating to /business/welcome reason: Business attempting to access creator routes`
      );
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
        console.log(
          `✈️ [middleware] Navigating to ${welcomePath} reason: Incomplete onboarding attempting to access protected routes`
        );
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
          console.log(
            `✈️ [middleware] Navigating to /dashboard/${(profile as typeof creators.$inferSelect).defaultWorkspace}/links reason: Completed onboarding accessing onboarding routes`
          );
          return NextResponse.redirect(
            new URL(
              `/dashboard/${(profile as typeof creators.$inferSelect).defaultWorkspace}/links`,
              request.url
            )
          );
        }
        if (user.userType === "business") {
          console.log(
            `✈️ [middleware] Navigating to /business/dashboard reason: Completed onboarding accessing onboarding routes`
          );
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
  } catch (error) {
    // Added error handling for Node.js compatibility
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
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
    console.log(
      `✈️ [middleware] Navigating to /authentication reason: Unauthenticated access to protected route`
    );
    return NextResponse.redirect(
      new URL(`/authentication?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
