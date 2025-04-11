import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string;
      /** The user's type (creator or business). */
      userType?: "creator" | "business" | "";
    } & DefaultSession["user"];
    /** JWT token for authenticated API calls */
    token?: string;
    /** When the token expires */
    expires: string;
  }

  interface User {
    /** The user type (creator or business) */
    userType?: "creator" | "business" | "";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's type. */
    userType?: "creator" | "business";
    /** User ID reference */
    userId?: string;
  }
}
