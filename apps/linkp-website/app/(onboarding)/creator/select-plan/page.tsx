// ! Currently Not Integrated in the Onboarding Flow

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check } from "lucide-react";
``;
import { RadioGroupForm } from "./components/select-plan";

export default function selectPlanPage() {
  return (
    <div className="bg-creme-100 relative h-dvh">
      <div className="flex py-12 md:py-0 flex-col gap-8 h-screen items-center justify-start md:justify-center">
        <div className="bg-coffee-200 px-2 py-1 rounded-full">
          <h1 className="font-heading text-coffee-900">Select Plan</h1>
        </div>
        <RadioGroupForm />
      </div>
    </div>
  );
}
