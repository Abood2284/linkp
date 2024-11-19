"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm } from "../form-providers";
import { useOnboardingConfig } from "../hooks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import Image from "next/image";
import { UserType } from "@repo/db/schema";

// Define the template interface first
interface Template {
  id: "minimal" | "professional" | "creative" | "portfolio";
  name: string;
  description: string;
  preview: string;
  recommended: ReadonlyArray<UserType>;
  popular?: boolean;
}

// Then use the interface for the templates array
const templates: readonly Template[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design focusing on your content",
    preview: "/templates/minimal.png",
    recommended: ["influencer", "creator"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Perfect for businesses and personal branding",
    preview: "/templates/professional.png",
    recommended: ["business", "entrepreneur"],
    popular: true,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Stand out with unique animations and layouts",
    preview: "/templates/creative.png",
    recommended: ["creator", "influencer"],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Showcase your work with style",
    preview: "/templates/portfolio.png",
    recommended: ["creator", "entrepreneur"],
  },
] as const;

type TemplateId = Template["id"];

// Rest of your animations constants remain the same
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function TemplatePage() {
  const router = useRouter();
  const { data, updateData } = useForm();
  const { isStepValid, userTypeConfig } = useOnboardingConfig();

  if (!isStepValid("template")) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>Please select a plan first.</AlertDescription>
        </Alert>
        <Link
          href="/onboarding/plan"
          className="flex items-center text-sm text-coffee-600 hover:text-coffee-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back to select a plan
        </Link>
      </div>
    );
  }

  const handleSelect = (template: TemplateId) => {
    updateData("template", template);
    router.push("/onboarding/social");
  };

  const userType = data.userType;
  const sortedTemplates = [...templates].sort((a, b) => {
    if (!userType) return 0;
    const aRecommended = a.recommended.includes(userType);
    const bRecommended = b.recommended.includes(userType);
    if (aRecommended && !bRecommended) return -1;
    if (!aRecommended && bRecommended) return 1;
    return 0;
  });

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-coffee-800">
          Choose Your Template
        </h1>
        <p className="mt-2 text-coffee-600">
          Select a design that matches your style
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2"
      >
        {sortedTemplates.map((template) => (
          <motion.button
            key={template.id}
            variants={item}
            onClick={() => handleSelect(template.id)}
            className={`group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md ${
              data.template === template.id
                ? "border-coffee-500 ring-2 ring-coffee-500 ring-offset-2"
                : "border-coffee-100 hover:border-coffee-200"
            }`}
          >
            {template.popular && (
              <div className="absolute top-4 right-4 rounded-full bg-coffee-500 px-3 py-1 text-xs font-medium text-white">
                Popular
              </div>
            )}
            {userType && template.recommended.includes(userType) && (
              <div className="absolute top-4 left-4 rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                Recommended
              </div>
            )}
            <div className="aspect-[16/9] w-full overflow-hidden">
              <Image
                src={template.preview}
                alt={template.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-coffee-800">{template.name}</h3>
              <p className="mt-1 text-sm text-coffee-600">
                {template.description}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
