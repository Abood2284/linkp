"use client";

import { motion } from "framer-motion";
import { TemplateCard } from "./templateCard";
import { BaseTemplateConfig } from "@/lib/templates/template-types";
import { useSearchParams, useRouter } from "next/navigation";
import { InsertWorkspace } from "@repo/db/schema";
import { APIResponse } from "@repo/db/types";

type TemplateGridProps = {
  templates: BaseTemplateConfig[];
  userId: string;
};

export function TemplateGrid({ templates, userId }: TemplateGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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

      const response = await fetch(`${API_BASE_URL}/api/workspace/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }

      const workspaceResponse: APIResponse = await response.json();
      /*
      worksacepResponse.data = {
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
        }
      */
      // Redirect to the new workspace
      router.push(`/dashboard/${workspaceResponse.data}`);
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
