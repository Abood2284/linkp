"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BaseTemplateConfig } from "@/lib/templates/template-types";
import { useRouter } from "next/navigation";

export default function TemplateInfo({
  template,
}: {
  template: BaseTemplateConfig;
}) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const router = useRouter();

  const handleUseTemplate = () => {
    // Here you would typically gather necessary information like workspace ID
    // before redirecting the user. For now, we'll just simulate the process.
    const workspaceId = "user's_workspace_id"; // Replace with actual workspace ID
    router.push(`/dashboard/${workspaceId}?templateId=${template.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {template.name}
        </h2>
        <p
          className={`text-gray-600 mb-4 ${
            showFullDescription ? "" : "line-clamp-3"
          }`}
        >
          {template.description}
        </p>
        {template.description.length > 150 && (
          <Button
            variant="link"
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-blue-500 hover:text-blue-700"
          >
            {showFullDescription ? "Show less" : "Read more"}
          </Button>
        )}
      </div>

      <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Template Details
        </h3>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Category:</span> {template.category}
          </p>
          <p>
            <span className="font-medium">Availability:</span>{" "}
            {template.availability.isPublic ? "Public" : "Private"}
          </p>
          <div>
            <span className="font-medium">Allowed Plans:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {template.availability.allowedPlans.map((plan) => (
                <Badge key={plan} variant="secondary">
                  {plan}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="font-medium">Tags:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleUseTemplate}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        Use This Template
      </Button>
    </div>
  );
}
