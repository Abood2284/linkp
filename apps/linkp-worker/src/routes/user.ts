import { Env, Hono } from "hono";
import { users } from "@repo/db/schema";
import { HTTPException } from "hono/http-exception";
import { eq, sql } from "drizzle-orm";

const userRoutes = new Hono<{ Bindings: Env }>();

// Debug middleware
userRoutes.use("/*", async (c, next) => {
  console.log(`[DEBUG] User route accessed: ${c.req.url}`);
  await next();
});

userRoutes.get("/health", async (c) => {
  try {
    // Test the database connection with a simple query
    const workspacesCount = await c.req.db
      .select({ count: sql`count(*)` })
      .from(users)
      .execute();

    return c.json({
      status: "success",
      message: "Database connection healthy",
      count: workspacesCount[0].count,
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    throw new HTTPException(500, { message: "Database health check failed" });
  }
});

userRoutes.get("/me", async (c) => {
  try {
    const { email } = await c.req.json();
    console.log("email", email);

    if (!email) {
      throw new HTTPException(400, { message: "Email is required" });
    }

    const user = await c.req.db.query.users.findMany({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    return c.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    throw new HTTPException(500, { message: "Database health check failed" });
  }
});

// userRoutes.get('/getAll', async (c) => {
//   try {
//     const allUsers = await c.req.db.select().from(users).execute();
//     return c.json({
//       status: 'success',
//       data: allUsers
//     });
//   } catch (error) {
//     throw new HTTPException(500, { message: 'Failed to fetch Users' });
//   }
// });

export default userRoutes;
