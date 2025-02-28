import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import {
  promotionalLinkProposals,
  users,
  businesses,
  creators,
  workspaces,
} from "@repo/db/schema";
import { eq, and } from "drizzle-orm";

// POST /api/proposals - Create a new proposal
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from session
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only businesses can create proposals
    if (user.userType !== "business") {
      return NextResponse.json(
        { error: "Only businesses can create proposals" },
        { status: 403 }
      );
    }

    // Get business profile
    const business = await db.query.businesses.findFirst({
      where: eq(businesses.userId, user.id),
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business profile not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { title, url, startDate, endDate, price, creatorId, workspaceId } =
      body;

    // Validate required fields
    if (
      !title ||
      !url ||
      !startDate ||
      !endDate ||
      !price ||
      !creatorId ||
      !workspaceId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate creator exists
    const creator = await db.query.creators.findFirst({
      where: eq(creators.id, creatorId),
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    // Validate workspace exists and belongs to creator
    const workspace = await db.query.workspaces.findFirst({
      where: and(
        eq(workspaces.id, workspaceId),
        eq(workspaces.userId, creator.userId)
      ),
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found or does not belong to creator" },
        { status: 404 }
      );
    }

    // Create the proposal
    const [newProposal] = await db
      .insert(promotionalLinkProposals)
      .values({
        businessId: business.id,
        creatorId: creatorId,
        workspaceId: workspaceId,
        title: title,
        url: url,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        price: price, // Assuming price is in cents
        status: "pending",
      })
      .returning();

    return NextResponse.json(
      { message: "Proposal created successfully", proposal: newProposal },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating proposal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
