import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { sessions, users } from "@repo/db/schema";
import { and, eq, gte } from "drizzle-orm";

export interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
  };
}

export class SessionApiError extends Error {
  code: string;

  constructor({ code, message }: { code: string; message: string }) {
    super(message);
    this.code = code;
  }
}

async function getSession(c: Context): Promise<Session | null> {
  // Get the session token from the cookie
  const sessionToken = c.req.header("Authorization")?.replace("Bearer ", "");
  // ||
  // c.req.cookie("next-auth.session-token");

  if (!sessionToken) {
    return null;
  }

  try {
    // Query the session and user data
    const now = new Date();

    // First get the valid session
    const sessionData = await c.req.db
      .select()
      .from(sessions)
      .where(
        and(eq(sessions.sessionToken, sessionToken), gte(sessions.expires, now))
      )
      .limit(1);

    if (!sessionData || sessionData.length === 0) {
      return null;
    }

    // Then get the associated user
    const userData = await c.req.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, sessionData[0].userId))
      .limit(1);

    if (!userData || userData.length === 0) {
      return null;
    }

    const user = userData[0];

    return {
      user: {
        id: user.id,
        email: user.email || "",
        name: user.name || "",
        image: user.image || "",
      },
    };
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

interface WithSessionHandler {
  (c: Context, session: Session): Promise<Response>;
}

export const withSession = (handler: WithSessionHandler) => {
  return async (c: Context) => {
    try {
      const session = await getSession(c);
      console.log("withSession: ", session);
      if (!session?.user?.id) {
        throw new SessionApiError({
          code: "unauthorized",
          message: "Unauthorized: Login required.",
        });
      }

      // Add the session to the context for use in the handler
      c.set("session", session);

      return await handler(c, session);
    } catch (error) {
      console.error("Session middleware error:", error);

      if (error instanceof SessionApiError) {
        throw new HTTPException(401, { message: error.message });
      }

      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, { message: "Internal server error" });
    }
  };
};
