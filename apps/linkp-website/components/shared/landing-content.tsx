// apps/linkp-website/components/shared/landing-content.tsx 
import Link from "next/link";
import { ArrowRight, Star, Users, Zap } from "lucide-react";
import { Button } from "../ui/button";

export default async function Home() {
  return (
    <main className="flex-grow">
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[50%] top-0 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-radial from-coffee-50/50 to-transparent" />
        </div>

        {/* Hero content */}
        <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-coffee-200 bg-white px-4 py-1.5 text-sm">
              <span className="mr-2 rounded-full bg-coffee-500 px-2 py-0.5 text-xs font-semibold text-white">
                New
              </span>
              <span className="text-coffee-600">
                Introducing LinkBrew for Creators
              </span>
              <ArrowRight className="ml-2 h-4 w-4 text-coffee-500" />
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Ultimate <span className="text-coffee-600">Link-in-Bio</span>
              <br />
              Solution
            </h1>

            <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600">
              Create a stunning bio link page that helps you share everything
              you create, curate and sell. All in one place, fully customizable.
            </p>

            <div className="flex justify-center space-x-4">
              <Link href="/authentication?signup=true">
                <Button className="bg-coffee-600 hover:bg-coffee-700">
                  Get started for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button>View pricing</Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Star className="mr-1 h-5 w-5 text-yellow-400" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-1 h-5 w-5 text-coffee-500" />
                <span>10k+ creators</span>
              </div>
              <div className="flex items-center">
                <Zap className="mr-1 h-5 w-5 text-coffee-500" />
                <span>Lightning fast setup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
