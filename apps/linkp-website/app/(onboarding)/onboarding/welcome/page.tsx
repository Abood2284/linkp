import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function WelcomePage() {
    return (
        <div
            className="relative mx-auto mt-24 flex max-w-sm flex-col items-center px-3 text-center md:mt-32 md:px-8 lg:mt-48">
            <div
                className="animate-slide-up-fade relative flex w-auto items-center justify-center px-6 py-2 [--offset:20px] [animation-duration:1.3s] [animation-fill-mode:both]">
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="animate-pulse-scale absolute inset-0 rounded-full mix-blend-color-burn "></div>
                    <div
                        className="animate- ̰pulse-scale absolute inset-0 rounded-full mix-blend-color-burn"></div>
                    <div
                        className="animate-pulse-scale absolute inset-0 rounded-full mix-blend-color-burn"></div>
                </div>
                <h1 className="font-heading text-2xl">
                    LINKP
                </h1>
            </div>
            <div className="flex gap-4 flex-col mt-4">
                <h4>Welcome to Linkp</h4>
                <p className="font-sub-heading text-gray-500">
                    Linkp gives you marketing superpowers with short links that stand out.
                </p>
            <Button>
                <Link href="/onboarding/workspace">
                Get Started
                </Link>
            </Button>
            </div>
        </div>
    )
}