import { Suspense } from "react";
import { PageHeader } from "./components/page-header";
import { TemplateGrid } from "./components/templateGrid";
import { templateRegistry } from "@/lib/templates/registry";
import { auth } from "@/app/auth";

async function fetchTemplates(plan: string, userType: string) {
  const templates = templateRegistry.getAvailableTemplates(
    plan as "free" | "creator" | "business",
    userType as "regular" | "creator" | "business"
  );
  return templates;
}

export default async function SelectTemplatePage() {
  const session = await auth();
  const userId = session?.user?.id;

  const templates = await fetchTemplates("free", "regular"); // Fetch templates

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 py-8 md:py-16">
        <PageHeader />
        <Suspense fallback={<TemplateGridSkeleton />}>
          <TemplateGrid templates={templates} userId={userId || ""} />
        </Suspense>
      </div>
    </main>
  );
}

function TemplateGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mt-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[3/5] rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse"
        />
      ))}
    </div>
  );
}
