import { db } from "@/server/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // session: {
  //   strategy: "jwt",
  // },
  callbacks: {
    // async jwt({ token, user, account }) {
    //   // Include user info in the token if available
    //   if (user) {
    //     token.userId = user.id;
    //     // Store any additional user info you need
    //   }

    //   // Include the raw access token from the provider
    //   if (account) {
    //     token.accessToken = account.access_token;
    //   }

    //   return token;
    // },
    session({ session, user }) {
      session.user.id = user.id;
      session.token = session.sessionToken;
      // session.user.userType = "";
      console.log("😘 [Auth.ts] Session: ", session);

      return session;
    },
  },
});
