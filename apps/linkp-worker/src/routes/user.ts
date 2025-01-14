import { users } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { Env, Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { withSession } from "../auth/session";

const userRoutes = new Hono<{ Bindings: Env }>();

// Debug middleware
userRoutes.use("/*", async (c, next) => {
  console.log(`[DEBUG] User route accessed: ${c.req.url}`);
  await next();
});

userRoutes.get("/health", async (c) => {
  try {
    // Test the database connection with a simple query
    const workspacesCount = await c.req.db.$count(users);

    return c.json({
      status: 200,
      message: "Database connection healthy",
      count: workspacesCount,
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    throw new HTTPException(500, { message: "Database health check failed" });
  }
});

userRoutes.get("/me", async (c) => {
  try {
    const start = performance.now();
    const { email } = await c.req.json();

    if (!email) {
      throw new HTTPException(400, { message: "Email is required" });
    }

    const user = await c.req.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    const end = performance.now();
    const timing = end - start;

    console.log(`User fetched in ${timing}ms`);

    return c.json({
      status: 200,
      data: user,
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    throw new HTTPException(500, { message: "Database health check failed" });
  }
});

/* Explanation for the current code with chaining middleware:
Let me break this down comprehensively to help you understand what's happening 
under the hood.
First, let's understand the core concepts involved:

1. Context in Web Frameworks
In Hono (and similar web frameworks), the context object 'c' is crucial - it 
represents the entire lifecycle of a request. Think of it as a container that 
carries important information from when a request arrives until a response is 
sent. This context:
- Holds the request and response objects
- Maintains middleware state
- Provides utility methods (like c.json())
- Ensures proper request handling completion

2. Middleware Chain
Middleware in Hono works like a pipeline. Each piece of middleware is a function 
that:
```typescript
// Simplified middleware structure
type Middleware = (c: Context) => Promise<Response> | Response;
```

When you use middleware, you're creating a chain of functions that each:
- Receive the context
- Do something with it
- Pass it to the next middleware or return a response

3. The Original Issue
Let's look at why your original code didn't work:

```typescript
workspaceRoutes.post("/create", async (c) => {  // Outer handler
  withSession(async (c, session) => {           // Middleware
    try {
      // ... handler code
    } catch (error) {
      // ... error handling
  });  // <-- No return here!
});    // <-- No return here either!
```
The problems here are:
a) Lost Context Chain:
```typescript
// What's happening under the hood
async (c) => {
  withSession(handler)(c);  // This creates a new Promise
  // But we never await or return it!
  // Context chain is broken here
}
```

b) Unfinished Request:
Hono expects every route handler to eventually produce a Response object. When the 
chain is broken, the request is left "unfinished" - hence the "Context is not 
finalized" error.

4. The Solution Explained
Here's how the fixed version works:

```typescript
workspaceRoutes.post("/create", async (c) => 
  withSession(async (c, session) => {
    // ... handler code
  })(c)  // Immediately invoke with context
);
```

Under the hood, this creates a proper chain:
```typescript
// What's happening step by step
1. withSession creates a middleware function:
   (c: Context) => Promise<Response>

2. This middleware is immediately invoked with (c):
   middleware(c) -> Promise<Response>

3. The outer async handler returns this Promise:
   async (c) => Promise<Response>
```

5. Alternative Pattern Explained
The more readable version:
```typescript
workspaceRoutes.post("/create", async (c) => {
  const handler = withSession(async (c, session) => {
    // ... handler code
  });
  return handler(c);  // Explicitly return the handled context
});
```

This pattern makes it clearer that we're:
1. Creating a middleware-wrapped handler
2. Executing it with the context
3. Returning the result

6. Best Practices to Remember:
- Always ensure middleware is properly chained
- Return responses explicitly
- Use context methods (c.json(), c.text()) to create responses
- Keep track of async operations
- Handle errors appropriately

The key to avoiding these issues in the future is to:
1. Understand that every route handler must return a Response
2. Remember that middleware creates a chain that must be maintained
3. Always explicitly return the result of middleware execution
4. Use TypeScript to help catch these issues early (the types would show if you're 
not returning a Response)

*/
// PATCH /api/user/patch – generic endpoint to update any user field
userRoutes.patch("/patch", async (c) => {
  const handler = withSession(async (c, session) => {
    const data = await c.req.json();

    if (!data || Object.keys(data).length === 0) {
      throw new HTTPException(400, { message: "No update data provided" });
    }

    // Validate that all provided fields exist in the users table
    const allowedFields = [
      "name",
      "email",
      "emailVerified",
      "image",
      "userType",
      "subscriptionTier",
      "subscriptionStatus",
      "onboardingCompleted",
      "defaultWorkspace",
    ];

    const invalidFields = Object.keys(data).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      throw new HTTPException(400, {
        message: `Invalid fields provided: ${invalidFields.join(", ")}`,
      });
    }

    try {
      const updatedUser = await c.req.db
        .update(users)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id))
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
          userType: users.userType,
          subscriptionTier: users.subscriptionTier,
          subscriptionStatus: users.subscriptionStatus,
          onboardingCompleted: users.onboardingCompleted,
          defaultWorkspace: users.defaultWorkspace,
          updatedAt: users.updatedAt,
        });

      if (!updatedUser || updatedUser.length === 0) {
        throw new HTTPException(403, {
          message: "Failed to update user",
        });
      }

      return c.json({
        status: 200,
        data: updatedUser[0],
      });
    } catch (error) {
      if (error instanceof HTTPException) throw error;
      console.error("Update user error:", error);
      throw new HTTPException(500, { message: "Failed to update user" });
    }
  });
  return handler(c);
});

export default userRoutes;
