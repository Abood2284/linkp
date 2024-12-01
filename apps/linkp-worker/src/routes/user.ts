import { Hono } from 'hono';
import { injectDB } from '..';
import { users } from '@repo/db/schema';
import { HTTPException } from 'hono/http-exception';
import { eq } from 'drizzle-orm';

const userRoutes = new Hono();

userRoutes.get('/me', injectDB, async (c) => {
    try {
 const { email } = await c.req.json();
    
    if (!email) {
      throw new HTTPException(400, { message: 'Email is required' });
    }
 const user = await c.req.db.query.users.findFirst({
      where: eq(users.email, email)
    });


    if (!user) {
      throw new HTTPException(404, { message: 'User not found' });
    }

    return c.json({
      status: 'success',
      data: user
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: 'Failed to fetch user data' });
  }
});

// userRoutes.get('/getAll', injectDB, async (c) => {
//   try {
//     const allUsers = await c.req.db.select().from(users);
//     return c.json({
//       status: 'success',
//       data: allUsers
//     });
//   } catch (error) {
//     throw new HTTPException(500, { message: 'Failed to fetch Users' });
//   }
// });

export default userRoutes;