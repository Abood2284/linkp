// apps/linkp-website/app/(authenticated)/onboarding/select-template/page.tsx
import { Suspense } from "react";
// import { TemplateFilters } from "./components/templateFilters";
import { TemplateGrid } from "./components/templateGrid";
import { auth } from "@/app/auth";

export default async function SelectTemplatePage() {
  // Fetch session in the server component
  const session = await auth();

  return (
    <div className="mx-auto px-4 py-8 mt-12 flex  text-center items-center">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Choose Your Template
        </h1>
        <p className="text-muted-foreground mb-8">
          Select a template that best represents your style. You can preview
          each template before making your choice.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Filters Section */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div>Loading...</div>}>
              {/* <Suspense fallback={<FiltersSkeleton />}> */}
              {/* <TemplateFilters /> */}
            </Suspense>
          </div>

          {/* Templates Grid */}
          <div className="lg:col-span-9 ">
            <Suspense fallback={<div>Loading...</div>}>
              {/* <Suspense fallback={<TemplateGridSkeleton />}> */}
              <TemplateGrid userId={session?.user?.id!} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
