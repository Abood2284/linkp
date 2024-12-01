import { Hono } from 'hono';
import { injectDB } from '..';
import { InsertWorkspace, users, workspaces } from '@repo/db/schema';
import { HTTPException } from 'hono/http-exception';

const workspaceRoutes = new Hono();

workspaceRoutes.post('/create', injectDB, async (c) => {
    try {
    const data: InsertWorkspace = await c.req.json();
    
    if (!data) {
      throw new HTTPException(400, { message: 'No Data Recieved' });
    }
        
    const response = await c.req.db.insert(workspaces).values(data).returning();


    return c.json({
      status: 'success',
      data: response
    });
        
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: 'Failed to Insert Workspace data' });
  }
});

export default workspaceRoutes;