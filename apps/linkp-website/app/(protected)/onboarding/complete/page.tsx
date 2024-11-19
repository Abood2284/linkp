// app/(protected)/onboarding/complete/page.tsx
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "../form-providers";
import { OnboardingData } from "@repo/db/schema";
import { auth } from "@/app/auth";
import { NextApiResponse } from "next";
import Loading from "@/components/ui/loading";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.8, bounce: 0 },
      opacity: { duration: 0.01 },
    },
  },
};

export default function CompletePage() {
  const router = useRouter();
  const { data } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserHandle = (data: OnboardingData) => {
    if (!data.profile?.username) return "";
    /*
  ? Not sure if we want to have routes with username in lowercase and hyphenated
  ? For now, we'll just return the username as is, making these 2 routes shown as unique
  - localhost:3000/Aboodie
  - localhost:3000/aboodie
  ? If we lowercase all the handles, then we are limiting options of having unique routes, and we might have to add a number at the end of the username to make it unique. making it less of attractive for users
    */

    return data.profile.username;
    // return data.profile.username.toLowerCase().replace(/\s+/g, "-");
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //     } catch (err) {
  //       console.log("Error saving onboarding data:", err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const handleFinish = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const session = await auth();
      console.log("session", session);
      if (!session) return;
      console.log("Making the api request");
      // Making a request to the API
      const response = await fetch("/api/v1/onboarding/save-onboardingdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify({
          onboardingData: data,
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save onboarding data");
      }

      const result: NextApiResponse = await response.json();

      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    const username = getUserHandle(data);
    if (username) window.open(`/${username}`, "_blank");
  };

  if (isLoading) return <Loading text="Loading..." />;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center space-y-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="rounded-full bg-coffee-100 p-6"
      >
        <PartyPopper className="h-12 w-12 text-coffee-600" strokeWidth={1.5} />
      </motion.div>
      <div>
        <h1 className="text-2xl font-bold text-coffee-800">
          You&apos;re All Set!
        </h1>
        <p className="mt-2 text-coffee-600">
          Your stunning link-in-bio page is ready to go
        </p>
      </div>
      <div className="w-full max-w-sm space-y-4">
        <Button
          onClick={handleFinish}
          disabled={isSubmitting}
          className="w-full bg-coffee-600 text-white hover:bg-coffee-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Go to Dashboard"}
        </Button>
        <Button
          variant="outline"
          className="w-full border-coffee-200 text-coffee-600 hover:bg-coffee-50"
          onClick={handlePreview}
          disabled={isSubmitting || !data.profile?.username}
        >
          Preview Page
        </Button>
      </div>
      {data.profile?.username && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-coffee-500"
        >
          Your unique URL:{" "}
          <span className="font-medium">linkp.co/{getUserHandle(data)}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
