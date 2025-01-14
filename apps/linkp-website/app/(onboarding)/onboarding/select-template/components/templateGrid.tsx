"use client";

import { motion } from "framer-motion";
import { TemplateCard } from "./templateCard";
import { BaseTemplateConfig } from "@/lib/templates/template-types";
import { useSearchParams, useRouter } from "next/navigation";
import { InsertWorkspace } from "@repo/db/schema";
import { APIResponse } from "@repo/db/types";
import { useSession } from "next-auth/react";
import { fetchWithSession } from "@/lib/utils";

type TemplateGridProps = {
  templates: BaseTemplateConfig[];
  userId: string;
};

export function TemplateGrid({ templates, userId }: TemplateGridProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const userType = searchParams.get("userType");
  const workspace = searchParams.get("workspace");
  const workspaceSlug = searchParams.get("workspaceSlug");

  const handleTemplateSelect = async (templateId: string) => {
    try {
      const data: InsertWorkspace = {
        name: workspace!,
        slug: workspaceSlug!,
        userId: userId,
        templateId: templateId,
      };
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      // This API route requires authentication token to be sent. We can use fetchWithSession to send the token automatically with the request.
      const response = await fetchWithSession(
        `${API_BASE_URL}/api/workspace/create`,
        {
          method: "POST",
          body: JSON.stringify({ data }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }

      // lets call the User Patch API to patch these values const user = await c.req.db
      //   .update(users)
      //   .set({ onboardingCompleted: true, defaultWorkspace: result[0].slug })
      //   .where(eq(users.id, data.userId))
      //   .returning();

      //   await c.req.db
      //     .update(users)
      //     .set({ defaultWorkspace: result[0].id })
      //     .where(eq(users.id, data.userId))
      //     .execute();
      // }

      await fetchWithSession(`${API_BASE_URL}/api/user/patch`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          onboardingCompleted: true,
          defaultWorkspace: data.slug,
        }),
      });

      const workspaceResponse: APIResponse = await response.json();
      /*
      worksacepResponse.data = [{
          id: '************************************',
          name: 'aboodie',
          slug: 'aboodie',
          userId: '************************************',
          avatarUrl: null,
          templateId: 'premium-glass',
          templateConfig: null,
          isActive: true,
          createdAt: 2024-12-23T12:04:09.141Z,
          updatedAt: 2024-12-23T12:04:09.141Z
    }]
      */
      // Redirect to the new workspace
      router.push(`/dashboard/${workspaceResponse.data[0].slug}`);
    } catch (error) {
      console.error("Error selecting template:", error);
    }
  };

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {templates.map((template, index) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <TemplateCard template={template} onSelect={handleTemplateSelect} />
        </motion.div>
      ))}
    </motion.div>
  );
}
