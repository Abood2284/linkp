// apps/linkp-website/app/dashboard/[slug]/proposals/page.tsx
import { Suspense } from "react";
import ProposalsContent from "./proposals-content";

type ProposalPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProposalsPage(props: ProposalPageProps) {
  const { slug } = await props.params;
  return (
    <main className="flex-1 overflow-auto">
      <div className="container py-6">
        <Suspense fallback={<div>Loading proposals...</div>}>
          <ProposalsContent slug={slug} />
        </Suspense>
      </div>
    </main>
  );
}
