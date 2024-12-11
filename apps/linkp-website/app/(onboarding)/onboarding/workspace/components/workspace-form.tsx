// components/onboarding/workspace-form.tsx
"use server";

import { createWorkspaceAction } from "@/app/actions/workspace";
import { Button } from "@/components/ui/button";

export default function WorkspaceForm() {
  return (
    <div className="mt-[12%] w-[25%] mx-auto">
      <form action={createWorkspaceAction}>
        {/* Rest of your existing form JSX */}
        <Button type="submit">Create workspace</Button>
      </form>
    </div>
  );
}
