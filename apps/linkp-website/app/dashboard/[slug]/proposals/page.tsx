import { Suspense } from "react";
import { redirect } from "next/navigation";
import ProposalsContent from "./proposals-content";

export default async function ProposalsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
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
