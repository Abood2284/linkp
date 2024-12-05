import { Hono } from 'hono';
import { injectDB } from '..';
import { InsertWorkspace, users, workspaces } from '@repo/db/schema';
import { HTTPException } from 'hono/http-exception';

const workspaceRoutes = new Hono();

workspaceRoutes.post('/create', injectDB, async (c) => {

  return c.json({ status: 'success', message: 'You called the correct API 😘' });
  //   try {
  //   const data: InsertWorkspace = await c.req.json();
    
  //   if (!data) {
  //     throw new HTTPException(400, { message: 'No Data Recieved' });
  //   }
        
  //   const response = await c.req.db.insert(workspaces).values(data).returning();


  //   return c.json({
  //     status: 'success',
  //     data: response
  //   });
        
  // } catch (error) {
  //   if (error instanceof HTTPException) throw error;
  //   throw new HTTPException(500, { message: 'Failed to Insert Workspace data' });
  // }

 
});

 // // app/api/workspaces/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { auth } from '@/app/auth';
// import { db } from '@/server/db';
// import { workspaces, workspaceProfiles } from '@repo/db/schema';
// import { templateRegistry } from '@/lib/templates/registry';
// import { nanoid } from 'nanoid';

// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await request.json();
//     const { templateId, name } = body;

//     // Validate template exists and user can access it
//     const templateConfig = templateRegistry.getTemplateConfig(templateId);
//     if (!templateConfig) {
//       return NextResponse.json({ error: 'Template not found' }, { status: 404 });
//     }

//     // Generate a unique slug from the workspace name
//     const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
//     const slug = `${baseSlug}-${nanoid(6)}`;

//     // Create workspace
//     const [workspace] = await db.insert(workspaces).values({
//       name,
//       slug,
//       userId: session.user.id,
//       templateId,
//       templateConfig: templateConfig.config, // Use default template config initially
//     }).returning();

//     // Create initial workspace profile with placeholder data
//     await db.insert(workspaceProfiles).values({
//       workspaceId: workspace.id,
//       name: name,
//       bio: "My Bio", // Placeholder bio
//       imageUrl: "/images/placeholder-avatar.png" // Placeholder image
//     });

//     return NextResponse.json(workspace);
//   } catch (error) {
//     console.error('Error creating workspace:', error);
//     return NextResponse.json(
//       { error: 'Failed to create workspace' },
//       { status: 500 }
//     );
//   }
// }

export default workspaceRoutes;