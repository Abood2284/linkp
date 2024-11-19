"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "../form-providers";
import { NICHES, getNicheConfig } from "../constants";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { NicheType } from "@repo/db/schema";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function NichePage() {
  const router = useRouter();
  const { data, updateData } = useForm();

  // If no userType is selected, show error
  if (!data.userType) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            Please select your user type first.
          </AlertDescription>
        </Alert>
        <Link
          href="/onboarding/identity"
          className="flex items-center text-sm text-coffee-600 hover:text-coffee-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back to select user type
        </Link>
      </div>
    );
  }

  const relevantNiches = NICHES[data.userType] || [];

  const handleSelect = (niche: NicheType) => {
    updateData("niche", niche);
    router.push("/onboarding/profile");
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-coffee-800">
          Select Your Niche
        </h1>
        <p className="mt-2 text-coffee-600">
          This helps us customize your experience and connect you with the right
          audience
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        {relevantNiches.map((niche) => (
          <motion.button
            key={niche.id}
            variants={item}
            onClick={() => handleSelect(niche.id)}
            className={`group relative overflow-hidden rounded-xl border bg-white p-6 text-center shadow-sm transition-all hover:shadow-md ${
              data.niche === niche.id
                ? "border-coffee-500 ring-2 ring-coffee-500 ring-offset-2"
                : "border-coffee-100 hover:border-coffee-200"
            }`}
          >
            <motion.div
              initial={false}
              animate={{ opacity: data.niche === niche.id ? 1 : 0 }}
              className="absolute inset-0 bg-coffee-50"
            />
            <div className="relative space-y-2">
              <div className="text-3xl">{niche.icon}</div>
              <h3 className="font-medium text-coffee-800">{niche.name}</h3>
              <p className="text-xs text-coffee-600">{niche.description}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
