import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function WelcomePage() {
  return (
    <div className="relative mx-auto mt-24 flex max-w-sm flex-col items-center px-3 text-center md:mt-32 md:px-8 lg:mt-48">
      <div className="flex gap-4 flex-col mt-4">
        <h4>Welcome to Linkp</h4>
        <p className="font-sub-heading text-gray-500">
          Linkp gives you marketing superpowers with short links that stand out.
        </p>
        <Link href="/onboarding/workspace" className="w-full">
          <Button className="w-full">Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
