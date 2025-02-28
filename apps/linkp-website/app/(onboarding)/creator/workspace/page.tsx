// onboarding/workspace/page.tsx
import { Metadata } from "next";
import { preloadModule } from "react-dom";
import WorkspaceForm from "./components/workspace-form";

export const metadata: Metadata = {
  title: "Create Your Workspace - Linkp",
  description: "Set up your personalized workspace on Linkp",
};

// Preload the template selection page
preloadModule("/creator/select-template/page");

export default function WorkspacePage() {
  return <WorkspaceForm />;
}
