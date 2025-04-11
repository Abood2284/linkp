import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { InsertCreator, InsertWorkspace } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { users, workspaces, creators } from "@repo/db/schema";

interface OnboardingData {
  workspace: InsertWorkspace;
  creator: InsertCreator;
  onboardingCompleted: boolean;
}

const app = new Hono();

app.post("/complete", async (c) => {
  const body = await c.req.json<OnboardingData>();
  const db = c.req.db;

  let createdWorkspace = null;
  let createdCreator = null;

  try {
    // 1. Create creator profile first
    [createdCreator] = await db
      .insert(creators)
      .values({
        ...body.creator,
        defaultWorkspace: body.workspace.slug, // Use the slug from the workspace data
      })
      .returning();

    if (!createdCreator) {
      throw new HTTPException(500, {
        message: "Failed to create creator profile",
      });
    }

    // 2. Create workspace with the creator ID
    [createdWorkspace] = await db
      .insert(workspaces)
      .values({
        ...body.workspace,
        creatorId: createdCreator.id, // Set the creator ID
      })
      .returning();

    if (!createdCreator) {
      throw new HTTPException(500, {
        message: "Failed to create creator profile",
      });
    }

    // 3. Update user's onboarding status
    const [updatedUser] = await db
      .update(users)
      .set({
        onboardingCompleted: body.onboardingCompleted,
        userType: "creator" as const,
      })
      .where(eq(users.id, body.workspace.userId))
      .returning();

    if (!updatedUser) {
      throw new HTTPException(500, {
        message: "Failed to update user status",
      });
    }

    return c.json({
      status: 200,
      message: "Onboarding completed successfully",
      data: {
        workspace: createdWorkspace,
        creator: createdCreator,
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Onboarding error:", error);

    // Rollback created resources if any operation fails
    try {
      if (createdCreator) {
        await db.delete(creators).where(eq(creators.id, createdCreator.id));
      }
      if (createdWorkspace) {
        await db
          .delete(workspaces)
          .where(eq(workspaces.id, createdWorkspace.id));
      }
    } catch (rollbackError) {
      console.error("Rollback failed:", rollbackError);
    }

    // Handle specific errors
    if (error instanceof HTTPException) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        throw new HTTPException(409, {
          message: "A workspace with this slug already exists",
        });
      }
    }

    throw new HTTPException(500, {
      message: "Failed to complete onboarding",
    });
  }
});

export default app;
